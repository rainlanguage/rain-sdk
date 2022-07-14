import { Signer } from "ethers";
import { StateConfig } from "../classes/vm";
import { ApplyOpFn, RainJS } from "./RainJS";
import { EmissionsERC20Context, EmissionsERC20Storage } from "../contracts/emissionsERC20";

/**
 * @public - The javascript version of EmissionsERC20JS which inherits RainJS with local EmissionsERC20JS opcodes.
 * @see EmissionsERC20.sol in contracts
 *
 */
export class EmissionsERC20JS extends RainJS {

  /**
   * EmissionsERC20JS valid storage range
   */
  protected readonly StorageRange = EmissionsERC20Storage.length;

  /**
   * EmissionsERC20JS valid context length
   */
  protected readonly ContextLength = EmissionsERC20Context.length;

  /**
   * Constructor of SaleJS to create a instance of this class with EmissionsERC20's local opcodes.
   * @see RainJS
   *
   * @param state - A regular StateConfig
   * @param options - (optional) additional arguments for instantiating this class
   * (a Signer, a EmissionsERC20JS Contract and custom opcode functions)
   *
   */
  constructor(
    state: StateConfig,
    options?: {
      signer?: Signer,
      contract?: string,
      applyOpFn?: ApplyOpFn,
      storageRange?: number;
      storageOpFn?: ApplyOpFn, // for overriding the EmissionsERC20's STORAGE opcode function
    }
  ) {
    super(
      state,
      {
        signer: options?.signer,
        contract: options?.contract,
        applyOpFn: options?.applyOpFn
      }
    );

    // assigning custom functions to the STORAGE/CONTEXT functions
    // custom functions should be passed at the time construction
    if (options?.storageOpFn) {
      this._STORAGE_ = options.storageOpFn;
    }
  }

  /**
   * key/value pair of STORAGE opcodes of the EmissionsERC20 JSVM (empty with no functions)
   * @remarks EmissionsERC20 doesnt have any STORAGE opcode by default and in its contract level,
   * however in JSVM there is the ability to pass in custom opcode functions to it
   */
  protected _STORAGE_: ApplyOpFn = {};
}
