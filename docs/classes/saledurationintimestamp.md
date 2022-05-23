
# Class SaleDurationInTimestamp

- A class used for creating a VM state for Sale's canEnd/StartStateConfig based on timestamp.

- If the VM result is greater than '0' then sale can start/end and if it is '0' it simply cannot. The basic constructed object is a simple timestamp based condition for sale's canStart/EndStateConfig, but with using the methods in the class more complex conditions can be created for how the sale's duration will work.

\*\*important\*\* - Like all the method calls, order of calling methods in this class is important in order to produce the desired result, although calling in any order will produce a reliable result, that depends on what the intention is. For example 'applyOwner' should be called at last in order to apply the ownership over the whole script. The general methods calling order in this class is: 1.applyExtarTime 2.applyOwner

<b>Signature:</b>

```typescript
class SaleDurationInTimestamp 
```

## Example


```typescript
//For generating a canStart/End StateConfig for the sale pass in the required arguments to the constructor.
const saleType = new SaleDuration(timestamp)

```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [argumentsLength](./saledurationintimestamp.md#argumentsLength-property) | `BigNumberish` |  |
|  [constants](./saledurationintimestamp.md#constants-property) | `BigNumberish[]` |  |
|  [sources](./saledurationintimestamp.md#sources-property) | `BytesLike[]` |  |
|  [stackLength](./saledurationintimestamp.md#stackLength-property) | `BigNumberish` |  |
|  [timestamp](./saledurationintimestamp.md#timestamp-property) | `BigNumberish` |  |

## Methods

|  Method | Description |
|  --- | --- |
|  [applyExtraTime(extraTime, extraTimeAmount)](./saledurationintimestamp.md#applyExtraTime-method-1) | Method to apply extra time to the sale duration. if the extra time criteria which is raising more than 'extraTimeAmount' has been met the sale continue for longer (for 'extraTime' more minutes).<br></br>\*\*important\*\* - If the sale has extra time discount, it is important that this method to be applied for canEndStateConfig of the sale. \*\*important\*\* - This method is designed for sale's canEndStateConfig and should 'not' be used for canStart |
|  [applyOwnership(ownerAddress)](./saledurationintimestamp.md#applyOwnership-method-1) | Method to apply owner to the sale's canStart and/or canEnd function. Sale's canStart/End functions are public and can be triggered by anyone when the criteria is met, but with using this method for sale's canStart/EndStateConfig, it can configured in a way that only a certain address can actually trigger the sale's start/end functions.<br></br>\*\*important\*\* - applyOwnership will apply the ownership over the StateConfig it is been called for, so the order of call is important to get the desired result. |

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

<a id="timestamp-property"></a>

### timestamp

<b>Signature:</b>

```typescript
readonly timestamp: BigNumberish;
```

## Method Details

<a id="applyExtraTime-method-1"></a>

### applyExtraTime(extraTime, extraTimeAmount)

Method to apply extra time to the sale duration. if the extra time criteria which is raising more than 'extraTimeAmount' has been met the sale continue for longer (for 'extraTime' more minutes).

\*\*important\*\* - If the sale has extra time discount, it is important that this method to be applied for canEndStateConfig of the sale. \*\*important\*\* - This method is designed for sale's canEndStateConfig and should 'not' be used for canStart

<b>Signature:</b>

```typescript
applyExtraTime(extraTime: BigNumberish, extraTimeAmount: BigNumberish): this;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  extraTime | `BigNumberish` | The amount of time (in minutes) that sale can continue for, if the extra time criteria has been met. |
|  extraTimeAmount | `BigNumberish` | The criteria for extra time, if the raised amount exceeds this amount then the raise can continue into extra time. |

<b>Returns:</b>

`this`

this

<a id="applyOwnership-method-1"></a>

### applyOwnership(ownerAddress)

Method to apply owner to the sale's canStart and/or canEnd function. Sale's canStart/End functions are public and can be triggered by anyone when the criteria is met, but with using this method for sale's canStart/EndStateConfig, it can configured in a way that only a certain address can actually trigger the sale's start/end functions.

\*\*important\*\* - applyOwnership will apply the ownership over the StateConfig it is been called for, so the order of call is important to get the desired result.

<b>Signature:</b>

```typescript
applyOwnership(ownerAddress: string): this;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  ownerAddress | `string` | The address that will be the owner, only this wallet address can start or end a raise if this method is applied. |

<b>Returns:</b>

`this`

this

