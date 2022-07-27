
# Class BetweenBlocks

- A class used for creating a VM state for Sale's canLive StateConfig based on block number.

- Like all the method calls, order of calling methods in this class is important in order to produce the desired result, although calling in any order will produce a reliable result, that depends on what the intention is. Methods afterMinimumRaise and applyExtratime should not be used together as they are opposite of eachother and will cancel eachother out.

<b>Signature:</b>

```typescript
class BetweenBlocks 
```

## Example


```typescript
//For generating a canLive StateConfig for the sale pass in the required arguments to the constructor.
const saleDuration = new SaleDuration(startBlockNumber, endBlockNumber)

```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [constants](./betweenblocks.md#constants-property) | `BigNumberish[]` |  |
|  [endBlockNumber](./betweenblocks.md#endBlockNumber-property) | `number` |  |
|  [sources](./betweenblocks.md#sources-property) | `BytesLike[]` |  |
|  [startBlockNumber](./betweenblocks.md#startBlockNumber-property) | `number` |  |

## Methods

|  Method | Description |
|  --- | --- |
|  [afterMinimumRaise(minimumRaise, reserveTokenDecimals)](./betweenblocks.md#afterMinimumRaise-method-1) | A method for the sale to be able to end once the sale hits minimumRaise i.e. the minimum amount that needs to be raiseed so the raises status becomes "success" after raise ends. |
|  [applyExtraTime(extraTimeBlocks, extraTimeAmount, reserveTokenDecimals)](./betweenblocks.md#applyExtraTime-method-1) | Method to apply extra time to the sale duration. if the extra time criteria which is raising more than 'extraTimeAmount' has been met the sale continue for longer (for 'extraTimeBlocks' more blocks). |

## Property Details

<a id="constants-property"></a>

### constants

<b>Signature:</b>

```typescript
constants: BigNumberish[];
```

<a id="endBlockNumber-property"></a>

### endBlockNumber

<b>Signature:</b>

```typescript
readonly endBlockNumber: number;
```

<a id="sources-property"></a>

### sources

<b>Signature:</b>

```typescript
sources: BytesLike[];
```

<a id="startBlockNumber-property"></a>

### startBlockNumber

<b>Signature:</b>

```typescript
readonly startBlockNumber: number;
```

## Method Details

<a id="afterMinimumRaise-method-1"></a>

### afterMinimumRaise(minimumRaise, reserveTokenDecimals)

A method for the sale to be able to end once the sale hits minimumRaise i.e. the minimum amount that needs to be raiseed so the raises status becomes "success" after raise ends.

please note that this method should not be used with applyExtraTime as they are opossit of eachother and also the order of using this method along with other methods of this class is important

<b>Signature:</b>

```typescript
afterMinimumRaise(minimumRaise: number, reserveTokenDecimals?: number): BetweenBlocks;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  minimumRaise | `number` | the minimumRaise parameter of the raise which is passed at the time of sale's deployment as part of the SaleConfig |
|  reserveTokenDecimals | `number` |  |

<b>Returns:</b>

`BetweenBlocks`

BetweenBlocks

<a id="applyExtraTime-method-1"></a>

### applyExtraTime(extraTimeBlocks, extraTimeAmount, reserveTokenDecimals)

Method to apply extra time to the sale duration. if the extra time criteria which is raising more than 'extraTimeAmount' has been met the sale continue for longer (for 'extraTimeBlocks' more blocks).

- This method is designed for sale's canEndStateConfig and should 'not' be used for canStart

<b>Signature:</b>

```typescript
applyExtraTime(extraTimeBlocks: number, extraTimeAmount: number, reserveTokenDecimals?: number): BetweenBlocks;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  extraTimeBlocks | `number` | The amount of time (in blocks) that sale can continue for, if the extra time criteria has been met. |
|  extraTimeAmount | `number` | The criteria for extra time, if the raised amount exceeds this amount then the raise can continue into extra time. |
|  reserveTokenDecimals | `number` |  |

<b>Returns:</b>

`BetweenBlocks`

BetweenBlocks

