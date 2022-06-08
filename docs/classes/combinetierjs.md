
# Class CombineTierJS

- The javascript version of CombineTierVM which inherits RainJS with local CombineTier opcodes.

<b>Signature:</b>

```typescript
class CombineTierJS extends RainJS 
```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [Opcodes](./combinetierjs.md#Opcodes-property-static) | `import("../contracts/tiers/combineTier").CombineTierOpcodes` | Local CombineTier Opcodes + AllstandardOps<br></br>*Overrides [RainJS.Opcodes](./rainjs.md#Opcodes-property-static)* |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [contract](./rainjs.md#contract-property) | `Contract` | A ethers Contract<br></br>*Inherited from [RainJS.contract](./rainjs.md#contract-property)* |
|  [lastState](./rainjs.md#lastState-property) | `BigNumber[]` | The result state of the executed Rainjs.<br></br>*Inherited from [RainJS.lastState](./rainjs.md#lastState-property)* |
|  [provider](./rainjs.md#provider-property) | `Provider` | A ethers provider.<br></br>*Inherited from [RainJS.provider](./rainjs.md#provider-property)* |
|  [signer](./rainjs.md#signer-property) | `Signer` | An ethers Signer.<br></br>*Inherited from [RainJS.signer](./rainjs.md#signer-property)* |
|  [state](./rainjs.md#state-property) | [StateJS](../interfaces/statejs.md) | The property of type StateJS which that RainJS will run based on.<br></br>*Inherited from [RainJS.state](./rainjs.md#state-property)* |

## Methods

|  Method | Description |
|  --- | --- |
|  [dispatch(state, opcode, operand, data)](./combinetierjs.md#dispatch-method-1) | dispatch method with Sale's local opcodes<br></br>*Overrides [RainJS.dispatch()](./rainjs.md#dispatch-method-1)* |
|  [eval(data, index)](./rainjs.md#eval-method-1) | The main workhorse of RainJS, basically the javascript version of 'eval' method in RainVM.sol. It executes the RainVM script based on each Opcode or the custom opcodes i.e. applyOpFn that has been passed at the time of cinstruction of a RainJS object.<br></br>*Inherited from [RainJS.eval()](./rainjs.md#eval-method-1)* |
|  [run(data)](./rainjs.md#run-method-1) | Method to execute the RainJS.<br></br>*Inherited from [RainJS.run()](./rainjs.md#run-method-1)* |

## Static Property Details

<a id="Opcodes-property-static"></a>

### Opcodes

Local CombineTier Opcodes + AllstandardOps

*Overrides [RainJS.Opcodes](./rainjs.md#Opcodes-property-static)*

<b>Signature:</b>

```typescript
static Opcodes: import("../contracts/tiers/combineTier").CombineTierOpcodes;
```

## Method Details

<a id="dispatch-method-1"></a>

### dispatch(state, opcode, operand, data)

dispatch method with Sale's local opcodes

*Overrides [RainJS.dispatch()](./rainjs.md#dispatch-method-1)*

<b>Signature:</b>

```typescript
protected dispatch(state: StateJS, opcode: number, operand: number, data?: any): Promise<void>;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  state | [StateJS](../interfaces/statejs.md) | StateJS property used in each opcode function to either read or write data into stack. |
|  opcode | `number` | the opcode to dispatch and run the function of that opcode |
|  operand | `number` | the addtional info for each opcode to run based on. |
|  data | `any` | (optional) used only for zipmap opcode in order to be able to run custom function i.e. applyOpFn for zipmap function source or for ACCOUNT opcode. data needs to have "claimant\_account" property so this local opcode to function properly. |

<b>Returns:</b>

`Promise<void>`

