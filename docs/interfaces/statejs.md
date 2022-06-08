
# Interface StateJS

- An interface, StateJS is basically javascript version of 'State' struct in RainVM, although it doesn't need stackLength and argumentsLength to operate. It receives a regular RainVM in the constructor and initiates the stack for it and all opcodes do their operations to the stack.

<b>Signature:</b>

```typescript
interface StateJS 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [argsArr](./statejs.md#argsArr-property) | `BigNumber[]` | Used only for zipmap opcode |
|  [constants](./statejs.md#constants-property) | `BigNumber[]` | The property to store the RainVM script constants. |
|  [sources](./statejs.md#sources-property) | `Uint8Array[]` | The property to store the RainVM script sources. |
|  [stack](./statejs.md#stack-property) | `BigNumber[]` | The RainJS's stack. |

## Property Details

<a id="argsArr-property"></a>

### argsArr

Used only for zipmap opcode

<b>Signature:</b>

```typescript
readonly argsArr: BigNumber[];
```

<a id="constants-property"></a>

### constants

The property to store the RainVM script constants.

<b>Signature:</b>

```typescript
readonly constants: BigNumber[];
```

<a id="sources-property"></a>

### sources

The property to store the RainVM script sources.

<b>Signature:</b>

```typescript
readonly sources: Uint8Array[];
```

<a id="stack-property"></a>

### stack

The RainJS's stack.

<b>Signature:</b>

```typescript
readonly stack: BigNumber[];
```
