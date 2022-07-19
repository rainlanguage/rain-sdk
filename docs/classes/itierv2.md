
# Class ITierV2

Class to interact with any Rain Tier contract i.e ITierV2 contracts

Generic class to interact with any ITierV2 contract in chain with the basic methods and functions. `ITierV2` is a simple interface that contracts can implement to provide membership lists for other contracts. And all other Rain Tier contract inherit form it. This class can be used to interact with any contract that implement the ITierV2 interface in their code, but does not know if the contract has implemented the code.

<b>Signature:</b>

```typescript
class ITierV2 extends FactoryContract 
```

## Example


```typescript
import { ITierV2 } from "rain-sdk";

// to instantiate a new ethers.js ITierV2 contract from this class pass the contract address and signer
const newTier = new ITierV2(tierAddress, signer);

// to connect to an existing ITierV2 instance with a new signer
newTier.connect(signer);

```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static) | `(chainId: number) => Addresses` | Obtain all the addresses deployed in a specific network with a chain ID.<br></br>*Inherited from [AddressBook.getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static)* |
|  [getChainId](./raincontract.md#getChainId-property-static) | `(signerOrProvider: Signer \| Provider) => Promise<number>` | Get the chain ID from a valid ethers provider.<br></br>Request to the provider stored in the signer which is the chain ID.<br></br>*Inherited from [RainContract.getChainId](./raincontract.md#getChainId-property-static)* |
|  [getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static) | `(chainId: number) => string` | Obtain the latest subgraph endpoint related to the version that use the SDK.<br></br>*Inherited from [AddressBook.getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static)* |
|  [nameBookReference](./raincontract.md#nameBookReference-property-static) | `string` | Name reference to find the address of the contract in the book address.<br></br>*Inherited from [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)* |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [address](./raincontract.md#address-property) | `string` | The contract address of the instance.<br></br>*Inherited from [RainContract.address](./raincontract.md#address-property)* |
|  [connect](./itierv2.md#connect-property) | `(signer: Signer) => ITierV2` | Conncect to this ITierV2 contract with another signer<br></br>*Overrides [RainContract.connect](./raincontract.md#connect-property)* |
|  [levels](./itierv2.md#levels-property) | `typeof Tier` | All the contract tier levels availables in all ITier contracts. |
|  [report](./itierv2.md#report-property) | `(account: string, context: BigNumberish[], overrides?: ReadTxOverrides) => Promise<BigNumber>` | A tier report is a `uint256` that contains each of the block numbers each tier has been held continously since as a `uint32`<!-- -->. |
|  [reportTimeForTier](./itierv2.md#reportTimeForTier-property) | `(account: string, tier: BigNumberish, context: BigNumberish[], overrides?: ReadTxOverrides) => Promise<BigNumber>` | Same as report but only returns the time for a single tier. Often the implementing contract can calculate a single tier more efficiently than all 8 tiers. If the consumer only needs one or a few tiers it MAY be much cheaper to request only those tiers individually. |
|  [signer](./raincontract.md#signer-property) | `Signer` | The ethers signer that is connected to the instance.<br></br>*Inherited from [RainContract.signer](./raincontract.md#signer-property)* |

## Static Methods

|  Method | Description |
|  --- | --- |
|  [\_isChild(signer, maybeChild)](./factorycontract.md#_isChild-method-static-1) | Checks if address is registered as a child contract of the factory in the chain.<br></br>*Inherited from [FactoryContract.\_isChild()](./factorycontract.md#_isChild-method-static-1)* |
|  [getBookAddress(chainId)](./raincontract.md#getBookAddress-method-static-1) | Get the address stored in the book for a determined chain if it is available.<br></br>*Inherited from [RainContract.getBookAddress()](./raincontract.md#getBookAddress-method-static-1)* |
|  [getNewChildFromReceipt(receipt, parentContract)](./factorycontract.md#getNewChildFromReceipt-method-static-1) | Get the child from a receipt obtain from a Factory transaction<br></br>*Inherited from [FactoryContract.getNewChildFromReceipt()](./factorycontract.md#getNewChildFromReceipt-method-static-1)* |

## Methods

|  Method | Description |
|  --- | --- |
|  [checkAddress(address, message)](./raincontract.md#checkAddress-method-1) | Check if an address is correctly formatted and throw an error if it is not an valid address<br></br>*Inherited from [RainContract.checkAddress()](./raincontract.md#checkAddress-method-1)* |
|  [currentTier(account, timestamp)](./itierv2.md#currentTier-method-1) | Get the current tier of an `account` in the Tier as an expression between `[0 - 8]`<!-- -->. Tier 0 is that a address has never interact with the Tier Contract. |

## Property Details

<a id="connect-property"></a>

### connect

Conncect to this ITierV2 contract with another signer

*Overrides [RainContract.connect](./raincontract.md#connect-property)*

<b>Signature:</b>

```typescript
readonly connect: (signer: Signer) => ITierV2;
```

<a id="levels-property"></a>

### levels

All the contract tier levels availables in all ITier contracts.

<b>Signature:</b>

```typescript
readonly levels: typeof Tier;
```

<a id="report-property"></a>

### report

A tier report is a `uint256` that contains each of the block numbers each tier has been held continously since as a `uint32`<!-- -->.

There are 9 possible tier, starting with tier 0 for `0` offset or "never held any tier" and then working up through 8x 4 byte offsets to the full 256 bits.

<b>Signature:</b>

```typescript
readonly report: (account: string, context: BigNumberish[], overrides?: ReadTxOverrides) => Promise<BigNumber>;
```

<a id="reportTimeForTier-property"></a>

### reportTimeForTier

Same as report but only returns the time for a single tier. Often the implementing contract can calculate a single tier more efficiently than all 8 tiers. If the consumer only needs one or a few tiers it MAY be much cheaper to request only those tiers individually.

The return value is a `uint256` for gas efficiency but the values will be bounded by `type(uint32).max` as no single tier can report a value higher than this.

<b>Signature:</b>

```typescript
readonly reportTimeForTier: (account: string, tier: BigNumberish, context: BigNumberish[], overrides?: ReadTxOverrides) => Promise<BigNumber>;
```

## Method Details

<a id="currentTier-method-1"></a>

### currentTier(account, timestamp)

Get the current tier of an `account` in the Tier as an expression between `[0 - 8]`<!-- -->. Tier 0 is that a address has never interact with the Tier Contract.

<b>Signature:</b>

```typescript
currentTier(account: string, timestamp?: number): Promise<number>;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  account | `string` | address to check the current tier |
|  timestamp | `number` | (optional) check the level tier of an account with respect to a specific timestamp |

<b>Returns:</b>

`Promise<number>`

current tier level of the account

