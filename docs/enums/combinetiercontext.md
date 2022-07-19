
# Enum CombineTierContext

Enum for operand of the combineTier's CONTEXT opcode

<b>Signature:</b>

```typescript
enum CombineTierContext 
```

## Enumeration Members

|  Member | Value | Description |
|  --- | --- | --- |
|  Account | `0` | 0 or the index of the context array in the combineTier contract used as the operand for CONTEXT opcode. operand for CONTEXT opcode to stack the account that report is being call for. |
|  Tier | `1` | 1 or the index of the context array in the combineTier contract used as the operand for CONTEXT opcode. operand for CONTEXT opcode to stack the tier that reportTimeForTier is being call for. The tier (between 1 to 8) used for tierTimeForTier and it has no use for "ITIERV2\_REPORT" opcode |

