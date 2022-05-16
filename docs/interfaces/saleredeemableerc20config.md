[Home](../index.md) &gt; [SaleRedeemableERC20Config](./saleredeemableerc20config.md)

# Interface SaleRedeemableERC20Config

Configuration that will have the Redeemable of the Sale

<b>Signature:</b>

```typescript
interface SaleRedeemableERC20Config 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [distributionEndForwardingAddress](./saleredeemableerc20config.md#distributionEndForwardingAddress-property) | `string` | Optional address to send rTKN to at the end of the distribution phase. If `0` address then all undistributed rTKN will burn itself at the end of the distribution. |
|  [erc20Config](./saleredeemableerc20config.md#erc20Config-property) | [ERC20Config](./erc20config.md) | ERC20 config |
|  [minimumTier](./saleredeemableerc20config.md#minimumTier-property) | `BigNumberish` | Minimum tier required for transfers (i.e. to participate). Can be '0'. |
|  [tier](./saleredeemableerc20config.md#tier-property) | `string` | Tier contract to compare statuses against on transfer. This effectively gates participation in a Sale. |

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

ERC20 config

<b>Signature:</b>

```typescript
erc20Config: ERC20Config;
```

<a id="minimumTier-property"></a>

### minimumTier

Minimum tier required for transfers (i.e. to participate). Can be '0'.

<b>Signature:</b>

```typescript
minimumTier: BigNumberish;
```

<a id="tier-property"></a>

### tier

Tier contract to compare statuses against on transfer. This effectively gates participation in a Sale.

<b>Signature:</b>

```typescript
tier: string;
```
