[Home](../index.md) &gt; [CombineTier](./combinetier.md)

# Class CombineTier

Class for deploying and calling methods on a CombineTier contract, providin easy way to interact with deployed CombineTiers.

Since provide an easy way to deploy CombineTiers using Rain's canonical factories and methods for interacting with an already deployed CombineTier, will reduce the code use to instanciate contract.

The combine tiers implements the `ReadOnlyTier` over RainVM. Allows combining the reports from any other `ITier` contracts referenced in the `ImmutableSource` set at construction. value at the top of the stack after executing the rain script will be used as the return of `report`<!-- -->.

<b>Signature:</b>

```typescript
class CombineTier extends TierContract 
```

## Example


```typescript
import { CombineTier } from 'rain-sdk'

// Deploy a new CombineTier using the existing factory. Require an ethers signer and the config desired for the CombineTier.
const newCombineTier = await CombineTier.deploy(signer, CombineTierConfigArgs);

// Connect to an existing CombineTier. Required the address and an ethers signer.
const existingCombineTier  = new CombineTier(address, signer)

// With a CombineTier instance, you can call the smart contract methods:
const report = await existingTier.report(address)

// Access to static methods in CombineTier
const accountOP = CombineTier.Opcodes.ACCOUNT;

// Obtaian default AlwaysTier instance with an ethers signer
const alwaysTier = await CombineTier.getAlwaysTier(signer);

```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [deploy](./combinetier.md#deploy-property-static) | `(signer: Signer, args: CombineTierDeployArgs, overrides?: TxOverrides) => Promise<CombineTier>` | Deploys a new CombineTier. |
|  [getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static) | `(chainId: number) => Addresses` | Obtain all the addresses deployed in a specific network with a chain ID.<br></br><i>Inherited from [AddressBook.getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static)</i> |
|  [getAlwaysTier](./combinetier.md#getAlwaysTier-property-static) | `(signer: Signer) => Promise<CombineTier>` | Get the instance Combine Tier connected to the deployed always tier in the current chain ID obtained with the provider |
|  [getChainId](./raincontract.md#getChainId-property-static) | `(signerOrProvider: Signer \| Provider) => Promise<number>` | Get the chain ID from a valid ethers provider.<br></br>Request to the provider stored in the signer which is the chain ID.<br></br><i>Inherited from [RainContract.getChainId](./raincontract.md#getChainId-property-static)</i> |
|  [getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static) | `(chainId: number) => string` | Obtain the latest subgraph endpoint related to the version that use the SDK.<br></br><i>Inherited from [AddressBook.getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static)</i> |
|  [isChild](./combinetier.md#isChild-property-static) | `(signer: Signer, maybeChild: string) => Promise<boolean>` | Checks if address is registered as a child contract of this contract in a specific network. |
|  [nameBookReference](./combinetier.md#nameBookReference-property-static) | `` | Name reference to find the address of the contract in the book address.<br></br><i>Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)</i> |
|  [Opcodes](./combinetier.md#Opcodes-property-static) | [CombineTierOpcodes](../types/combinetieropcodes.md) | All the opcodes avaialbles in the CombineTier contract. |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [address](./raincontract.md#address-property) | `string` | <i>Inherited from [RainContract.address](./raincontract.md#address-property)</i> |
|  [connect](./combinetier.md#connect-property) | `(signer: Signer) => CombineTier` | Connect the current instance to a new signer<br></br><i>Overrides [RainContract.connect](./raincontract.md#connect-property)</i> |
|  [levels](./tiercontract.md#levels-property) | `typeof Tier` | All the contract tier levels.<br></br><i>Inherited from [TierContract.levels](./tiercontract.md#levels-property)</i> |
|  [report](./tiercontract.md#report-property) | `(account: string, overrides?: ReadTxOverrides) => Promise<BigNumber>` | A tier report is a `uint256` that contains each of the block numbers each tier has been held continously since as a `uint32`<!-- -->. There are 9 possible tier, starting with tier 0 for `0` offset or "never held any tier" then working up through 8x 4 byte offsets to the full 256 bits.<br></br><i>Inherited from [TierContract.report](./tiercontract.md#report-property)</i> |
|  [setTier](./combinetier.md#setTier-property) | `(account: string, endTier: BigNumberish, data: BytesLike, overrides?: TxOverrides \| undefined) => Promise<never>` | It is NOT implemented in CombineTiers. Always will throw an error<br></br><i>Overrides [TierContract.setTier](./tiercontract.md#setTier-property)</i> |
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

Deploys a new CombineTier.

<b>Signature:</b>

```typescript
static deploy: (signer: Signer, args: CombineTierDeployArgs, overrides?: TxOverrides) => Promise<CombineTier>;
```

<a id="getAlwaysTier-property-static"></a>

### getAlwaysTier

Get the instance Combine Tier connected to the deployed always tier in the current chain ID obtained with the provider

<b>Signature:</b>

```typescript
static getAlwaysTier: (signer: Signer) => Promise<CombineTier>;
```

<a id="isChild-property-static"></a>

### isChild

Checks if address is registered as a child contract of this contract in a specific network.

The methods require a signer that will be used to call to the Factory Contract and ask if the address provided is a child. Also it is necessary to get the current Chain ID using the provider in the signer.

<b>Signature:</b>

```typescript
static isChild: (signer: Signer, maybeChild: string) => Promise<boolean>;
```

<a id="nameBookReference-property-static"></a>

### nameBookReference

Name reference to find the address of the contract in the book address.

<i>Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)</i>

Should be implemented in each class to find the factory address in the book.

<b>Signature:</b>

```typescript
protected static readonly nameBookReference = "combineTierFactory";
```

<a id="Opcodes-property-static"></a>

### Opcodes

All the opcodes avaialbles in the CombineTier contract.

This expose all the standard opcodes along with the specific opcodes of the CombineTier

<b>Signature:</b>

```typescript
static Opcodes: CombineTierOpcodes;
```

## Property Details

<a id="connect-property"></a>

### connect

Connect the current instance to a new signer

<i>Overrides [RainContract.connect](./raincontract.md#connect-property)</i>

<b>Signature:</b>

```typescript
readonly connect: (signer: Signer) => CombineTier;
```

<a id="setTier-property"></a>

### setTier

It is NOT implemented in CombineTiers. Always will throw an error

<i>Overrides [TierContract.setTier](./tiercontract.md#setTier-property)</i>

<b>Signature:</b>

```typescript
readonly setTier: (account: string, endTier: BigNumberish, data: BytesLike, overrides?: TxOverrides | undefined) => Promise<never>;
```
