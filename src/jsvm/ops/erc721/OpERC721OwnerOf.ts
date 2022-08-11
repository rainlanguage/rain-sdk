import { BigNumber } from "ethers";
import { ERC721 } from "../../../contracts/generics/erc721";
import { paddedUInt160 } from "../../../utils";
import { RainJSVM } from "../../RainJSVM";
import { StateJSVM } from "../../types";


/**
 * @public
 */
export async function OpERC721OwnerOf(
    this: RainJSVM,
    state: StateJSVM,
    operand: number,
    data?: any
): Promise<void> {

    const item2_ = state.stack.pop();
    const item1_ = state.stack.pop();

    if (item1_ && item2_ && this.signer !== undefined) {

        const tokenId_ = BigNumber.from(item2_);
        const erc721Address_ = paddedUInt160(item1_);
        const erc721Contract_ = new ERC721(erc721Address_, this.signer);

        state.stack.push(
            BigNumber.from(await erc721Contract_.ownerOf(tokenId_))
        );

    } 
    else throw new Error('Undefined stack variable');
}