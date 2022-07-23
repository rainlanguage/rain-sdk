import { ERC20 } from "../../../../contracts/generics/erc20";
import { paddedUInt160 } from "../../../../utils";
import { RainJSVM } from "../../../RainJSVM";
import { StateJSVM } from "../../../types";


/**
 * @public
 */
export async function OpERC20SnapshotBalanceOfAt(this: RainJSVM, state: StateJSVM, operand: number, data?: any): Promise<void> {

  const item3_ = state.stack.pop();
  const item2_ = state.stack.pop();
  const item1_ = state.stack.pop();

  if (item1_ && item2_ && item3_ && this.signer !== undefined) {

    const snapshotId_ = item3_;
    const account_ = paddedUInt160(item2_);
    const erc20Address_ = paddedUInt160(item1_);
    const erc20Snapshot_ = new ERC20(erc20Address_, this.signer, true);

    state.stack.push(await erc20Snapshot_.balanceOfAt!(account_, snapshotId_));

  } 
  else throw new Error('Undefined stack variables');
}