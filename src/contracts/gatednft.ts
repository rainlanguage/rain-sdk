import { GatedNFT__factory, GatedNFTFactory__factory } from '../typechain';
import {
  BigNumberish,
  BigNumber,
  BytesLike,
  Signer,
  ContractTransaction,
} from 'ethers';
import { TxOverrides, ReadTxOverrides } from '../classes/rainContract';
import { FactoryContract } from '../classes/factoryContract';

/**
 * @public
 */
export class GatedNFT extends FactoryContract {
  protected static readonly nameBookReference = 'gatedNFTFactory';

  /**
   * Constructs a new GatedNFT from a known address.
   *
   * @param address - The address of the GatedNFT contract
   * @param signer - An ethers.js Signer
   * @returns A new GatedNFT instance
   *
   */
  constructor(address: string, signer: Signer) {
    super(address, signer);
    const _gatedNFT = GatedNFT__factory.connect(address, signer);

    this.tier = _gatedNFT.tier;
    this.tokenURI = _gatedNFT.tokenURI;
    this._royaltyInfo = _gatedNFT.royaltyInfo;
    this.updateRoyaltyRecipient = _gatedNFT.updateRoyaltyRecipient;
    this.name = _gatedNFT.name;
    this.symbol = _gatedNFT.symbol;
    this.totalSupply = _gatedNFT.totalSupply;
    this.mint = _gatedNFT.mint;
    this.ownerOf = _gatedNFT.ownerOf;
    this.balanceOf = _gatedNFT.balanceOf;
    this.approve = _gatedNFT.approve;
    this.getApproved = _gatedNFT.getApproved;
    this.isApprovedForAll = _gatedNFT.isApprovedForAll;
    this.setApprovalForAll = _gatedNFT.setApprovalForAll;
    this.transferFrom = _gatedNFT.transferFrom;

    this.safeTransferFrom =
      _gatedNFT['safeTransferFrom(address,address,uint256)'];

    this.safeTransferFromWithData =
      _gatedNFT['safeTransferFrom(address,address,uint256,bytes)'];

    this.owner = _gatedNFT.owner;
    this.renounceOwnership = _gatedNFT.renounceOwnership;
    this.transferOwnership = _gatedNFT.transferOwnership;
    this.supportsInterface = _gatedNFT.supportsInterface;
  }

  /**
   * Deploys a new GatedNFT.
   *
   * @param signer - An ethers.js Signer
   * @param args - Arguments for deploying a GatedNFT @see GatedNFTDeployArguments
   * @param overrides - @see TxOverrides
   * @returns A new GatedNFT instance
   *
   */
  public static deploy = async (
    signer: Signer,
    args: GatedNFTDeployArguments,
    overrides: TxOverrides = {}
  ): Promise<GatedNFT> => {
    const gatedNFTFactory = GatedNFTFactory__factory.connect(
      this.getBookAddress(await this.getChainId(signer)),
      signer
    );

    const {
      config,
      tier,
      minimumStatus,
      maxPerAddress,
      transferrable,
      maxMintable,
      royaltyRecipient,
      royaltyBPS,
    } = args;

    const tx = await gatedNFTFactory.createChildTyped(
      config,
      tier,
      minimumStatus,
      maxPerAddress,
      transferrable,
      maxMintable,
      royaltyRecipient,
      royaltyBPS,
      overrides
    );
    const receipt = await tx.wait();
    const address = this.getNewChildFromReceipt(receipt, gatedNFTFactory);
    return new GatedNFT(address, signer);
  };

  /**
   * Checks if address is registered as a child contract of this GatedNFTFactory on a specific network
   *
   * @param signer - An ethers.js Signer
   * @param maybeChild - Address to check registration for.
   * @returns `true` if address was deployed by this contract factory, otherwise `false`
   */
  public static isChild = async (
    signer: Signer,
    maybeChild: string
  ): Promise<boolean> => {
    return await this._isChild(signer, maybeChild);
  };

  /**
   * Tier contract to compare statuses against on transfer.
   *
   * @param overrides - @see ReadTxOverrides
   * @returns The tier contract address
   */
  public readonly tier: (overrides?: ReadTxOverrides) => Promise<string>;

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
   * Returns how much royalty is owed and to whom, based on a sale price that may be denominated in any
   * unit of exchange. The royalty amount is denominated and should be payed in that same unit of exchange.
   *
   * @param salePrice - the sale price that will be use as based to calculate hor much royalty is owed
   * @param overrides - @see ReadTxOverrides
   * @returns The royaltyRecipient and the royaltyAmount
   */
  public readonly royaltyInfo = async (
    salePrice: BigNumberish,
    overrides: ReadTxOverrides = {}
  ): Promise<RoyaltyInfo> => {
    return this._royaltyInfo(0, salePrice, overrides);
  };

  private readonly _royaltyInfo: (
    arg0: BigNumberish,
    salePrice: BigNumberish,
    overrides?: ReadTxOverrides
  ) => Promise<RoyaltyInfo>;

  /**
   * Update the royalty recipient. Requires the caller to be the current recipient
   *
   * @param royaltyRecipient - The new recipient. Cannot be a zero address
   * @param overrides - @see TxOverrides
   */
  public readonly updateRoyaltyRecipient: (
    royaltyRecipient: string,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Returns the token collection name.
   *
   * @param overrides - @see ReadTxOverrides
   * @returns The name of the GatedNFT
   */
  public readonly name: (overrides?: ReadTxOverrides) => Promise<string>;

  /**
   * Returns the token collection symbol.
   *
   * @param overrides - @see ReadTxOverrides
   * @returns The symbol of the GatedNFT
   */
  public readonly symbol: (overrides?: ReadTxOverrides) => Promise<string>;

  /**
   * Returns the total amount of tokens stored by the contract.
   *
   * @param overrides - @see ReadTxOverrides
   * @returns the amount of tokens minted
   */
  public readonly totalSupply: (
    overrides?: ReadTxOverrides
  ) => Promise<BigNumber>;

  /**
   * Mint a token and transfers it to `to`.
   *
   * Requirements:
   * - `to` should have the required tier
   * - `to` should not exhausted his allowance
   *
   * @param to - The address that will get the token minted
   * @param overrides - @see TxOverrides
   */
  public readonly mint: (
    to: string,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Returns the owner of the `tokenId` token.
   *
   * Requirements:
   *
   * - `tokenId` must exist.
   *
   * @param tokenId - ID of tokens to get the owner
   * @param overrides - @see ReadTxOverrides
   * @returns the owner address of the token
   */
  public readonly ownerOf: (
    tokenId: BigNumberish,
    overrides?: ReadTxOverrides
  ) => Promise<string>;

  /**
   * Returns the number of tokens in `owner`'s account.
   *
   * @param owner - owner address to get the balance
   * @param overrides - @see ReadTxOverrides
   * @returns Amount of tokens that the owner have
   */
  public readonly balanceOf: (
    owner: string,
    overrides?: ReadTxOverrides
  ) => Promise<BigNumber>;

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
   * @param to - account address that will be approved
   * @param tokenId - ID of the token that will be approve to use
   * @param overrides - @see TxOverrides
   */
  public readonly approve: (
    to: string,
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
   * @param tokenId - ID of the token to get what address is approved to use it
   * @param overrides - @see ReadTxOverrides
   * @returns The address that is approve to use the token
   */
  public readonly getApproved: (
    tokenId: BigNumberish,
    overrides?: ReadTxOverrides
  ) => Promise<string>;

  /**
   * Returns if the `operator` is allowed to manage all of the assets of `owner`.
   *
   * @param owner - address that hold the tokens
   * @param operator - address to check if it is approved to use all the tokens of the owner
   * @param overrides - @see ReadTxOverrides
   * @returns true if operator has approved for all
   */
  public readonly isApprovedForAll: (
    owner: string,
    operator: string,
    overrides?: ReadTxOverrides
  ) => Promise<boolean>;

  /**
   * Approve or remove `operator` as an operator for the caller.
   * Operators can call `transferFrom()` or `safeTransferFrom()` for any token owned by the caller.
   *
   * Requirements:
   *
   * - The `operator` cannot be the caller.
   *
   * @param operator - address to approve/denied use all the token of the caller
   * @param approved - boolean to specify if operator is allowed to use the token
   * @param overrides - @see TxOverrides
   */
  public readonly setApprovalForAll: (
    operator: string,
    approved: boolean,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Transfers `tokenId` token from `from` to `to`.
   *
   * WARNING: Usage of this method is discouraged, use `safeTransferFrom()` whenever possible.
   *
   * Requirements:
   *
   * - `from` cannot be the zero address.
   * - `to` cannot be the zero address.
   * - `tokenId` token must be owned by `from`.
   * - If the caller is not `from`, it must be approved to move this token by either `approve()` or `setApprovalForAll()`.
   *
   * @param from - address that have the token to transfer
   * @param to - address that will receive the token
   * @param tokenId - ID of token that will be transfer
   * @param overrides - @see TxOverrides
   */
  public readonly transferFrom: (
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

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
   * Returns the address of the current owner.
   *
   * @param overrides - @see ReadTxOverrides
   * @returns current owner address of the contract
   */
  public readonly owner: (overrides?: ReadTxOverrides) => Promise<string>;

  /**
   * Leaves the contract without owner. It will not be possible to call
   * `onlyOwner` functions anymore. Can only be called by the current owner.
   *
   * NOTE: Renouncing ownership will leave the contract without an owner,
   * thereby removing any functionality that is only available to the owner.
   *
   * @param overrides - @see TxOverrides
   */
  public readonly renounceOwnership: (
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Transfers ownership of the contract to a new account (`newOwner`).
   * Can only be called by the current owner.
   *
   * @param newOwner - address of the new owner
   * @param overrides - @see TxOverrides
   */
  public readonly transferOwnership: (
    newOwner: string,
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
}

/**
 * @public
 * Determine the status about how the GatedNFT contract will handle the transfers
 */
export enum Transferrable {
  /**
   * Transfer not supported
   */
  NonTransferrable,
  /**
   * Transfer supported
   */
  Transferrable,
  /**
   * Address required a specific tier
   */
  TierGatedTransferrable,
}

/**
 * @public
 * Configuration of the basic information that will be added to the ERC721 NFT
 */
export interface GatedConfig {
  /**
   * Name of the token as defined by Open Zeppelin ERC721
   */
  name: string;
  /**
   * Symbol of the token as defined by Open Zeppelin ERC721
   */
  symbol: string;
  /**
   * Description that will contain the GatedNFT
   */
  description: string;
  /**
   * An animation url of the NFT
   */
  animationUrl: string;
  /**
   * An image url of the NFT
   */
  imageUrl: string;
  /**
   * The hash of the NFT animation
   */
  animationHash: BytesLike;
  /**
   * The hash of the NFT image
   */
  imageHash: BytesLike;
}

/**
 * @public
 */
export interface GatedNFTDeployArguments {
  /**
   * Configuration of the basic information that will be added to the ERC721 NFT
   */
  config: GatedConfig;
  /**
   * Tier contract to compare statuses against on any transaction.
   */
  tier: string;
  /**
   * Minimum tier required for mints and transfers. Can be '0'.
   */
  minimumStatus: BigNumberish;
  /**
   * Maximun of mint that is allowed per address
   */
  maxPerAddress: BigNumberish;
  /**
   * Determine the status about how the GatedNFT contract will handle the transfers
   */
  transferrable: Transferrable;
  /**
   * Maximun of tokens that will be mint in the contract
   */
  maxMintable: BigNumberish;
  /**
   * The royalty recipient
   */
  royaltyRecipient: string;
  /**
   * The royalty BPS
   */
  royaltyBPS: BigNumberish;
}

/**
 * @public
 */
export interface RoyaltyInfo {
  receiver: string;
  royaltyAmount: BigNumber;
}
