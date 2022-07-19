
# Type OrderConfig

A type for an order configuration without any specific owner

'inputToken' address - the desired token to be recieved if order clears 'inputVaultId' corresponding inputToken vault 'outputToken' address - the token to be paid if order clears 'outputVaultId' corresponding outputToken vault 'tracking' the tracking state of the order 'vmState' the

<b>Signature:</b>

```typescript
type OrderConfig = {
    inputToken: string;
    inputVaultId: BigNumberish;
    outputToken: string;
    outputVaultId: BigNumberish;
    tracking: BigNumberish;
    vmStateConfig: StateConfig;
};
```
