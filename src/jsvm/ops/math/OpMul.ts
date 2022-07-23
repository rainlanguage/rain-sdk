import { ethers } from "ethers";
import { RainJSVM } from "../../RainJSVM";
import { StateJSVM } from "../../types";


/**
 * @public
 */
export function OpMul(this: RainJSVM, state: StateJSVM, operand: number, data?: any) : void {

  let _accumulator = ethers.constants.One;
  let _item;

  for (let i = 0; i < operand; i++) {

      _item = state.stack.pop();

      if (_item !== undefined) {

      _accumulator = _accumulator.mul(_item);

      if (_accumulator.gt(ethers.constants.MaxUint256)) {
        
          throw new Error('max numeric range overflow');
      }
      }  
    else throw new Error('Undefined stack variables');
  }
  state.stack.push(_accumulator);

}