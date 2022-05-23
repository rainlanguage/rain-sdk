
# Type SaleOpcodes

Type for the opcodes availables in a CombineTier instance.

<b>Signature:</b>

```typescript
type SaleOpcodes = typeof VM.Opcodes & {
    REMAINING_UNITS: number;
    TOTAL_RESERVE_IN: number;
    CURRENT_BUY_UNITS: number;
    TOKEN_ADDRESS: number;
    RESERVE_ADDRESS: number;
};
```
