import { FnPtrs, StateJSVM } from './types';
import { StateConfig } from '../classes/vm';
import { BigNumber, Contract, Signer } from 'ethers';
import { arrayify, mapToRecord, paddedUInt256 } from '../utils';
import { IOpMeta, OpMeta } from '../vm/OpMeta';


/**
 * @public
 * Options for instantiating RainJSVM
 */
export type CallOptions = {
	signer?: Signer;
	contract?: string | Contract;
	applyOpFn?: FnPtrs;
	storageOpFn?: FnPtrs;
	opMeta?:  Map<number, IOpMeta>;
}

/**
 * @public - The javascript version of the RainVM, basically does the same job RainVM does
 * but off-chain.
 * @see RainVM in RainVM.sol
 *
 */
export class RainJSVM {

	/**
	 * The result state of the executed Rainjs.
	 */
	public readonly lastState: BigNumber[] = [];

	/**
	 * The property of type StateJSVM which that RainJSVM will run based on.
	 */
	private readonly state: StateJSVM;

	/**
	 * It is a property for overriding the opcodes. Need to ba passed at the time of construction
	 * because the RainJSVM opcode functions should not change after an instance has be created.
	 */
	public readonly applyOpFn?: FnPtrs;

	/**
	 * An ethers Signer.
	 */
	public signer?: Signer;

	/**
	 * The contract address of the instance of this class used for THIS_ADDRESS opcode
	 */
	public self?: string;

	/**
	 * Object that contains the STORAGE opcode functions (i.e. local opcodes)
	 */
	protected readonly StorageOps?: FnPtrs;

	/**
	 * Range of available storage variables accessible by eval
	 */
	protected readonly StorageRange: number = 0;

	/**
	 * Length of the valid context argument accessible by eval
	 */
	protected readonly ContextRange?: number;

	/**
	 * The constructor of RainJSVM which initiates the RainJSVM and also a StateJSVM for a RainVM script.
	 *
	 * @param state - A regular StateConfig used to new a StateJSVM object to be used in RainJSVM.
	 * @param options - (optional) used for initiating the optional properties (signer, provider, contract and applyOpFn)
	 */
	constructor(state: StateConfig, options?: CallOptions) {

		let _opmeta = OpMeta;
		if(options?.opMeta) {
			_opmeta = options.opMeta;
		}
		this.fnPtrs = mapToRecord(_opmeta, ["jsvmfn"]);

		const stack: BigNumber[] = [];
		const argumentsStack: BigNumber[] = [];
		const constants: BigNumber[] = [];
		const sources: Uint8Array[] = [];

		for (let i = 0; i < state.constants.length; i++) {
			constants.push(BigNumber.from(state.constants[i]));
		}
		for (let i = 0; i < state.sources.length; i++) {
			sources.push(arrayify(state.sources[i], { allowMissingPrefix: true }));
		}

		this.state = {
			stack,
			argumentsStack,
			constants,
			sources,
		};
		this.applyOpFn = options?.applyOpFn;
		this.signer = options?.signer;

		if (options?.contract instanceof Contract) {
			this.self = options.contract.address;
		}
		if (typeof options?.contract === "string") {
			this.self = options.contract;
		}

		if (options?.storageOpFn) {
			this.StorageOps = options.storageOpFn;
			this.StorageRange = Object.keys(options.storageOpFn).length;
		}

	}
	static opsFromOpMeta(_opmeta: Map<number, import("../vm/OpMeta").IOpMeta>): FnPtrs {
		throw new Error('Method not implemented.');
	}

	/**
	 * key/value pair of opcodes and their functions for all standard opcodes
	 */
	protected readonly fnPtrs: FnPtrs;

	/**
	 * The main workhorse of RainJSVM, basically the javascript version of 'eval' method in RainVM.sol.
	 * It executes the RainVM script based on each Opcode or the custom opcodes i.e. applyOpFn that
	 * has been passed at the time of cinstruction of a RainJSVM object.
	 * @see eval method in RainVM.sol
	 *
	 * @param data - (optional) An object which is used to provide additional values for "applyOpFn" if there
	 * are custom opcodes passed at the time of construction ot to pass in some user input value to the script.
	 * @param entrypoint - used internally for indicating which item in state sources array to execute. the entrypoint to sources.
	 *
	 */
	private async eval(data?: any, entrypoint?: number): Promise<void> {

		const _entrypoint = entrypoint ? entrypoint : 0;

		for (let i = 0; i < this.state.sources[_entrypoint].length; i++) {

			if (this.applyOpFn !== undefined) {

				if (
					Object.keys(this.applyOpFn).includes(
					this.state.sources[_entrypoint][i].toString()
				)
				) {
					await this.applyOpFn[this.state.sources[_entrypoint][i]].call(
						this,
						this.state,
						this.state.sources[_entrypoint][i + 1],
						data
					);
				} 
				else {
					await this.dispatch(
						this.state,
						this.state.sources[_entrypoint][i],
						this.state.sources[_entrypoint][i + 1],
						data
					);
				}
			} 
			else {
				await this.dispatch(
					this.state,
					this.state.sources[_entrypoint][i],
					this.state.sources[_entrypoint][i + 1],
					data
				);
			}
			i++;
		}
	}

	/**
	 * It is a protected method used by eval to run the correct function for each opcode in the script.
	 * For each opcode please @see AllStandardOps
	 *
	 * @param state - StateJSVM property used in each opcode function to either read or write data into stack.
	 * @param opcode - the opcode to dispatch and run the function of that opcode
	 * @param operand - the addtional info for each opcode to run based on.
	 * @param data - (optional) used only for zipmap opcode in order to be able to run custom function i.e. applyOpFn
	 * for zipmap function source.
	 *
	 */
	private async dispatch(state: StateJSVM, opcode: number, operand: number, data?: any): Promise<void> {

		await this.fnPtrs[opcode].call(this, state, operand, data);

	}

	/**
	 * Method to execute the RainJSVM.
	 *
	 * @param data - (optional) Used as additional info for some local opcodes
	 * or custom opcode functions i.e. applyOpFn.
	 * @param entrypoint - the index of sources to start eval
	 *
	 * @returns - An array represting the final state of the RainJSVM stack.
	 */
	public async run(data?: any, entrypoint?: number): Promise<BigNumber[]> {
		
		this.lastState.splice(-this.lastState.length);
		await this.eval(data, entrypoint);
		this.lastState.push(...this.state.stack.splice(-this.state.stack.length));

		return this.lastState;
  	}

	/**
	 * @public
	 */
	private _constant(operand: number, data?: any): void {

		if (operand < this.state.constants.length) {

			if (this.state.constants[operand] !== undefined) {
	
				this.state.stack.push(this.state.constants[operand]);
			} 
			else throw new Error('out-of-bound constants');
		}
		else if (this.state.argumentsStack[operand - this.state.constants.length] !== undefined) {
	
			this.state.stack.push(
				this.state.argumentsStack[operand - this.state.constants.length]
			);
		}
		else throw new Error('out-of-bound arguments');
	}

	/**
	 * @public
	 */
	private _stack(operand: number, data?: any): void {

		this.state.stack.push(this.state.stack[operand]);
	}

	/**
	 * @public
	 */
	private _context(operand: number, data?: any): void {

		if (data?.context && data.context[operand] !== undefined) {

			if (this.ContextRange) {
	
				if (operand < this.ContextRange) {
	
					this.state.stack.push(
						BigNumber.from(data.context[operand])
					)
				} 
				else throw new Error("out-of-bounds context")
			} 
			else {
				this.state.stack.push(
					BigNumber.from(data.context[operand])
				)
			}
		}
		else throw new Error('Undefined context')
	}

	/**
	 * @public
	 */
	private async _storage(operand: number, data?: any): Promise<void> {

		if (this.StorageRange > 0 && operand < this.StorageRange) {

			if (this.StorageOps) {
	
				if (this.StorageOps[operand]) {
	
					await this.StorageOps[operand](this.state, operand, data);
				}
				else throw new Error("no or out-of-bound storage opcode")
			} 
			else throw new Error("undefined storage");
		}
		else throw new Error("no or out-of-bound storage opcode");
	}

	/**
	 * @public
	 */
	private _debug(operand: number, data?: any): void {

		if (operand < 4) {
			console.log(this.state.stack);
		} 
		else throw new Error('out-of-bound debug operand');
	}

	/**
	 * @public
	 */
	private async _zipmap(operand: number, data?: any): Promise<void> {

		const _entrypoint = operand & 7;
		const numberOfVals_ = (operand & 224) >> 5;
		const a_ = (operand & 24) >> 3;
		const valSize_ = a_ === 3 ? 8 : a_ === 2 ? 16 : a_ === 1 ? 32 : 64;
		const loopSize_ = 64 / valSize_;
		const items_ = this.state.stack.splice(-(numberOfVals_ + 1));
		let _startIndex = 64 - valSize_;
		let _endIndex = 64;
		
		if (items_.length === numberOfVals_ + 1) {

			for (let i = 0; i < loopSize_; i++) {

				this.state.argumentsStack.splice(-(numberOfVals_ + 1));

				for (let j = 0; j < items_.length; j++) {

					this.state.argumentsStack.push(
						BigNumber.from(
							'0x' +
							paddedUInt256(items_[j])
							.substring(2)
							.slice(_startIndex, _endIndex)
						)
					);
				}

				for (let i = 0; i < this.state.sources[_entrypoint].length; i++) {

					if (this.applyOpFn !== undefined) {

						if (
							Object.keys(this.applyOpFn).includes(
							this.state.sources[_entrypoint][i].toString()
							)
						) {
							this.applyOpFn[this.state.sources[_entrypoint][i]].call(
								this,
								this.state,
								this.state.sources[_entrypoint][i + 1],
								data
							);
						} 
						else {
							await this.dispatch(
								this.state,
								this.state.sources[_entrypoint][i],
								this.state.sources[_entrypoint][i + 1],
								data
							);
						}
					} 
					else {
						await this.dispatch(
							this.state,
							this.state.sources[_entrypoint][i],
							this.state.sources[_entrypoint][i + 1],
							data
						);
					}
					i++;
				}
				_startIndex -= valSize_;
				_endIndex -= valSize_;
			}
		} 
		else throw new Error('Undefined stack variables');

	}

	/**
	 * @public
	 */
	public get constant() {
		return this._constant
	}

	/**
	 * @public
	 */
	public get stack() {
		return this._stack
	}

	/**
	 * @public
	 */
	public get context() {
		return this._context
	}

	/**
	 * @public
	 */
	public get storage() {
		return this._storage
	}	

	/**
	 *
	 */
	public get debug() {
		return this._debug
	}

	/**
	 * 
	 */
	public get zipmap() {
		return this._zipmap
	}

	/**
	 * @public
	 */
	public connect(signer: Signer): this {
		this.signer = signer;
		return this;
	}

	/**
	 * @public 
	 */
	public setContract(contract: string | Contract): this {
		if (contract instanceof Contract) {
			this.self = contract.address;
		}
		else this.self = contract;

		return this;
	}

}

