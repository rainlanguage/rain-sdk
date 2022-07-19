import { RainJSVM } from "../../../RainJSVM";
import { scaleBy } from "../../../lib/FixedPointMath";
import { StateJSVM } from "../../../types";


export function OpScaleBy(this: RainJSVM, state: StateJSVM, operand: number, data?: any): void {

	const item_ = state.stack.pop();

	if (item_ !== undefined) {

		state.stack.push(scaleBy(item_, operand))

	}
	else throw new Error("Undefined stack variable")
	
}