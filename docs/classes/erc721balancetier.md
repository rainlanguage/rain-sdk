
# Class ERC721BalanceTier

A class for deploying and calling methods on a ERC721BalanceTier. The `ERC721BalanceTier` simply checks the current balance of an erc721 against tier values. As the current balance is always read from the erc721contract directly there is no historical block data.

This class provides an easy way to deploy ERC721BalanceTiers using Rain's canonical factories, and methods for interacting with an already deployed ERC721BalanceTier.

<b>Signature:</b>

```typescript
class ERC721BalanceTier extends TierContract 
```

## Example


```typescript
import { ERC721BalanceTier } from 'rain-sdk'

// To deploy a new ERC721BalanceTier, pass an ethers.js Signer and the config for the ERC721BalanceTier.
const newTier = await ERC721BalanceTier.deploy(signer, ERC721BalanceTierConfigArgs);

// To connect to an existing ERC721BalanceTier just pass the address and an ethers.js Signer.
const existingTier = new ERC721BalanceTier(address, signer);

// Once you have a ERC721BalanceTier, you can call the smart contract methods:
const tierValues = await existingTier.tierValues();

```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [deploy](./erc721balancetier.md#deploy-property-static) | `(signer: Signer, args: ERC721BalanceTierDeployArgs, overrides?: TxOverrides) => Promise<ERC721BalanceTier>` | Deploys a new ERC721BalanceTier. |
|  [getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static) | `(chainId: number) => Addresses` | Obtain all the addresses deployed in a specific network with a chain ID.<br></br>*Inherited from [AddressBook.getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static)* |
|  [getChainId](./raincontract.md#getChainId-property-static) | `(signerOrProvider: Signer \| Provider) => Promise<number>` | Get the chain ID from a valid ethers provider.<br></br>Request to the provider stored in the signer which is the chain ID.<br></br>*Inherited from [RainContract.getChainId](./raincontract.md#getChainId-property-static)* |
|  [getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static) | `(chainId: number) => string` | Obtain the latest subgraph endpoint related to the version that use the SDK.<br></br>*Inherited from [AddressBook.getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static)* |
|  [isChild](./erc721balancetier.md#isChild-property-static) | `(signer: Signer, maybeChild: string) => Promise<boolean>` | Checks if address is registered as a child contract of this ERC721BalanceTierFactory on a specific network |
|  [nameBookReference](./erc721balancetier.md#nameBookReference-property-static) | `string` | Name reference to find the address of the contract in the book address.<br></br>*Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)* |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [address](./raincontract.md#address-property) | `string` | The contract address of the instance.<br></br>*Inherited from [RainContract.address](./raincontract.md#address-property)* |
|  [addTokenAddress](./erc721balancetier.md#addTokenAddress-property) | `(tokenAddress: string) => ERC721BalanceTier` | Get a new instance with the token address provided.<br></br>This method must be used if the token address is not provided in construction moment. The class use this address to make calculations related with the Tier. The token address provided should be the same that the Tier is using to work correctly. |
|  [connect](./erc721balancetier.md#connect-property) | `(signer: Signer) => ERC721BalanceTier` | Connect the current contract instance to a new ethers signer.<br></br>*Overrides [RainContract.connect](./raincontract.md#connect-property)* |
|  [levels](./tiercontract.md#levels-property) | `typeof Tier` | All the contract tier levels availables in all ITier contracts.<br></br>*Inherited from [TierContract.levels](./tiercontract.md#levels-property)* |
|  [report](./tiercontract.md#report-property) | `(account: string, overrides?: ReadTxOverrides) => Promise<BigNumber>` | A tier report is a `uint256` that contains each of the block numbers each tier has been held continously since as a `uint32`<!-- -->.<br></br>*Inherited from [TierContract.report](./tiercontract.md#report-property)* |
|  [setTier](./erc721balancetier.md#setTier-property) | `(account: string, endTier: BigNumberish, data: BytesLike, overrides?: TxOverrides \| undefined) => Promise<never>` | It is NOT implemented in BalanceTiers. Always will throw an error<br></br>*Overrides [TierContract.setTier](./tiercontract.md#setTier-property)* |
|  [signer](./raincontract.md#signer-property) | `Signer` | The ethers signer that is connected to the instance.<br></br>*Inherited from [RainContract.signer](./raincontract.md#signer-property)* |
|  [tierValues](./erc721balancetier.md#tierValues-property) | `(overrides?: ReadTxOverrides) => Promise<BigNumber[]>` | Complements the default solidity accessor for `tierValues`<!-- -->. Returns all the values in a listrather than requiring an index be specified. |
|  [token](./erc721balancetier.md#token-property) | `string` | ERC721 Token address that track the Tier |

## Static Methods

|  Method | Description |
|  --- | --- |
|  [\_isChild(signer, maybeChild)](./factorycontract.md#_isChild-method-static-1) | Checks if address is registered as a child contract of the factory in the chain.<br></br>*Inherited from [FactoryContract.\_isChild()](./factorycontract.md#_isChild-method-static-1)* |
|  [getBookAddress(chainId)](./raincontract.md#getBookAddress-method-static-1) | Get the address stored in the book for a determined chain if it is available.<br></br>*Inherited from [RainContract.getBookAddress()](./raincontract.md#getBookAddress-method-static-1)* |
|  [getNewChildFromReceipt(receipt, parentContract)](./factorycontract.md#getNewChildFromReceipt-method-static-1) | Get the child from a receipt obtain from a Factory transaction<br></br>*Inherited from [FactoryContract.getNewChildFromReceipt()](./factorycontract.md#getNewChildFromReceipt-method-static-1)* |

## Methods

|  Method | Description |
|  --- | --- |
|  [amountToTier(account, desiredLevel)](./erc721balancetier.md#amountToTier-method-1) | Calculate how much amount of the token needed transfer to or transfer out of the account to reach a `desiredLevel`<!-- -->.<br></br>Take in mind: - If the `desired level` is higher than the current level, the amount returned will be the amount needed to obtain or transfer to the `account`<!-- -->. - If the `desired level` is lower than the current level, the amount returned will be the amount needed to remove or transfer out of the `account`<!-- -->. - If already have the `desired` tier, will return 0 |
|  [checkAddress(address, message)](./raincontract.md#checkAddress-method-1) | Check if an address is correctly formatted and throw an error if it is not an valid address<br></br>*Inherited from [RainContract.checkAddress()](./raincontract.md#checkAddress-method-1)* |
|  [currentTier(account, block)](./tiercontract.md#currentTier-method-1) | Get the current tier of an `account` in the Tier as an expression between `[0 - 8]`<!-- -->. Tier 0 is that a address has never interact with the Tier Contract.<br></br>*Inherited from [TierContract.currentTier()](./tiercontract.md#currentTier-method-1)* |

## Static Property Details

<a id="deploy-property-static"></a>

### deploy

Deploys a new ERC721BalanceTier.

<b>Signature:</b>

```typescript
static deploy: (signer: Signer, args: ERC721BalanceTierDeployArgs, overrides?: TxOverrides) => Promise<ERC721BalanceTier>;
```

<a id="isChild-property-static"></a>

### isChild

Checks if address is registered as a child contract of this ERC721BalanceTierFactory on a specific network

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

<a id="addTokenAddress-property"></a>

### addTokenAddress

Get a new instance with the token address provided.

This method must be used if the token address is not provided in construction moment. The class use this address to make calculations related with the Tier. The token address provided should be the same that the Tier is using to work correctly.

<b>Signature:</b>

```typescript
readonly addTokenAddress: (tokenAddress: string) => ERC721BalanceTier;
```

<a id="connect-property"></a>

### connect

Connect the current contract instance to a new ethers signer.

*Overrides [RainContract.connect](./raincontract.md#connect-property)*

<b>Signature:</b>

```typescript
readonly connect: (signer: Signer) => ERC721BalanceTier;
```

<a id="setTier-property"></a>

### setTier

It is NOT implemented in BalanceTiers. Always will throw an error

*Overrides [TierContract.setTier](./tiercontract.md#setTier-property)*

Users can set their own tier by calling `setTier` if is this option available on the Tier contract. ITier like BalanceTier does not allow this.

<b>Signature:</b>

```typescript
readonly setTier: (account: string, endTier: BigNumberish, data: BytesLike, overrides?: TxOverrides | undefined) => Promise<never>;
```

<a id="tierValues-property"></a>

### tierValues

Complements the default solidity accessor for `tierValues`<!-- -->. Returns all the values in a listrather than requiring an index be specified.

<b>Signature:</b>

```typescript
readonly tierValues: (overrides?: ReadTxOverrides) => Promise<BigNumber[]>;
```

<a id="token-property"></a>

### token

ERC721 Token address that track the Tier

<b>Signature:</b>

```typescript
readonly token: string;
```

## Method Details

<a id="amountToTier-method-1"></a>

### amountToTier(account, desiredLevel)

Calculate how much amount of the token needed transfer to or transfer out of the account to reach a `desiredLevel`<!-- -->.

Take in mind: - If the `desired level` is higher than the current level, the amount returned will be the amount needed to obtain or transfer to the `account`<!-- -->. - If the `desired level` is lower than the current level, the amount returned will be the amount needed to remove or transfer out of the `account`<!-- -->. - If already have the `desired` tier, will return 0

<b>Signature:</b>

```typescript
amountToTier(account: string, desiredLevel: number): Promise<BigNumber>;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  account | `string` | (optional) the account address to calculate. If not provided will use the signer of the instance |
|  desiredLevel | `number` | the tier level desired to get |

<b>Returns:</b>

`Promise<BigNumber>`

The amount t

