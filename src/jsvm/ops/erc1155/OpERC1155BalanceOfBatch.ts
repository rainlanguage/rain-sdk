import { BigNumber } from "ethers";
import { ERC1155 } from "../../../contracts/generics/erc1155";
import { paddedUInt160 } from "../../../utils";
import { RainJSVM } from "../../RainJSVM";
import { StateJSVM } from "../../types";


/**
 * @public
 */
export async function OpERC1155BalanceOfBatch(this: RainJSVM, state: StateJSVM, operand: number, data?: any): Promise<void> {

	const item3_ = state.stack.splice(-(operand + 1));
	const item2_ = state.stack.splice(-(operand + 1));
	const item1_ = state.stack.pop();

	if (
		item1_ &&
		item2_ &&
		item3_ &&
		this.signer !== undefined &&
		item2_.length === item3_.length
	) {
		const tokenIds_: BigNumber[] = [];
		for (let i = 0; i < item3_.length; i++) {
			tokenIds_.push(BigNumber.from(item3_[i]));
		}
		const accounts_: string[] = [];
		for (let i = 0; i < item2_.length; i++) {
			accounts_.push(paddedUInt160(item2_[i]));
		}
		const erc1155Address_ = paddedUInt160(item1_);
		const erc1155Contract_ = new ERC1155(erc1155Address_, this.signer);
		
		state.stack.push(
			...(await erc1155Contract_.balanceOfBatch(accounts_, tokenIds_))
	  	);

	} 
	else throw new Error('Undefined stack variable');
}