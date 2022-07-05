import { SaleJS } from "./SaleJS";
import { BigNumber, ethers } from "ethers";
import { OrderbookJS } from "./OrderbookJS";
import { Tier } from "../classes/tierContract";
import { StateConfig, VM } from "../classes/vm";
import { SaleStorage } from "../contracts/sale";
import { CombineTierJS } from "./CombineTierJS";
import { OrderBook } from "../contracts/orderBook";
import { EmissionsERC20JS } from "./EmissionsERC20JS";
import { ApplyOpFn, RainJS, StateJS } from "./RainJS";
import { 
  parseUnits,
  paddedUInt32,
  paddedUInt160, 
  paddedUInt256,
} from "../utils";
import { 
  order,
  erc20s,
  itiers,
  orders,
  vaults,
  erc721s,
  erc1155s,
  clearedFunds,
  bountyConfig,
  erc20,eighteenZeros,
  clearedCounterPartyFunds,
  toAddress
} from "./types";



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
  public timestamp?: () => number;

  /**
   * A property for producing block number for the class which will be used in BLOCK_NUMBER opcode
   * but BLOCK_NUMBER opcode can also be passed at runtime
   */
  public blockNumber?: () => number;

  /**
   * Opcodes functions body for simulation that use the class properties/types. @see ApplyOpFn and @see OpcodeFN
   */
  protected OpFns: ApplyOpFn = {

    [VM.Opcodes.BLOCK_NUMBER]: (state: StateJS, operand: number, data?: any) => {
      if (data && data.blockNumber !== undefined) {
        state.stack.push(BigNumber.from(data.blockNumber))
      }
      else if (this.blockNumber !== undefined) {
        state.stack.push(BigNumber.from(this.blockNumber()))
      }
      else throw new Error("undefined block number")
    },

    [VM.Opcodes.BLOCK_TIMESTAMP]: (state: StateJS, operand: number, data?: any) => {
      if (data && data.timestamp !== undefined) {
        state.stack.push(BigNumber.from(data.timestamp))
      }
      if (this.timestamp !== undefined) {
        state.stack.push(BigNumber.from(this.timestamp()))
      }
      else throw new Error("undefined block timestamp")      
    },

    [VM.Opcodes.SENDER]: (state: StateJS, operand: number, data?: any) => {
      if (this.sender !== undefined)
        state.stack.push(BigNumber.from(this.sender))
      else throw new Error("undefined sender")
    },

    [VM.Opcodes.THIS_ADDRESS]: (state: StateJS, operand: number, data?: any) => {
      if (this.address !== undefined)
        state.stack.push(BigNumber.from(this.address))
      else throw new Error("undefined contract")
    },

    [VM.Opcodes.ITIERV2_REPORT]: (state: StateJS, operand: number, data?: any) => {
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

    [VM.Opcodes.ITIERV2_REPORT_TIME_FOR_TIER]: (state: StateJS, operand: number, data?: any) => {
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

    [VM.Opcodes.IERC20_BALANCE_OF]: (state: StateJS, operand: number, data?: any) => {
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

    [VM.Opcodes.IERC20_TOTAL_SUPPLY]: (state: StateJS, operand: number, data?: any) => {
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

    [VM.Opcodes.IERC721_BALANCE_OF]: (state: StateJS, operand: number, data?: any) => {
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
    
    [VM.Opcodes.IERC721_OWNER_OF]: (state: StateJS, operand: number, data?: any) => {
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

    [VM.Opcodes.IERC1155_BALANCE_OF]: (state: StateJS, operand: number, data?: any) => {
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

    [VM.Opcodes.IERC1155_BALANCE_OF_BATCH]: (state: StateJS, operand: number, data?: any) => {
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

    [VM.Opcodes.IERC20_SNAPSHOT_BALANCE_OF_AT]: (state: StateJS, operand: number, data?: number) => {
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

    [VM.Opcodes.IERC20_SNAPSHOT_TOTAL_SUPPLY_AT]: (state: StateJS, operand: number, data?: number) => {
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
    this.sender = toAddress(senderAddress);
  }

  /**
   * Method to set the class address property
   * 
   * @param contractAddress - a string number/hex string
   */
  public setContractAddress(contractAddress: string) {
    this.address = toAddress(contractAddress);
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
      let simulation = new RainJS(
        this.script,
        {applyOpFn: this.OpFns}
      )
      let result = simulation.run(data, index);
      return result;
    }
    else throw new Error("no script to execute")
  }
}

/**
 * @public
 * A class for creating a simulation environment for simulating a Sale contract off-chain using JSVM.
 */
export class SaleSimulation extends vmSimulation {

  /**
   * The sale address of this class that the simulation is done for. this is needed for THIS_ADDRESS opcode 
   * and updating storage types after method calls, and needs to be a string number or hex string.
   */
  public address: string;

  /**
   * The reedeemable token of this sale i.e rTKN which needs to a string number or hex string @see erc20
   */
  public token: erc20;

  /**
   * The reserve token of this sale as an erc20 type object @see erc20
   */
  public reserve: erc20;

  /**
   * The reserve token addres of this sale as an erc20 type object
   */
  public tokenAddress: string;

  /**
   * The reedeemable token address of this sale i.e rTKN which needs to be string number or hex string
   */
  public reserveAddress: string;

  /**
   * Constructor of this class
   * 
   * @param address - A string number or hex string
   * @param tokenAddress - A string number or hex string of the rTKN address
   * @param reserveAddress - A string number or hex string of the reserve token address
   * @param token - the rTKN
   * @param reserve - the reserve token
   */
  constructor (
    address: string,
    tokenAddress: string,
    reserveAddress: string,
    token: erc20,
    reserve: erc20
    ) {
      super();
      this.token = token;
      this.address = toAddress(address);
      this.reserve = reserve;
      this.tokenAddress = toAddress(tokenAddress);
      this.reserveAddress = toAddress(reserveAddress);

      if (this.erc20s[this.tokenAddress] === undefined) {
        this.erc20s[this.tokenAddress] = this.token;
      }
      if (this.erc20s[this.reserveAddress] === undefined) {
        this.erc20s[this.reserveAddress] = this.reserve;
      }
      if (this.erc20s[this.tokenAddress].balanceOf[this.address] === undefined) {
        this.erc20s[this.tokenAddress].balanceOf[this.address] = this.token.balanceOf[this.address]
      }
      if (this.erc20s[this.reserveAddress].balanceOf[this.address] === undefined) {
        this.erc20s[this.reserveAddress].balanceOf[this.address] = this.reserve.balanceOf[this.address]
      }
    }

  /**
   * Sale storage opcodes's functions body that use the class properties/types. @see ApplyOpFn and @see OpcodeFN
   */
  private storageOps: ApplyOpFn = {
    [SaleStorage.RemainingUnits]: (state: StateJS, operand: number, data?: any) => {
      state.stack.push(this.token.balanceOf[this.address])
    },
    [SaleStorage.TotalReserveIn]: (state: StateJS, operand: number, data?: any) => {
      state.stack.push(this.reserve.balanceOf[this.address])
    },
    [SaleStorage.TokenAddress]: (state: StateJS, operand: number, data?: any) => {
      state.stack.push(BigNumber.from(this.tokenAddress))
    },
    [SaleStorage.ReserveAddress]: (state: StateJS, operand: number, data?: any) => {
      state.stack.push(BigNumber.from(this.reserveAddress))
    }
  };

  /**
   * Method to simulate the sale's canLive results by using JSVM to run canLive script of a sale script.
   * requires the class's sender property to be defined
   * 
   * @param timestamp - (optional) custom timestamp to be used when running the script
   * @param blockNumber - (optional) custom block number to be used when running the script
   * 
   * @returns a boolean represting if the sale can live (active status - 1) or not
   */
  public async canLive(timestamp?: number, blockNumber?: number) : Promise<boolean> {
    let canLive: boolean;
    const canLive_entrypoint = 0;
    if (this.script && this.sender !== undefined) {
      let simulation = new SaleJS(
        this.script,
        {applyOpFn: this.OpFns, storageOpFn: this.storageOps,}
      )
      const result_ = await simulation.run(
        {timestamp, blockNumber},
        canLive_entrypoint
      );
      canLive = result_[0].isZero() ? false : true;
    }
    else throw new Error("no script or sender to execute canLive");
    return canLive;
  }

  /**
   * Method to simulate the sale's calculateBuy results by using JSVM to run calculateBuy script of a sale script.
   * requires the class's sender property to be defined
   * 
   * @param units - Units to get the calculation for
   * @param timestamp - (optional) custom timestamp to be used when running the script
   * @param blockNumber - (optional) custom block number to be used when running the script
   * 
   * @return a pair of BigNumbers represting amount and price 
   */
  public async calculateBuy(
    units: number,
    timestamp?: number,
    blockNumber?: number
  ): Promise<[BigNumber, BigNumber]> {
    let maxUnits;
    let price;
    const amount_price_entrypoint = 1;

    if (this.script && this.sender !== undefined) {
      let simulation = new SaleJS(
        this.script,
        {applyOpFn: this.OpFns, storageOpFn: this.storageOps,}
      )
      const result_ = await simulation.run(
        {context: [units], timestamp, blockNumber},
        amount_price_entrypoint
      );
      maxUnits = result_[result_.length - 2];
      price = result_[result_.length - 1];
    }
    else throw new Error("no script or sender to execute calculateBuy")
    return [maxUnits, price];
  }
  
  /**
   * Method to simulate the sale's calculateBuy results by using JSVM to run calculateBuy script of a sale script.
   * requires the class's sender property to be defined.
   * 
   * @remark after running this method all the defined class's related types/storage will get updated with new 
   * values that are result of the JSVM running the script. 
   * 
   * @param units - Units to get the calculation for
   * @param timestamp - (optional) custom timestamp to be used when running the script
   * @param blockNumber - (optional) custom block number to be used when running the script
   * 
   * @return void
   */
  public async buy(
    units: number,
    timestamp?: number,
    blockNumber?: number
  ): Promise<void> {
    const amount_price_entrypoint = 1;

    if (this.script && this.sender !== undefined) {
      let simulation = new SaleJS(
        this.script,
        {applyOpFn: this.OpFns, storageOpFn: this.storageOps,}
      )
      const result_ = await simulation.run(
        {context: [units], timestamp, blockNumber},
        amount_price_entrypoint
      );
      const maxUnits = result_[result_.length - 2];
      const price = result_[result_.length - 1];
      const Value_ = (maxUnits.mul(price)).div(eighteenZeros);

      if (Value_.lte(this.erc20s[this.reserveAddress].balanceOf[this.sender])) {
        if (this.token.balanceOf[this.address].gte(maxUnits)) {

          this.reserve.balanceOf[this.address] = this.reserve.balanceOf[this.address].add(Value_);
          this.token.balanceOf[this.address] = this.token.balanceOf[this.address].sub(maxUnits);

          this.erc20s[this.reserveAddress].balanceOf[this.address] = 
            this.erc20s[this.reserveAddress].balanceOf[this.address]
            .add(Value_);

          this.erc20s[this.tokenAddress].balanceOf[this.address] = 
            this.erc20s[this.tokenAddress].balanceOf[this.address]
            .sub(maxUnits);

          this.erc20s[this.reserveAddress].balanceOf[this.sender] = 
            this.erc20s[this.reserveAddress].balanceOf[this.sender]
            .sub(Value_);

          this.erc20s[this.tokenAddress].balanceOf[this.sender] = 
            this.erc20s[this.tokenAddress].balanceOf[this.sender]
            ? this.erc20s[this.tokenAddress].balanceOf[this.sender].add(maxUnits)
            : maxUnits;

          this.reserve.balanceOf[this.sender] = this.erc20s[this.reserveAddress].balanceOf[this.sender];
          this.token.balanceOf[this.sender] = this.erc20s[this.tokenAddress].balanceOf[this.sender];
          
        }
        else {
          this.reserve.balanceOf[this.address] = 
            this.reserve.balanceOf[this.address]
            .add((this.token.balanceOf[this.address].mul(price)).div(eighteenZeros));

          this.erc20s[this.tokenAddress].balanceOf[this.sender] =
            this.erc20s[this.tokenAddress].balanceOf[this.sender] 
            ? this.erc20s[this.tokenAddress].balanceOf[this.sender]
              .add(this.erc20s[this.tokenAddress].balanceOf[this.sender])
            : this.token.balanceOf[this.address];

          this.erc20s[this.reserveAddress].balanceOf[this.sender] =
            this.erc20s[this.reserveAddress].balanceOf[this.sender]
            .sub((this.erc20s[this.tokenAddress].balanceOf[this.sender].mul(price)).div(eighteenZeros));

          this.token.balanceOf[this.sender] = this.erc20s[this.tokenAddress].balanceOf[this.sender];
          this.reserve.balanceOf[this.sender] = this.erc20s[this.reserveAddress].balanceOf[this.sender];

          this.token.balanceOf[this.address] = ethers.constants.Zero;

          this.erc20s[this.tokenAddress].balanceOf[this.address] = ethers.constants.Zero;
          this.erc20s[this.reserveAddress].balanceOf[this.address] = this.reserve.balanceOf[this.address];
        }
      }
      else throw new Error("insufficient balance")
    }
    else throw new Error("no script or sender to perform the buy")
  }
}


/**
 * @public
 * A class for creating a simulation environment for simulating a EmissionsERC20 contract off-chain using JSVM.
 * 
 * @remark
 * this class is compatible with @see erc20 interface and @see itiers interface with using its address
 */
export class EmissionSmiulation extends vmSimulation {

  /**
   * The EmissionsERC20 address of this class that the simulation is done for. this is needed for THIS_ADDRESS opcode 
   * and updating storage types after method calls, and needs to be a string number or hex string.
   */
  public address: string;

  /**
   * A sender that performs the simulation transactions. this is needed for SENDER opcode simulation,
   * and updating storage types after method calls and needs to be a string number or hex string.
   */
  public sender: string;

  /**
   * The current totalSupply of the emissions token which can increase everytime a successful mint happens
   */
  public totalSupply: BigNumber = ethers.constants.Zero;

  /**
   * The decimals value of the emissions token which is 18
   */
  public readonly decimals: number = 18

  /**
   * The report of each claimant which is compatible and can be stored in @see itiers interface as well
   */
  public report: {[wallet: string]: BigNumber} = {};

  /**
   * The balance of emission token holders which is compatible with @see erc20 interface
   */
  public balanceOf: {[wallet: string]: BigNumber} = {};

  /**
   * Constructor of this class
   * 
   * @param address - this EmissionsERC20 class adress which needs to be a string number or hex string
   * @param sender - the sender which needs to be string number or hex string
   * @param reports - the reports of claimants
   * @param balances - the balances of token holders
   * @param initialSupply - (optional) emissions token initial supply for the sender
   */
  constructor (
    address: string,
    sender: string,
    reports: {[wallet: string]: BigNumber} = {},
    balances: {[wallet: string]: BigNumber} = {},
    initialSupply: BigNumber = ethers.constants.Zero,
  ) {
    super();
    this.address = toAddress(address);
    this.sender = toAddress(sender);
    this.report = reports;
    this.balanceOf = balances;
    this.totalSupply = initialSupply;
    if (initialSupply.gt(0)) {
      if (this.erc20s[this.address] === undefined) {
        this.erc20s[this.address] = {
          totalSupply: this.totalSupply,
          decimals: 18,
          balanceOf: {[this.sender]: BigNumber.from(initialSupply)}
        }
      }
      if (
        this.erc20s[this.address].balanceOf[this.sender] === undefined || 
        this.erc20s[this.address].balanceOf[this.sender].isZero()
      ) {
        this.erc20s[this.address].balanceOf[this.sender] = BigNumber.from(initialSupply)
      }
      if (this.balanceOf[this.sender] === undefined) {
        this.balanceOf[this.sender] = BigNumber.from(initialSupply)
      }
      else throw new Error("undefined sender")
    }
  }

  /**
   * Method to calculate the cliamable amount for the claimant by running the script by JSVM
   * 
   * @param claimantAccount - the account to calculate the claimable amount which needs to be string number or hex string
   * @param timestamp - (optional) custom timestamp to be used when running the script
   * @param blockNumber - (optional) custom block number to be used when running the script
   * 
   * @return A BigNumber that represents the claimable amount
   */
  public async calculateClaim(
    claimantAccount: string,
    timestamp?: number,
    blockNumber?: number
  ) : Promise<BigNumber> {
    const entrypoint = 0;
    const _claimantAccount = toAddress(claimantAccount)

    if (this.script !== undefined) {
      if (this.report[_claimantAccount] === undefined) {
        this.report[_claimantAccount] = ethers.constants.Zero;
      }
    let simulation = new EmissionsERC20JS(
      this.script,
      {applyOpFn: this.OpFns}
    );
    let claimUnits = await simulation.run(
      {context: [_claimantAccount], timestamp, blockNumber},
      entrypoint
    );
    return claimUnits[0]
    }
    else throw new Error("no script or sender to execute calculateClaim");
  }

  /**
   * The method to perform the claim (claculate and mint) for the claimant account by rruning by JSVM
   * 
   * @param claimantAccount - the account to calculate the claimable amount which needs to be string number or hex string 
   * @param timestamp - (optional) custom timestamp to be used when running the script
   * @param blockNumber - (optional) custom block number to be used when running the script
   * 
   * @return the minted amount in a BigNumber format
   */
  public async claim (
    claimantAccount: string,
    timestamp?: number,
    blockNumber?: number
  ) : Promise<BigNumber> {
    const entrypoint = 0;
    const _claimantAccount = toAddress(claimantAccount)

    if (this.script !== undefined) {
      if (this.report[_claimantAccount] === undefined) {
        this.report[_claimantAccount] = ethers.constants.Zero;
      }

      if (this.balanceOf[_claimantAccount] === undefined) {
        this.balanceOf[_claimantAccount] = ethers.constants.Zero;
      }

      if (this.erc20s[this.address].balanceOf[_claimantAccount] === undefined) {
        this.erc20s[this.address].balanceOf[_claimantAccount] = ethers.constants.Zero;
      }
      
      let simulation = new EmissionsERC20JS(
        this.script,
        {applyOpFn: this.OpFns}
      );
      let newReport = BigNumber.from(paddedUInt256(paddedUInt32(this.timestamp ? this.timestamp()! : timestamp!).repeat(8)))
      let mintUnits = await simulation.run(
        {context: [_claimantAccount], timestamp, blockNumber},
        entrypoint
      );       

      if (mintUnits[0].gt(ethers.constants.Zero)) {
        this.totalSupply = this.totalSupply.add(mintUnits[0]);
        this.balanceOf[_claimantAccount] = this.balanceOf[_claimantAccount].add(mintUnits[0]);
        this.report[_claimantAccount] = newReport;
        this.erc20s[this.address].balanceOf[_claimantAccount] = 
          this.erc20s[this.address].balanceOf[_claimantAccount].add(mintUnits[0]);
      }

      return mintUnits[0];
    }
    throw new Error("no script to execute")
  }
}


/**
 * @public
 * A class for creating a simulation environment for simulating a CombineTier contract off-chain using JSVM.
 * 
 * @remark
 * this class is compatible with @see itiers interface with using its address
 */
export class CombinetierSimulation extends vmSimulation {

  /**
   * The CombineTier address of this class that the simulation is done for. this is needed for THIS_ADDRESS opcode 
   * and updating storage types after method calls, and needs to be a string number or hex string.
   */
  public address: string;

  /**
   * The report of each account which is compatible and can be stored in @see itiers interface as well
   */
  public report: {[wallet: string]: BigNumber} = {};

  /**
   * Constructor of this class
   * 
   * @param address - this CombineTier class adress which needs to be a string number or hex string 
   * @param reports - (optional) the initial reports object
   */
  constructor (address: string, reports?: {[wallet: string]: BigNumber}) {
    super();
    this.address = address;
    if (reports !== undefined) {
      this.report = reports;
    }
  }

  /**
   * Method to get the report for an account which then will be stored in the class's report property and can be
   * accessed later on, each time this method is called it runs the JSVM for the scripts and updates the report of 
   * the account it is been called for
   * 
   * @param account - the account to get and update the report for which needs to be string number or hex string 
   * @param timestamp - (optional) custom timestamp to be used when running the script
   * @param blockNumber - (optional) custom block number to be used when running the script
   * 
   * @returns the report of the account in a 64 char length hex string
   */
  public async setReport(
    account: string,
    timestamp?: number,
    blockNumber?: number
  ): Promise<string> {
    const entrypoint = 0;
    const _account = toAddress(account)

    if (this.script !== undefined) { 
      let simulation = new CombineTierJS(
        this.script,
        {applyOpFn: this.OpFns}
      );
      const newReport = (await simulation.run(
        {context: [_account], timestamp, blockNumber},
        entrypoint
      ))[0];
      this.report[_account] = newReport;

      return paddedUInt256(newReport);
    }
    else throw new Error("no script to execute")
  }
}


/**
 * @public
 * A class for creating a simulation environment for simulating a Orderbook contract off-chain using JSVM.
 * or to be used to perform off-chain matchmaking based on.
 */
export class OrderbookSimulation extends vmSimulation {
  
  /**
   * The EmissionsERC20 address of this class that the simulation is done for. this is needed for THIS_ADDRESS opcode 
   * and updating storage types after method calls, and needs to be a string number or hex string.
   */
  public address: string;

  /**
   * A sender that performs the simulation transactions. this is needed for SENDER opcode simulation,
   * and updating storage types after method calls and needs to be a string number or hex string.
   */
  public sender: string;

  /**
   * The property that stores all the data of the class's vaults @see vault
   */
  public vaults: vaults = {};

  /**
   * The property that stores all the data of the class's orders, @see orders and @see order
   */
  public orders: orders = {};

  /**
   * The property that stores all the data of an order's total cleared amount, @see clearedFunds
   */
  public clearedFunds: clearedFunds = {};

  /**
   * The property that stores all the data of an order's total cleared amount to a specific counterparty address
   * which needs to be in form of a string number or hex string @see clearedCounterPartyFunds
   */
  public clearedCounterPartyFunds: clearedCounterPartyFunds = {};
  
  /**
   * Constructor of this class
   * 
   * @param address - this Orderbook's class adress which needs to be a string number or hex string
   * @param sender - the sender which needs to be string number or hex string
   * @param vaults - (optinal) the initial vaults object (vaults storage)
   * @param orders  - (optional) the initial orders
   */
  constructor(address: string, sender: string, vaults?: vaults, orders?: orders) {
    super();
    this.address = toAddress(address);
    this.sender = toAddress(sender);
    if (vaults !== undefined) {
      this.vaults = vaults;
    }
    if (orders !== undefined) {
      this.orders = orders;
    }
  }

  /**
   * Local Orderbook Opcodes' functions body for simulation that uses the class properties/types. @see ApplyOpFn and @see OpcodeFN
   */
  protected OpFns: ApplyOpFn = {

    ...this.OpFns,

    [OrderBook.Opcodes.ORDER_FUNDS_CLEARED]: 
      (state: StateJS, operand: number, data?: any) => {
        const item_ = state.stack.pop();
        if (item_ !== undefined) {
          const orderHash = paddedUInt256(item_);
          if (this.clearedFunds[orderHash] !== undefined) {
            state.stack.push(this.clearedFunds[orderHash]);
          }
          else throw new Error("no record of cleared funds for this orderHash")
        }
      else throw new Error("undefined stack value")
    },
    [OrderBook.Opcodes.COUNTERPARTY_FUNDS_CLEARED]: 
      (state: StateJS, operand: number, data?: any) => {
        const item2_ = state.stack.pop();
        const item1_ = state.stack.pop();
        if (item1_ && item2_ !== undefined) {
          const orderHash = paddedUInt256(item1_);
          const counterParty = paddedUInt160(item2_);
          if (this.clearedCounterPartyFunds[orderHash][counterParty] !== undefined) {
            state.stack.push(this.clearedCounterPartyFunds[orderHash][counterParty])
          }
          else throw new Error("no record of cleared funds for this orderHash's counterparty")
        }
      else throw new Error("undefined stack values")
    }
  };

  /**
   * Method to submit an order into the class orders
   * 
   * @param order - the order to add
   * @return void
   */
  public addOrder(order: order): void {
    this.orders[order.orderHash] = order;

    if (this.vaults[order.owner] === undefined) {
      this.vaults[order.owner] = {
        [order.inputToken]: {
          vaultId: {
            [order.inputVaultId]: ethers.constants.Zero
          }
        },
        [order.outputToken]: {
          vaultId: {
            [order.outputVaultId]: ethers.constants.Zero
          }
        }
      }
    }
    if (this.vaults[order.owner][order.inputToken] === undefined) {
      this.vaults[order.owner][order.inputToken] = {
        vaultId: {
          [order.inputVaultId]: ethers.constants.Zero
        }
      }
    }
    if (this.vaults[order.owner][order.outputToken] === undefined) {
      this.vaults[order.owner][order.outputToken] = {
        vaultId: {
          [order.outputVaultId]: ethers.constants.Zero
        }
      }
    }
    if (this.vaults[order.owner][order.inputToken].vaultId[order.inputVaultId] === undefined) {
      this.vaults[order.owner][order.inputToken].vaultId[order.inputVaultId] = ethers.constants.Zero;
    }
    if (this.vaults[order.owner][order.outputToken].vaultId[order.outputVaultId] === undefined) {
      this.vaults[order.owner][order.outputToken].vaultId[order.outputVaultId] = ethers.constants.Zero
    }
  }


  /**
   * Method to remove an order from the class's orders
   * 
   * @param order - the order to remove
   * @return void
   */
  public removeOrder(order: order | string): void {
    if (typeof order === "string") {
      delete(this.orders[order])
    }
    else {
      delete(this.orders[order.orderHash])
    }
  }

  /**
   * Method to dposit some units of token of tokenAddress into the vaultId of the sender 
   * 
   * @param sender - sender that deposit is done for
   * @param tokenAddress - the address of the token
   * @param vaultId - the vault ID to deposit
   * @param units - amount of token to deposit
   * @param tokenDecimals - (optional) decimals of the token, 18 will be used as default
   * 
   * @return void
   */
  public deposit (
    sender: string,
    tokenAddress: string,
    vaultId: string,
    units: number,
    tokenDecimals: number = 18
  ): void {
    const _sender = toAddress(sender);
    const units_ = parseUnits(
      units.toString(),
      tokenDecimals
    );
    if (this.erc20s[tokenAddress].balanceOf[_sender]) {
     if (this.erc20s[tokenAddress].balanceOf[_sender].gte(units_)) {
        this.erc20s[tokenAddress].balanceOf[_sender] =
        this.erc20s[tokenAddress].balanceOf[_sender].sub(units_)
      }
      else throw new Error("insufficient balance")
    }
    if (this.erc20s[tokenAddress].balanceOf[this.address]) {
      this.erc20s[tokenAddress].balanceOf[this.address] = 
        this.erc20s[tokenAddress].balanceOf[this.address].add(units_)
    }
    else {
      this.erc20s[tokenAddress] = {
        balanceOf: {
          [this.address]: units_
        },
        decimals: tokenDecimals,
        totalSupply: units_
      }
    }
    if (this.vaults[_sender] === undefined) {
      this.vaults[_sender] = {
        [tokenAddress]: {
          vaultId: {
            [vaultId]: ethers.constants.Zero
          }
        }
      }
    }
    if (this.vaults[_sender][tokenAddress] === undefined) {
      this.vaults[_sender][tokenAddress] = {
        vaultId: {
          [vaultId]: ethers.constants.Zero
        }
      }
    }
    if (this.vaults[_sender][tokenAddress].vaultId[vaultId] === undefined) {
      this.vaults[_sender][tokenAddress].vaultId[vaultId] = ethers.constants.Zero;
    }
    this.vaults[_sender][tokenAddress].vaultId[vaultId] = 
    this.vaults[_sender][tokenAddress].vaultId[vaultId].add(units_);
  }

  /**
   * Method to withdraw some units of token of tokenAddress from VaultId of the sender
   * 
   * @param sender - sender that withdraw is done for
   * @param tokenAddress - the address of the token
   * @param vaultId - the vault ID to withdraw
   * @param units - amount of token to withdraw 
   * 
   * @return void
   */
  public withdraw (
    sender: string,
    tokenAddress: string,
    vaultId: string,
    units: number,
    tokenDecimals: number = 18
  ): void {
    const _sender = toAddress(sender);

    if (this.vaults[_sender][tokenAddress].vaultId[vaultId] === undefined) {
      throw new Error("this vault doesnt not exist")
    }
    else {
      const units_ = parseUnits(units.toString(), tokenDecimals);
      if (this.erc20s[tokenAddress].balanceOf[_sender]) {
        this.erc20s[tokenAddress].balanceOf[_sender] =
        this.erc20s[tokenAddress].balanceOf[_sender].add(units_)
      }
      if (this.erc20s[tokenAddress].balanceOf[this.address]) {
        if (this.erc20s[tokenAddress].balanceOf[this.address].gte(units_)) {
          this.erc20s[tokenAddress].balanceOf[this.address] =
            this.erc20s[tokenAddress].balanceOf[this.address].sub(units_)
        }
        else this.erc20s[tokenAddress].balanceOf[this.address] = ethers.constants.Zero
      }

      this.vaults[_sender][tokenAddress].vaultId[vaultId] = 
      this.vaults[_sender][tokenAddress].vaultId[vaultId].gte(units_)
        ? this.vaults[_sender][tokenAddress].vaultId[vaultId].sub(units_)
        : ethers.constants.Zero
    }
  }

  /**
   * Method to perform the clear by JSVM for this simulation which will update all the present storage/types of the the class
   * 
   * @param a - order A to clear
   * @param b  - order B to clear
   * @param bountyConfig  - the BountyConfig type to collect bounties of this clear
   * @param timestamp - (optional) custom timestamp to be used when running the script
   * @param blockNumber - (optional) custom block number to be used when running the script
   * 
   * @return void
   */
  public async clear (
    a: order,
    b: order,
    bountyConfig: bountyConfig,
    timestamp?: number,
    blockNumber?: number
  ): Promise<void> {
    if (a.vmConfig && b.vmConfig && this.sender !== undefined) {
      const entrypoint = 0;
      const aJS = new OrderbookJS(a.vmConfig, {applyOpFn: this.OpFns});
      const bJS = new OrderbookJS(b.vmConfig, {applyOpFn: this.OpFns});

      const aResult_ = await aJS.run(
        {context: [a.orderHash, b.owner], timestamp, blockNumber},
        entrypoint
      );
      const bResult_ = await bJS.run(
        {context: [b.orderHash, a.owner], timestamp, blockNumber}, 
        entrypoint
      );

      const aOutputMax = aResult_[aResult_.length - 2];
      const bOutputMax = bResult_[bResult_.length - 2];
      const aPrice = aResult_[aResult_.length - 1];
      const bPrice = bResult_[bResult_.length - 1];
      
      const aStateChangeOutput = aOutputMax.gt((bOutputMax.mul(bPrice)).div(eighteenZeros)) 
        ? (bOutputMax.mul(bPrice)).div(eighteenZeros) 
        : aOutputMax;
      const bStateChangeOutput = bOutputMax.gt((aOutputMax.mul(aPrice)).div(eighteenZeros)) 
        ? (aOutputMax.mul(aPrice)).div(eighteenZeros) 
        : bOutputMax;

      if (!aStateChangeOutput.isZero() || !bStateChangeOutput.isZero()) {

        const aStateChangeInput = (aStateChangeOutput.mul(aPrice)).div(eighteenZeros);
        const bStateChangeInput = (bStateChangeOutput.mul(bPrice)).div(eighteenZeros);

        if (!aStateChangeOutput.sub(bStateChangeInput).isNegative() && !bStateChangeOutput.sub(aStateChangeInput).isNegative()) {
          
          if (this.vaults[this.sender] === undefined) {
            this.vaults[this.sender] = {
              [a.outputToken]: {
                vaultId: {
                  [bountyConfig.aVaultId]: ethers.constants.Zero
                }
              },
              [b.outputToken]: {
                vaultId: {
                  [bountyConfig.bVaultId]: ethers.constants.Zero
                }
              },
            }
          }

          if (this.vaults[this.sender][a.outputToken] === undefined) {
            this.vaults[this.sender][a.outputToken] = {
              vaultId: {
                [bountyConfig.aVaultId]: ethers.constants.Zero
              }
            }
          }

          if (this.vaults[this.sender][b.outputToken] === undefined) {
            this.vaults[this.sender][b.outputToken] = {
              vaultId: {
                [bountyConfig.bVaultId]: ethers.constants.Zero
              }
            }
          }

          if (this.vaults[this.sender][a.outputToken].vaultId[bountyConfig.aVaultId] === undefined) {
            this.vaults[this.sender][a.outputToken].vaultId[bountyConfig.aVaultId] = ethers.constants.Zero
          }

          if (this.vaults[this.sender][b.outputToken].vaultId[bountyConfig.bVaultId] === undefined) {
            this.vaults[this.sender][b.outputToken].vaultId[bountyConfig.bVaultId] = ethers.constants.Zero
          }

          if(this.clearedFunds[a.orderHash] === undefined) {
            this.clearedFunds[a.orderHash] = ethers.constants.Zero  
          }

          if(this.clearedFunds[b.orderHash] === undefined) {
            this.clearedFunds[b.orderHash] = ethers.constants.Zero  
          }

          if(this.clearedCounterPartyFunds[a.orderHash] === undefined) {
            this.clearedCounterPartyFunds[a.orderHash] = {
              [b.owner]: ethers.constants.Zero
            } 
          }

          if(this.clearedCounterPartyFunds[b.orderHash] === undefined) {
            this.clearedCounterPartyFunds[b.orderHash] = {
              [a.owner]: ethers.constants.Zero
            } 
          }

          this.vaults[this.sender][a.outputToken].vaultId[bountyConfig.aVaultId] =
            this.vaults[this.sender][a.outputToken].vaultId[bountyConfig.aVaultId]
            .add(aStateChangeOutput.sub(bStateChangeInput));

          this.vaults[this.sender][b.outputToken].vaultId[bountyConfig.bVaultId] =
            this.vaults[this.sender][b.outputToken].vaultId[bountyConfig.bVaultId]
            .add(bStateChangeOutput.sub(aStateChangeInput));

          this.vaults[a.owner][a.outputToken].vaultId[a.outputVaultId] =
            this.vaults[a.owner][a.outputToken].vaultId[a.outputVaultId].gte(aStateChangeOutput)
            ? this.vaults[a.owner][a.outputToken].vaultId[a.outputVaultId].sub(aStateChangeOutput)
            : ethers.constants.Zero;

          this.vaults[b.owner][b.outputToken].vaultId[b.outputVaultId] =
            this.vaults[b.owner][b.outputToken].vaultId[b.outputVaultId].gte(bStateChangeOutput)
            ? this.vaults[b.owner][b.outputToken].vaultId[b.outputVaultId].sub(bStateChangeOutput)
            : ethers.constants.Zero;

          this.vaults[a.owner][a.inputToken].vaultId[a.inputVaultId] =
            this.vaults[a.owner][a.inputToken].vaultId[a.inputVaultId].add(aStateChangeInput);

          this.vaults[b.owner][b.inputToken].vaultId[b.inputVaultId] =
            this.vaults[b.owner][b.inputToken].vaultId[b.inputVaultId].add(bStateChangeInput);

          this.clearedCounterPartyFunds[a.orderHash][b.owner] = 
            this.clearedCounterPartyFunds[a.orderHash][b.owner].add(aStateChangeOutput);

          this.clearedCounterPartyFunds[b.orderHash][a.owner] = 
            this.clearedCounterPartyFunds[b.orderHash][a.owner].add(bStateChangeOutput);

          console.log(`
          ********************************************************************

                    Order ${"0x" + a.orderHash.substring(2).padStart(40, "0")}
                    Successfully Cleared Agaisnt
                    Order ${"0x" + b.orderHash.substring(2).padStart(40, "0")}
          
          ********************************************************************
          `);

        }
        else console.log("negative clear not possible")
      }
    }
    else console.log("one or more orders have no script");
  }
 
}