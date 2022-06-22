
# Class SaleDurationInBlocks

- A class used for creating a VM state for Sale's canLive StateConfig based on block number.

- Like all the method calls, order of calling methods in this class is important in order to produce the desired result, although calling in any order will produce a reliable result, that depends on what the intention is. For example 'applyOwner' should be called at last in order to apply the ownership over the whole script. The general methods calling order in this class is: 1.applyExtarTime or afterMinimumRaise (one of which only) 2.applyOwner

<b>Signature:</b>

```typescript
class SaleDurationInBlocks 
```

## Example


```typescript
//For generating a canLive StateConfig for the sale pass in the required arguments to the constructor.
const saleDuration = new SaleDuration(startBlockNumber, endBlockNumber)

```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [constants](./saledurationinblocks.md#constants-property) | `BigNumberish[]` |  |
|  [endBlockNumber](./saledurationinblocks.md#endBlockNumber-property) | `number` |  |
|  [sources](./saledurationinblocks.md#sources-property) | `BytesLike[]` |  |
|  [startBlockNumber](./saledurationinblocks.md#startBlockNumber-property) | `number` |  |

## Methods

|  Method | Description |
|  --- | --- |
|  [afterMinimumRaise(minimumRaise, erc20decimals)](./saledurationinblocks.md#afterMinimumRaise-method-1) | A method for the sale to be able to end once the sale hits minimumRaise i.e. the minimum amount that needs to be raiseed so the raises status becomes "success" after raise ends. |
|  [applyExtraTime(extraTimeBlocks, extraTimeAmount, erc20decimals)](./saledurationinblocks.md#applyExtraTime-method-1) | Method to apply extra time to the sale duration. if the extra time criteria which is raising more than 'extraTimeAmount' has been met the sale continue for longer (for 'extraTimeBlocks' more blocks). |
|  [applyOwnership(ownerAddress)](./saledurationinblocks.md#applyOwnership-method-1) | Method to apply owner to the sale's canLive function. Sale's canLive functions are public and can be triggered by anyone when the criteria is met, but with using this method for sale's canLive StateConfig, it can be configured in a way that only a certain address can actually trigger the sale's start/end functions. |

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

### afterMinimumRaise(minimumRaise, erc20decimals)

A method for the sale to be able to end once the sale hits minimumRaise i.e. the minimum amount that needs to be raiseed so the raises status becomes "success" after raise ends.

please note that this method should not be used with applyExtraTime as they are opossit of eachother and also the order of using this method along with other methods of this class is important

<b>Signature:</b>

```typescript
afterMinimumRaise(minimumRaise: number, erc20decimals?: number): SaleDurationInBlocks;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  minimumRaise | `number` | the minimumRaise parameter of the raise which is passed at the time of sale's deployment as part of the SaleConfig |
|  erc20decimals | `number` |  |

<b>Returns:</b>

`SaleDurationInBlocks`

this

<a id="applyExtraTime-method-1"></a>

### applyExtraTime(extraTimeBlocks, extraTimeAmount, erc20decimals)

Method to apply extra time to the sale duration. if the extra time criteria which is raising more than 'extraTimeAmount' has been met the sale continue for longer (for 'extraTimeBlocks' more blocks).

- This method is designed for sale's canEndStateConfig and should 'not' be used for canStart

<b>Signature:</b>

```typescript
applyExtraTime(extraTimeBlocks: number, extraTimeAmount: number, erc20decimals?: number): SaleDurationInBlocks;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  extraTimeBlocks | `number` | The amount of time (in blocks) that sale can continue for, if the extra time criteria has been met. |
|  extraTimeAmount | `number` | The criteria for extra time, if the raised amount exceeds this amount then the raise can continue into extra time. |
|  erc20decimals | `number` |  |

<b>Returns:</b>

`SaleDurationInBlocks`

this

<a id="applyOwnership-method-1"></a>

### applyOwnership(ownerAddress)

Method to apply owner to the sale's canLive function. Sale's canLive functions are public and can be triggered by anyone when the criteria is met, but with using this method for sale's canLive StateConfig, it can be configured in a way that only a certain address can actually trigger the sale's start/end functions.

- applyOwnership will apply the ownership over the StateConfig it is been called for, so the order of call is important to get the desired result.

<b>Signature:</b>

```typescript
applyOwnership(ownerAddress: string): SaleDurationInBlocks;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  ownerAddress | `string` | The address that will be the owner, only this wallet address can start or end a raise if this method is applied. |

<b>Returns:</b>

`SaleDurationInBlocks`

this

