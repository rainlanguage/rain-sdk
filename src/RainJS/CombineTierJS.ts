import { BigNumber, Signer } from 'ethers';
import { StateConfig } from '../classes/vm';
import { ApplyOpFn, RainJS, StateJS } from './RainJS';
import {
  CombineTierContext,
  CombineTierStorage,
} from '../contracts/tiers/combineTier';

/**
 * @public - The javascript version of CombineTierVM which inherits RainJS with local CombineTier opcodes.
 * @see CombineTier.sol in contracts
 *
 */
export class CombineTierJS extends RainJS {
  /**
   * Constructor of CombineTierJS to create a instance of this class with CombineTier's local opcodes.
   * @see RainJS
   *
   * @param state - A regular StateConfig
   * @param options - (optional) additional arguments for instantiating this class
   * (a Signer, a CombineTier Contract and custom opcode functions)
   *
   */
  constructor(
    state: StateConfig,
    options?: {
      signer?: Signer,
      contract?: string,
      applyOpFn?: ApplyOpFn,
      storageOpFn?: ApplyOpFn, // for overriding the CombineTierJS's STORAGE opcode function
      contextOpFn?: ApplyOpFn // for overriding the CombineTierJS's CONTEXT opcode function
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
    for (let i = 0; i < CombineTierStorage.length; i++) {
      if (options?.storageOpFn && options.storageOpFn[i]) {
        this._STORAGE_[i] = options.storageOpFn[i];
      }
    }
    for (let i = 0; i < CombineTierContext.length; i++) {
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
    [CombineTierContext.Account]: async (
      state: StateJS,
      operand: number,
      data?: any
    ) => {
      if (data && data.context !== undefined) {
        state.stack.push(
          BigNumber.from(data.context[CombineTierContext.Account])
        );
      } else throw new Error('Undefined buy units');
    },
  };

  /**
   * key/value pair of STORAGE opcodes of the CombineTier JSVM (empty with no functions)
   * @remarks CombineTier doesnt have any STORAGE opcode by default and in its contract level,
   * however in JSVM there is the ability to pass in custom opcode functions to it
   */
  protected _STORAGE_: ApplyOpFn = {};
}
