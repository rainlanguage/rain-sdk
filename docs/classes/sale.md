
# Class Sale

A class for deploying and calling methods on a Sale.

This class provides an easy way to deploy Sales using Rain's canonical factories, and methods for interacting with an already deployed Sale.

<b>Signature:</b>

```typescript
class Sale extends FactoryContract 
```

## Example


```typescript
import { Sale } from 'rain-sdk'
// To deploy a new Sale, pass an ethers.js Signer and the config for the Sale.
const newSale = await Sale.deploy(signer, SaleArgs)

// To connect to an existing Sale just pass the address and an ethers.js Signer.
const existingSale = new Sale(address, signer)

// Once you have a Sale, you can call the smart contract methods:
await existingSale.start()
await existingSale.buy(config_)

```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [deploy](./sale.md#deploy-property-static) | `(signer: Signer, saleConfig: SaleConfig, saleRedeemableERC20Config: SaleRedeemableERC20Config, overrides?: TxOverrides) => Promise<Sale>` | Deploys a new Sale. |
|  [getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static) | `(chainId: number) => Addresses` | Obtain all the addresses deployed in a specific network with a chain ID.<br></br>*Inherited from [AddressBook.getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static)* |
|  [getChainId](./raincontract.md#getChainId-property-static) | `(signerOrProvider: Signer \| Provider) => Promise<number>` | Get the chain ID from a valid ethers provider.<br></br>Request to the provider stored in the signer which is the chain ID.<br></br>*Inherited from [RainContract.getChainId](./raincontract.md#getChainId-property-static)* |
|  [getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static) | `(chainId: number) => string` | Obtain the latest subgraph endpoint related to the version that use the SDK.<br></br>*Inherited from [AddressBook.getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static)* |
|  [isChild](./sale.md#isChild-property-static) | `(signer: Signer, maybeChild: string) => Promise<boolean>` | Checks if address is registered as a child contract of this SaleFactory on a specific network |
|  [nameBookReference](./sale.md#nameBookReference-property-static) | `string` | Name reference to find the address of the contract in the book address.<br></br>*Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)* |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [address](./raincontract.md#address-property) | `string` | The contract address of the instance.<br></br>*Inherited from [RainContract.address](./raincontract.md#address-property)* |
|  [buy](./sale.md#buy-property) | `(config: BuyConfig, overrides?: TxOverrides) => Promise<ContractTransaction>` | Main entrypoint to the sale. Sells rTKN in exchange for reserve token. The price curve is eval'd to produce a reserve price quote. Each 1 unit of rTKN costs `price` reserve token where BOTH the rTKN units and price are treated as 18 decimal fixed point values. If the reserve token has more or less precision by its own conventions (e.g. "decimals" method on ERC20 tokens) then the price will need to scale accordingly. The receipt is \_logged\_ rather than returned as it cannot be used in same block for a refund anyway due to cooldowns. |
|  [calculateBuy](./sale.md#calculateBuy-property) | `(targetUnits: BigNumberish, overrides?: ReadTxOverrides) => Promise<[BigNumber, BigNumber]>` | Calculates the current reserve price quoted for 1 unit of rTKN. Used internally to process `buy` |
|  [canLive](./sale.md#canLive-property) | `(overrides?: ReadTxOverrides) => Promise<boolean>` | Can the sale live? Evals the "can live" script. If a non zero value is returned then the sale can move from pending to active, or remain active. If a zero value is returned the sale can remain pending or move from active to a finalised status. An out of stock (0 remaining units) WILL ALWAYS return `false` without evaluating the script. |
|  [claimFees](./sale.md#claimFees-property) | `(recipient: string, overrides?: TxOverrides) => Promise<ContractTransaction>` | After a sale ends in success all fees collected for a recipient can be cleared. If the raise is active or fails then fees cannot be claimed as they are set aside in case of refund. A failed raise implies that all buyers should immediately refund and zero fees claimed. |
|  [connect](./sale.md#connect-property) | `(signer: Signer) => Sale` | Connect the current contract instance to a new ethers signer.<br></br>*Overrides [RainContract.connect](./raincontract.md#connect-property)* |
|  [end](./sale.md#end-property) | `(overrides?: TxOverrides) => Promise<ContractTransaction>` | End the sale (move from active to success or fail). This is also done automatically inline with each `buy` call so is optional for anon to call outside of a purchase. - `canLive` MUST return true and sale status must be either `Active`<!-- -->. |
|  [fnPtrs](./sale.md#fnPtrs-property) | `(overrides?: ReadTxOverrides) => Promise<string>` | Pointers to opcode functions, necessary for being able to read the packedBytes |
|  [getRedeemable](./sale.md#getRedeemable-property) | `(signer?: Signer) => Promise<RedeemableERC20>` | Obtain the instance redeemable token from this sale. |
|  [getReserve](./sale.md#getReserve-property) | `(signer?: Signer) => Promise<ERC20>` | Obtain the instance of the reserve from this sale as a generic ERC20 Token |
|  [refund](./sale.md#refund-property) | `(receipt: Receipt, overrides?: TxOverrides) => Promise<ContractTransaction>` | Rollback a buy given its receipt. Ignoring gas (which cannot be refunded) the refund process rolls back all state changes caused by a buy, other than the receipt id increment. Refunds are limited by the global cooldown to mitigate rapid buy/refund cycling that could cause volatile price curves or other unwanted side effects for other sale participants. Cooldowns are bypassed if the sale ends and is a failure. |
|  [reserve](./sale.md#reserve-property) | `(overrides?: ReadTxOverrides) => Promise<string>` | Returns the address of the token that sale prices are denominated in. MUST NOT change during the lifecycle of the sale contract. |
|  [saleStatus](./sale.md#saleStatus-property) | `(overrides?: ReadTxOverrides) => Promise<number>` | Returns the current `SaleStatus` of the sale. Represents a linear progression of the sale through its major lifecycle events. |
|  [signer](./raincontract.md#signer-property) | `Signer` | The ethers signer that is connected to the instance.<br></br>*Inherited from [RainContract.signer](./raincontract.md#signer-property)* |
|  [start](./sale.md#start-property) | `(overrides?: TxOverrides) => Promise<ContractTransaction>` | Start the sale (move from pending to active). This is also done automatically inline with each `buy` call so is optional for anon to call outside of a purchase. - `canLive` MUST return true and sale status must be `Pending`<!-- -->. |
|  [storageOpcodesRange](./sale.md#storageOpcodesRange-property) | `(overrides?: ReadTxOverrides) => Promise<StorageOpcodesRange>` | Returns the pointer and length for sale's storage opcodes |
|  [timeout](./sale.md#timeout-property) | `(overrides?: TxOverrides) => Promise<ContractTransaction>` | Timeout the sale (move from pending or active to fail). The ONLY condition for a timeout is that the `saleTimeout` block set during initialize is in the past. This means that regardless of what happens re: starting, ending, buying, etc. if the sale does NOT manage to unambiguously end by the timeout block then it can timeout to a fail state. This means that any downstream escrows or similar can always expect that eventually they will see a pass/fail state and so are safe to lock funds while a Sale is active. |
|  [token](./sale.md#token-property) | `(overrides?: ReadTxOverrides) => Promise<string>` | Returns the address of the token being sold in the sale. MUST NOT change during the lifecycle of the sale contract. |

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

## Static Property Details

<a id="deploy-property-static"></a>

### deploy

Deploys a new Sale.

<b>Signature:</b>

```typescript
static deploy: (signer: Signer, saleConfig: SaleConfig, saleRedeemableERC20Config: SaleRedeemableERC20Config, overrides?: TxOverrides) => Promise<Sale>;
```

<a id="isChild-property-static"></a>

### isChild

Checks if address is registered as a child contract of this SaleFactory on a specific network

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

<a id="buy-property"></a>

### buy

Main entrypoint to the sale. Sells rTKN in exchange for reserve token. The price curve is eval'd to produce a reserve price quote. Each 1 unit of rTKN costs `price` reserve token where BOTH the rTKN units and price are treated as 18 decimal fixed point values. If the reserve token has more or less precision by its own conventions (e.g. "decimals" method on ERC20 tokens) then the price will need to scale accordingly. The receipt is \_logged\_ rather than returned as it cannot be used in same block for a refund anyway due to cooldowns.

<b>Signature:</b>

```typescript
readonly buy: (config: BuyConfig, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="calculateBuy-property"></a>

### calculateBuy

Calculates the current reserve price quoted for 1 unit of rTKN. Used internally to process `buy`

<b>Signature:</b>

```typescript
readonly calculateBuy: (targetUnits: BigNumberish, overrides?: ReadTxOverrides) => Promise<[BigNumber, BigNumber]>;
```

<a id="canLive-property"></a>

### canLive

Can the sale live? Evals the "can live" script. If a non zero value is returned then the sale can move from pending to active, or remain active. If a zero value is returned the sale can remain pending or move from active to a finalised status. An out of stock (0 remaining units) WILL ALWAYS return `false` without evaluating the script.

<b>Signature:</b>

```typescript
readonly canLive: (overrides?: ReadTxOverrides) => Promise<boolean>;
```

<a id="claimFees-property"></a>

### claimFees

After a sale ends in success all fees collected for a recipient can be cleared. If the raise is active or fails then fees cannot be claimed as they are set aside in case of refund. A failed raise implies that all buyers should immediately refund and zero fees claimed.

<b>Signature:</b>

```typescript
readonly claimFees: (recipient: string, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="connect-property"></a>

### connect

Connect the current contract instance to a new ethers signer.

*Overrides [RainContract.connect](./raincontract.md#connect-property)*

<b>Signature:</b>

```typescript
readonly connect: (signer: Signer) => Sale;
```

<a id="end-property"></a>

### end

End the sale (move from active to success or fail). This is also done automatically inline with each `buy` call so is optional for anon to call outside of a purchase. - `canLive` MUST return true and sale status must be either `Active`<!-- -->.

<b>Signature:</b>

```typescript
readonly end: (overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="fnPtrs-property"></a>

### fnPtrs

Pointers to opcode functions, necessary for being able to read the packedBytes

<b>Signature:</b>

```typescript
readonly fnPtrs: (overrides?: ReadTxOverrides) => Promise<string>;
```

<a id="getRedeemable-property"></a>

### getRedeemable

Obtain the instance redeemable token from this sale.

<b>Signature:</b>

```typescript
readonly getRedeemable: (signer?: Signer) => Promise<RedeemableERC20>;
```

<a id="getReserve-property"></a>

### getReserve

Obtain the instance of the reserve from this sale as a generic ERC20 Token

<b>Signature:</b>

```typescript
readonly getReserve: (signer?: Signer) => Promise<ERC20>;
```

<a id="refund-property"></a>

### refund

Rollback a buy given its receipt. Ignoring gas (which cannot be refunded) the refund process rolls back all state changes caused by a buy, other than the receipt id increment. Refunds are limited by the global cooldown to mitigate rapid buy/refund cycling that could cause volatile price curves or other unwanted side effects for other sale participants. Cooldowns are bypassed if the sale ends and is a failure.

<b>Signature:</b>

```typescript
readonly refund: (receipt: Receipt, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="reserve-property"></a>

### reserve

Returns the address of the token that sale prices are denominated in. MUST NOT change during the lifecycle of the sale contract.

<b>Signature:</b>

```typescript
readonly reserve: (overrides?: ReadTxOverrides) => Promise<string>;
```

<a id="saleStatus-property"></a>

### saleStatus

Returns the current `SaleStatus` of the sale. Represents a linear progression of the sale through its major lifecycle events.

<b>Signature:</b>

```typescript
readonly saleStatus: (overrides?: ReadTxOverrides) => Promise<number>;
```

<a id="start-property"></a>

### start

Start the sale (move from pending to active). This is also done automatically inline with each `buy` call so is optional for anon to call outside of a purchase. - `canLive` MUST return true and sale status must be `Pending`<!-- -->.

<b>Signature:</b>

```typescript
readonly start: (overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="storageOpcodesRange-property"></a>

### storageOpcodesRange

Returns the pointer and length for sale's storage opcodes

<b>Signature:</b>

```typescript
readonly storageOpcodesRange: (overrides?: ReadTxOverrides) => Promise<StorageOpcodesRange>;
```

<a id="timeout-property"></a>

### timeout

Timeout the sale (move from pending or active to fail). The ONLY condition for a timeout is that the `saleTimeout` block set during initialize is in the past. This means that regardless of what happens re: starting, ending, buying, etc. if the sale does NOT manage to unambiguously end by the timeout block then it can timeout to a fail state. This means that any downstream escrows or similar can always expect that eventually they will see a pass/fail state and so are safe to lock funds while a Sale is active.

<b>Signature:</b>

```typescript
readonly timeout: (overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="token-property"></a>

### token

Returns the address of the token being sold in the sale. MUST NOT change during the lifecycle of the sale contract.

<b>Signature:</b>

```typescript
readonly token: (overrides?: ReadTxOverrides) => Promise<string>;
```
