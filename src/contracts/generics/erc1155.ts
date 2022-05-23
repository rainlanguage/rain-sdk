import { ERC1155Burnable__factory } from '../../typechain';
import {
  BigNumberish,
  BigNumber,
  BytesLike,
  Signer,
  ContractTransaction,
} from 'ethers';
import { TxOverrides, ReadTxOverrides } from '../../classes/rainContract';

/**
 * @public
 *
 * A generic ERC1155 interface to get connected to any ERC1155 address and make transactions.
 *
 * @remarks
 * The interface only have and provide generic and common methods calls. Remember that any specific
 * method implemented in the contract will NOT be available in this interface.
 */
export class ERC1155 {
  public readonly signer: Signer;
  public readonly address: string;

  /**
   * Constructs a new ERC1155 from a known address.
   *
   * @param address - The address of the ERC1155 contract
   * @param signer - An ethers.js Signer
   * @returns A new ERC1155 instance
   *
   */
  constructor(address: string, signer: Signer) {
    this.address = address;
    this.signer = signer;
    const _erc1155 = ERC1155Burnable__factory.connect(address, signer);

    this.balanceOf = _erc1155.balanceOf;
    this.balanceOfBatch = _erc1155.balanceOfBatch;
    this.burn = _erc1155.burn;
    this.burnBatch = _erc1155.burnBatch;
    this.isApprovedForAll = _erc1155.isApprovedForAll;
    this.safeBatchTransferFrom = _erc1155.safeBatchTransferFrom;
    this.safeTransferFrom = _erc1155.safeTransferFrom;
    this.setApprovalForAll = _erc1155.setApprovalForAll;
    this.supportsInterface = _erc1155.supportsInterface;
    this.uri = _erc1155.uri;
  }

  /**
   * Check if the address is an IERC1155.
   *
   * @remarks
   * A valid IERC1155 are those contracts that support and have integrate the ERC1155 interface in their code.
   *
   * @param address - Address to check if is the IERC1155
   * @param signer - Signer necessary to valid the IERC1155
   * @returns True if the address is a valid IERC1155
   */
  public static isERC1155 = async (
    address: string,
    signer: Signer
  ): Promise<boolean> => {
    let erc1155 = new ERC1155(address, signer);

    try {
      return await erc1155.supportsInterface('0xd9b67a26');
    } catch (error) {
      return Promise.resolve(false);
    }
  };

  /**
   * Connect the current instance to a new signer
   *
   * @param signer - The new signer which will be connected
   * @returns The instance with a new signer
   */
  public readonly connect = (signer: Signer): ERC1155 => {
    return new ERC1155(this.address, signer);
  };

  /**
   * Create new instance with same signer but different contract address
   *
   * @param address - The new address which will be attached the instance
   * @returns The instance with a new signer
   */
  public readonly attach = (address: string): ERC1155 => {
    return new ERC1155(address, this.signer);
  };

  /**
   * Returns the amount of tokens of token type `id` owned by `account`.
   *
   * Requirements:
   *
   * - `account` cannot be the zero address.
   *
   * @param account - account address that owned the tokens of type `id`
   * @param id - the token type
   * @param overrides - @see ReadTxOverrides
   * @returns the amount of token of type `id` that own the address
   */
  public readonly balanceOf: (
    account: string,
    id: BigNumberish,
    overrides?: ReadTxOverrides
  ) => Promise<BigNumber>;

  /**
   * Return a batch of the balances
   *
   * Requirements:
   *
   * - `accounts` and `ids` must have the same length.
   *
   * @param accounts - array of the account owners of the ids
   * @param ids - array of type tokens
   * @param overrides - @see ReadTxOverrides
   * @returns An array if amounts of tokens that each account address owned
   */
  public readonly balanceOfBatch: (
    accounts: string[],
    ids: BigNumberish[],
    overrides?: ReadTxOverrides
  ) => Promise<BigNumber[]>;

  /**
   * Burn the tokens of type `id` from `account `
   *
   * @param account - account that own the tokens to be burned
   * @param id - token type id
   * @param value - amount of the tokens that will be burned
   * @param overrides - @see TxOverrides
   */
  public readonly burn: (
    account: string,
    id: BigNumberish,
    value: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Burn the tokens of type `id` from `account as a batch`
   *
   * @param account - account that own the tokens to be burned
   * @param ids - tokens type id
   * @param values - amounts of the tokens that will be burned
   * @param overrides - @see TxOverrides
   */
  public readonly burnBatch: (
    account: string,
    ids: BigNumberish[],
    values: BigNumberish[],
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Returns true if `operator` is approved to transfer `account`'s tokens.
   *
   * @param account - the account address that own the tokens
   * @param operator - the account address to check if is approved for all
   * @param overrides - @see ReadTxOverrides
   * @returns True if is approved for all
   */
  public readonly isApprovedForAll: (
    account: string,
    operator: string,
    overrides?: ReadTxOverrides
  ) => Promise<boolean>;

  /**
   * Transfers each `amounts` tokens of token type `ids` from `from` to `to`.
   *
   *
   * Requirements:
   *
   * - `to` cannot be the zero address.
   * - If the caller is not `from`, it must be have been approved to spend `from`'s tokens via `setApprovalForAll()`.
   * - `from` must have a balance of tokens of type `id` of at least `amount`.
   *
   * @param from - owner of the tokens
   * @param to - receiver of the tokens
   * @param ids - array of token types
   * @param amounts - array of amount of the tokens to transfer
   * @param data - extra data for onERC1155Received
   */
  public readonly safeBatchTransferFrom: (
    from: string,
    to: string,
    ids: BigNumberish[],
    amounts: BigNumberish[],
    data: BytesLike,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Transfers `amount` tokens of token type `id` from `from` to `to`.
   *
   *
   * Requirements:
   *
   * - `to` cannot be the zero address.
   * - If the caller is not `from`, it must be have been approved to spend `from`'s tokens via `setApprovalForAll()`.
   * - `from` must have a balance of tokens of type `id` of at least `amount`.
   *
   * @param from - owner of the tokens
   * @param to - receiver of the tokens
   * @param id - token type
   * @param amount - amount of the tokens to transfer
   * @param data - extra data for onERC1155Received
   */
  public readonly safeTransferFrom: (
    from: string,
    to: string,
    id: BigNumberish,
    amount: BigNumberish,
    data: BytesLike,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Grants or revokes permission to `operator` to transfer the caller's tokens, according to `approved`,
   *
   * Requirements:
   *
   * - `operator` cannot be the caller.
   *
   * @param operator - the account address to be approved/removed
   * @param approved - the boolean that defined if `operator` is approval for all
   * @param overrides - @see TxOverrides
   */
  public readonly setApprovalForAll: (
    operator: string,
    approved: boolean,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Returns true if this contract implements the interface defined by
   * `interfaceId`. See the corresponding
   * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
   * to learn more about how these ids are created.
   *
   * @param interfaceId - interfaceId that will be checked if it is supported
   * @param overrides - @see ReadTxOverrides
   * @returns true if the contract support the inerfaceId
   */
  public readonly supportsInterface: (
    interfaceId: BytesLike,
    overrides?: ReadTxOverrides
  ) => Promise<boolean>;

  /**
   * Returns the URI for token type `id`.
   *
   * @param id - token type id
   * @param overrides - @see ReadTxOverrides
   * @returns The token URI
   */
  public readonly uri: (
    id: BigNumberish,
    overrides?: ReadTxOverrides
  ) => Promise<string>;
}
