
# Class IncDecPrice

- A sub-class of PriceCurve for creating an linear Increasing or Decreasing sale type.

- Price starts at 'startPrice' and goes to 'endPrice' over the span of the sale's duration.

<b>Signature:</b>

```typescript
class IncDecPrice extends PriceCurve 
```

## Example


```typescript
//For generating a Increasing/Decreasing Price sale type pass in the required arguments to the constructor.
const saleType = new IncreasingPrice(startPrice, endPrice, startTimestamp, endTimestamp)

```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [INC\_DEC\_PRICE\_SOURCES](./incdecprice.md#INC_DEC_PRICE_SOURCES-property-static) | `(isInc: boolean) => Uint8Array` |  |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [constants](./pricecurve.md#constants-property) | `BigNumberish[]` | *Inherited from [PriceCurve.constants](./pricecurve.md#constants-property)* |
|  [sources](./pricecurve.md#sources-property) | `BytesLike[]` | *Inherited from [PriceCurve.sources](./pricecurve.md#sources-property)* |

## Methods

|  Method | Description |
|  --- | --- |
|  [applyExtraTimeDiscount(endTimestamp, extraTimeDiscountThreshold, extraTimeDiscount)](./pricecurve.md#applyExtraTimeDiscount-method-1) | Method to apply extra time discount to the sale. if sale's continues into extra time then those addresses that have met the critera of extra time discount which is already purchased a certain amount of rTKN will get some discount on price for their next purchase.<br></br>*Inherited from [PriceCurve.applyExtraTimeDiscount()](./pricecurve.md#applyExtraTimeDiscount-method-1)* |
|  [applyTierDiscount(tierAddress, tierDiscount, options)](./pricecurve.md#applyTierDiscount-method-1) | Method to apply tiers' discounts to the sale. Tiered addresses will get discount based on the tier they hold.<br></br>*Inherited from [PriceCurve.applyTierDiscount()](./pricecurve.md#applyTierDiscount-method-1)* |

## Static Property Details

<a id="INC_DEC_PRICE_SOURCES-property-static"></a>

### INC\_DEC\_PRICE\_SOURCES

<b>Signature:</b>

```typescript
static INC_DEC_PRICE_SOURCES: (isInc: boolean) => Uint8Array;
```
