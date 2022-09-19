
# Type ParseStack


<b>Signature:</b>

```typescript
type ParseStack = "(" | Error | ParseTree | {
    op: string;
    position: number[];
} | {
    value: BigNumberish;
    position: number[];
};
```
