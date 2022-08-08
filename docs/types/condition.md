
# Type Condition

Type for conditions which is a comparison between structs which results in a boolean StateConfig

<b>Signature:</b>

```typescript
type Condition = {
    struct: Struct;
    operator: Extract<Operator, 'true' | 'not' | 'eq' | 'gt' | 'lt' | 'gte' | 'lte'>;
    struct2?: Struct;
} | Always | Never | StateConfig;
```
