
# Interface RedeemableERC20DeployArgs

Everything required by the `RedeemableERC20` constructor.

<b>Signature:</b>

```typescript
interface RedeemableERC20DeployArgs 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [distributionEndForwardingAddress](./redeemableerc20deployargs.md#distributionEndForwardingAddress-property) | `string` | Optional address to send rTKN to at the end of the distribution phase. If `0` address then all undistributed rTKN will burn itself at the end of the distribution. |
|  [erc20Config](./redeemableerc20deployargs.md#erc20Config-property) | [ERC20Config](./erc20config.md) | ERC20 config forwarded to the ERC20 constructor. |
|  [minimumTier](./redeemableerc20deployargs.md#minimumTier-property) | `BigNumberish` | Minimum tier required for transfers in `Phase.ZERO`<!-- -->. Can be `0`<!-- -->. |
|  [reserve](./redeemableerc20deployargs.md#reserve-property) | `string` | Reserve token that the associated `Trust` or equivalent raise contract will be forwarding to the `RedeemableERC20` contract. |
|  [tier](./redeemableerc20deployargs.md#tier-property) | `string` | Tier contract to compare statuses against on transfer. |

## Property Details

<a id="distributionEndForwardingAddress-property"></a>

### distributionEndForwardingAddress

Optional address to send rTKN to at the end of the distribution phase. If `0` address then all undistributed rTKN will burn itself at the end of the distribution.

<b>Signature:</b>

```typescript
distributionEndForwardingAddress: string;
```

<a id="erc20Config-property"></a>

### erc20Config

ERC20 config forwarded to the ERC20 constructor.

<b>Signature:</b>

```typescript
erc20Config: ERC20Config;
```

<a id="minimumTier-property"></a>

### minimumTier

Minimum tier required for transfers in `Phase.ZERO`<!-- -->. Can be `0`<!-- -->.

<b>Signature:</b>

```typescript
minimumTier: BigNumberish;
```

<a id="reserve-property"></a>

### reserve

Reserve token that the associated `Trust` or equivalent raise contract will be forwarding to the `RedeemableERC20` contract.

<b>Signature:</b>

```typescript
reserve: string;
```

<a id="tier-property"></a>

### tier

Tier contract to compare statuses against on transfer.

<b>Signature:</b>

```typescript
tier: string;
```
