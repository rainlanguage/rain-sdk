
# Type Default

The default block, i.e. default quantity and price

<b>Signature:</b>

```typescript
type Default = {
    quantity: Omit<Quantity, 'modifier'>;
    price: Omit<Price, 'modifier'>;
};
```
