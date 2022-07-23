import { BigNumber } from "ethers";
import { RainJSVM } from "../../RainJSVM";
import { StateJSVM } from "../../types";

/**
 * @public
 */
export async function OpTimestamp(this: RainJSVM, state: StateJSVM, operand: number, data?: any): Promise<void> {

  if (this.signer !== undefined) {

      const _provider = this.signer.provider;
    
      if (_provider !== undefined) {

      state.stack.push(
          BigNumber.from(
          (await _provider.getBlock(await _provider.getBlockNumber())).timestamp
          )
      )
      }
      else throw new Error("Undefined provider")
  } 
  else throw new Error('Undefined Signer');
}