
# Type State


<b>Signature:</b>

```typescript
type State = {
    parse: {
        stack: ParseStack[];
        tree: ParseTree[];
    };
    srcCache: Uint8Array[];
    arguments: {
        has: boolean;
        offset: number;
        count: number;
        cache: number[];
    };
    zipmaps: number;
    multiOutputCache: (Exclude<ParseTree, Error> | {
        value: BigNumberish;
        position: number[];
    })[];
};
```
