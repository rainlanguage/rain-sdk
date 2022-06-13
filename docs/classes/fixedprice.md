
# Class FixedPrice

- A sub-class of PriceCurve for creating a Fixed Price sale type. The price is a constant value over the span of the sale.

<b>Signature:</b>

```typescript
class FixedPrice extends PriceCurve 
```

## Example


```typescript
//For generating a Fixed Price sale type pass in the required arguments to the constructor.
const saleType = new FixedPrice(price)

```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [FIXED\_PRICE\_SOURCES](./fixedprice.md#FIXED_PRICE_SOURCES-property-static) | `() => Uint8Array` |  |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [argumentsLength](./pricecurve.md#argumentsLength-property) | `BigNumberish` | *Inherited from [PriceCurve.argumentsLength](./pricecurve.md#argumentsLength-property)* |
|  [constants](./pricecurve.md#constants-property) | `BigNumberish[]` | *Inherited from [PriceCurve.constants](./pricecurve.md#constants-property)* |
|  [sources](./pricecurve.md#sources-property) | `BytesLike[]` | *Inherited from [PriceCurve.sources](./pricecurve.md#sources-property)* |
|  [stackLength](./pricecurve.md#stackLength-property) | `BigNumberish` | *Inherited from [PriceCurve.stackLength](./pricecurve.md#stackLength-property)* |

## Methods

|  Method | Description |
|  --- | --- |
|  [applyExtraTimeDiscount(endTimestamp, extraTimeDiscountThreshold, extraTimeDiscount)](./pricecurve.md#applyExtraTimeDiscount-method-1) | Method to apply extra time discount to the sale. if sale's continues into extra time then those addresses that have met the critera of extra time discount which is already purchased a certain amount of rTKN will get some discount on price for their next purchase.<br></br>*Inherited from [PriceCurve.applyExtraTimeDiscount()](./pricecurve.md#applyExtraTimeDiscount-method-1)* |
|  [applyTierDiscount(tierAddress, tierDiscount, tierActivation)](./pricecurve.md#applyTierDiscount-method-1) | Method to apply tiers' discounts to the sale. Tiered addresses will get discount based on the tier they hold.<br></br>*Inherited from [PriceCurve.applyTierDiscount()](./pricecurve.md#applyTierDiscount-method-1)* |
|  [applyWalletCap(mode, options)](./pricecurve.md#applyWalletCap-method-1) | Method to apply cap per wallet to the sale. addresses can only buy that certain amount of rTKNs. With the option of applying multiplier for max cap per wallet.<br></br>*Inherited from [PriceCurve.applyWalletCap()](./pricecurve.md#applyWalletCap-method-1)* |

## Static Property Details

<a id="FIXED_PRICE_SOURCES-property-static"></a>

### FIXED\_PRICE\_SOURCES

<b>Signature:</b>

```typescript
static FIXED_PRICE_SOURCES: () => Uint8Array;
```
