import { BigNumber } from "ethers";
import { RainJSVM } from "../../RainJSVM";
import { StateJSVM } from "../../types";


/**
 * @public
 */
export function OpThisAddress(this: RainJSVM, state: StateJSVM, operand: number, data?: any): void {

    if (this.self !== undefined) {

        state.stack.push(
            BigNumber.from(this.self)
        );
    } 
    else throw new Error('Undefined contract');
}