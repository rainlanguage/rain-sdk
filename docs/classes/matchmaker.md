
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
|  [clearedCounterPartyFunds](./orderbooksimulation.md#clearedCounterPartyFunds-property) | [SClearedCounterPartyFunds](../interfaces/sclearedcounterpartyfunds.md) | The property that stores all the data of an order's total cleared amount to a specific counterparty address which needs to be in form of a string number or hex string<br></br>*Inherited from [OrderbookSimulation.clearedCounterPartyFunds](./orderbooksimulation.md#clearedCounterPartyFunds-property)* |
|  [clearedFunds](./orderbooksimulation.md#clearedFunds-property) | [SClearedFunds](../interfaces/sclearedfunds.md) | The property that stores all the data of an order's total cleared amount,<br></br>*Inherited from [OrderbookSimulation.clearedFunds](./orderbooksimulation.md#clearedFunds-property)* |
|  [erc1155s](./vmsimulation.md#erc1155s-property) | [SERC1155s](../interfaces/serc1155s.md) | A property of type erc1155s that act like a storage for simulation and stores the erc1155 token data. this is needed for IERC1155 related opcodes<br></br>*Inherited from [vmSimulation.erc1155s](./vmsimulation.md#erc1155s-property)* |
|  [erc20s](./vmsimulation.md#erc20s-property) | [SERC20s](../interfaces/serc20s.md) | A property of type erc20s that act like a storage for simulation and stores the erc20 token data. this is needed for IERC20 related opcodes<br></br>*Inherited from [vmSimulation.erc20s](./vmsimulation.md#erc20s-property)* |
|  [erc721s](./vmsimulation.md#erc721s-property) | [SERC721s](../interfaces/serc721s.md) | A property of type erc721s that act like a storage for simulation and stores the erc721 token data. this is needed for IERC721 related opcodes<br></br>*Inherited from [vmSimulation.erc721s](./vmsimulation.md#erc721s-property)* |
|  [foundMatches](./matchmaker.md#foundMatches-property) | <pre>{&#010;    orderA: string;&#010;    orderB: string;&#010;}[]</pre> | The type of stores all the found matches |
|  [iTiers](./vmsimulation.md#iTiers-property) | [SITiers](../interfaces/sitiers.md) | A property of type itiers that act like a storage for simulation of Rain tier contracts. this is needed for ITIERV2\_REPORT and ITIERV2\_REPORT\_TIME\_FOR\_TIER opcodes.<br></br>*Inherited from [vmSimulation.iTiers](./vmsimulation.md#iTiers-property)* |
|  [OpFns](./orderbooksimulation.md#OpFns-property) | [FnPtrsJSVM](../interfaces/fnptrsjsvm.md) | Local Orderbook Opcodes' functions body for simulation that uses the class properties/types.<br></br>*Inherited from [OrderbookSimulation.OpFns](./orderbooksimulation.md#OpFns-property)* |
|  [orders](./orderbooksimulation.md#orders-property) | [SOrders](../interfaces/sorders.md) | The property that stores all the data of the class's orders,<br></br>*Inherited from [OrderbookSimulation.orders](./orderbooksimulation.md#orders-property)* |
|  [reservebook](./matchmaker.md#reservebook-property) | [ReserveBook](../interfaces/reservebook.md) | The ReserveBook property of the matchmaker |
|  [script](./vmsimulation.md#script-property) | [StateConfig](../interfaces/stateconfig.md) | The script to simulate<br></br>*Inherited from [vmSimulation.script](./vmsimulation.md#script-property)* |
|  [sender](./orderbooksimulation.md#sender-property) | `string` | A sender that performs the simulation transactions. this is needed for SENDER opcode simulation, and updating storage types after method calls and needs to be a string number or hex string.<br></br>*Inherited from [OrderbookSimulation.sender](./orderbooksimulation.md#sender-property)* |
|  [timestamp](./vmsimulation.md#timestamp-property) | `number` | A property for producing timestamp for the class which will be used in BLOCK\_TIMESTAMP opcode but BLOCK\_TIMESTAMP opcode can also be passed at runtime<br></br>*Inherited from [vmSimulation.timestamp](./vmsimulation.md#timestamp-property)* |
|  [vaults](./orderbooksimulation.md#vaults-property) | [SVaults](../interfaces/svaults.md) | The property that stores all the data of the class's vaults<br></br>*Inherited from [OrderbookSimulation.vaults](./orderbooksimulation.md#vaults-property)* |

## Methods

|  Method | Description |
|  --- | --- |
|  [addAssets(erc20s, erc721s, erc1155s)](./vmsimulation.md#addAssets-method-1) | Method to add assets i.e erc20/721/1155 types objects<br></br>*Inherited from [vmSimulation.addAssets()](./vmsimulation.md#addAssets-method-1)* |
|  [addITiers(iTiers)](./vmsimulation.md#addITiers-method-1) | Method to add tier contract types objects to the class (iTiers)<br></br>*Inherited from [vmSimulation.addITiers()](./vmsimulation.md#addITiers-method-1)* |
|  [addOrder(order)](./matchmaker.md#addOrder-method-1) | Method that inherits from the parent class addOrder and after perfroming that will execute orderEval method<br></br>*Overrides [OrderbookSimulation.addOrder()](./orderbooksimulation.md#addOrder-method-1)* |
|  [clear(a, b, clearConfig, timestamp, blockNumber)](./orderbooksimulation.md#clear-method-1) | Method to perform the clear by JSVM for this simulation which will update all the present storage/types of the the class<br></br>*Inherited from [OrderbookSimulation.clear()](./orderbooksimulation.md#clear-method-1)* |
|  [deposit(sender, tokenAddress, vaultId, units, tokenDecimals)](./orderbooksimulation.md#deposit-method-1) | Method to dposit some units of token of tokenAddress into the vaultId of the sender<br></br>*Inherited from [OrderbookSimulation.deposit()](./orderbooksimulation.md#deposit-method-1)* |
|  [makeMatch(bounty)](./matchmaker.md#makeMatch-method-1) | The main method to perform matchmaking and find matches among orders |
|  [orderEval(order, timestamp, blockNumber)](./matchmaker.md#orderEval-method-1) | Method to evaluate and ReserveBook the order's script |
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

<a id="reservebook-property"></a>

### reservebook

The ReserveBook property of the matchmaker

<b>Signature:</b>

```typescript
reservebook: ReserveBook;
```

## Method Details

<a id="addOrder-method-1"></a>

### addOrder(order)

Method that inherits from the parent class addOrder and after perfroming that will execute orderEval method

*Overrides [OrderbookSimulation.addOrder()](./orderbooksimulation.md#addOrder-method-1)*

<b>Signature:</b>

```typescript
addOrder(order: SOrder): Promise<void>;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  order | [SOrder](../interfaces/sorder.md) | the order to be added |

<b>Returns:</b>

`Promise<void>`

void

<a id="makeMatch-method-1"></a>

### makeMatch(bounty)

The main method to perform matchmaking and find matches among orders

<b>Signature:</b>

```typescript
makeMatch(bounty: {
        aBounty: string;
        bBounty: string;
    }): Promise<{
        orderA: string;
        orderB: string;
    }[]>;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  bounty | <pre>{&#010;    aBounty: string;&#010;    bBounty: string;&#010;}</pre> | the Bounty Vault IDs |

<b>Returns:</b>

`Promise<{
        orderA: string;
        orderB: string;
    }[]>`

<a id="orderEval-method-1"></a>

### orderEval(order, timestamp, blockNumber)

Method to evaluate and ReserveBook the order's script

<b>Signature:</b>

```typescript
orderEval(order: SOrder, timestamp?: number, blockNumber?: number): Promise<void>;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  order | [SOrder](../interfaces/sorder.md) | the order to be evaluated |
|  timestamp | `number` |  |
|  blockNumber | `number` |  |

<b>Returns:</b>

`Promise<void>`

void

