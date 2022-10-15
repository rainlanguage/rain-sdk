
# Type iOpMetaLike

<b>Signature:</b>

```typescript
type iOpMetaLike = {
    name: string;
    pushes: (opcode: number, operand: number) => number;
    pops: (opcode: number, operand: number) => number;
    description?: string;
    aliases?: string[];
    data?: any;
};
```
