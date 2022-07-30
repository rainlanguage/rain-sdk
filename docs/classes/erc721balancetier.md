
# Class ERC721BalanceTier

class to create a the vmStateConfig for CombineTier as BalanceTier. this will perform similar to ERC721BalancTier in RainVM version 1.0

<b>Signature:</b>

```typescript
class ERC721BalanceTier extends CombineTierGenerator 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [constants](./combinetiergenerator.md#constants-property) | `BigNumberish[]` | *Inherited from [CombineTierGenerator.constants](./combinetiergenerator.md#constants-property)* |
|  [sources](./combinetiergenerator.md#sources-property) | `BytesLike[]` | *Inherited from [CombineTierGenerator.sources](./combinetiergenerator.md#sources-property)* |
|  [tierValues](./erc721balancetier.md#tierValues-property) | `(number \| string)[]` |  |
|  [tokenAddress](./erc721balancetier.md#tokenAddress-property) | `string` |  |

## Methods

|  Method | Description |
|  --- | --- |
|  [combineWith(reporter, logic, mode, hasReportForSingleTier, delegatedReport, number)](./combinetiergenerator.md#combineWith-method-1) | Combines 2 tier report with selectLte with its logic and mode, and can be chained for multiple reports each with their own logic and mode<br></br>*Inherited from [CombineTierGenerator.combineWith()](./combinetiergenerator.md#combineWith-method-1)* |
|  [differenceFrom(reporter, delegatedReport)](./combinetiergenerator.md#differenceFrom-method-1) | Saturating difference between 2 reports<br></br>*Inherited from [CombineTierGenerator.differenceFrom()](./combinetiergenerator.md#differenceFrom-method-1)* |
|  [isTierHeldFor(duration)](./combinetiergenerator.md#isTierHeldFor-method-1) | Creats a holding time ALWAYS/NEVER tier script for a Combinetier contract out of a Stake contract.<br></br>*Inherited from [CombineTierGenerator.isTierHeldFor()](./combinetiergenerator.md#isTierHeldFor-method-1)* |
|  [updateReport(startTier, endTier, number)](./combinetiergenerator.md#updateReport-method-1) | Method to update a report at given tier range (can be any range between 0 to 8)<br></br>*Inherited from [CombineTierGenerator.updateReport()](./combinetiergenerator.md#updateReport-method-1)* |

## Property Details

<a id="tierValues-property"></a>

### tierValues

<b>Signature:</b>

```typescript
readonly tierValues: (number | string)[];
```

<a id="tokenAddress-property"></a>

### tokenAddress

<b>Signature:</b>

```typescript
readonly tokenAddress: string;
```
