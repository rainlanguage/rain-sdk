
# Class RuleBuilder

Class with methods to generate a rule-based StateConfig

<b>Signature:</b>

```typescript
class RuleBuilder 
```

## Static Methods

|  Method | Description |
|  --- | --- |
|  [multiCurrency(currencies)](./rulebuilder.md#multiCurrency-method-static-1) | Method to generate a multi currency rule-based StateConfig |
|  [singleCurrency(currency)](./rulebuilder.md#singleCurrency-method-static-1) | Method to generate a single currency rule-based StateConfig |

## Static Method Details

<a id="multiCurrency-method-static-1"></a>

### multiCurrency(currencies)

Method to generate a multi currency rule-based StateConfig

<b>Signature:</b>

```typescript
static multiCurrency(currencies: vmCurrency[]): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  currencies | `vmCurrency[]` | An array of vmCurrency objects |

<b>Returns:</b>

`StateConfig`

A StateConfig

<a id="singleCurrency-method-static-1"></a>

### singleCurrency(currency)

Method to generate a single currency rule-based StateConfig

<b>Signature:</b>

```typescript
static singleCurrency(currency: vmCurrency): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  currency | [vmCurrency](../interfaces/vmcurrency.md) | A vmCurrency object |

<b>Returns:</b>

`StateConfig`

A StateConfig

