import { Contract, ContractReceipt, ethers } from 'ethers';

export abstract class RainContract {
  public static getNewChildFromReceipt = (
    receipt: ContractReceipt,
    parentContract: Contract
  ): string => {
    return ethers.utils.defaultAbiCoder.decode(
      ['address', 'address'],
      receipt.events.filter(
        event =>
          event.event === 'NewChild' &&
          event.address.toUpperCase() === parentContract.address.toUpperCase()
      )[0].data
    )[1];
  };
}
