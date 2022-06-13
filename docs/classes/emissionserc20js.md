
# Class EmissionsERC20JS

- The javascript version of EmissionsERC20JS which inherits RainJS with local EmissionsERC20JS opcodes.

<b>Signature:</b>

```typescript
class EmissionsERC20JS extends RainJS 
```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [Opcodes](./emissionserc20js.md#Opcodes-property-static) | `import("../contracts/emissionsERC20").EmissionsERC20Opcodes` | Local EmissionsERC20 Opcodes + AllstandardOps<br></br>*Overrides [RainJS.Opcodes](./rainjs.md#Opcodes-property-static)* |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [\_OPCODE\_](./emissionserc20js.md#_OPCODE_-property) | [ApplyOpFn](../interfaces/applyopfn.md) | key/value pair of opcodes and their functions for all standard opcodes + EmissionsERC20 local opcodes<br></br>*Overrides [RainJS.\_OPCODE\_](./rainjs.md#_OPCODE_-property)* |
|  [contract](./rainjs.md#contract-property) | `Contract` | An ethers Contract<br></br>*Inherited from [RainJS.contract](./rainjs.md#contract-property)* |
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

Local EmissionsERC20 Opcodes + AllstandardOps

*Overrides [RainJS.Opcodes](./rainjs.md#Opcodes-property-static)*

<b>Signature:</b>

```typescript
static Opcodes: import("../contracts/emissionsERC20").EmissionsERC20Opcodes;
```

## Property Details

<a id="_OPCODE_-property"></a>

### \_OPCODE\_

key/value pair of opcodes and their functions for all standard opcodes + EmissionsERC20 local opcodes

*Overrides [RainJS.\_OPCODE\_](./rainjs.md#_OPCODE_-property)*

<b>Signature:</b>

```typescript
protected readonly _OPCODE_: ApplyOpFn;
```
