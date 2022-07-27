
# Class vmSimulation

A class for creating a simulation environment for running pure RainVM off-chain using JSVM.

<b>Signature:</b>

```typescript
class vmSimulation 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [address](./vmsimulation.md#address-property) | `string` | The contract address of this simulation that the simulation is done for. this is needed for THIS\_ADDRESS opcode simulation and updating storage types after method calls, and needs to be a string number or hex string. |
|  [blockNumber](./vmsimulation.md#blockNumber-property) | `number` | A property for producing block number for the class which will be used in BLOCK\_NUMBER opcode but BLOCK\_NUMBER opcode can also be passed at runtime |
|  [erc1155s](./vmsimulation.md#erc1155s-property) | [SERC1155s](../interfaces/serc1155s.md) | A property of type erc1155s that act like a storage for simulation and stores the erc1155 token data. this is needed for IERC1155 related opcodes |
|  [erc20s](./vmsimulation.md#erc20s-property) | [SERC20s](../interfaces/serc20s.md) | A property of type erc20s that act like a storage for simulation and stores the erc20 token data. this is needed for IERC20 related opcodes |
|  [erc721s](./vmsimulation.md#erc721s-property) | [SERC721s](../interfaces/serc721s.md) | A property of type erc721s that act like a storage for simulation and stores the erc721 token data. this is needed for IERC721 related opcodes |
|  [iTiers](./vmsimulation.md#iTiers-property) | [SITiers](../interfaces/sitiers.md) | A property of type itiers that act like a storage for simulation of Rain tier contracts. this is needed for ITIERV2\_REPORT and ITIERV2\_REPORT\_TIME\_FOR\_TIER opcodes. |
|  [OpFns](./vmsimulation.md#OpFns-property) | [FnPtrsJSVM](../interfaces/fnptrsjsvm.md) | Opcodes functions body for simulation that use the class properties/types. |
|  [script](./vmsimulation.md#script-property) | [StateConfig](../interfaces/stateconfig.md) | The script to simulate |
|  [sender](./vmsimulation.md#sender-property) | `string` | A sender that performs the simulation transactions. this is needed for SENDER opcode simulation, and updating storage types after method calls and needs to be a string number or hex string. |
|  [timestamp](./vmsimulation.md#timestamp-property) | `number` | A property for producing timestamp for the class which will be used in BLOCK\_TIMESTAMP opcode but BLOCK\_TIMESTAMP opcode can also be passed at runtime |

## Methods

|  Method | Description |
|  --- | --- |
|  [addAssets(erc20s, erc721s, erc1155s)](./vmsimulation.md#addAssets-method-1) | Method to add assets i.e erc20/721/1155 types objects |
|  [addITiers(iTiers)](./vmsimulation.md#addITiers-method-1) | Method to add tier contract types objects to the class (iTiers) |
|  [runScript(data, index)](./vmsimulation.md#runScript-method-1) | Method to run the script using JSVM |
|  [setContractAddress(contractAddress)](./vmsimulation.md#setContractAddress-method-1) | Method to set the class address property |
|  [setScript(script)](./vmsimulation.md#setScript-method-1) | Method to set the class script |
|  [setSender(senderAddress)](./vmsimulation.md#setSender-method-1) | Method to set the class sender property |

## Property Details

<a id="address-property"></a>

### address

The contract address of this simulation that the simulation is done for. this is needed for THIS\_ADDRESS opcode simulation and updating storage types after method calls, and needs to be a string number or hex string.

<b>Signature:</b>

```typescript
address?: string;
```

<a id="blockNumber-property"></a>

### blockNumber

A property for producing block number for the class which will be used in BLOCK\_NUMBER opcode but BLOCK\_NUMBER opcode can also be passed at runtime

<b>Signature:</b>

```typescript
blockNumber?: number;
```

<a id="erc1155s-property"></a>

### erc1155s

A property of type erc1155s that act like a storage for simulation and stores the erc1155 token data. this is needed for IERC1155 related opcodes

<b>Signature:</b>

```typescript
erc1155s: SERC1155s;
```

<a id="erc20s-property"></a>

### erc20s

A property of type erc20s that act like a storage for simulation and stores the erc20 token data. this is needed for IERC20 related opcodes

<b>Signature:</b>

```typescript
erc20s: SERC20s;
```

<a id="erc721s-property"></a>

### erc721s

A property of type erc721s that act like a storage for simulation and stores the erc721 token data. this is needed for IERC721 related opcodes

<b>Signature:</b>

```typescript
erc721s: SERC721s;
```

<a id="iTiers-property"></a>

### iTiers

A property of type itiers that act like a storage for simulation of Rain tier contracts. this is needed for ITIERV2\_REPORT and ITIERV2\_REPORT\_TIME\_FOR\_TIER opcodes.

<b>Signature:</b>

```typescript
iTiers: SITiers;
```

<a id="OpFns-property"></a>

### OpFns

Opcodes functions body for simulation that use the class properties/types.

<b>Signature:</b>

```typescript
protected OpFns: FnPtrsJSVM;
```

<a id="script-property"></a>

### script

The script to simulate

<b>Signature:</b>

```typescript
script?: StateConfig;
```

<a id="sender-property"></a>

### sender

A sender that performs the simulation transactions. this is needed for SENDER opcode simulation, and updating storage types after method calls and needs to be a string number or hex string.

<b>Signature:</b>

```typescript
sender?: string;
```

<a id="timestamp-property"></a>

### timestamp

A property for producing timestamp for the class which will be used in BLOCK\_TIMESTAMP opcode but BLOCK\_TIMESTAMP opcode can also be passed at runtime

<b>Signature:</b>

```typescript
timestamp?: number;
```

## Method Details

<a id="addAssets-method-1"></a>

### addAssets(erc20s, erc721s, erc1155s)

Method to add assets i.e erc20/721/1155 types objects

<b>Signature:</b>

```typescript
addAssets(erc20s?: SERC20s, erc721s?: SERC721s, erc1155s?: SERC1155s): void;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  erc20s | [SERC20s](../interfaces/serc20s.md) | An object of type erc20s |
|  erc721s | [SERC721s](../interfaces/serc721s.md) | An object of type erc721s |
|  erc1155s | [SERC1155s](../interfaces/serc1155s.md) | An object of type erc1155s |

<b>Returns:</b>

`void`

<a id="addITiers-method-1"></a>

### addITiers(iTiers)

Method to add tier contract types objects to the class (iTiers)

<b>Signature:</b>

```typescript
addITiers(iTiers: SITiers): void;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  iTiers | [SITiers](../interfaces/sitiers.md) | An Object of itiers type |

<b>Returns:</b>

`void`

<a id="runScript-method-1"></a>

### runScript(data, index)

Method to run the script using JSVM

<b>Signature:</b>

```typescript
runScript(data?: any, index?: number): Promise<BigNumber[]>;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  data | `any` | (optional) the additional data that needs to be passed at the runtime such as timestamp used in BLOCK\_TIMESTAMP opcode. |
|  index | `number` | (optional) the ENTRYPOINT or the index in the script sources to run |

<b>Returns:</b>

`Promise<BigNumber[]>`

An array of BigNumbers, which are the stacked result of the script

<a id="setContractAddress-method-1"></a>

### setContractAddress(contractAddress)

Method to set the class address property

<b>Signature:</b>

```typescript
setContractAddress(contractAddress: string): void;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  contractAddress | `string` | a string number/hex string |

<b>Returns:</b>

`void`

<a id="setScript-method-1"></a>

### setScript(script)

Method to set the class script

<b>Signature:</b>

```typescript
setScript(script: StateConfig): void;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  script | [StateConfig](../interfaces/stateconfig.md) | A StateConfig |

<b>Returns:</b>

`void`

<a id="setSender-method-1"></a>

### setSender(senderAddress)

Method to set the class sender property

<b>Signature:</b>

```typescript
setSender(senderAddress: string): void;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  senderAddress | `string` | a string number/hex string |

<b>Returns:</b>

`void`

