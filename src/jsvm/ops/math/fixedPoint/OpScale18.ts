import { RainJSVM, StateJSVM } from "../../../RainJSVM";
import { scale18 } from "../../../lib/FixedPointMath";


/**
 * @public
 */
export function OpScale18(this: RainJSVM, state: StateJSVM, operand: number, data?: any): void {
  
    const item_ = state.stack.pop();

    if (item_ !== undefined) {

        state.stack.push(
            scale18(item_, operand)
        );
    } 
    else throw new Error('Undefined stack variable');
}
