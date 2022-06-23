import { BigNumber, Signer } from "ethers";
import { StateConfig } from "../classes/vm";
import { ApplyOpFn, RainJS, StateJS } from "./RainJS";
import { 
  EmissionsERC20Context,
  EmissionsERC20Storage,
} from '../contracts/emissionsERC20';

/**
 * @public - The javascript version of EmissionsERC20JS which inherits RainJS with local EmissionsERC20JS opcodes.
 * @see EmissionsERC20.sol in contracts
 *
 */
export class EmissionsERC20JS extends RainJS {
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
      storageOpFn?: ApplyOpFn, // for overriding the EmissionsERC20's STORAGE opcode function
      contextOpFn?: ApplyOpFn // for overriding the EmissionsERC20's CONTEXT opcode function
    }
  ) {
    super(
      state,
      {
        signer: options?.signer,
        contract: options?.contract,
        applyOpFn: options?.applyOpFn,
      }
    );

    // assigning custom functions to the STORAGE/CONTEXT functions
    // custom functions should be passed at the time construction
    for (let i = 0; i < EmissionsERC20Storage.length; i++) {
      if (options?.storageOpFn && options.storageOpFn[i]) {
        this._STORAGE_[i] = options.storageOpFn[i];
      }
    }
    for (let i = 0; i < EmissionsERC20Context.length; i++) {
      if (options?.contextOpFn && options.contextOpFn[i]) {
        this._CONTEXT_[i] = options.contextOpFn[i];
      }
    }
  }

  /**
   * key/value pair of CONTEXT opcodes of the CombineTier JSVM
   * the required value need to be passed to "run" method as the context array in "data" object.
   * the reason is the CONTEXT opcode is contextual and is passed the VM at runtime.
   */
  protected _CONTEXT_: ApplyOpFn = {
    [EmissionsERC20Context.ClaimantAccount]: async (
      state: StateJS,
      operand: number,
      data?: any
    ) => {
      if (data && data.context !== undefined) {
        state.stack.push(
          BigNumber.from(data.context[EmissionsERC20Context.ClaimantAccount])
        );
      } else throw new Error('Undefined buy units');
    },
  };

  /**
   * key/value pair of STORAGE opcodes of the EmissionsERC20 JSVM (empty with no functions)
   * @remarks EmissionsERC20 doesnt have any STORAGE opcode by default and in its contract level,
   * however in JSVM there is the ability to pass in custom opcode functions to it
   */
  protected _STORAGE_: ApplyOpFn = {};
}
