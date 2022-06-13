
# Type EmissionsConfig

A type for newing Emissions script

<b>Signature:</b>

```typescript
type EmissionsConfig = {
    tierAddress: string;
    blockTime: number;
    period: number;
    periodicRewards: {
        tier1: number;
        tier2: number;
        tier3: number;
        tier4: number;
        tier5: number;
        tier6: number;
        tier7: number;
        tier8: number;
    };
    maxPeriodicRewards?: {
        tier1: number;
        tier2: number;
        tier3: number;
        tier4: number;
        tier5: number;
        tier6: number;
        tier7: number;
        tier8: number;
    };
    numberOfIncrements?: number;
};
```
