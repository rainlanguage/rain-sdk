
# Class VM

Class related to hold the some of the common patterns around the Rain VM that are required to interact with it.

The class is intented to contain general methods that can be used in a lot of scenarios and ways.

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
|  [betweenBlocks(startBlock, endBlock)](./vm.md#betweenBlocks-method-static-1) | Method to make a StateConfig that checks if the current block is between 2 provided block numbers. i.e. if the current block is between those 2 block numbers, the result will be 1(true) and if not the result will be 0(false) |
|  [betweenTimes(startTimestamp, endTimestamp)](./vm.md#betweenTimes-method-static-1) | Method to make a StateConfig that checks if the current time is between 2 provided times. i.e. if the current time is between those 2 times, the result will be 1(true) and if not the result will be 0(false) |
|  [combiner(config1, config2, options)](./vm.md#combiner-method-static-1) | Combines 2 individual VM scripts |
|  [constant(value)](./vm.md#constant-method-static-1) | Methdo to create a simple signle value script, ie CONTANT |
|  [createVMSources(OPerands)](./vm.md#createVMSources-method-static-1) | Create a VM sources to be ready to use in any call just providing the combination desired. |
|  [dec(startValue, endValue, startPoint, endPoint, byBlock)](./vm.md#dec-method-static-1) | Create a new raw linear decreasing value StateConfig. |
|  [decBy(startValue, startPoint, margin, periodLength, endValue, byBlock)](./vm.md#decBy-method-static-1) | Create a new raw linear decreasing value StateConfig decreasing by a margin over each period. |
|  [eq(config1, config2, stackReassignment)](./vm.md#eq-method-static-1) | Method to check if a script is equal to another script or not. will return 1 if is true and 0 if it is not |
|  [getAsset(type: "erc20-balance-of" \| "erc20-total-supply" \| "erc721-balance-of" \| "erc721-owner-of" \| "erc1155-balance-of" \| "erc1155-balance-of-batch", address, id, delegatedCall)](./vm.md#getAsset-method-static-1) | A method to generate the StateConfig out of EVM assets' opcodes |
|  [gt(config1, config2, stackReassignment)](./vm.md#gt-method-static-1) | Method to check if a script is greater than another script or not. will return 1 if is true and 0 if it is not |
|  [gte(config1, config2, stackReassignment)](./vm.md#gte-method-static-1) | Method to check if a script is greater than or equal to another script or not. will return 1 if is true and 0 if it is not |
|  [hasAnyTier(tierConfig, stackReassignment)](./vm.md#hasAnyTier-method-static-1) | Method to check if an address has any tier status or not, i.e if is in tier contract or not |
|  [hasMinTier(tierConfig, tier, stackReassignment)](./vm.md#hasMinTier-method-static-1) | Method to check if an address has at least the "TIER" status |
|  [ifelse(condition, ifStatement, elseStatement, stackReassignment)](./vm.md#ifelse-method-static-1) | Method to create an if/else script |
|  [inc(startValue, endValue, startPoint, endPoint, byBlock)](./vm.md#inc-method-static-1) | Create a new raw linear increasing value StateConfig. |
|  [incBy(startValue, startPoint, margin, periodLength, endValue, byBlock)](./vm.md#incBy-method-static-1) | Create a new raw linear increasing value StateConfig increasing by a margin over each period. |
|  [lt(config1, config2, stackReassignment)](./vm.md#lt-method-static-1) | Method to check if a script is less than another script or not. will return 1 if is true and 0 if it is not |
|  [lte(config1, config2, stackReassignment)](./vm.md#lte-method-static-1) | Method to check if a script is less than or equal to another script or not. will return 1 if is true and 0 if it is not |
|  [max(configs, stackReassignment)](./vm.md#max-method-static-1) | Method to get maximum of multiple scripts |
|  [min(configs, stackReassignment)](./vm.md#min-method-static-1) | Method to get minimum of multiple scripts |
|  [multi(configs, stackReassignment)](./vm.md#multi-method-static-1) | A method to combine multiple StateConfigs together each on top of the other at the first item in final sources. |
|  [mulTogether(configs, stackReassignment)](./vm.md#mulTogether-method-static-1) | Method to multiply multiple scripts together |
|  [nand(configs, stackReassignment)](./vm.md#nand-method-static-1) | Method to nand multiple scripts together |
|  [nor(configs, stackReassignment)](./vm.md#nor-method-static-1) | Method to nor multiple scripts together |
|  [not(config)](./vm.md#not-method-static-1) | Method to check if a script is zero or not. will return 1 if is zero and 0 if it is not |
|  [or(configs, stackReassignment)](./vm.md#or-method-static-1) | Method to or multiple scripts together ie ANY |
|  [pair(amountConfig, priceConfig, stackReassignment)](./vm.md#pair-method-static-1) | method to create paired(amount-price) StateConfig, which is used for sale, orderbook, etc |
|  [setDisccount(config, condition, discount)](./vm.md#setDisccount-method-static-1) | Method to apply discount on a StateConfig based on a condition passing |
|  [setDiscountForTiers(config, tierAddress, tierDiscount, options)](./vm.md#setDiscountForTiers-method-static-1) | Deducts percentage off of the result of a VM script based on the holding tier of a tier contract. |
|  [setMultiplier(config, condition, multiplier)](./vm.md#setMultiplier-method-static-1) | Method to apply multiplier to a StateConfig based on a condition passing |
|  [setMultiplierForTiers(config, tierAddress, tierMultiplier, options)](./vm.md#setMultiplierForTiers-method-static-1) | Multiply the result of a VM script based on the holding tier of a tier contract. |
|  [setOwnership(config, ownerAddress, options)](./vm.md#setOwnership-method-static-1) | Make an address the owner of a VM Script - checks the sender address against the owner address and if it passes the final result will be determined by the main VM script and if it fails it will be 0 by default. |
|  [setTimer(configs, times, inBlockNumber)](./vm.md#setTimer-method-static-1) | A method to merge multiple (more than 1) scripts to be executed based on time slices. |
|  [stack(operand)](./vm.md#stack-method-static-1) | Method to create a simple STACK opcode script |
|  [xnor(configs, stackReassignment)](./vm.md#xnor-method-static-1) | Method to xnor multiple scripts together |
|  [xor(configs, stackReassignment)](./vm.md#xor-method-static-1) | Method to xor multiple scripts together |

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

a StateConfig

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

a StateConfig in VM boolean format (true non-zero, false zero)

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

A StateConfig

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

A StateConfig

<a id="betweenBlocks-method-static-1"></a>

### betweenBlocks(startBlock, endBlock)

Method to make a StateConfig that checks if the current block is between 2 provided block numbers. i.e. if the current block is between those 2 block numbers, the result will be 1(true) and if not the result will be 0(false)

<b>Signature:</b>

```typescript
static betweenBlocks(startBlock: number, endBlock: number): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  startBlock | `number` | The start block number |
|  endBlock | `number` | The end block number |

<b>Returns:</b>

`StateConfig`

A StateConfig

<a id="betweenTimes-method-static-1"></a>

### betweenTimes(startTimestamp, endTimestamp)

Method to make a StateConfig that checks if the current time is between 2 provided times. i.e. if the current time is between those 2 times, the result will be 1(true) and if not the result will be 0(false)

<b>Signature:</b>

```typescript
static betweenTimes(startTimestamp: number, endTimestamp: number): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  startTimestamp | `number` | The start timestamp |
|  endTimestamp | `number` | The end timestamp |

<b>Returns:</b>

`StateConfig`

A StateConfig

<a id="combiner-method-static-1"></a>

### combiner(config1, config2, options)

Combines 2 individual VM scripts

- please be aware if your script has DUP opcode, as DUP is relative to script and cannot be handled by this method and needs to be dealt with manualy before calling this method.

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
|  options | <pre>{&#010;    index?: number;&#010;    numberOfSources?: number;&#010;    position?: number[];&#010;}</pre> | used for additional configuraions: - (param) index - to identify which sources item in config1.sources the combination starts at, if not specified, it will be 0. - (param) numberOfSource - for specifying how many sources item to combine. - (param) position - An array representing the positions of config1 script where config2 sources will be merged at; position, array length must be equal to 'numberOfSources' or else it will be ignored. |

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

a StateConfig

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

<a id="dec-method-static-1"></a>

### dec(startValue, endValue, startPoint, endPoint, byBlock)

Create a new raw linear decreasing value StateConfig.

<b>Signature:</b>

```typescript
static dec(startValue: BigNumber, endValue: BigNumber, startPoint: number, endPoint: number, byBlock?: boolean): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  startValue | `BigNumber` | The starting value |
|  endValue | `BigNumber` | The ending value |
|  startPoint | `number` | Starting point, either timestamp or block number |
|  endPoint | `number` | Ending point, either timestamp or block number |
|  byBlock | `boolean` | Whether increasing by block or timestamp, pass true to be based on block |

<b>Returns:</b>

`StateConfig`

a StateConfig

<a id="decBy-method-static-1"></a>

### decBy(startValue, startPoint, margin, periodLength, endValue, byBlock)

Create a new raw linear decreasing value StateConfig decreasing by a margin over each period.

<b>Signature:</b>

```typescript
static decBy(startValue: BigNumber, startPoint: number, margin: BigNumber, periodLength: number, endValue?: number, byBlock?: boolean): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  startValue | `BigNumber` | The starting value |
|  startPoint | `number` | Starting point, either timestamp or block number |
|  margin | `BigNumber` | The amount to decrease by each period passing |
|  periodLength | `number` | The length of each period |
|  endValue | `number` | Ending point, either timestamp or block number |
|  byBlock | `boolean` | Whether decreasing by block or timestamp, pass true to be based on block |

<b>Returns:</b>

`StateConfig`

a StateConfig

<a id="eq-method-static-1"></a>

### eq(config1, config2, stackReassignment)

Method to check if a script is equal to another script or not. will return 1 if is true and 0 if it is not

<b>Signature:</b>

```typescript
static eq(config1: StateConfig, config2: StateConfig, stackReassignment?: boolean): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  config1 | [StateConfig](../interfaces/stateconfig.md) | first script |
|  config2 | [StateConfig](../interfaces/stateconfig.md) | second script |
|  stackReassignment | `boolean` | (optional) pass false if STACK opcode operands dont need to be reassigned to their new relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine |

<b>Returns:</b>

`StateConfig`

a StateConfig in VM boolean format (true non-zero, false zero)

<a id="getAsset-method-static-1"></a>

### getAsset(type: "erc20-balance-of" \| "erc20-total-supply" \| "erc721-balance-of" \| "erc721-owner-of" \| "erc1155-balance-of" \| "erc1155-balance-of-batch", address, id, delegatedCall)

A method to generate the StateConfig out of EVM assets' opcodes

<b>Signature:</b>

```typescript
static getAsset(type: "erc20-balance-of" | "erc20-total-supply" | "erc721-balance-of" | "erc721-owner-of" | "erc1155-balance-of" | "erc1155-balance-of-batch", address: string[], id?: BigNumber[], delegatedCall?: boolean): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  type | `"erc20-balance-of" \| "erc20-total-supply" \| "erc721-balance-of" \| "erc721-owner-of" \| "erc1155-balance-of" \| "erc1155-balance-of-batch"` | the type of the asset script |
|  address | `string[]` | an array of address(es) of the asset(s) contract(s), only IERC20-Balance-of-Batch uses more than 1 address |
|  id | `BigNumber[]` | an array of id(s) of either tokenId(s) or snapshotId(s) , only IERC20-Balance-of-Batch uses more than 1 id |
|  delegatedCall | `boolean` | (optional) if true CONTEXT opcode will be used and if false SENDER opcode will be used |

<b>Returns:</b>

`StateConfig`

a StateConfig

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

a StateConfig in VM boolean format (true non-zero, false zero)

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

a StateConfig in VM boolean format (true non-zero, false zero)

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

a StateConfig

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

a StateConfig

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

a StateConfig

<a id="inc-method-static-1"></a>

### inc(startValue, endValue, startPoint, endPoint, byBlock)

Create a new raw linear increasing value StateConfig.

<b>Signature:</b>

```typescript
static inc(startValue: BigNumber, endValue: BigNumber, startPoint: number, endPoint: number, byBlock?: boolean): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  startValue | `BigNumber` | The starting value |
|  endValue | `BigNumber` | The ending value |
|  startPoint | `number` | Starting point, either timestamp or block number |
|  endPoint | `number` | Ending point, either timestamp or block number |
|  byBlock | `boolean` | Whether increasing by block or timestamp, pass true to be based on block |

<b>Returns:</b>

`StateConfig`

a StateConfig

<a id="incBy-method-static-1"></a>

### incBy(startValue, startPoint, margin, periodLength, endValue, byBlock)

Create a new raw linear increasing value StateConfig increasing by a margin over each period.

<b>Signature:</b>

```typescript
static incBy(startValue: BigNumber, startPoint: number, margin: BigNumber, periodLength: number, endValue?: number, byBlock?: boolean): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  startValue | `BigNumber` | The starting value |
|  startPoint | `number` | Starting point, either timestamp or block number |
|  margin | `BigNumber` | The amount to increase by each period passing |
|  periodLength | `number` | The length of each period |
|  endValue | `number` | Ending point, either timestamp or block number |
|  byBlock | `boolean` | Whether increasing by block or timestamp, pass true to be based on block |

<b>Returns:</b>

`StateConfig`

a StateConfig

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

a StateConfig in VM boolean format (true non-zero, false zero)

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

a StateConfig in VM boolean format (true non-zero, false zero)

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

a StateConfig

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

a StateConfig

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

a StateConfig

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

a StateConfig

<a id="nand-method-static-1"></a>

### nand(configs, stackReassignment)

Method to nand multiple scripts together

<b>Signature:</b>

```typescript
static nand(configs: StateConfig[], stackReassignment?: boolean): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  configs | `StateConfig[]` | an array of configs to nand |
|  stackReassignment | `boolean` | (optional) pass false if STACK opcode operands dont need to be reassigned to their new relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine |

<b>Returns:</b>

`StateConfig`

a StateConfig in VM boolean format (true non-zero, false zero)

<a id="nor-method-static-1"></a>

### nor(configs, stackReassignment)

Method to nor multiple scripts together

<b>Signature:</b>

```typescript
static nor(configs: StateConfig[], stackReassignment?: boolean): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  configs | `StateConfig[]` | an array of configs to nor |
|  stackReassignment | `boolean` | (optional) pass false if STACK opcode operands dont need to be reassigned to their new relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine |

<b>Returns:</b>

`StateConfig`

a StateConfig in VM boolean format (true non-zero, false zero)

<a id="not-method-static-1"></a>

### not(config)

Method to check if a script is zero or not. will return 1 if is zero and 0 if it is not

<b>Signature:</b>

```typescript
static not(config: StateConfig): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  config | [StateConfig](../interfaces/stateconfig.md) | the script to check |

<b>Returns:</b>

`StateConfig`

a StateConfig in VM boolean format (true non-zero, false zero)

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

a StateConfig in VM boolean format (true non-zero, false zero)

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

a StatecConfig

<a id="setDisccount-method-static-1"></a>

### setDisccount(config, condition, discount)

Method to apply discount on a StateConfig based on a condition passing

<b>Signature:</b>

```typescript
static setDisccount(config: StateConfig, condition: StateConfig, discount: number): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  config | [StateConfig](../interfaces/stateconfig.md) | The StateConfig to apply discount on |
|  condition | [StateConfig](../interfaces/stateconfig.md) | The condition of StateConfig type |
|  discount | `number` | discount percentage (between 0 - 99 and 2 decimals max) |

<b>Returns:</b>

`StateConfig`

a StateConfig

<a id="setDiscountForTiers-method-static-1"></a>

### setDiscountForTiers(config, tierAddress, tierDiscount, options)

Deducts percentage off of the result of a VM script based on the holding tier of a tier contract.

<b>Signature:</b>

```typescript
static setDiscountForTiers(config: StateConfig, tierAddress: string, tierDiscount: number[], options?: {
        index?: number;
        tierActivation?: (string | number)[];
    }): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  config | [StateConfig](../interfaces/stateconfig.md) | the main VM script |
|  tierAddress | `string` | the contract address of the tier contract. |
|  tierDiscount | `number[]` | an array of 8 items - the discount value (range 0 - 99) of each tier are the 8 items of the array. |
|  options | <pre>{&#010;    index?: number;&#010;    tierActivation?: (string \| number)[];&#010;}</pre> | used for additional configuraions: - (param) index to identify which sources item in config.sources the tierMultiplier applies to, if not specified, it will be 0. - (param) tierActivation An array of numbers, representing the amount of blocks each tier must hold in order to get the discount, e.g. the first item in array is 100 mean tier 1 needs to be held at least 100 blocks to get the discount. |

<b>Returns:</b>

`StateConfig`

a VM script

<a id="setMultiplier-method-static-1"></a>

### setMultiplier(config, condition, multiplier)

Method to apply multiplier to a StateConfig based on a condition passing

<b>Signature:</b>

```typescript
static setMultiplier(config: StateConfig, condition: StateConfig, multiplier: number): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  config | [StateConfig](../interfaces/stateconfig.md) | The StateConfig to apply multiplier to |
|  condition | [StateConfig](../interfaces/stateconfig.md) | The condition of StateConfig type |
|  multiplier | `number` | multulpier (2 decimals max) |

<b>Returns:</b>

`StateConfig`

a StateConfig

<a id="setMultiplierForTiers-method-static-1"></a>

### setMultiplierForTiers(config, tierAddress, tierMultiplier, options)

Multiply the result of a VM script based on the holding tier of a tier contract.

<b>Signature:</b>

```typescript
static setMultiplierForTiers(config: StateConfig, tierAddress: string, tierMultiplier: number[], options?: {
        index?: number;
        tierActivation?: (string | number)[];
    }): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  config | [StateConfig](../interfaces/stateconfig.md) | the main VM script |
|  tierAddress | `string` | the contract address of the tier contract. |
|  tierMultiplier | `number[]` | an array of 8 items - the multiplier value (2 decimals max) of each tier are the 8 items of the array. |
|  options | <pre>{&#010;    index?: number;&#010;    tierActivation?: (string \| number)[];&#010;}</pre> | used for additional configuraions: - (param) index to identify which sources item in config.sources the tierMultiplier applies to, if not specified, it will be 0. - (param) tierActivation An array of numbers, representing the amount of blocks each tier must hold in order to get the multiplier, e.g. the first item in array is 100 mean tier 1 needs to be held at least 100 blocks to get the multiplier. |

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

<a id="setTimer-method-static-1"></a>

### setTimer(configs, times, inBlockNumber)

A method to merge multiple (more than 1) scripts to be executed based on time slices.

<b>Signature:</b>

```typescript
static setTimer(configs: StateConfig[], times: number[], inBlockNumber?: boolean): StateConfig;
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

a StateConfig

<a id="xnor-method-static-1"></a>

### xnor(configs, stackReassignment)

Method to xnor multiple scripts together

This method when used in a contract will be gas intensive specially the configs or number of them are larg already

<b>Signature:</b>

```typescript
static xnor(configs: StateConfig[], stackReassignment?: boolean): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  configs | `StateConfig[]` | an array of configs to xnor |
|  stackReassignment | `boolean` | (optional) pass false if STACK opcode operands dont need to be reassigned to their new relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine |

<b>Returns:</b>

`StateConfig`

a StateConfig in VM boolean format (true non-zero, false zero)

<a id="xor-method-static-1"></a>

### xor(configs, stackReassignment)

Method to xor multiple scripts together

This method when used in a contract will be gas intensive specially the configs or number of them are larg already

<b>Signature:</b>

```typescript
static xor(configs: StateConfig[], stackReassignment?: boolean): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  configs | `StateConfig[]` | an array of configs to xor |
|  stackReassignment | `boolean` | (optional) pass false if STACK opcode operands dont need to be reassigned to their new relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine |

<b>Returns:</b>

`StateConfig`

a StateConfig in VM boolean format (true non-zero, false zero)

