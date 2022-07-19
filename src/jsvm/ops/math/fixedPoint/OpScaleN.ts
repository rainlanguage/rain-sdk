import { RainJSVM } from "../../../RainJSVM";
import { scaleN } from "../../../lib/FixedPointMath";
import { StateJSVM } from "../../../types";


/**
 * @public
 */
export function OpScaleN(this: RainJSVM, state: StateJSVM, operand: number, data?: any): void {

	const item_ = state.stack.pop();

	if (item_ !== undefined) {

		state.stack.push(
			scaleN(item_, operand)
		)

	} 
	else throw new Error('Undefined stack variable');
	
}