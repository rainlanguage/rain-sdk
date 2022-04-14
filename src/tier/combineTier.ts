import { Signer, BytesLike, BigNumberish, Overrides } from 'ethers';
import { AddressBook } from '../addresses';
import { TierContract } from './tierContract';
import {
  CombineTier__factory,
  CombineTier as CombineTierContract,
  CombineTierFactory__factory,
} from '../typechain';

/**
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
 * // To deploy a new CombineTier, pass an ethers.js Signer, the chainId and the config for the CombineTier.
 * const newTier = await CombineTier.deploy(signer, chainId, CombineTierConfigArgs)
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
  public readonly combineTier!: CombineTierContract;

  /**
   * It is NOT implemented in CombineTiers. Always will throw an error
   */
  public readonly setTier = async (
    account: string,
    endTier: BigNumberish,
    data: BytesLike,
    overrides?: Overrides
  ) => {
    throw new Error('SET TIER: NOT IMPLEMENTED');
  };

  /**
   * Constructs a new CombineTier from a known address.
   *
   * @param address - The address of the CombineTier contract
   * @param signer - An ethers.js Signer
   * @returns A new CombineTier instance
   *
   */
  constructor(address: string, signer: Signer) {
    super(address, signer);
    this.combineTier = CombineTier__factory.connect(address, signer);
  }

  /**
   * Deploys a new CombineTier.
   *
   * @param signer - An ethers.js Signer
   * @param chainId - The chain id of the network (e.g. 80001)
   * @param args - Arguments for deploying a CombineTier @see CombineTierDeployArgs
   * @param overrides - Specific transaction values to send it (e.g gasLimit, nonce or gasPrice)
   * @returns A new CombineTier instance
   *
   */
  public static deploy = async (
    signer: Signer,
    chainId: number,
    args: CombineTierDeployArgs,
    overrides: Overrides = {}
  ): Promise<CombineTier> => {
    const combineTierFactory = CombineTierFactory__factory.connect(
      AddressBook.getAddressesForChainId(chainId).combineTierFactory,
      signer
    );

    const tx = await combineTierFactory.createChildTyped(args, overrides);

    const receipt = await tx.wait();

    const address = super.getNewChildFromReceipt(receipt, combineTierFactory);

    const combineTier = new CombineTier(address, signer);

    // @ts-ignore
    combineTier.combineTier.deployTransaction = tx;

    return combineTier;
  };

  /**
   * Checks if address is registered as a child contract of this CombineTierFactory on a specific network
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
      AddressBook.getAddressesForChainId(chainId).combineTierFactory,
      maybeChild
    );
  };
}

/**
 * The StateConfig will be deployed as a pointer under
 */
interface CombineTierDeployArgs {
  /**
   * Sources verbatim
   */
  sources: BytesLike[];
  /**
   * Constants verbatim
   */
  constants: BigNumberish[];
  /**
   * Sets the length of the uint256[] of the stack
   */
  stackLength: BigNumberish;
  /**
   * Sets the length of the uint256[] of the arguments
   */
  argumentsLength: BigNumberish;
}
