import { Signer } from 'ethers';
import { StateConfig } from '../classes/vm';
import { ApplyOpFn, RainJS } from './RainJS';
import { CombineTierStorage } from '../contracts/tiers/combineTier';

/**
 * @public - The javascript version of CombineTierVM which inherits RainJS with local CombineTier opcodes.
 * @see CombineTier.sol in contracts
 *
 */
export class CombineTierJS extends RainJS {

  /**
   * CombineTierJS can have any length for context
   */
  protected readonly ContextLength = NaN;

  /**
   * CombineTierJS valid storage range
   */
  protected readonly StorageRange = CombineTierStorage.length;

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
      contextLength?: number,
      storageOpFn?: ApplyOpFn, // for overriding the CombineTierJS's STORAGE opcode function
    }
  ) {
    super(
      state,
      {
        signer: options?.signer,
        contract: options?.contract,
        applyOpFn: options?.applyOpFn,
        contextLength: options?.contextLength, 
      }
    );

    // assigning custom functions to the STORAGE/CONTEXT functions
    // custom functions should be passed at the time construction
    if (options?.storageOpFn) {
      this._STORAGE_ = options.storageOpFn;
    }
  }

  /**
   * key/value pair of STORAGE opcodes of the CombineTier JSVM (empty with no functions)
   * @remarks CombineTier doesnt have any STORAGE opcode by default and in its contract level,
   * however in JSVM there is the ability to pass in custom opcode functions to it
   */
  protected _STORAGE_: ApplyOpFn = {};
}
