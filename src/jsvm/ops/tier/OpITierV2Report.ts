import { ITierV2 } from "../../../classes/iTierV2";
import { paddedUInt160 } from "../../../utils";
import { RainJSVM } from "../../RainJSVM";
import { StateJSVM } from "../../types";


/**
 * @public
 */
export async function OpITierV2Report(this: RainJSVM, state: StateJSVM, operand: number, data?: any): Promise<void> {

    const context_ = operand ? state.stack.splice(-operand) : [];
    const item2_ = state.stack.pop();
    const item1_ = state.stack.pop();

    if (item1_ && item2_ && this.signer !== undefined && context_.length === operand) {

        const account_ = paddedUInt160(item2_);
        const iTierV2Contract = new ITierV2(
            paddedUInt160(item1_),
            this.signer
        );

        state.stack.push(
            await iTierV2Contract.report(account_, context_)
        );

    } 
    else throw new Error('Undefined stack variables');
}