
# Type OrderBookOpcodes

Type for the opcodes availables in a OrderBook instance.

<b>Signature:</b>

```typescript
type OrderBookOpcodes = typeof AllStandardOps & {
    ORDER_FUNDS_CLEARED: number;
    COUNTERPARTY_FUNDS_CLEARED: number;
};
```
