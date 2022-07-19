import { BigNumber } from "ethers";
import { paddedUInt160, paddedUInt256 } from "../../utils";
import { CombineTierJSVM } from "../CombineTierJSVM";
import { vmSimulation } from "./vmSimulation";


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
	  const _account = paddedUInt160(account)
  
	  if (this.script !== undefined) { 
		let simulation = new CombineTierJSVM(
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