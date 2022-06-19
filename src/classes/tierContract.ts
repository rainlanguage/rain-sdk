import { Signer, BigNumber, BigNumberish } from 'ethers';
import { ReadTxOverrides } from './rainContract';
import { FactoryContract } from './factoryContract';
import { ITierV2__factory } from '../typechain';
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
    const tier = ITierV2__factory.connect(address, signer);
    this.report = tier.report;
    this.reportTimeForTier = tier.reportTimeForTier;
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
    context: BigNumberish[],
    overrides?: ReadTxOverrides
  ) => Promise<BigNumber>;

  public readonly reportTimeForTier: (
    account: string,
    tier: BigNumberish,
    context: BigNumberish[],
    overrides?: ReadTxOverrides
  ) => Promise<BigNumber>;

  /**
   * Get the current tier of an `account` in the Tier as an expression between `[0 - 8]`.
   * Tier 0 is that a address has never interact with the Tier Contract.
   *
   * @param account - address to check the current tier
   * @param timestamp - (optional) check the level tier of an account with respect to a specific timestamp
   * @returns current tier level of the account
   */
  public async currentTier(
    account: string,
    timestamp?: number
  ): Promise<number> {
    const currentTier = await this.report(account, []);
    if (!timestamp) {
      const _againstBlock = await this.signer.provider?.getBlockNumber();
      if (!_againstBlock) {
        throw new Error('Unable to get the block');
      }
      timestamp = (await this.signer.provider?.getBlock(_againstBlock))
        ?.timestamp;
      if (!timestamp) {
        throw new Error('Unable to get the timestamp');
      }
    }

    const parsedReport = paddedUInt256(currentTier)
      .substring(2)
      .match(/.{1,8}/g)
      ?.reverse()
      .map((x) => parseInt('0x' + x));

    let eligibleStatus = 0;
    if (parsedReport && timestamp) {
      for (let i = 0; i < 8; i++) {
        if (parsedReport[i] <= timestamp) {
          eligibleStatus = i + 1;
        } else {
          break;
        }
      }
    }

    return eligibleStatus;
  }
}
