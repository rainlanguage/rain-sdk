import { ITierV2, Tier } from "../../../classes/iTierV2";
import { paddedUInt160 } from "../../../utils";
import { RainJSVM } from "../../RainJSVM";
import { StateJSVM } from "../../types";


/**
 * @public 
 */
export async function OpITierV2ReportTimesForTier(this: RainJSVM, state: StateJSVM, operand: number, data?: any): Promise<void> {

	const context_ = operand ? state.stack.splice(-operand) : [];
	const item3_ = state.stack.pop();

	if (item3_ !== undefined && item3_.toNumber() > Tier.ONE && item3_.toNumber() < Tier.EIGHT) {

	  	const item2_ = state.stack.pop();
	  	const item1_ = state.stack.pop();

	  	if (item1_ && item2_  && this.signer !== undefined && context_.length === operand) {
			const tier_ = item3_;
			const account_ = paddedUInt160(item2_);
			const iTierV2Contract = new ITierV2(
		  		paddedUInt160(item1_),
		  		this.signer
		);

		state.stack.push(
		  	await iTierV2Contract.reportTimeForTier(account_, tier_,context_)
		);
	  }
	  else throw new Error('Undefined stack variables');

	}
	else throw new Error("not valid tier"); 

}