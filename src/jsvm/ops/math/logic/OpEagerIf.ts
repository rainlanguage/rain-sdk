import { RainJSVM } from "../../../RainJSVM";
import { StateJSVM } from "../../../types";


export function OpEagerIf(this: RainJSVM, state: StateJSVM, operand: number, data?: any) : void {

	const false_ = state.stack.pop();
	const true_ = state.stack.pop();
	const condition_ = state.stack.pop();

	if (false_ && true_ && condition_ !== undefined) {

	  	state.stack.push(condition_.gt(0) ? true_ : false_);

	} 
	else throw new Error('Undefined stack variables');

}