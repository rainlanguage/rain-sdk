
# Type ConditionGroup

Type for a single or multiple conditions which are combined together with the valid logical operators which results in a a boolean StateConfig

<b>Signature:</b>

```typescript
type ConditionGroup = {
    conditions: (Condition | ConditionGroup)[];
    operator: Exclude<Operator, 'min' | 'max' | 'eq' | 'gt' | 'lt' | 'lte' | 'gte'>;
} | Always | Never | StateConfig;
```
