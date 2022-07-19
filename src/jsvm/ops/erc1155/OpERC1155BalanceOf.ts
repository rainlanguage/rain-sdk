import { BigNumber } from "ethers";
import { ERC1155 } from "../../../contracts/generics/erc1155";
import { paddedUInt160 } from "../../../utils";
import { RainJSVM } from "../../RainJSVM";
import { StateJSVM } from "../../types";


export async function OpERC1155BalanceOf(this: RainJSVM, state: StateJSVM, operand: number, data?: any): Promise<void> {

	const item3_ = state.stack.pop();
	const item2_ = state.stack.pop();
	const item1_ = state.stack.pop();

	if (item1_ && item2_ && item3_ && this.signer !== undefined) {

	  const id_ = BigNumber.from(item3_);
	  const account_ = paddedUInt160(item2_);
	  const erc1155Address_ = paddedUInt160(item1_);
	  const erc1155Contract_ = new ERC1155(erc1155Address_, this.signer);

	  state.stack.push(await erc1155Contract_.balanceOf(account_, id_));

	} 
	else throw new Error('Undefined stack variables');
}