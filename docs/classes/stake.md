
# Class Stake

A class for calling methods on a Stake.

This class provides an easy way to interact with Stake contracts.

<b>Signature:</b>

```typescript
class Stake extends TierContract 
```

## Example


```typescript
import { Stake } from 'rain-sdk';

// To get a instance of an already deployed stake contract, pass the contract address and an ethers.js Signer
const stake = new Stake(address, signer);

// Check if an address is child from the factory deployed in the current chain.
await Stake.isChild(signer, maybeChildAddress);

```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [deploy](./stake.md#deploy-property-static) | `(signer: Signer, args: StakeDeployArgs, overrides?: TxOverrides) => Promise<Stake>` | Deploys a new Stake. |
|  [getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static) | `(chainId: number) => Addresses` | Obtain all the addresses deployed in a specific network with a chain ID.<br></br>*Inherited from [AddressBook.getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static)* |
|  [getChainId](./raincontract.md#getChainId-property-static) | `(signerOrProvider: Signer \| Provider) => Promise<number>` | Get the chain ID from a valid ethers provider.<br></br>Request to the provider stored in the signer which is the chain ID.<br></br>*Inherited from [RainContract.getChainId](./raincontract.md#getChainId-property-static)* |
|  [getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static) | `(chainId: number) => string` | Obtain the latest subgraph endpoint related to the version that use the SDK.<br></br>*Inherited from [AddressBook.getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static)* |
|  [isChild](./stake.md#isChild-property-static) | `(signer: Signer, maybeChild: string) => Promise<boolean>` | Checks if address is registered as a child contract of this StakeFactory on a specific network |
|  [nameBookReference](./stake.md#nameBookReference-property-static) | `string` | Name reference to find the address of the contract in the book address.<br></br>*Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)* |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [address](./raincontract.md#address-property) | `string` | The contract address of the instance.<br></br>*Inherited from [RainContract.address](./raincontract.md#address-property)* |
|  [allowance](./stake.md#allowance-property) | `(owner: string, spender: string, overrides?: ReadTxOverrides) => Promise<BigNumber>` |  |
|  [approve](./stake.md#approve-property) | `(spender: string, amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` |  |
|  [balanceOf](./stake.md#balanceOf-property) | `(account: string, overrides?: ReadTxOverrides) => Promise<BigNumber>` |  |
|  [connect](./stake.md#connect-property) | `(signer: Signer) => Stake` | Connect the current contract instance to a new ethers signer.<br></br>*Overrides [RainContract.connect](./raincontract.md#connect-property)* |
|  [decimals](./stake.md#decimals-property) | `(overrides?: ReadTxOverrides) => Promise<number>` |  |
|  [decreaseAllowance](./stake.md#decreaseAllowance-property) | `(spender: string, subtractedValue: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` |  |
|  [deposit](./stake.md#deposit-property) | `(amount_: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` |  |
|  [increaseAllowance](./stake.md#increaseAllowance-property) | `(spender: string, addedValue: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` |  |
|  [levels](./tiercontract.md#levels-property) | `typeof Tier` | All the contract tier levels availables in all ITier contracts.<br></br>*Inherited from [TierContract.levels](./tiercontract.md#levels-property)* |
|  [name](./stake.md#name-property) | `(overrides?: ReadTxOverrides) => Promise<string>` |  |
|  [report](./tiercontract.md#report-property) | `(account: string, context: BigNumberish[], overrides?: ReadTxOverrides) => Promise<BigNumber>` | A tier report is a `uint256` that contains each of the block numbers each tier has been held continously since as a `uint32`<!-- -->.<br></br>*Inherited from [TierContract.report](./tiercontract.md#report-property)* |
|  [reportTimeForTier](./tiercontract.md#reportTimeForTier-property) | `(account: string, tier: BigNumberish, context: BigNumberish[], overrides?: ReadTxOverrides) => Promise<BigNumber>` | *Inherited from [TierContract.reportTimeForTier](./tiercontract.md#reportTimeForTier-property)* |
|  [signer](./raincontract.md#signer-property) | `Signer` | The ethers signer that is connected to the instance.<br></br>*Inherited from [RainContract.signer](./raincontract.md#signer-property)* |
|  [supportsInterface](./stake.md#supportsInterface-property) | `(interfaceId_: BytesLike, overrides?: ReadTxOverrides) => Promise<boolean>` |  |
|  [symbol](./stake.md#symbol-property) | `(overrides?: ReadTxOverrides) => Promise<string>` |  |
|  [totalSupply](./stake.md#totalSupply-property) | `(overrides?: ReadTxOverrides) => Promise<BigNumber>` |  |
|  [transfer](./stake.md#transfer-property) | `(to: string, amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` |  |
|  [transferFrom](./stake.md#transferFrom-property) | `(from: string, to: string, amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` |  |
|  [withdraw](./stake.md#withdraw-property) | `(amount_: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` |  |

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
|  [currentTier(account, timestamp)](./tiercontract.md#currentTier-method-1) | Get the current tier of an `account` in the Tier as an expression between `[0 - 8]`<!-- -->. Tier 0 is that a address has never interact with the Tier Contract.<br></br>*Inherited from [TierContract.currentTier()](./tiercontract.md#currentTier-method-1)* |

## Static Property Details

<a id="deploy-property-static"></a>

### deploy

Deploys a new Stake.

<b>Signature:</b>

```typescript
static deploy: (signer: Signer, args: StakeDeployArgs, overrides?: TxOverrides) => Promise<Stake>;
```

<a id="isChild-property-static"></a>

### isChild

Checks if address is registered as a child contract of this StakeFactory on a specific network

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

<a id="allowance-property"></a>

### allowance

<b>Signature:</b>

```typescript
readonly allowance: (owner: string, spender: string, overrides?: ReadTxOverrides) => Promise<BigNumber>;
```

<a id="approve-property"></a>

### approve

<b>Signature:</b>

```typescript
readonly approve: (spender: string, amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="balanceOf-property"></a>

### balanceOf

<b>Signature:</b>

```typescript
readonly balanceOf: (account: string, overrides?: ReadTxOverrides) => Promise<BigNumber>;
```

<a id="connect-property"></a>

### connect

Connect the current contract instance to a new ethers signer.

*Overrides [RainContract.connect](./raincontract.md#connect-property)*

<b>Signature:</b>

```typescript
readonly connect: (signer: Signer) => Stake;
```

<a id="decimals-property"></a>

### decimals

<b>Signature:</b>

```typescript
readonly decimals: (overrides?: ReadTxOverrides) => Promise<number>;
```

<a id="decreaseAllowance-property"></a>

### decreaseAllowance

<b>Signature:</b>

```typescript
readonly decreaseAllowance: (spender: string, subtractedValue: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="deposit-property"></a>

### deposit

<b>Signature:</b>

```typescript
readonly deposit: (amount_: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="increaseAllowance-property"></a>

### increaseAllowance

<b>Signature:</b>

```typescript
readonly increaseAllowance: (spender: string, addedValue: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="name-property"></a>

### name

<b>Signature:</b>

```typescript
readonly name: (overrides?: ReadTxOverrides) => Promise<string>;
```

<a id="supportsInterface-property"></a>

### supportsInterface

<b>Signature:</b>

```typescript
readonly supportsInterface: (interfaceId_: BytesLike, overrides?: ReadTxOverrides) => Promise<boolean>;
```

<a id="symbol-property"></a>

### symbol

<b>Signature:</b>

```typescript
readonly symbol: (overrides?: ReadTxOverrides) => Promise<string>;
```

<a id="totalSupply-property"></a>

### totalSupply

<b>Signature:</b>

```typescript
readonly totalSupply: (overrides?: ReadTxOverrides) => Promise<BigNumber>;
```

<a id="transfer-property"></a>

### transfer

<b>Signature:</b>

```typescript
readonly transfer: (to: string, amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="transferFrom-property"></a>

### transferFrom

<b>Signature:</b>

```typescript
readonly transferFrom: (from: string, to: string, amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="withdraw-property"></a>

### withdraw

<b>Signature:</b>

```typescript
readonly withdraw: (amount_: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>;
```
