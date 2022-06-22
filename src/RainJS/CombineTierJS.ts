import { BigNumber, Signer } from "ethers";
import { StateConfig } from "../classes/vm";
import { CombineTier } from "../contracts/tiers/combineTier";
import { ApplyOpFn, RainJS, StateJS } from "./RainJS";



/**
 * @public - The javascript version of CombineTierVM which inherits RainJS with local CombineTier opcodes.
 * @see CombineTier.sol in contracts
 * 
 */
export class CombineTierJS extends RainJS {

  /**
   * Local CombineTier Opcodes + AllstandardOps
   */
  public static Opcodes = CombineTier.Opcodes;

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
      applyOpFn?: ApplyOpFn
    }
  ) {
    super(
      state,
      {
        signer: options?.signer,
        contract: options?.contract,
        applyOpFn: options?.applyOpFn
      }
    )
  }

  /**
   * key/value pair of opcodes and their functions for all standard opcodes + EmissionsERC20 local opcodes
   */
  protected readonly _OPCODE_: ApplyOpFn = { 

    ...this._OPCODE_,

    [CombineTierJS.Opcodes.ACCOUNT] : 
      async(state: StateJS, operand: number, data?: any) => {
      if(data && data.account != undefined) {
        state.stack.push(
          BigNumber.from(data.account)
        )
      }
      else throw new Error("Undefined account address")
    }
  }

}