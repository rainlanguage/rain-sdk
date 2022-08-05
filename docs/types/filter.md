
# Type Filter

A filtering utility type for StructTypeLib

<b>Signature:</b>

```typescript
type Filter<T extends keyof StructTypeLib> = {
    [Prop in keyof StructTypeLib]: {
        subject: T;
        args: StructTypeLib[T];
    };
};
```
