
# Class OrderBook

A class for calling method on a Rain OrderBook contract.

This class provides an easy way to interact with the OrderBook contract.

<b>Signature:</b>

```typescript
class OrderBook extends RainContract 
```

## Example


```typescript
import { OrderBook } from 'rain-sdk'

const orderBook = await Orderbook.get(signer);
or
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
|  [get](./orderbook.md#get-property-static) | `(signer: Signer) => Promise<OrderBook>` | Get the OrderBook instance<br></br>The function ask to the provider inside of the ethers signer what is the chain identifier to get the address of the Orderbook Contract in this chain and connect to it. |
|  [getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static) | `(chainId: number) => Addresses` | Obtain all the addresses deployed in a specific network with a chain ID.<br></br>*Inherited from [AddressBook.getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static)* |
|  [getChainId](./raincontract.md#getChainId-property-static) | `(signerOrProvider: Signer \| Provider) => Promise<number>` | Get the chain ID from a valid ethers provider.<br></br>Request to the provider stored in the signer which is the chain ID.<br></br>*Inherited from [RainContract.getChainId](./raincontract.md#getChainId-property-static)* |
|  [getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static) | `(chainId: number) => string` | Obtain the latest subgraph endpoint related to the version that use the SDK.<br></br>*Inherited from [AddressBook.getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static)* |
|  [nameBookReference](./orderbook.md#nameBookReference-property-static) | `string` | Name reference to find the address of the contract in the book address.<br></br>*Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)* |
|  [Opcodes](./orderbook.md#Opcodes-property-static) | [OrderBookOpcodes](../types/orderbookopcodes.md) | All the opcodes avaialbles in the OrderBook contract. |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [addOrder](./orderbook.md#addOrder-property) | `(orderConfig_: OrderConfig, overrides?: TxOverrides) => Promise<ContractTransaction>` | Adds an order config for signer (as the owner) into the Orderbook |
|  [address](./raincontract.md#address-property) | `string` | The contract address of the instance.<br></br>*Inherited from [RainContract.address](./raincontract.md#address-property)* |
|  [clear](./orderbook.md#clear-property) | `(a_: Order, b_: Order, clearConfig_: ClearConfig, overrides?: TxOverrides) => Promise<ContractTransaction>` | Clears 2 matching order against each other, a\_ inputToken must match to b\_ outputToken and a\_ outputToken must match to b\_ inputToken. Order a\_ clears into Order b\_ and vice versa. The difference of the clearing amounts will go into the bounty's vaults and if any of them are negative then the transaction will revert |
|  [connect](./orderbook.md#connect-property) | `(signer: Signer) => OrderBook` | Connect to this Orderbook instance with a new signer<br></br>*Overrides [RainContract.connect](./raincontract.md#connect-property)* |
|  [deposit](./orderbook.md#deposit-property) | `(config_: DepositConfig, overrides?: TxOverrides) => Promise<ContractTransaction>` | Allows the sender to deposit any tokens into their own vaults. The deposit will be 'config\_.amount' of the 'config\_.token' into 'config\_.vaultId' |
|  [packedFunctionPointers](./orderbook.md#packedFunctionPointers-property) | `(overrides?: ReadTxOverrides) => Promise<string>` | Pointers to opcode functions, necessary for being able to read the packedBytes |
|  [removeOrder](./orderbook.md#removeOrder-property) | `(order_: Order, overrides?: TxOverrides) => Promise<ContractTransaction>` | Removes an order from the Orderbook completely. |
|  [signer](./raincontract.md#signer-property) | `Signer` | The ethers signer that is connected to the instance.<br></br>*Inherited from [RainContract.signer](./raincontract.md#signer-property)* |
|  [storageOpcodesRange](./orderbook.md#storageOpcodesRange-property) | `(overrides?: ReadTxOverrides) => Promise<StorageOpcodesRange>` | Returns the pointer and length for sale's storage opcodes |
|  [withdraw](./orderbook.md#withdraw-property) | `(config_: WithdrawConfig, overrides?: TxOverrides) => Promise<ContractTransaction>` | Allows the sender to withdraw any tokens from their own vaults. Notably if the amount is less than the current vault balance then the vault will be cleared to 0 rather than the withdraw transaction reverting. The withdraw will be 'config\_.amount' of the 'config\_.token' from 'config\_.vaultId' |

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

The function ask to the provider inside of the ethers signer what is the chain identifier to get the address of the Orderbook Contract in this chain and connect to it.

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

This expose all the standard opcodes along with the specific local OrderBook opcodes.

<b>Signature:</b>

```typescript
static Opcodes: OrderBookOpcodes;
```

## Property Details

<a id="addOrder-property"></a>

### addOrder

Adds an order config for signer (as the owner) into the Orderbook

<b>Signature:</b>

```typescript
readonly addOrder: (orderConfig_: OrderConfig, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="clear-property"></a>

### clear

Clears 2 matching order against each other, a\_ inputToken must match to b\_ outputToken and a\_ outputToken must match to b\_ inputToken. Order a\_ clears into Order b\_ and vice versa. The difference of the clearing amounts will go into the bounty's vaults and if any of them are negative then the transaction will revert

<b>Signature:</b>

```typescript
readonly clear: (a_: Order, b_: Order, clearConfig_: ClearConfig, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="connect-property"></a>

### connect

Connect to this Orderbook instance with a new signer

*Overrides [RainContract.connect](./raincontract.md#connect-property)*

<b>Signature:</b>

```typescript
readonly connect: (signer: Signer) => OrderBook;
```

<a id="deposit-property"></a>

### deposit

Allows the sender to deposit any tokens into their own vaults. The deposit will be 'config\_.amount' of the 'config\_.token' into 'config\_.vaultId'

<b>Signature:</b>

```typescript
readonly deposit: (config_: DepositConfig, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="packedFunctionPointers-property"></a>

### packedFunctionPointers

Pointers to opcode functions, necessary for being able to read the packedBytes

<b>Signature:</b>

```typescript
readonly packedFunctionPointers: (overrides?: ReadTxOverrides) => Promise<string>;
```

<a id="removeOrder-property"></a>

### removeOrder

Removes an order from the Orderbook completely.

<b>Signature:</b>

```typescript
readonly removeOrder: (order_: Order, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="storageOpcodesRange-property"></a>

### storageOpcodesRange

Returns the pointer and length for sale's storage opcodes

<b>Signature:</b>

```typescript
readonly storageOpcodesRange: (overrides?: ReadTxOverrides) => Promise<StorageOpcodesRange>;
```

<a id="withdraw-property"></a>

### withdraw

Allows the sender to withdraw any tokens from their own vaults. Notably if the amount is less than the current vault balance then the vault will be cleared to 0 rather than the withdraw transaction reverting. The withdraw will be 'config\_.amount' of the 'config\_.token' from 'config\_.vaultId'

<b>Signature:</b>

```typescript
readonly withdraw: (config_: WithdrawConfig, overrides?: TxOverrides) => Promise<ContractTransaction>;
```
