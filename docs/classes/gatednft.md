
# Class GatedNFT

//TODO: Add doc

<b>Signature:</b>

```typescript
class GatedNFT extends FactoryContract 
```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [deploy](./gatednft.md#deploy-property-static) | `(signer: Signer, args: GatedNFTDeployArguments, overrides?: TxOverrides) => Promise<GatedNFT>` | Deploys a new GatedNFT. |
|  [getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static) | `(chainId: number) => Addresses` | Obtain all the addresses deployed in a specific network with a chain ID.<br></br><br></br>*Inherited from [AddressBook.getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static)* |
|  [getChainId](./raincontract.md#getChainId-property-static) | `(signerOrProvider: Signer \| Provider) => Promise<number>` | Get the chain ID from a valid ethers provider.<br></br><br></br>Request to the provider stored in the signer which is the chain ID.<br></br><br></br>*Inherited from [RainContract.getChainId](./raincontract.md#getChainId-property-static)* |
|  [getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static) | `(chainId: number) => string` | Obtain the latest subgraph endpoint related to the version that use the SDK.<br></br><br></br>*Inherited from [AddressBook.getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static)* |
|  [isChild](./gatednft.md#isChild-property-static) | `(signer: Signer, maybeChild: string) => Promise<boolean>` | Checks if address is registered as a child contract of this GatedNFTFactory on a specific network |
|  [nameBookReference](./gatednft.md#nameBookReference-property-static) | `string` | Name reference to find the address of the contract in the book address.<br></br><br></br>*Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)* |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [address](./raincontract.md#address-property) | `string` | The contract address of the instance.<br></br><br></br>*Inherited from [RainContract.address](./raincontract.md#address-property)* |
|  [approve](./gatednft.md#approve-property) | `(to: string, tokenId: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Gives permission to `to` to transfer `tokenId` token to another account. The approval is cleared when the token is transferred.<br></br><br></br>Only a single account can be approved at a time, so approving the zero address clears previous approvals.<br></br><br></br>Requirements:<br></br><br></br>- The caller must own the token or be an approved operator. - `tokenId` must exist. |
|  [balanceOf](./gatednft.md#balanceOf-property) | `(owner: string, overrides?: ReadTxOverrides) => Promise<BigNumber>` | Returns the number of tokens in `owner`<!-- -->'s account. |
|  [connect](./gatednft.md#connect-property) | `(signer: Signer) => GatedNFT` | Connect the current contract instance to a new ethers signer.<br></br><br></br>*Overrides [RainContract.connect](./raincontract.md#connect-property)* |
|  [getApproved](./gatednft.md#getApproved-property) | `(tokenId: BigNumberish, overrides?: ReadTxOverrides) => Promise<string>` | Returns the account approved for `tokenId` token.<br></br><br></br>Requirements:<br></br><br></br>- `tokenId` must exist. |
|  [isApprovedForAll](./gatednft.md#isApprovedForAll-property) | `(owner: string, operator: string, overrides?: ReadTxOverrides) => Promise<boolean>` | Returns if the `operator` is allowed to manage all of the assets of `owner`<!-- -->. |
|  [mint](./gatednft.md#mint-property) | `(to: string, overrides?: TxOverrides) => Promise<ContractTransaction>` | Mint a token and transfers it to `to`<!-- -->.<br></br><br></br>Requirements: - `to` should have the required tier - `to` should not exhausted his allowance |
|  [name](./gatednft.md#name-property) | `(overrides?: ReadTxOverrides) => Promise<string>` | Returns the token collection name. |
|  [owner](./gatednft.md#owner-property) | `(overrides?: ReadTxOverrides) => Promise<string>` | Returns the address of the current owner. |
|  [ownerOf](./gatednft.md#ownerOf-property) | `(tokenId: BigNumberish, overrides?: ReadTxOverrides) => Promise<string>` | Returns the owner of the `tokenId` token.<br></br><br></br>Requirements:<br></br><br></br>- `tokenId` must exist. |
|  [renounceOwnership](./gatednft.md#renounceOwnership-property) | `(overrides?: TxOverrides) => Promise<ContractTransaction>` | Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner.<br></br><br></br>NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner. |
|  [royaltyInfo](./gatednft.md#royaltyInfo-property) | `(salePrice: BigNumberish, overrides?: ReadTxOverrides) => Promise<RoyaltyInfo>` | Returns how much royalty is owed and to whom, based on a sale price that may be denominated in any unit of exchange. The royalty amount is denominated and should be payed in that same unit of exchange. |
|  [safeTransferFrom](./gatednft.md#safeTransferFrom-property) | `(from: string, to: string, tokenId: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Safely transfers `tokenId` token from `from` to `to`<!-- -->, checking first that contract recipients are aware of the ERC721 protocol to prevent tokens from being forever locked.<br></br><br></br>Requirements:<br></br><br></br>- `from` cannot be the zero address. - `to` cannot be the zero address. - `tokenId` token must exist and be owned by `from`<!-- -->. - If the caller is not `from`<!-- -->, it must be have been allowed to move this token by either approve() or setApprovalForAll(). - If `to` refers to a smart contract, it must implement `IERC721Receiver-onERC721Received`<!-- -->, which is called upon a safe transfer. |
|  [safeTransferFromWithData](./gatednft.md#safeTransferFromWithData-property) | `(from: string, to: string, tokenId: BigNumberish, data: BytesLike, overrides?: TxOverrides) => Promise<ContractTransaction>` | Safely transfers `tokenId` token from `from` to `to`<!-- -->.<br></br><br></br>Requirements:<br></br><br></br>- `from` cannot be the zero address. - `to` cannot be the zero address. - `tokenId` token must exist and be owned by `from`<!-- -->. - If the caller is not `from`<!-- -->, it must be approved to move this token by either approve() or setApprovalForAll(). - If `to` refers to a smart contract, it must implement `IERC721Receiver-onERC721Received`<!-- -->, which is called upon a safe transfer. |
|  [setApprovalForAll](./gatednft.md#setApprovalForAll-property) | `(operator: string, approved: boolean, overrides?: TxOverrides) => Promise<ContractTransaction>` | Approve or remove `operator` as an operator for the caller. Operators can call `transferFrom()` or `safeTransferFrom()` for any token owned by the caller.<br></br><br></br>Requirements:<br></br><br></br>- The `operator` cannot be the caller. |
|  [signer](./raincontract.md#signer-property) | `Signer` | The ethers signer that is connected to the instance.<br></br><br></br>*Inherited from [RainContract.signer](./raincontract.md#signer-property)* |
|  [supportsInterface](./gatednft.md#supportsInterface-property) | `(interfaceId: BytesLike, overrides?: ReadTxOverrides) => Promise<boolean>` | Returns true if this contract implements the interface defined by `interfaceId`<!-- -->. See the corresponding https://eips.ethereum.org/EIPS/eip-165\#how-interfaces-are-identified\[EIP section\] to learn more about how these ids are created. |
|  [symbol](./gatednft.md#symbol-property) | `(overrides?: ReadTxOverrides) => Promise<string>` | Returns the token collection symbol. |
|  [tier](./gatednft.md#tier-property) | `(overrides?: ReadTxOverrides) => Promise<string>` | Tier contract to compare statuses against on transfer. |
|  [tokenURI](./gatednft.md#tokenURI-property) | `(tokenId: BigNumberish, overrides?: ReadTxOverrides) => Promise<string>` | Returns the Uniform Resource Identifier (URI) for `tokenId` token. |
|  [totalSupply](./gatednft.md#totalSupply-property) | `(overrides?: ReadTxOverrides) => Promise<BigNumber>` | Returns the total amount of tokens stored by the contract. |
|  [transferFrom](./gatednft.md#transferFrom-property) | `(from: string, to: string, tokenId: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Transfers `tokenId` token from `from` to `to`<!-- -->.<br></br><br></br>WARNING: Usage of this method is discouraged, use `safeTransferFrom()` whenever possible.<br></br><br></br>Requirements:<br></br><br></br>- `from` cannot be the zero address. - `to` cannot be the zero address. - `tokenId` token must be owned by `from`<!-- -->. - If the caller is not `from`<!-- -->, it must be approved to move this token by either `approve()` or `setApprovalForAll()`<!-- -->. |
|  [transferOwnership](./gatednft.md#transferOwnership-property) | `(newOwner: string, overrides?: TxOverrides) => Promise<ContractTransaction>` | Transfers ownership of the contract to a new account (`newOwner`<!-- -->). Can only be called by the current owner. |
|  [updateRoyaltyRecipient](./gatednft.md#updateRoyaltyRecipient-property) | `(royaltyRecipient: string, overrides?: TxOverrides) => Promise<ContractTransaction>` | Update the royalty recipient. Requires the caller to be the current recipient |

## Static Methods

|  Method | Description |
|  --- | --- |
|  [\_isChild(signer, maybeChild)](./factorycontract.md#_isChild-method-static-1) | Checks if address is registered as a child contract of the factory in the chain.<br></br><br></br>*Inherited from [FactoryContract.\_isChild()](./factorycontract.md#_isChild-method-static-1)* |
|  [getBookAddress(chainId)](./raincontract.md#getBookAddress-method-static-1) | Get the address stored in the book for a determined chain if it is available.<br></br><br></br>*Inherited from [RainContract.getBookAddress()](./raincontract.md#getBookAddress-method-static-1)* |
|  [getNewChildFromReceipt(receipt, parentContract)](./factorycontract.md#getNewChildFromReceipt-method-static-1) | Get the child from a receipt obtain from a Factory transaction<br></br><br></br>*Inherited from [FactoryContract.getNewChildFromReceipt()](./factorycontract.md#getNewChildFromReceipt-method-static-1)* |

## Methods

|  Method | Description |
|  --- | --- |
|  [checkAddress(address, message)](./raincontract.md#checkAddress-method-1) | Check if an address is correctly formatted and throw an error if it is not an valid address<br></br><br></br>*Inherited from [RainContract.checkAddress()](./raincontract.md#checkAddress-method-1)* |

## Static Property Details

<a id="deploy-property-static"></a>

### deploy

Deploys a new GatedNFT.

<b>Signature:</b>

```typescript
static deploy: (signer: Signer, args: GatedNFTDeployArguments, overrides?: TxOverrides) => Promise<GatedNFT>;
```

<a id="isChild-property-static"></a>

### isChild

Checks if address is registered as a child contract of this GatedNFTFactory on a specific network

<b>Signature:</b>

```typescript
static isChild: (signer: Signer, maybeChild: string) => Promise<boolean>;
```

<a id="nameBookReference-property-static"></a>

### nameBookReference

Name reference to find the address of the contract in the book address.

*Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)*

Should be implemented in each class to find the factory or main address in the book.

<b>Signature:</b>

```typescript
protected static readonly nameBookReference: string;
```

## Property Details

<a id="approve-property"></a>

### approve

Gives permission to `to` to transfer `tokenId` token to another account. The approval is cleared when the token is transferred.

Only a single account can be approved at a time, so approving the zero address clears previous approvals.

Requirements:

- The caller must own the token or be an approved operator. - `tokenId` must exist.

<b>Signature:</b>

```typescript
readonly approve: (to: string, tokenId: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="balanceOf-property"></a>

### balanceOf

Returns the number of tokens in `owner`<!-- -->'s account.

<b>Signature:</b>

```typescript
readonly balanceOf: (owner: string, overrides?: ReadTxOverrides) => Promise<BigNumber>;
```

<a id="connect-property"></a>

### connect

Connect the current contract instance to a new ethers signer.

*Overrides [RainContract.connect](./raincontract.md#connect-property)*

<b>Signature:</b>

```typescript
readonly connect: (signer: Signer) => GatedNFT;
```

<a id="getApproved-property"></a>

### getApproved

Returns the account approved for `tokenId` token.

Requirements:

- `tokenId` must exist.

<b>Signature:</b>

```typescript
readonly getApproved: (tokenId: BigNumberish, overrides?: ReadTxOverrides) => Promise<string>;
```

<a id="isApprovedForAll-property"></a>

### isApprovedForAll

Returns if the `operator` is allowed to manage all of the assets of `owner`<!-- -->.

<b>Signature:</b>

```typescript
readonly isApprovedForAll: (owner: string, operator: string, overrides?: ReadTxOverrides) => Promise<boolean>;
```

<a id="mint-property"></a>

### mint

Mint a token and transfers it to `to`<!-- -->.

Requirements: - `to` should have the required tier - `to` should not exhausted his allowance

<b>Signature:</b>

```typescript
readonly mint: (to: string, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="name-property"></a>

### name

Returns the token collection name.

<b>Signature:</b>

```typescript
readonly name: (overrides?: ReadTxOverrides) => Promise<string>;
```

<a id="owner-property"></a>

### owner

Returns the address of the current owner.

<b>Signature:</b>

```typescript
readonly owner: (overrides?: ReadTxOverrides) => Promise<string>;
```

<a id="ownerOf-property"></a>

### ownerOf

Returns the owner of the `tokenId` token.

Requirements:

- `tokenId` must exist.

<b>Signature:</b>

```typescript
readonly ownerOf: (tokenId: BigNumberish, overrides?: ReadTxOverrides) => Promise<string>;
```

<a id="renounceOwnership-property"></a>

### renounceOwnership

Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner.

NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.

<b>Signature:</b>

```typescript
readonly renounceOwnership: (overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="royaltyInfo-property"></a>

### royaltyInfo

Returns how much royalty is owed and to whom, based on a sale price that may be denominated in any unit of exchange. The royalty amount is denominated and should be payed in that same unit of exchange.

<b>Signature:</b>

```typescript
readonly royaltyInfo: (salePrice: BigNumberish, overrides?: ReadTxOverrides) => Promise<RoyaltyInfo>;
```

<a id="safeTransferFrom-property"></a>

### safeTransferFrom

Safely transfers `tokenId` token from `from` to `to`<!-- -->, checking first that contract recipients are aware of the ERC721 protocol to prevent tokens from being forever locked.

Requirements:

- `from` cannot be the zero address. - `to` cannot be the zero address. - `tokenId` token must exist and be owned by `from`<!-- -->. - If the caller is not `from`<!-- -->, it must be have been allowed to move this token by either approve() or setApprovalForAll(). - If `to` refers to a smart contract, it must implement `IERC721Receiver-onERC721Received`<!-- -->, which is called upon a safe transfer.

<b>Signature:</b>

```typescript
readonly safeTransferFrom: (from: string, to: string, tokenId: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="safeTransferFromWithData-property"></a>

### safeTransferFromWithData

Safely transfers `tokenId` token from `from` to `to`<!-- -->.

Requirements:

- `from` cannot be the zero address. - `to` cannot be the zero address. - `tokenId` token must exist and be owned by `from`<!-- -->. - If the caller is not `from`<!-- -->, it must be approved to move this token by either approve() or setApprovalForAll(). - If `to` refers to a smart contract, it must implement `IERC721Receiver-onERC721Received`<!-- -->, which is called upon a safe transfer.

<b>Signature:</b>

```typescript
readonly safeTransferFromWithData: (from: string, to: string, tokenId: BigNumberish, data: BytesLike, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="setApprovalForAll-property"></a>

### setApprovalForAll

Approve or remove `operator` as an operator for the caller. Operators can call `transferFrom()` or `safeTransferFrom()` for any token owned by the caller.

Requirements:

- The `operator` cannot be the caller.

<b>Signature:</b>

```typescript
readonly setApprovalForAll: (operator: string, approved: boolean, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="supportsInterface-property"></a>

### supportsInterface

Returns true if this contract implements the interface defined by `interfaceId`<!-- -->. See the corresponding https://eips.ethereum.org/EIPS/eip-165\#how-interfaces-are-identified\[EIP section\] to learn more about how these ids are created.

<b>Signature:</b>

```typescript
readonly supportsInterface: (interfaceId: BytesLike, overrides?: ReadTxOverrides) => Promise<boolean>;
```

<a id="symbol-property"></a>

### symbol

Returns the token collection symbol.

<b>Signature:</b>

```typescript
readonly symbol: (overrides?: ReadTxOverrides) => Promise<string>;
```

<a id="tier-property"></a>

### tier

Tier contract to compare statuses against on transfer.

<b>Signature:</b>

```typescript
readonly tier: (overrides?: ReadTxOverrides) => Promise<string>;
```

<a id="tokenURI-property"></a>

### tokenURI

Returns the Uniform Resource Identifier (URI) for `tokenId` token.

<b>Signature:</b>

```typescript
readonly tokenURI: (tokenId: BigNumberish, overrides?: ReadTxOverrides) => Promise<string>;
```

<a id="totalSupply-property"></a>

### totalSupply

Returns the total amount of tokens stored by the contract.

<b>Signature:</b>

```typescript
readonly totalSupply: (overrides?: ReadTxOverrides) => Promise<BigNumber>;
```

<a id="transferFrom-property"></a>

### transferFrom

Transfers `tokenId` token from `from` to `to`<!-- -->.

WARNING: Usage of this method is discouraged, use `safeTransferFrom()` whenever possible.

Requirements:

- `from` cannot be the zero address. - `to` cannot be the zero address. - `tokenId` token must be owned by `from`<!-- -->. - If the caller is not `from`<!-- -->, it must be approved to move this token by either `approve()` or `setApprovalForAll()`<!-- -->.

<b>Signature:</b>

```typescript
readonly transferFrom: (from: string, to: string, tokenId: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="transferOwnership-property"></a>

### transferOwnership

Transfers ownership of the contract to a new account (`newOwner`<!-- -->). Can only be called by the current owner.

<b>Signature:</b>

```typescript
readonly transferOwnership: (newOwner: string, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="updateRoyaltyRecipient-property"></a>

### updateRoyaltyRecipient

Update the royalty recipient. Requires the caller to be the current recipient

<b>Signature:</b>

```typescript
readonly updateRoyaltyRecipient: (royaltyRecipient: string, overrides?: TxOverrides) => Promise<ContractTransaction>;
```
