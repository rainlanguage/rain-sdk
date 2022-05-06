[Home](../index.md) &gt; [ERC20BalanceTierDeployArgs](./erc20balancetierdeployargs.md)

# Interface ERC20BalanceTierDeployArgs

Constructor config for ERC20BalanceTier

<b>Signature:</b>

```typescript
interface ERC20BalanceTierDeployArgs 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [erc20](./erc20balancetierdeployargs.md#erc20-property) | `string` | The erc20 token contract to check the balance of at `report` time |
|  [tierValues](./erc20balancetierdeployargs.md#tierValues-property) | `BigNumberish[]` | 8 values corresponding to minimum erc20 balances for tier 1 through tier 8 |

## Property Details

<a id="erc20-property"></a>

### erc20

The erc20 token contract to check the balance of at `report` time

<b>Signature:</b>

```typescript
erc20: string;
```

<a id="tierValues-property"></a>

### tierValues

8 values corresponding to minimum erc20 balances for tier 1 through tier 8

<b>Signature:</b>

```typescript
tierValues: BigNumberish[];
```
