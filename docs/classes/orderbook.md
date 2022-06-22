
# Class OrderBook

A class for calling method on a OrderBook.

This class provides an easy way to interact with the OrderBook contract.

<b>Signature:</b>

```typescript
class OrderBook extends RainContract 
```

## Example


```typescript
import { OrderBook } from 'rain-sdk'

const orderBook = new OrderBook(address, signer);

const addOrderArg = {
  inputToken: token1Address;
  inputVaultId: vaultID_1;
  outputToken: token2Address;
  outputVaultId: vaultID_2;
  tracking: tracking;
  vmStateConfig: _stateConfig;
}

const tx = await orderBook.addOrder(addOrderArg);

```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [get](./orderbook.md#get-property-static) | `(signer: Signer) => Promise<OrderBook>` | Get the OrderBook instance<br></br>The function ask to the provider inside of the ethers signer what is the chain identifier to get the address in this chain. |
|  [getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static) | `(chainId: number) => Addresses` | Obtain all the addresses deployed in a specific network with a chain ID.<br></br>*Inherited from [AddressBook.getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static)* |
|  [getChainId](./raincontract.md#getChainId-property-static) | `(signerOrProvider: Signer \| Provider) => Promise<number>` | Get the chain ID from a valid ethers provider.<br></br>Request to the provider stored in the signer which is the chain ID.<br></br>*Inherited from [RainContract.getChainId](./raincontract.md#getChainId-property-static)* |
|  [getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static) | `(chainId: number) => string` | Obtain the latest subgraph endpoint related to the version that use the SDK.<br></br>*Inherited from [AddressBook.getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static)* |
|  [nameBookReference](./orderbook.md#nameBookReference-property-static) | `string` | Name reference to find the address of the contract in the book address.<br></br>*Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)* |
|  [Opcodes](./orderbook.md#Opcodes-property-static) | [OrderBookOpcodes](../types/orderbookopcodes.md) | All the opcodes avaialbles in the OrderBook contract. |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [addOrder](./orderbook.md#addOrder-property) | `(orderConfig_: OrderConfig, overrides?: TxOverrides) => Promise<ContractTransaction>` |  |
|  [address](./raincontract.md#address-property) | `string` | The contract address of the instance.<br></br>*Inherited from [RainContract.address](./raincontract.md#address-property)* |
|  [clear](./orderbook.md#clear-property) | `(a_: Order, b_: Order, bountyConfig_: BountyConfig, overrides?: TxOverrides) => Promise<ContractTransaction>` |  |
|  [connect](./orderbook.md#connect-property) | `(signer: Signer) => OrderBook` | Connect the current contract instance to a new ethers signer.<br></br>*Overrides [RainContract.connect](./raincontract.md#connect-property)* |
|  [deposit](./orderbook.md#deposit-property) | `(config_: DepositConfig, overrides?: TxOverrides) => Promise<ContractTransaction>` |  |
|  [fnPtrs](./orderbook.md#fnPtrs-property) | `(overrides?: ReadTxOverrides) => Promise<string>` |  |
|  [removeOrder](./orderbook.md#removeOrder-property) | `(order_: Order, overrides?: TxOverrides) => Promise<ContractTransaction>` |  |
|  [signer](./raincontract.md#signer-property) | `Signer` | The ethers signer that is connected to the instance.<br></br>*Inherited from [RainContract.signer](./raincontract.md#signer-property)* |
|  [storageOpcodesRange](./orderbook.md#storageOpcodesRange-property) | `(overrides?: ReadTxOverrides) => Promise<StorageOpcodesRange>` |  |
|  [withdraw](./orderbook.md#withdraw-property) | `(config_: WithdrawConfig, overrides?: TxOverrides) => Promise<ContractTransaction>` |  |

## Static Methods

|  Method | Description |
|  --- | --- |
|  [getBookAddress(chainId)](./raincontract.md#getBookAddress-method-static-1) | Get the address stored in the book for a determined chain if it is available.<br></br>*Inherited from [RainContract.getBookAddress()](./raincontract.md#getBookAddress-method-static-1)* |

## Methods

|  Method | Description |
|  --- | --- |
|  [checkAddress(address, message)](./raincontract.md#checkAddress-method-1) | Check if an address is correctly formatted and throw an error if it is not an valid address<br></br>*Inherited from [RainContract.checkAddress()](./raincontract.md#checkAddress-method-1)* |

## Static Property Details

<a id="get-property-static"></a>

### get

Get the OrderBook instance

The function ask to the provider inside of the ethers signer what is the chain identifier to get the address in this chain.

<b>Signature:</b>

```typescript
static get: (signer: Signer) => Promise<OrderBook>;
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

<a id="Opcodes-property-static"></a>

### Opcodes

All the opcodes avaialbles in the OrderBook contract.

This expose all the standard opcodes along with the specific opcodes of the OrderBook.

<b>Signature:</b>

```typescript
static Opcodes: OrderBookOpcodes;
```

## Property Details

<a id="addOrder-property"></a>

### addOrder

<b>Signature:</b>

```typescript
readonly addOrder: (orderConfig_: OrderConfig, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="clear-property"></a>

### clear

<b>Signature:</b>

```typescript
readonly clear: (a_: Order, b_: Order, bountyConfig_: BountyConfig, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="connect-property"></a>

### connect

Connect the current contract instance to a new ethers signer.

*Overrides [RainContract.connect](./raincontract.md#connect-property)*

<b>Signature:</b>

```typescript
readonly connect: (signer: Signer) => OrderBook;
```

<a id="deposit-property"></a>

### deposit

<b>Signature:</b>

```typescript
readonly deposit: (config_: DepositConfig, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="fnPtrs-property"></a>

### fnPtrs

<b>Signature:</b>

```typescript
readonly fnPtrs: (overrides?: ReadTxOverrides) => Promise<string>;
```

<a id="removeOrder-property"></a>

### removeOrder

<b>Signature:</b>

```typescript
readonly removeOrder: (order_: Order, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="storageOpcodesRange-property"></a>

### storageOpcodesRange

<b>Signature:</b>

```typescript
readonly storageOpcodesRange: (overrides?: ReadTxOverrides) => Promise<StorageOpcodesRange>;
```

<a id="withdraw-property"></a>

### withdraw

<b>Signature:</b>

```typescript
readonly withdraw: (config_: WithdrawConfig, overrides?: TxOverrides) => Promise<ContractTransaction>;
```
