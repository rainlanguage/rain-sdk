import {
  Contract,
  ContractReceipt,
  Signer,
  utils,
  Overrides,
  CallOverrides,
} from 'ethers';
import { Factory__factory } from './typechain';

/**
 * All the utils that ethers provide. Come from `ethers.utils`
 */
export const ethersUtils = utils;

export abstract class RainContract {
  public readonly signer: Signer;
  public readonly address: string;

  constructor(address: string, signer: Signer) {
    this.signer = signer;
    this.address = address;
  }

  public static getNewChildFromReceipt = (
    receipt: ContractReceipt,
    parentContract: Contract
  ): string => {
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
   * Checks if address is registered as a child contract of this factory
   * @param signer - An ethers.js Signer
   * @param factory - The factory address where check registration
   * @param maybeChild - Address to check registration for.
   * @returns `true` if address was deployed by this contract factory, otherwise `false`
   */
  protected static _isChild = async (
    signer: Signer,
    factory: string,
    maybeChild: string
  ) => {
    return await Factory__factory.connect(factory, signer).isChild(maybeChild);
  };
}

// TODO: Add doc to `ReadTxOverrides` so users can see all the fields that have CallOverrides from ethers
/**
 * More read about `ReadTxOverrides` that comes from CallOverrides of ethers
 */
export interface ReadTxOverrides extends CallOverrides {}

// TODO: Add doc to `TxOverrides` so users can see all the fields that have Overrides from ethers
/**
 * More read about `TxOverrides` that comes from Overrides of ethers
 */
export interface TxOverrides extends Overrides {}
