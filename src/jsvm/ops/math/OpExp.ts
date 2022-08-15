import { ethers } from "ethers";
import { RainJSVM, StateJSVM } from "../../RainJSVM";


/**
 * @public
 */
export function OpExp(this: RainJSVM, state: StateJSVM, operand: number, data?: any) : void {

    const items_ = state.stack.splice(-operand);
    let _accumulator = items_.shift();
    let _item;

    if (_accumulator !== undefined) {

        for (let i = 1; i < operand; i++) {

            _item = items_.shift();

            if (_item !== undefined) {

                _accumulator = _accumulator.pow(_item);

                if (_accumulator.gt(ethers.constants.MaxUint256)) {
                
                    throw new Error('max numeric range overflow');
                }
            } 
            else throw new Error('Undefined stack variables');
        }
        state.stack.push(_accumulator);
    } 
    else throw new Error('Undefined stack variables');
}