import { Signer, BigNumberish, BigNumber, BytesLike } from 'ethers';
import { TierFactoryContract } from '../../classes/tierContract';
import { TxOverrides, ReadTxOverrides } from '../../classes/rainContract';
import {
  ERC721BalanceTier__factory,
  ERC721BalanceTierFactory__factory,
} from '../../typechain';

/**
 *   A class for deploying and calling methods on a ERC721BalanceTier.
 * The `ERC721BalanceTier` simply checks the current balance of an erc721 against tier values.
 * As the current balance is always read from the erc721contract directly there is no historical
 * block data.
 *
 * @remarks
 *   This class provides an easy way to deploy ERC721BalanceTiers using Rain's canonical factories,
 * and methods for interacting with an already deployed ERC721BalanceTier.
 *
 * @example
 * ```typescript
 * import { ERC721BalanceTier } from 'rain-sdk'
 *
 * // To deploy a new ERC721BalanceTier, pass an ethers.js Signer and the config for the ERC721BalanceTier.
 * const newTier = await ERC721BalanceTier.deploy(signer, ERC721BalanceTierConfigArgs);
 *
 * // To connect to an existing ERC721BalanceTier just pass the address and an ethers.js Signer.
 * const existingTier = new ERC721BalanceTier(address, signer);
 *
 * // Once you have a ERC721BalanceTier, you can call the smart contract methods:
 * const tierValues = await existingTier.tierValues();
 * ```
 *
 */
export class ERC721BalanceTier extends TierFactoryContract {
  protected static readonly nameBookReference = 'erc721BalanceTierFactory';

  /**
   * Constructs a new ERC721BalanceTier from a known address.
   *
   * @param address - The address of the ERC721BalanceTier contract
   * @param signer - An ethers.js Signer
   * @returns A new ERC721BalanceTier instance
   *
   */
  constructor(address: string, signer: Signer) {
    super(address, signer);
    const _erc721BalanceTier = ERC721BalanceTier__factory.connect(
      address,
      signer
    );
    this.tierValues = _erc721BalanceTier.tierValues;
  }

  /**
   * Deploys a new ERC721BalanceTier.
   *
   * @param signer - An ethers.js Signer
   * @param args - Arguments for deploying a ERC721BalanceTier @see ERC721BalanceTierDeployArgs
   * @param overrides - Specific transaction values to send it (e.g gasLimit, nonce or gasPrice)
   * @returns A new ERC721BalanceTier instance
   *
   */
  public static deploy = async (
    signer: Signer,
    args: ERC721BalanceTierDeployArgs,
    overrides: TxOverrides = {}
  ): Promise<ERC721BalanceTier> => {
    const erc721BalanceTierFactory = ERC721BalanceTierFactory__factory.connect(
      this.getBookAddress(await this.getChainId(signer)),
      signer
    );

    const tx = await erc721BalanceTierFactory.createChildTyped(args, overrides);
    const receipt = await tx.wait();
    const address = this.getNewChildFromReceipt(
      receipt,
      erc721BalanceTierFactory
    );
    return new ERC721BalanceTier(address, signer);
  };

  /**
   * Checks if address is registered as a child contract of this ERC721BalanceTierFactory on a specific network
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
   * It is NOT implemented in BalanceTiers. Always will throw an error
   */
  public readonly setTier = async (
    account: string,
    endTier: BigNumberish,
    data: BytesLike,
    overrides?: TxOverrides
  ) => {
    throw new Error('SET TIER: NOT IMPLEMENTED');
  };

  /**
   * Complements the default solidity accessor for `tierValues`. Returns all the values in a
   * listrather than requiring an index be specified.
   *
   * @return The immutable `tierValues[8]`.
   */
  public readonly tierValues: (
    overrides?: ReadTxOverrides
  ) => Promise<BigNumber[]>;
}

/**
 * Constructor config for ERC721BalanceTier
 */
export interface ERC721BalanceTierDeployArgs {
  /**
   * The erc721 token contract to check the balance of at `report` time
   */
  erc721: string;
  /**
   * 8 values corresponding to minimum erc721 balances for tier 1 through tier 8
   */
  tierValues: BigNumberish[];
}
