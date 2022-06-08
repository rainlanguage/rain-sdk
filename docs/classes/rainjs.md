
# Class RainJS

- The javascript version of the RainVM, basically does the same job RainVM does but off-chain.

<b>Signature:</b>

```typescript
class RainJS 
```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [Opcodes](./rainjs.md#Opcodes-property-static) | `typeof import("../classes/vm").AllStandardOps` | All of RainVM standard opcodes, i.e. AllStandardOps |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [contract](./rainjs.md#contract-property) | `Contract` | A ethers Contract |
|  [lastState](./rainjs.md#lastState-property) | `BigNumber[]` | The result state of the executed Rainjs. |
|  [provider](./rainjs.md#provider-property) | `Provider` | A ethers provider. |
|  [signer](./rainjs.md#signer-property) | `Signer` | An ethers Signer. |
|  [state](./rainjs.md#state-property) | [StateJS](../interfaces/statejs.md) | The property of type StateJS which that RainJS will run based on. |

## Methods

|  Method | Description |
|  --- | --- |
|  [dispatch(state, opcode, operand, data)](./rainjs.md#dispatch-method-1) | It is a protected method used by eval to run the correct function for each opcode in the script. For each opcode please |
|  [eval(data, index)](./rainjs.md#eval-method-1) | The main workhorse of RainJS, basically the javascript version of 'eval' method in RainVM.sol. It executes the RainVM script based on each Opcode or the custom opcodes i.e. applyOpFn that has been passed at the time of cinstruction of a RainJS object. |
|  [run(data)](./rainjs.md#run-method-1) | Method to execute the RainJS. |

## Static Property Details

<a id="Opcodes-property-static"></a>

### Opcodes

All of RainVM standard opcodes, i.e. AllStandardOps

<b>Signature:</b>

```typescript
static Opcodes: typeof import("../classes/vm").AllStandardOps;
```

## Property Details

<a id="contract-property"></a>

### contract

A ethers Contract

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

A ethers provider.

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

<a id="state-property"></a>

### state

The property of type StateJS which that RainJS will run based on.

<b>Signature:</b>

```typescript
protected readonly state: StateJS;
```

## Method Details

<a id="dispatch-method-1"></a>

### dispatch(state, opcode, operand, data)

It is a protected method used by eval to run the correct function for each opcode in the script. For each opcode please

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
|  data | `any` | (optional) used only for zipmap opcode in order to be able to run custom function i.e. applyOpFn for zipmap function source. |

<b>Returns:</b>

`Promise<void>`

<a id="eval-method-1"></a>

### eval(data, index)

The main workhorse of RainJS, basically the javascript version of 'eval' method in RainVM.sol. It executes the RainVM script based on each Opcode or the custom opcodes i.e. applyOpFn that has been passed at the time of cinstruction of a RainJS object.

<b>Signature:</b>

```typescript
protected eval(data?: any, index?: number): Promise<void>;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  data | `any` | (optional) An object which is used to provide additional values for "applyOpFn" if there are custom opcodes passed at the time of construction ot to pass in some user input value to the script. |
|  index | `number` | used internally for indicating which item in state sources array to execute for zipmap function. |

<b>Returns:</b>

`Promise<void>`

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

