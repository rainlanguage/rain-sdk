import { ethers } from "ethers";
import { vmSimulation } from "./vmSimulation";
import { OrderbookJSVM } from "../OrderbookJSVM";
import { OrderBook } from "../../contracts/orderBook";
import { paddedUInt160, paddedUInt256, parseUnits } from "../../utils";
import { 
	order,
	FnPtrs,
	orders,
	vaults,
	StateJSVM,
	bountyConfig,
	clearedFunds,
	eighteenZeros,
	clearedCounterPartyFunds
} from "../types";


/**
 * @public
 * A class for creating a simulation environment for simulating a Orderbook contract off-chain using JSVM.
 * or to be used to perform off-chain matchmaking based on.
 */
 export class OrderbookSimulation extends vmSimulation {
  
	/**
	 * @public
	 * The EmissionsERC20 address of this class that the simulation is done for. this is needed for THIS_ADDRESS opcode 
	 * and updating storage types after method calls, and needs to be a string number or hex string.
	 */
	public address: string;
  
	/**
	 * @public
	 * A sender that performs the simulation transactions. this is needed for SENDER opcode simulation,
	 * and updating storage types after method calls and needs to be a string number or hex string.
	 */
	public sender: string;
  
	/**
	 * @public
	 * The property that stores all the data of the class's vaults @see vault
	 */
	public vaults: vaults = {};
  
	/**
	 * @public
	 * The property that stores all the data of the class's orders, @see orders and @see order
	 */
	public orders: orders = {};
  
	/**
	 * @public
	 * The property that stores all the data of an order's total cleared amount, @see clearedFunds
	 */
	public clearedFunds: clearedFunds = {};
  
	/**
	 * @public
	 * The property that stores all the data of an order's total cleared amount to a specific counterparty address
	 * which needs to be in form of a string number or hex string @see clearedCounterPartyFunds
	 */
	public clearedCounterPartyFunds: clearedCounterPartyFunds = {};
	
	/**
	 * @public
	 * Constructor of this class
	 * 
	 * @param address - this Orderbook's class adress which needs to be a string number or hex string
	 * @param sender - the sender which needs to be string number or hex string
	 * @param vaults - (optinal) the initial vaults object (vaults storage)
	 * @param orders  - (optional) the initial orders
	 */
	constructor(address: string, sender: string, vaults?: vaults, orders?: orders) {
	  super();
	  this.address = paddedUInt160(address);
	  this.sender = paddedUInt160(sender);
	  if (vaults !== undefined) {
		this.vaults = vaults;
	  }
	  if (orders !== undefined) {
		this.orders = orders;
	  }
	}
  
	/**
	 * @public
	 * Local Orderbook Opcodes' functions body for simulation that uses the class properties/types. @see FnPtrs and @see OpcodeFN
	 */
	protected OpFns: FnPtrs = {
  
	  ...this.OpFns,
  
	  [OrderBook.Opcodes.ORDER_FUNDS_CLEARED]: 
		(state: StateJSVM, operand: number, data?: any) => {
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
		(state: StateJSVM, operand: number, data?: any) => {
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
	 * @public
	 * Method to submit an order into the class orders
	 * 
	 * @param order - the order to add
	 * @returns void
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
	 * @public
	 * Method to remove an order from the class's orders
	 * 
	 * @param order - the order to remove
	 * @returns void
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
	 * @public
	 * Method to dposit some units of token of tokenAddress into the vaultId of the sender 
	 * 
	 * @param sender - sender that deposit is done for
	 * @param tokenAddress - the address of the token
	 * @param vaultId - the vault ID to deposit
	 * @param units - amount of token to deposit
	 * @param tokenDecimals - (optional) decimals of the token, 18 will be used as default
	 * 
	 * @returns void
	 */
	public deposit (
	  sender: string,
	  tokenAddress: string,
	  vaultId: string,
	  units: number,
	  tokenDecimals: number = 18
	): void {
	  const _sender = paddedUInt160(sender);
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
	 * @public
	 * Method to withdraw some units of token of tokenAddress from VaultId of the sender
	 * 
	 * @param sender - sender that withdraw is done for
	 * @param tokenAddress - the address of the token
	 * @param vaultId - the vault ID to withdraw
	 * @param units - amount of token to withdraw 
	 * 
	 * @returns void
	 */
	public withdraw (
	  sender: string,
	  tokenAddress: string,
	  vaultId: string,
	  units: number,
	  tokenDecimals: number = 18
	): void {
	  const _sender = paddedUInt160(sender);
  
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
	 * @public
	 * Method to perform the clear by JSVM for this simulation which will update all the present storage/types of the the class
	 * 
	 * @param a - order A to clear
	 * @param b  - order B to clear
	 * @param bountyConfig  - the BountyConfig type to collect bounties of this clear
	 * @param timestamp - (optional) custom timestamp to be used when running the script
	 * @param blockNumber - (optional) custom block number to be used when running the script
	 * 
	 * @returns void
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
		const aJS = new OrderbookJSVM(a.vmConfig, {applyOpFn: this.OpFns});
		const bJS = new OrderbookJSVM(b.vmConfig, {applyOpFn: this.OpFns});
  
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