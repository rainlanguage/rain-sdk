import { Signer, utils, BigNumberish, Overrides, CallOverrides } from 'ethers';
import { AddressBook } from '../addresses';
import type { Provider } from '../types';

/**
 * @public
 * Abstract class that contain all the general methods that are requirement for all the Rain contracts to
 * be able to interact correctly.
 */
export abstract class RainContract extends AddressBook {
  /**
   * The ethers signer that is connected to the instance.
   *
   * @remarks
   * This signer will be used to call and sign the tranasctions.
   */
  public readonly signer: Signer;

  /**
   * The contract address of the instance.
   */
  public readonly address: string;

  /**
   * Name reference to find the address of the contract in the book address.
   *
   * @remarks
   * Should be implemented in each class to find the factory or main address in the book.
   */
  protected static readonly nameBookReference: string;

  constructor(address: string, signer: Signer) {
    super();
    if (!utils.isAddress(address.toLowerCase())) {
      throw new Error('NOT A VALID FORMAT ADDRESS');
    }
    this.signer = signer;
    this.address = address;
  }

  /**
   * @public
   * Check if an address is correctly formatted and throw an error if it is not an valid address
   *
   * @param address - address to be evaluated
   * @param message - optional message to throw in case if it's not
   */
  public static checkAddress(address: string, message?: string) {
    this._isAddress(address, message);
  }

  /**
   * @public
   * Check if an address is correctly formatted and throw an error if it is not an valid address
   *
   * @param address - address to be evaluated
   * @param message - optional message to throw in case if it's not
   */
  public checkAddress(address: string, message?: string) {
    RainContract._isAddress(address, message);
  }

  private static _isAddress(
    address: string,
    message: string = 'TOKEN: NOT A VALID FORMAT ADDRESS'
  ) {
    if (!utils.isAddress(address)) {
      throw new Error(message);
    }
  }

  /**
   * Connect the current contract instance to a new ethers signer.
   *
   * @param signer - The new signer which will be connected
   * @returns The instance with a new signer
   */
  public abstract readonly connect: (signer: Signer) => RainContract;

  /**
   * Get the address stored in the book for a determined chain if it is available.
   *
   * @remarks
   * If any address is deployed to the determined chain, an error will be throwed with
   * `No deployed contracts for this chain.`
   *
   * @param chainId - The chain ID where is deployed the contract
   * @returns The address for this contract
   */
  public static getBookAddress(chainId: number): string {
    return this.getAddressesForChainId(chainId)[this.nameBookReference];
  }

  /**
   * Get the chain ID from a valid ethers provider.
   *
   * Request to the provider stored in the signer which is the chain ID.
   *
   * @param signerOrProvider - An ethers signer or ethers provider
   * @returns The chain ID
   */
  public static getChainId = async (
    signerOrProvider: Signer | Provider
  ): Promise<number> => {
    let id;
    if (Signer.isSigner(signerOrProvider)) {
      id = (await signerOrProvider.provider?.getNetwork())?.chainId;
    } else {
      id = (await signerOrProvider.getNetwork()).chainId;
    }

    if (id) {
      return id;
    } else {
      throw new Error('Cannot get the chain ID');
    }
  };
}

/**
 * @public
 * Interface that show the entire values that can be overrides on trasanctions that are read only.
 *
 * @remarks
 * This is extended from Ethers and is know as CallOverrides used in constant transacctions. See more in:
 * https://docs.ethers.io/v5/api/contract/contract/#Contract--readonly
 */
export interface ReadTxOverrides extends CallOverrides {}

/**
 * @public
 * Interface that show the entire values that can be overrides on trasanctions that are change state in chain (write transaction).
 *
 * @remarks
 * This is extended from Ethers and is know as Overrides used in non-constant transacctions. See more in:
 * https://docs.ethers.io/v5/api/contract/contract/#Contract--write
 */
export interface TxOverrides extends Overrides {
  from?: string | Promise<string>;
}

/**
 * @public
 * Constructor config for standard Open Zeppelin ERC20.
 */
export interface ERC20Config {
  /**
   * Name as defined by Open Zeppelin ERC20.
   */
  name: string;
  /**
   * Symbol as defined by Open Zeppelin ERC20.
   */
  symbol: string;
  /**
   * Distributor address of the initial supply. MAY be zero.
   */
  distributor: string;
  /**
   * Initial supply to mint.
   */
  initialSupply: BigNumberish;
}
