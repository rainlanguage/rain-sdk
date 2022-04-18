import {
  Signer,
  BigNumber,
  BytesLike,
  BigNumberish,
  ContractTransaction,
} from 'ethers';
import { TxOverrides, ReadTxOverrides } from './rainContract';
import { FactoryContract } from './factoryContract';
import { ITier__factory } from '../typechain';

/**
 * Combine the static methods that are present in factories with the ITier instance methods.
 * Should be use to the TierFactories.
 */
export abstract class TierFactoryContract extends FactoryContract {
  constructor(address: string, signer: Signer) {
    super(address, signer);
    const tier = ITier__factory.connect(address, signer);
    this.report = tier.report;
    this.setTier = tier.setTier;
  }

  /**
   * A tier report is a `uint256` that contains each of the block numbers each tier has been
   * held continously since as a `uint32`. There are 9 possible tier, starting with tier 0
   * for `0` offset or "never held any tier" then working up through 8x 4 byte offsets to the
   * full 256 bits.
   *
   * @param account - Account to get the report for.
   * @param overrides - Specific transaction values to send it (e.g gasLimit,
   * nonce or gasPrice)
   * @return The report blocks encoded as a uint256.
   */
  public readonly report: (
    account: string,
    overrides?: ReadTxOverrides
  ) => Promise<BigNumber>;

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
   * @return The report blocks encoded as a uint256.
   */
  public readonly setTier: (
    account: string,
    endTier: BigNumberish,
    data: BytesLike,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;
}
