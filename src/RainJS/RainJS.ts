import { BigNumber, Contract, ethers, Signer } from "ethers";
import { arrayify } from "../utils";
import { StateConfig, VM } from "../classes/vm";
import { ERC1155 } from "../contracts/generics/erc1155";
import { ERC20 } from "../contracts/generics/erc20";
import { ERC721 } from "../contracts/generics/erc721";
import { ITier } from "../contracts/tiers/iTier";
import { Provider } from "../types";



/**
 * @public
 * A type for functions to override the default opcodes functions with it.
 */
export type OpcodeFN = (
  state: StateJS,
  operand: number,
  data?: any
) => void;


/**
 * @public
 * An interface for creating a key/value pair of custom opcodes functions to override.
 */
export interface ApplyOpFn {
  [key: number]: OpcodeFN
}


/**
 * @public - An interface, StateJS is basically javascript version of 'State' struct 
 * in RainVM, although it doesn't need stackLength and argumentsLength to operate. It 
 * receives a regular RainVM in the constructor and initiates the stack for it and all 
 * opcodes do their operations to the stack.
 * @see State in RainVM.sol
 * 
 */
export interface StateJS {

  /** 
   * The property to store the RainVM script constants.
   */ 
  readonly constants: BigNumber[];

  /** 
   * The property to store the RainVM script sources.
   */ 
  readonly sources : Uint8Array[];

  /** 
   * The RainJS's stack. 
   */ 
  readonly stack: BigNumber[];

  /** 
   * Used only for zipmap opcode
   */ 
  readonly argumentsStack: BigNumber[];

};


/**
 * @public - The javascript version of the RainVM, basically does the same job RainVM does
 * but off-chain. 
 * @see RainVM in RainVM.sol
 * 
 */
export class RainJS {

  /**
   * All of RainVM standard opcodes, i.e. AllStandardOps
   */
  public static Opcodes = VM.Opcodes;

  /**
   * The result state of the executed Rainjs.
   */
  public readonly lastState: BigNumber[] = [];

  /**
   * The property of type StateJS which that RainJS will run based on.
   */
  private readonly state: StateJS;

  /**
   * It is a property for overriding the opcodes. Need to ba passed at the time of construction
   * because the RainJS opcode functions should not change after an instance has be created.
   */
  private readonly applyOpFn?: ApplyOpFn;

  /**
   * An ethers Signer.
   */
  public signer?: Signer;

  /**
   * An ethers provider.
   */
  public provider?: Provider;

  /**
   * An ethers Contract
   */
  public contract?: Contract;


  /**
   * The constructor of RainJS which initiates the RainJS and also a StateJS for a RainVM script.
   * 
   * @param state - A regular StateConfig used to new a StateJS object to be used in RainJS.
   * @param options - (optional) used for initiating the optional properties (signer, provider, contract and applyOpFn)
   * 
   */
  constructor(
    state: StateConfig,
    options?: {
      signer?: Signer,
      provider?: Provider,
      contract?: Contract,
      applyOpFn?: ApplyOpFn,
    }
  ) {
    const stack: BigNumber[] = [];
    const argumentsStack: BigNumber[] = [];
    const constants: BigNumber[] = []; 
    const sources: Uint8Array[] = [];

    for (let i = 0; i < state.constants.length; i++) {      
      constants.push(
        BigNumber.from(state.constants[i])
      )
    };
    for (let i = 0; i < state.sources.length; i++) {
      sources.push(
        arrayify(state.sources[i])
      )
    };

    this.state = {
      stack,
      argumentsStack,
      constants,
      sources,
    };
    this.applyOpFn = options?.applyOpFn;
    this.signer = options?.signer;
    this.contract = options?.contract;
    this.provider = options?.provider ?? options?.signer?.provider;
  }

  
  /**
   * The main workhorse of RainJS, basically the javascript version of 'eval' method in RainVM.sol.
   * It executes the RainVM script based on each Opcode or the custom opcodes i.e. applyOpFn that 
   * has been passed at the time of cinstruction of a RainJS object.
   * @see eval method in RainVM.sol
   * 
   * @param data - (optional) An object which is used to provide additional values for "applyOpFn" if there 
   * are custom opcodes passed at the time of construction ot to pass in some user input value to the script.
   * @param index - used internally for indicating which item in state sources array to execute for zipmap function.
   * 
   */
  private async eval (
    data?: any,  
    index?: number,
  ) : Promise<void> {

    const sourcesIndex = index ? index : 0;
    
    for (let i = 0 ; i < this.state.sources[sourcesIndex].length; i++) {
      if (this.applyOpFn != undefined) {
        if (
          Object.keys(this.applyOpFn)
          .includes(
            this.state.sources[sourcesIndex][i]
            .toString()
          )
        ) {
          await this.applyOpFn[
            this.state.sources[sourcesIndex][i]
          ](
            this.state,
            this.state.sources[sourcesIndex][i+1],
            data
          )
        }
        else {
          await this.dispatch(
            this.state,
            this.state.sources[sourcesIndex][i],
            this.state.sources[sourcesIndex][i+1],
            data
          )
        }
      } 
      else {
        await this.dispatch(
          this.state,
          this.state.sources[sourcesIndex][i],
          this.state.sources[sourcesIndex][i+1],
          data
        );
      }
      i++;
    }
  }

  /**
   * It is a protected method used by eval to run the correct function for each opcode in the script.
   * For each opcode please @see AllStandardOps
   * 
   * @param state - StateJS property used in each opcode function to either read or write data into stack.
   * @param opcode - the opcode to dispatch and run the function of that opcode
   * @param operand - the addtional info for each opcode to run based on.
   * @param data - (optional) used only for zipmap opcode in order to be able to run custom function i.e. applyOpFn
   * for zipmap function source.
   * 
   */
  private async dispatch (
    state: StateJS,
    opcode: number,
    operand: number,
    data?: any
  ) : Promise<void> { 
    await this._OPCODE_[opcode](state, operand, data);
  }

  /**
   * Method to execute the RainJS.
   * 
   * @param data - (optional) Used as additional info for some local opcodes
   * or custom opcode functions i.e. applyOpFn.
   * 
   * @returns - An array represting the final state of the RainJS stack.
   */
  public async run(data?: any) : Promise<BigNumber> {
    await this.eval(data);
    this.lastState.push(
      ...this.state.stack.splice(-this.state.stack.length)
    )
    const result_ = this.lastState[this.lastState.length - 1];

    return result_;
  }

  /**
   * key/value pair of opcodes and their functions for all standard opcodes
   */
  protected readonly _OPCODE_: ApplyOpFn = {

    [RainJS.Opcodes.SKIP] : 
      (state: StateJS, operand: number, data?: any) => {
        throw new Error("SKIP is no longer available")
      },

    [RainJS.Opcodes.VAL] : 
      (state: StateJS, operand: number, data?: any) => {
        if (!(operand >> 7)) {
          if (state.constants[operand] != undefined) {
            state.stack.push(state.constants[operand])
          }
          else throw new Error("out-of-bound constants")
        }
        else {
          if (state.argumentsStack[operand & 127] != undefined) {
            state.stack.push(state.argumentsStack[operand & 127])
          }
          else throw new Error("out-of-bound arguments")
        }
      },

    [RainJS.Opcodes.DUP] : 
      (state: StateJS, operand: number, data?: any) => {
        state.stack.push(state.stack[operand]);
      },

    [RainJS.Opcodes.ZIPMAP] : 
      async(state: StateJS, operand: number, data?: any) => {
        const sourceIndex_ = operand & 7;
        const numberOfVals_ = (operand & 224) >> 5;
        const a_ = (operand & 24) >> 3;
        const valSize_ = a_ == 3 ? 8 : a_ == 2 ? 16 : a_ == 1 ? 32 : 64;
        const loopSize_ = 64 / valSize_;
        const items_ = state.stack.splice(-(numberOfVals_ + 1));
        let _startIndex = 64 - valSize_;
        let _endIndex = 64;

        if (items_.length == numberOfVals_ + 1) {
          for (let i = 0; i < loopSize_; i++) {
            state.argumentsStack.splice(-(numberOfVals_ + 1));
            for (let j = 0; j < items_.length; j++) {
              state.argumentsStack.push(
                BigNumber.from(
                  "0x" + 
                  items_[j]
                  .toHexString()
                  .substring(2)
                  .padStart(64, "0")
                  .slice(_startIndex, _endIndex)
                )
              )
            }
            for (let i = 0 ; i < this.state.sources[sourceIndex_].length; i++) {
              if (this.applyOpFn != undefined) {
                if (
                  Object.keys(this.applyOpFn)
                  .includes(
                    this.state.sources[sourceIndex_][i]
                    .toString()
                  )
                ) {
                  this.applyOpFn[
                    this.state.sources[sourceIndex_][i]
                  ](
                    this.state,
                    this.state.sources[sourceIndex_][i+1],
                    data
                  )
                }
                else {
                  await this.dispatch(
                    this.state,
                    this.state.sources[sourceIndex_][i],
                    this.state.sources[sourceIndex_][i+1],
                    data
                  )
                }
              } 
              else {
                await this.dispatch(
                  this.state,
                  this.state.sources[sourceIndex_][i],
                  this.state.sources[sourceIndex_][i+1],
                  data
                );
              }
              i++;
            }
            _startIndex -= valSize_;
            _endIndex -= valSize_;
          }
        }
        else throw new Error("Undefined stack variables")
      },

    [RainJS.Opcodes.DEBUG] : 
      (state: StateJS, operand: number, data?: any) => {
        console.log(state.stack);
      },

    [RainJS.Opcodes.BLOCK_NUMBER] : 
      async(state: StateJS, operand: number, data?: any) => {
        if (this.provider != undefined) {
          state.stack.push(
            BigNumber.from(await this.provider.getBlockNumber())
          )
        }
        else throw new Error("Undefined Provider")
      },

    [RainJS.Opcodes.BLOCK_TIMESTAMP] : 
      async(state: StateJS, operand: number, data?: any) => {
        if (this.provider != undefined) {
          state.stack.push(
            BigNumber.from(
              (
                await this.provider.getBlock(
                  await this.provider.getBlockNumber())
              ).timestamp
            )
          )
        }
        else throw new Error("Undefined Provider")  
      },

    [RainJS.Opcodes.SENDER] : 
      async(state: StateJS, operand: number, data?: any) => {
        if (this.signer != undefined) {
          state.stack.push(
            BigNumber.from(await this.signer.getAddress())
          )
        }
      },

    [RainJS.Opcodes.THIS_ADDRESS] : 
      async(state: StateJS, operand: number, data?: any) => {
        if(this.contract != undefined) {
          state.stack.push(
            BigNumber.from(this.contract.address)
          )
        }
        else throw new Error("Undefined contract")
      },

    [RainJS.Opcodes.SCALE18_MUL] : 
      (state: StateJS, operand: number, data?: any) => {
        const item2_ = state.stack.pop();
        const item1_ = state.stack.pop();
        if (item1_ && item2_ != undefined) {
          state.stack.push(
            item2_.mul( 
            operand <= 18   
            ? item1_.mul((10 ** (18 - operand)).toString())
            : item1_.div((10 ** (operand - 18)).toString())
            )
          )
        }
        else throw new Error("Undefined stack variables")
      },

    [RainJS.Opcodes.SCALE18_DIV] :
      (state: StateJS, operand: number, data?: any) => {
        const item2_ = state.stack.pop();
        const item1_ = state.stack.pop();
        if (item1_ && item2_ != undefined) {
          state.stack.push(
            ( 
              operand <= 18   
              ? item1_.mul((10 ** (18 - operand)).toString())
              : item1_.div((10 ** (operand - 18)).toString())
            )
            .div(item2_)
          )
        }
        else throw new Error("Undefined stack variables")
      },

    [RainJS.Opcodes.SCALE18] : 
      (state: StateJS, operand: number, data?: any) => {
        const item_ = state.stack.pop();
        if (item_ != undefined) {
          state.stack.push(
            operand <= 18   
            ? item_.mul((10 ** (18 - operand)).toString())
            : item_.div((10 ** (operand - 18)).toString())
          );
        }
        else throw new Error("Undefined stack variable")
      },

    [RainJS.Opcodes.SCALEN] : 
      (state: StateJS, operand: number, data?: any) => {
        const item_ = state.stack.pop();
        if (item_ != undefined) {
          state.stack.push(
            operand <= 18   
            ? item_.div((10 ** (18 - operand)).toString())
            : item_.mul((10 ** (operand - 18)).toString())
          );
        }
        else throw new Error("Undefined stack variable")
      },

    [RainJS.Opcodes.SCALE_BY] : 
      (state: StateJS, operand: number, data?: any) => {
        const item_ = state.stack.pop();
        const operandSign_ = (operand & 255) >> 7;
        let _operand = operand & 127;
        if (item_ != undefined) {
          if (operandSign_) {
            state.stack.push(
              item_.div((10 ** (_operand)).toString())
            );
          }
          else {
            state.stack.push(
              item_.mul((10 ** (_operand)).toString())
            );
          }
        }
        else throw new Error("Undefined stack variable")
      },

    [RainJS.Opcodes.SCALE18_ONE] : 
      (state: StateJS, operand: number, data?: any) => {
        state.stack.push(BigNumber.from("1000000000000000000"));
      },

    [RainJS.Opcodes.SCALE18_DECIMALS] : 
      (state: StateJS, operand: number, data?: any) => {
        state.stack.push(BigNumber.from(18));
      },

    [RainJS.Opcodes.ADD] : 
      (state: StateJS, operand: number, data?: any) => {
        let _item;
        let _accumulator = ethers.constants.Zero;
        for (let i = 0; i < operand; i++) {
          _item = state.stack.pop();
          if (_item != undefined) {
            _accumulator = _accumulator.add(_item);
          }
          else throw new Error("Undefined stack variables")
        }
        state.stack.push(_accumulator);
      },

    [RainJS.Opcodes.SATURATING_ADD] : 
      (state: StateJS, operand: number, data?: any) => {
        const items_ = state.stack.splice(-operand);
        let _accumulator = ethers.constants.Zero;
        let _item;
        for (let i = 0; i < operand; i++) {
          _item = items_.shift();
          if (_item != undefined) {
            _accumulator = _accumulator.add(_item);
            _accumulator = _accumulator.gt(ethers.constants.MaxUint256)
            ? ethers.constants.MaxUint256
            : _accumulator;
          }
          else throw new Error("Undefined stack variables")
        }
        state.stack.push(_accumulator);
      },

    [RainJS.Opcodes.SUB] : 
      (state: StateJS, operand: number, data?: any) => {
        const items_ = state.stack.splice(-operand);
        let _accumulator = items_.shift();
        let _item;
        if (_accumulator != undefined) {
          for (let i = 1; i < operand; i++) {
            _item = items_.shift();
            if (_item != undefined) {
              _accumulator = _accumulator.sub(_item);
            }
            else throw new Error("Undefined stack variables")
          }
          if (_accumulator.isNegative()) {
            throw new Error("Invalid value (negative value not allowed)")
          }
          else state.stack.push(_accumulator)
        }
        else throw new Error("Undefined stack variables")
      },

    [RainJS.Opcodes.SATURATING_SUB] : 
      (state: StateJS, operand: number, data?: any) => {
        const items_ = state.stack.splice(-operand);
        let _accumulator = items_.shift();
        let _item;
        if (_accumulator != undefined) {
          for (let i = 1; i < operand; i++) {
            _item = items_.shift();
            if(_item != undefined) {
              _accumulator = _accumulator?.sub(_item);
              _accumulator = _accumulator.gt(0)
                ? _accumulator
                : ethers.constants.Zero;
            }
            else throw new Error("Undefined stack variabble")
          }
          state.stack.push(_accumulator);
        }
        else throw new Error("Undefined stack variables")
      },

    [RainJS.Opcodes.MUL] : 
      (state: StateJS, operand: number, data?: any) => {
        let _accumulator = ethers.constants.One;
        let _item;
        for (let i = 0; i < operand; i++) {
          _item = state.stack.pop();
          if (_item != undefined) {
            _accumulator = _accumulator.mul(_item);
          }
          else throw new Error("Undefined stack variables")
        }
        state.stack.push(_accumulator);
      },

    [RainJS.Opcodes.SATURATING_MUL] : 
      (state: StateJS, operand: number, data?: any) => {
        const items_ = state.stack.splice(-operand);
        let _accumulator = ethers.constants.One;
        let _item;
        for (let i = 0; i < operand; i++) {
          _item = items_.shift();
          if (_item != undefined) { 
            _accumulator = _accumulator.mul(_item);
            _accumulator = _accumulator.gt(ethers.constants.MaxUint256)
              ? ethers.constants.MaxUint256
              : _accumulator;
          }
          else throw new Error("Undefined stack variables")
        }
        state.stack.push(_accumulator);
      },

    [RainJS.Opcodes.DIV] : 
      (state: StateJS, operand: number, data?: any) => {
        const items_ = state.stack.splice(-operand);
        let _accumulator = items_.shift();
        let _item;
        if (_accumulator != undefined) {
          for (let i = 1; i < operand; i++) {
            _item = items_.shift();
            if (_item != undefined) {
              _accumulator = _accumulator.div(_item);
            }
            else throw new Error("Undefined stack variables")
          }
          state.stack.push(_accumulator);
        }
        else throw new Error("Undefined stack variables")
      },

    [RainJS.Opcodes.MOD] : 
      (state: StateJS, operand: number, data?: any) => {
        const items_ = state.stack.splice(-operand);
        let _accumulator = items_.shift();
        let _item;
        if (_accumulator != undefined) {
          for (let i = 1; i < operand; i++) {
            _item = items_.shift();
            if (_item != undefined) {
              _accumulator = _accumulator.mod(_item);
            }
            else throw new Error("Undefined stack variables")
          }
          state.stack.push(_accumulator);
        }
        else throw new Error("Undefined stack variables")
      },

    [RainJS.Opcodes.EXP] : 
      (state: StateJS, operand: number, data?: any) => {
        const items_ = state.stack.splice(-operand);
        let _accumulator = items_.shift();
        let _item;
        if (_accumulator != undefined) {
          for (let i = 1; i < operand; i++) {
            _item = items_.shift();
            if (_item != undefined) {
              _accumulator = _accumulator.pow(_item);
            }
            else throw new Error("Undefined stack variables")
          }
          state.stack.push(_accumulator);
        }
        else throw new Error("Undefined stack variables")
      },

    [RainJS.Opcodes.MIN] : 
      (state: StateJS, operand: number, data?: any) => {
        const items_ = state.stack.splice(-operand);
        if (items_.length == operand) {
          state.stack.push(
            items_.reduce((e, m) => e.lt(m) ? e : m)
          );
        }
        else throw new Error("Undefined stack variables")
      },

    [RainJS.Opcodes.MAX] : 
      (state: StateJS, operand: number, data?: any) => {
        const items_ = state.stack.splice(-operand);
        if (items_.length = operand) {
          state.stack.push(
            items_.reduce((e, m) => e.gt(m) ? e : m)
          );
        }
        else throw new Error("Undefined stack variables")
      },

    [RainJS.Opcodes.ISZERO] : 
      (state: StateJS, operand: number, data?: any) => {
        const item_ = state.stack.pop();
        if (item_ != undefined) { 
          state.stack.push(
            item_.isZero() 
              ? ethers.constants.One
              : ethers.constants.Zero
          );
        }
        else throw new Error("Undefined stack variable")
      },

    [RainJS.Opcodes.EAGER_IF] : 
      (state: StateJS, operand: number, data?: any) => {
        const false_ = state.stack.pop();
        const true_ = state.stack.pop();
        const condition_ = state.stack.pop();
        if (false_ && true_ && condition_ != undefined) {
          state.stack.push(
            condition_.gt(0) ? true_ : false_
          )
        }
        else throw new Error("Undefined stack variables")
      },

    [RainJS.Opcodes.EQUAL_TO] : 
      (state: StateJS, operand: number, data?: any) => {
        const item2_ = state.stack.pop();
        const item1_ = state.stack.pop();
        if (item1_ && item2_ != undefined) {
          state.stack.push(
            item2_.eq(item1_) 
              ? ethers.constants.One 
              : ethers.constants.Zero
          );
        }
        else throw new Error("Underfined stack variables")  
      },

    [RainJS.Opcodes.LESS_THAN] : 
      (state: StateJS, operand: number, data?: any) => {
        const item2_ = state.stack.pop();
        const item1_ = state.stack.pop();
        if (item1_ && item2_ != undefined) {
          state.stack.push(
            item2_.gt(item1_)
              ? ethers.constants.One
              : ethers.constants.Zero
          );
        }
        else throw new Error("Undefined stack variables")
      },

    [RainJS.Opcodes.GREATER_THAN] : 
      (state: StateJS, operand: number, data?: any) => {
        const item2_ = state.stack.pop();
        const item1_ = state.stack.pop();
        if (item1_ && item2_ != undefined) {
          state.stack.push(
            item2_.lt(item1_) 
              ? ethers.constants.One 
              : ethers.constants.Zero
          );
        }
        else throw new Error("Undefined stack variables")
      },

    [RainJS.Opcodes.EVERY] : 
      (state: StateJS, operand: number, data?: any) => {
        const items_ = state.stack.splice(-operand);
        let _check;
        let _item;
        for (let i = 0; i < operand; i++) {
          _item = items_.shift();
          if (_item != undefined) {
            if (_item.isZero()) {
              _check = ethers.constants.Zero;
              break;
            }
            else _check = ethers.constants.One;
          }
          else throw new  Error("Undefined stack variables")
        }
        if (_check != undefined) {
          state.stack.push(_check);
        }
        else throw new Error("Undefined stack variable")
      },

    [RainJS.Opcodes.ANY] : 
      (state: StateJS, operand: number, data?: any) => {
        const items_ = state.stack.splice(-operand);
        let _check;
        let _item;
        for (let i = 0; i < operand; i++) {
          _item = items_.shift();
          if (_item != undefined) {
            if (_item.gt(0)) {
              _check = ethers.constants.One;
              break;
            }
            else _check = ethers.constants.Zero;
          }
          else throw new  Error("Undefined stack variables")
        }
        if (_check != undefined) {
          state.stack.push(_check);
        }
        else throw new Error("Undefined stack variable")
      },

    [RainJS.Opcodes.REPORT] : 
      async(state: StateJS, operand: number, data?: any) => {
        const item2_ = state.stack.pop();
        const item1_ = state.stack.pop();
        if (item1_ && item2_ && this.signer != undefined) {
          const account_ = "0x" + item2_.toHexString().substring(2).padStart(64, "0");
          const iTierContract = new ITier(
            "0x" + item1_.toHexString().substring(2).padStart(64, "0"),
            this.signer
          );
          state.stack.push(
            await iTierContract.report(account_)
          );
        }
        else throw new Error("Undefined stack variables")
      },

    [RainJS.Opcodes.NEVER] : 
      (state: StateJS, operand: number, data?: any) => {
        state.stack.push(ethers.constants.MaxUint256)
      },

    [RainJS.Opcodes.ALWAYS] : 
      (state: StateJS, operand: number, data?: any) => {
        state.stack.push(ethers.constants.Zero)
      },

    [RainJS.Opcodes.SATURATING_DIFF] : 
      (state: StateJS, operand: number, data?: any) => {
        const report2_ = state.stack.pop()?.toHexString().substring(2).padStart(64, "0");
        const report1_ = state.stack.pop()?.toHexString().substring(2).padStart(64, "0");
        if (report1_ && report2_ != undefined) {
          let _startIndex = 0;
          let _endIndex = 8;
          let _result = "";
          let _tierRep1;
          let _tierRep2;

          for (let i = 0; i < 8; i++) {
            _tierRep1 = BigNumber.from("0x" + report1_.slice(_startIndex, _endIndex));
            _tierRep2 = BigNumber.from("0x" + report2_.slice(_startIndex, _endIndex));
            _result += 
              _tierRep1.gt(_tierRep2)
              ? (_tierRep1.sub(_tierRep2)).toHexString().substring(2).padStart(8, "0")
              : "00000000";
            _startIndex += 8;
            _endIndex += 8;
          }
          state.stack.push(BigNumber.from("0x" + _result))
        }
        else throw new Error("Undefined stack variables")
      },

    [RainJS.Opcodes.UPDATE_BLOCKS_FOR_TIER_RANGE] : 
      (state: StateJS, operand: number, data?: any) => {
        const endTier_ = operand >> 4;
        const startTier_ = operand & 15;
        const blockNumber_ = state.stack.pop()?.toHexString().substring(2).padStart(8, "0");
        const report_ = state.stack.pop()?.toHexString().substring(2).padStart(64, "0");
        if (report_ && blockNumber_ != undefined) {
          let _startIndex = (8 - endTier_) * 8;
          let _endIndex = _startIndex + 8;
          let _result = report_.slice(0, _startIndex);
          const resultLow_ = report_.slice(
            _startIndex + ((endTier_ - startTier_) * 8)
          );

          for (let i = 0; i < endTier_ - startTier_; i++) {
            _result += 
              report_.slice(_startIndex, _endIndex) > blockNumber_
              ? blockNumber_
              : report_.slice(_startIndex, _endIndex);
            _startIndex += 8;
            _endIndex += 8;
          }
          state.stack.push(BigNumber.from("0x" + _result + resultLow_))
        }
        else throw new Error ("Undefined stack variables")
      },

    [RainJS.Opcodes.SELECT_LTE] : 
      (state: StateJS, operand: number, data?: any) => {
        const length_ = operand & 31;
        const mode_ = (operand & 96) >> 5;
        const logic_ = (operand & 128) >> 7;
        const blockNumber_ = state.stack.pop()?.toHexString().substring(2).padStart(8, "0");
        let _item;
        // array of raw reports
        let _reports: string[] = [];
        // array of array of each tier's lte report
        let _reportsAtTier: string[][] = [[], [], [], [], [], [], [], []];
        let _result = ""; 

        //building an array of each tier's report against blockNumber_
        //tiers greater than blockNumber_ will get "ffffffff"
        if (blockNumber_ != undefined) {
          for(let i = 0; i < length_; i++) {
            let _startIndex = 0;
            let _endIndex = 8;
            _item = state.stack.pop();
            if (_item != undefined) {
              _reports[i] = _item.toHexString().substring(2).padStart(64, "0");
              for(let j = 0; j < 8; j++) {
                _reportsAtTier[j].push(
                  (blockNumber_ < _reports[i].slice(_startIndex, _endIndex))
                  ? "ffffffff"
                  :_reports[i].slice(_startIndex, _endIndex)
                );
                _startIndex += 8;
                _endIndex += 8;
              }
            }
            else throw new Error("Undefined stack variables")
          }
        }
        else throw new Error("Undefined stack variable")

        // logic_ and mode_ selections
        if (logic_) {
          for (let i = 0; i < 8; i++) {
            if (mode_ == 0) {
              _reportsAtTier[i] = [
                _reportsAtTier[i]
                .reduce((e, m) => e < m ? e : m)
              ]
            }
            else if (mode_ == 1) {
              //filter out "ffffffff"
              _reportsAtTier[i] = _reportsAtTier[i].filter((e) => e != "ffffffff")
              _reportsAtTier[i] = _reportsAtTier[i].length > 0
                ? [_reportsAtTier[i].reduce((e, m) => e > m ? e : m)]
                : ["ffffffff"]
            }
            else if (mode_ == 2) {
              //filter out "ffffffff"
              _reportsAtTier[i] = _reportsAtTier[i].filter((e) => e != "ffffffff")
              _reportsAtTier[i] = _reportsAtTier[i].length > 0
                ? [_reportsAtTier[i][_reportsAtTier[i].length - 1]]
                : ["ffffffff"]
            }
          }
        }
        else {
          for (let i = 0; i < 8; i++) {
            if (mode_ == 0) {
              //check if "ffffffff" exists within the tier's array
              _reportsAtTier[i] = _reportsAtTier[i].includes("ffffffff")
                ? ["ffffffff"]
                : [_reportsAtTier[i].reduce((e, m) => e < m ? e : m)]
            }
            else if (mode_ == 1) {
              //check if "ffffffff" exists within the tier's array
              _reportsAtTier[i] = _reportsAtTier[i].includes("ffffffff")
                ? ["ffffffff"]
                : [_reportsAtTier[i].reduce((e, m) => e > m ? e : m)]
            }
            else if (mode_ == 2) {
              //check if "ffffffff" exists within the tier's array
              _reportsAtTier[i] = _reportsAtTier[i].includes("ffffffff")
                ? ["ffffffff"]
                : [_reportsAtTier[i][_reportsAtTier[i].length - 1]]
            }
          }
        }
        //building the final report
        for (let i = 0; i < 8; i++) {
          _result += _reportsAtTier[i][0];
        }
        state.stack.push(BigNumber.from("0x" + _result));
      },

    [RainJS.Opcodes.IERC20_BALANCE_OF] : 
      async(state: StateJS, operand: number, data?: any) => {
        const item2_ = state.stack.pop();
        const item1_ = state.stack.pop();
        if (item1_ && item2_ && this.signer != undefined) {
          const account_ = "0x" + item2_.toHexString().substring(2).padStart(64, "0");
          const erc20Address_ = "0x" + item1_.toHexString().substring(2).padStart(64, "0");
          const erc20Contract_ = new ERC20(
            erc20Address_,
            this.signer
          )
          state.stack.push(
            await erc20Contract_.balanceOf(account_)
          )
        }
        else throw new Error("Undefined stack variables")
      },

    [RainJS.Opcodes.IERC20_TOTAL_SUPPLY] : 
      async(state: StateJS, operand: number, data?: any) => {
        const item_ = state.stack.pop();
        if (item_ && this.signer != undefined) {
          const erc20Address_ = "0x" + item_.toHexString().substring(2).padStart(64, "0");
          const erc20Contract_ = new ERC20(
            erc20Address_,
            this.signer
          )
          state.stack.push(
            await erc20Contract_.totalSupply()
          )
        }
        else throw new Error("Undefined stack variable")
      },

    [RainJS.Opcodes.IERC721_BALANCE_OF] : 
      async(state: StateJS, operand: number, data?: any) => {
        const item2_ = state.stack.pop();
        const item1_ = state.stack.pop();
        if (item1_ && item2_ && this.signer != undefined) {
          const account_ = "0x" + item2_.toHexString().substring(2).padStart(64, "0");
          const erc721Address_ = "0x" + item1_.toHexString().substring(2).padStart(64, "0");
          const erc721Contract_ = new ERC721(
            erc721Address_,
            this.signer
          )
          state.stack.push(
            await erc721Contract_.balanceOf(account_)
          )
        }
        else throw new Error("Undefined stack variables")
      },

    [RainJS.Opcodes.IERC721_OWNER_OF] : 
      async(state: StateJS, operand: number, data?: any) => {
        const item2_ = state.stack.pop();
        const item1_ = state.stack.pop();
        if (item1_ && item2_ && this.signer != undefined) {
          const tokenId_ = BigNumber.from(item2_);
          const erc721Address_ = "0x" + item1_.toHexString().substring(2).padStart(64, "0");
          const erc721Contract_ = new ERC721(
            erc721Address_,
            this.signer
          )
          state.stack.push(
            BigNumber.from(await erc721Contract_.ownerOf(tokenId_))
          )
        }
        else throw new Error("Undefined stack variable")
      },

    [RainJS.Opcodes.IERC1155_BALANCE_OF] : 
      async(state: StateJS, operand: number, data?: any) => {
        const item3_ = state.stack.pop();
        const item2_ = state.stack.pop();
        const item1_ = state.stack.pop();
        if (item1_ && item2_ && item3_ && this.signer != undefined) {
          const id_ = BigNumber.from(item3_);
          const account_ = "0x" + item2_.toHexString().substring(2).padStart(64, "0");
          const erc1155Address_ = "0x" + item1_.toHexString().substring(2).padStart(64, "0");
          const erc1155Contract_ = new ERC1155(
            erc1155Address_,
            this.signer
          )
          state.stack.push(
            await erc1155Contract_.balanceOf(account_, id_)
          )
        }
        else throw new Error("Undefined stack variables")
      },

    [RainJS.Opcodes.IERC1155_BALANCE_OF_BATCH] : 
      async(state: StateJS, operand: number, data?: any) => {
      const item3_ = state.stack.splice(-(operand + 1));
      const item2_ = state.stack.splice(-(operand + 1));
      const item1_ = state.stack.pop();
      if (item1_ && item2_ && item3_ && this.signer != undefined && item2_.length == item3_.length) {
        const tokenIds_: BigNumber[] = [];
        for (let i = 0; i < item3_.length; i++) {
          tokenIds_.push(
            BigNumber.from(item3_[i])
          )
        };
        const accounts_: string[] = [];
        for (let i = 0; i < item2_.length; i++) {
          accounts_.push(
            "0x" + item2_[i].toHexString().substring(2).padStart(64, "0")
          )
        };
        const erc1155Address_ = "0x" + item1_.toHexString().substring(2).padStart(64, "0");
        const erc1155Contract_ = new ERC1155(
          erc1155Address_,
          this.signer
        )
        state.stack.push(
          ...(await erc1155Contract_.balanceOfBatch(accounts_, tokenIds_))
        )
      }
      else throw new Error("Undefined stack variable")
    },
  }

}