
import { BigNumber, Contract, Signer } from "ethers";
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
      contract?: Contract,
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
   * dispatch method with Sale's local opcodes
   * @see dispatch in RainJS
   * 
   * @param state - StateJS property used in each opcode function to either read or write data into stack.
   * @param opcode - the opcode to dispatch and run the function of that opcode
   * @param operand - the addtional info for each opcode to run based on.
   * @param data - (optional) used only for zipmap opcode in order to be able to run custom function i.e. applyOpFn
   * for zipmap function source or for ACCOUNT opcode. data needs to have "claimant_account" property so this local 
   * opcode to function properly.
   * 
   */
  protected async dispatch (
    state: StateJS,
    opcode: number,
    operand: number,
    data?: any
  ) : Promise<void> {
    
    if (opcode == CombineTierJS.Opcodes.ACCOUNT) {
      if(data && data.account != undefined) {
        state.stack.push(
          BigNumber.from(data.account)
        )
      }
      else throw new Error("Undefined account address")
    }
    else {
      await super.dispatch(
        state,
        opcode,
        operand,
        data
      )
    }
  }
}