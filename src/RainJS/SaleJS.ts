import { BigNumber, Signer } from "ethers";
import { StateConfig } from "../classes/vm";
import { ApplyOpFn, RainJS, StateJS } from "./RainJS";
import { ERC20 } from "../contracts/generics/erc20";
import { Sale, SaleContext, SaleStorage } from "../contracts/sale";
import { parseUnits } from "../utils";



/**
 * @public - The javascript version of SaleVM which inherits RainJS with local Sale opcodes.
 * @see Sale.sol in contracts
 * 
 */
export class SaleJS extends RainJS {


  /**
   * Constructor of SaleJS to create a instance of this class with Sale's local opcodes.
   * @see RainJS
   * 
   * @param state - A regular StateConfig
   * @param options - (optional) additional arguments for instantiating this class 
   * (a Signer, a Sale Contract and custom opcode functions, custom STORAGE/CONTEXT opcode functions)
   * 
   */
  constructor(
    state: StateConfig,
    options?: {
      signer?: Signer,
      contract?: string,
      applyOpFn?: ApplyOpFn,
      storageOpFn?: ApplyOpFn, // for overriding the SaleJS's STORAGE opcode function
      contextOpFn?: ApplyOpFn // for overriding the SaleJS's CONTEXT opcode function
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
    for (let i = 0; i < SaleStorage.length; i++) {
      if (options?.storageOpFn && options.storageOpFn[i]) {
        this._STORAGE_[i] = options.storageOpFn[i];
      }
    };
    for (let i = 0; i < SaleContext.length; i++) {
      if (options?.contextOpFn && options.contextOpFn[i]) {
        this._CONTEXT_[i] = options.contextOpFn[i];
      }
    };
  };

  /**
   * key/value pair of STORAGE opcodes of the sale JSVM
   */
  protected _STORAGE_: ApplyOpFn = {
    
    [SaleStorage.RemainingUnits] : 
      async(state: StateJS, operand: number, data?: any) => {
        if (this.signer && this.contract !== undefined) {
          const salecontract_ = new Sale(this.contract, this.signer);
          const rTKNAddress_ = await salecontract_.token();
          const rTKNContract_ = new ERC20(
            rTKNAddress_,
            this.signer
          );
          state.stack.push(
            BigNumber.from(
              await rTKNContract_.balanceOf(this.contract)
            )
          )
        }
        else throw new Error("Undefined Signer or Sale Contract")
      },

    [SaleStorage.TotalReserveIn] : 
      async(state: StateJS, operand: number, data?: any) => {
        if (this.signer && this.contract !== undefined) {
          const salecontract_ = new Sale(this.contract, this.signer);
          const reserveAddress_ = await salecontract_.reserve();
          const reserveContract_ = new ERC20(
            reserveAddress_,
            this.signer
          );
          state.stack.push(
            BigNumber.from(
              await reserveContract_.balanceOf(this.contract)
            )
          )
        }
        else throw new Error("Undefined Signer or Sale Contract")
      },

    [SaleStorage.TokenAddress] : 
      async(state: StateJS, operand: number, data?: any) => {
        if (this.signer && this.contract !== undefined) {
          const salecontract_ = new Sale(this.contract, this.signer);
          state.stack.push(
            BigNumber.from(
              await salecontract_.token()
            )
          )
        }
        else throw new Error("Undefined Signer or Sale Contract")
      },

    [SaleStorage.ReserveAddress] : 
      async(state: StateJS, operand: number, data?: any) => {
      if (this.signer && this.contract !== undefined) {
        const salecontract_ = new Sale(this.contract, this.signer);
        state.stack.push(
          BigNumber.from(
            await salecontract_.reserve()
          )
        )
      }
      else throw new Error("Undefined Signer or Sale Contract")
    },
  };
  
  /**
   * key/value pair of CONTEXT opcodes of the sale JSVM
   * the required value need to be passed to "run" method as the context array in "data" object.
   * the reason is the CONTEXT opcode is contextual and is passed the VM at runtime.
   */
  protected _CONTEXT_: ApplyOpFn = {
    [SaleContext.CurrentBuyUnits] : 
    async(state: StateJS, operand: number, data?: any) => {
      if(data && data.context !== undefined) {
        state.stack.push(
          parseUnits(
            data.context[SaleContext.CurrentBuyUnits].toString()
          )
        )
      }
      else throw new Error("Undefined buy units")
    },
  }

}