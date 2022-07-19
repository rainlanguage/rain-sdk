import { BigNumber, ethers } from "ethers";
import { SaleStorage } from "../../contracts/sale";
import { paddedUInt160 } from "../../utils";
import { SaleJSVM } from "../SaleJSVM";
import { eighteenZeros, erc20, FnPtrs, StateJSVM } from "../types";
import { vmSimulation } from "./vmSimulation";


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
		this.address = paddedUInt160(address);
		this.reserve = reserve;
		this.tokenAddress = paddedUInt160(tokenAddress);
		this.reserveAddress = paddedUInt160(reserveAddress);
  
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
	 * Sale storage opcodes's functions body that use the class properties/types. @see FnPtrs and @see OpcodeFN
	 */
	private storageOps: FnPtrs = {
	  [SaleStorage.RemainingUnits]: (state: StateJSVM, operand: number, data?: any) => {
		state.stack.push(this.token.balanceOf[this.address])
	  },
	  [SaleStorage.TotalReserveIn]: (state: StateJSVM, operand: number, data?: any) => {
		state.stack.push(this.reserve.balanceOf[this.address])
	  },
	  [SaleStorage.TokenAddress]: (state: StateJSVM, operand: number, data?: any) => {
		state.stack.push(BigNumber.from(this.tokenAddress))
	  },
	  [SaleStorage.ReserveAddress]: (state: StateJSVM, operand: number, data?: any) => {
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
		let simulation = new SaleJSVM(
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
		let simulation = new SaleJSVM(
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
		let simulation = new SaleJSVM(
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