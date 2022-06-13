
# Class BuildReport

A class for creating a report-like script which inherits from CombineTierGenerator

<b>Signature:</b>

```typescript
class BuildReport extends CombineTierGenerator 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [argumentsLength](./combinetiergenerator.md#argumentsLength-property) | `BigNumberish` | *Inherited from [CombineTierGenerator.argumentsLength](./combinetiergenerator.md#argumentsLength-property)* |
|  [constants](./combinetiergenerator.md#constants-property) | `BigNumberish[]` | *Inherited from [CombineTierGenerator.constants](./combinetiergenerator.md#constants-property)* |
|  [sources](./combinetiergenerator.md#sources-property) | `BytesLike[]` | *Inherited from [CombineTierGenerator.sources](./combinetiergenerator.md#sources-property)* |
|  [stackLength](./combinetiergenerator.md#stackLength-property) | `BigNumberish` | *Inherited from [CombineTierGenerator.stackLength](./combinetiergenerator.md#stackLength-property)* |

## Methods

|  Method | Description |
|  --- | --- |
|  [combine(reportVar, logic, mode, number)](./combinetiergenerator.md#combine-method-1) | Combines 2 tier report with selectLte with its logic and mode, and can be chained for multiple reports each with their own logic and mode<br></br>*Inherited from [CombineTierGenerator.combine()](./combinetiergenerator.md#combine-method-1)* |
|  [holdingTimeTransferTier(reportVar, numberOfBlocks)](./combinetiergenerator.md#holdingTimeTransferTier-method-1) | Creats a holding time ALWAYS/NEVER tier script for a CombineTier contract out of a TransferTier.<br></br>*Inherited from [CombineTierGenerator.holdingTimeTransferTier()](./combinetiergenerator.md#holdingTimeTransferTier-method-1)* |
|  [satDiff(reportVar)](./combinetiergenerator.md#satDiff-method-1) | Saturating difference between 2 reports<br></br>*Inherited from [CombineTierGenerator.satDiff()](./combinetiergenerator.md#satDiff-method-1)* |
|  [updateReportAtTierRange(startTier, endTier, number)](./combinetiergenerator.md#updateReportAtTierRange-method-1) | Method to update a report at given tier range (can be any range between 0 to 8)<br></br>*Inherited from [CombineTierGenerator.updateReportAtTierRange()](./combinetiergenerator.md#updateReportAtTierRange-method-1)* |

