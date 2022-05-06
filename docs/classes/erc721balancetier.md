[Home](../index.md) &gt; [ERC721BalanceTier](./erc721balancetier.md)

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
|  [getChainId](./raincontract.md#getChainId-property-static) | `(signerOrProvider: Signer \| Provider) => Promise<number>` | Get the chain ID from a valid ethers provider.<br><br>Request to the provider stored in the signer which is the chain ID.<br><br><i>Inherited from [RainContract.getChainId](./raincontract.md#getChainId-property-static)</i> |
|  [isChild](./erc721balancetier.md#isChild-property-static) | `(signer: Signer, maybeChild: string) => Promise<boolean>` | Checks if address is registered as a child contract of this ERC721BalanceTierFactory on a specific network |
|  [nameBookReference](./erc721balancetier.md#nameBookReference-property-static) | `` | Reference to find the address in the book address. Should be implemented and assign it to each subclass<br><br><i>Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)</i> |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [address](./raincontract.md#address-property) | `string` | <i>Inherited from [RainContract.address](./raincontract.md#address-property)</i> |
|  [connect](./erc721balancetier.md#connect-property) | `(signer: Signer) => ERC721BalanceTier` | Connect the current instance to a new signer<br><br><i>Overrides [RainContract.connect](./raincontract.md#connect-property)</i> |
|  [levels](./tiercontract.md#levels-property) | `typeof Tier` | All the contract tier levels.<br><br><i>Inherited from [TierContract.levels](./tiercontract.md#levels-property)</i> |
|  [report](./tiercontract.md#report-property) | `(account: string, overrides?: ReadTxOverrides) => Promise<BigNumber>` | A tier report is a `uint256` that contains each of the block numbers each tier has been held continously since as a `uint32`<!-- -->. There are 9 possible tier, starting with tier 0 for `0` offset or "never held any tier" then working up through 8x 4 byte offsets to the full 256 bits.<br><br><i>Inherited from [TierContract.report](./tiercontract.md#report-property)</i> |
|  [setTier](./erc721balancetier.md#setTier-property) | `(account: string, endTier: BigNumberish, data: BytesLike, overrides?: TxOverrides) => Promise<never>` | It is NOT implemented in BalanceTiers. Always will throw an error<br><br><i>Overrides [TierContract.setTier](./tiercontract.md#setTier-property)</i> |
|  [signer](./raincontract.md#signer-property) | `Signer` | <i>Inherited from [RainContract.signer](./raincontract.md#signer-property)</i> |
|  [tierValues](./erc721balancetier.md#tierValues-property) | `(overrides?: ReadTxOverrides) => Promise<BigNumber[]>` | Complements the default solidity accessor for `tierValues`<!-- -->. Returns all the values in a listrather than requiring an index be specified. |
|  [token](./erc721balancetier.md#token-property) | `string` | ERC721 Token address that track the Tier |

## Static Methods

|  Method | Description |
|  --- | --- |
|  [\_isChild(signer, maybeChild)](./factorycontract.md#_isChild-method-static-1) | Checks if address is registered as a child contract of the factory in the chain. Should be implemented in sub-classes that repreent factories to expose it.<br><br><i>Inherited from [FactoryContract.\_isChild()](./factorycontract.md#_isChild-method-static-1)</i> |
|  [getBookAddress(chainId)](./raincontract.md#getBookAddress-method-static-1) | Get the address stored in the book to this chain<br><br><i>Inherited from [RainContract.getBookAddress()](./raincontract.md#getBookAddress-method-static-1)</i> |
|  [getNewChildFromReceipt(receipt, parentContract)](./factorycontract.md#getNewChildFromReceipt-method-static-1) | Get the child from a receipt obtain from a Factory transaction<br><br><i>Inherited from [FactoryContract.getNewChildFromReceipt()](./factorycontract.md#getNewChildFromReceipt-method-static-1)</i> |

## Methods

|  Method | Description |
|  --- | --- |
|  [amountToTier(desiredLevel, account)](./erc721balancetier.md#amountToTier-method-1) | Calculate how much amount of the token needed transfer to or transfer out of the account to reach a `desiredLevel`<!-- -->.<br><br>Take in mind: - If the `desired level` is higher than the current level, the amount returned will be the amount needed to obtain or transfer to the `account`<!-- -->. - If the `desired level` is lower than the current level, the amount returned will be the amount needed to remove or transfer out of the `account`<!-- -->. - If already have the `desired` tier, will return 0 |
|  [checkAddress(address, message)](./raincontract.md#checkAddress-method-1) | Check if an address is correctly formatted and throw an error if it is not an valid address<br><br><i>Inherited from [RainContract.checkAddress()](./raincontract.md#checkAddress-method-1)</i> |
|  [currentTier(account, block)](./tiercontract.md#currentTier-method-1) | Get the current tier of an `account` in the Tier as an expression between `[0 - 8]`<!-- -->. Tier 0 is that a address has never interact with the Tier Contract.<br><br><i>Inherited from [TierContract.currentTier()](./tiercontract.md#currentTier-method-1)</i> |

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

Reference to find the address in the book address. Should be implemented and assign it to each subclass

<i>Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)</i>

<b>Signature:</b>

```typescript
protected static readonly nameBookReference = "erc721BalanceTierFactory";
```

## Property Details

<a id="connect-property"></a>

### connect

Connect the current instance to a new signer

<i>Overrides [RainContract.connect](./raincontract.md#connect-property)</i>

<b>Signature:</b>

```typescript
readonly connect: (signer: Signer) => ERC721BalanceTier;
```

<a id="setTier-property"></a>

### setTier

It is NOT implemented in BalanceTiers. Always will throw an error

<i>Overrides [TierContract.setTier](./tiercontract.md#setTier-property)</i>

<b>Signature:</b>

```typescript
readonly setTier: (account: string, endTier: BigNumberish, data: BytesLike, overrides?: TxOverrides) => Promise<never>;
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

### amountToTier(desiredLevel, account)

Calculate how much amount of the token needed transfer to or transfer out of the account to reach a `desiredLevel`<!-- -->.

Take in mind: - If the `desired level` is higher than the current level, the amount returned will be the amount needed to obtain or transfer to the `account`<!-- -->. - If the `desired level` is lower than the current level, the amount returned will be the amount needed to remove or transfer out of the `account`<!-- -->. - If already have the `desired` tier, will return 0

<b>Signature:</b>

```typescript
amountToTier(desiredLevel: number, account?: string): Promise<BigNumber>;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  desiredLevel | `number` | the tier level desired to get |
|  account | `string` | (optional) the account address to calculate. If not provided will use the signer of the instance |

<b>Returns:</b>

`Promise<BigNumber>`

The amount t

