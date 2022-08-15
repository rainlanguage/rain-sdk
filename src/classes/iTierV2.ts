import { ReadTxOverrides } from './rainContract';
import { FactoryContract } from './factoryContract';
import { BigNumber, BigNumberish, Signer } from 'ethers';
import { ITierV2__factory } from '../typechain';

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
 * Class to interact with any Rain Tier contract i.e ITierV2 contracts
 *
 * @remarks
 * Generic class to interact with any ITierV2 contract in chain with the basic methods and functions.
 * `ITierV2` is a simple interface that contracts can implement to provide membership lists for other contracts.
 * And all other Rain Tier contract inherit form it.
 * This class can be used to interact with any contract that implement the ITierV2 interface in their code, but
 * does not know if the contract has implemented the code.
 * 
 * @example
 * ```typescript
 * import { ITierV2 } from "rain-sdk";
 * 
 * // to instantiate a new ethers.js ITierV2 contract from this class pass the contract address and signer
 * const newTier = new ITierV2(tierAddress, signer);
 * 
 * // to connect to an existing ITierV2 instance with a new signer
 * newTier.connect(signer);
 * ```
 */
export class ITierV2 extends FactoryContract {

  /**
   * Constructor of ITierV2 class to instantiate any Rain Tier contract from a known address
   * 
   * @param address - Address of the Rain tier contract
   * @param signer - The signer to get connected to the instance
   * @returns A new instance of ITierV2 contract from the address with Signer
   */
  constructor(address: string, signer: Signer) {
    ITierV2.checkAddress(address);

    super(address, signer);

    const _iTierV2 = ITierV2__factory.connect(address, signer);

    this.report = _iTierV2.report;
    this.reportTimeForTier = _iTierV2.reportTimeForTier;
  }

  /** {@inheritDoc Tier} */
  public readonly levels = Tier;

  /**
   * @public
   * Conncect to this ITierV2 contract with another signer
   * 
   * @param signer - the signer to get connected to the ITierV2 instance
   * @returns the ITierV2 instance with the new signer
   */
  public readonly connect = (signer: Signer): ITierV2 => {
    return new ITierV2(this.address, signer);
  };

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

    const parsedReport = (
      "0x" + 
      BigNumber.from(currentTier)
      .toHexString()
      .substring(2)
      .padStart(64, "0")
    )
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
