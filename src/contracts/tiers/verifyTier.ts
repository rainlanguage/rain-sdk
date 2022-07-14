import { Signer } from 'ethers';
import { TierContract } from '../../classes/tierContract';
import { TxOverrides } from '../../classes/rainContract';
import { VerifyTierFactory__factory, VerifyTier__factory } from '../../typechain';

/**
 * @public
 * A class for deploying and calling methods on a VerifyTier.
 *
 *   A contract that is `VerifyTier` expects to derive tiers from the time the account was
 * approved by the underlying `Verify` contract. The approval block numbers defer to `State.since`
 * returned from `Verify.state`.
 *
 * @remarks
 *   This class provides an easy way to deploy VerifyTiers using Rain's canonical factories,
 * and methods for interacting with an already deployed VerifyTier.
 *
 * @example
 * ```typescript
 * import { VerifyTier } from 'rain-sdk'
 * // To deploy a new VerifyTier, pass an ethers.js Signer and the config for the VerifyTier.
 * const newTier = await VerifyTier.deploy(signer, VerifyTierConfigArgs);
 *
 * // To connect to an existing VerifyTier just pass the address and an ethers.js Signer.
 * const existingTier = new VerifyTier(address, signer);
 *
 * // Once you have a VerifyTier, you can call the smart contract methods:
 * const report = await existingTier.report(address);
 * ```
 *
 */
export class VerifyTier extends TierContract {
  protected static readonly nameBookReference: string = 'verifyTierFactory';

  /**
   * Constructs a new VerifyTier from a known address.
   *
   * @param address - The address of the VerifyTier contract
   * @param signer - An ethers.js Signer
   * @returns A new VerifyTier instance
   */
  constructor(address: string, signer: Signer) {
    VerifyTier.checkAddress(address);
    
    const _verifyTier = VerifyTier__factory.connect(address, signer);
    super(address, signer, _verifyTier);
  }

  /**
   * Deploys a new VerifyTier.
   *
   * @param signer - An ethers.js Signer
   * @param verifyAddress - The contract to check to produce reports.
   * @param overrides - Specific transaction values to send it (e.g gasLimit, nonce or gasPrice)
   * @returns A new VerifyTier instance
   *
   */
  public static deploy = async (
    signer: Signer,
    verifyAddress: string,
    overrides: TxOverrides = {}
  ): Promise<VerifyTier> => {
    const verifyTierFactory = VerifyTierFactory__factory.connect(
      this.getBookAddress(await this.getChainId(signer)),
      signer
    );

    const tx = await verifyTierFactory.createChildTyped(
      verifyAddress,
      overrides
    );
    const receipt = await tx.wait();
    const address = this.getNewChildFromReceipt(receipt, verifyTierFactory);
    return new VerifyTier(address, signer);
  };

  /**
   * @public
   * Conncect to this VerifyTier contract with another signer
   * 
   * @param signer - the signer to get connected to the VerifyTier instance
   * @returns the VerifyTier instance with the new signer
   */
  public readonly connect = (signer: Signer): VerifyTier => {
    return new VerifyTier(this.address, signer);
  };

  /**
   * Checks if address is registered as a child contract of this VerifyTierFactory on a specific network
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
}
