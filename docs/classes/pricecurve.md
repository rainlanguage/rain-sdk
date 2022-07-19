
# Class PriceCurve

- PriceCurve is an class that all the other sale types (sub-classes) will inherit from.

- the order of calling the methods of this class is important, meaning in order to get the desired result for the sale, mthods should be called in correct order, although it is worth saying that even if the order is not followed, the result will still be reliable if that is been done by intention. For example if we call 'applyExtraTime' method after the the 'applyTierDiscount' method, the extra time discount will be applied to the result of 'applyTierDiscount' and if before that, it will be vice versa. The general order for calling these methods is: 1.applyExtraTimeDiscount 2.applyTierDiscount

<b>Signature:</b>

```typescript
class PriceCurve 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [constants](./pricecurve.md#constants-property) | `BigNumberish[]` |  |
|  [sources](./pricecurve.md#sources-property) | `BytesLike[]` |  |

## Methods

|  Method | Description |
|  --- | --- |
|  [applyExtraTimeDiscount(endTimestamp, extraTimeDiscountThreshold, extraTimeDiscount)](./pricecurve.md#applyExtraTimeDiscount-method-1) | Method to apply extra time discount to the sale. if sale's continues into extra time then those addresses that have met the critera of extra time discount which is already purchased a certain amount of rTKN will get some discount on price for their next purchase. |
|  [applyTierDiscount(tierAddress, tierDiscount, options)](./pricecurve.md#applyTierDiscount-method-1) | Method to apply tiers' discounts to the sale. Tiered addresses will get discount based on the tier they hold. |

## Property Details

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

## Method Details

<a id="applyExtraTimeDiscount-method-1"></a>

### applyExtraTimeDiscount(endTimestamp, extraTimeDiscountThreshold, extraTimeDiscount)

Method to apply extra time discount to the sale. if sale's continues into extra time then those addresses that have met the critera of extra time discount which is already purchased a certain amount of rTKN will get some discount on price for their next purchase.

- Sale should have extra time feature in order for extra time discount to be effective.

<b>Signature:</b>

```typescript
applyExtraTimeDiscount(endTimestamp: number, extraTimeDiscountThreshold: number, extraTimeDiscount: number): PriceCurve;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  endTimestamp | `number` | Usual end time of the sale. |
|  extraTimeDiscountThreshold | `number` | the criteria for extra time discount, if the address has already purchased more than this amount then it will recieve the discount for its next purchases once the sale is gone into extra time. |
|  extraTimeDiscount | `number` | The amount of discount the address will receive. |

<b>Returns:</b>

`PriceCurve`

this

<a id="applyTierDiscount-method-1"></a>

### applyTierDiscount(tierAddress, tierDiscount, options)

Method to apply tiers' discounts to the sale. Tiered addresses will get discount based on the tier they hold.

<b>Signature:</b>

```typescript
applyTierDiscount(tierAddress: string, tierDiscount: number[], options?: {
        tierActivation?: (number | string)[];
        tierContext?: BigNumber[];
    }): PriceCurve;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  tierAddress | `string` | The Tier contract address. |
|  tierDiscount | `number[]` | An array of each tiers' discount ranging between 0 - 99. |
|  options | <pre>{&#010;    tierActivation?: (number \| string)[];&#010;    tierContext?: BigNumber[];&#010;}</pre> | (optional) used for stake tier contracts - (param) tierActivation - An array of number of timestamps for each tier that will be the required period of time for that tiered address to hold the tier's in order to be eligible for that tier's discount. - (param) tierContext - an array of 8 items represtenting stake contract thresholds |

<b>Returns:</b>

`PriceCurve`

this

