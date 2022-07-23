import { SeedDance__factory } from '../../typechain';
import { Signer, BigNumberish, BigNumber } from 'ethers';
import {
  RainContract,
  ReadTxOverrides,
} from '../../classes/rainContract';


/**
 * @public
 * A class for calling method on a Rain SeedDance contract.
 *
 * @remarks
 * This class provides an easy way to interact with the SeedDance contract.
 *
 * @example
 * ```typescript
 * import { SeedDance } from 'rain-sdk'
 *
 * const seedDance = await SeedDance.get(signer);
 * or
 * const seedDance = new SeedDance(address, signer);
 *
 * const tx = await seedDance.canRevealUntil(requiredArgs);
 * ```
 */
export class SeedDance extends RainContract {
  protected static readonly nameBookReference: string = 'seedDance';

  /**
   * Constructs a new SeedDance from a known address.
   *
   * @param address - The address of the SeedDance contract
   * @param signer - An ethers.js Signer
   * @returns A new SeedDance instance
   */
  constructor(address: string, signer: Signer) {
    SeedDance.checkAddress(address);

    super(address, signer);
    const _seedDance = SeedDance__factory.connect(address, signer);

    this.canRevealUntil = _seedDance.canRevealUntil
  }

  /**
   * Connect to this SeedDance instance with a new signer
   *
   * @param signer - The new signer which will be connected
   * @returns The SeedDance Contract instance with a new signer 
   */
  public readonly connect = (signer: Signer): SeedDance => {
    return new SeedDance(this.address, signer);
  };

  /**
   * @public
   */
  public readonly canRevealUntil: (
    seed_: BigNumberish,
    start_: BigNumberish,
    timeBound_: TimeBoundConfig,
    owner_: string,
    overrides?: ReadTxOverrides
  ) => Promise<BigNumber>;

}

/**
 * @public
 */
export type TimeBoundConfig = {
  baseDuration: BigNumberish;
  maxExtraTime: BigNumberish;
}