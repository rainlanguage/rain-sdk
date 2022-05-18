
# Interface ERC20TransferTierDeployArgs

Constructor config for ERC20TransferTier

<b>Signature:</b>

```typescript
interface ERC20TransferTierDeployArgs 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [erc20](./erc20transfertierdeployargs.md#erc20-property) | `string` | The erc20 token contract to transfer balances from/to during `setTier` |
|  [tierValues](./erc20transfertierdeployargs.md#tierValues-property) | `BigNumberish[]` | 8 values corresponding to minimum erc20 balances for tiers ONE through EIGHT |

## Property Details

<a id="erc20-property"></a>

### erc20

The erc20 token contract to transfer balances from/to during `setTier`

<b>Signature:</b>

```typescript
erc20: string;
```

<a id="tierValues-property"></a>

### tierValues

8 values corresponding to minimum erc20 balances for tiers ONE through EIGHT

<b>Signature:</b>

```typescript
tierValues: BigNumberish[];
```
