
# Class BuyAmount

The fisrt piece of script in a sale's amount/price pair script which determines the amoount or cap that can be bought.

<b>Signature:</b>

```typescript
class BuyAmount 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [buyCapConfig](./buyamount.md#buyCapConfig-property) | `StateConfig \| undefined` |  |
|  [constants](./buyamount.md#constants-property) | `BigNumberish[]` |  |
|  [sources](./buyamount.md#sources-property) | `BytesLike[]` |  |

## Methods

|  Method | Description |
|  --- | --- |
|  [applyWalletCap(mode, options)](./buyamount.md#applyWalletCap-method-1) | Method to apply cap per wallet to the sale. addresses can only buy that certain amount of rTKNs. With the option of applying multiplier for max cap per wallet. |

## Property Details

<a id="buyCapConfig-property"></a>

### buyCapConfig

<b>Signature:</b>

```typescript
readonly buyCapConfig?: StateConfig | undefined;
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

## Method Details

<a id="applyWalletCap-method-1"></a>

### applyWalletCap(mode, options)

Method to apply cap per wallet to the sale. addresses can only buy that certain amount of rTKNs. With the option of applying multiplier for max cap per wallet.

<b>Signature:</b>

```typescript
applyWalletCap(mode: BuyCapMode, options?: {
        minWalletCap?: number;
        maxWalletCap?: number;
        tierAddress?: string;
        tierMultiplier?: number[];
        tierActivation?: (number | string)[];
        tierContext?: BigNumber[];
    }): BuyAmount;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  mode | [BuyCapMode](../enums/buycapmode.md) | The mode that determines if there is max or min cap per wallet or both. |
|  options | <pre>{&#010;    minWalletCap?: number;&#010;    maxWalletCap?: number;&#010;    tierAddress?: string;&#010;    tierMultiplier?: number[];&#010;    tierActivation?: (number \| string)[];&#010;    tierContext?: BigNumber[];&#010;}</pre> | (optional) Additional arguments to configure the cap per wallet behaviour: - (param) minWalletCap - The number for min cap per wallet, addresses cannot buy less number of rTKNs than this amount. - (param) maxWalletCap - The number for max cap per wallet, addresses cannot buy more number of rTKNs than this amount. - (param) tierAddress - The Tier contract address for tiers' max cap per wallet multiplier. - (param) tierMultiplier - An array of each tiers' Multiplier value. - (param) tierActivation - An array of number of timestamps for each tier that will be the required period of time for that tiered address to hold the tier's in order to be eligible for that tier's multiplier. - (param) tierContext - an array of 8 items represtenting stake contract thresholds |

<b>Returns:</b>

`BuyAmount`

this

