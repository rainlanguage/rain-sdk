
# Class CombineTierJSVM

- The javascript version of CombineTierVM which inherits RainJSVM with local CombineTier opcodes.

<b>Signature:</b>

```typescript
class CombineTierJSVM extends RainJSVM 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [applyOpFn](./rainjsvm.md#applyOpFn-property) | [FnPtrsJSVM](../interfaces/fnptrsjsvm.md) | It is a property for overriding the opcodes. Need to be passed at the time of construction because the RainJSVM opcode functions should be immutable after an instance has be created.<br></br>*Inherited from [RainJSVM.applyOpFn](./rainjsvm.md#applyOpFn-property)* |
|  [constant](./rainjsvm.md#constant-property) | `(operand: number, data?: any) => void` | <br></br>*Inherited from [RainJSVM.constant](./rainjsvm.md#constant-property)* |
|  [context](./rainjsvm.md#context-property) | `(operand: number, data?: any) => void` | <br></br>*Inherited from [RainJSVM.context](./rainjsvm.md#context-property)* |
|  [ContextLength](./combinetierjsvm.md#ContextLength-property) | `number` | CombineTierJSVM can have any length for context |
|  [ContextRange](./rainjsvm.md#ContextRange-property) | `number` | Length of the valid context argument accessible by eval<br></br>*Inherited from [RainJSVM.ContextRange](./rainjsvm.md#ContextRange-property)* |
|  [debug](./rainjsvm.md#debug-property) | `(operand: number, data?: any) => void` | *Inherited from [RainJSVM.debug](./rainjsvm.md#debug-property)* |
|  [fnPtrs](./rainjsvm.md#fnPtrs-property) | [FnPtrsJSVM](../interfaces/fnptrsjsvm.md) | key/value pair of opcodes and their functions for all standard opcodes<br></br>*Inherited from [RainJSVM.fnPtrs](./rainjsvm.md#fnPtrs-property)* |
|  [lastState](./rainjsvm.md#lastState-property) | `BigNumber[]` | The result state of the executed Rainjs.<br></br>*Inherited from [RainJSVM.lastState](./rainjsvm.md#lastState-property)* |
|  [self](./rainjsvm.md#self-property) | `string` | The contract address of the instance of this class used for THIS\_ADDRESS opcode<br></br>*Inherited from [RainJSVM.self](./rainjsvm.md#self-property)* |
|  [signer](./rainjsvm.md#signer-property) | `Signer` | An ethers Signer.<br></br>*Inherited from [RainJSVM.signer](./rainjsvm.md#signer-property)* |
|  [stack](./rainjsvm.md#stack-property) | `(operand: number, data?: any) => void` | <br></br>*Inherited from [RainJSVM.stack](./rainjsvm.md#stack-property)* |
|  [storage](./rainjsvm.md#storage-property) | `(operand: number, data?: any) => Promise<void>` | <br></br>*Inherited from [RainJSVM.storage](./rainjsvm.md#storage-property)* |
|  [StorageOps](./rainjsvm.md#StorageOps-property) | [FnPtrsJSVM](../interfaces/fnptrsjsvm.md) | Object that contains the STORAGE opcode functions (i.e. local opcodes)<br></br>*Inherited from [RainJSVM.StorageOps](./rainjsvm.md#StorageOps-property)* |
|  [StorageRange](./combinetierjsvm.md#StorageRange-property) | `` | CombineTierJSVM valid storage range<br></br>*Overrides [RainJSVM.StorageRange](./rainjsvm.md#StorageRange-property)* |
|  [zipmap](./rainjsvm.md#zipmap-property) | `(operand: number, data?: any) => Promise<void>` | *Inherited from [RainJSVM.zipmap](./rainjsvm.md#zipmap-property)* |

## Methods

|  Method | Description |
|  --- | --- |
|  [connect(signer)](./rainjsvm.md#connect-method-1) | <br></br>*Inherited from [RainJSVM.connect()](./rainjsvm.md#connect-method-1)* |
|  [run(data, entrypoint)](./rainjsvm.md#run-method-1) | Method to execute the RainJSVM.<br></br>*Inherited from [RainJSVM.run()](./rainjsvm.md#run-method-1)* |
|  [setContract(contract)](./rainjsvm.md#setContract-method-1) | <br></br>*Inherited from [RainJSVM.setContract()](./rainjsvm.md#setContract-method-1)* |

## Property Details

<a id="ContextLength-property"></a>

### ContextLength

CombineTierJSVM can have any length for context

<b>Signature:</b>

```typescript
protected readonly ContextLength: number;
```

<a id="StorageRange-property"></a>

### StorageRange

CombineTierJSVM valid storage range

*Overrides [RainJSVM.StorageRange](./rainjsvm.md#StorageRange-property)*

<b>Signature:</b>

```typescript
protected readonly StorageRange = CombineTierStorage.length;
```
