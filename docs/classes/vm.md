
# Class VM

//TODO: Add doc

<b>Signature:</b>

```typescript
class VM 
```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [Opcodes](./vm.md#Opcodes-property-static) | `typeof AllStandardOps` | All the standard Op Codes |

## Static Methods

|  Method | Description |
|  --- | --- |
|  [createVMSources(OPerands)](./vm.md#createVMSources-method-static-1) | Create a VM sources to be ready to use in any call just providing the combination desired. |
|  [makeOwner(config, ownerAddress, options)](./vm.md#makeOwner-method-static-1) | Make an address the owner of a VM Script - checks the sender address against the owner address and if it passes the final result will be determined by the main VM script and if it fails it will be 0 by default. |
|  [tierBasedDiscounter(config, tierAddress, tierDiscount, options)](./vm.md#tierBasedDiscounter-method-static-1) | Deducts percentage off of the result of a VM script based on the holding tier of a tier contract. |
|  [tierBasedMultiplier(config, tierAddress, tierMultiplier, options)](./vm.md#tierBasedMultiplier-method-static-1) | Multiply the result of a VM script based on the holding tier of a tier contract. |
|  [vmStateCombiner(config1, config2, options)](./vm.md#vmStateCombiner-method-static-1) | Combines 2 individual VM scripts |

## Static Property Details

<a id="Opcodes-property-static"></a>

### Opcodes

All the standard Op Codes

<b>Signature:</b>

```typescript
static Opcodes: typeof AllStandardOps;
```

## Static Method Details

<a id="createVMSources-method-static-1"></a>

### createVMSources(OPerands)

Create a VM sources to be ready to use in any call just providing the combination desired.

<b>Signature:</b>

```typescript
static createVMSources(OPerands: OPerand[]): [Uint8Array];
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  OPerands | `OPerand[]` | All the configuration with the opcodes and operands. If any combination does not have an operand with an opcode, a 0 (zero) will be use with the opcode as the operand. Please |

<b>Returns:</b>

`[Uint8Array]`

A source

<a id="makeOwner-method-static-1"></a>

### makeOwner(config, ownerAddress, options)

Make an address the owner of a VM Script - checks the sender address against the owner address and if it passes the final result will be determined by the main VM script and if it fails it will be 0 by default.

<b>Signature:</b>

```typescript
static makeOwner(config: StateConfig, ownerAddress: string, options?: CallOptions): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  config | [StateConfig](../interfaces/stateconfig.md) | the main VM script |
|  ownerAddress | `string` | the address that is going to be the owner of the main VM script. |
|  options | [CallOptions](../types/calloptions.md) | Values availables: index and notOwnerVar. |

<b>Returns:</b>

`StateConfig`

a VM script.

<a id="tierBasedDiscounter-method-static-1"></a>

### tierBasedDiscounter(config, tierAddress, tierDiscount, options)

Deducts percentage off of the result of a VM script based on the holding tier of a tier contract.

<b>Signature:</b>

```typescript
static tierBasedDiscounter(config: StateConfig, tierAddress: string, tierDiscount: number[], options?: CallOptions): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  config | [StateConfig](../interfaces/stateconfig.md) | the main VM script |
|  tierAddress | `string` | the contract address of the tier contract. |
|  tierDiscount | `number[]` | an array of 8 items - the discount value (range 0 - 99) of each tier are the 8 items of the array. |
|  options | [CallOptions](../types/calloptions.md) | Values availables: index and tierActivation. |

<b>Returns:</b>

`StateConfig`

a VM script

<a id="tierBasedMultiplier-method-static-1"></a>

### tierBasedMultiplier(config, tierAddress, tierMultiplier, options)

Multiply the result of a VM script based on the holding tier of a tier contract.

<b>Signature:</b>

```typescript
static tierBasedMultiplier(config: StateConfig, tierAddress: string, tierMultiplier: number[], options?: CallOptions): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  config | [StateConfig](../interfaces/stateconfig.md) | the main VM script |
|  tierAddress | `string` | the contract address of the tier contract. |
|  tierMultiplier | `number[]` | an array of 8 items - the multiplier value (2 decimals max) of each tier are the 8 items of the array. |
|  options | [CallOptions](../types/calloptions.md) | Values availables: index and tierActivation. |

<b>Returns:</b>

`StateConfig`

a VM script

<a id="vmStateCombiner-method-static-1"></a>

### vmStateCombiner(config1, config2, options)

Combines 2 individual VM scripts

<b>Signature:</b>

```typescript
static vmStateCombiner(config1: StateConfig, config2: StateConfig, options?: CallOptions): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  config1 | [StateConfig](../interfaces/stateconfig.md) | the first VM script that will be combined. (default sits at top) |
|  config2 | [StateConfig](../interfaces/stateconfig.md) | the second VM script that will be combined. (default sits at bottom) |
|  options | [CallOptions](../types/calloptions.md) | Values availables: index, position and numberOfSources. |

<b>Returns:</b>

`StateConfig`

combined VM script.

