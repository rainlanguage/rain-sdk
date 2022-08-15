
# Type UnionToIntersection

A utility generic type to convert union to intersection

<b>Signature:</b>

```typescript
type UnionToIntersection<T> = (T extends any ? (type: T) => any : never) extends (type: infer R) => any ? R : never;
```
