import { ContractReceipt, Contract, Signer } from 'ethers';
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
  public static readonly getNewChildFromReceipt = (
    receipt: ContractReceipt,
    parentContract: Contract | string
  ): string => {
    if (parentContract instanceof Contract) {
      parentContract = parentContract.address;
    }

    const event = receipt.events?.filter(
      event =>
        event.event === 'NewChild' &&
        event.address.toUpperCase() === parentContract.toUpperCase()
    )[0];

    return event?.decode?.(event.data, event.topics).child;
  };

  /**
   * Checks if address is registered as a child contract of the factory in the chain.
   * Should be implemented in sub-classes that repreent factories to expose it.
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
