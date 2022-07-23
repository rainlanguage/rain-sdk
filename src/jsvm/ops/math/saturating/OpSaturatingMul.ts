import { RainJSVM } from "../../../RainJSVM";
import { saturatingMul } from "../../../lib/SaturatingMath";
import { StateJSVM } from "../../../types";


/**
 * @public 
 */
export function OpSaturatingMul(this: RainJSVM, state: StateJSVM, operand: number, data?: any) : void {

  const items_ = state.stack.splice(-operand);
  let _accumulator = items_.shift();
  let _item;

  if (_accumulator !== undefined) {

    for (let i = 1; i < operand; i++) {

      _item = items_.shift();

      if (_item !== undefined) {

        _accumulator = saturatingMul(_accumulator, _item);

      } 
      else throw new Error('Undefined stack variabble');
      }
      state.stack.push(_accumulator);
  } 
  else throw new Error('Undefined stack variables');

}