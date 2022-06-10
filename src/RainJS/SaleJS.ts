import {  BigNumber, Contract, Signer } from "ethers";
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
   * key/value pair of opcodes and their functions for all standard opcodes + Sale local opcodes
   */
  protected readonly _OPCODE_: ApplyOpFn = {

    ...this._OPCODE_, 

    [SaleJS.Opcodes.REMAINING_UNITS] : 
      async(state: StateJS, operand: number, data?: any) => {
        if (this.signer && this.contract != undefined) {
          const rTKNAddress_ = await this.contract.token();
          const rTKNContract_ = new ERC20(
            rTKNAddress_,
            this.signer
          );
          state.stack.push(
            BigNumber.from(
              await rTKNContract_.balanceOf(this.contract.address)
            )
          )
        }
        else throw new Error("Undefined Signer or Sale Contract")
      },

    [SaleJS.Opcodes.TOTAL_RESERVE_IN] : 
      async(state: StateJS, operand: number, data?: any) => {
        if (this.signer && this.contract != undefined) {
          const reserveAddress_ = await this.contract.reserve();
          const reserveContract_ = new ERC20(
            reserveAddress_,
            this.signer
          );
          state.stack.push(
            BigNumber.from(
              await reserveContract_.balanceOf(this.contract.address)
            )
          )
        }
        else throw new Error("Undefined Signer or Sale Contract")
      },

    [SaleJS.Opcodes.CURRENT_BUY_UNITS] : 
      async(state: StateJS, operand: number, data?: any) => {
        if(data && data.current_buy_units != undefined) {
          state.stack.push(
            BigNumber.from(
              data.current_buy_units
            )
          )
        }
        else throw new Error("Undefined buy units")
      },

    [SaleJS.Opcodes.TOKEN_ADDRESS] : 
      async(state: StateJS, operand: number, data?: any) => {
        if (this.signer && this.contract != undefined) {
          state.stack.push(
            BigNumber.from(
              await this.contract.token()
            )
          )
        }
        else throw new Error("Undefined Signer or Sale Contract")
      },

    [SaleJS.Opcodes.RESERVE_ADDRESS] : 
    async(state: StateJS, operand: number, data?: any) => {
      if (this.signer && this.contract != undefined) {
        state.stack.push(
          BigNumber.from(
            await this.contract.reserve()
          )
        )
      }
      else throw new Error("Undefined Signer or Sale Contract")
    },
  };

}