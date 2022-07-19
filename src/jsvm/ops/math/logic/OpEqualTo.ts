import { ethers } from "ethers";
import { RainJSVM } from "../../../RainJSVM";
import { StateJSVM } from "../../../types";


/**
 * @public 
 */
export function OpEqualTo(this: RainJSVM, state: StateJSVM, operand: number, data?: any) : void {

	const item2_ = state.stack.pop();
	const item1_ = state.stack.pop();

	if (item1_ && item2_ !== undefined) {

	  	state.stack.push(
			item2_.eq(item1_) ? ethers.constants.One : ethers.constants.Zero
	  	);
	} 
	else throw new Error('Underfined stack variables');
}