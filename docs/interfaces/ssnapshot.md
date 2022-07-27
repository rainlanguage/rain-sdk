
# Interface SSnapshot

type for SimERC20 with snapshots

<b>Signature:</b>

```typescript
interface SSnapshot extends Record<string, {
    totalSupplyAt: BigNumber;
    balanceOfAt: SStore;
}> 
```

## Implements Interfaces

- <b>SSnapshot</b>
    - Record

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [balanceOfAt](./ssnapshot.md#balanceOfAt-property) | [SStore](./sstore.md) |  |
|  [totalSupplyAt](./ssnapshot.md#totalSupplyAt-property) | `BigNumber` |  |

## Property Details

<a id="balanceOfAt-property"></a>

### balanceOfAt

<b>Signature:</b>

```typescript
balanceOfAt: SStore;
```

<a id="totalSupplyAt-property"></a>

### totalSupplyAt

<b>Signature:</b>

```typescript
totalSupplyAt: BigNumber;
```
