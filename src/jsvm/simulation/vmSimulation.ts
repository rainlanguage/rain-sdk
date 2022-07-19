import { RainJSVM } from "../RainJSVM";
import { BigNumber, ethers } from "ethers";
import { Tier } from "../../classes/iTierV2";
import { StateConfig, VM } from "../../classes/vm";
import { 
  paddedUInt160, 
  paddedUInt256,
} from "../../utils";
import { 
  FnPtrs,
  erc20s,
  itiers,
  erc721s,
  erc1155s,
  StateJSVM,
} from "../types";


/**
 * @public
 * A class for creating a simulation environment for running pure RainVM off-chain using JSVM.
 */
export class vmSimulation {

  /**
   * A sender that performs the simulation transactions. this is needed for SENDER opcode simulation,
   * and updating storage types after method calls and needs to be a string number or hex string.
   */
  public sender?: string;
 
  /**
   * A property of type erc20s that act like a storage for simulation and stores the erc20 token data.
   * this is needed for IERC20 related opcodes @see erc20s and @see erc20
   */
  public erc20s: erc20s = {};
 
  /**
   * A property of type erc721s that act like a storage for simulation and stores the erc721 token data.
   * this is needed for IERC721 related opcodes @see erc721s and @see erc721
   */
  public erc721s: erc721s = {};
 
  /**
   * A property of type erc1155s that act like a storage for simulation and stores the erc1155 token data.
   * this is needed for IERC1155 related opcodes @see erc1155s and @see erc1155
   */
  public erc1155s: erc1155s = {};
 
  /**
   * A property of type itiers that act like a storage for simulation of Rain tier contracts.
   * this is needed for ITIERV2_REPORT and ITIERV2_REPORT_TIME_FOR_TIER opcodes. @see itiers
   */
  public iTiers: itiers = {};
 
  /**
   * The contract address of this simulation that the simulation is done for. this is needed for THIS_ADDRESS opcode 
   * simulation and updating storage types after method calls, and needs to be a string number or hex string.
   */
  public address?: string;
 
  /**
   * The script to simulate @see StateConfig
   */
  public script?: StateConfig;

  /**
   * A property for producing timestamp for the class which will be used in BLOCK_TIMESTAMP opcode
   * but BLOCK_TIMESTAMP opcode can also be passed at runtime
   */
  public timestamp?: number;

  /**
   * A property for producing block number for the class which will be used in BLOCK_NUMBER opcode
   * but BLOCK_NUMBER opcode can also be passed at runtime
   */
  public blockNumber?: number;

  /**
   * Opcodes functions body for simulation that use the class properties/types. @see FnPtrs and @see OpcodeFN
   */
  protected OpFns: FnPtrs = {

    [VM.Opcodes.BLOCK_NUMBER]: (state: StateJSVM, operand: number, data?: any) => {
      if (data && data.blockNumber !== undefined) {
        state.stack.push(BigNumber.from(data.blockNumber))
      }
      else if (this.blockNumber !== undefined) {
        state.stack.push(BigNumber.from(this.blockNumber))
      }
      else throw new Error("undefined block number")
    },

    [VM.Opcodes.BLOCK_TIMESTAMP]: (state: StateJSVM, operand: number, data?: any) => {
      if (data && data.timestamp !== undefined) {
        state.stack.push(BigNumber.from(data.timestamp))
      }
      if (this.timestamp !== undefined) {
        state.stack.push(BigNumber.from(this.timestamp))
      }
      else throw new Error("undefined block timestamp")      
    },

    [VM.Opcodes.SENDER]: (state: StateJSVM, operand: number, data?: any) => {
      if (this.sender !== undefined)
        state.stack.push(BigNumber.from(this.sender))
      else throw new Error("undefined sender")
    },

    [VM.Opcodes.THIS_ADDRESS]: (state: StateJSVM, operand: number, data?: any) => {
      if (this.address !== undefined)
        state.stack.push(BigNumber.from(this.address))
      else throw new Error("undefined contract")
    },

    [VM.Opcodes.ITIERV2_REPORT]: (state: StateJSVM, operand: number, data?: any) => {
      const context_ = operand ? state.stack.splice(-operand) : [];
      const item2_ = state.stack.pop();
      const item1_ = state.stack.pop();

      if (item1_ && item2_ !== undefined && context_.length !== operand) {
        const account_ = paddedUInt160(item2_);
        let iTierV2Contract;
        if (this.iTiers[paddedUInt160(item1_)] !== undefined) {
          iTierV2Contract = this.iTiers[paddedUInt160(item1_)];
        }
        else throw new Error("iTier contract does not exist")

        if (iTierV2Contract.report[account_] !== undefined) {
          state.stack.push(iTierV2Contract.report[account_]);
        }
        else throw new Error("report doesn not exist for this address")
      } 
      else throw new Error('Undefined stack variables');
    },

    [VM.Opcodes.ITIERV2_REPORT_TIME_FOR_TIER]: (state: StateJSVM, operand: number, data?: any) => {
      const context_ = operand ? state.stack.splice(-operand) : [];
      const item3_ = state.stack.pop();
      if (item3_ !== undefined && item3_.toNumber() > Tier.ONE && item3_.toNumber() < Tier.EIGHT) {
        const item2_ = state.stack.pop();
        const item1_ = state.stack.pop();
        if (item1_ && item2_ !== undefined && context_.length === operand) {
          let iTierV2Contract;
          const tier_ = item3_;
          const account_ = paddedUInt160(item2_);
          if (this.iTiers[paddedUInt160(item1_)] !== undefined) {
            iTierV2Contract = this.iTiers[paddedUInt160(item1_)];
          }
          else throw new Error("iTier contract does not exist")
          if (iTierV2Contract.report[account_] !== undefined) {
            state.stack.push(
              BigNumber.from(
                paddedUInt256(iTierV2Contract.report[account_])
                .substring(2)
                .slice(
                  (-(tier_.toNumber() - 8) * 8),
                  (-(tier_.toNumber() - 9) * 8)
                )
              )
            )
          }
          else throw new Error("report doesn not exist for this address")
        }
        else throw new Error('Undefined stack variables');
      }
      else throw new Error("not valid tier");
    },

    [VM.Opcodes.IERC20_BALANCE_OF]: (state: StateJSVM, operand: number, data?: any) => {
      const item2_ = state.stack.pop();
      const item1_ = state.stack.pop();
      if (item1_ && item2_ !== undefined) {
        const account_ = paddedUInt160(item2_);
        const erc20Address_ = paddedUInt160(item1_);
        let erc20Contract_;
        if (this.erc20s[erc20Address_] !== undefined) {
          erc20Contract_ = this.erc20s[erc20Address_];
        }
        else throw new Error("erc20 token does not exist")
        state.stack.push(erc20Contract_.balanceOf[account_] ?? ethers.constants.Zero);
      } 
      else throw new Error('Undefined stack variables');
    },

    [VM.Opcodes.IERC20_TOTAL_SUPPLY]: (state: StateJSVM, operand: number, data?: any) => {
      const item_ = state.stack.pop();
      if (item_ !== undefined) {
        const erc20Address_ = paddedUInt160(item_);
        let erc20Contract_;
        if (this.erc20s[erc20Address_] !== undefined) {
          erc20Contract_ = this.erc20s[erc20Address_];
        }
        else throw new Error("erc20 token does not exist")
        state.stack.push(erc20Contract_.totalSupply);
      } 
      else throw new Error('Undefined stack variable');  
    },

    [VM.Opcodes.IERC721_BALANCE_OF]: (state: StateJSVM, operand: number, data?: any) => {
      const item2_ = state.stack.pop();
      const item1_ = state.stack.pop();
      if (item1_ && item2_ !== undefined) {
        const account_ = paddedUInt160(item2_);
        const erc721Address_ = paddedUInt160(item1_);
        let erc721Contract_;
        if (this.erc721s[erc721Address_] !== undefined) {
          erc721Contract_ = this.erc721s[erc721Address_]
        }
        else throw new Error("erc721 token does not exist")
        let counter = 0;
        for (let i = 0; i < Object.keys(erc721Contract_).length; i++) {
          if (Object.values(erc721Contract_)[i].ownerOf === account_) counter++
        }
        state.stack.push(BigNumber.from(counter));
      } 
      else throw new Error('Undefined stack variables');  
    },
    
    [VM.Opcodes.IERC721_OWNER_OF]: (state: StateJSVM, operand: number, data?: any) => {
      const item2_ = state.stack.pop();
      const item1_ = state.stack.pop();
      if (item1_ && item2_ !== undefined) {
        const tokenId_ = item2_.toNumber();
        const erc721Address_ = paddedUInt160(item1_);
        let erc721Contract_;
        if (this.erc721s[erc721Address_] !== undefined) {
          erc721Contract_ = this.erc721s[erc721Address_]
        }
        else throw new Error("erc721 token does not exist")
        if (erc721Contract_[tokenId_] !== undefined) {
          state.stack.push(
            BigNumber.from(erc721Contract_[tokenId_].ownerOf)
          )
        }
        else throw new Error("token ID doesn not exist")
      } 
      else throw new Error('Undefined stack variable');
    },

    [VM.Opcodes.IERC1155_BALANCE_OF]: (state: StateJSVM, operand: number, data?: any) => {
      const item3_ = state.stack.pop();
      const item2_ = state.stack.pop();
      const item1_ = state.stack.pop();
      if (item1_ && item2_ && item3_ !== undefined) {
        const id_ = item3_.toNumber();
        const account_ = paddedUInt160(item2_);
        const erc1155Address_ = paddedUInt160(item1_);
        let erc1155Contract_;
        if (this.erc1155s[erc1155Address_] !== undefined) {
          erc1155Contract_ = this.erc1155s[erc1155Address_]
        }
        else throw new Error("erc1155 token doesn not exist")
        if (erc1155Contract_[id_] !== undefined) {
          state.stack.push(erc1155Contract_[id_].balanceOf[account_] ?? ethers.constants.Zero);
        }
        else throw new Error("token ID doesn not exist")
      } 
      else throw new Error('Undefined stack variables');
    },

    [VM.Opcodes.IERC1155_BALANCE_OF_BATCH]: (state: StateJSVM, operand: number, data?: any) => {
      const item3_ = state.stack.splice(-(operand + 1));
      const item2_ = state.stack.splice(-(operand + 1));
      const item1_ = state.stack.pop();
      if (
        item1_ &&
        item2_ &&
        item3_ &&
        item2_.length === item3_.length
      ) {
        const tokenIds_: number[] = [];
        for (let i = 0; i < item3_.length; i++) {
          tokenIds_.push(item3_[i].toNumber());
        }
        const accounts_: string[] = [];
        for (let i = 0; i < item2_.length; i++) {
          accounts_.push(paddedUInt160(item2_[i]));
        }
        const erc1155Address_ = paddedUInt160(item1_);
        let erc1155Contract_;
        if (this.erc1155s[erc1155Address_] !== undefined) {
          erc1155Contract_ = this.erc1155s[erc1155Address_]
        }
        else throw new Error("erc1155 token doesn not exist")
        let balanceOfBatch: BigNumber[] = [];
        for (let i = 0; i < tokenIds_.length; i++) {
          if (Object.keys(erc1155Contract_).includes(tokenIds_[i].toString())) {
            balanceOfBatch.push(
              erc1155Contract_[tokenIds_[i]].balanceOf[accounts_[i]] ?? ethers.constants.Zero
            )
          }
        }
        state.stack.push(
          ...balanceOfBatch
        );
      } 
      else throw new Error('Undefined stack variable');
    },

    [VM.Opcodes.IERC20_SNAPSHOT_BALANCE_OF_AT]: (state: StateJSVM, operand: number, data?: number) => {
      const item3_ = state.stack.pop();
      const item2_ = state.stack.pop();
      const item1_ = state.stack.pop();
      if (item1_ && item2_ && item3_ !== undefined) {
        const snapshotId_ = item3_.toNumber();
        const account_ = paddedUInt160(item2_);
        const erc20Address_ = paddedUInt160(item1_);
        let erc20Contract_;
        if (this.erc20s[erc20Address_] !== undefined) {
          erc20Contract_ = this.erc20s[erc20Address_];
        }
        else throw new Error("erc20 token does not exist")
        if (erc20Contract_.snapshots && erc20Contract_.snapshots[snapshotId_] !== undefined) {
          state.stack.push(erc20Contract_.snapshots[snapshotId_].balanceOfAt[account_] ?? ethers.constants.Zero);
        }
        else throw new Error("no snapshot has created for this token")
      } 
      else throw new Error('Undefined stack variables');
    },

    [VM.Opcodes.IERC20_SNAPSHOT_TOTAL_SUPPLY_AT]: (state: StateJSVM, operand: number, data?: number) => {
      const item2_ = state.stack.pop();
      const item1_ = state.stack.pop();
      if (item1_ && item2_ !== undefined) {
        const snapshotId_ = item2_.toNumber();
        const erc20Address_ = paddedUInt160(item1_);
        let erc20Contract_;
        if (this.erc20s[erc20Address_] !== undefined) {
          erc20Contract_ = this.erc20s[erc20Address_];
        }
        else throw new Error("erc20 token does not exist")
        if (erc20Contract_.snapshots && erc20Contract_.snapshots[snapshotId_] !== undefined) {
          state.stack.push(erc20Contract_.snapshots[snapshotId_].totalSupplyAt);
        }
        else throw new Error("no snapshot has created for this token")
      } 
      else throw new Error('Undefined stack variables');
    }
  }

  /**
   * Method to set the class sender property
   * 
   * @param senderAddress - a string number/hex string 
   */
  public setSender(senderAddress: string) {
    this.sender = paddedUInt160(senderAddress);
  }

  /**
   * Method to set the class address property
   * 
   * @param contractAddress - a string number/hex string
   */
  public setContractAddress(contractAddress: string) {
    this.address = paddedUInt160(contractAddress);
  }

  /**
   * Method to set the class script
   * 
   * @param script - A StateConfig 
   */
  public setScript(script: StateConfig) {
    this.script = script;
  }

  /**
   * Method to add assets i.e erc20/721/1155 types objects
   * 
   * @param erc20s - An object of type erc20s
   * @param erc721s - An object of type erc721s
   * @param erc1155s - An object of type erc1155s
   */
  public addAssets(erc20s?: erc20s, erc721s?: erc721s, erc1155s?: erc1155s) {
    if (erc20s) {
      for (let i = 0; i < Object.keys(erc20s).length; i++) {
        if (Object.keys(this.erc20s).includes(Object.keys(erc20s)[i])) {
          delete this.erc20s[Object.keys(erc20s)[i]]
        }
      }
      this.erc20s = {...this.erc20s, ...erc20s}
    }
    if (erc721s) {
      for (let i = 0; i < Object.keys(erc721s).length; i++) {
        if (Object.keys(this.erc721s).includes(Object.keys(erc721s)[i])) {
          delete this.erc721s[Object.keys(erc721s)[i]]
        }
      }
      this.erc721s = {...this.erc721s, ...erc721s}
    }
    if (erc1155s) {
      for (let i = 0; i < Object.keys(erc1155s).length; i++) {
        if (Object.keys(this.erc1155s).includes(Object.keys(erc1155s)[i])) {
          delete this.erc1155s[Object.keys(erc1155s)[i]]
        }
      }
      this.erc1155s = {...this.erc1155s, ...erc1155s}
    }
  }

  /**
   * Method to add tier contract types objects to the class (iTiers)
   * 
   * @param iTiers - An Object of itiers type
   */
  public addITiers (iTiers: itiers) {
    for (let i = 0; i < Object.keys(iTiers).length; i++) {
      if (Object.keys(this.iTiers).includes(Object.keys(iTiers)[i])) {
        delete this.iTiers[Object.keys(iTiers)[i]]
      }
    }
    this.iTiers = {
      ...this.iTiers,
      ...iTiers
    }
  }

  /**
   * Method to run the script using JSVM
   * 
   * @param data - (optional) the additional data that needs to be passed at the runtime such as timestamp used in BLOCK_TIMESTAMP opcode.
   * @param index - (optional) the ENTRYPOINT or the index in the script sources to run
   * 
   * @returns An array of BigNumbers, which are the stacked result of the script 
   */
  public async runScript (data?: any, index?: number): Promise<BigNumber[]> {
    if (this.script !== undefined) {
      let simulation = new RainJSVM(
        this.script,
        {applyOpFn: this.OpFns}
      )
      let result = simulation.run(data, index);
      return result;
    }
    else throw new Error("no script to execute")
  }
}