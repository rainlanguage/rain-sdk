import { RainJSVM } from "../../RainJSVM";
import { saturatingDiff } from "../../lib/TierwiseCombine";
import { StateJSVM } from "../../types";

export function OpSaturatingDiff(this: RainJSVM, state: StateJSVM, operand: number, data?: any): void {

	const item2_ = state.stack.pop();
	const item1_ = state.stack.pop();
	
	if (item1_ && item2_ !== undefined) {

		state.stack.push(
			saturatingDiff(item1_, item2_)
		);

	} 
	else throw new Error('Undefined stack variables');

}