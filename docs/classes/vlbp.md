
# Class vLBP

- A sub-class of PriceCurve for creating an vLBP i.e virtual LBP sale type.

- It is called virtual FLO or LBP because there is no actual seeding required. Price starts at 'startPrice' and goes to down over the span of the sale's duration if no buys happen. If buys happen then price will go up (exactly like the real LBP)

<b>Signature:</b>

```typescript
class vLBP extends PriceCurve 
```

## Example


```typescript
//For generating a vLBP sale type pass in the required arguments to the constructor.
const saleType = new vLBP(startPrice, startTimestamp, endTimestamp, minimumRaise, initialSupply)

```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [vLBP\_SOURCES](./vlbp.md#vLBP_SOURCES-property-static) | `() => Uint8Array` |  |

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
|  [applyExtraTimeDiscount(endTimestamp, extraTimeDiscountThreshold, extraTimeDiscount)](./pricecurve.md#applyExtraTimeDiscount-method-1) | Method to apply extra time discount to the sale. if sale's continues into extra time then those addresses that have met the critera of extra time discount which is already purchased a certain amount of rTKN will get some discount on price for their next purchase.<br></br>\*\*important\*\* - Sale should have extra time feature in order for extra time discount to be effective.<br></br>*Inherited from [PriceCurve.applyExtraTimeDiscount()](./pricecurve.md#applyExtraTimeDiscount-method-1)* |
|  [applyTierDiscount(tierAddress, tierDiscount, tierActivation)](./pricecurve.md#applyTierDiscount-method-1) | Method to apply tiers' discounts to the sale. Tiered addresses will get discount based on the tier they hold.<br></br>*Inherited from [PriceCurve.applyTierDiscount()](./pricecurve.md#applyTierDiscount-method-1)* |
|  [applyWalletCap(mode, options)](./pricecurve.md#applyWalletCap-method-1) | Method to apply cap per wallet to the sale. addresses can only buy that certain amount of rTKNs. With the option of applying multiplier for max cap per wallet.<br></br>*Inherited from [PriceCurve.applyWalletCap()](./pricecurve.md#applyWalletCap-method-1)* |

## Static Property Details

<a id="vLBP_SOURCES-property-static"></a>

### vLBP\_SOURCES

<b>Signature:</b>

```typescript
static vLBP_SOURCES: () => Uint8Array;
```
