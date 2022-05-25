
# Class PriceCurve

- PriceCurve is an class that all the other sale types (sub-classes) will inherit from.

- It holds all the global methods for generating a sale script with different features for a sale such as tier discount which makes depolying a new sale contracts with different features easy.

\*\*Important\*\* - the order of calling the methods of this class is important, meaning in order to get the desired result for the sale, mthods should be called in correct order, although it is worth saying that even if the order is not followed, the result will still be reliable if that is been done by intention. For example if we call 'applyExtraTime' method after the the 'applyTierDiscount' method, the extra time discount will be applied to the result of 'applyTierDiscount' and if before that, it will be vice versa. The general order for calling these methods is: 1.applyExtraTimeDiscount 2.applyTierDiscount 3.applyWalletCap

<b>Signature:</b>

```typescript
class PriceCurve 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [argumentsLength](./pricecurve.md#argumentsLength-property) | `BigNumberish` |  |
|  [constants](./pricecurve.md#constants-property) | `BigNumberish[]` |  |
|  [sources](./pricecurve.md#sources-property) | `BytesLike[]` |  |
|  [stackLength](./pricecurve.md#stackLength-property) | `BigNumberish` |  |

## Methods

|  Method | Description |
|  --- | --- |
|  [applyExtraTimeDiscount(endTimestamp, extraTimeDiscountThreshold, extraTimeDiscount)](./pricecurve.md#applyExtraTimeDiscount-method-1) | Method to apply extra time discount to the sale. if sale's continues into extra time then those addresses that have met the critera of extra time discount which is already purchased a certain amount of rTKN will get some discount on price for their next purchase.<br></br>\*\*important\*\* - Sale should have extra time feature in order for extra time discount to be effective. |
|  [applyTierDiscount(tierAddress, tierDiscount, tierActivation)](./pricecurve.md#applyTierDiscount-method-1) | Method to apply tiers' discounts to the sale. Tiered addresses will get discount based on the tier they hold. |
|  [applyWalletCap(mode, options)](./pricecurve.md#applyWalletCap-method-1) | Method to apply cap per wallet to the sale. addresses can only buy that certain amount of rTKNs. With the option of applying multiplier for max cap per wallet. |

## Property Details

<a id="argumentsLength-property"></a>

### argumentsLength

<b>Signature:</b>

```typescript
argumentsLength: BigNumberish;
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

<a id="stackLength-property"></a>

### stackLength

<b>Signature:</b>

```typescript
stackLength: BigNumberish;
```

## Method Details

<a id="applyExtraTimeDiscount-method-1"></a>

### applyExtraTimeDiscount(endTimestamp, extraTimeDiscountThreshold, extraTimeDiscount)

Method to apply extra time discount to the sale. if sale's continues into extra time then those addresses that have met the critera of extra time discount which is already purchased a certain amount of rTKN will get some discount on price for their next purchase.

\*\*important\*\* - Sale should have extra time feature in order for extra time discount to be effective.

<b>Signature:</b>

```typescript
applyExtraTimeDiscount(endTimestamp: number, extraTimeDiscountThreshold: number, extraTimeDiscount: number): this;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  endTimestamp | `number` | Usual end time of the sale. |
|  extraTimeDiscountThreshold | `number` | the criteria for extra time discount, if the address has already purchased more than this amount then it will recieve the discount for its next purchases once the sale is gone into extra time. |
|  extraTimeDiscount | `number` | The amount of discount the address will receive. |

<b>Returns:</b>

`this`

this

<a id="applyTierDiscount-method-1"></a>

### applyTierDiscount(tierAddress, tierDiscount, tierActivation)

Method to apply tiers' discounts to the sale. Tiered addresses will get discount based on the tier they hold.

<b>Signature:</b>

```typescript
applyTierDiscount(tierAddress: string, tierDiscount: number[], tierActivation?: (number | string)[]): this;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  tierAddress | `string` | The Tier contract address. |
|  tierDiscount | `number[]` | An array of each tiers' discount ranging between 0 - 99. |
|  tierActivation | `(number \| string)[]` | (optional) An array of number of blocks for each tier that will be the required period of time for a tiered address which that tier's status needs to be held in order to be eligible for that tier's discount. |

<b>Returns:</b>

`this`

this

<a id="applyWalletCap-method-1"></a>

### applyWalletCap(mode, options)

Method to apply cap per wallet to the sale. addresses can only buy that certain amount of rTKNs. With the option of applying multiplier for max cap per wallet.

<b>Signature:</b>

```typescript
applyWalletCap(mode: WalletCapMode, options?: WalletCapOptions): this;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  mode | [WalletCapMode](../enums/walletcapmode.md) | The mode that determines if there is max or min cap per wallet or both. |
|  options | [WalletCapOptions](../types/walletcapoptions.md) |  |

<b>Returns:</b>

`this`

this
