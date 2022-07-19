import { StateConfig } from '../classes/vm';
import { CallOptions, RainJSVM } from './RainJSVM';
import { CombineTierStorage } from '../contracts/tiers/combineTier';


/**
 * @public - The javascript version of CombineTierVM which inherits RainJS with local CombineTier opcodes.
 * @see CombineTier.sol in contracts
 *
 */
export class CombineTierJSVM extends RainJSVM {

	/**
	 * CombineTierJSVM can have any length for context
	 */
	protected readonly ContextLength = NaN;

	/**
	 * CombineTierJSVM valid storage range
	 */
	protected readonly StorageRange = CombineTierStorage.length;

	/**
	 * Constructor of CombineTierJSVM to create a instance of this class with CombineTier's local opcodes.
	 * @see RainJS
	 *
	 * @param state - A regular StateConfig
	 * @param options - (optional) additional arguments for instantiating this class
	 * (a Signer, a CombineTier Contract and custom opcode functions)
	 *
	 */
	constructor(state: StateConfig, options: CallOptions) {

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
	}

}
