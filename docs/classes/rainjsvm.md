
# Class RainJSVM

- The javascript version of the RainVM, basically does the same job RainVM does but off-chain.

<b>Signature:</b>

```typescript
class RainJSVM 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [applyOpFn](./rainjsvm.md#applyOpFn-property) | [FnPtrsJSVM](../interfaces/fnptrsjsvm.md) | It is a property for overriding the opcodes. Need to be passed at the time of construction because the RainJSVM opcode functions should be immutable after an instance has be created. |
|  [constant](./rainjsvm.md#constant-property) | `(operand: number, data?: any) => void` |  |
|  [context](./rainjsvm.md#context-property) | `(operand: number, data?: any) => void` |  |
|  [ContextRange](./rainjsvm.md#ContextRange-property) | `number` | Length of the valid context argument accessible by eval |
|  [debug](./rainjsvm.md#debug-property) | `(operand: number, data?: any) => void` |  |
|  [fnPtrs](./rainjsvm.md#fnPtrs-property) | [FnPtrsJSVM](../interfaces/fnptrsjsvm.md) | key/value pair of opcodes and their functions for all standard opcodes |
|  [lastState](./rainjsvm.md#lastState-property) | `BigNumber[]` | The result state of the executed Rainjs. |
|  [self](./rainjsvm.md#self-property) | `string` | The contract address of the instance of this class used for THIS\_ADDRESS opcode |
|  [signer](./rainjsvm.md#signer-property) | `Signer` | An ethers Signer. |
|  [stack](./rainjsvm.md#stack-property) | `(operand: number, data?: any) => void` |  |
|  [storage](./rainjsvm.md#storage-property) | `(operand: number, data?: any) => Promise<void>` |  |
|  [StorageOps](./rainjsvm.md#StorageOps-property) | [FnPtrsJSVM](../interfaces/fnptrsjsvm.md) | Object that contains the STORAGE opcode functions (i.e. local opcodes) |
|  [StorageRange](./rainjsvm.md#StorageRange-property) | `number` | Range of available storage variables accessible by eval |
|  [zipmap](./rainjsvm.md#zipmap-property) | `(operand: number, data?: any) => Promise<void>` |  |

## Methods

|  Method | Description |
|  --- | --- |
|  [connect(signer)](./rainjsvm.md#connect-method-1) |  |
|  [run(data, entrypoint)](./rainjsvm.md#run-method-1) | Method to execute the RainJSVM. |
|  [setContract(contract)](./rainjsvm.md#setContract-method-1) |  |

## Property Details

<a id="applyOpFn-property"></a>

### applyOpFn

It is a property for overriding the opcodes. Need to be passed at the time of construction because the RainJSVM opcode functions should be immutable after an instance has be created.

<b>Signature:</b>

```typescript
readonly applyOpFn?: FnPtrsJSVM;
```

<a id="constant-property"></a>

### constant


<b>Signature:</b>

```typescript
get constant(): (operand: number, data?: any) => void;
```

<a id="context-property"></a>

### context


<b>Signature:</b>

```typescript
get context(): (operand: number, data?: any) => void;
```

<a id="ContextRange-property"></a>

### ContextRange

Length of the valid context argument accessible by eval

<b>Signature:</b>

```typescript
protected readonly ContextRange?: number;
```

<a id="debug-property"></a>

### debug

<b>Signature:</b>

```typescript
get debug(): (operand: number, data?: any) => void;
```

<a id="fnPtrs-property"></a>

### fnPtrs

key/value pair of opcodes and their functions for all standard opcodes

<b>Signature:</b>

```typescript
protected readonly fnPtrs: FnPtrsJSVM;
```

<a id="lastState-property"></a>

### lastState

The result state of the executed Rainjs.

<b>Signature:</b>

```typescript
readonly lastState: BigNumber[];
```

<a id="self-property"></a>

### self

The contract address of the instance of this class used for THIS\_ADDRESS opcode

<b>Signature:</b>

```typescript
self?: string;
```

<a id="signer-property"></a>

### signer

An ethers Signer.

<b>Signature:</b>

```typescript
signer?: Signer;
```

<a id="stack-property"></a>

### stack


<b>Signature:</b>

```typescript
get stack(): (operand: number, data?: any) => void;
```

<a id="storage-property"></a>

### storage


<b>Signature:</b>

```typescript
get storage(): (operand: number, data?: any) => Promise<void>;
```

<a id="StorageOps-property"></a>

### StorageOps

Object that contains the STORAGE opcode functions (i.e. local opcodes)

<b>Signature:</b>

```typescript
protected readonly StorageOps?: FnPtrsJSVM;
```

<a id="StorageRange-property"></a>

### StorageRange

Range of available storage variables accessible by eval

<b>Signature:</b>

```typescript
protected readonly StorageRange: number;
```

<a id="zipmap-property"></a>

### zipmap

<b>Signature:</b>

```typescript
get zipmap(): (operand: number, data?: any) => Promise<void>;
```

## Method Details

<a id="connect-method-1"></a>

### connect(signer)


<b>Signature:</b>

```typescript
connect(signer: Signer): this;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  signer | `Signer` |  |

<b>Returns:</b>

`this`

<a id="run-method-1"></a>

### run(data, entrypoint)

Method to execute the RainJSVM.

<b>Signature:</b>

```typescript
run(data?: any, entrypoint?: number): Promise<BigNumber[]>;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  data | `any` | (optional) Used as additional info for some local opcodes or custom opcode functions i.e. applyOpFn. |
|  entrypoint | `number` | the index of sources to start eval |

<b>Returns:</b>

`Promise<BigNumber[]>`

- An array represting the final state of the RainJSVM stack.

<a id="setContract-method-1"></a>

### setContract(contract)


<b>Signature:</b>

```typescript
setContract(contract: string | Contract): this;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  contract | `string \| Contract` |  |

<b>Returns:</b>

`this`

