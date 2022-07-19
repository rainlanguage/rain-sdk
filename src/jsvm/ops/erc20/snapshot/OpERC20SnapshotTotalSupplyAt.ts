import { ERC20 } from "../../../../contracts/generics/erc20";
import { paddedUInt160 } from "../../../../utils";
import { RainJSVM } from "../../../RainJSVM";
import { StateJSVM } from "../../../types";


/**
 * @public
 */
export async function OpERC20SnapshotTotalSupplyAt(this: RainJSVM, state: StateJSVM, operand: number, data?: any): Promise<void> {

	const item2_ = state.stack.pop();
	const item1_ = state.stack.pop();

	if (item1_ && item2_ && this.signer !== undefined) {

		const snapshotId_ = item2_;
		const erc20Address_ = paddedUInt160(item1_);
		const erc20Snapshot_ = new ERC20(erc20Address_, this.signer, true);

		state.stack.push(await erc20Snapshot_.totalSupplyAt!(snapshotId_));
		
	}
	else throw new Error('Undefined stack variables');
}