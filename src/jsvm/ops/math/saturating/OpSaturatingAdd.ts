import { RainJSVM } from "../../../RainJSVM";
import { saturatingAdd } from "../../../lib/SaturatingMath";
import { StateJSVM } from "../../../types";
import { ethers } from "ethers";


/**
 * @public
 */
export function OpSaturatingAdd(this: RainJSVM, state: StateJSVM, operand: number, data?: any) : void {

  const items_ = state.stack.splice(-operand);
  let _accumulator = ethers.constants.Zero;
  let _item;

  for (let i = 0; i < operand; i++) {

    _item = items_.shift();

    if (_item !== undefined) {

      _accumulator = saturatingAdd(_accumulator, _item)

    } 
    else throw new Error('Undefined stack variables');
  }
  state.stack.push(_accumulator);
  
}