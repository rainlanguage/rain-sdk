
# Type ParseTree


<b>Signature:</b>

```typescript
type ParseTree = Error | {
    opcode: {
        name: string;
        position: number[];
    };
    operand: number;
    output: number;
    parameters: (ParseTree | {
        value: BigNumberish;
        position: number[];
    })[];
    position: number[];
    data?: any;
};
```
