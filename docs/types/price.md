
# Type Price

Price type

<b>Signature:</b>

```typescript
type Price = {
    struct: StateConfig | Filter<'input'>['input'] | Filter<'constant'>['constant'] | Filter<'increasing-by-time'>['increasing-by-time'] | Filter<'decreasing-by-time'>['decreasing-by-time'] | Filter<'increasing-by-block'>['increasing-by-block'] | Filter<'decreasing-by-block'>['decreasing-by-block'] | Filter<'increasing-by-time-period'>['increasing-by-time-period'] | Filter<'decreasing-by-time-period'>['decreasing-by-time-period'] | Filter<'increasing-by-block-period'>['increasing-by-block-period'] | Filter<'decreasing-by-block-period'>['decreasing-by-block-period'];
    modifier?: Modifier;
};
```
