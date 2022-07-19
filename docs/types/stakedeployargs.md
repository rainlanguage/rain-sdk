
# Type StakeDeployArgs

A type for deploying a new stake contract which contains everything required for deployment.

'token' is the main token addtess. 'initialRatio' is the initial conversion ratio between the stake token and main token. 'name' of the stake token. 'symbol' of the stake token

<b>Signature:</b>

```typescript
type StakeDeployArgs = {
    token: string;
    initialRatio: BigNumberish;
    name: string;
    symbol: string;
};
```
