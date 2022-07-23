
# Type OrderConfig

A type for an order configuration without any specific owner

<b>Signature:</b>

```typescript
type OrderConfig = {
    validInputs: IOConfig[];
    validOutputs: IOConfig[];
    tracking: BigNumberish;
    vmStateConfig: StateConfig;
};
```
