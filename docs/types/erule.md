
# Type eRule

Type of a evaluated Rule with JSVM, which is the same as Rule with a result property

<b>Signature:</b>

```typescript
type eRule = {
    quantityConditions: eConditionGroup;
    priceConditions: eConditionGroup;
    quantity: Omit<Quantity, 'modifier'> & {
        modifier?: Omit<Modifier, 'condition'> & {
            condition: eConditionGroup;
        };
    };
    price: Omit<Price, 'modifier'> & {
        modifier?: Omit<Modifier, 'condition'> & {
            condition: eConditionGroup;
        };
    };
    result: {
        quantity: BigNumber;
        price: BigNumber;
    };
};
```
