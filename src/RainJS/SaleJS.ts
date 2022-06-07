
import { BigNumber, Contract, Signer } from "ethers";
import { StateConfig } from "../classes/vm";
import { ApplyOpFn, RainJS, StateJS } from "./RainJS";
import { ERC20 } from "../contracts/generics/erc20";
import { Sale } from "../contracts/sale";


/**
 * @public - The javascript version of SaleVM which inherits RainJS with local Sale opcodes.
 * @see Sale.sol in contracts
 * 
 */
export class SaleJS extends RainJS {

  /**
   * Local Sale's opcodes + AllstandardOps
   */
  public static Opcodes = Sale.Opcodes;

  /**
   * Constructor of SaleJS to create a instance of this class with Sale's local opcodes.
   * @see RainJS
   * 
   * @param state - A regular StateConfig
   * @param options - (optional) additional arguments for instantiating this class 
   * (a Signer, a Sale Contract and custom opcode functions)
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
   * for zipmap function source or for CURRENT_BUY_UINTS opcode. data needs to have "claimant_account" property so 
   * this local opcode of "CURRENT_BUY_UNITS" to function properly.
   * 
   */
  protected async dispatch (
    state: StateJS,
    opcode: number,
    operand: number,
    data?: any
  ) : Promise<void> {
    
    if (opcode == SaleJS.Opcodes.REMAINING_UNITS) {
      if (this.signer && this.contract != undefined) {
        const rTKNAddress_ = await this.contract.token();
        const rTKNContract_ = new ERC20(
          rTKNAddress_,
          this.signer
        );
        state.stack.push(
          BigNumber.from(await rTKNContract_.balanceOf(this.contract.address))
        )
      }
      else throw new Error("Undefined Signer or Sale Contract")
    }
    else if (opcode == SaleJS.Opcodes.TOTAL_RESERVE_IN) {
      if (this.signer && this.contract != undefined) {
        const reserveAddress_ = await this.contract.reserve();
        const reserveContract_ = new ERC20(
          reserveAddress_,
          this.signer
        );
        state.stack.push(
          BigNumber.from(await reserveContract_.balanceOf(this.contract.address))
        )
      }
      else throw new Error("Undefined Signer or Sale Contract")
    }
    else if (opcode == SaleJS.Opcodes.CURRENT_BUY_UNITS) {
      if(data && data.current_buy_units != undefined) {
        state.stack.push(
          BigNumber.from(data.current_buy_units)
        )
      }
      else throw new Error("Undefined buy units")
    }
    else if (opcode == SaleJS.Opcodes.TOKEN_ADDRESS) {
      if (this.signer && this.contract != undefined) {
        state.stack.push(
          BigNumber.from(await this.contract.token())
        )
      }
      else throw new Error("Undefined Signer or Sale Contract")  
    }
    else if (opcode == SaleJS.Opcodes.RESERVE_ADDRESS) {
      if (this.signer && this.contract != undefined) {
        state.stack.push(
          BigNumber.from(await this.contract.reserve())
        )
      }
      else throw new Error("Undefined Signer or Sale Contract")
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