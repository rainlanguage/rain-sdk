[Home](../index.md) &gt; [Sale](./sale.md)

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
|  [concat](./sale.md#concat-property-static) | `typeof utils.concat` |  |
|  [deploy](./sale.md#deploy-property-static) | `(signer: Signer, saleConfig: SaleConfig, saleRedeemableERC20Config: SaleRedeemableERC20Config, overrides?: TxOverrides) => Promise<Sale>` | Deploys a new Sale. |
|  [getChainId](./raincontract.md#getChainId-property-static) | `(signerOrProvider: Signer \| Provider) => Promise<number>` | Get the chain ID from a valid ethers provider.<br><br>Request to the provider stored in the signer which is the chain ID.<br><br><i>Inherited from [RainContract.getChainId](./raincontract.md#getChainId-property-static)</i> |
|  [isChild](./sale.md#isChild-property-static) | `(signer: Signer, maybeChild: string) => Promise<boolean>` | Checks if address is registered as a child contract of this SaleFactory on a specific network |
|  [nameBookReference](./sale.md#nameBookReference-property-static) | `` | Reference to find the address in the book address. Should be implemented and assign it to each subclass<br><br><i>Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)</i> |
|  [op](./sale.md#op-property-static) | `(code: number, erand?: number \| utils.BytesLike \| utils.Hexable) => Uint8Array` |  |
|  [Opcodes](./sale.md#Opcodes-property-static) | <pre>{&#010;    REMAINING_UNITS: number;&#010;    TOTAL_RESERVE_IN: number;&#010;    CURRENT_BUY_UNITS: number;&#010;    TOKEN_ADDRESS: number;&#010;    RESERVE_ADDRESS: number;&#010;    SKIP: import("../classes/vm").AllStandardOps.SKIP;&#010;    VAL: import("../classes/vm").AllStandardOps.VAL;&#010;    DUP: import("../classes/vm").AllStandardOps.DUP;&#010;    ZIPMAP: import("../classes/vm").AllStandardOps.ZIPMAP;&#010;    DEBUG: import("../classes/vm").AllStandardOps.DEBUG;&#010;    BLOCK_NUMBER: import("../classes/vm").AllStandardOps.BLOCK_NUMBER;&#010;    BLOCK_TIMESTAMP: import("../classes/vm").AllStandardOps.BLOCK_TIMESTAMP;&#010;    SENDER: import("../classes/vm").AllStandardOps.SENDER;&#010;    THIS_ADDRESS: import("../classes/vm").AllStandardOps.THIS_ADDRESS;&#010;    SCALE18_MUL: import("../classes/vm").AllStandardOps.SCALE18_MUL;&#010;    SCALE18_DIV: import("../classes/vm").AllStandardOps.SCALE18_DIV;&#010;    SCALE18: import("../classes/vm").AllStandardOps.SCALE18;&#010;    SCALEN: import("../classes/vm").AllStandardOps.SCALEN;&#010;    SCALE_BY: import("../classes/vm").AllStandardOps.SCALE_BY;&#010;    SCALE18_ONE: import("../classes/vm").AllStandardOps.SCALE18_ONE;&#010;    SCALE18_DECIMALS: import("../classes/vm").AllStandardOps.SCALE18_DECIMALS;&#010;    ADD: import("../classes/vm").AllStandardOps.ADD;&#010;    SATURATING_ADD: import("../classes/vm").AllStandardOps.SATURATING_ADD;&#010;    SUB: import("../classes/vm").AllStandardOps.SUB;&#010;    SATURATING_SUB: import("../classes/vm").AllStandardOps.SATURATING_SUB;&#010;    MUL: import("../classes/vm").AllStandardOps.MUL;&#010;    SATURATING_MUL: import("../classes/vm").AllStandardOps.SATURATING_MUL;&#010;    DIV: import("../classes/vm").AllStandardOps.DIV;&#010;    MOD: import("../classes/vm").AllStandardOps.MOD;&#010;    EXP: import("../classes/vm").AllStandardOps.EXP;&#010;    MIN: import("../classes/vm").AllStandardOps.MIN;&#010;    MAX: import("../classes/vm").AllStandardOps.MAX;&#010;    ISZERO: import("../classes/vm").AllStandardOps.ISZERO;&#010;    EAGER_IF: import("../classes/vm").AllStandardOps.EAGER_IF;&#010;    EQUAL_TO: import("../classes/vm").AllStandardOps.EQUAL_TO;&#010;    LESS_THAN: import("../classes/vm").AllStandardOps.LESS_THAN;&#010;    GREATER_THAN: import("../classes/vm").AllStandardOps.GREATER_THAN;&#010;    EVERY: import("../classes/vm").AllStandardOps.EVERY;&#010;    ANY: import("../classes/vm").AllStandardOps.ANY;&#010;    REPORT: import("../classes/vm").AllStandardOps.REPORT;&#010;    NEVER: import("../classes/vm").AllStandardOps.NEVER;&#010;    ALWAYS: import("../classes/vm").AllStandardOps.ALWAYS;&#010;    SATURATING_DIFF: import("../classes/vm").AllStandardOps.SATURATING_DIFF;&#010;    UPDATE_BLOCKS_FOR_TIER_RANGE: import("../classes/vm").AllStandardOps.UPDATE_BLOCKS_FOR_TIER_RANGE;&#010;    SELECT_LTE: import("../classes/vm").AllStandardOps.SELECT_LTE;&#010;    IERC20_BALANCE_OF: import("../classes/vm").AllStandardOps.IERC20_BALANCE_OF;&#010;    IERC20_TOTAL_SUPPLY: import("../classes/vm").AllStandardOps.IERC20_TOTAL_SUPPLY;&#010;    IERC721_BALANCE_OF: import("../classes/vm").AllStandardOps.IERC721_BALANCE_OF;&#010;    IERC721_OWNER_OF: import("../classes/vm").AllStandardOps.IERC721_OWNER_OF;&#010;    IERC1155_BALANCE_OF: import("../classes/vm").AllStandardOps.IERC1155_BALANCE_OF;&#010;    IERC1155_BALANCE_OF_BATCH: import("../classes/vm").AllStandardOps.IERC1155_BALANCE_OF_BATCH;&#010;    length: import("../classes/vm").AllStandardOps.length;&#010;}</pre> |  |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [address](./raincontract.md#address-property) | `string` | <i>Inherited from [RainContract.address](./raincontract.md#address-property)</i> |
|  [buy](./sale.md#buy-property) | `(config: BuyConfig, overrides?: TxOverrides) => Promise<ContractTransaction>` | Main entrypoint to the sale. Sells rTKN in exchange for reserve token. The price curve is eval'd to produce a reserve price quote. Each 1 unit of rTKN costs `price` reserve token where BOTH the rTKN units and price are treated as 18 decimal fixed point values. If the reserve token has more or less precision by its own conventions (e.g. "decimals" method on ERC20 tokens) then the price will need to scale accordingly. The receipt is \_logged\_ rather than returned as it cannot be used in same block for a refund anyway due to cooldowns. |
|  [calculatePrice](./sale.md#calculatePrice-property) | `(units: BigNumberish, overrides?: ReadTxOverrides) => Promise<BigNumber>` | Calculates the current reserve price quoted for 1 unit of rTKN. Used internally to process `buy` |
|  [canEnd](./sale.md#canEnd-property) | `(overrides?: ReadTxOverrides) => Promise<boolean>` | Can the sale end? Evals `canEndStatePointer` to a boolean that determines whether the sale can end (move from active to success/fail). Buying will fail if the sale has ended. If the sale is out of rTKN stock it can ALWAYS end and in this case will NOT eval the "can end" script. The sale can ONLY end if it is currently in active status. |
|  [canStart](./sale.md#canStart-property) | `(overrides?: ReadTxOverrides) => Promise<boolean>` | Can the sale start? Evals `canStartStatePointer` to a boolean that determines whether the sale can start (move from pending to active). Buying from and ending the sale will both always fail if the sale never started. The sale can ONLY start if it is currently in pending status. |
|  [claimFees](./sale.md#claimFees-property) | `(recipient: string, overrides?: TxOverrides) => Promise<ContractTransaction>` | After a sale ends in success all fees collected for a recipient can be cleared. If the raise is active or fails then fees cannot be claimed as they are set aside in case of refund. A failed raise implies that all buyers should immediately refund and zero fees claimed. |
|  [connect](./sale.md#connect-property) | `(signer: Signer) => Sale` | Connect the current instance to a new signer<br><br><i>Overrides [RainContract.connect](./raincontract.md#connect-property)</i> |
|  [end](./sale.md#end-property) | `(overrides?: TxOverrides) => Promise<ContractTransaction>` | End the sale (move from active to success or fail). - `canEnd` MUST return true. |
|  [getRedeemable](./sale.md#getRedeemable-property) | `(signer?: Signer) => Promise<RedeemableERC20>` | Obtain the instance redeemable token from this sale. |
|  [refund](./sale.md#refund-property) | `(receipt: Receipt, overrides?: TxOverrides) => Promise<ContractTransaction>` | Rollback a buy given its receipt. Ignoring gas (which cannot be refunded) the refund process rolls back all state changes caused by a buy, other than the receipt id increment. Refunds are limited by the global cooldown to mitigate rapid buy/refund cycling that could cause volatile price curves or other unwanted side effects for other sale participants. Cooldowns are bypassed if the sale ends and is a failure. |
|  [reserve](./sale.md#reserve-property) | `(overrides?: ReadTxOverrides) => Promise<string>` | Returns the address of the token that sale prices are denominated in. MUST NOT change during the lifecycle of the sale contract. |
|  [saleStatus](./sale.md#saleStatus-property) | `(overrides?: ReadTxOverrides) => Promise<number>` | Returns the current `SaleStatus` of the sale. Represents a linear progression of the sale through its major lifecycle events. |
|  [signer](./raincontract.md#signer-property) | `Signer` | <i>Inherited from [RainContract.signer](./raincontract.md#signer-property)</i> |
|  [start](./sale.md#start-property) | `(overrides?: TxOverrides) => Promise<ContractTransaction>` | Start the sale (move from pending to active). - `canStart` MUST return true. |
|  [timeout](./sale.md#timeout-property) | `(overrides?: TxOverrides) => Promise<ContractTransaction>` | Timeout the sale (move from pending or active to fail). The ONLY condition for a timeout is that the `saleTimeout` block set during initialize is in the past. This means that regardless of what happens re: starting, ending, buying, etc. if the sale does NOT manage to unambiguously end by the timeout block then it can timeout to a fail state. This means that any downstream escrows or similar can always expect that eventually they will see a pass/fail state and so are safe to lock funds while a Sale is active. |
|  [token](./sale.md#token-property) | `(overrides?: ReadTxOverrides) => Promise<string>` | Returns the address of the token being sold in the sale. MUST NOT change during the lifecycle of the sale contract. |

## Static Methods

|  Method | Description |
|  --- | --- |
|  [\_isChild(signer, maybeChild)](./factorycontract.md#_isChild-method-static-1) | Checks if address is registered as a child contract of the factory in the chain. Should be implemented in sub-classes that repreent factories to expose it.<br><br><i>Inherited from [FactoryContract.\_isChild()](./factorycontract.md#_isChild-method-static-1)</i> |
|  [afterBlockNumberConfig(blockNumber)](./sale.md#afterBlockNumberConfig-method-static-1) | Create a condition as VM state configuration to that is true after a `blockNumber` in the chain. |
|  [afterTimestampConfig(timestamp)](./sale.md#afterTimestampConfig-method-static-1) | Create a condition as VM state configuration to that is true after a `timestamp` in the chain. |
|  [getBookAddress(chainId)](./raincontract.md#getBookAddress-method-static-1) | Get the address stored in the book to this chain<br><br><i>Inherited from [RainContract.getBookAddress()](./raincontract.md#getBookAddress-method-static-1)</i> |
|  [getNewChildFromReceipt(receipt, parentContract)](./factorycontract.md#getNewChildFromReceipt-method-static-1) | Get the child from a receipt obtain from a Factory transaction<br><br><i>Inherited from [FactoryContract.getNewChildFromReceipt()](./factorycontract.md#getNewChildFromReceipt-method-static-1)</i> |

## Methods

|  Method | Description |
|  --- | --- |
|  [checkAddress(address, message)](./raincontract.md#checkAddress-method-1) | Check if an address is correctly formatted and throw an error if it is not an valid address<br><br><i>Inherited from [RainContract.checkAddress()](./raincontract.md#checkAddress-method-1)</i> |

## Static Property Details

<a id="concat-property-static"></a>

### concat

<b>Signature:</b>

```typescript
static concat: typeof utils.concat;
```

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

Reference to find the address in the book address. Should be implemented and assign it to each subclass

<i>Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)</i>

<b>Signature:</b>

```typescript
protected static readonly nameBookReference = "saleFactory";
```

<a id="op-property-static"></a>

### op

<b>Signature:</b>

```typescript
static op: (code: number, erand?: number | utils.BytesLike | utils.Hexable) => Uint8Array;
```

<a id="Opcodes-property-static"></a>

### Opcodes

<b>Signature:</b>

```typescript
static Opcodes: {
        REMAINING_UNITS: number;
        TOTAL_RESERVE_IN: number;
        CURRENT_BUY_UNITS: number;
        TOKEN_ADDRESS: number;
        RESERVE_ADDRESS: number;
        SKIP: import("../classes/vm").AllStandardOps.SKIP;
        VAL: import("../classes/vm").AllStandardOps.VAL;
        DUP: import("../classes/vm").AllStandardOps.DUP;
        ZIPMAP: import("../classes/vm").AllStandardOps.ZIPMAP;
        DEBUG: import("../classes/vm").AllStandardOps.DEBUG;
        BLOCK_NUMBER: import("../classes/vm").AllStandardOps.BLOCK_NUMBER;
        BLOCK_TIMESTAMP: import("../classes/vm").AllStandardOps.BLOCK_TIMESTAMP;
        SENDER: import("../classes/vm").AllStandardOps.SENDER;
        THIS_ADDRESS: import("../classes/vm").AllStandardOps.THIS_ADDRESS;
        SCALE18_MUL: import("../classes/vm").AllStandardOps.SCALE18_MUL;
        SCALE18_DIV: import("../classes/vm").AllStandardOps.SCALE18_DIV;
        SCALE18: import("../classes/vm").AllStandardOps.SCALE18;
        SCALEN: import("../classes/vm").AllStandardOps.SCALEN;
        SCALE_BY: import("../classes/vm").AllStandardOps.SCALE_BY;
        SCALE18_ONE: import("../classes/vm").AllStandardOps.SCALE18_ONE;
        SCALE18_DECIMALS: import("../classes/vm").AllStandardOps.SCALE18_DECIMALS;
        ADD: import("../classes/vm").AllStandardOps.ADD;
        SATURATING_ADD: import("../classes/vm").AllStandardOps.SATURATING_ADD;
        SUB: import("../classes/vm").AllStandardOps.SUB;
        SATURATING_SUB: import("../classes/vm").AllStandardOps.SATURATING_SUB;
        MUL: import("../classes/vm").AllStandardOps.MUL;
        SATURATING_MUL: import("../classes/vm").AllStandardOps.SATURATING_MUL;
        DIV: import("../classes/vm").AllStandardOps.DIV;
        MOD: import("../classes/vm").AllStandardOps.MOD;
        EXP: import("../classes/vm").AllStandardOps.EXP;
        MIN: import("../classes/vm").AllStandardOps.MIN;
        MAX: import("../classes/vm").AllStandardOps.MAX;
        ISZERO: import("../classes/vm").AllStandardOps.ISZERO;
        EAGER_IF: import("../classes/vm").AllStandardOps.EAGER_IF;
        EQUAL_TO: import("../classes/vm").AllStandardOps.EQUAL_TO;
        LESS_THAN: import("../classes/vm").AllStandardOps.LESS_THAN;
        GREATER_THAN: import("../classes/vm").AllStandardOps.GREATER_THAN;
        EVERY: import("../classes/vm").AllStandardOps.EVERY;
        ANY: import("../classes/vm").AllStandardOps.ANY;
        REPORT: import("../classes/vm").AllStandardOps.REPORT;
        NEVER: import("../classes/vm").AllStandardOps.NEVER;
        ALWAYS: import("../classes/vm").AllStandardOps.ALWAYS;
        SATURATING_DIFF: import("../classes/vm").AllStandardOps.SATURATING_DIFF;
        UPDATE_BLOCKS_FOR_TIER_RANGE: import("../classes/vm").AllStandardOps.UPDATE_BLOCKS_FOR_TIER_RANGE;
        SELECT_LTE: import("../classes/vm").AllStandardOps.SELECT_LTE;
        IERC20_BALANCE_OF: import("../classes/vm").AllStandardOps.IERC20_BALANCE_OF;
        IERC20_TOTAL_SUPPLY: import("../classes/vm").AllStandardOps.IERC20_TOTAL_SUPPLY;
        IERC721_BALANCE_OF: import("../classes/vm").AllStandardOps.IERC721_BALANCE_OF;
        IERC721_OWNER_OF: import("../classes/vm").AllStandardOps.IERC721_OWNER_OF;
        IERC1155_BALANCE_OF: import("../classes/vm").AllStandardOps.IERC1155_BALANCE_OF;
        IERC1155_BALANCE_OF_BATCH: import("../classes/vm").AllStandardOps.IERC1155_BALANCE_OF_BATCH;
        length: import("../classes/vm").AllStandardOps.length;
    };
```

## Property Details

<a id="buy-property"></a>

### buy

Main entrypoint to the sale. Sells rTKN in exchange for reserve token. The price curve is eval'd to produce a reserve price quote. Each 1 unit of rTKN costs `price` reserve token where BOTH the rTKN units and price are treated as 18 decimal fixed point values. If the reserve token has more or less precision by its own conventions (e.g. "decimals" method on ERC20 tokens) then the price will need to scale accordingly. The receipt is \_logged\_ rather than returned as it cannot be used in same block for a refund anyway due to cooldowns.

<b>Signature:</b>

```typescript
readonly buy: (config: BuyConfig, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="calculatePrice-property"></a>

### calculatePrice

Calculates the current reserve price quoted for 1 unit of rTKN. Used internally to process `buy`

<b>Signature:</b>

```typescript
readonly calculatePrice: (units: BigNumberish, overrides?: ReadTxOverrides) => Promise<BigNumber>;
```

<a id="canEnd-property"></a>

### canEnd

Can the sale end? Evals `canEndStatePointer` to a boolean that determines whether the sale can end (move from active to success/fail). Buying will fail if the sale has ended. If the sale is out of rTKN stock it can ALWAYS end and in this case will NOT eval the "can end" script. The sale can ONLY end if it is currently in active status.

<b>Signature:</b>

```typescript
readonly canEnd: (overrides?: ReadTxOverrides) => Promise<boolean>;
```

<a id="canStart-property"></a>

### canStart

Can the sale start? Evals `canStartStatePointer` to a boolean that determines whether the sale can start (move from pending to active). Buying from and ending the sale will both always fail if the sale never started. The sale can ONLY start if it is currently in pending status.

<b>Signature:</b>

```typescript
readonly canStart: (overrides?: ReadTxOverrides) => Promise<boolean>;
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

Connect the current instance to a new signer

<i>Overrides [RainContract.connect](./raincontract.md#connect-property)</i>

<b>Signature:</b>

```typescript
readonly connect: (signer: Signer) => Sale;
```

<a id="end-property"></a>

### end

End the sale (move from active to success or fail). - `canEnd` MUST return true.

<b>Signature:</b>

```typescript
readonly end: (overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="getRedeemable-property"></a>

### getRedeemable

Obtain the instance redeemable token from this sale.

<b>Signature:</b>

```typescript
readonly getRedeemable: (signer?: Signer) => Promise<RedeemableERC20>;
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

Start the sale (move from pending to active). - `canStart` MUST return true.

<b>Signature:</b>

```typescript
readonly start: (overrides?: TxOverrides) => Promise<ContractTransaction>;
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

## Static Method Details

<a id="afterBlockNumberConfig-method-static-1"></a>

### afterBlockNumberConfig(blockNumber)

Create a condition as VM state configuration to that is true after a `blockNumber` in the chain.

<b>Signature:</b>

```typescript
static afterBlockNumberConfig(blockNumber: number): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  blockNumber | `number` | block number that will be use as comparision |

<b>Returns:</b>

`StateConfig`

A VM Configturation

<a id="afterTimestampConfig-method-static-1"></a>

### afterTimestampConfig(timestamp)

Create a condition as VM state configuration to that is true after a `timestamp` in the chain.

<b>Signature:</b>

```typescript
static afterTimestampConfig(timestamp: number): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  timestamp | `number` | timestamp that will be use as comparision |

<b>Returns:</b>

`StateConfig`

A VM Configturation

