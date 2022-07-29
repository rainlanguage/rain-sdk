
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
|  [addTogether(configs, stackReassignment)](./vm.md#addTogether-method-static-1) | Method to add multiple scripts together |
|  [and(configs, stackReassignment)](./vm.md#and-method-static-1) | Method to and multiple scripts together ie EVERY |
|  [beforeAfterBlock(blockNumber, type: "gt" \| "lt" \| "gte" \| "lte")](./vm.md#beforeAfterBlock-method-static-1) | Method to create a simple block number based rule |
|  [beforeAfterTime(timestamp, type: "gt" \| "lt" \| "gte" \| "lte")](./vm.md#beforeAfterTime-method-static-1) | Method to create a simple time based rule |
|  [combiner(config1, config2, options)](./vm.md#combiner-method-static-1) | Combines 2 individual VM scripts |
|  [constant(value)](./vm.md#constant-method-static-1) | Methdo to create a simple signle value script, ie CONTANT |
|  [createVMSources(OPerands)](./vm.md#createVMSources-method-static-1) | Create a VM sources to be ready to use in any call just providing the combination desired. |
|  [getAsset(type: "erc20-balance-of" \| "erc20-total-supply" \| "snapshot-balance-of" \| "snapshot-total-supply" \| "erc721-balance-of" \| "erc721-owner-of" \| "erc1155-balance-of" \| "erc1155-balance-of-batch", address, id)](./vm.md#getAsset-method-static-1) | A method to generate the StateConfig out of EVM assets' opcodes |
|  [gt(config1, config2, stackReassignment)](./vm.md#gt-method-static-1) | Method to check if a script is greater than another script or not. will return 1 if is true and 0 if it is not |
|  [gte(config1, config2, stackReassignment)](./vm.md#gte-method-static-1) | Method to check if a script is greater than or equal to another script or not. will return 1 if is true and 0 if it is not |
|  [hasAnyTier(tierConfig, stackReassignment)](./vm.md#hasAnyTier-method-static-1) | Method to check if an address has any tier status or not, i.e if is in tier contract or not |
|  [hasMinTier(tierConfig, tier, stackReassignment)](./vm.md#hasMinTier-method-static-1) | Method to check if an address has at least the "TIER" status |
|  [ifelse(condition, ifStatement, elseStatement, stackReassignment)](./vm.md#ifelse-method-static-1) | Method to create an if/else script |
|  [isEqual(config1, config2, stackReassignment)](./vm.md#isEqual-method-static-1) | Method to check if a script is equal to another script or not. will return 1 if is true and 0 if it is not |
|  [isZero(config)](./vm.md#isZero-method-static-1) | Method to check if a script is zero or not. will return 1 if is zero and 0 if it is not |
|  [lt(config1, config2, stackReassignment)](./vm.md#lt-method-static-1) | Method to check if a script is less than another script or not. will return 1 if is true and 0 if it is not |
|  [lte(config1, config2, stackReassignment)](./vm.md#lte-method-static-1) | Method to check if a script is less than or equal to another script or not. will return 1 if is true and 0 if it is not |
|  [max(configs, stackReassignment)](./vm.md#max-method-static-1) | Method to get maximum of multiple scripts |
|  [min(configs, stackReassignment)](./vm.md#min-method-static-1) | Method to get minimum of multiple scripts |
|  [multi(configs, stackReassignment)](./vm.md#multi-method-static-1) | A method to combine multiple StateConfigs together each on top of the other at the first item in final sources. |
|  [mulTogether(configs, stackReassignment)](./vm.md#mulTogether-method-static-1) | Method to multiply multiple scripts together |
|  [or(configs, stackReassignment)](./vm.md#or-method-static-1) | Method to or multiple scripts together ie ANY |
|  [pair(amountConfig, priceConfig, stackReassignment)](./vm.md#pair-method-static-1) | method to create paired(amount-price) StateConfig, which is used for sale, orderbook, etc |
|  [setDiscountForTiers(config, tierAddress, tierDiscount, options)](./vm.md#setDiscountForTiers-method-static-1) | Deducts percentage off of the result of a VM script based on a tier contract. |
|  [setMultiplierForTiers(config, tierAddress, tierMultiplier, options)](./vm.md#setMultiplierForTiers-method-static-1) | Multiply the result of a VM script based on a tier contract. |
|  [setOwnership(config, ownerAddress, options)](./vm.md#setOwnership-method-static-1) | Make an address the owner of a VM Script - checks the sender address against the owner address and if it passes the final result will be determined by the main VM script and if it fails it will be 0 by default. |
|  [setTimers(configs, times, inBlockNumber)](./vm.md#setTimers-method-static-1) | A method to merge multiple (more than 1) scripts to be executed based on time slices. |
|  [setValueForTiers(config, tierAddress, tierValues, ascending, options)](./vm.md#setValueForTiers-method-static-1) | Produce different values from the result of a VM script based on a tier contract. |
|  [stack(operand)](./vm.md#stack-method-static-1) | Method to create a simple STACK opcode script |

## Static Property Details

<a id="Opcodes-property-static"></a>

### Opcodes

All the standard Op Codes

<b>Signature:</b>

```typescript
static Opcodes: typeof AllStandardOps;
```

## Static Method Details

<a id="addTogether-method-static-1"></a>

### addTogether(configs, stackReassignment)

Method to add multiple scripts together

<b>Signature:</b>

```typescript
static addTogether(configs: StateConfig[], stackReassignment?: boolean): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  configs | `StateConfig[]` | an array of configs to add |
|  stackReassignment | `boolean` | (optional) pass false if STACK opcode operands dont need to be reassigned to their new relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine |

<b>Returns:</b>

`StateConfig`

a

<a id="and-method-static-1"></a>

### and(configs, stackReassignment)

Method to and multiple scripts together ie EVERY

<b>Signature:</b>

```typescript
static and(configs: StateConfig[], stackReassignment?: boolean): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  configs | `StateConfig[]` | an array of configs to and |
|  stackReassignment | `boolean` | (optional) pass false if STACK opcode operands dont need to be reassigned to their new relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine |

<b>Returns:</b>

`StateConfig`

a

<a id="beforeAfterBlock-method-static-1"></a>

### beforeAfterBlock(blockNumber, type: "gt" \| "lt" \| "gte" \| "lte")

Method to create a simple block number based rule

<b>Signature:</b>

```typescript
static beforeAfterBlock(blockNumber: number, type: "gt" | "lt" | "gte" | "lte"): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  blockNumber | `number` | the block number to set the rule for |
|  type | `"gt" \| "lt" \| "gte" \| "lte"` | type of the check, meaning current block number to be gt, gte, lt, lte than the "blockNumber" |

<b>Returns:</b>

`StateConfig`

A

<a id="beforeAfterTime-method-static-1"></a>

### beforeAfterTime(timestamp, type: "gt" \| "lt" \| "gte" \| "lte")

Method to create a simple time based rule

<b>Signature:</b>

```typescript
static beforeAfterTime(timestamp: number, type: "gt" | "lt" | "gte" | "lte"): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  timestamp | `number` | the timestamp to set the rule for |
|  type | `"gt" \| "lt" \| "gte" \| "lte"` | type of the check, meaning current timestamp to be gt, gte, lt, lte than the "timestamp" |

<b>Returns:</b>

`StateConfig`

A

<a id="combiner-method-static-1"></a>

### combiner(config1, config2, options)

Combines 2 individual VM scripts

- please be aware if your script has STACK opcode, as STACK is relative to script and cannot be handled by this method and needs to be dealt with manualy before calling this method.

<b>Signature:</b>

```typescript
static combiner(config1: StateConfig, config2: StateConfig, options?: {
        index?: number;
        numberOfSources?: number;
        position?: number[];
    }): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  config1 | [StateConfig](../interfaces/stateconfig.md) | the first VM script that will be combined. (default sits at top) |
|  config2 | [StateConfig](../interfaces/stateconfig.md) | the second VM script that will be combined. (default sits at bottom) |
|  options | <pre>{&#010;    index?: number;&#010;    numberOfSources?: number;&#010;    position?: number[];&#010;}</pre> | used for additional configuraions: - (param) index - to identify which sources item in config1.sources the combination starts at, if not specified, it will be 0. - (param) - numberOfSources - for specifying how many sources item to combine. - (param) position - An array representing the positions of config1 script where config2 sources will be merged at; position, array length must be equal to 'numberOfSources' or else it will be ignored. |

<b>Returns:</b>

`StateConfig`

combined VM script.

<a id="constant-method-static-1"></a>

### constant(value)

Methdo to create a simple signle value script, ie CONTANT

<b>Signature:</b>

```typescript
static constant(value: BigNumberish): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  value | `BigNumberish` | the value |

<b>Returns:</b>

`StateConfig`

a

<a id="createVMSources-method-static-1"></a>

### createVMSources(OPerands)

Create a VM sources to be ready to use in any call just providing the combination desired.

<b>Signature:</b>

```typescript
static createVMSources(OPerands: (OPerand | Uint8Array)[]): [Uint8Array];
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  OPerands | `(OPerand \| Uint8Array)[]` | All the configuration with the opcodes and operands. If any combination does not have an operand with an opcode, a 0 (zero) will be use with the opcode as the operand. Please |

<b>Returns:</b>

`[Uint8Array]`

A source

<a id="getAsset-method-static-1"></a>

### getAsset(type: "erc20-balance-of" \| "erc20-total-supply" \| "snapshot-balance-of" \| "snapshot-total-supply" \| "erc721-balance-of" \| "erc721-owner-of" \| "erc1155-balance-of" \| "erc1155-balance-of-batch", address, id)

A method to generate the StateConfig out of EVM assets' opcodes

<b>Signature:</b>

```typescript
static getAsset(type: "erc20-balance-of" | "erc20-total-supply" | "snapshot-balance-of" | "snapshot-total-supply" | "erc721-balance-of" | "erc721-owner-of" | "erc1155-balance-of" | "erc1155-balance-of-batch", address: string[], id?: BigNumber[]): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  type | `"erc20-balance-of" \| "erc20-total-supply" \| "snapshot-balance-of" \| "snapshot-total-supply" \| "erc721-balance-of" \| "erc721-owner-of" \| "erc1155-balance-of" \| "erc1155-balance-of-batch"` | the type of the asset script |
|  address | `string[]` | an array of address(es) of the asset(s) contract(s), only IERC20-Balance-of-Batch uses more than 1 address |
|  id | `BigNumber[]` | an array of id(s) of either tokenId(s) or snapshotId(s) , only IERC20-Balance-of-Batch uses more than 1 id |

<b>Returns:</b>

`StateConfig`

a VM script

<a id="gt-method-static-1"></a>

### gt(config1, config2, stackReassignment)

Method to check if a script is greater than another script or not. will return 1 if is true and 0 if it is not

<b>Signature:</b>

```typescript
static gt(config1: StateConfig, config2: StateConfig, stackReassignment?: boolean): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  config1 | [StateConfig](../interfaces/stateconfig.md) | first script |
|  config2 | [StateConfig](../interfaces/stateconfig.md) | second script |
|  stackReassignment | `boolean` | (optional) pass false if STACK opcode operands dont need to be reassigned to their new relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine |

<b>Returns:</b>

`StateConfig`

a

<a id="gte-method-static-1"></a>

### gte(config1, config2, stackReassignment)

Method to check if a script is greater than or equal to another script or not. will return 1 if is true and 0 if it is not

<b>Signature:</b>

```typescript
static gte(config1: StateConfig, config2: StateConfig, stackReassignment?: boolean): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  config1 | [StateConfig](../interfaces/stateconfig.md) | first script |
|  config2 | [StateConfig](../interfaces/stateconfig.md) | second script |
|  stackReassignment | `boolean` | (optional) pass false if STACK opcode operands dont need to be reassigned to their new relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine |

<b>Returns:</b>

`StateConfig`

a

<a id="hasAnyTier-method-static-1"></a>

### hasAnyTier(tierConfig, stackReassignment)

Method to check if an address has any tier status or not, i.e if is in tier contract or not

<b>Signature:</b>

```typescript
static hasAnyTier(tierConfig: StateConfig, stackReassignment?: boolean): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  tierConfig | [StateConfig](../interfaces/stateconfig.md) | the tier report config |
|  stackReassignment | `boolean` | (optional) pass false if STACK opcode operands dont need to be reassigned to their new relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine |

<b>Returns:</b>

`StateConfig`

a VM script

<a id="hasMinTier-method-static-1"></a>

### hasMinTier(tierConfig, tier, stackReassignment)

Method to check if an address has at least the "TIER" status

<b>Signature:</b>

```typescript
static hasMinTier(tierConfig: StateConfig, tier: Tier, stackReassignment?: boolean): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  tierConfig | [StateConfig](../interfaces/stateconfig.md) | the tier report config |
|  tier | [Tier](../enums/tier.md) | the minimum tier needed to be held |
|  stackReassignment | `boolean` | (optional) pass false if STACK opcode operands dont need to be reassigned to their new relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine |

<b>Returns:</b>

`StateConfig`

a VM script

<a id="ifelse-method-static-1"></a>

### ifelse(condition, ifStatement, elseStatement, stackReassignment)

Method to create an if/else script

<b>Signature:</b>

```typescript
static ifelse(condition: StateConfig, ifStatement: StateConfig, elseStatement: StateConfig, stackReassignment?: boolean): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  condition | [StateConfig](../interfaces/stateconfig.md) | the condition script ie the if check statement |
|  ifStatement | [StateConfig](../interfaces/stateconfig.md) | the script(statement) if the check passes |
|  elseStatement | [StateConfig](../interfaces/stateconfig.md) | the script(statement) if the check fails |
|  stackReassignment | `boolean` | (optional) pass false if STACK opcode operands dont need to be reassigned to their new relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine |

<b>Returns:</b>

`StateConfig`

a

<a id="isEqual-method-static-1"></a>

### isEqual(config1, config2, stackReassignment)

Method to check if a script is equal to another script or not. will return 1 if is true and 0 if it is not

<b>Signature:</b>

```typescript
static isEqual(config1: StateConfig, config2: StateConfig, stackReassignment?: boolean): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  config1 | [StateConfig](../interfaces/stateconfig.md) | first script |
|  config2 | [StateConfig](../interfaces/stateconfig.md) | second script |
|  stackReassignment | `boolean` | (optional) pass false if STACK opcode operands dont need to be reassigned to their new relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine |

<b>Returns:</b>

`StateConfig`

a

<a id="isZero-method-static-1"></a>

### isZero(config)

Method to check if a script is zero or not. will return 1 if is zero and 0 if it is not

<b>Signature:</b>

```typescript
static isZero(config: StateConfig): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  config | [StateConfig](../interfaces/stateconfig.md) | the script to check |

<b>Returns:</b>

`StateConfig`

a

<a id="lt-method-static-1"></a>

### lt(config1, config2, stackReassignment)

Method to check if a script is less than another script or not. will return 1 if is true and 0 if it is not

<b>Signature:</b>

```typescript
static lt(config1: StateConfig, config2: StateConfig, stackReassignment?: boolean): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  config1 | [StateConfig](../interfaces/stateconfig.md) | first script |
|  config2 | [StateConfig](../interfaces/stateconfig.md) | second script |
|  stackReassignment | `boolean` | (optional) pass false if STACK opcode operands dont need to be reassigned to their new relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine |

<b>Returns:</b>

`StateConfig`

a

<a id="lte-method-static-1"></a>

### lte(config1, config2, stackReassignment)

Method to check if a script is less than or equal to another script or not. will return 1 if is true and 0 if it is not

<b>Signature:</b>

```typescript
static lte(config1: StateConfig, config2: StateConfig, stackReassignment?: boolean): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  config1 | [StateConfig](../interfaces/stateconfig.md) | first script |
|  config2 | [StateConfig](../interfaces/stateconfig.md) | second script |
|  stackReassignment | `boolean` | (optional) pass false if STACK opcode operands dont need to be reassigned to their new relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine |

<b>Returns:</b>

`StateConfig`

a

<a id="max-method-static-1"></a>

### max(configs, stackReassignment)

Method to get maximum of multiple scripts

<b>Signature:</b>

```typescript
static max(configs: StateConfig[], stackReassignment?: boolean): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  configs | `StateConfig[]` | an array of configs to get maximum of |
|  stackReassignment | `boolean` | (optional) pass false if STACK opcode operands dont need to be reassigned to their new relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine |

<b>Returns:</b>

`StateConfig`

a

<a id="min-method-static-1"></a>

### min(configs, stackReassignment)

Method to get minimum of multiple scripts

<b>Signature:</b>

```typescript
static min(configs: StateConfig[], stackReassignment?: boolean): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  configs | `StateConfig[]` | an array of configs to get minimum of |
|  stackReassignment | `boolean` | (optional) pass false if STACK opcode operands dont need to be reassigned to their new relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine |

<b>Returns:</b>

`StateConfig`

a

<a id="multi-method-static-1"></a>

### multi(configs, stackReassignment)

A method to combine multiple StateConfigs together each on top of the other at the first item in final sources.

<b>Signature:</b>

```typescript
static multi(configs: StateConfig[], stackReassignment?: boolean): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  configs | `StateConfig[]` | An array of StateConfigs to combine together and its lengths should be more than 2 (can use VM.pair() method for combining 2 configs - |
|  stackReassignment | `boolean` | (optional) pass false if STACK opcode operands dont need to be reassigned to their new relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine |

<b>Returns:</b>

`StateConfig`

a

<a id="mulTogether-method-static-1"></a>

### mulTogether(configs, stackReassignment)

Method to multiply multiple scripts together

<b>Signature:</b>

```typescript
static mulTogether(configs: StateConfig[], stackReassignment?: boolean): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  configs | `StateConfig[]` | an array of configs to multiply |
|  stackReassignment | `boolean` | (optional) pass false if STACK opcode operands dont need to be reassigned to their new relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine |

<b>Returns:</b>

`StateConfig`

a

<a id="or-method-static-1"></a>

### or(configs, stackReassignment)

Method to or multiple scripts together ie ANY

<b>Signature:</b>

```typescript
static or(configs: StateConfig[], stackReassignment?: boolean): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  configs | `StateConfig[]` | an array of configs to or |
|  stackReassignment | `boolean` | (optional) pass false if STACK opcode operands dont need to be reassigned to their new relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine |

<b>Returns:</b>

`StateConfig`

a

<a id="pair-method-static-1"></a>

### pair(amountConfig, priceConfig, stackReassignment)

method to create paired(amount-price) StateConfig, which is used for sale, orderbook, etc

<b>Signature:</b>

```typescript
static pair(amountConfig: StateConfig, priceConfig: StateConfig, stackReassignment?: boolean): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  amountConfig | [StateConfig](../interfaces/stateconfig.md) | amount's StateConfig, the config sitting at top and returning the first value |
|  priceConfig | [StateConfig](../interfaces/stateconfig.md) | price's StateConfig, the config sitting at bottom and returning the second value |
|  stackReassignment | `boolean` | (optional) pass false if STACK opcode operands dont need to be reassigned to their new relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own script scope (other scripts that are being combined) this way the STACK opcode operand will stay untouched when scripts combine |

<b>Returns:</b>

`StateConfig`

a

<a id="setDiscountForTiers-method-static-1"></a>

### setDiscountForTiers(config, tierAddress, tierDiscount, options)

Deducts percentage off of the result of a VM script based on a tier contract.

<b>Signature:</b>

```typescript
static setDiscountForTiers(config: StateConfig, tierAddress: string, tierDiscount: number[], options?: {
        index?: number;
        tierActivation?: (string | number)[];
        tierContext?: BigNumber[];
    }): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  config | [StateConfig](../interfaces/stateconfig.md) | the main VM script |
|  tierAddress | `string` | the contract address of the tier contract. |
|  tierDiscount | `number[]` | an array of 8 items - the discount value (range 0 - 99) of each tier are the 8 items of the array. |
|  options | <pre>{&#010;    index?: number;&#010;    tierActivation?: (string \| number)[];&#010;    tierContext?: BigNumber[];&#010;}</pre> | used for additional configuraions: - (param) index to identify which sources item in config.sources the tierMultiplier applies to, if not specified, it will be 0. - (param) tierActivation An array of numbers, representing the amount of timestamps each tier must hold in order to get the discount, e.g. the first item in array is 100 mean tier 1 needs to be held at least 100 timestamps to get the discount.(used for stake tier contract) - (param) tierContext an array of values mostly used for stake tier contracts. |

<b>Returns:</b>

`StateConfig`

a VM script

<a id="setMultiplierForTiers-method-static-1"></a>

### setMultiplierForTiers(config, tierAddress, tierMultiplier, options)

Multiply the result of a VM script based on a tier contract.

<b>Signature:</b>

```typescript
static setMultiplierForTiers(config: StateConfig, tierAddress: string, tierMultiplier: number[], options?: {
        index?: number;
        tierActivation?: (string | number)[];
        tierContext?: BigNumber[];
    }): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  config | [StateConfig](../interfaces/stateconfig.md) | the main VM script |
|  tierAddress | `string` | the contract address of the tier contract. |
|  tierMultiplier | `number[]` | an array of 8 items - the multiplier value (2 decimals max) of each tier are the 8 items of the array. |
|  options | <pre>{&#010;    index?: number;&#010;    tierActivation?: (string \| number)[];&#010;    tierContext?: BigNumber[];&#010;}</pre> | used for additional configuraions: - (param) index to identify which sources item in config.sources the tierMultiplier applies to, if not specified, it will be 0. - (param) tierActivation An array of numbers, representing the amount of timestamps each tier must hold in order to get the multiplier, e.g. the first item in array is 100 mean tier 1 needs to be held at least 100 timestamps to get the multiplier.(used for stake tier contract) - (param) tierContext an array of values mostly used for stake tier contracts. |

<b>Returns:</b>

`StateConfig`

a VM script

<a id="setOwnership-method-static-1"></a>

### setOwnership(config, ownerAddress, options)

Make an address the owner of a VM Script - checks the sender address against the owner address and if it passes the final result will be determined by the main VM script and if it fails it will be 0 by default.

- please be aware if your script has DUP opcode, as DUP is relative to script and cannot be handled by this method and needs to be dealt with manualy before calling this method.

<b>Signature:</b>

```typescript
static setOwnership(config: StateConfig, ownerAddress: string, options?: {
        index?: number;
        position?: number[];
        notOwnerVar?: StateConfig | number;
    }): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  config | [StateConfig](../interfaces/stateconfig.md) | the main VM script |
|  ownerAddress | `string` | the address that is going to be the owner of the main VM script. |
|  options | <pre>{&#010;    index?: number;&#010;    position?: number[];&#010;    notOwnerVar?: StateConfig \| number;&#010;}</pre> | used for additional configuraions: - (param) index - to identify which sources item in config.sources the combination starts at, if not specified, it will be 0. - (param) position - An array representing the positions of config script where notOwnerVar sources (if exists) will be merged at; position, array length must be equal to 'numberOfSources' or else it will be ignored. - (param) notOwnerVar - the value or the script that will be executed if the owner check fails, if not specified 0 will be applied. |

<b>Returns:</b>

`StateConfig`

a VM script.

<a id="setTimers-method-static-1"></a>

### setTimers(configs, times, inBlockNumber)

A method to merge multiple (more than 1) scripts to be executed based on time slices.

<b>Signature:</b>

```typescript
static setTimers(configs: StateConfig[], times: number[], inBlockNumber?: boolean): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  configs | `StateConfig[]` | An array of StateConfigs that will be merged and executed at runtime in order by time slices |
|  times | `number[]` | An array of numbers representing either BLOCK\_NUMBER or TIMESTAMP that time slices will be between each of the 2 items in the array its length should be number of configs - 1. |
|  inBlockNumber | `boolean` | (optional) false by default which means the time slices will be based on TIMESTAMP, pass true to base it on BLOCK\_NUMBER |

<b>Returns:</b>

`StateConfig`

a VM script

<a id="setValueForTiers-method-static-1"></a>

### setValueForTiers(config, tierAddress, tierValues, ascending, options)

Produce different values from the result of a VM script based on a tier contract.

<b>Signature:</b>

```typescript
static setValueForTiers(config: StateConfig, tierAddress: string, tierValues: number[], ascending: boolean, options?: {
        index?: number;
        tierActivation?: (string | number)[];
        tierContext?: BigNumber[];
        finalDecimals?: number;
    }): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  config | [StateConfig](../interfaces/stateconfig.md) | the main VM script |
|  tierAddress | `string` | the contract address of the tier contract. |
|  tierValues | `number[]` | an array of 8 items - the value (6 decimals max) of each tier are the 8 items of the array. |
|  ascending | `boolean` | true if the tierValues (argument above) are ascending and false if descending from tier 1 to 8 |
|  options | <pre>{&#010;    index?: number;&#010;    tierActivation?: (string \| number)[];&#010;    tierContext?: BigNumber[];&#010;    finalDecimals?: number;&#010;}</pre> | used for additional configuraions: - (param) index to identify which sources item in config.sources the TierValues applies to, if not specified, it will be 0. - (param) tierActivation An array of numbers, representing the amount of timestamps each tier must hold in order to get the different value, e.g. the first item in array is 100 mean tier 1 needs to be held at least 100 timestamps to get the respective value. (used for stake tier contract) - (param) tierContext an array of values mostly used for stake tier contracts. - (param) finalDecimals produce the final values in this fixed decimals - 0 by deafult |

<b>Returns:</b>

`StateConfig`

a VM script

<a id="stack-method-static-1"></a>

### stack(operand)

Method to create a simple STACK opcode script

<b>Signature:</b>

```typescript
static stack(operand: number): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  operand | `number` | stack operand |

<b>Returns:</b>

`StateConfig`

a VM script

