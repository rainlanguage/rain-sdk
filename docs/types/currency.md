
# Type Currency

Type of a single currency, the main parameter used in RuleBuilder to build the StateConfig

<b>Signature:</b>

```typescript
type Currency = {
    rules: Rule[];
    default: Default;
    quantityGlobalModifier?: Modifier;
    priceGlobalModifier?: Modifier;
    pick: {
        quantities: Extract<Operator, 'min' | 'max'>;
        prices: Extract<Operator, 'min' | 'max'>;
    };
};
```
