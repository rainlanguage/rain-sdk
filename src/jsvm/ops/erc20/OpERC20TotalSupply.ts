import { ERC20 } from "../../../contracts/generics/erc20";
import { paddedUInt160 } from "../../../utils";
import { RainJSVM } from "../../RainJSVM";
import { StateJSVM } from "../../types";


/**
 * @public 
 */
export async function OpERC20TotalSupply(this: RainJSVM, state: StateJSVM, operand: number, data?: any): Promise<void> {

  const item_ = state.stack.pop();

  if (item_ && this.signer !== undefined) {

    const erc20Address_ = paddedUInt160(item_);
    const erc20Contract_ = new ERC20(erc20Address_, this.signer);

    state.stack.push(await erc20Contract_.totalSupply());
  } 
  else throw new Error('Undefined stack variable');
}