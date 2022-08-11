import { ERC721 } from "../../../contracts/generics/erc721";
import { paddedUInt160 } from "../../../utils";
import { RainJSVM } from "../../RainJSVM";
import { StateJSVM } from "../../types";


/**
 * @public
 */
export async function OpERC721BalanceOf(
    this: RainJSVM,
    state: StateJSVM,
    operand: number,
    data?: any
): Promise<void> {

    const item2_ = state.stack.pop();
    const item1_ = state.stack.pop();

    if (item1_ && item2_ && this.signer !== undefined) {
        const account_ = paddedUInt160(item2_);
        const erc721Address_ = paddedUInt160(item1_);
        const erc721Contract_ = new ERC721(erc721Address_, this.signer);

        state.stack.push(await erc721Contract_.balanceOf(account_));

    } 
    else throw new Error('Undefined stack variables');
}
