
# Type Args

Type of a single valid Strcut's args (union of all possible args)

<b>Signature:</b>

```typescript
type Args = Exclude<Struct, StateConfig>['args'];
```
