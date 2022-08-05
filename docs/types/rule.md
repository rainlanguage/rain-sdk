
# Type Rule

A single Rule block, i.e. an if/then block that contains conditions of prices and quantities and its actions which are price and quantity

If the price and quantity conditions are the same just put the same object in both of 'quantityConditions' and 'priceConditions

<b>Signature:</b>

```typescript
type Rule = {
    quantityConditions: ConditionGroup;
    priceConditions: ConditionGroup;
    quantity: Quantity;
    price: Price;
};
```
