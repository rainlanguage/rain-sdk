
# Class RainJS

- The javascript version of the RainVM, basically does the same job RainVM does but off-chain.

<b>Signature:</b>

```typescript
class RainJS 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [\_CONTEXT\_](./rainjs.md#_CONTEXT_-property) | [ApplyOpFn](../interfaces/applyopfn.md) | Object that contains the CONTEXT opcode functions (i.e. local opcodes) the required value need to be passed to "run" method as the context array in "data" object. the reason is the CONTEXT opcode is contextual and is passed the VM at runtime. |
|  [\_OPCODE\_](./rainjs.md#_OPCODE_-property) | [ApplyOpFn](../interfaces/applyopfn.md) | key/value pair of opcodes and their functions for all standard opcodes |
|  [\_STORAGE\_](./rainjs.md#_STORAGE_-property) | [ApplyOpFn](../interfaces/applyopfn.md) | Object that contains the STORAGE opcode functions (i.e. local opcodes) |
|  [contract](./rainjs.md#contract-property) | `Contract` | An ethers Contract |
|  [lastState](./rainjs.md#lastState-property) | `BigNumber[]` | The result state of the executed Rainjs. |
|  [provider](./rainjs.md#provider-property) | `Provider` | An ethers provider. |
|  [signer](./rainjs.md#signer-property) | `Signer` | An ethers Signer. |

## Methods

|  Method | Description |
|  --- | --- |
|  [run(data)](./rainjs.md#run-method-1) | Method to execute the RainJS. |

## Property Details

<a id="_CONTEXT_-property"></a>

### \_CONTEXT\_

Object that contains the CONTEXT opcode functions (i.e. local opcodes) the required value need to be passed to "run" method as the context array in "data" object. the reason is the CONTEXT opcode is contextual and is passed the VM at runtime.

<b>Signature:</b>

```typescript
protected _CONTEXT_?: ApplyOpFn;
```

<a id="_OPCODE_-property"></a>

### \_OPCODE\_

key/value pair of opcodes and their functions for all standard opcodes

<b>Signature:</b>

```typescript
protected readonly _OPCODE_: ApplyOpFn;
```

<a id="_STORAGE_-property"></a>

### \_STORAGE\_

Object that contains the STORAGE opcode functions (i.e. local opcodes)

<b>Signature:</b>

```typescript
protected _STORAGE_?: ApplyOpFn;
```

<a id="contract-property"></a>

### contract

An ethers Contract

<b>Signature:</b>

```typescript
contract?: Contract;
```

<a id="lastState-property"></a>

### lastState

The result state of the executed Rainjs.

<b>Signature:</b>

```typescript
readonly lastState: BigNumber[];
```

<a id="provider-property"></a>

### provider

An ethers provider.

<b>Signature:</b>

```typescript
provider?: Provider;
```

<a id="signer-property"></a>

### signer

An ethers Signer.

<b>Signature:</b>

```typescript
signer?: Signer;
```

## Method Details

<a id="run-method-1"></a>

### run(data)

Method to execute the RainJS.

<b>Signature:</b>

```typescript
run(data?: any): Promise<BigNumber>;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  data | `any` | (optional) Used as additional info for some local opcodes or custom opcode functions i.e. applyOpFn. |

<b>Returns:</b>

`Promise<BigNumber>`

- An array represting the final state of the RainJS stack.

