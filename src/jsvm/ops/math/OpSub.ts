import { RainJSVM, StateJSVM } from "../../RainJSVM";


/**
 * @public
 */
export function OpSub(this: RainJSVM, state: StateJSVM, operand: number, data?: any) : void {

    const items_ = state.stack.splice(-operand);
    let _accumulator = items_.shift();
    let _item;

    if (_accumulator !== undefined) {

        for (let i = 1; i < operand; i++) {

            _item = items_.shift();

            if (_item !== undefined) {

                _accumulator = _accumulator.sub(_item);
            } 
            else throw new Error('Undefined stack variables');
        }
        if (_accumulator.isNegative()) {

            throw new Error('Invalid value (negative value not allowed)');
        }
        else state.stack.push(_accumulator);
    } 
    else throw new Error('Undefined stack variables');
}