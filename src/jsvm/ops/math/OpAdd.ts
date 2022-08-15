import { ethers } from "ethers";
import { RainJSVM, StateJSVM } from "../../RainJSVM";


/**
 * @public
 */
export function OpAdd(this: RainJSVM, state: StateJSVM, operand: number, data?: any): void  {

    let _item;
    let _accumulator = ethers.constants.Zero;

    for (let i = 0; i < operand; i++) {

        _item = state.stack.pop();

        if (_item !== undefined) {

            _accumulator = _accumulator.add(_item);
        
            if (_accumulator.gt(ethers.constants.MaxUint256)) {

                throw new Error('max numeric range overflow');
            }
        } 
        else throw new Error('Undefined stack variables');
    }
    state.stack.push(_accumulator);

}