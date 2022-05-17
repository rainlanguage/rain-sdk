
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
|  [getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static) | `(chainId: number) => Addresses` | Obtain all the addresses deployed in a specific network with a chain ID.<br></br><br></br>*Inherited from [AddressBook.getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static)* |
|  [getChainId](./raincontract.md#getChainId-property-static) | `(signerOrProvider: Signer \| Provider) => Promise<number>` | Get the chain ID from a valid ethers provider.<br></br><br></br>Request to the provider stored in the signer which is the chain ID.<br></br><br></br>*Inherited from [RainContract.getChainId](./raincontract.md#getChainId-property-static)* |
|  [getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static) | `(chainId: number) => string` | Obtain the latest subgraph endpoint related to the version that use the SDK.<br></br><br></br>*Inherited from [AddressBook.getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static)* |
|  [isChild](./verifytier.md#isChild-property-static) | `(signer: Signer, maybeChild: string) => Promise<boolean>` | Checks if address is registered as a child contract of this VerifyTierFactory on a specific network |
|  [nameBookReference](./verifytier.md#nameBookReference-property-static) | `string` | Name reference to find the address of the contract in the book address.<br></br><br></br>*Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)* |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [address](./raincontract.md#address-property) | `string` | The contract address of the instance.<br></br><br></br>*Inherited from [RainContract.address](./raincontract.md#address-property)* |
|  [connect](./verifytier.md#connect-property) | `(signer: Signer) => VerifyTier` | Connect the current contract instance to a new ethers signer.<br></br><br></br>*Overrides [RainContract.connect](./raincontract.md#connect-property)* |
|  [levels](./tiercontract.md#levels-property) | `typeof Tier` | All the contract tier levels availables in all ITier contracts.<br></br><br></br>*Inherited from [TierContract.levels](./tiercontract.md#levels-property)* |
|  [report](./tiercontract.md#report-property) | `(account: string, overrides?: ReadTxOverrides) => Promise<BigNumber>` | A tier report is a `uint256` that contains each of the block numbers each tier has been held continously since as a `uint32`<!-- -->. There are 9 possible tier, starting with tier 0 for `0` offset or "never held any tier" then working up through 8x 4 byte offsets to the full 256 bits.<br></br><br></br>*Inherited from [TierContract.report](./tiercontract.md#report-property)* |
|  [setTier](./verifytier.md#setTier-property) | `(account: string, endTier: BigNumberish, data: BytesLike, overrides?: TxOverrides \| undefined) => Promise<never>` | It is NOT implemented in VerifyTiers. Always will throw an error<br></br><br></br>*Overrides [TierContract.setTier](./tiercontract.md#setTier-property)* |
|  [signer](./raincontract.md#signer-property) | `Signer` | The ethers signer that is connected to the instance.<br></br><br></br>*Inherited from [RainContract.signer](./raincontract.md#signer-property)* |

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
|  [currentTier(account, block)](./tiercontract.md#currentTier-method-1) | Get the current tier of an `account` in the Tier as an expression between `[0 - 8]`<!-- -->. Tier 0 is that a address has never interact with the Tier Contract.<br></br><br></br>*Inherited from [TierContract.currentTier()](./tiercontract.md#currentTier-method-1)* |

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

<a id="connect-property"></a>

### connect

Connect the current contract instance to a new ethers signer.

*Overrides [RainContract.connect](./raincontract.md#connect-property)*

<b>Signature:</b>

```typescript
readonly connect: (signer: Signer) => VerifyTier;
```

<a id="setTier-property"></a>

### setTier

It is NOT implemented in VerifyTiers. Always will throw an error

*Overrides [TierContract.setTier](./tiercontract.md#setTier-property)*

<b>Signature:</b>

```typescript
readonly setTier: (account: string, endTier: BigNumberish, data: BytesLike, overrides?: TxOverrides | undefined) => Promise<never>;
```
