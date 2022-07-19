
# Class SaleJSVM

- The javascript version of SaleVM which inherits RainJS with local Sale opcodes.

<b>Signature:</b>

```typescript
class SaleJSVM extends RainJSVM 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [applyOpFn](./rainjsvm.md#applyOpFn-property) | [FnPtrs](../interfaces/fnptrs.md) | It is a property for overriding the opcodes. Need to ba passed at the time of construction because the RainJS opcode functions should not change after an instance has be created.<br></br>*Inherited from [RainJSVM.applyOpFn](./rainjsvm.md#applyOpFn-property)* |
|  [constant](./rainjsvm.md#constant-property) | `(operand: number, data?: any) => void` | <br></br>*Inherited from [RainJSVM.constant](./rainjsvm.md#constant-property)* |
|  [context](./rainjsvm.md#context-property) | `(operand: number, data?: any) => void` | <br></br>*Inherited from [RainJSVM.context](./rainjsvm.md#context-property)* |
|  [ContextRange](./salejsvm.md#ContextRange-property) | `` | SaleJSVM valid context length<br></br>*Overrides [RainJSVM.ContextRange](./rainjsvm.md#ContextRange-property)* |
|  [debug](./rainjsvm.md#debug-property) | `(operand: number, data?: any) => void` | *Inherited from [RainJSVM.debug](./rainjsvm.md#debug-property)* |
|  [fnPtrs](./rainjsvm.md#fnPtrs-property) | [FnPtrs](../interfaces/fnptrs.md) | key/value pair of opcodes and their functions for all standard opcodes<br></br>*Inherited from [RainJSVM.fnPtrs](./rainjsvm.md#fnPtrs-property)* |
|  [lastState](./rainjsvm.md#lastState-property) | `BigNumber[]` | The result state of the executed Rainjs.<br></br>*Inherited from [RainJSVM.lastState](./rainjsvm.md#lastState-property)* |
|  [self](./rainjsvm.md#self-property) | `string` | The contract address of the instance of this class used for THIS\_ADDRESS opcode<br></br>*Inherited from [RainJSVM.self](./rainjsvm.md#self-property)* |
|  [signer](./rainjsvm.md#signer-property) | `Signer` | An ethers Signer.<br></br>*Inherited from [RainJSVM.signer](./rainjsvm.md#signer-property)* |
|  [stack](./rainjsvm.md#stack-property) | `(operand: number, data?: any) => void` | <br></br>*Inherited from [RainJSVM.stack](./rainjsvm.md#stack-property)* |
|  [storage](./rainjsvm.md#storage-property) | `(operand: number, data?: any) => Promise<void>` | <br></br>*Inherited from [RainJSVM.storage](./rainjsvm.md#storage-property)* |
|  [StorageOps](./salejsvm.md#StorageOps-property) | [FnPtrs](../interfaces/fnptrs.md) | key/value pair of STORAGE opcodes of the sale JSVM<br></br>*Overrides [RainJSVM.StorageOps](./rainjsvm.md#StorageOps-property)* |
|  [StorageRange](./salejsvm.md#StorageRange-property) | `` | SaleJSVM valid storage range<br></br>*Overrides [RainJSVM.StorageRange](./rainjsvm.md#StorageRange-property)* |
|  [zipmap](./rainjsvm.md#zipmap-property) | `(operand: number, data?: any) => Promise<void>` | *Inherited from [RainJSVM.zipmap](./rainjsvm.md#zipmap-property)* |

## Static Methods

|  Method | Description |
|  --- | --- |
|  [opsFromOpMeta(\_opmeta)](./rainjsvm.md#opsFromOpMeta-method-static-1) | *Inherited from [RainJSVM.opsFromOpMeta()](./rainjsvm.md#opsFromOpMeta-method-static-1)* |

## Methods

|  Method | Description |
|  --- | --- |
|  [connect(signer)](./rainjsvm.md#connect-method-1) | <br></br>*Inherited from [RainJSVM.connect()](./rainjsvm.md#connect-method-1)* |
|  [run(data, entrypoint)](./rainjsvm.md#run-method-1) | Method to execute the RainJS.<br></br>*Inherited from [RainJSVM.run()](./rainjsvm.md#run-method-1)* |
|  [setContract(contract)](./rainjsvm.md#setContract-method-1) | <br></br>*Inherited from [RainJSVM.setContract()](./rainjsvm.md#setContract-method-1)* |

## Property Details

<a id="ContextRange-property"></a>

### ContextRange

SaleJSVM valid context length

*Overrides [RainJSVM.ContextRange](./rainjsvm.md#ContextRange-property)*

<b>Signature:</b>

```typescript
protected readonly ContextRange = SaleContext.length;
```

<a id="StorageOps-property"></a>

### StorageOps

key/value pair of STORAGE opcodes of the sale JSVM

*Overrides [RainJSVM.StorageOps](./rainjsvm.md#StorageOps-property)*

<b>Signature:</b>

```typescript
protected readonly StorageOps: FnPtrs;
```

<a id="StorageRange-property"></a>

### StorageRange

SaleJSVM valid storage range

*Overrides [RainJSVM.StorageRange](./rainjsvm.md#StorageRange-property)*

<b>Signature:</b>

```typescript
protected readonly StorageRange = SaleStorage.length;
```
