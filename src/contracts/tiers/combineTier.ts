import { Signer, BytesLike, BigNumberish } from 'ethers';
import { TierContract } from '../../classes/tierContract';
import { TxOverrides } from '../../classes/rainContract';
import { StateConfig, AllStandardOps } from '../../classes/vm';
import { CombineTierFactory__factory } from '../../typechain';

/**
 * @public
 * The argument of the CombineTier. The StateConfig will be deployed as a pointer
 * under VM State Pointer.
 *
 * @remarks
 * It will be built with the desired configuration for the CombineTier allowing to
 * customize the behavior of the Tier as needed and specified.
 */
export type CombineTierDeployArgs = StateConfig;

/**
 * @public
 * Type for the opcodes availables in a CombineTier instance.
 */
export type CombineTierOpcodes = typeof AllStandardOps & { ACCOUNT: number };

/**
 * @public
 * Class for deploying and calling methods on a CombineTier contract, providin easy way to interact
 * with deployed CombineTiers.
 *
 * @remarks
 * Since provide an easy way to deploy CombineTiers using Rain's canonical factories and methods for
 * interacting with an already deployed CombineTier, will reduce the code use to instanciate contract.
 *
 * The combine tiers implements the `ReadOnlyTier` over RainVM. Allows combining the reports from any other `ITier`
 * contracts referenced in the `ImmutableSource` set at construction.  value at the top of the
 * stack after executing the rain script will be used as the return of `report`.
 *
 * @example
 * ```typescript
 * import { CombineTier } from 'rain-sdk'
 *
 * // Deploy a new CombineTier using the existing factory. Require an ethers signer and the config desired for the CombineTier.
 * const newCombineTier = await CombineTier.deploy(signer, CombineTierConfigArgs);
 *
 * // Connect to an existing CombineTier. Required the address and an ethers signer.
 * const existingCombineTier  = new CombineTier(address, signer)
 *
 * // With a CombineTier instance, you can call the smart contract methods:
 * const report = await existingTier.report(address)
 *
 * // Access to static methods in CombineTier
 * const accountOP = CombineTier.Opcodes.ACCOUNT;
 *
 * // Obtaian default AlwaysTier instance with an ethers signer
 * const alwaysTier = await CombineTier.getAlwaysTier(signer);
 * ```
 */
export class CombineTier extends TierContract {
  /**
   * Constructs a new CombineTier from a known address.
   *
   * @param address - A combine tier address
   * @param signer - An ethers Signer
   * @returns A new combineTier instance
   */
  constructor(address: string, signer: Signer) {
    CombineTier.checkAddress(address);
    super(address, signer);
  }

  /**
   * Name reference to find the address of the contract in the book address.
   *
   * @remarks
   * Should be implemented in each class to find the factory address in the book.
   */
  protected static readonly nameBookReference = 'combineTierFactory';

  /**
   * All the opcodes avaialbles in the CombineTier contract.
   *
   * @remarks
   * This expose all the standard opcodes along with the specific opcodes of the CombineTier
   */
  public static Opcodes: CombineTierOpcodes = {
    ...AllStandardOps,
    ACCOUNT: 0 + AllStandardOps.length,
  };

  /**
   * Checks if address is registered as a child contract of this contract in a specific network.
   *
   * @remarks
   * The methods require a signer that will be used to call to the Factory Contract and ask if the
   * address provided is a child. Also it is necessary to get the current Chain ID using the provider
   * in the signer.
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
      this.getAddressesForChainId(await this.getChainId(signer)).alwaysTier,
      signer
    );
  };

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
