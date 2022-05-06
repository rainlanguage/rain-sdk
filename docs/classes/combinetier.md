[Home](../index.md) &gt; [CombineTier](./combinetier.md)

# Class CombineTier

A class for deploying and calling methods on a CombineTier.

Implements `ReadOnlyTier` over RainVM. Allows combining the reports from any other `ITier` contracts referenced in the `ImmutableSource` set at construction. value at the top of the stack after executing the rain script will be used as the return of `report`<!-- -->.

This class provides an easy way to deploy CombineTiers using Rain's canonical factories, and methods for interacting with an already deployed CombineTier.

<b>Signature:</b>

```typescript
class CombineTier extends TierContract 
```

## Example


```typescript
import { CombineTier } from 'rain-sdk'

// To deploy a new CombineTier, pass an ethers.js Signer and the config for the CombineTier.
const newTier = await CombineTier.deploy(signer, CombineTierConfigArgs)

// To connect to an existing CombineTier just pass the address and an ethers.js Signer.
const existingTier = new CombineTier(address, signer)

// Once you have a CombineTier, you can call the smart contract methods:
const report = await existingTier.report(address)

```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [concat](./combinetier.md#concat-property-static) | `typeof import("@ethersproject/bytes").concat` |  |
|  [deploy](./combinetier.md#deploy-property-static) | `(signer: Signer, args: CombineTierDeployArgs, overrides?: TxOverrides) => Promise<CombineTier>` | Deploys a new CombineTier. |
|  [getChainId](./raincontract.md#getChainId-property-static) | `(signerOrProvider: Signer \| Provider) => Promise<number>` | Get the chain ID from a valid ethers provider.<br><br>Request to the provider stored in the signer which is the chain ID.<br><br><i>Inherited from [RainContract.getChainId](./raincontract.md#getChainId-property-static)</i> |
|  [isChild](./combinetier.md#isChild-property-static) | `(signer: Signer, maybeChild: string) => Promise<boolean>` | Checks if address is registered as a child contract of this CombineTierFactory on a specific network |
|  [nameBookReference](./combinetier.md#nameBookReference-property-static) | `` | Reference to find the address in the book address. Should be implemented and assign it to each subclass<br><br><i>Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)</i> |
|  [op](./combinetier.md#op-property-static) | `(code: number, erand?: number \| BytesLike \| import("@ethersproject/bytes").Hexable) => Uint8Array` |  |
|  [Opcodes](./combinetier.md#Opcodes-property-static) | <pre>{&#010;    ACCOUNT: number;&#010;    SKIP: import("../../classes/vm").AllStandardOps.SKIP;&#010;    VAL: import("../../classes/vm").AllStandardOps.VAL;&#010;    DUP: import("../../classes/vm").AllStandardOps.DUP;&#010;    ZIPMAP: import("../../classes/vm").AllStandardOps.ZIPMAP;&#010;    DEBUG: import("../../classes/vm").AllStandardOps.DEBUG;&#010;    BLOCK_NUMBER: import("../../classes/vm").AllStandardOps.BLOCK_NUMBER;&#010;    BLOCK_TIMESTAMP: import("../../classes/vm").AllStandardOps.BLOCK_TIMESTAMP;&#010;    SENDER: import("../../classes/vm").AllStandardOps.SENDER;&#010;    THIS_ADDRESS: import("../../classes/vm").AllStandardOps.THIS_ADDRESS;&#010;    SCALE18_MUL: import("../../classes/vm").AllStandardOps.SCALE18_MUL;&#010;    SCALE18_DIV: import("../../classes/vm").AllStandardOps.SCALE18_DIV;&#010;    SCALE18: import("../../classes/vm").AllStandardOps.SCALE18;&#010;    SCALEN: import("../../classes/vm").AllStandardOps.SCALEN;&#010;    SCALE_BY: import("../../classes/vm").AllStandardOps.SCALE_BY;&#010;    SCALE18_ONE: import("../../classes/vm").AllStandardOps.SCALE18_ONE;&#010;    SCALE18_DECIMALS: import("../../classes/vm").AllStandardOps.SCALE18_DECIMALS;&#010;    ADD: import("../../classes/vm").AllStandardOps.ADD;&#010;    SATURATING_ADD: import("../../classes/vm").AllStandardOps.SATURATING_ADD;&#010;    SUB: import("../../classes/vm").AllStandardOps.SUB;&#010;    SATURATING_SUB: import("../../classes/vm").AllStandardOps.SATURATING_SUB;&#010;    MUL: import("../../classes/vm").AllStandardOps.MUL;&#010;    SATURATING_MUL: import("../../classes/vm").AllStandardOps.SATURATING_MUL;&#010;    DIV: import("../../classes/vm").AllStandardOps.DIV;&#010;    MOD: import("../../classes/vm").AllStandardOps.MOD;&#010;    EXP: import("../../classes/vm").AllStandardOps.EXP;&#010;    MIN: import("../../classes/vm").AllStandardOps.MIN;&#010;    MAX: import("../../classes/vm").AllStandardOps.MAX;&#010;    ISZERO: import("../../classes/vm").AllStandardOps.ISZERO;&#010;    EAGER_IF: import("../../classes/vm").AllStandardOps.EAGER_IF;&#010;    EQUAL_TO: import("../../classes/vm").AllStandardOps.EQUAL_TO;&#010;    LESS_THAN: import("../../classes/vm").AllStandardOps.LESS_THAN;&#010;    GREATER_THAN: import("../../classes/vm").AllStandardOps.GREATER_THAN;&#010;    EVERY: import("../../classes/vm").AllStandardOps.EVERY;&#010;    ANY: import("../../classes/vm").AllStandardOps.ANY;&#010;    REPORT: import("../../classes/vm").AllStandardOps.REPORT;&#010;    NEVER: import("../../classes/vm").AllStandardOps.NEVER;&#010;    ALWAYS: import("../../classes/vm").AllStandardOps.ALWAYS;&#010;    SATURATING_DIFF: import("../../classes/vm").AllStandardOps.SATURATING_DIFF;&#010;    UPDATE_BLOCKS_FOR_TIER_RANGE: import("../../classes/vm").AllStandardOps.UPDATE_BLOCKS_FOR_TIER_RANGE;&#010;    SELECT_LTE: import("../../classes/vm").AllStandardOps.SELECT_LTE;&#010;    IERC20_BALANCE_OF: import("../../classes/vm").AllStandardOps.IERC20_BALANCE_OF;&#010;    IERC20_TOTAL_SUPPLY: import("../../classes/vm").AllStandardOps.IERC20_TOTAL_SUPPLY;&#010;    IERC721_BALANCE_OF: import("../../classes/vm").AllStandardOps.IERC721_BALANCE_OF;&#010;    IERC721_OWNER_OF: import("../../classes/vm").AllStandardOps.IERC721_OWNER_OF;&#010;    IERC1155_BALANCE_OF: import("../../classes/vm").AllStandardOps.IERC1155_BALANCE_OF;&#010;    IERC1155_BALANCE_OF_BATCH: import("../../classes/vm").AllStandardOps.IERC1155_BALANCE_OF_BATCH;&#010;    length: import("../../classes/vm").AllStandardOps.length;&#010;}</pre> | Constructs a new CombineTier from a known address. |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [address](./raincontract.md#address-property) | `string` | <i>Inherited from [RainContract.address](./raincontract.md#address-property)</i> |
|  [connect](./combinetier.md#connect-property) | `(signer: Signer) => CombineTier` | Connect the current instance to a new signer<br><br><i>Overrides [RainContract.connect](./raincontract.md#connect-property)</i> |
|  [levels](./tiercontract.md#levels-property) | `typeof Tier` | All the contract tier levels.<br><br><i>Inherited from [TierContract.levels](./tiercontract.md#levels-property)</i> |
|  [report](./tiercontract.md#report-property) | `(account: string, overrides?: ReadTxOverrides) => Promise<BigNumber>` | A tier report is a `uint256` that contains each of the block numbers each tier has been held continously since as a `uint32`<!-- -->. There are 9 possible tier, starting with tier 0 for `0` offset or "never held any tier" then working up through 8x 4 byte offsets to the full 256 bits.<br><br><i>Inherited from [TierContract.report](./tiercontract.md#report-property)</i> |
|  [setTier](./combinetier.md#setTier-property) | `(account: string, endTier: BigNumberish, data: BytesLike, overrides?: TxOverrides) => Promise<never>` | It is NOT implemented in CombineTiers. Always will throw an error<br><br><i>Overrides [TierContract.setTier](./tiercontract.md#setTier-property)</i> |
|  [signer](./raincontract.md#signer-property) | `Signer` | <i>Inherited from [RainContract.signer](./raincontract.md#signer-property)</i> |

## Static Methods

|  Method | Description |
|  --- | --- |
|  [\_isChild(signer, maybeChild)](./factorycontract.md#_isChild-method-static-1) | Checks if address is registered as a child contract of the factory in the chain. Should be implemented in sub-classes that repreent factories to expose it.<br><br><i>Inherited from [FactoryContract.\_isChild()](./factorycontract.md#_isChild-method-static-1)</i> |
|  [getBookAddress(chainId)](./raincontract.md#getBookAddress-method-static-1) | Get the address stored in the book to this chain<br><br><i>Inherited from [RainContract.getBookAddress()](./raincontract.md#getBookAddress-method-static-1)</i> |
|  [getNewChildFromReceipt(receipt, parentContract)](./factorycontract.md#getNewChildFromReceipt-method-static-1) | Get the child from a receipt obtain from a Factory transaction<br><br><i>Inherited from [FactoryContract.getNewChildFromReceipt()](./factorycontract.md#getNewChildFromReceipt-method-static-1)</i> |

## Methods

|  Method | Description |
|  --- | --- |
|  [checkAddress(address, message)](./raincontract.md#checkAddress-method-1) | Check if an address is correctly formatted and throw an error if it is not an valid address<br><br><i>Inherited from [RainContract.checkAddress()](./raincontract.md#checkAddress-method-1)</i> |
|  [currentTier(account, block)](./tiercontract.md#currentTier-method-1) | Get the current tier of an `account` in the Tier as an expression between `[0 - 8]`<!-- -->. Tier 0 is that a address has never interact with the Tier Contract.<br><br><i>Inherited from [TierContract.currentTier()](./tiercontract.md#currentTier-method-1)</i> |

## Static Property Details

<a id="concat-property-static"></a>

### concat

<b>Signature:</b>

```typescript
static concat: typeof import("@ethersproject/bytes").concat;
```

<a id="deploy-property-static"></a>

### deploy

Deploys a new CombineTier.

<b>Signature:</b>

```typescript
static deploy: (signer: Signer, args: CombineTierDeployArgs, overrides?: TxOverrides) => Promise<CombineTier>;
```

<a id="isChild-property-static"></a>

### isChild

Checks if address is registered as a child contract of this CombineTierFactory on a specific network

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
protected static readonly nameBookReference = "combineTierFactory";
```

<a id="op-property-static"></a>

### op

<b>Signature:</b>

```typescript
static op: (code: number, erand?: number | BytesLike | import("@ethersproject/bytes").Hexable) => Uint8Array;
```

<a id="Opcodes-property-static"></a>

### Opcodes

Constructs a new CombineTier from a known address.

<b>Signature:</b>

```typescript
static Opcodes: {
        ACCOUNT: number;
        SKIP: import("../../classes/vm").AllStandardOps.SKIP;
        VAL: import("../../classes/vm").AllStandardOps.VAL;
        DUP: import("../../classes/vm").AllStandardOps.DUP;
        ZIPMAP: import("../../classes/vm").AllStandardOps.ZIPMAP;
        DEBUG: import("../../classes/vm").AllStandardOps.DEBUG;
        BLOCK_NUMBER: import("../../classes/vm").AllStandardOps.BLOCK_NUMBER;
        BLOCK_TIMESTAMP: import("../../classes/vm").AllStandardOps.BLOCK_TIMESTAMP;
        SENDER: import("../../classes/vm").AllStandardOps.SENDER;
        THIS_ADDRESS: import("../../classes/vm").AllStandardOps.THIS_ADDRESS;
        SCALE18_MUL: import("../../classes/vm").AllStandardOps.SCALE18_MUL;
        SCALE18_DIV: import("../../classes/vm").AllStandardOps.SCALE18_DIV;
        SCALE18: import("../../classes/vm").AllStandardOps.SCALE18;
        SCALEN: import("../../classes/vm").AllStandardOps.SCALEN;
        SCALE_BY: import("../../classes/vm").AllStandardOps.SCALE_BY;
        SCALE18_ONE: import("../../classes/vm").AllStandardOps.SCALE18_ONE;
        SCALE18_DECIMALS: import("../../classes/vm").AllStandardOps.SCALE18_DECIMALS;
        ADD: import("../../classes/vm").AllStandardOps.ADD;
        SATURATING_ADD: import("../../classes/vm").AllStandardOps.SATURATING_ADD;
        SUB: import("../../classes/vm").AllStandardOps.SUB;
        SATURATING_SUB: import("../../classes/vm").AllStandardOps.SATURATING_SUB;
        MUL: import("../../classes/vm").AllStandardOps.MUL;
        SATURATING_MUL: import("../../classes/vm").AllStandardOps.SATURATING_MUL;
        DIV: import("../../classes/vm").AllStandardOps.DIV;
        MOD: import("../../classes/vm").AllStandardOps.MOD;
        EXP: import("../../classes/vm").AllStandardOps.EXP;
        MIN: import("../../classes/vm").AllStandardOps.MIN;
        MAX: import("../../classes/vm").AllStandardOps.MAX;
        ISZERO: import("../../classes/vm").AllStandardOps.ISZERO;
        EAGER_IF: import("../../classes/vm").AllStandardOps.EAGER_IF;
        EQUAL_TO: import("../../classes/vm").AllStandardOps.EQUAL_TO;
        LESS_THAN: import("../../classes/vm").AllStandardOps.LESS_THAN;
        GREATER_THAN: import("../../classes/vm").AllStandardOps.GREATER_THAN;
        EVERY: import("../../classes/vm").AllStandardOps.EVERY;
        ANY: import("../../classes/vm").AllStandardOps.ANY;
        REPORT: import("../../classes/vm").AllStandardOps.REPORT;
        NEVER: import("../../classes/vm").AllStandardOps.NEVER;
        ALWAYS: import("../../classes/vm").AllStandardOps.ALWAYS;
        SATURATING_DIFF: import("../../classes/vm").AllStandardOps.SATURATING_DIFF;
        UPDATE_BLOCKS_FOR_TIER_RANGE: import("../../classes/vm").AllStandardOps.UPDATE_BLOCKS_FOR_TIER_RANGE;
        SELECT_LTE: import("../../classes/vm").AllStandardOps.SELECT_LTE;
        IERC20_BALANCE_OF: import("../../classes/vm").AllStandardOps.IERC20_BALANCE_OF;
        IERC20_TOTAL_SUPPLY: import("../../classes/vm").AllStandardOps.IERC20_TOTAL_SUPPLY;
        IERC721_BALANCE_OF: import("../../classes/vm").AllStandardOps.IERC721_BALANCE_OF;
        IERC721_OWNER_OF: import("../../classes/vm").AllStandardOps.IERC721_OWNER_OF;
        IERC1155_BALANCE_OF: import("../../classes/vm").AllStandardOps.IERC1155_BALANCE_OF;
        IERC1155_BALANCE_OF_BATCH: import("../../classes/vm").AllStandardOps.IERC1155_BALANCE_OF_BATCH;
        length: import("../../classes/vm").AllStandardOps.length;
    };
```

## Property Details

<a id="connect-property"></a>

### connect

Connect the current instance to a new signer

<i>Overrides [RainContract.connect](./raincontract.md#connect-property)</i>

<b>Signature:</b>

```typescript
readonly connect: (signer: Signer) => CombineTier;
```

<a id="setTier-property"></a>

### setTier

It is NOT implemented in CombineTiers. Always will throw an error

<i>Overrides [TierContract.setTier](./tiercontract.md#setTier-property)</i>

<b>Signature:</b>

```typescript
readonly setTier: (account: string, endTier: BigNumberish, data: BytesLike, overrides?: TxOverrides) => Promise<never>;
```
