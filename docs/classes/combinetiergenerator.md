
# Class CombineTierGenerator

The script generator for generating CombineTier scripts although it is worth mentioning that the usecases would not be only limited to CombineTier contract and can be used for any script.

<b>Signature:</b>

```typescript
class CombineTierGenerator 
```

## Example

new CombineTier(a tierAddress or a StateConfig)

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [argumentsLength](./combinetiergenerator.md#argumentsLength-property) | `BigNumberish` |  |
|  [constants](./combinetiergenerator.md#constants-property) | `BigNumberish[]` |  |
|  [sources](./combinetiergenerator.md#sources-property) | `BytesLike[]` |  |
|  [stackLength](./combinetiergenerator.md#stackLength-property) | `BigNumberish` |  |

## Methods

|  Method | Description |
|  --- | --- |
|  [combine(reportVar, logic, mode, number)](./combinetiergenerator.md#combine-method-1) | Combines 2 tier report with selectLte with its logic and mode, and can be chained for multiple reports each with their own logic and mode |
|  [holdingTimeTransferTier(reportVar, numberOfBlocks)](./combinetiergenerator.md#holdingTimeTransferTier-method-1) | Creats a holding time ALWAYS/NEVER tier script for a CombineTier contract out of a TransferTier. |
|  [satDiff(reportVar)](./combinetiergenerator.md#satDiff-method-1) | Saturating difference between 2 reports |
|  [updateReportAtTierRange(startTier, endTier, number)](./combinetiergenerator.md#updateReportAtTierRange-method-1) | Method to update a report at given tier range (can be any range between 0 to 8) |

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

<a id="combine-method-1"></a>

### combine(reportVar, logic, mode, number)

Combines 2 tier report with selectLte with its logic and mode, and can be chained for multiple reports each with their own logic and mode

<b>Signature:</b>

```typescript
combine(reportVar: string | StateConfig, logic: selectLteLogic, mode: selectLteMode, number?: number): this;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  reportVar | `string \| StateConfig` | either a tier contract address or a StateConfig of REPROT script (or any other form of StateConfig desired) |
|  logic | `selectLteLogic` | selectLte logic |
|  mode | `selectLteMode` | selectLte mode |
|  number | `number` | (optional) if passed it would be the number to compare reports against, if not passed reports will be compared against BLOCK\_NUMBER |

<b>Returns:</b>

`this`

this

<a id="holdingTimeTransferTier-method-1"></a>

### holdingTimeTransferTier(reportVar, numberOfBlocks)

Creats a holding time ALWAYS/NEVER tier script for a CombineTier contract out of a TransferTier.

<b>Signature:</b>

```typescript
holdingTimeTransferTier(reportVar: string | StateConfig, numberOfBlocks: number | number[]): this;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  reportVar | `string \| StateConfig` | either a TransferTier contract address or a StateConfig of TransferTier REPORT script (or can be any other form of StateConfig desired) |
|  numberOfBlocks | `number \| number[]` | A number or an array of numbers represting the number of blocks a given tier must be held to get ALWAYS report or else it gets NEVER report. |

<b>Returns:</b>

`this`

this

<a id="satDiff-method-1"></a>

### satDiff(reportVar)

Saturating difference between 2 reports

<b>Signature:</b>

```typescript
satDiff(reportVar: string | StateConfig): this;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  reportVar | `string \| StateConfig` | either a tier contract address or a StateConfig of REPROT script (or any other form of StateConfig desired) |

<b>Returns:</b>

`this`

this

<a id="updateReportAtTierRange-method-1"></a>

### updateReportAtTierRange(startTier, endTier, number)

Method to update a report at given tier range (can be any range between 0 to 8)

<b>Signature:</b>

```typescript
updateReportAtTierRange(startTier: Tier, endTier: Tier, number?: number): this;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  startTier | [Tier](../enums/tier.md) | start of the report updating range (exclusive) |
|  endTier | [Tier](../enums/tier.md) | end of the report updating range (inclusive) |
|  number | `number` | (optional) if passed it would be the number to compare reports against, if not passed reports will be compared against BLOCK\_NUMBER |

<b>Returns:</b>

`this`

this

