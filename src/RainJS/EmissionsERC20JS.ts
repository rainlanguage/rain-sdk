
import { BigNumber, Contract, Signer } from "ethers";
import { StateConfig } from "../classes/vm";
import { EmissionsERC20 } from "../contracts/emissionsERC20";
import { ApplyOpFn, RainJS, StateJS } from "./RainJS";



/**
 * @public - The javascript version of EmissionsERC20JS which inherits RainJS with local EmissionsERC20JS opcodes.
 * @see EmissionsERC20.sol in contracts
 * 
 */
export class EmissionsERC20JS extends RainJS {

  /**
   * Local EmissionsERC20 Opcodes + AllstandardOps
   */
  public static Opcodes = EmissionsERC20.Opcodes;

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
   * for zipmap function source or for CLAIMANT_ACCOUNT opcode. data needs to have "claimant_account" property so 
   * this local opcode to function properly.
   * 
   */
  protected async dispatch (
    state: StateJS,
    opcode: number,
    operand: number,
    data?: any
  ) : Promise<void> {
    
    if (opcode == EmissionsERC20JS.Opcodes.CLAIMANT_ACCOUNT) {
      if(data && data.claimant_account != undefined) {
        state.stack.push(
          BigNumber.from(data.claimant_account)
        )
      }
      else throw new Error("Undefined claimant account address")
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