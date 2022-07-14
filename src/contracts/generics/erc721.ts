import { ERC721Burnable__factory } from '../../typechain';
import { TxOverrides, ReadTxOverrides, RainContract } from '../../classes/rainContract';
import {
  BigNumberish,
  BigNumber,
  BytesLike,
  Signer,
  ContractTransaction,
} from 'ethers';


/**
 * @public
 *
 * A generic ERC721 interface to get connected to any ERC721 address and make transactions.
 *
 * @remarks
 * The interface only have and provide generic and common methods calls. Remember that any specific
 * method implemented in the contract will NOT be available in this interface.
 */
export class ERC721 {
  public readonly signer: Signer;
  public readonly address: string;

  /**
   * Constructs a new ERC721 from a known address.
   *
   * @param address - The address of the ERC721 contract
   * @param signer - An ethers.js Signer
   * @returns A new ERC721 instance
   *
   */
  constructor(address: string, signer: Signer) {
    RainContract.checkAddress(address);
    this.address = address;
    this.signer = signer;
    const _erc721 = ERC721Burnable__factory.connect(address, signer);
    //
    this.approve = _erc721.approve;
    this.balanceOf = _erc721.balanceOf;
    this.burn = _erc721.burn;
    this.getApproved = _erc721.getApproved;
    this.isApprovedForAll = _erc721.isApprovedForAll;
    this.name = _erc721.name;
    this.ownerOf = _erc721.ownerOf;

    this.safeTransferFrom =
      _erc721['safeTransferFrom(address,address,uint256)'];

    this.safeTransferFromWithData =
      _erc721['safeTransferFrom(address,address,uint256,bytes)'];

    this.setApprovalForAll = _erc721.setApprovalForAll;
    this.supportsInterface = _erc721.supportsInterface;
    this.symbol = _erc721.symbol;
    this.tokenURI = _erc721.tokenURI;
    this.transferFrom = _erc721.transferFrom;
  }

  /**
   * Check if the address is an IERC721.
   *
   * @remarks
   * A valid IERC721 are those contracts that support and have integrate the ERC721 interface in their code
   *
   * @param address - Address to check if is the IERC721
   * @param signer - Signer necessary to valid the IERC721
   * @returns True if the address is a valid IERC721
   */
  public static isERC721 = async (
    address: string,
    signer: Signer
  ): Promise<boolean> => {
    let erc721 = new ERC721(address, signer);
    try {
      return await erc721.supportsInterface('0x80ac58cd');
    } catch (error) {
      return Promise.resolve(false);
    }
  };

  /**
   * Connect the current instance of ERC721 to a new signer
   *
   * @param signer - The new signer which will be connected
   * @returns The instance with a new signer
   */
  public readonly connect = (signer: Signer): ERC721 => {
    return new ERC721(this.address, signer);
  };

  /**
   * Create new instance with same signer but different contract address
   *
   * @param address - The new address which will be attached the instance
   * @returns The instance with a new signer
   */
  public readonly attach = (address: string): ERC721 => {
    return new ERC721(address, this.signer);
  };

  /**
   * Gives permission to `to` to transfer `tokenId` token to another account.
   * The approval is cleared when the token is transferred.
   *
   * Only a single account can be approved at a time, so approving the zero address clears previous approvals.
   *
   * Requirements:
   *
   * - The caller must own the token or be an approved operator.
   * - `tokenId` must exist.
   *
   * @param to - The addess that will get approved
   * @param tokenId - The token that `to` is allowed to spend
   * @param overrides - @see TxOverrides
   */
  public readonly approve: (
    to: string,
    tokenId: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Returns the number of tokens in `owner`'s account.
   *
   * @param account - Account address to get the balance
   * @param overrides - @see ReadTxOverrides
   * @returns Amount of tokens that the owner have
   */
  public readonly balanceOf: (
    account: string,
    overrides?: ReadTxOverrides
  ) => Promise<BigNumber>;

  /**
   * Burns `tokenId`.
   *
   * Requirements:
   *
   * - The caller must own `tokenId` or be an approved operator.
   *
   * @param tokenId -  tokenId to burn
   * @param overrides - @see TxOverrides
   */
  public readonly burn: (
    tokenId: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Returns the account approved for `tokenId` token.
   *
   * Requirements:
   *
   * - `tokenId` must exist.
   *
   * @param tokenId - token id to return the approved account
   * @param overrides - @see ReadTxOverrides
   * @returns Approved account address
   */
  public readonly getApproved: (
    tokenId: BigNumberish,
    overrides?: ReadTxOverrides
  ) => Promise<string>;

  /**
   * Returns if the `operator` is allowed to manage all of the assets of `owner`.
   *
   * @param owner - the owner of the tokens
   * @param operator - account to check if allowed
   * @param overrides - @see ReadTxOverrides
   * @returns true if `operator` is approve for manage all the token fo `owner`
   */
  public readonly isApprovedForAll: (
    owner: string,
    operator: string,
    overrides?: ReadTxOverrides
  ) => Promise<boolean>;

  /**
   *  Returns the name of the token.
   *
   * @param overrides - @see ReadTxOverrides
   * @returns The name of the Redeemable
   */
  public readonly name: (overrides?: ReadTxOverrides) => Promise<string>;

  /**
   * Returns the owner of the `tokenId` token.
   *
   * Requirements:
   *
   * - `tokenId` must exist.
   *
   * @param tokenId - token to check the owner
   * @param overrides - @see ReadTxOverrides
   * @returns The owner of the token
   */
  public readonly ownerOf: (
    tokenId: BigNumberish,
    overrides?: ReadTxOverrides
  ) => Promise<string>;

  /**
   * Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
   * are aware of the ERC721 protocol to prevent tokens from being forever locked.
   *
   * Requirements:
   *
   * - `from` cannot be the zero address.
   * - `to` cannot be the zero address.
   * - `tokenId` token must exist and be owned by `from`.
   * - If the caller is not `from`, it must be have been allowed to move this token by either approve() or setApprovalForAll().
   * - If `to` refers to a smart contract, it must implement `IERC721Receiver-onERC721Received`, which is called upon a safe transfer.
   *
   * @param from - address that have the token to transfer
   * @param to - address that will receive the token
   * @param tokenId - ID of token that will be transfer
   * @param overrides - @see TxOverrides
   */
  public readonly safeTransferFrom: (
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Safely transfers `tokenId` token from `from` to `to`.
   *
   * Requirements:
   *
   * - `from` cannot be the zero address.
   * - `to` cannot be the zero address.
   * - `tokenId` token must exist and be owned by `from`.
   * - If the caller is not `from`, it must be approved to move this token by either approve() or setApprovalForAll().
   * - If `to` refers to a smart contract, it must implement `IERC721Receiver-onERC721Received`, which is called upon a safe transfer.
   *
   * @param from - address that have the token to transfer
   * @param to - address that will receive the token
   * @param tokenId - ID of token that will be transfer
   * @param data - extra data for onERC721Received
   * @param overrides - @see TxOverrides
   */
  public readonly safeTransferFromWithData: (
    from: string,
    to: string,
    tokenId: BigNumberish,
    data: BytesLike,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Approve or remove `operator` as an operator for the caller.
   * Operators can call `transferFrom()` or `safeTransferFrom()` for any token owned by the caller.
   *
   * Requirements:
   *
   * - The `operator` cannot be the caller.
   *
   * @param operator - the account to be approved/removed for all
   * @param approved - boolean to set (true) or remove (false) the operator
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
   * Returns the token collection symbol.
   *
   * @param overrides - @see ReadTxOverrides
   * @returns The symbol of the token
   */
  public readonly symbol: (overrides?: ReadTxOverrides) => Promise<string>;

  /**
   * Returns the Uniform Resource Identifier (URI) for `tokenId` token.
   *
   * @param tokenId - `tokenId` must exist.
   * @param overrides - @see ReadTxOverrides
   * @returns The token URI
   */
  public readonly tokenURI: (
    tokenId: BigNumberish,
    overrides?: ReadTxOverrides
  ) => Promise<string>;

  /**
   * Moves `amount` tokens from `from` to `to` using the allowance mechanism. `amount` is
   * then deducted from the caller's allowance.
   *
   * NOTE: Does not update the allowance if the current allowance is the maximum `uint256`.
   *
   * Requirements:
   *
   * - `from` and `to` cannot be the zero address.
   * - `from` must have a balance of at least `amount`.
   * - the caller must have allowance for `from`'s tokens of at least `amount`.
   *
   * @param from - address that have the tokens to transfer
   * @param to - address that will receive the tokens
   * @param amount - token amount to transfer
   * @param overrides - @see TxOverrides
   */
  public readonly transferFrom: (
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;
}
