import { BigNumber } from "ethers";
import { RainJSVM, StateJSVM } from "../../RainJSVM";


/**
 * @public
 */
export async function OpBlockNumber(
    this: RainJSVM,
    state: StateJSVM,
    operand: number,
    data?: any
): Promise<void> {

    if (this.signer !== undefined) {
        
        const _provider = this.signer.provider;
        
        if (_provider !== undefined) {

            state.stack.push(
                BigNumber.from(
                    await _provider.getBlockNumber()
                )
            )
        }
        else throw new Error("undefined Provider")
    } 

    else throw new Error('Undefined Signer');
}