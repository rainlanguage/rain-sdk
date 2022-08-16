
# Type eCurrency

Type of a evaluated Currency with JSVM, which is the same as Currency with a result property

<b>Signature:</b>

```typescript
type eCurrency = {
    rules: eRule[];
    default: Default;
    quantityGlobalModifier?: Modifier;
    priceGlobalModifier?: Modifier;
    pick: {
        quantities: Extract<Operator, 'min' | 'max'>;
        prices: Extract<Operator, 'min' | 'max'>;
    };
    result: {
        quantity: BigNumber;
        price: BigNumber;
    };
};
```
