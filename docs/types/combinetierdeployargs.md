
# Type CombineTierDeployArgs

The argument of the CombineTier. The StateConfig will be deployed as a pointer under VM State Pointer.

It will be built with the desired configuration for the CombineTier allowing to customize the behavior of the Tier as needed and specified.

<b>Signature:</b>

```typescript
type CombineTierDeployArgs = {
    combinedTiersLength: BigNumberish;
    sourceConfig: StateConfig;
};
```
