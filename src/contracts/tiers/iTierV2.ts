import { Signer } from 'ethers';
import { TierContract } from '../../classes/tierContract';

/**
 * @public
 * Class to interact with ITierV2 contracts
 *
 * @remarks
 * Generic class to interact with any ITierV2 contract in chain with the basic methods and functions.
 *
 * `ITierV2` is a simple interface that contracts can implement to provide membership lists for other contracts.
 *
 * This class can be used to interact with any contract that implement the ITierV2 interface in their code, but
 * does not know if the contract has implemented the code.
 */
export class ITierV2 extends TierContract {
  public readonly connect = (signer: Signer): ITierV2 => {
    return new ITierV2(this.address, signer);
  };

  constructor(_address: string, _signer: Signer) {
    super(_address, _signer);
  }
}
