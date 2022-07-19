import { fixedPointDiv } from "../../../lib/FixedPointMath";
import { RainJSVM } from "../../../RainJSVM";
import { StateJSVM } from "../../../types";


export function OpScale18Div(this: RainJSVM, state: StateJSVM, operand: number, data?: any): void {

	const item2_ = state.stack.pop();
	const item1_ = state.stack.pop();

	if (item1_ && item2_ !== undefined) {

		state.stack.push(
			fixedPointDiv(item1_, item2_, operand)
		);
		
	} 
	else throw new Error('Undefined stack variables');

}