[Home](../index.md) &gt; [SaleConfig](./saleconfig.md)

# Interface SaleConfig

The configuration of the sale

<b>Signature:</b>

```typescript
interface SaleConfig 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [calculatePriceStateConfig](./saleconfig.md#calculatePriceStateConfig-property) | [StateConfig](./stateconfig.md) | State config for the script that defines the current price quoted by a Sale. |
|  [canEndStateConfig](./saleconfig.md#canEndStateConfig-property) | [StateConfig](./stateconfig.md) | State config for the script that allows a Sale to end. IMPORTANT: A Sale can always end if/when its rTKN sells out, regardless of the result of this script. |
|  [canStartStateConfig](./saleconfig.md#canStartStateConfig-property) | [StateConfig](./stateconfig.md) | State config for the script that allows a Sale to start. |
|  [cooldownDuration](./saleconfig.md#cooldownDuration-property) | `BigNumberish` | The amount of blocks after each buy/refund, before a user is allowed another buy/refund. |
|  [dustSize](./saleconfig.md#dustSize-property) | `BigNumberish` | The minimum amount of rTKN that must remain in the Sale contract unless it is all purchased, clearing the raise to 0 stock and thus ending the raise. |
|  [minimumRaise](./saleconfig.md#minimumRaise-property) | `BigNumberish` | defines the amount of reserve required to raise tha defines success/fail of the sale. Reaching the minimum raise DOES NOT cause the raise to end early (unless the "can end" script allows it of course). |
|  [recipient](./saleconfig.md#recipient-property) | `string` | The recipient of the proceeds of a Sale, if/when the Sale is successful. |
|  [reserve](./saleconfig.md#reserve-property) | `string` | The reserve token the Sale is deonominated in. |
|  [saleTimeout](./saleconfig.md#saleTimeout-property) | `BigNumberish` | The number of blocks before this sale can timeout. SHOULD be well after the expected end time as a timeout will fail an active or pending sale regardless of any funds raised. |

## Property Details

<a id="calculatePriceStateConfig-property"></a>

### calculatePriceStateConfig

State config for the script that defines the current price quoted by a Sale.

<b>Signature:</b>

```typescript
calculatePriceStateConfig: StateConfig;
```

<a id="canEndStateConfig-property"></a>

### canEndStateConfig

State config for the script that allows a Sale to end. IMPORTANT: A Sale can always end if/when its rTKN sells out, regardless of the result of this script.

<b>Signature:</b>

```typescript
canEndStateConfig: StateConfig;
```

<a id="canStartStateConfig-property"></a>

### canStartStateConfig

State config for the script that allows a Sale to start.

<b>Signature:</b>

```typescript
canStartStateConfig: StateConfig;
```

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
