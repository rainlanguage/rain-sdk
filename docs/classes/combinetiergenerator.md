
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
|  [constants](./combinetiergenerator.md#constants-property) | `BigNumberish[]` |  |
|  [sources](./combinetiergenerator.md#sources-property) | `BytesLike[]` |  |

## Methods

|  Method | Description |
|  --- | --- |
|  [combineWith(reporter, logic, mode, number)](./combinetiergenerator.md#combineWith-method-1) | Combines 2 tier report with selectLte with its logic and mode, and can be chained for multiple reports each with their own logic and mode |
|  [differenceFrom(reporter)](./combinetiergenerator.md#differenceFrom-method-1) | Saturating difference between 2 reports |
|  [isTierHeldFor(reporter, numberOfBlocks, thresholds, tokenDecimals)](./combinetiergenerator.md#isTierHeldFor-method-1) | Creats a holding time ALWAYS/NEVER tier script for a CombineTier contract out of a TransferTier. |
|  [updateReport(startTier, endTier, number)](./combinetiergenerator.md#updateReport-method-1) | Method to update a report at given tier range (can be any range between 0 to 8) |

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

<a id="combineWith-method-1"></a>

### combineWith(reporter, logic, mode, number)

Combines 2 tier report with selectLte with its logic and mode, and can be chained for multiple reports each with their own logic and mode

<b>Signature:</b>

```typescript
combineWith(reporter: string | StateConfig, logic: selectLteLogic, mode: selectLteMode, number?: number): CombineTierGenerator;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  reporter | `string \| StateConfig` | either a tier contract address or a StateConfig of REPROT script (or any other form of StateConfig desired) |
|  logic | `selectLteLogic` | selectLte logic |
|  mode | `selectLteMode` | selectLte mode |
|  number | `number` | (optional) if passed it would be the number to compare reports against, if not passed reports will be compared against BLOCK\_TIMESTAMP |

<b>Returns:</b>

`CombineTierGenerator`

this

<a id="differenceFrom-method-1"></a>

### differenceFrom(reporter)

Saturating difference between 2 reports

<b>Signature:</b>

```typescript
differenceFrom(reporter: string | StateConfig): this;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  reporter | `string \| StateConfig` | either a tier contract address or a StateConfig of REPROT script (or any other form of StateConfig desired) |

<b>Returns:</b>

`this`

this

<a id="isTierHeldFor-method-1"></a>

### isTierHeldFor(reporter, numberOfBlocks, thresholds, tokenDecimals)

Creats a holding time ALWAYS/NEVER tier script for a CombineTier contract out of a TransferTier.

<b>Signature:</b>

```typescript
isTierHeldFor(reporter: string | StateConfig, numberOfBlocks: number | number[], thresholds?: (number | string)[], tokenDecimals?: number): CombineTierGenerator;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  reporter | `string \| StateConfig` | either a TransferTier contract address or a StateConfig of TransferTier REPORT script (or can be any other form of StateConfig desired) |
|  numberOfBlocks | `number \| number[]` | A number or an array of numbers represting the number of blocks a given tier must be held to get ALWAYS report or else it gets NEVER report. |
|  thresholds | `(number \| string)[]` |  |
|  tokenDecimals | `number` |  |

<b>Returns:</b>

`CombineTierGenerator`

this

<a id="updateReport-method-1"></a>

### updateReport(startTier, endTier, number)

Method to update a report at given tier range (can be any range between 0 to 8)

<b>Signature:</b>

```typescript
updateReport(startTier: Tier, endTier: Tier, number?: number): CombineTierGenerator;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  startTier | [Tier](../enums/tier.md) | start of the report updating range (exclusive) |
|  endTier | [Tier](../enums/tier.md) | end of the report updating range (inclusive) |
|  number | `number` | (optional) if passed it would be the number to compare reports against, if not passed reports will be compared against BLOCK\_TIMESTAMP |

<b>Returns:</b>

`CombineTierGenerator`

this

