[Home](../index.md) &gt; [ERC721BalanceTierDeployArgs](./erc721balancetierdeployargs.md)

# Interface ERC721BalanceTierDeployArgs

Constructor config for ERC721BalanceTier

<b>Signature:</b>

```typescript
interface ERC721BalanceTierDeployArgs 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [erc721](./erc721balancetierdeployargs.md#erc721-property) | `string` | The erc721 token contract to check the balance of at `report` time |
|  [tierValues](./erc721balancetierdeployargs.md#tierValues-property) | `BigNumberish[]` | 8 values corresponding to minimum erc721 balances for tier 1 through tier 8 |

## Property Details

<a id="erc721-property"></a>

### erc721

The erc721 token contract to check the balance of at `report` time

<b>Signature:</b>

```typescript
erc721: string;
```

<a id="tierValues-property"></a>

### tierValues

8 values corresponding to minimum erc721 balances for tier 1 through tier 8

<b>Signature:</b>

```typescript
tierValues: BigNumberish[];
```
