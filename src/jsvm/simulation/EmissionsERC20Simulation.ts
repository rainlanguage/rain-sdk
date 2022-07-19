import { BigNumber, ethers } from "ethers";
import { paddedUInt160, paddedUInt256, paddedUInt32 } from "../../utils";
import { EmissionsERC20JSVM } from "../EmissionsERC20JSVM";
import { vmSimulation } from "./vmSimulation";


/**
 * @public
 * A class for creating a simulation environment for simulating a EmissionsERC20 contract off-chain using JSVM.
 * 
 * @remarks
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
	  this.address = paddedUInt160(address);
	  this.sender = paddedUInt160(sender);
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
	 * @returns A BigNumber that represents the claimable amount
	 */
	public async calculateClaim(
	  claimantAccount: string,
	  timestamp?: number,
	  blockNumber?: number
	) : Promise<BigNumber> {
	  const entrypoint = 0;
	  const _claimantAccount = paddedUInt160(claimantAccount)
  
	  if (this.script !== undefined) {
		if (this.report[_claimantAccount] === undefined) {
		  this.report[_claimantAccount] = ethers.constants.Zero;
		}
	  let simulation = new EmissionsERC20JSVM(
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
	 * @returns the minted amount in a BigNumber format
	 */
	public async claim (
	  claimantAccount: string,
	  timestamp?: number,
	  blockNumber?: number
	) : Promise<BigNumber> {
	  const entrypoint = 0;
	  const _claimantAccount = paddedUInt160(claimantAccount)
  
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
		
		let simulation = new EmissionsERC20JSVM(
		  this.script,
		  {applyOpFn: this.OpFns}
		);
		let newReport = BigNumber.from(paddedUInt256(paddedUInt32(this.timestamp ? this.timestamp : timestamp!).repeat(8)))
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