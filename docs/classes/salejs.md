
# Class SaleJS

- The javascript version of SaleVM which inherits RainJS with local Sale opcodes.

<b>Signature:</b>

```typescript
class SaleJS extends RainJS 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [\_CONTEXT\_](./salejs.md#_CONTEXT_-property) | [ApplyOpFn](../interfaces/applyopfn.md) | key/value pair of CONTEXT opcodes of the sale JSVM the required value need to be passed to "run" method as the context array in "data" object. the reason is the CONTEXT opcode is contextual and is passed the VM at runtime.<br></br>*Overrides [RainJS.\_CONTEXT\_](./rainjs.md#_CONTEXT_-property)* |
|  [\_OPCODE\_](./rainjs.md#_OPCODE_-property) | [ApplyOpFn](../interfaces/applyopfn.md) | key/value pair of opcodes and their functions for all standard opcodes<br></br>*Inherited from [RainJS.\_OPCODE\_](./rainjs.md#_OPCODE_-property)* |
|  [\_STORAGE\_](./salejs.md#_STORAGE_-property) | [ApplyOpFn](../interfaces/applyopfn.md) | key/value pair of STORAGE opcodes of the sale JSVM<br></br>*Overrides [RainJS.\_STORAGE\_](./rainjs.md#_STORAGE_-property)* |
|  [contract](./rainjs.md#contract-property) | `Contract` | An ethers Contract<br></br>*Inherited from [RainJS.contract](./rainjs.md#contract-property)* |
|  [lastState](./rainjs.md#lastState-property) | `BigNumber[]` | The result state of the executed Rainjs.<br></br>*Inherited from [RainJS.lastState](./rainjs.md#lastState-property)* |
|  [provider](./rainjs.md#provider-property) | `Provider` | An ethers provider.<br></br>*Inherited from [RainJS.provider](./rainjs.md#provider-property)* |
|  [signer](./rainjs.md#signer-property) | `Signer` | An ethers Signer.<br></br>*Inherited from [RainJS.signer](./rainjs.md#signer-property)* |

## Methods

|  Method | Description |
|  --- | --- |
|  [run(data)](./rainjs.md#run-method-1) | Method to execute the RainJS.<br></br>*Inherited from [RainJS.run()](./rainjs.md#run-method-1)* |

## Property Details

<a id="_CONTEXT_-property"></a>

### \_CONTEXT\_

key/value pair of CONTEXT opcodes of the sale JSVM the required value need to be passed to "run" method as the context array in "data" object. the reason is the CONTEXT opcode is contextual and is passed the VM at runtime.

*Overrides [RainJS.\_CONTEXT\_](./rainjs.md#_CONTEXT_-property)*

<b>Signature:</b>

```typescript
protected _CONTEXT_: ApplyOpFn;
```

<a id="_STORAGE_-property"></a>

### \_STORAGE\_

key/value pair of STORAGE opcodes of the sale JSVM

*Overrides [RainJS.\_STORAGE\_](./rainjs.md#_STORAGE_-property)*

<b>Signature:</b>

```typescript
protected _STORAGE_: ApplyOpFn;
```
