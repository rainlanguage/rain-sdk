import { RainJSVM } from "../../RainJSVM";
import { updateTimesForTierRange } from "../../lib/TierReport";
import { StateJSVM } from "../../types";


/**
 * @public
 */
export function OpUpdateTimesForTierRange(this: RainJSVM, state: StateJSVM, operand: number, data?: any) : void {

    const item2_ = state.stack.pop();
    const item1_ = state.stack.pop();

    if (item1_ && item2_ !== undefined) {

        state.stack.push(
            updateTimesForTierRange(item1_, item2_, operand)
        );
    } 
    else throw new Error('Undefined stack variables');
}