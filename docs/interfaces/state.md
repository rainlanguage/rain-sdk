
# Interface State

Everything required to evaluate and track the state of a rain script. As this is a struct it will be in memory when passed to `RainVM` and so will be modified by reference internally. This is important for gas efficiency; the stack, arguments and stackIndex will likely be mutated by the running script.

<b>Signature:</b>

```typescript
interface State 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [arguments](./state.md#arguments-property) | `BigNumberish[]` | `ZIPMAP` populates arguments which can be copied to the stack by `VAL`<!-- -->. |
|  [constants](./state.md#constants-property) | `BigNumberish[]` | Constants that can be copied to the stack by index by `VAL`<!-- -->. |
|  [sources](./state.md#sources-property) | `BytesLike[]` | Sources available to be executed by `eval`<!-- -->. Notably `ZIPMAP` can also select a source to execute by index. |
|  [stack](./state.md#stack-property) | `BigNumberish[]` | Stack is the general purpose runtime state that opcodes can read from and write to according to their functionality. |
|  [stackIndex](./state.md#stackIndex-property) | `BigNumberish` | Opcodes write to the stack at the stack index and can consume from the stack by decrementing the index and reading between the old and new stack index. IMPORANT: The stack is never zeroed out so the index must be used to find the "top" of the stack as the result of an `eval`<!-- -->. |

## Property Details

<a id="arguments-property"></a>

### arguments

`ZIPMAP` populates arguments which can be copied to the stack by `VAL`<!-- -->.

<b>Signature:</b>

```typescript
arguments: BigNumberish[];
```

<a id="constants-property"></a>

### constants

Constants that can be copied to the stack by index by `VAL`<!-- -->.

<b>Signature:</b>

```typescript
constants: BigNumberish[];
```

<a id="sources-property"></a>

### sources

Sources available to be executed by `eval`<!-- -->. Notably `ZIPMAP` can also select a source to execute by index.

<b>Signature:</b>

```typescript
sources: BytesLike[];
```

<a id="stack-property"></a>

### stack

Stack is the general purpose runtime state that opcodes can read from and write to according to their functionality.

<b>Signature:</b>

```typescript
stack: BigNumberish[];
```

<a id="stackIndex-property"></a>

### stackIndex

Opcodes write to the stack at the stack index and can consume from the stack by decrementing the index and reading between the old and new stack index. IMPORANT: The stack is never zeroed out so the index must be used to find the "top" of the stack as the result of an `eval`<!-- -->.

<b>Signature:</b>

```typescript
stackIndex: BigNumberish;
```
