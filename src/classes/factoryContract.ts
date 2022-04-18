import { ContractReceipt, Signer } from 'ethers';
import { Factory__factory, Factory } from '../typechain';
import { RainContract, ethersUtils } from './rainContract';

/**
 * All contract factory should use this instead of directly Rain contract to take advantage
 * of specific method to factories
 */
export abstract class FactoryContract extends RainContract {
  public static readonly getNewChildFromReceipt = (
    receipt: ContractReceipt,
    parentContract: Factory
  ): string => {
    // Using a factory instead contract?
    return ethersUtils.defaultAbiCoder.decode(
      ['address', 'address'],
      receipt.events.filter(
        event =>
          event.event === 'NewChild' &&
          event.address.toUpperCase() === parentContract.address.toUpperCase()
      )[0].data
    )[1];
  };

  /**
   * Checks if address is registered as a child contract of the factory in the chain.
   * Should be implemented in sub-classes that repreent factories to expose it.
   *
   * @param signer - An ethers.js Signer
   * @param maybeChild - Address to check registration for.
   * @returns `true` if address was deployed by this contract factory, otherwise `false`
   */
  public static async _isChild(
    signer: Signer,
    maybeChild: string
  ): Promise<boolean> {
    return await Factory__factory.connect(
      this.getBookAddress(await this.getChainId(signer)),
      signer
    ).isChild(maybeChild);
  }
}
