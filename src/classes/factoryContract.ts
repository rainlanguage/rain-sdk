import { ContractReceipt, Contract, Signer, utils } from 'ethers';
import { Factory__factory } from '../typechain';
import { RainContract } from './rainContract';

/**
 * @public
 * All contract factory should use this instead of directly Rain contract to take advantage
 * of specific method to factories
 */
export abstract class FactoryContract extends RainContract {
  /**
   * Get the child from a receipt obtain from a Factory transaction
   *
   * @param receipt - The receipt of the transaction
   * @param parentContract - Contract factory/parent that create the child. Can be the instance or the address
   * @returns The address of the child
   */
  public static getNewChildFromReceipt(
    receipt: ContractReceipt,
    parentContract: Contract | string
  ): string {
    const parentAddress =
      parentContract instanceof Contract
        ? parentContract.address
        : parentContract;

    const data = receipt.events?.find(
      (x) =>
        x.event === 'NewChild' &&
        x.address.toLowerCase() === parentAddress.toLowerCase()
    )?.data;

    if (data) {
      return utils.defaultAbiCoder.decode(['address', 'address'], data)[1];
    } else {
      throw new Error('NewChild not found in the receipt');
    }
  }

  /**
   * Checks if address is registered as a child contract of the factory in the chain.
   *
   * @param signer - An ethers.js Signer
   * @param maybeChild - Address to check registration for.
   * @returns `true` if address was deployed by this contract factory, otherwise `false`
   */
  protected static async _isChild(
    signer: Signer,
    maybeChild: string
  ): Promise<boolean> {
    return await Factory__factory.connect(
      this.getBookAddress(await this.getChainId(signer)),
      signer
    ).isChild(maybeChild);
  }
}
