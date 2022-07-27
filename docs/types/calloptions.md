
# Type CallOptions

Options for instantiating RainJSVM

<b>Signature:</b>

```typescript
type CallOptions = {
    signer?: Signer;
    contract?: string | Contract;
    applyOpFn?: FnPtrsJSVM;
    storageOpFn?: FnPtrsJSVM;
    opMeta?: Map<number, IOpMeta>;
};
```
