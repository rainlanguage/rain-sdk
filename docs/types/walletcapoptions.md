
# Type WalletCapOptions

The options to configure the applyWalletCap call script

<b>Signature:</b>

```typescript
type WalletCapOptions = {
    minWalletCap?: number;
    maxWalletCap?: number;
    tierMultiplierMode?: boolean;
    tierAddress?: string;
    tierMultiplier?: number[];
    tierActivation?: (number | string)[];
};
```
