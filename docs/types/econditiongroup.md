
# Type eConditionGroup

Type of a evaluated ConditionGroup with JSVM, which is the same as ConditionGroup with a result property

<b>Signature:</b>

```typescript
type eConditionGroup = (({
    conditions: (eCondition | eConditionGroup)[];
    operator: Exclude<Operator, 'min' | 'max' | 'eq' | 'gt' | 'lt' | 'lte' | 'gte'>;
} | StateConfig) & {
    result: boolean;
}) | Always | Never;
```
