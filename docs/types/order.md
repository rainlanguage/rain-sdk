
# Type Order

Type for an order containing all that is required in an order. An Order is an

<b>Signature:</b>

```typescript
type Order = {
    owner: string;
    validInputs: IOConfig[];
    validOutputs: IOConfig[];
    tracking: BigNumberish;
    vmState: BytesLike;
};
```
