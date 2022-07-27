
# Class SaleSimulation

A class for creating a simulation environment for simulating a Sale contract off-chain using JSVM.

<b>Signature:</b>

```typescript
class SaleSimulation extends vmSimulation 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [address](./salesimulation.md#address-property) | `string` | The sale address of this class that the simulation is done for. this is needed for THIS\_ADDRESS opcode and updating storage types after method calls, and needs to be a string number or hex string.<br></br>*Overrides [vmSimulation.address](./vmsimulation.md#address-property)* |
|  [blockNumber](./vmsimulation.md#blockNumber-property) | `number` | A property for producing block number for the class which will be used in BLOCK\_NUMBER opcode but BLOCK\_NUMBER opcode can also be passed at runtime<br></br>*Inherited from [vmSimulation.blockNumber](./vmsimulation.md#blockNumber-property)* |
|  [erc1155s](./vmsimulation.md#erc1155s-property) | [SERC1155s](../interfaces/serc1155s.md) | A property of type erc1155s that act like a storage for simulation and stores the erc1155 token data. this is needed for IERC1155 related opcodes<br></br>*Inherited from [vmSimulation.erc1155s](./vmsimulation.md#erc1155s-property)* |
|  [erc20s](./vmsimulation.md#erc20s-property) | [SERC20s](../interfaces/serc20s.md) | A property of type erc20s that act like a storage for simulation and stores the erc20 token data. this is needed for IERC20 related opcodes<br></br>*Inherited from [vmSimulation.erc20s](./vmsimulation.md#erc20s-property)* |
|  [erc721s](./vmsimulation.md#erc721s-property) | [SERC721s](../interfaces/serc721s.md) | A property of type erc721s that act like a storage for simulation and stores the erc721 token data. this is needed for IERC721 related opcodes<br></br>*Inherited from [vmSimulation.erc721s](./vmsimulation.md#erc721s-property)* |
|  [iTiers](./vmsimulation.md#iTiers-property) | [SITiers](../interfaces/sitiers.md) | A property of type itiers that act like a storage for simulation of Rain tier contracts. this is needed for ITIERV2\_REPORT and ITIERV2\_REPORT\_TIME\_FOR\_TIER opcodes.<br></br>*Inherited from [vmSimulation.iTiers](./vmsimulation.md#iTiers-property)* |
|  [OpFns](./vmsimulation.md#OpFns-property) | [FnPtrsJSVM](../interfaces/fnptrsjsvm.md) | Opcodes functions body for simulation that use the class properties/types.<br></br>*Inherited from [vmSimulation.OpFns](./vmsimulation.md#OpFns-property)* |
|  [reserve](./salesimulation.md#reserve-property) | [SERC20](../interfaces/serc20.md) | The reserve token of this sale as an erc20 type object |
|  [reserveAddress](./salesimulation.md#reserveAddress-property) | `string` | The reedeemable token address of this sale i.e rTKN which needs to be string number or hex string |
|  [script](./vmsimulation.md#script-property) | [StateConfig](../interfaces/stateconfig.md) | The script to simulate<br></br>*Inherited from [vmSimulation.script](./vmsimulation.md#script-property)* |
|  [sender](./vmsimulation.md#sender-property) | `string` | A sender that performs the simulation transactions. this is needed for SENDER opcode simulation, and updating storage types after method calls and needs to be a string number or hex string.<br></br>*Inherited from [vmSimulation.sender](./vmsimulation.md#sender-property)* |
|  [timestamp](./vmsimulation.md#timestamp-property) | `number` | A property for producing timestamp for the class which will be used in BLOCK\_TIMESTAMP opcode but BLOCK\_TIMESTAMP opcode can also be passed at runtime<br></br>*Inherited from [vmSimulation.timestamp](./vmsimulation.md#timestamp-property)* |
|  [token](./salesimulation.md#token-property) | [SERC20](../interfaces/serc20.md) | The reedeemable token of this sale i.e rTKN which needs to a string number or hex string |
|  [tokenAddress](./salesimulation.md#tokenAddress-property) | `string` | The reserve token addres of this sale as an erc20 type object |

## Methods

|  Method | Description |
|  --- | --- |
|  [addAssets(erc20s, erc721s, erc1155s)](./vmsimulation.md#addAssets-method-1) | Method to add assets i.e erc20/721/1155 types objects<br></br>*Inherited from [vmSimulation.addAssets()](./vmsimulation.md#addAssets-method-1)* |
|  [addITiers(iTiers)](./vmsimulation.md#addITiers-method-1) | Method to add tier contract types objects to the class (iTiers)<br></br>*Inherited from [vmSimulation.addITiers()](./vmsimulation.md#addITiers-method-1)* |
|  [buy(units, timestamp, blockNumber)](./salesimulation.md#buy-method-1) | Method to simulate the sale's calculateBuy results by using JSVM to run calculateBuy script of a sale script. requires the class's sender property to be defined. |
|  [calculateBuy(units, timestamp, blockNumber)](./salesimulation.md#calculateBuy-method-1) | Method to simulate the sale's calculateBuy results by using JSVM to run calculateBuy script of a sale script. requires the class's sender property to be defined |
|  [canLive(timestamp, blockNumber)](./salesimulation.md#canLive-method-1) | Method to simulate the sale's canLive results by using JSVM to run canLive script of a sale script. requires the class's sender property to be defined |
|  [runScript(data, index)](./vmsimulation.md#runScript-method-1) | Method to run the script using JSVM<br></br>*Inherited from [vmSimulation.runScript()](./vmsimulation.md#runScript-method-1)* |
|  [setContractAddress(contractAddress)](./vmsimulation.md#setContractAddress-method-1) | Method to set the class address property<br></br>*Inherited from [vmSimulation.setContractAddress()](./vmsimulation.md#setContractAddress-method-1)* |
|  [setScript(script)](./vmsimulation.md#setScript-method-1) | Method to set the class script<br></br>*Inherited from [vmSimulation.setScript()](./vmsimulation.md#setScript-method-1)* |
|  [setSender(senderAddress)](./vmsimulation.md#setSender-method-1) | Method to set the class sender property<br></br>*Inherited from [vmSimulation.setSender()](./vmsimulation.md#setSender-method-1)* |

## Property Details

<a id="address-property"></a>

### address

The sale address of this class that the simulation is done for. this is needed for THIS\_ADDRESS opcode and updating storage types after method calls, and needs to be a string number or hex string.

*Overrides [vmSimulation.address](./vmsimulation.md#address-property)*

<b>Signature:</b>

```typescript
address: string;
```

<a id="reserve-property"></a>

### reserve

The reserve token of this sale as an erc20 type object

<b>Signature:</b>

```typescript
reserve: SERC20;
```

<a id="reserveAddress-property"></a>

### reserveAddress

The reedeemable token address of this sale i.e rTKN which needs to be string number or hex string

<b>Signature:</b>

```typescript
reserveAddress: string;
```

<a id="token-property"></a>

### token

The reedeemable token of this sale i.e rTKN which needs to a string number or hex string

<b>Signature:</b>

```typescript
token: SERC20;
```

<a id="tokenAddress-property"></a>

### tokenAddress

The reserve token addres of this sale as an erc20 type object

<b>Signature:</b>

```typescript
tokenAddress: string;
```

## Method Details

<a id="buy-method-1"></a>

### buy(units, timestamp, blockNumber)

Method to simulate the sale's calculateBuy results by using JSVM to run calculateBuy script of a sale script. requires the class's sender property to be defined.

after running this method all the defined class's related types/storage will get updated with new values that are result of the JSVM running the script.

<b>Signature:</b>

```typescript
buy(units: number, timestamp?: number, blockNumber?: number): Promise<void>;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  units | `number` | Units to get the calculation for |
|  timestamp | `number` | (optional) custom timestamp to be used when running the script |
|  blockNumber | `number` | (optional) custom block number to be used when running the script |

<b>Returns:</b>

`Promise<void>`

void

<a id="calculateBuy-method-1"></a>

### calculateBuy(units, timestamp, blockNumber)

Method to simulate the sale's calculateBuy results by using JSVM to run calculateBuy script of a sale script. requires the class's sender property to be defined

<b>Signature:</b>

```typescript
calculateBuy(units: number, timestamp?: number, blockNumber?: number): Promise<[BigNumber, BigNumber]>;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  units | `number` | Units to get the calculation for |
|  timestamp | `number` | (optional) custom timestamp to be used when running the script |
|  blockNumber | `number` | (optional) custom block number to be used when running the script |

<b>Returns:</b>

`Promise<[BigNumber, BigNumber]>`

a pair of BigNumbers represting amount and price

<a id="canLive-method-1"></a>

### canLive(timestamp, blockNumber)

Method to simulate the sale's canLive results by using JSVM to run canLive script of a sale script. requires the class's sender property to be defined

<b>Signature:</b>

```typescript
canLive(timestamp?: number, blockNumber?: number): Promise<boolean>;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  timestamp | `number` | (optional) custom timestamp to be used when running the script |
|  blockNumber | `number` | (optional) custom block number to be used when running the script |

<b>Returns:</b>

`Promise<boolean>`

a boolean represting if the sale can live (active status - 1) or not

