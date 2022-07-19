import { ethers } from "ethers";
import { RainJSVM } from "../../../RainJSVM";
import { StateJSVM } from "../../../types";


/**
 * @public
 */
export function OpIsZero(this: RainJSVM, state: StateJSVM, operand: number, data?: any) : void {

	const item_ = state.stack.pop();

	if (item_ !== undefined) {

	  	state.stack.push(
			item_.isZero() ? ethers.constants.One : ethers.constants.Zero
	  	);
	} 
	else throw new Error('Undefined stack variable');
	
}