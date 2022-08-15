import { RainJSVM, StateJSVM } from "../../../RainJSVM";
import { saturatingSub } from "../../../lib/SaturatingMath";


/**
 * @public
 */
export function OpSaturatingSub(this: RainJSVM, state: StateJSVM, operand: number, data?: any): void {

    const items_ = state.stack.splice(-operand);
    let _accumulator = items_.shift();
    let _item;

    if (_accumulator !== undefined) {

        for (let i = 1; i < operand; i++) {
            _item = items_.shift();
    
            if (_item !== undefined) {
    
                _accumulator = saturatingSub(_accumulator, _item)
            } 
            else throw new Error('Undefined stack variables');
        }
        state.stack.push(_accumulator);
    }
    else throw new Error('Undefined stack variables');
}