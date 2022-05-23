
# Enum VerifyStatus

Summary statuses derived from a `State` by comparing the `Since` times against a specific block number.

<b>Signature:</b>

```typescript
enum VerifyStatus 
```

## Enumeration Members

|  Member | Value | Description |
|  --- | --- | --- |
|  ADDED | `1` | Account has added evidence for themselves. |
|  APPROVED | `2` | Approver has reviewed added/approve evidence and approved the account. |
|  BANNED | `3` | Banner has reviewed a request to ban an account and banned it. |
|  NIL | `0` | Account has not interacted with the system yet or was removed. |

