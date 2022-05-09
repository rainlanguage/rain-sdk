import { Signer, BytesLike, BigNumberish } from 'ethers';
import { TierContract } from '../../classes/tierContract';
import { TxOverrides } from '../../classes/rainContract';
import { StateConfig, VM } from '../../classes/vm';
import { AddressBook } from '../../addresses';
import { CombineTierFactory__factory } from '../../typechain';

/**
 * @public
 * A class for deploying and calling methods on a CombineTier.
 *
 *   Implements `ReadOnlyTier` over RainVM. Allows combining the reports from any other `ITier`
 * contracts referenced in the `ImmutableSource` set at construction.  value at the top of the
 * stack after executing the rain script will be used as the return of `report`.
 *
 * @remarks
 *   This class provides an easy way to deploy CombineTiers using Rain's canonical factories,
 * and methods for interacting with an already deployed CombineTier.
 *
 * @example
 * ```typescript
 * import { CombineTier } from 'rain-sdk'
 *
 * // To deploy a new CombineTier, pass an ethers.js Signer and the config for the CombineTier.
 * const newTier = await CombineTier.deploy(signer, CombineTierConfigArgs)
 *
 * // To connect to an existing CombineTier just pass the address and an ethers.js Signer.
 * const existingTier = new CombineTier(address, signer)
 *
 * // Once you have a CombineTier, you can call the smart contract methods:
 * const report = await existingTier.report(address)
 * ```
 *
 */
export class CombineTier extends TierContract {
  protected static readonly nameBookReference = 'combineTierFactory';

  /**
   * Constructs a new CombineTier from a known address.
   *
   * @param address - The address of the CombineTier contract
   * @param signer - An ethers.js Signer
   * @returns A new CombineTier instance
   */

  public static Opcodes = {
    ...VM.Opcodes,
    ACCOUNT: 0 + VM.Opcodes.length,
  };

  constructor(address: string, signer: Signer) {
    CombineTier.checkAddress(address);
    super(address, signer);
  }

  /**
   * Deploys a new CombineTier.
   *
   * @param signer - An ethers.js Signer
   * @param args - Arguments for deploying a CombineTier @see CombineTierDeployArgs
   * @param overrides - @see TxOverrides
   * @returns A new CombineTier instance
   *
   */
  public static deploy = async (
    signer: Signer,
    args: CombineTierDeployArgs,
    overrides: TxOverrides = {}
  ): Promise<CombineTier> => {
    const combineTierFactory = CombineTierFactory__factory.connect(
      this.getBookAddress(await this.getChainId(signer)),
      signer
    );

    const tx = await combineTierFactory.createChildTyped(args, overrides);
    const receipt = await tx.wait();
    const address = this.getNewChildFromReceipt(receipt, combineTierFactory);
    return new CombineTier(address, signer);
  };

  public readonly connect = (signer: Signer): CombineTier => {
    return new CombineTier(this.address, signer);
  };

  /**
   * Checks if address is registered as a child contract of this CombineTierFactory on a specific network
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

  /**
   * Get the instance Combine Tier connected to the deployed always tier in the current
   * chain ID obtained with the provider
   *
   * @param signer - An ethers.js Signer
   * @returns New instance connected to the AlwaysTier
   */
  public static getAlwaysTier = async (
    signer: Signer
  ): Promise<CombineTier> => {
    return new CombineTier(
      AddressBook.getAddressesForChainId(
        await this.getChainId(signer)
      ).alwaysTier,
      signer
    );
  };

  /**
   * It is NOT implemented in CombineTiers. Always will throw an error
   */
  public readonly setTier = async (
    account: string,
    endTier: BigNumberish,
    data: BytesLike,
    overrides?: TxOverrides
  ): Promise<never> => {
    throw new Error('SET TIER: NOT IMPLEMENTED');
  };
}

/**
 * @public
 * The StateConfig will be deployed as a pointer under
 */
export type CombineTierDeployArgs = StateConfig;
