
# Type eCondition

Type of a evaluated Condition with JSVM, which is the same as Condition with a result property

<b>Signature:</b>

```typescript
type eCondition = (Exclude<Condition, Always | Never> & {
    result: boolean;
}) | Always | Never;
```
