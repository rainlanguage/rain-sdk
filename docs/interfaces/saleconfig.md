
# Interface SaleConfig

The configuration of the sale

<b>Signature:</b>

```typescript
interface SaleConfig 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [cooldownDuration](./saleconfig.md#cooldownDuration-property) | `BigNumberish` | The amount of blocks after each buy/refund, before a user is allowed another buy/refund. |
|  [dustSize](./saleconfig.md#dustSize-property) | `BigNumberish` | The minimum amount of rTKN that must remain in the Sale contract unless it is all purchased, clearing the raise to 0 stock and thus ending the raise. |
|  [minimumRaise](./saleconfig.md#minimumRaise-property) | `BigNumberish` | defines the amount of reserve required to raise tha defines success/fail of the sale. Reaching the minimum raise DOES NOT cause the raise to end early (unless the "can end" script allows it of course). |
|  [recipient](./saleconfig.md#recipient-property) | `string` | The recipient of the proceeds of a Sale, if/when the Sale is successful. |
|  [reserve](./saleconfig.md#reserve-property) | `string` | The reserve token the Sale is deonominated in. |
|  [saleTimeout](./saleconfig.md#saleTimeout-property) | `BigNumberish` | The number of blocks before this sale can timeout. SHOULD be well after the expected end time as a timeout will fail an active or pending sale regardless of any funds raised. |
|  [vmStateConfig](./saleconfig.md#vmStateConfig-property) | [StateConfig](./stateconfig.md) | SateConfig that has both canLive and calculateBuy StateConfigs for a sale. The first item in the sources is the canLive StateConfig and the second item in the sources is the calculateBuy StateConfig. |

## Property Details

<a id="cooldownDuration-property"></a>

### cooldownDuration

The amount of blocks after each buy/refund, before a user is allowed another buy/refund.

<b>Signature:</b>

```typescript
cooldownDuration: BigNumberish;
```

<a id="dustSize-property"></a>

### dustSize

The minimum amount of rTKN that must remain in the Sale contract unless it is all purchased, clearing the raise to 0 stock and thus ending the raise.

<b>Signature:</b>

```typescript
dustSize: BigNumberish;
```

<a id="minimumRaise-property"></a>

### minimumRaise

defines the amount of reserve required to raise tha defines success/fail of the sale. Reaching the minimum raise DOES NOT cause the raise to end early (unless the "can end" script allows it of course).

<b>Signature:</b>

```typescript
minimumRaise: BigNumberish;
```

<a id="recipient-property"></a>

### recipient

The recipient of the proceeds of a Sale, if/when the Sale is successful.

<b>Signature:</b>

```typescript
recipient: string;
```

<a id="reserve-property"></a>

### reserve

The reserve token the Sale is deonominated in.

<b>Signature:</b>

```typescript
reserve: string;
```

<a id="saleTimeout-property"></a>

### saleTimeout

The number of blocks before this sale can timeout. SHOULD be well after the expected end time as a timeout will fail an active or pending sale regardless of any funds raised.

<b>Signature:</b>

```typescript
saleTimeout: BigNumberish;
```

<a id="vmStateConfig-property"></a>

### vmStateConfig

SateConfig that has both canLive and calculateBuy StateConfigs for a sale. The first item in the sources is the canLive StateConfig and the second item in the sources is the calculateBuy StateConfig.

<b>Signature:</b>

```typescript
vmStateConfig: StateConfig;
```
