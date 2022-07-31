
# Interface modifier

Type for price/quantity scripts modifier based on a tier report

<b>Signature:</b>

```typescript
interface modifier 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [condition](./modifier.md#condition-property) | `string \| StateConfig` | the condition of the modifier, either a tier contract address for tier modifier or a boolean StateConfig for none tier modifier |
|  [mode](./modifier.md#mode-property) | `"tier_discounts" \| "tier_multipliers" \| "discount" \| "multiplier"` | Determines the modifier's mode |
|  [options](./modifier.md#options-property) | <pre>{&#010;    tierContext?: BigNumber[];&#010;    delegatedReport?: boolean;&#010;}</pre> | Optional properties for specific modifier's mode |
|  [values](./modifier.md#values-property) | `number[]` | The modifing value(s) |

## Property Details

<a id="condition-property"></a>

### condition

the condition of the modifier, either a tier contract address for tier modifier or a boolean StateConfig for none tier modifier

<b>Signature:</b>

```typescript
condition: string | StateConfig;
```

<a id="mode-property"></a>

### mode

Determines the modifier's mode

<b>Signature:</b>

```typescript
mode: "tier_discounts" | "tier_multipliers" | "discount" | "multiplier";
```

<a id="options-property"></a>

### options

Optional properties for specific modifier's mode

<b>Signature:</b>

```typescript
options?: {
        tierContext?: BigNumber[];
        delegatedReport?: boolean;
    };
```

<a id="values-property"></a>

### values

The modifing value(s)

<b>Signature:</b>

```typescript
values: number[];
```
