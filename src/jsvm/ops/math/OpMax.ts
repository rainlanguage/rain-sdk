import { max } from "../../lib/Math";
import { RainJSVM } from "../../RainJSVM";
import { StateJSVM } from "../../types";


/**
 * @public
 */
export function OpMax(this: RainJSVM,state: StateJSVM, operand: number, data?: any) : void {

    const items_ = state.stack.splice(-operand);

    if (items_.length === operand) {

        state.stack.push(max(items_));
    } 
    else throw new Error('Undefined stack variables');
}