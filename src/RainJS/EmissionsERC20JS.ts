
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
   * key/value pair of opcodes and their functions for all standard opcodes + EmissionsERC20 local opcodes
   */
  protected readonly _OPCODE_ = {
    
    [EmissionsERC20JS.Opcodes.CLAIMANT_ACCOUNT] : 
      async(state: StateJS, operand: number, data?: any) => {
      if(data && data.claimant_account != undefined) {
        state.stack.push(
          BigNumber.from(data.claimant_account)
        )
      }
      else throw new Error("Undefined claimant account address")
    }
  }

}