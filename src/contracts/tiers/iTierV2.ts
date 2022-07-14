import { Signer } from 'ethers';
import { TierContract } from '../../classes/tierContract';
import { ITierV2__factory } from '../../typechain';

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

  /**
   * Constructor of ITierV2 class to instantiate any Rain Tier contract from a known address
   * 
   * @param address - Address of the Rain tier contract
   * @param signer - The signer to get connected to the instance
   * @returns A new instance of ITierV2 contract from the address with Signer
   */
  constructor(address: string, signer: Signer) {
    ITierV2.checkAddress(address);

    const _iTierV2 = ITierV2__factory.connect(address, signer);
    super(address, signer, _iTierV2);
  }

  /**
   * @public
   * Conncect to this ITierV2 contract with another signer
   * 
   * @param signer - the signer to get connected to the ITierV2 instance
   * @returns the ITierV2 instance with the new signer
   */
  public readonly connect = (signer: Signer): ITierV2 => {
    return new ITierV2(this.address, signer);
  };
}
