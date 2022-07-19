
# Class MatchMaker

A class for finding matches among orders off-chain in a simulated environment

<b>Signature:</b>

```typescript
class MatchMaker extends OrderbookSimulation 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [address](./orderbooksimulation.md#address-property) | `string` | The EmissionsERC20 address of this class that the simulation is done for. this is needed for THIS\_ADDRESS opcode and updating storage types after method calls, and needs to be a string number or hex string.<br></br>*Inherited from [OrderbookSimulation.address](./orderbooksimulation.md#address-property)* |
|  [blockNumber](./vmsimulation.md#blockNumber-property) | `number` | A property for producing block number for the class which will be used in BLOCK\_NUMBER opcode but BLOCK\_NUMBER opcode can also be passed at runtime<br></br>*Inherited from [vmSimulation.blockNumber](./vmsimulation.md#blockNumber-property)* |
|  [clearedCounterPartyFunds](./orderbooksimulation.md#clearedCounterPartyFunds-property) | [clearedCounterPartyFunds](../interfaces/clearedcounterpartyfunds.md) | The property that stores all the data of an order's total cleared amount to a specific counterparty address which needs to be in form of a string number or hex string<br></br>*Inherited from [OrderbookSimulation.clearedCounterPartyFunds](./orderbooksimulation.md#clearedCounterPartyFunds-property)* |
|  [clearedFunds](./orderbooksimulation.md#clearedFunds-property) | [clearedFunds](../interfaces/clearedfunds.md) | The property that stores all the data of an order's total cleared amount,<br></br>*Inherited from [OrderbookSimulation.clearedFunds](./orderbooksimulation.md#clearedFunds-property)* |
|  [erc1155s](./vmsimulation.md#erc1155s-property) | [erc1155s](../interfaces/erc1155s.md) | A property of type erc1155s that act like a storage for simulation and stores the erc1155 token data. this is needed for IERC1155 related opcodes<br></br>*Inherited from [vmSimulation.erc1155s](./vmsimulation.md#erc1155s-property)* |
|  [erc20s](./vmsimulation.md#erc20s-property) | [erc20s](../interfaces/erc20s.md) | A property of type erc20s that act like a storage for simulation and stores the erc20 token data. this is needed for IERC20 related opcodes<br></br>*Inherited from [vmSimulation.erc20s](./vmsimulation.md#erc20s-property)* |
|  [erc721s](./vmsimulation.md#erc721s-property) | [erc721s](../interfaces/erc721s.md) | A property of type erc721s that act like a storage for simulation and stores the erc721 token data. this is needed for IERC721 related opcodes<br></br>*Inherited from [vmSimulation.erc721s](./vmsimulation.md#erc721s-property)* |
|  [foundMatches](./matchmaker.md#foundMatches-property) | <pre>{&#010;    orderA: string;&#010;    orderB: string;&#010;}[]</pre> | The type of stores all the found matches |
|  [iTiers](./vmsimulation.md#iTiers-property) | [itiers](../interfaces/itiers.md) | A property of type itiers that act like a storage for simulation of Rain tier contracts. this is needed for ITIERV2\_REPORT and ITIERV2\_REPORT\_TIME\_FOR\_TIER opcodes.<br></br>*Inherited from [vmSimulation.iTiers](./vmsimulation.md#iTiers-property)* |
|  [OpFns](./orderbooksimulation.md#OpFns-property) | [FnPtrs](../interfaces/fnptrs.md) | Local Orderbook Opcodes' functions body for simulation that uses the class properties/types.<br></br>*Inherited from [OrderbookSimulation.OpFns](./orderbooksimulation.md#OpFns-property)* |
|  [orderForcast](./matchmaker.md#orderForcast-property) | [forcast](../interfaces/forcast.md) | The forcast property of the matchmaker |
|  [orders](./orderbooksimulation.md#orders-property) | [orders](../interfaces/orders.md) | The property that stores all the data of the class's orders,<br></br>*Inherited from [OrderbookSimulation.orders](./orderbooksimulation.md#orders-property)* |
|  [script](./vmsimulation.md#script-property) | [StateConfig](../interfaces/stateconfig.md) | The script to simulate<br></br>*Inherited from [vmSimulation.script](./vmsimulation.md#script-property)* |
|  [sender](./orderbooksimulation.md#sender-property) | `string` | A sender that performs the simulation transactions. this is needed for SENDER opcode simulation, and updating storage types after method calls and needs to be a string number or hex string.<br></br>*Inherited from [OrderbookSimulation.sender](./orderbooksimulation.md#sender-property)* |
|  [timestamp](./vmsimulation.md#timestamp-property) | `number` | A property for producing timestamp for the class which will be used in BLOCK\_TIMESTAMP opcode but BLOCK\_TIMESTAMP opcode can also be passed at runtime<br></br>*Inherited from [vmSimulation.timestamp](./vmsimulation.md#timestamp-property)* |
|  [vaults](./orderbooksimulation.md#vaults-property) | [vaults](../interfaces/vaults.md) | The property that stores all the data of the class's vaults<br></br>*Inherited from [OrderbookSimulation.vaults](./orderbooksimulation.md#vaults-property)* |

## Methods

|  Method | Description |
|  --- | --- |
|  [addAssets(erc20s, erc721s, erc1155s)](./vmsimulation.md#addAssets-method-1) | Method to add assets i.e erc20/721/1155 types objects<br></br>*Inherited from [vmSimulation.addAssets()](./vmsimulation.md#addAssets-method-1)* |
|  [addITiers(iTiers)](./vmsimulation.md#addITiers-method-1) | Method to add tier contract types objects to the class (iTiers)<br></br>*Inherited from [vmSimulation.addITiers()](./vmsimulation.md#addITiers-method-1)* |
|  [addOrder(order)](./matchmaker.md#addOrder-method-1) | Method that inherits from the parent class addOrder and after perfroming that will execute orderEval method<br></br>*Overrides [OrderbookSimulation.addOrder()](./orderbooksimulation.md#addOrder-method-1)* |
|  [clear(a, b, bountyConfig, timestamp, blockNumber)](./orderbooksimulation.md#clear-method-1) | Method to perform the clear by JSVM for this simulation which will update all the present storage/types of the the class<br></br>*Inherited from [OrderbookSimulation.clear()](./orderbooksimulation.md#clear-method-1)* |
|  [deposit(sender, tokenAddress, vaultId, units, tokenDecimals)](./orderbooksimulation.md#deposit-method-1) | Method to dposit some units of token of tokenAddress into the vaultId of the sender<br></br>*Inherited from [OrderbookSimulation.deposit()](./orderbooksimulation.md#deposit-method-1)* |
|  [makeMatch(bountyConfig)](./matchmaker.md#makeMatch-method-1) | The main method to perform matchmaking and find matches among orders |
|  [orderEval(order, timestamp, blockNumber)](./matchmaker.md#orderEval-method-1) | Method to evaluate and forcast the order's script |
|  [removeOrder(order)](./orderbooksimulation.md#removeOrder-method-1) | Method to remove an order from the class's orders<br></br>*Inherited from [OrderbookSimulation.removeOrder()](./orderbooksimulation.md#removeOrder-method-1)* |
|  [runScript(data, index)](./vmsimulation.md#runScript-method-1) | Method to run the script using JSVM<br></br>*Inherited from [vmSimulation.runScript()](./vmsimulation.md#runScript-method-1)* |
|  [setContractAddress(contractAddress)](./vmsimulation.md#setContractAddress-method-1) | Method to set the class address property<br></br>*Inherited from [vmSimulation.setContractAddress()](./vmsimulation.md#setContractAddress-method-1)* |
|  [setScript(script)](./vmsimulation.md#setScript-method-1) | Method to set the class script<br></br>*Inherited from [vmSimulation.setScript()](./vmsimulation.md#setScript-method-1)* |
|  [setSender(senderAddress)](./vmsimulation.md#setSender-method-1) | Method to set the class sender property<br></br>*Inherited from [vmSimulation.setSender()](./vmsimulation.md#setSender-method-1)* |
|  [withdraw(sender, tokenAddress, vaultId, units, tokenDecimals)](./orderbooksimulation.md#withdraw-method-1) | Method to withdraw some units of token of tokenAddress from VaultId of the sender<br></br>*Inherited from [OrderbookSimulation.withdraw()](./orderbooksimulation.md#withdraw-method-1)* |

## Property Details

<a id="foundMatches-property"></a>

### foundMatches

The type of stores all the found matches

<b>Signature:</b>

```typescript
foundMatches: {
        orderA: string;
        orderB: string;
    }[];
```

<a id="orderForcast-property"></a>

### orderForcast

The forcast property of the matchmaker

<b>Signature:</b>

```typescript
orderForcast: forcast;
```

## Method Details

<a id="addOrder-method-1"></a>

### addOrder(order)

Method that inherits from the parent class addOrder and after perfroming that will execute orderEval method

*Overrides [OrderbookSimulation.addOrder()](./orderbooksimulation.md#addOrder-method-1)*

<b>Signature:</b>

```typescript
addOrder(order: order): Promise<void>;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  order | [order](../interfaces/order.md) | the order to be added |

<b>Returns:</b>

`Promise<void>`

void

<a id="makeMatch-method-1"></a>

### makeMatch(bountyConfig)

The main method to perform matchmaking and find matches among orders

<b>Signature:</b>

```typescript
makeMatch(bountyConfig: bountyConfig): Promise<{
        orderA: string;
        orderB: string;
    }[]>;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  bountyConfig | [bountyConfig](../interfaces/bountyconfig.md) | the BountyConfig of this matchmaker class |

<b>Returns:</b>

`Promise<{
        orderA: string;
        orderB: string;
    }[]>`


<a id="orderEval-method-1"></a>

### orderEval(order, timestamp, blockNumber)

Method to evaluate and forcast the order's script

<b>Signature:</b>

```typescript
orderEval(order: order, timestamp?: number, blockNumber?: number): Promise<void>;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  order | [order](../interfaces/order.md) | the order to be evaluated |
|  timestamp | `number` |  |
|  blockNumber | `number` |  |

<b>Returns:</b>

`Promise<void>`

void

