import { BigNumber } from "ethers";
import { StateConfig } from "../classes/vm";
import { CallOptions, RainJSVM } from "./RainJSVM";
import { ERC20 } from "../contracts/generics/erc20";
import { Sale, SaleContext, SaleStorage } from "../contracts/sale";
import { FnPtrs, StateJSVM } from "./types";


/**
 * @public - The javascript version of SaleVM which inherits RainJS with local Sale opcodes.
 * @see Sale.sol in contracts
 * 
 */
export class SaleJSVM extends RainJSVM {

	/**
	 * SaleJSVM valid storage range
	 */
	protected readonly StorageRange = SaleStorage.length;

	/**
	 * SaleJSVM valid context length
	 */
	protected readonly ContextRange = SaleContext.length;

	/**
	 * Constructor of SaleJSVM to create a instance of this class with Sale's local opcodes.
	 * @see RainJS
	 * 
	 * @param state - A regular StateConfig
	 * @param options - (optional) additional arguments for instantiating this class 
	 * (a Signer, a Sale Contract and custom opcode functions, custom STORAGE/CONTEXT opcode functions)
	 * 
	 */
	constructor(state: StateConfig, options?: CallOptions) {
		super(
			state,
			{
				opMeta: options?.opMeta,
				signer: options?.signer,
				contract: options?.contract,
				applyOpFn: options?.applyOpFn,
				storageOpFn: options?.storageOpFn,
			}
		);

		// assigning custom functions to the STORAGE/CONTEXT functions
		// custom functions should be passed at the time construction
		if (options?.storageOpFn) {
			this.StorageOps = options.storageOpFn;
		}
  	};

	/**
	 * key/value pair of STORAGE opcodes of the sale JSVM
	 */
  	protected readonly StorageOps: FnPtrs = {
    
		[SaleStorage.RemainingUnits] : async(state: StateJSVM, operand: number, data?: any) => {

			if (this.signer && this.self !== undefined) {

				const salecontract_ = new Sale(this.self, this.signer);
				const rTKNAddress_ = await salecontract_.token();
				const rTKNContract_ = new ERC20(
					rTKNAddress_,
					this.signer
				);
				state.stack.push(
					BigNumber.from(
						await rTKNContract_.balanceOf(this.self)
					)
				)
			}
			else throw new Error("Undefined Signer or Sale Contract")

		},

		[SaleStorage.TotalReserveIn] : async(state: StateJSVM, operand: number, data?: any) => {

			if (this.signer && this.self !== undefined) {

				const salecontract_ = new Sale(this.self, this.signer);
				const reserveAddress_ = await salecontract_.reserve();
				const reserveContract_ = new ERC20(
					reserveAddress_,
					this.signer
				);
				state.stack.push(
					BigNumber.from(
						await reserveContract_.balanceOf(this.self)
					)
				)
			}
			else throw new Error("Undefined Signer or Sale Contract")
		},

		[SaleStorage.TokenAddress] : async(state: StateJSVM, operand: number, data?: any) => {

			if (this.signer && this.self !== undefined) {

				const salecontract_ = new Sale(this.self, this.signer);
				state.stack.push(
					BigNumber.from(
						await salecontract_.token()
					)
				)
			}
			else throw new Error("Undefined Signer or Sale Contract")
		},

		[SaleStorage.ReserveAddress] : async(state: StateJSVM, operand: number, data?: any) => {

			if (this.signer && this.self !== undefined) {

				const salecontract_ = new Sale(this.self, this.signer);
				state.stack.push(
					BigNumber.from(
						await salecontract_.reserve()
					)
				)
			}
			else throw new Error("Undefined Signer or Sale Contract")
		},
	};

}