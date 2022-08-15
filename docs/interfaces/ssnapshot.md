
# Interface sSnapshot

type for SimERC20 with snapshots

<b>Signature:</b>

```typescript
interface sSnapshot extends Record<string, {
    totalSupplyAt: BigNumber;
    balanceOfAt: sStore;
}> 
```

## Implements Interfaces

- <b>sSnapshot</b>
    - Record

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [balanceOfAt](./ssnapshot.md#balanceOfAt-property) | [sStore](./sstore.md) |  |
|  [totalSupplyAt](./ssnapshot.md#totalSupplyAt-property) | `BigNumber` |  |

## Property Details

<a id="balanceOfAt-property"></a>

### balanceOfAt

<b>Signature:</b>

```typescript
balanceOfAt: sStore;
```

<a id="totalSupplyAt-property"></a>

### totalSupplyAt

<b>Signature:</b>

```typescript
totalSupplyAt: BigNumber;
```
