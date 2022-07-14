import { paddedUInt256 } from '../utils';
import { ReadTxOverrides } from './rainContract';
import { FactoryContract } from './factoryContract';
import { BigNumber, BigNumberish, Signer } from 'ethers';
import { 
  Stake,
  ITierV2,
  VerifyTier,
  CombineTier,
  EmissionsERC20
} from '../typechain';

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

  constructor(
    address: string,
    signer: Signer,
    tierContract: VerifyTier | CombineTier | ITierV2 | Stake | EmissionsERC20
  ) {
    super(address, signer);

    this.report = tierContract.report;
    this.reportTimeForTier = tierContract.reportTimeForTier;
  }

  /** {@inheritDoc Tier} */
  public readonly levels = Tier;

  /**
   * @public
   * A tier report is a `uint256` that contains each of the block numbers each tier has been
   * held continously since as a `uint32`.
   *
   * @remarks
   * There are 9 possible tier, starting with tier 0 for `0` offset or "never held any tier" 
   * and then working up through 8x 4 byte offsets to the full 256 bits.
   *
   * @param account - Account to get the report for.
   * @param context - A contextual argument depending on the implementing tier contract, array of values passed to the method at runtime
   * @param overrides - @see ReadTxOverrides
   * @returns The report blocks encoded as a uint256.
   */
  public readonly report: (
    account: string,
    context: BigNumberish[],
    overrides?: ReadTxOverrides
  ) => Promise<BigNumber>;

  /**
   * @public
   * Same as report but only returns the time for a single tier. Often the implementing contract 
   * can calculate a single tier more efficiently than all 8 tiers. If the consumer only needs one 
   * or a few tiers it MAY be much cheaper to request only those tiers individually.
   * 
   * @remarks
   * The return value 
   * is a `uint256` for gas efficiency but the values will be bounded by `type(uint32).max` as no single 
   * tier can report a value higher than this.
   *
   * @param account - Account to get the report for
   * @param tier - Tier to get the single report for
   * @param context - A contextual argument depending on the implementing tier contract, array of values passed to the method at runtime
   * @param overrides - @see ReadTxOverrides 
   * @returns A single tier report of max uint32 size encoded as uint256 
   */
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
      .match(/.{8}/g)
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
