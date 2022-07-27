
# Class EmissionSmiulation

A class for creating a simulation environment for simulating a EmissionsERC20 contract off-chain using JSVM.

this class is compatible with

<b>Signature:</b>

```typescript
class EmissionSmiulation extends vmSimulation 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [address](./emissionsmiulation.md#address-property) | `string` | The EmissionsERC20 address of this class that the simulation is done for. this is needed for THIS\_ADDRESS opcode and updating storage types after method calls, and needs to be a string number or hex string.<br></br>*Overrides [vmSimulation.address](./vmsimulation.md#address-property)* |
|  [balanceOf](./emissionsmiulation.md#balanceOf-property) | [SStore](../interfaces/sstore.md) | The balance of emission token holders which is compatible with |
|  [blockNumber](./vmsimulation.md#blockNumber-property) | `number` | A property for producing block number for the class which will be used in BLOCK\_NUMBER opcode but BLOCK\_NUMBER opcode can also be passed at runtime<br></br>*Inherited from [vmSimulation.blockNumber](./vmsimulation.md#blockNumber-property)* |
|  [decimals](./emissionsmiulation.md#decimals-property) | `number` | The decimals value of the emissions token which is 18 |
|  [erc1155s](./vmsimulation.md#erc1155s-property) | [SERC1155s](../interfaces/serc1155s.md) | A property of type erc1155s that act like a storage for simulation and stores the erc1155 token data. this is needed for IERC1155 related opcodes<br></br>*Inherited from [vmSimulation.erc1155s](./vmsimulation.md#erc1155s-property)* |
|  [erc20s](./vmsimulation.md#erc20s-property) | [SERC20s](../interfaces/serc20s.md) | A property of type erc20s that act like a storage for simulation and stores the erc20 token data. this is needed for IERC20 related opcodes<br></br>*Inherited from [vmSimulation.erc20s](./vmsimulation.md#erc20s-property)* |
|  [erc721s](./vmsimulation.md#erc721s-property) | [SERC721s](../interfaces/serc721s.md) | A property of type erc721s that act like a storage for simulation and stores the erc721 token data. this is needed for IERC721 related opcodes<br></br>*Inherited from [vmSimulation.erc721s](./vmsimulation.md#erc721s-property)* |
|  [iTiers](./vmsimulation.md#iTiers-property) | [SITiers](../interfaces/sitiers.md) | A property of type itiers that act like a storage for simulation of Rain tier contracts. this is needed for ITIERV2\_REPORT and ITIERV2\_REPORT\_TIME\_FOR\_TIER opcodes.<br></br>*Inherited from [vmSimulation.iTiers](./vmsimulation.md#iTiers-property)* |
|  [OpFns](./vmsimulation.md#OpFns-property) | [FnPtrsJSVM](../interfaces/fnptrsjsvm.md) | Opcodes functions body for simulation that use the class properties/types.<br></br>*Inherited from [vmSimulation.OpFns](./vmsimulation.md#OpFns-property)* |
|  [report](./emissionsmiulation.md#report-property) | [SStore](../interfaces/sstore.md) | The report of each claimant which is compatible and can be stored in |
|  [script](./vmsimulation.md#script-property) | [StateConfig](../interfaces/stateconfig.md) | The script to simulate<br></br>*Inherited from [vmSimulation.script](./vmsimulation.md#script-property)* |
|  [sender](./emissionsmiulation.md#sender-property) | `string` | A sender that performs the simulation transactions. this is needed for SENDER opcode simulation, and updating storage types after method calls and needs to be a string number or hex string.<br></br>*Overrides [vmSimulation.sender](./vmsimulation.md#sender-property)* |
|  [timestamp](./vmsimulation.md#timestamp-property) | `number` | A property for producing timestamp for the class which will be used in BLOCK\_TIMESTAMP opcode but BLOCK\_TIMESTAMP opcode can also be passed at runtime<br></br>*Inherited from [vmSimulation.timestamp](./vmsimulation.md#timestamp-property)* |
|  [totalSupply](./emissionsmiulation.md#totalSupply-property) | `BigNumber` | The current totalSupply of the emissions token which can increase everytime a successful mint happens |

## Methods

|  Method | Description |
|  --- | --- |
|  [addAssets(erc20s, erc721s, erc1155s)](./vmsimulation.md#addAssets-method-1) | Method to add assets i.e erc20/721/1155 types objects<br></br>*Inherited from [vmSimulation.addAssets()](./vmsimulation.md#addAssets-method-1)* |
|  [addITiers(iTiers)](./vmsimulation.md#addITiers-method-1) | Method to add tier contract types objects to the class (iTiers)<br></br>*Inherited from [vmSimulation.addITiers()](./vmsimulation.md#addITiers-method-1)* |
|  [calculateClaim(claimantAccount, timestamp, blockNumber)](./emissionsmiulation.md#calculateClaim-method-1) | Method to calculate the cliamable amount for the claimant by running the script by JSVM |
|  [claim(claimantAccount, timestamp, blockNumber)](./emissionsmiulation.md#claim-method-1) | The method to perform the claim (claculate and mint) for the claimant account by rruning by JSVM |
|  [runScript(data, index)](./vmsimulation.md#runScript-method-1) | Method to run the script using JSVM<br></br>*Inherited from [vmSimulation.runScript()](./vmsimulation.md#runScript-method-1)* |
|  [setContractAddress(contractAddress)](./vmsimulation.md#setContractAddress-method-1) | Method to set the class address property<br></br>*Inherited from [vmSimulation.setContractAddress()](./vmsimulation.md#setContractAddress-method-1)* |
|  [setScript(script)](./vmsimulation.md#setScript-method-1) | Method to set the class script<br></br>*Inherited from [vmSimulation.setScript()](./vmsimulation.md#setScript-method-1)* |
|  [setSender(senderAddress)](./vmsimulation.md#setSender-method-1) | Method to set the class sender property<br></br>*Inherited from [vmSimulation.setSender()](./vmsimulation.md#setSender-method-1)* |

## Property Details

<a id="address-property"></a>

### address

The EmissionsERC20 address of this class that the simulation is done for. this is needed for THIS\_ADDRESS opcode and updating storage types after method calls, and needs to be a string number or hex string.

*Overrides [vmSimulation.address](./vmsimulation.md#address-property)*

<b>Signature:</b>

```typescript
address: string;
```

<a id="balanceOf-property"></a>

### balanceOf

The balance of emission token holders which is compatible with

<b>Signature:</b>

```typescript
balanceOf: SStore;
```

<a id="decimals-property"></a>

### decimals

The decimals value of the emissions token which is 18

<b>Signature:</b>

```typescript
readonly decimals: number;
```

<a id="report-property"></a>

### report

The report of each claimant which is compatible and can be stored in

<b>Signature:</b>

```typescript
report: SStore;
```

<a id="sender-property"></a>

### sender

A sender that performs the simulation transactions. this is needed for SENDER opcode simulation, and updating storage types after method calls and needs to be a string number or hex string.

*Overrides [vmSimulation.sender](./vmsimulation.md#sender-property)*

<b>Signature:</b>

```typescript
sender: string;
```

<a id="totalSupply-property"></a>

### totalSupply

The current totalSupply of the emissions token which can increase everytime a successful mint happens

<b>Signature:</b>

```typescript
totalSupply: BigNumber;
```

## Method Details

<a id="calculateClaim-method-1"></a>

### calculateClaim(claimantAccount, timestamp, blockNumber)

Method to calculate the cliamable amount for the claimant by running the script by JSVM

<b>Signature:</b>

```typescript
calculateClaim(claimantAccount: string, timestamp?: number, blockNumber?: number): Promise<BigNumber>;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  claimantAccount | `string` | the account to calculate the claimable amount which needs to be string number or hex string |
|  timestamp | `number` | (optional) custom timestamp to be used when running the script |
|  blockNumber | `number` | (optional) custom block number to be used when running the script |

<b>Returns:</b>

`Promise<BigNumber>`

A BigNumber that represents the claimable amount

<a id="claim-method-1"></a>

### claim(claimantAccount, timestamp, blockNumber)

The method to perform the claim (claculate and mint) for the claimant account by rruning by JSVM

<b>Signature:</b>

```typescript
claim(claimantAccount: string, timestamp?: number, blockNumber?: number): Promise<BigNumber>;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  claimantAccount | `string` | the account to calculate the claimable amount which needs to be string number or hex string |
|  timestamp | `number` | (optional) custom timestamp to be used when running the script |
|  blockNumber | `number` | (optional) custom block number to be used when running the script |

<b>Returns:</b>

`Promise<BigNumber>`

the minted amount in a BigNumber format

