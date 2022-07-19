
# Type CallOptions

Options for instantiating RainJSVM

<b>Signature:</b>

```typescript
type CallOptions = {
    signer?: Signer;
    contract?: string | Contract;
    applyOpFn?: FnPtrs;
    storageOpFn?: FnPtrs;
    opMeta?: Map<number, IOpMeta>;
};
```
