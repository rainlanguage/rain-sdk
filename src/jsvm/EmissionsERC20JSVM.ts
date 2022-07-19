import { StateConfig } from "../classes/vm";
import { CallOptions, RainJSVM } from "./RainJSVM";
import { EmissionsERC20Context, EmissionsERC20Storage } from "../contracts/emissionsERC20";

/**
 * @public - The javascript version of EmissionsERC20JSVM which inherits RainJSVM with local EmissionsERC20JSVM opcodes.
 * @see EmissionsERC20.sol in contracts
 *
 */
export class EmissionsERC20JSVM extends RainJSVM {

	/**
	 * EmissionsERC20JSVM valid storage range
	 */
	protected readonly StorageRange = EmissionsERC20Storage.length;

	/**
	 * EmissionsERC20JSVM valid context length
	 */
	protected readonly ContextLength = EmissionsERC20Context.length;

	/**
	 * Constructor of SaleJS to create a instance of this class with EmissionsERC20's local opcodes.
	 * @see RainJSVM
	 *
	 * @param state - A regular StateConfig
	 * @param options - (optional) additional arguments for instantiating this class
	 * (a Signer, a EmissionsERC20JSVM Contract and custom opcode functions)
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
				storageOpFn: options?.storageOpFn
			}
		);
	}

}
