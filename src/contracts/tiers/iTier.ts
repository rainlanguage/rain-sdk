import { Signer, BigNumberish, BytesLike, ContractTransaction, BigNumber } from 'ethers';
import { TierContract } from '../../classes/tierContract';
import { TxOverrides } from '../../classes/rainContract';

/**
 * @public
 * Class to interact with ITier contracts
 *
 * @remarks
 * Generic class to interact with any ITier contract in chain with the basic methods and functions.
 *
 * `ITier` is a simple interface that contracts can implement to provide membership lists for other contracts.
 *
 */
export class ITier extends TierContract {
  public readonly connect = (signer: Signer): ITier => {
    return new ITier(this.address, signer);
  };

  constructor(_address: string, _signer: Signer) {
    super(_address, _signer);
  }

  /**
   * Returns the tier report of an address as an uint256.
   *
   * @remarks
   * There are 9 possible tier, starting with tier 0
   * for `0` offset or "never held any tier" then working up through 8x 4 byte offsets to the
   * full 256 bits.
   */
  public readonly report = async (
    account: string,
    overrides: TxOverrides = {}
  ) : Promise<BigNumber> => {
    return super.report(account, overrides);
  };

  /**
   * Updates the tier of an account if the contract allow it.
   *
   * @remarks
   * This functionality could revert if the ITier contract that made the instance
   * does not allow set tiers directly (ReadOnlyTiers).
   */
  public readonly setTier = async (
    account: string,
    endTier: BigNumberish,
    data: BytesLike,
    overrides: TxOverrides = {}
  ): Promise<ContractTransaction> => {
    return super.setTier(account, endTier, data, overrides);
  };
}
