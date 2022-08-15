
# Variable vmbook

Key/value paired VM functions to get the corresponding StateConfigs from RuleBuilder types by Rulebuilder class methods

<b>Signature:</b>

```typescript
vmbook: {
    [T in keyof ArgsTypeBook]: (args: Filter<T>[T]['args']) => StateConfig;
}
```
