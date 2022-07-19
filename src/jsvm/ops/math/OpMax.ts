import { RainJSVM } from "../../RainJSVM";
import { StateJSVM } from "../../types";

export function OpMax(this: RainJSVM,state: StateJSVM, operand: number, data?: any) : void {

	const items_ = state.stack.splice(-operand);

	if ((items_.length = operand)) {

	  	state.stack.push(
			items_.reduce((e, m) => (e.gt(m) ? e : m))
		);

	} 
	else throw new Error('Undefined stack variables');
}