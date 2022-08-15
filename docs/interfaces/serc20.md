
# Interface sERC20

type for simulating and storing ERC20token contract data

<b>Signature:</b>

```typescript
interface sERC20 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [balanceOf](./serc20.md#balanceOf-property) | [sStore](./sstore.md) |  |
|  [decimals](./serc20.md#decimals-property) | `number` |  |
|  [snapshots](./serc20.md#snapshots-property) | [sSnapshot](./ssnapshot.md) |  |
|  [totalSupply](./serc20.md#totalSupply-property) | `BigNumber` |  |

## Property Details

<a id="balanceOf-property"></a>

### balanceOf

<b>Signature:</b>

```typescript
balanceOf: sStore;
```

<a id="decimals-property"></a>

### decimals

<b>Signature:</b>

```typescript
decimals: number;
```

<a id="snapshots-property"></a>

### snapshots

<b>Signature:</b>

```typescript
snapshots?: sSnapshot;
```

<a id="totalSupply-property"></a>

### totalSupply

<b>Signature:</b>

```typescript
totalSupply: BigNumber;
```
