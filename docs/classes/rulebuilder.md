
# Class RuleBuilder

Class with methods to generate a multi-currency rule-based StateConfig

<b>Signature:</b>

```typescript
class RuleBuilder 
```

## Example


```typescript
// to import:
import { RuleBuilder } from "rain-sdk"

// to get the multi-currency rule-based StateConfig:
const vmStateConfig = new RuleBuilder([currency1, currency2, ...])

// to get a single condition's StateConfig of a single Rule:
const conditions = RuleBuilder.getConditionConfig(condition)

// to get a ConditionGroup StateConfig:
const rule = RuleBuilder.getConditionGroup(conditionGroup)

//to get a single price or quantity StateConfig:
const quantity = RuleBuilder.getQPConfig(quantity)
const price = RuleBuilder.getQPConfig(price)

```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [constants](./rulebuilder.md#constants-property) | `BigNumberish[]` |  |
|  [currencies](./rulebuilder.md#currencies-property) | `Currency[]` |  |
|  [sources](./rulebuilder.md#sources-property) | `BytesLike[]` |  |

## Static Methods

|  Method | Description |
|  --- | --- |
|  [applyModifier(config, modifier)](./rulebuilder.md#applyModifier-method-static-1) | Method to generate a single currency rule-based StateConfig |
|  [eval(currencies, signer, options)](./rulebuilder.md#eval-method-static-1) | Method to execute and evaluate the generated StateConfig by Rain JSVM from Currency object(s) and return an eCurrency object(s) which is basically the same Currency object with result fields for each individual part of the StateConfig i.e. Quantities, Prices, Conditions etc. |
|  [from(currencies)](./rulebuilder.md#from-method-static-1) | Method to generate a multi currency rule-based StateConfig |
|  [getConditionConfig(condition)](./rulebuilder.md#getConditionConfig-method-static-1) | Method to get the conditions' StateConfig of a ConditionGroup seperately |
|  [getConditionGroupConfig(conditionGroup)](./rulebuilder.md#getConditionGroupConfig-method-static-1) | Method to get the a ConditionGroup StateConfig |
|  [getQPConfig(qp)](./rulebuilder.md#getQPConfig-method-static-1) | Method to get the price or quantity StateConfig |

## Property Details

<a id="constants-property"></a>

### constants

<b>Signature:</b>

```typescript
constants: BigNumberish[];
```

<a id="currencies-property"></a>

### currencies

<b>Signature:</b>

```typescript
readonly currencies: Currency[];
```

<a id="sources-property"></a>

### sources

<b>Signature:</b>

```typescript
sources: BytesLike[];
```

## Static Method Details

<a id="applyModifier-method-static-1"></a>

### applyModifier(config, modifier)

Method to generate a single currency rule-based StateConfig

<b>Signature:</b>

```typescript
static applyModifier(config: StateConfig, modifier: Modifier): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  config | [StateConfig](../interfaces/stateconfig.md) | The config to apply modifier on |
|  modifier | [Modifier](../types/modifier.md) | The object of type Modifier |

<b>Returns:</b>

`StateConfig`

StateConfig

<a id="eval-method-static-1"></a>

### eval(currencies, signer, options)

Method to execute and evaluate the generated StateConfig by Rain JSVM from Currency object(s) and return an eCurrency object(s) which is basically the same Currency object with result fields for each individual part of the StateConfig i.e. Quantities, Prices, Conditions etc.

<b>Signature:</b>

```typescript
static eval(currencies: Currency[], signer: Signer, options?: {
        contract?: Contract | string;
        context?: string[];
        data?: any;
        opMeta?: Map<number, IOpMeta>;
        storageOpFn?: FnPtrsJSVM;
    }): Promise<eCurrency[]>;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  currencies | `Currency[]` | An array of Currency object(s) |
|  signer | `Signer` | A valid ethers signer |
|  options | <pre>{&#010;    contract?: Contract \| string;&#010;    context?: string[];&#010;    data?: any;&#010;    opMeta?: Map<number, IOpMeta>;&#010;    storageOpFn?: FnPtrsJSVM;&#010;}</pre> | (optional) Additional arguments to be passed to the JSVM |

<b>Returns:</b>

`Promise<eCurrency[]>`

An eCurrency object

<a id="from-method-static-1"></a>

### from(currencies)

Method to generate a multi currency rule-based StateConfig

<b>Signature:</b>

```typescript
static from(currencies: Currency[]): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  currencies | `Currency[]` | An array of Currency objects |

<b>Returns:</b>

`StateConfig`

StateConfig

<a id="getConditionConfig-method-static-1"></a>

### getConditionConfig(condition)

Method to get the conditions' StateConfig of a ConditionGroup seperately

<b>Signature:</b>

```typescript
static getConditionConfig(condition: Condition): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  condition | [Condition](../types/condition.md) |  |

<b>Returns:</b>

`StateConfig`

Array of StateConfig

<a id="getConditionGroupConfig-method-static-1"></a>

### getConditionGroupConfig(conditionGroup)

Method to get the a ConditionGroup StateConfig

<b>Signature:</b>

```typescript
static getConditionGroupConfig(conditionGroup: ConditionGroup): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  conditionGroup | [ConditionGroup](../types/conditiongroup.md) | The ConditionGroup object |

<b>Returns:</b>

`StateConfig`

StateConfig

<a id="getQPConfig-method-static-1"></a>

### getQPConfig(qp)

Method to get the price or quantity StateConfig

<b>Signature:</b>

```typescript
static getQPConfig(qp: Price | Quantity): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  qp | `Price \| Quantity` | The price or quantity |

<b>Returns:</b>

`StateConfig`

StateConfig

