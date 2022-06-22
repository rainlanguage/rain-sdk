
# Class SaleScriptFrom

Builds a sale compatible StateConfig out of 2 individual StateConfigs (canLive and calculateBuy)

<b>Signature:</b>

```typescript
class SaleScriptFrom 
```

## Example


```typescript
//For generating a sale compatible StateConfig for the sale pass in 2 individual scripts
(can use PriceCurves and CanLive classes).
const saleConfig = new SaleConfigBuilder(new FixedPrice, new CanLiveInTimestamp)

```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [buyCapScript](./salescriptfrom.md#buyCapScript-property) | `BuyCap \| StateConfig` |  |
|  [calculateBuyScript](./salescriptfrom.md#calculateBuyScript-property) | `PriceCurve \| StateConfig` |  |
|  [canLiveScript](./salescriptfrom.md#canLiveScript-property) | `SaleDurationInTimestamp \| SaleDurationInBlocks \| StateConfig` |  |
|  [constants](./salescriptfrom.md#constants-property) | `BigNumberish[]` |  |
|  [sources](./salescriptfrom.md#sources-property) | `BytesLike[]` |  |

## Property Details

<a id="buyCapScript-property"></a>

### buyCapScript

<b>Signature:</b>

```typescript
readonly buyCapScript: BuyCap | StateConfig;
```

<a id="calculateBuyScript-property"></a>

### calculateBuyScript

<b>Signature:</b>

```typescript
readonly calculateBuyScript: PriceCurve | StateConfig;
```

<a id="canLiveScript-property"></a>

### canLiveScript

<b>Signature:</b>

```typescript
readonly canLiveScript: SaleDurationInTimestamp | SaleDurationInBlocks | StateConfig;
```

<a id="constants-property"></a>

### constants

<b>Signature:</b>

```typescript
constants: BigNumberish[];
```

<a id="sources-property"></a>

### sources

<b>Signature:</b>

```typescript
sources: BytesLike[];
```
