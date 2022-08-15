import { ethers } from "ethers";
import { RainJSVM, StateJSVM } from "../../../RainJSVM";


/**
 * @public
 */
export function OpAny(this: RainJSVM, state: StateJSVM, operand: number, data?: any): void {

    const items_ = state.stack.splice(-operand);
    let _check;
    let _item;

    for (let i = 0; i < operand; i++) {

        _item = items_.shift();

        if (_item !== undefined) {

            if (_item.gt(0)) {

                _check = ethers.constants.One;
                break;
            } 
            else _check = ethers.constants.Zero;
        } 
        else throw new Error('Undefined stack variables');
    }
    if (_check !== undefined) {

        state.stack.push(_check);
    } 
    else throw new Error('Undefined stack variable');
}