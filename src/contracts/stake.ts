import {
  Signer,
  BigNumber,
  BigNumberish,
  BytesLike,
  ContractTransaction,
} from 'ethers';
import { TxOverrides, ReadTxOverrides } from '../classes/rainContract';
import { FactoryContract } from '../classes/factoryContract';

import { Stake__factory, StakeFactory__factory } from '../typechain';

/**
 * @public
 * A class for calling methods on a Stake.
 *
 * @remarks
 * This class provides an easy way to interact with Stake contracts.
 *
 * @example
 * ```typescript
 * import { Stake } from 'rain-sdk';
 *
 * // To get a instance of an already deployed stake contract, pass the contract address and an ethers.js Signer
 * const stake = new Stake(address, signer);
 *
 * // Check if an address is child from the factory deployed in the current chain.
 * await Stake.isChild(signer, maybeChildAddress);
 *```
 */

export class Stake extends FactoryContract {
  protected static readonly nameBookReference: string = 'stakeFactory';

  /**
   * Constructs a new Stake from a known address.
   *
   * @param address - The address of the Stake contract
   * @param signer - An ethers.js Signer
   * @returns A new Stake instance
   *
   */
  constructor(address: string, signer: Signer) {
    super(address, signer);
    const _stake = Stake__factory.connect(address, signer);

    this.allowance = _stake.allowance;
    this.approve = _stake.approve;
    this.balanceOf = _stake.balanceOf;
    this.decimals = _stake.decimals;
    this.decreaseAllowance = _stake.decreaseAllowance;
    this.deposit = _stake.deposit;
    this.increaseAllowance = _stake.increaseAllowance;
    this.name = _stake.name;
    this.report = _stake.report;
    this.reportTimeForTier = _stake.reportTimeForTier;
    this.supportsInterface = _stake.supportsInterface;
    this.symbol = _stake.symbol;
    this.totalSupply = _stake.totalSupply;
    this.transfer = _stake.transfer;
    this.transferFrom = _stake.transferFrom;
    this.withdraw = _stake.withdraw;
  }

  /**
   * Deploys a new Stake.
   *
   * @param signer - An ethers.js Signer
   * @param args - Arguments for deploying a Stake @see StakeDeployArgs
   * @param overrides - @see TxOverrides
   * @returns A new Stake instance
   *
   */
  public static deploy = async (
    signer: Signer,
    args: StakeDeployArgs,
    overrides: TxOverrides = {}
  ): Promise<Stake> => {
    const stakeFactory = StakeFactory__factory.connect(
      this.getBookAddress(await this.getChainId(signer)),
      signer
    );

    const tx = await stakeFactory.createChildTyped(args, overrides);
    const receipt = await tx.wait();
    const address = this.getNewChildFromReceipt(receipt, stakeFactory);
    return new Stake(address, signer);
  };

  public readonly connect = (signer: Signer): Stake => {
    return new Stake(this.address, signer);
  };

  /**
   * Checks if address is registered as a child contract of this StakeFactory on a specific network
   *
   * @param signer - An ethers.js Signer
   * @param maybeChild - Address to check registration for.
   * @returns `true` if address was deployed by this contract factory, otherwise `false`
   */
  public static isChild = async (
    signer: Signer,
    maybeChild: string
  ): Promise<boolean> => {
    return await this._isChild(signer, maybeChild);
  };

  public readonly allowance: (
    owner: string,
    spender: string,
    overrides?: ReadTxOverrides
  ) => Promise<BigNumber>;

  public readonly approve: (
    spender: string,
    amount: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  public readonly balanceOf: (
    account: string,
    overrides?: ReadTxOverrides
  ) => Promise<BigNumber>;

  public readonly decimals: (overrides?: ReadTxOverrides) => Promise<number>;

  public readonly decreaseAllowance: (
    spender: string,
    subtractedValue: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  public readonly deposit: (
    amount_: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  public readonly increaseAllowance: (
    spender: string,
    addedValue: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  public readonly name: (overrides?: ReadTxOverrides) => Promise<string>;

  public readonly report: (
    account_: string,
    context_: BigNumberish[],
    overrides?: ReadTxOverrides
  ) => Promise<BigNumber>;

  public readonly reportTimeForTier: (
    account_: string,
    tier_: BigNumberish,
    context_: BigNumberish[],
    overrides?: ReadTxOverrides
  ) => Promise<BigNumber>;

  public readonly supportsInterface: (
    interfaceId_: BytesLike,
    overrides?: ReadTxOverrides
  ) => Promise<boolean>;

  public readonly symbol: (overrides?: ReadTxOverrides) => Promise<string>;

  public readonly totalSupply: (
    overrides?: ReadTxOverrides
  ) => Promise<BigNumber>;

  public readonly transfer: (
    to: string,
    amount: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  public readonly transferFrom: (
    from: string,
    to: string,
    amount: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  public readonly withdraw: (
    amount_: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;
}

/**
 * @public
 */
export type StakeDeployArgs = {
  token: string;
  initialRatio: BigNumberish;
  name: string;
  symbol: string;
};
