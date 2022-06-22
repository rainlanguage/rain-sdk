
# Class TierContract

Combine the static methods that are present in factories with the ITier instance methods. Should be use to the TierFactories.

<b>Signature:</b>

```typescript
abstract class TierContract extends FactoryContract 
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
|  [connect](./raincontract.md#connect-property) | `(signer: Signer) => RainContract` | Connect the current contract instance to a new ethers signer.<br></br>*Inherited from [RainContract.connect](./raincontract.md#connect-property)* |
|  [levels](./tiercontract.md#levels-property) | `typeof Tier` | All the contract tier levels availables in all ITier contracts. |
|  [report](./tiercontract.md#report-property) | `(account: string, context: BigNumberish[], overrides?: ReadTxOverrides) => Promise<BigNumber>` | A tier report is a `uint256` that contains each of the block numbers each tier has been held continously since as a `uint32`<!-- -->. |
|  [reportTimeForTier](./tiercontract.md#reportTimeForTier-property) | `(account: string, tier: BigNumberish, context: BigNumberish[], overrides?: ReadTxOverrides) => Promise<BigNumber>` |  |
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
|  [currentTier(account, timestamp)](./tiercontract.md#currentTier-method-1) | Get the current tier of an `account` in the Tier as an expression between `[0 - 8]`<!-- -->. Tier 0 is that a address has never interact with the Tier Contract. |

## Property Details

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

There are 9 possible tier, starting with tier 0 for `0` offset or "never held any tier" then working up through 8x 4 byte offsets to the full 256 bits.

<b>Signature:</b>

```typescript
readonly report: (account: string, context: BigNumberish[], overrides?: ReadTxOverrides) => Promise<BigNumber>;
```

<a id="reportTimeForTier-property"></a>

### reportTimeForTier

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

