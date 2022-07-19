
# Enum SaleStorage

Enum for operand of the sale's Storage Opcodes

<b>Signature:</b>

```typescript
enum SaleStorage 
```

## Enumeration Members

|  Member | Value | Description |
|  --- | --- | --- |
|  length | `4` | length of Sale's valid storage opcodes - 4 |
|  RemainingUnits | `0` | 0 or the location of the \_remainingUnits property in the sale contract used as the operand for STORAGE opcode operand for STORAGE opcode to stack remaining rTKN units. |
|  ReserveAddress | `3` | 3 or the location of the \_reserve property in the sale contract used as the operand for STORAGE opcode. operand for STORAGE opcode to stack the address of the reserve token. |
|  TokenAddress | `2` | 2 or the location of the \_token property in the sale contract used as the operand for STORAGE opcode. operand for STORAGE opcode to stack the address of the rTKN. |
|  TotalReserveIn | `1` | 1 or the location of the \_totalReserveIn property in the sale contract used as the operand for STORAGE opcode. operand for STORAGE opcode to stack total reserve taken in so far. |

