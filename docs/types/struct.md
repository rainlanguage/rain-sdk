
# Type Struct

The smallest building block of RuleBuilder that contains the type and its valid arguments or a StateConfig

<b>Signature:</b>

```typescript
type Struct = StateConfig | Filter<'buy-units'>['buy-units'] | Filter<'before-time'>['before-time'] | Filter<'after-time'>['after-time'] | Filter<'between-times'>['between-times'] | Filter<'before-block'>['before-block'] | Filter<'after-block'>['after-block'] | Filter<'between-blocks'>['between-blocks'] | Filter<'has-min-tier'>['has-min-tier'] | Filter<'has-any-tier'>['has-any-tier'] | Filter<'user-erc20-balance'>['user-erc20-balance'] | Filter<'erc20-total-supply'>['erc20-total-supply'] | Filter<'user-erc721-balance'>['user-erc721-balance'] | Filter<'erc721-owner'>['erc721-owner'] | Filter<'user-erc1155-balance'>['user-erc1155-balance'] | Filter<'user-erc20-snapshot-balance'>['user-erc20-snapshot-balance'] | Filter<'erc20-snapshot-total-supply'>['erc20-snapshot-total-supply'] | Filter<'constant'>['constant'] | Filter<'increasing-by-time'>['increasing-by-time'] | Filter<'decreasing-by-time'>['decreasing-by-time'] | Filter<'increasing-by-block'>['increasing-by-block'] | Filter<'decreasing-by-block'>['decreasing-by-block'];
```
