import { Signer } from 'ethers';
import { TierContract } from '../../classes/tierContract';

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
}
