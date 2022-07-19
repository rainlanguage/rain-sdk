import { RainJSVM } from "../../RainJSVM";
import { selectLte } from "../../lib/TierwiseCombine";
import { StateJSVM } from "../../types";


/**
 * @public
 */
export function OpSelectLte(this: RainJSVM, state: StateJSVM, operand: number, data?: any) : void {

	const length_ = operand & 31;
	const mode_ = (operand & 96) >> 5;
	const logic_ = (operand & 128) >> 7;
	const timestamp_ = state.stack.pop();
	const reports_ = state.stack.splice(-length_)

	if (timestamp_ !== undefined && reports_.length === length_) {

		state.stack.push(
			selectLte(reports_, timestamp_, logic_, mode_, length_)
		);
		
	}
	else throw new Error("Undefined stack variables")

}