
# Class EmissionsERC20JS

- The javascript version of EmissionsERC20JS which inherits RainJS with local EmissionsERC20JS opcodes.

<b>Signature:</b>

```typescript
class EmissionsERC20JS extends RainJS 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [\_CONTEXT\_](./emissionserc20js.md#_CONTEXT_-property) | [ApplyOpFn](../interfaces/applyopfn.md) | key/value pair of CONTEXT opcodes of the CombineTier JSVM the required value need to be passed to "run" method as the context array in "data" object. the reason is the CONTEXT opcode is contextual and is passed the VM at runtime.<br></br>*Overrides [RainJS.\_CONTEXT\_](./rainjs.md#_CONTEXT_-property)* |
|  [\_OPCODE\_](./rainjs.md#_OPCODE_-property) | [ApplyOpFn](../interfaces/applyopfn.md) | key/value pair of opcodes and their functions for all standard opcodes<br></br>*Inherited from [RainJS.\_OPCODE\_](./rainjs.md#_OPCODE_-property)* |
|  [\_STORAGE\_](./emissionserc20js.md#_STORAGE_-property) | [ApplyOpFn](../interfaces/applyopfn.md) | key/value pair of STORAGE opcodes of the EmissionsERC20 JSVM (empty with no functions)<br></br>*Overrides [RainJS.\_STORAGE\_](./rainjs.md#_STORAGE_-property)* |
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

key/value pair of CONTEXT opcodes of the CombineTier JSVM the required value need to be passed to "run" method as the context array in "data" object. the reason is the CONTEXT opcode is contextual and is passed the VM at runtime.

*Overrides [RainJS.\_CONTEXT\_](./rainjs.md#_CONTEXT_-property)*

<b>Signature:</b>

```typescript
protected _CONTEXT_: ApplyOpFn;
```

<a id="_STORAGE_-property"></a>

### \_STORAGE\_

key/value pair of STORAGE opcodes of the EmissionsERC20 JSVM (empty with no functions)

*Overrides [RainJS.\_STORAGE\_](./rainjs.md#_STORAGE_-property)*

EmissionsERC20 doesnt have any STORAGE opcode by default and in its contract level, however in JSVM there is the ability to pass in custom opcode functions to it

<b>Signature:</b>

```typescript
protected _STORAGE_: ApplyOpFn;
```
