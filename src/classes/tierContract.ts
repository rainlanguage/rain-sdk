import {
  Signer,
  BigNumber,
  BytesLike,
  BigNumberish,
  ContractTransaction,
} from 'ethers';
import { TxOverrides, ReadTxOverrides } from './rainContract';
import { FactoryContract } from './factoryContract';
import { ITier__factory } from '../typechain';
import { paddedUInt256 } from '../utils';

/**
 * @public
 * All the contract tier levels availables in all ITier contracts.
 */
export enum Tier {
  /**
   * Contract tier level 0. This represent that the uset never has been
   * interacted with the Tier contract.
   */
  ZERO,
  /**
   * Contract tier level 1.
   */
  ONE,
  /**
   * Contract tier level 2.
   */
  TWO,
  /**
   * Contract tier level 3.
   */
  THREE,
  /**
   * Contract tier level 4.
   */
  FOUR,
  /**
   * Contract tier level 5.
   */
  FIVE,
  /**
   * Contract tier level 6.
   */
  SIX,
  /**
   * Contract tier level 7.
   */
  SEVEN,
  /**
   * Contract tier level 8.
   */
  EIGHT,
}

/**
 * @public
 * Combine the static methods that are present in factories with the ITier instance methods.
 * Should be use to the TierFactories.
 */
export abstract class TierContract extends FactoryContract {
  constructor(address: string, signer: Signer) {
    super(address, signer);
    const tier = ITier__factory.connect(address, signer);
    this.report = tier.report;
    this.setTier = tier.setTier;
  }

  /** {@inheritDoc Tier} */
  public readonly levels = Tier;

  /**
   * A tier report is a `uint256` that contains each of the block numbers each tier has been
   * held continously since as a `uint32`.
   *
   * @remarks
   * There are 9 possible tier, starting with tier 0
   * for `0` offset or "never held any tier" then working up through 8x 4 byte offsets to the
   * full 256 bits.
   *
   * @param account - Account to get the report for.
   * @param overrides - @see ReadTxOverrides
   * @returns The report blocks encoded as a uint256.
   */
  public readonly report: (
    account: string,
    overrides?: ReadTxOverrides
  ) => Promise<BigNumber>;

  /**
   * Updates the tier of an account.
   *
   * @remarks
   * Users can set their own tier by calling `setTier` if is this option available on the Tier contract.
   * ITier like BalanceTier does not allow this.
   *
   * @param account - Account to change the tier for.
   * @param endTier - Tier after the change.
   * @param data - Arbitrary input to disambiguate ownership
   * @param overrides - @see TxOverrides
   * @returns The report blocks encoded as a uint256.
   */
  public readonly setTier: (
    account: string,
    endTier: BigNumberish,
    data: BytesLike,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Get the current tier of an `account` in the Tier as an expression between `[0 - 8]`.
   * Tier 0 is that a address has never interact with the Tier Contract.
   *
   * @param account - address to check the current tier
   * @param block - (optional) check the level tier of an account with respect to a specific block
   * @returns current tier level of the account
   */
  public async currentTier(account: string, block?: number): Promise<number> {
    const currentTier = await this.report(account);
    const againstBlock = block
      ? block
      : await this.signer.provider?.getBlockNumber();

    const parsedReport = paddedUInt256(currentTier)
      .substring(2)
      .match(/.{1,8}/g)
      ?.reverse()
      .map((x) => parseInt('0x' + x));

    let eligibleStatus = 0;
    if (parsedReport && againstBlock) {
      for (let i = 0; i < 8; i++) {
        if (parsedReport[i] <= againstBlock) {
          eligibleStatus = i + 1;
        } else {
          break;
        }
      }
    }

    return eligibleStatus;
  }
}
