[Home](../index.md) &gt; [VM](./vm.md)

# Class VM


<b>Signature:</b>

```typescript
class VM 
```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [concat](./vm.md#concat-property-static) | `typeof utils.concat` | Concatenates all the BytesLike in array into a single Uint8Array. |
|  [op](./vm.md#op-property-static) | `(code: number, erand?: number \| BytesLike \| utils.Hexable) => Uint8Array` | Converts an opcode and operand to bytes, and returns their concatenation. |
|  [Opcodes](./vm.md#Opcodes-property-static) | <pre>{&#010;    [x: number]: string;&#010;    SKIP: AllStandardOps.SKIP;&#010;    VAL: AllStandardOps.VAL;&#010;    DUP: AllStandardOps.DUP;&#010;    ZIPMAP: AllStandardOps.ZIPMAP;&#010;    DEBUG: AllStandardOps.DEBUG;&#010;    BLOCK_NUMBER: AllStandardOps.BLOCK_NUMBER;&#010;    BLOCK_TIMESTAMP: AllStandardOps.BLOCK_TIMESTAMP;&#010;    SENDER: AllStandardOps.SENDER;&#010;    THIS_ADDRESS: AllStandardOps.THIS_ADDRESS;&#010;    SCALE18_MUL: AllStandardOps.SCALE18_MUL;&#010;    SCALE18_DIV: AllStandardOps.SCALE18_DIV;&#010;    SCALE18: AllStandardOps.SCALE18;&#010;    SCALEN: AllStandardOps.SCALEN;&#010;    SCALE_BY: AllStandardOps.SCALE_BY;&#010;    SCALE18_ONE: AllStandardOps.SCALE18_ONE;&#010;    SCALE18_DECIMALS: AllStandardOps.SCALE18_DECIMALS;&#010;    ADD: AllStandardOps.ADD;&#010;    SATURATING_ADD: AllStandardOps.SATURATING_ADD;&#010;    SUB: AllStandardOps.SUB;&#010;    SATURATING_SUB: AllStandardOps.SATURATING_SUB;&#010;    MUL: AllStandardOps.MUL;&#010;    SATURATING_MUL: AllStandardOps.SATURATING_MUL;&#010;    DIV: AllStandardOps.DIV;&#010;    MOD: AllStandardOps.MOD;&#010;    EXP: AllStandardOps.EXP;&#010;    MIN: AllStandardOps.MIN;&#010;    MAX: AllStandardOps.MAX;&#010;    ISZERO: AllStandardOps.ISZERO;&#010;    EAGER_IF: AllStandardOps.EAGER_IF;&#010;    EQUAL_TO: AllStandardOps.EQUAL_TO;&#010;    LESS_THAN: AllStandardOps.LESS_THAN;&#010;    GREATER_THAN: AllStandardOps.GREATER_THAN;&#010;    EVERY: AllStandardOps.EVERY;&#010;    ANY: AllStandardOps.ANY;&#010;    REPORT: AllStandardOps.REPORT;&#010;    NEVER: AllStandardOps.NEVER;&#010;    ALWAYS: AllStandardOps.ALWAYS;&#010;    SATURATING_DIFF: AllStandardOps.SATURATING_DIFF;&#010;    UPDATE_BLOCKS_FOR_TIER_RANGE: AllStandardOps.UPDATE_BLOCKS_FOR_TIER_RANGE;&#010;    SELECT_LTE: AllStandardOps.SELECT_LTE;&#010;    IERC20_BALANCE_OF: AllStandardOps.IERC20_BALANCE_OF;&#010;    IERC20_TOTAL_SUPPLY: AllStandardOps.IERC20_TOTAL_SUPPLY;&#010;    IERC721_BALANCE_OF: AllStandardOps.IERC721_BALANCE_OF;&#010;    IERC721_OWNER_OF: AllStandardOps.IERC721_OWNER_OF;&#010;    IERC1155_BALANCE_OF: AllStandardOps.IERC1155_BALANCE_OF;&#010;    IERC1155_BALANCE_OF_BATCH: AllStandardOps.IERC1155_BALANCE_OF_BATCH;&#010;    length: AllStandardOps.length;&#010;}</pre> | All the standard Op Codes |

## Static Methods

|  Method | Description |
|  --- | --- |
|  [bytify(value, bytesLength)](./vm.md#bytify-method-static-1) | Converts a value to raw bytes representation. Assumes `value` is less than or equal to 1 byte, unless a desired `bytesLength` is specified. |
|  [createVMSources(OPerands)](./vm.md#createVMSources-method-static-1) | Create a VM sources to be ready to use in any call just providing the combination desired. |

## Static Property Details

<a id="concat-property-static"></a>

### concat

Concatenates all the BytesLike in array into a single Uint8Array.

<b>Signature:</b>

```typescript
static concat: typeof utils.concat;
```

<a id="op-property-static"></a>

### op

Converts an opcode and operand to bytes, and returns their concatenation.

<b>Signature:</b>

```typescript
static op: (code: number, erand?: number | BytesLike | utils.Hexable) => Uint8Array;
```

<a id="Opcodes-property-static"></a>

### Opcodes

All the standard Op Codes

<b>Signature:</b>

```typescript
static Opcodes: {
        [x: number]: string;
        SKIP: AllStandardOps.SKIP;
        VAL: AllStandardOps.VAL;
        DUP: AllStandardOps.DUP;
        ZIPMAP: AllStandardOps.ZIPMAP;
        DEBUG: AllStandardOps.DEBUG;
        BLOCK_NUMBER: AllStandardOps.BLOCK_NUMBER;
        BLOCK_TIMESTAMP: AllStandardOps.BLOCK_TIMESTAMP;
        SENDER: AllStandardOps.SENDER;
        THIS_ADDRESS: AllStandardOps.THIS_ADDRESS;
        SCALE18_MUL: AllStandardOps.SCALE18_MUL;
        SCALE18_DIV: AllStandardOps.SCALE18_DIV;
        SCALE18: AllStandardOps.SCALE18;
        SCALEN: AllStandardOps.SCALEN;
        SCALE_BY: AllStandardOps.SCALE_BY;
        SCALE18_ONE: AllStandardOps.SCALE18_ONE;
        SCALE18_DECIMALS: AllStandardOps.SCALE18_DECIMALS;
        ADD: AllStandardOps.ADD;
        SATURATING_ADD: AllStandardOps.SATURATING_ADD;
        SUB: AllStandardOps.SUB;
        SATURATING_SUB: AllStandardOps.SATURATING_SUB;
        MUL: AllStandardOps.MUL;
        SATURATING_MUL: AllStandardOps.SATURATING_MUL;
        DIV: AllStandardOps.DIV;
        MOD: AllStandardOps.MOD;
        EXP: AllStandardOps.EXP;
        MIN: AllStandardOps.MIN;
        MAX: AllStandardOps.MAX;
        ISZERO: AllStandardOps.ISZERO;
        EAGER_IF: AllStandardOps.EAGER_IF;
        EQUAL_TO: AllStandardOps.EQUAL_TO;
        LESS_THAN: AllStandardOps.LESS_THAN;
        GREATER_THAN: AllStandardOps.GREATER_THAN;
        EVERY: AllStandardOps.EVERY;
        ANY: AllStandardOps.ANY;
        REPORT: AllStandardOps.REPORT;
        NEVER: AllStandardOps.NEVER;
        ALWAYS: AllStandardOps.ALWAYS;
        SATURATING_DIFF: AllStandardOps.SATURATING_DIFF;
        UPDATE_BLOCKS_FOR_TIER_RANGE: AllStandardOps.UPDATE_BLOCKS_FOR_TIER_RANGE;
        SELECT_LTE: AllStandardOps.SELECT_LTE;
        IERC20_BALANCE_OF: AllStandardOps.IERC20_BALANCE_OF;
        IERC20_TOTAL_SUPPLY: AllStandardOps.IERC20_TOTAL_SUPPLY;
        IERC721_BALANCE_OF: AllStandardOps.IERC721_BALANCE_OF;
        IERC721_OWNER_OF: AllStandardOps.IERC721_OWNER_OF;
        IERC1155_BALANCE_OF: AllStandardOps.IERC1155_BALANCE_OF;
        IERC1155_BALANCE_OF_BATCH: AllStandardOps.IERC1155_BALANCE_OF_BATCH;
        length: AllStandardOps.length;
    };
```

## Static Method Details

<a id="bytify-method-static-1"></a>

### bytify(value, bytesLength)

Converts a value to raw bytes representation. Assumes `value` is less than or equal to 1 byte, unless a desired `bytesLength` is specified.

<b>Signature:</b>

```typescript
static bytify(value: number | BytesLike | utils.Hexable, bytesLength?: number): BytesLike;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  value | `number \| BytesLike \| utils.Hexable` | value to convert to raw bytes format |
|  bytesLength | `number` | (defaults to 1) number of bytes to left pad if `value` doesn't completely fill the desired amount of memory. Will throw `InvalidArgument` error if value already exceeds bytes length. |

<b>Returns:</b>

`BytesLike`

raw bytes representation as Uint8Array

<a id="createVMSources-method-static-1"></a>

### createVMSources(OPerands)

Create a VM sources to be ready to use in any call just providing the combination desired.

<b>Signature:</b>

```typescript
static createVMSources(OPerands: OPerand[]): [Uint8Array];
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  OPerands | `OPerand[]` | All the configuration with the opcodes and operands. If any combination does not have an operand with an opcode, a 0 (zero) will be use with the opcode as the operand. Please |

<b>Returns:</b>

`[Uint8Array]`


