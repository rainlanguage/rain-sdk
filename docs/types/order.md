
# Type Order

Type for an order containing all that is required in an order. An Order is an

<b>Signature:</b>

```typescript
type Order = {
    owner: string;
    inputToken: string;
    inputVaultId: BigNumberish;
    outputToken: string;
    outputVaultId: BigNumberish;
    tracking: BigNumberish;
    vmState: BytesLike;
};
```
