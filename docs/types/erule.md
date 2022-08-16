
# Type eRule

Type of a evaluated Rule with JSVM, which is the same as Rule with a result property

<b>Signature:</b>

```typescript
type eRule = {
    quantityConditions: eConditionGroup;
    priceConditions: eConditionGroup;
    quantity: Quantity;
    price: Price;
    result: {
        quantity: BigNumber;
        price: BigNumber;
    };
};
```
