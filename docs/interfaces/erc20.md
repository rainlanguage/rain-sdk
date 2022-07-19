
# Interface erc20

type for simulating and storing ERC20token contract data

<b>Signature:</b>

```typescript
interface erc20 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [balanceOf](./erc20.md#balanceOf-property) | <pre>{&#010;    [wallet: string]: BigNumber;&#010;}</pre> |  |
|  [decimals](./erc20.md#decimals-property) | `number` |  |
|  [snapshots](./erc20.md#snapshots-property) | <pre>{&#010;    [id: string]: {&#010;        totalSupplyAt: BigNumber;&#010;        balanceOfAt: {&#010;            [wallet: string]: BigNumber;&#010;        };&#010;    };&#010;}</pre> |  |
|  [totalSupply](./erc20.md#totalSupply-property) | `BigNumber` |  |

## Property Details

<a id="balanceOf-property"></a>

### balanceOf

<b>Signature:</b>

```typescript
balanceOf: {
        [wallet: string]: BigNumber;
    };
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
snapshots?: {
        [id: string]: {
            totalSupplyAt: BigNumber;
            balanceOfAt: {
                [wallet: string]: BigNumber;
            };
        };
    };
```

<a id="totalSupply-property"></a>

### totalSupply

<b>Signature:</b>

```typescript
totalSupply: BigNumber;
```
