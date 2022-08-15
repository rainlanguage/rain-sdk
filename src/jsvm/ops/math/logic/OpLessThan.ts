import { ethers } from "ethers";
import { RainJSVM, StateJSVM } from "../../../RainJSVM";


/**
 * @public
 */
export function OpLessThan(this: RainJSVM, state: StateJSVM, operand: number, data?: any) : void {

    const item2_ = state.stack.pop();
    const item1_ = state.stack.pop();

    if (item1_ && item2_ !== undefined) {
        
        state.stack.push(
            item2_.gt(item1_) ? ethers.constants.One : ethers.constants.Zero
        );
    } 
    else throw new Error('Undefined stack variables');
}