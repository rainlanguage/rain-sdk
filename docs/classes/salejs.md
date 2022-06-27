
# Class SaleJS

- The javascript version of SaleVM which inherits RainJS with local Sale opcodes.

<b>Signature:</b>

```typescript
class SaleJS extends RainJS 
```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [Opcodes](./salejs.md#Opcodes-property-static) | `import("../contracts/sale").SaleOpcodes` | Local Sale's opcodes + AllstandardOps<br></br>*Overrides [RainJS.Opcodes](./rainjs.md#Opcodes-property-static)* |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [\_OPCODE\_](./salejs.md#_OPCODE_-property) | [ApplyOpFn](../interfaces/applyopfn.md) | key/value pair of opcodes and their functions for all standard opcodes + Sale local opcodes<br></br>*Overrides [RainJS.\_OPCODE\_](./rainjs.md#_OPCODE_-property)* |
|  [contract](./rainjs.md#contract-property) | `string` | An ethers Contract address<br></br>*Inherited from [RainJS.contract](./rainjs.md#contract-property)* |
|  [lastState](./rainjs.md#lastState-property) | `BigNumber[]` | The result state of the executed Rainjs.<br></br>*Inherited from [RainJS.lastState](./rainjs.md#lastState-property)* |
|  [provider](./rainjs.md#provider-property) | `Provider` | An ethers provider.<br></br>*Inherited from [RainJS.provider](./rainjs.md#provider-property)* |
|  [signer](./rainjs.md#signer-property) | `Signer` | An ethers Signer.<br></br>*Inherited from [RainJS.signer](./rainjs.md#signer-property)* |

## Methods

|  Method | Description |
|  --- | --- |
|  [run(data)](./rainjs.md#run-method-1) | Method to execute the RainJS.<br></br>*Inherited from [RainJS.run()](./rainjs.md#run-method-1)* |

## Static Property Details

<a id="Opcodes-property-static"></a>

### Opcodes

Local Sale's opcodes + AllstandardOps

*Overrides [RainJS.Opcodes](./rainjs.md#Opcodes-property-static)*

<b>Signature:</b>

```typescript
static Opcodes: import("../contracts/sale").SaleOpcodes;
```

## Property Details

<a id="_OPCODE_-property"></a>

### \_OPCODE\_

key/value pair of opcodes and their functions for all standard opcodes + Sale local opcodes

*Overrides [RainJS.\_OPCODE\_](./rainjs.md#_OPCODE_-property)*

<b>Signature:</b>

```typescript
protected readonly _OPCODE_: ApplyOpFn;
```
