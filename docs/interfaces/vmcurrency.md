
# Interface vmCurrency

Type for a currency scripts used in RuleBuilder class

<b>Signature:</b>

```typescript
interface vmCurrency 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [defaultPrice](./vmcurrency.md#defaultPrice-property) | [StateConfig](./stateconfig.md) | Default price StateConfig of this currency |
|  [defaultQuantity](./vmcurrency.md#defaultQuantity-property) | [StateConfig](./stateconfig.md) | Default quantity StateConfig of this currency |
|  [priceConditions](./vmcurrency.md#priceConditions-property) | `StateConfig[]` | Array of conditions for conditional prices |
|  [priceModifiers](./vmcurrency.md#priceModifiers-property) | <pre>{&#010;    [index: number]: modifier;&#010;}</pre> | Prices modifiers, modifier on a single sub-price StateConfig |
|  [prices](./vmcurrency.md#prices-property) | `StateConfig[]` | Array of conditional prices |
|  [priceTopModifier](./vmcurrency.md#priceTopModifier-property) | [modifier](./modifier.md) | Top price modifier, modifier on all sub-prices |
|  [quantities](./vmcurrency.md#quantities-property) | `StateConfig[]` | Array of conditional quantities |
|  [quantityConditions](./vmcurrency.md#quantityConditions-property) | `StateConfig[]` | Array of conditions for conditional quantities |
|  [quantityModifiers](./vmcurrency.md#quantityModifiers-property) | <pre>{&#010;    [index: number]: modifier;&#010;}</pre> | Quantities modifiers, modifier on a single sub-quantity StateConfig |
|  [quantityTopModifier](./vmcurrency.md#quantityTopModifier-property) | [modifier](./modifier.md) | Top quantity modifier, modifier on all sub-quantities |

## Property Details

<a id="defaultPrice-property"></a>

### defaultPrice

Default price StateConfig of this currency

<b>Signature:</b>

```typescript
defaultPrice: StateConfig;
```

<a id="defaultQuantity-property"></a>

### defaultQuantity

Default quantity StateConfig of this currency

<b>Signature:</b>

```typescript
defaultQuantity: StateConfig;
```

<a id="priceConditions-property"></a>

### priceConditions

Array of conditions for conditional prices

<b>Signature:</b>

```typescript
priceConditions: StateConfig[];
```

<a id="priceModifiers-property"></a>

### priceModifiers

Prices modifiers, modifier on a single sub-price StateConfig

<b>Signature:</b>

```typescript
priceModifiers: {
        [index: number]: modifier;
    };
```

<a id="prices-property"></a>

### prices

Array of conditional prices

<b>Signature:</b>

```typescript
prices: StateConfig[];
```

<a id="priceTopModifier-property"></a>

### priceTopModifier

Top price modifier, modifier on all sub-prices

<b>Signature:</b>

```typescript
priceTopModifier?: modifier;
```

<a id="quantities-property"></a>

### quantities

Array of conditional quantities

<b>Signature:</b>

```typescript
quantities: StateConfig[];
```

<a id="quantityConditions-property"></a>

### quantityConditions

Array of conditions for conditional quantities

<b>Signature:</b>

```typescript
quantityConditions: StateConfig[];
```

<a id="quantityModifiers-property"></a>

### quantityModifiers

Quantities modifiers, modifier on a single sub-quantity StateConfig

<b>Signature:</b>

```typescript
quantityModifiers: {
        [index: number]: modifier;
    };
```

<a id="quantityTopModifier-property"></a>

### quantityTopModifier

Top quantity modifier, modifier on all sub-quantities

<b>Signature:</b>

```typescript
quantityTopModifier?: modifier;
```
