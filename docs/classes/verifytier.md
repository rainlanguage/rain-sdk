[Home](../index.md) &gt; [VerifyTier](./verifytier.md)

# Class VerifyTier

A class for deploying and calling methods on a VerifyTier.

A contract that is `VerifyTier` expects to derive tiers from the time the account was approved by the underlying `Verify` contract. The approval block numbers defer to `State.since` returned from `Verify.state`<!-- -->.

This class provides an easy way to deploy VerifyTiers using Rain's canonical factories, and methods for interacting with an already deployed VerifyTier.

<b>Signature:</b>

```typescript
class VerifyTier extends TierContract 
```

## Example


```typescript
import { VerifyTier } from 'rain-sdk'
// To deploy a new VerifyTier, pass an ethers.js Signer and the config for the VerifyTier.
const newTier = await VerifyTier.deploy(signer, VerifyTierConfigArgs);

// To connect to an existing VerifyTier just pass the address and an ethers.js Signer.
const existingTier = new VerifyTier(address, signer);

// Once you have a VerifyTier, you can call the smart contract methods:
const report = await existingTier.report(address);

```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [deploy](./verifytier.md#deploy-property-static) | `(signer: Signer, verifyAddress: string, overrides?: TxOverrides) => Promise<VerifyTier>` | Deploys a new VerifyTier. |
|  [getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static) | `(chainId: number) => Addresses` | Obtain all the addresses deployed in a specific network with a chain ID.<br></br><i>Inherited from [AddressBook.getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static)</i> |
|  [getChainId](./raincontract.md#getChainId-property-static) | `(signerOrProvider: Signer \| Provider) => Promise<number>` | Get the chain ID from a valid ethers provider.<br></br>Request to the provider stored in the signer which is the chain ID.<br></br><i>Inherited from [RainContract.getChainId](./raincontract.md#getChainId-property-static)</i> |
|  [getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static) | `(chainId: number) => string` | Obtain the latest subgraph endpoint related to the version that use the SDK.<br></br><i>Inherited from [AddressBook.getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static)</i> |
|  [isChild](./verifytier.md#isChild-property-static) | `(signer: Signer, maybeChild: string) => Promise<boolean>` | Checks if address is registered as a child contract of this VerifyTierFactory on a specific network<br></br><i>Overrides [FactoryContract.isChild](./factorycontract.md#isChild-property-static)</i> |
|  [nameBookReference](./verifytier.md#nameBookReference-property-static) | `` | Name reference to find the address of the contract in the book address.<br></br><i>Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)</i> |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [address](./raincontract.md#address-property) | `string` | <i>Inherited from [RainContract.address](./raincontract.md#address-property)</i> |
|  [connect](./verifytier.md#connect-property) | `(signer: Signer) => VerifyTier` | Connect the current instance to a new signer<br></br><i>Overrides [RainContract.connect](./raincontract.md#connect-property)</i> |
|  [levels](./tiercontract.md#levels-property) | `typeof Tier` | All the contract tier levels.<br></br><i>Inherited from [TierContract.levels](./tiercontract.md#levels-property)</i> |
|  [report](./tiercontract.md#report-property) | `(account: string, overrides?: ReadTxOverrides) => Promise<BigNumber>` | A tier report is a `uint256` that contains each of the block numbers each tier has been held continously since as a `uint32`<!-- -->. There are 9 possible tier, starting with tier 0 for `0` offset or "never held any tier" then working up through 8x 4 byte offsets to the full 256 bits.<br></br><i>Inherited from [TierContract.report](./tiercontract.md#report-property)</i> |
|  [setTier](./verifytier.md#setTier-property) | `(account: string, endTier: BigNumberish, data: BytesLike, overrides?: TxOverrides \| undefined) => Promise<never>` | It is NOT implemented in VerifyTiers. Always will throw an error<br></br><i>Overrides [TierContract.setTier](./tiercontract.md#setTier-property)</i> |
|  [signer](./raincontract.md#signer-property) | `Signer` | <i>Inherited from [RainContract.signer](./raincontract.md#signer-property)</i> |

## Static Methods

|  Method | Description |
|  --- | --- |
|  [\_isChild(signer, maybeChild)](./factorycontract.md#_isChild-method-static-1) | Checks if address is registered as a child contract of the factory in the chain.<br></br><i>Inherited from [FactoryContract.\_isChild()](./factorycontract.md#_isChild-method-static-1)</i> |
|  [getBookAddress(chainId)](./raincontract.md#getBookAddress-method-static-1) | Get the address stored in the book to this chain<br></br><i>Inherited from [RainContract.getBookAddress()](./raincontract.md#getBookAddress-method-static-1)</i> |
|  [getNewChildFromReceipt(receipt, parentContract)](./factorycontract.md#getNewChildFromReceipt-method-static-1) | Get the child from a receipt obtain from a Factory transaction<br></br><i>Inherited from [FactoryContract.getNewChildFromReceipt()](./factorycontract.md#getNewChildFromReceipt-method-static-1)</i> |

## Methods

|  Method | Description |
|  --- | --- |
|  [checkAddress(address, message)](./raincontract.md#checkAddress-method-1) | Check if an address is correctly formatted and throw an error if it is not an valid address<br></br><i>Inherited from [RainContract.checkAddress()](./raincontract.md#checkAddress-method-1)</i> |
|  [currentTier(account, block)](./tiercontract.md#currentTier-method-1) | Get the current tier of an `account` in the Tier as an expression between `[0 - 8]`<!-- -->. Tier 0 is that a address has never interact with the Tier Contract.<br></br><i>Inherited from [TierContract.currentTier()](./tiercontract.md#currentTier-method-1)</i> |

## Static Property Details

<a id="deploy-property-static"></a>

### deploy

Deploys a new VerifyTier.

<b>Signature:</b>

```typescript
static deploy: (signer: Signer, verifyAddress: string, overrides?: TxOverrides) => Promise<VerifyTier>;
```

<a id="isChild-property-static"></a>

### isChild

Checks if address is registered as a child contract of this VerifyTierFactory on a specific network

<i>Overrides [FactoryContract.isChild](./factorycontract.md#isChild-property-static)</i>

The methods require a signer that will be used to call to the Factory Contract and ask if thea address provided is a child. Also it is necessary to get the current Chain ID using the provider in the signer.

<b>Signature:</b>

```typescript
static isChild: (signer: Signer, maybeChild: string) => Promise<boolean>;
```

<a id="nameBookReference-property-static"></a>

### nameBookReference

Name reference to find the address of the contract in the book address.

<i>Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)</i>

Should be implemented in each class to find the factory or main address in the book.

<b>Signature:</b>

```typescript
protected static readonly nameBookReference = "verifyTierFactory";
```

## Property Details

<a id="connect-property"></a>

### connect

Connect the current instance to a new signer

<i>Overrides [RainContract.connect](./raincontract.md#connect-property)</i>

<b>Signature:</b>

```typescript
readonly connect: (signer: Signer) => VerifyTier;
```

<a id="setTier-property"></a>

### setTier

It is NOT implemented in VerifyTiers. Always will throw an error

<i>Overrides [TierContract.setTier](./tiercontract.md#setTier-property)</i>

<b>Signature:</b>

```typescript
readonly setTier: (account: string, endTier: BigNumberish, data: BytesLike, overrides?: TxOverrides | undefined) => Promise<never>;
```
