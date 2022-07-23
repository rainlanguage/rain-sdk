import { RainJSVM } from "../../RainJSVM";
import { StateJSVM } from "../../types";


/**
 * @public
 */
export function OpMin(this: RainJSVM,state: StateJSVM, operand: number, data?: any) : void {

  const items_ = state.stack.splice(-operand);

  if (items_.length === operand) {

      state.stack.push(
      items_.reduce((e, m) => (e.lt(m) ? e : m))
    );

  } 
  else throw new Error('Undefined stack variables');
}