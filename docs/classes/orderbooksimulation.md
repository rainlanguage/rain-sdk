
# Class OrderbookSimulation

A class for creating a simulation environment for simulating a Orderbook contract off-chain using JSVM. or to be used to perform off-chain matchmaking based on.

<b>Signature:</b>

```typescript
class OrderbookSimulation extends vmSimulation 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [address](./orderbooksimulation.md#address-property) | `string` | The EmissionsERC20 address of this class that the simulation is done for. this is needed for THIS\_ADDRESS opcode and updating storage types after method calls, and needs to be a string number or hex string.<br></br>*Overrides [vmSimulation.address](./vmsimulation.md#address-property)* |
|  [blockNumber](./vmsimulation.md#blockNumber-property) | `number` | A property for producing block number for the class which will be used in BLOCK\_NUMBER opcode but BLOCK\_NUMBER opcode can also be passed at runtime<br></br>*Inherited from [vmSimulation.blockNumber](./vmsimulation.md#blockNumber-property)* |
|  [clearedCounterPartyFunds](./orderbooksimulation.md#clearedCounterPartyFunds-property) | [clearedCounterPartyFunds](../interfaces/clearedcounterpartyfunds.md) | The property that stores all the data of an order's total cleared amount to a specific counterparty address which needs to be in form of a string number or hex string |
|  [clearedFunds](./orderbooksimulation.md#clearedFunds-property) | [clearedFunds](../interfaces/clearedfunds.md) | The property that stores all the data of an order's total cleared amount, |
|  [erc1155s](./vmsimulation.md#erc1155s-property) | [erc1155s](../interfaces/erc1155s.md) | A property of type erc1155s that act like a storage for simulation and stores the erc1155 token data. this is needed for IERC1155 related opcodes<br></br>*Inherited from [vmSimulation.erc1155s](./vmsimulation.md#erc1155s-property)* |
|  [erc20s](./vmsimulation.md#erc20s-property) | [erc20s](../interfaces/erc20s.md) | A property of type erc20s that act like a storage for simulation and stores the erc20 token data. this is needed for IERC20 related opcodes<br></br>*Inherited from [vmSimulation.erc20s](./vmsimulation.md#erc20s-property)* |
|  [erc721s](./vmsimulation.md#erc721s-property) | [erc721s](../interfaces/erc721s.md) | A property of type erc721s that act like a storage for simulation and stores the erc721 token data. this is needed for IERC721 related opcodes<br></br>*Inherited from [vmSimulation.erc721s](./vmsimulation.md#erc721s-property)* |
|  [iTiers](./vmsimulation.md#iTiers-property) | [itiers](../interfaces/itiers.md) | A property of type itiers that act like a storage for simulation of Rain tier contracts. this is needed for ITIERV2\_REPORT and ITIERV2\_REPORT\_TIME\_FOR\_TIER opcodes.<br></br>*Inherited from [vmSimulation.iTiers](./vmsimulation.md#iTiers-property)* |
|  [OpFns](./orderbooksimulation.md#OpFns-property) | [FnPtrs](../interfaces/fnptrs.md) | Local Orderbook Opcodes' functions body for simulation that uses the class properties/types.<br></br>*Overrides [vmSimulation.OpFns](./vmsimulation.md#OpFns-property)* |
|  [orders](./orderbooksimulation.md#orders-property) | [orders](../interfaces/orders.md) | The property that stores all the data of the class's orders, |
|  [script](./vmsimulation.md#script-property) | [StateConfig](../interfaces/stateconfig.md) | The script to simulate<br></br>*Inherited from [vmSimulation.script](./vmsimulation.md#script-property)* |
|  [sender](./orderbooksimulation.md#sender-property) | `string` | A sender that performs the simulation transactions. this is needed for SENDER opcode simulation, and updating storage types after method calls and needs to be a string number or hex string.<br></br>*Overrides [vmSimulation.sender](./vmsimulation.md#sender-property)* |
|  [timestamp](./vmsimulation.md#timestamp-property) | `number` | A property for producing timestamp for the class which will be used in BLOCK\_TIMESTAMP opcode but BLOCK\_TIMESTAMP opcode can also be passed at runtime<br></br>*Inherited from [vmSimulation.timestamp](./vmsimulation.md#timestamp-property)* |
|  [vaults](./orderbooksimulation.md#vaults-property) | [vaults](../interfaces/vaults.md) | The property that stores all the data of the class's vaults |

## Methods

|  Method | Description |
|  --- | --- |
|  [addAssets(erc20s, erc721s, erc1155s)](./vmsimulation.md#addAssets-method-1) | Method to add assets i.e erc20/721/1155 types objects<br></br>*Inherited from [vmSimulation.addAssets()](./vmsimulation.md#addAssets-method-1)* |
|  [addITiers(iTiers)](./vmsimulation.md#addITiers-method-1) | Method to add tier contract types objects to the class (iTiers)<br></br>*Inherited from [vmSimulation.addITiers()](./vmsimulation.md#addITiers-method-1)* |
|  [addOrder(order)](./orderbooksimulation.md#addOrder-method-1) | Method to submit an order into the class orders |
|  [clear(a, b, bountyConfig, timestamp, blockNumber)](./orderbooksimulation.md#clear-method-1) | Method to perform the clear by JSVM for this simulation which will update all the present storage/types of the the class |
|  [deposit(sender, tokenAddress, vaultId, units, tokenDecimals)](./orderbooksimulation.md#deposit-method-1) | Method to dposit some units of token of tokenAddress into the vaultId of the sender |
|  [removeOrder(order)](./orderbooksimulation.md#removeOrder-method-1) | Method to remove an order from the class's orders |
|  [runScript(data, index)](./vmsimulation.md#runScript-method-1) | Method to run the script using JSVM<br></br>*Inherited from [vmSimulation.runScript()](./vmsimulation.md#runScript-method-1)* |
|  [setContractAddress(contractAddress)](./vmsimulation.md#setContractAddress-method-1) | Method to set the class address property<br></br>*Inherited from [vmSimulation.setContractAddress()](./vmsimulation.md#setContractAddress-method-1)* |
|  [setScript(script)](./vmsimulation.md#setScript-method-1) | Method to set the class script<br></br>*Inherited from [vmSimulation.setScript()](./vmsimulation.md#setScript-method-1)* |
|  [setSender(senderAddress)](./vmsimulation.md#setSender-method-1) | Method to set the class sender property<br></br>*Inherited from [vmSimulation.setSender()](./vmsimulation.md#setSender-method-1)* |
|  [withdraw(sender, tokenAddress, vaultId, units, tokenDecimals)](./orderbooksimulation.md#withdraw-method-1) | Method to withdraw some units of token of tokenAddress from VaultId of the sender |

## Property Details

<a id="address-property"></a>

### address

The EmissionsERC20 address of this class that the simulation is done for. this is needed for THIS\_ADDRESS opcode and updating storage types after method calls, and needs to be a string number or hex string.

*Overrides [vmSimulation.address](./vmsimulation.md#address-property)*

<b>Signature:</b>

```typescript
address: string;
```

<a id="clearedCounterPartyFunds-property"></a>

### clearedCounterPartyFunds

The property that stores all the data of an order's total cleared amount to a specific counterparty address which needs to be in form of a string number or hex string

<b>Signature:</b>

```typescript
clearedCounterPartyFunds: clearedCounterPartyFunds;
```

<a id="clearedFunds-property"></a>

### clearedFunds

The property that stores all the data of an order's total cleared amount,

<b>Signature:</b>

```typescript
clearedFunds: clearedFunds;
```

<a id="OpFns-property"></a>

### OpFns

Local Orderbook Opcodes' functions body for simulation that uses the class properties/types.

*Overrides [vmSimulation.OpFns](./vmsimulation.md#OpFns-property)*

<b>Signature:</b>

```typescript
protected OpFns: FnPtrs;
```

<a id="orders-property"></a>

### orders

The property that stores all the data of the class's orders,

<b>Signature:</b>

```typescript
orders: orders;
```

<a id="sender-property"></a>

### sender

A sender that performs the simulation transactions. this is needed for SENDER opcode simulation, and updating storage types after method calls and needs to be a string number or hex string.

*Overrides [vmSimulation.sender](./vmsimulation.md#sender-property)*

<b>Signature:</b>

```typescript
sender: string;
```

<a id="vaults-property"></a>

### vaults

The property that stores all the data of the class's vaults

<b>Signature:</b>

```typescript
vaults: vaults;
```

## Method Details

<a id="addOrder-method-1"></a>

### addOrder(order)

Method to submit an order into the class orders

<b>Signature:</b>

```typescript
addOrder(order: order): void;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  order | [order](../interfaces/order.md) | the order to add |

<b>Returns:</b>

`void`

void

<a id="clear-method-1"></a>

### clear(a, b, bountyConfig, timestamp, blockNumber)

Method to perform the clear by JSVM for this simulation which will update all the present storage/types of the the class

<b>Signature:</b>

```typescript
clear(a: order, b: order, bountyConfig: bountyConfig, timestamp?: number, blockNumber?: number): Promise<void>;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  a | [order](../interfaces/order.md) | order A to clear |
|  b | [order](../interfaces/order.md) | order B to clear |
|  bountyConfig | [bountyConfig](../interfaces/bountyconfig.md) | the BountyConfig type to collect bounties of this clear |
|  timestamp | `number` | (optional) custom timestamp to be used when running the script |
|  blockNumber | `number` | (optional) custom block number to be used when running the script |

<b>Returns:</b>

`Promise<void>`

void

<a id="deposit-method-1"></a>

### deposit(sender, tokenAddress, vaultId, units, tokenDecimals)

Method to dposit some units of token of tokenAddress into the vaultId of the sender

<b>Signature:</b>

```typescript
deposit(sender: string, tokenAddress: string, vaultId: string, units: number, tokenDecimals?: number): void;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  sender | `string` | sender that deposit is done for |
|  tokenAddress | `string` | the address of the token |
|  vaultId | `string` | the vault ID to deposit |
|  units | `number` | amount of token to deposit |
|  tokenDecimals | `number` | (optional) decimals of the token, 18 will be used as default |

<b>Returns:</b>

`void`

void

<a id="removeOrder-method-1"></a>

### removeOrder(order)

Method to remove an order from the class's orders

<b>Signature:</b>

```typescript
removeOrder(order: order | string): void;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  order | `order \| string` | the order to remove |

<b>Returns:</b>

`void`

void

<a id="withdraw-method-1"></a>

### withdraw(sender, tokenAddress, vaultId, units, tokenDecimals)

Method to withdraw some units of token of tokenAddress from VaultId of the sender

<b>Signature:</b>

```typescript
withdraw(sender: string, tokenAddress: string, vaultId: string, units: number, tokenDecimals?: number): void;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  sender | `string` | sender that withdraw is done for |
|  tokenAddress | `string` | the address of the token |
|  vaultId | `string` | the vault ID to withdraw |
|  units | `number` | amount of token to withdraw |
|  tokenDecimals | `number` |  |

<b>Returns:</b>

`void`

void

