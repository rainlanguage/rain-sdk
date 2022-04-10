import { BigNumberish, Signer, Overrides } from 'ethers';
import { AddressBook } from '../addresses';
import { RainContract } from '../rain-contract';
import {
  ERC20BalanceTier__factory,
  ERC20BalanceTier as ERC20BalanceTierContract,
  ERC20BalanceTierFactory__factory,
} from '../typechain';

/**
 * A class for deploying and calling methods on a ERC20BalanceTier.
 * @remarks
 *
 * This class provides an easy way to deploy ERC20BalanceTiers using Rain's canonical factories,
 * and methods for interacting with an already deployed ERC20BalanceTier.
 * @example
 * ```typescript
 * import { ERC20BalanceTier } from 'rain-sdk'
 * // To deploy a new ERC20BalanceTier, pass an ethers.js Signer, the chainId and the config for the ERC20BalanceTier.
 * const newTier = await ERC20BalanceTier.deploy(signer, chainId, { erc20, tierValues })
 *
 * // To connect to an existing ERC20BalanceTier just pass the address and an ethers.js Signer.
 * const existingTier = new ERC20BalanceTier(address, signer)
 *
 * // Once you have a ERC20BalanceTier, you can call the smart contract methods:
 * const tierValues = await existingTier.tierValues()
 * ```
 *
 */
export class ERC20BalanceTier extends RainContract {
  public readonly erc20BalanceTier!: ERC20BalanceTierContract;

  /**
   * A tier report is a `uint256` that contains each of the block numbers each tier has been
   * held continously since as a `uint32`. There are 9 possible tier, starting with tier 0
   * for `0` offset or "never held any tier" then working up through 8x 4 byte offsets to the
   * full 256 bits.
   *
   * @param account - Account to get the report for.
   * @param overrides - **(optional)** Specific transaction values to send it (e.g gasLimit,
   * nonce or gasPrice)
   * @return The report blocks encoded as a uint256.
   */
  public readonly report: ERC20BalanceTierContract['report'];

  /**
   * Complements the default solidity accessor for `tierValues`. Returns all the values in a
   * listrather than requiring an index be specified.
   *
   * @return tierValues_ The immutable `tierValues`.
   */
  public readonly tierValues: ERC20BalanceTierContract['tierValues'];

  /**
   * Constructs a new ERC20BalanceTier from a known address.
   *
   * @param address - The address of the ERC20BalanceTier contract
   * @param signer - An ethers.js Signer
   * @returns A new ERC20BalanceTier instance
   *
   */
  constructor(address: string, signer: Signer) {
    super(address, signer);
    this.erc20BalanceTier = ERC20BalanceTier__factory.connect(address, signer);
    this.report = this.erc20BalanceTier.report;
    this.tierValues = this.erc20BalanceTier.tierValues;
  }

  /**
   * Deploys a new ERC20BalanceTier.
   *
   * @param signer - An ethers.js Signer
   * @param chainId - The chain id of the network (e.g. 80001)
   * @param args - Arguments for deploying a ERC20BalanceTier @see ERC20BalanceTierDeployArgs
   * @param overrides - **(optional)** Specific transaction values to send it (e.g gasLimit, nonce or gasPrice)
   * @returns A new ERC20BalanceTier instance
   *
   */
  public static deploy = async (
    signer: Signer,
    chainId: number,
    args: ERC20BalanceTierDeployArgs,
    overrides: Overrides = {}
  ): Promise<ERC20BalanceTier> => {
    const erc20BalanceTierFactory = ERC20BalanceTierFactory__factory.connect(
      AddressBook.getAddressesForChainId(chainId).erc20BalanceTierFactory,
      signer
    );

    const tx = await erc20BalanceTierFactory.createChildTyped(args, overrides);

    const receipt = await tx.wait();

    const address = super.getNewChildFromReceipt(
      receipt,
      erc20BalanceTierFactory
    );

    const erc20BalanceTier = new ERC20BalanceTier(address, signer);

    // @ts-ignore
    erc20BalanceTier.erc20BalanceTier.deployTransaction = tx;

    return erc20BalanceTier;
  };

  /**
   * Checks if address is registered as a child contract of this ERC20BalanceTierFactory on a specific network
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
      AddressBook.getAddressesForChainId(chainId).erc20BalanceTierFactory,
      maybeChild
    );
  };
}

/**
 * Constructor config for ERC20BalanceTier
 */
interface ERC20BalanceTierDeployArgs {
  /**
   * The erc20 token contract to check the balance of at `report` time
   */
  erc20: string;
  /**
   * 8 values corresponding to minimum erc20 balances for tier 1 through tier 8
   */
  tierValues: BigNumberish[];
}
