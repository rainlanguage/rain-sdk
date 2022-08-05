
# Type Price

Price type

<b>Signature:</b>

```typescript
type Price = {
    struct: StateConfig | Filter<'buy-units'>['buy-units'] | Filter<'constant'>['constant'] | Filter<'increasing-by-time'>['increasing-by-time'] | Filter<'decreasing-by-time'>['decreasing-by-time'] | Filter<'increasing-by-block'>['increasing-by-block'] | Filter<'decreasing-by-block'>['decreasing-by-block'];
    modifier?: Modifier;
};
```
