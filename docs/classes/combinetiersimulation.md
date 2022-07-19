
# Class CombinetierSimulation

A class for creating a simulation environment for simulating a CombineTier contract off-chain using JSVM.

this class is compatible with

<b>Signature:</b>

```typescript
class CombinetierSimulation extends vmSimulation 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [address](./combinetiersimulation.md#address-property) | `string` | The CombineTier address of this class that the simulation is done for. this is needed for THIS\_ADDRESS opcode and updating storage types after method calls, and needs to be a string number or hex string.<br></br>*Overrides [vmSimulation.address](./vmsimulation.md#address-property)* |
|  [blockNumber](./vmsimulation.md#blockNumber-property) | `number` | A property for producing block number for the class which will be used in BLOCK\_NUMBER opcode but BLOCK\_NUMBER opcode can also be passed at runtime<br></br>*Inherited from [vmSimulation.blockNumber](./vmsimulation.md#blockNumber-property)* |
|  [erc1155s](./vmsimulation.md#erc1155s-property) | [erc1155s](../interfaces/erc1155s.md) | A property of type erc1155s that act like a storage for simulation and stores the erc1155 token data. this is needed for IERC1155 related opcodes<br></br>*Inherited from [vmSimulation.erc1155s](./vmsimulation.md#erc1155s-property)* |
|  [erc20s](./vmsimulation.md#erc20s-property) | [erc20s](../interfaces/erc20s.md) | A property of type erc20s that act like a storage for simulation and stores the erc20 token data. this is needed for IERC20 related opcodes<br></br>*Inherited from [vmSimulation.erc20s](./vmsimulation.md#erc20s-property)* |
|  [erc721s](./vmsimulation.md#erc721s-property) | [erc721s](../interfaces/erc721s.md) | A property of type erc721s that act like a storage for simulation and stores the erc721 token data. this is needed for IERC721 related opcodes<br></br>*Inherited from [vmSimulation.erc721s](./vmsimulation.md#erc721s-property)* |
|  [iTiers](./vmsimulation.md#iTiers-property) | [itiers](../interfaces/itiers.md) | A property of type itiers that act like a storage for simulation of Rain tier contracts. this is needed for ITIERV2\_REPORT and ITIERV2\_REPORT\_TIME\_FOR\_TIER opcodes.<br></br>*Inherited from [vmSimulation.iTiers](./vmsimulation.md#iTiers-property)* |
|  [OpFns](./vmsimulation.md#OpFns-property) | [FnPtrs](../interfaces/fnptrs.md) | Opcodes functions body for simulation that use the class properties/types.<br></br>*Inherited from [vmSimulation.OpFns](./vmsimulation.md#OpFns-property)* |
|  [report](./combinetiersimulation.md#report-property) | <pre>{&#010;    [wallet: string]: BigNumber;&#010;}</pre> | The report of each account which is compatible and can be stored in |
|  [script](./vmsimulation.md#script-property) | [StateConfig](../interfaces/stateconfig.md) | The script to simulate<br></br>*Inherited from [vmSimulation.script](./vmsimulation.md#script-property)* |
|  [sender](./vmsimulation.md#sender-property) | `string` | A sender that performs the simulation transactions. this is needed for SENDER opcode simulation, and updating storage types after method calls and needs to be a string number or hex string.<br></br>*Inherited from [vmSimulation.sender](./vmsimulation.md#sender-property)* |
|  [timestamp](./vmsimulation.md#timestamp-property) | `number` | A property for producing timestamp for the class which will be used in BLOCK\_TIMESTAMP opcode but BLOCK\_TIMESTAMP opcode can also be passed at runtime<br></br>*Inherited from [vmSimulation.timestamp](./vmsimulation.md#timestamp-property)* |

## Methods

|  Method | Description |
|  --- | --- |
|  [addAssets(erc20s, erc721s, erc1155s)](./vmsimulation.md#addAssets-method-1) | Method to add assets i.e erc20/721/1155 types objects<br></br>*Inherited from [vmSimulation.addAssets()](./vmsimulation.md#addAssets-method-1)* |
|  [addITiers(iTiers)](./vmsimulation.md#addITiers-method-1) | Method to add tier contract types objects to the class (iTiers)<br></br>*Inherited from [vmSimulation.addITiers()](./vmsimulation.md#addITiers-method-1)* |
|  [runScript(data, index)](./vmsimulation.md#runScript-method-1) | Method to run the script using JSVM<br></br>*Inherited from [vmSimulation.runScript()](./vmsimulation.md#runScript-method-1)* |
|  [setContractAddress(contractAddress)](./vmsimulation.md#setContractAddress-method-1) | Method to set the class address property<br></br>*Inherited from [vmSimulation.setContractAddress()](./vmsimulation.md#setContractAddress-method-1)* |
|  [setReport(account, timestamp, blockNumber)](./combinetiersimulation.md#setReport-method-1) | Method to get the report for an account which then will be stored in the class's report property and can be accessed later on, each time this method is called it runs the JSVM for the scripts and updates the report of the account it is been called for |
|  [setScript(script)](./vmsimulation.md#setScript-method-1) | Method to set the class script<br></br>*Inherited from [vmSimulation.setScript()](./vmsimulation.md#setScript-method-1)* |
|  [setSender(senderAddress)](./vmsimulation.md#setSender-method-1) | Method to set the class sender property<br></br>*Inherited from [vmSimulation.setSender()](./vmsimulation.md#setSender-method-1)* |

## Property Details

<a id="address-property"></a>

### address

The CombineTier address of this class that the simulation is done for. this is needed for THIS\_ADDRESS opcode and updating storage types after method calls, and needs to be a string number or hex string.

*Overrides [vmSimulation.address](./vmsimulation.md#address-property)*

<b>Signature:</b>

```typescript
address: string;
```

<a id="report-property"></a>

### report

The report of each account which is compatible and can be stored in

<b>Signature:</b>

```typescript
report: {
        [wallet: string]: BigNumber;
    };
```

## Method Details

<a id="setReport-method-1"></a>

### setReport(account, timestamp, blockNumber)

Method to get the report for an account which then will be stored in the class's report property and can be accessed later on, each time this method is called it runs the JSVM for the scripts and updates the report of the account it is been called for

<b>Signature:</b>

```typescript
setReport(account: string, timestamp?: number, blockNumber?: number): Promise<string>;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  account | `string` | the account to get and update the report for which needs to be string number or hex string |
|  timestamp | `number` | (optional) custom timestamp to be used when running the script |
|  blockNumber | `number` | (optional) custom block number to be used when running the script |

<b>Returns:</b>

`Promise<string>`

the report of the account in a 64 char length hex string

