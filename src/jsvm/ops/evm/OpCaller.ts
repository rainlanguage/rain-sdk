import { BigNumber } from "ethers";
import { RainJSVM, StateJSVM } from "../../RainJSVM";


/**
 * @public
 */
export async function OpCaller(
    this: RainJSVM,
    state: StateJSVM,
    operand: number,
    data?: any
): Promise<void> {

    if (this.signer !== undefined) {

        state.stack.push(
            BigNumber.from(
                await this.signer.getAddress()
            )
        );
    }
    else throw new Error("undefined signer or signer address")
}