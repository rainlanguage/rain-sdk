
# Class BetweenTimestamps

- A class used for creating a VM state for Sale's canLive StateConfig based on timestamp.

- Like all the method calls, order of calling methods in this class is important in order to produce the desired result, although calling in any order will produce a reliable result, that depends on what the intention is. Methods afterMinimumRaise and applyExtratime should not be used together as they are opposite of eachother and will cancel eachother out.

<b>Signature:</b>

```typescript
class BetweenTimestamps 
```

## Example


```typescript
//For generating a canLive StateConfig for the sale pass in the required arguments to the constructor.
const saleDuration = new SaleDuration(startTimestamp, endTimestamp)

```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [constants](./betweentimestamps.md#constants-property) | `BigNumberish[]` |  |
|  [endTimestamp](./betweentimestamps.md#endTimestamp-property) | `number` |  |
|  [sources](./betweentimestamps.md#sources-property) | `BytesLike[]` |  |
|  [startTimestamp](./betweentimestamps.md#startTimestamp-property) | `number` |  |

## Methods

|  Method | Description |
|  --- | --- |
|  [afterMinimumRaise(minimumRaise, reserveTokenDecimals)](./betweentimestamps.md#afterMinimumRaise-method-1) | A method for the sale to be able to end once the sale hits minimumRaise i.e. the minimum amount that needs to be raiseed so the raises status becomes "success" after raise ends. |
|  [applyExtraTime(extraTime, extraTimeAmount, reserveTokenDecimals)](./betweentimestamps.md#applyExtraTime-method-1) | Method to apply extra time to the sale duration. if the extra time criteria which is raising more than 'extraTimeAmount' has been met the sale continue for longer (for 'extraTime' more minutes). |

## Property Details

<a id="constants-property"></a>

### constants

<b>Signature:</b>

```typescript
constants: BigNumberish[];
```

<a id="endTimestamp-property"></a>

### endTimestamp

<b>Signature:</b>

```typescript
readonly endTimestamp: number;
```

<a id="sources-property"></a>

### sources

<b>Signature:</b>

```typescript
sources: BytesLike[];
```

<a id="startTimestamp-property"></a>

### startTimestamp

<b>Signature:</b>

```typescript
readonly startTimestamp: number;
```

## Method Details

<a id="afterMinimumRaise-method-1"></a>

### afterMinimumRaise(minimumRaise, reserveTokenDecimals)

A method for the sale to be able to end once the sale hits minimumRaise i.e. the minimum amount that needs to be raiseed so the raises status becomes "success" after raise ends.

please note that this method should not be used with applyExtraTime as they are opossit of eachother and also the order of using this method along with other methods of this class is important

<b>Signature:</b>

```typescript
afterMinimumRaise(minimumRaise: number, reserveTokenDecimals?: number): BetweenTimestamps;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  minimumRaise | `number` | the minimumRaise parameter of the raise which is passed at the time of sale's deployment as part of the SaleConfig |
|  reserveTokenDecimals | `number` |  |

<b>Returns:</b>

`BetweenTimestamps`

BetweenTimestamps

<a id="applyExtraTime-method-1"></a>

### applyExtraTime(extraTime, extraTimeAmount, reserveTokenDecimals)

Method to apply extra time to the sale duration. if the extra time criteria which is raising more than 'extraTimeAmount' has been met the sale continue for longer (for 'extraTime' more minutes).

- If the sale has extra time discount, it is important that this method to be applied for canEndStateConfig of the sale.

<b>Signature:</b>

```typescript
applyExtraTime(extraTime: number, extraTimeAmount: number, reserveTokenDecimals?: number): BetweenTimestamps;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  extraTime | `number` | The amount of time (in minutes) that sale can continue for, if the extra time criteria has been met. |
|  extraTimeAmount | `number` | The criteria for extra time, if the raised amount exceeds this amount then the raise can continue into extra time. |
|  reserveTokenDecimals | `number` |  |

<b>Returns:</b>

`BetweenTimestamps`

BetweenTimestamps

