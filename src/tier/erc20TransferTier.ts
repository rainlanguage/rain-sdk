import { AddressBook } from '../addresses';
import { TierContract } from './tierContract';
import {
  Signer,
  BytesLike,
  BigNumberish,
  BigNumber,
  Overrides,
  CallOverrides,
  ContractTransaction,
} from 'ethers';
import {
  ERC20TransferTier__factory,
  ERC20TransferTier as ERC20TransferTierContract,
  ERC20TransferTierFactory__factory,
} from '../typechain';

/**
 * A class for deploying and calling methods on a ERC20TransferTier.
 *
 *   The `ERC20TransferTier` takes ownership of an erc20 balance by transferring erc20 token to itself. The
 * `msg.sender` must pay the difference on upgrade; the tiered address receives refunds on downgrade. This
 * allows users to "gift" tiers to each other. As the transfer is a state changing event we can track
 * historical block times.
 *
 *   As the tiered address moves up/down tiers it sends/receives the value difference between its current tier
 * only.The user is required to preapprove enough erc20 to cover the tier change or they will fail and lose gas.
 *
 *   In addition to the standard accounting it requires that users transfer erc20 tokens to achieve a tier.
 * Data is ignored, the only requirement is that the user has approved sufficient balance to gain the next tier.
 * The 8 values for gainable tiers and erc20 contract must be set upon construction and are immutable.
 *
 * `⚠️ WARNING:` If a user sends erc20 tokens directly to the contract without calling `setTier` the FUNDS ARE LOST. ⚠️
 *
 * @remarks
 * This class provides an easy way to deploy ERC20TransferTiers using Rain's canonical factories, and methods for
 * interacting with an already deployed ERC20TransferTier.
 * @example
 * ```typescript
 * import { ERC20TransferTier } from 'rain-sdk'
 *
 * // To deploy a new ERC20TransferTier, pass an ethers.js Signer, the chainId and the config for the ERC20TransferTier.
 * const newTier = await ERC20TransferTier.deploy(signer, chainId, ERC20TransferTierConfigArgs);
 *
 * // To connect to an existing ERC20TransferTier just pass the address and an ethers.js Signer.
 * const existingTier = new ERC20TransferTier(address, signer);
 *
 * // Once you have a ERC20TransferTier, you can call the smart contract methods:
 * const tierValues = await existingTier.tierValues();
 * ```
 *
 */
export class ERC20TransferTier extends TierContract {
  public readonly erc20TransferTier!: ERC20TransferTierContract;

  /**
   * Complements the default solidity accessor for `tierValues`. Returns all the values in a
   * listrather than requiring an index be specified.
   *
   * @return The immutable `tierValues[8]`.
   */
  public readonly tierValues: (
    overrides?: CallOverrides
  ) => Promise<BigNumber[]>;

  /**
   * Users can set their own tier by calling `setTier`. Updates the tier of an account.
   * Transfers balances of erc20 from/to the tiered account according to the difference
   * in values.
   *
   * Any failure to transfer in/out will rollback the tier change. The tiered account
   * must ensure sufficient approvals before attempting to set a new tier. This throw
   * an error if the user attempts to return to the ZERO tier.
   *
   * @param account Account to change the tier for.
   * @param endTier Tier after the change.
   * @param data Arbitrary input to disambiguate ownership
   * @param overrides - Specific transaction values to send it (e.g gasLimit,
   * nonce or gasPrice)
   */
  public declare readonly setTier: (
    account: string,
    endTier: BigNumberish,
    data: BytesLike,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;

  /**
   * Constructs a new ERC20TransferTier from a known address.
   *
   * @param address - The address of the ERC20TransferTier contract
   * @param signer - An ethers.js Signer
   * @returns A new ERC20TransferTier instance
   *
   */
  constructor(address: string, signer: Signer) {
    super(address, signer);
    this.erc20TransferTier = ERC20TransferTier__factory.connect(
      address,
      signer
    );
    this.tierValues = this.erc20TransferTier.tierValues;
    this.setTier = this.erc20TransferTier.setTier;
  }

  /**
   * Deploys a new ERC20TransferTier.
   *
   * @param signer - An ethers.js Signer
   * @param chainId - The chain id of the network (e.g. 80001)
   * @param args - Arguments for deploying a ERC20TransferTier @see ERC20TransferTierDeployArgs
   * @param overrides - Specific transaction values to send it (e.g gasLimit, nonce or gasPrice)
   * @returns A new ERC20TransferTier instance
   *
   */
  public static deploy = async (
    signer: Signer,
    chainId: number,
    args: ERC20TransferTierDeployArgs,
    overrides: Overrides = {}
  ): Promise<ERC20TransferTier> => {
    const erc20TransferTierFactory = ERC20TransferTierFactory__factory.connect(
      AddressBook.getAddressesForChainId(chainId).erc20TransferTierFactory,
      signer
    );

    const tx = await erc20TransferTierFactory.createChildTyped(args, overrides);

    const receipt = await tx.wait();

    const address = super.getNewChildFromReceipt(
      receipt,
      erc20TransferTierFactory
    );

    const erc20TransferTier = new ERC20TransferTier(address, signer);

    // @ts-ignore
    erc20TransferTier.erc20TransferTier.deployTransaction = tx;

    return erc20TransferTier;
  };

  /**
   * Checks if address is registered as a child contract of this ERC20TransferTierFactory on a specific network
   *
   * @param signer - An ethers.js Signer
   * @param chainId - The chain id of the network (e.g. 80001)
   * @param maybeChild - Address to check registration for.
   * @returns `true` if address was deployed by this contract factory, otherwise `false`
   */
  public static isChild = async (
    signer: Signer,
    chainId: number,
    maybeChild: string
  ): Promise<boolean> => {
    return await super._isChild(
      signer,
      AddressBook.getAddressesForChainId(chainId).erc20TransferTierFactory,
      maybeChild
    );
  };
}

/**
 * Constructor config for ERC20TransferTier
 */
interface ERC20TransferTierDeployArgs {
  /**
   * The erc20 token contract to transfer balances from/to during `setTier`
   */
  erc20: string;
  /**
   * 8 values corresponding to minimum erc20 balances for tiers ONE through EIGHT
   */
  tierValues: BigNumberish[];
}
