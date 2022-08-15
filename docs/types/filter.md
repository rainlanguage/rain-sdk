
# Type Filter

A filtering utility type for ArgsTypeBook

<b>Signature:</b>

```typescript
type Filter<T extends keyof ArgsTypeBook> = {
    [Prop in keyof ArgsTypeBook]: {
        subject: T;
        args: ArgsTypeBook[T];
    };
};
```
