[Home](../index.md) &gt; [VerifyDeployArgs](./verifydeployargs.md)

# Interface VerifyDeployArgs

Config to initialize a Verify contract with.

<b>Signature:</b>

```typescript
interface VerifyDeployArgs 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [admin](./verifydeployargs.md#admin-property) | `string` | The address to ASSIGN ALL ADMIN ROLES to initially. This address is free and encouraged to delegate fine grained permissions to many other sub-admin addresses, then revoke it's own "root" access. |
|  [callback](./verifydeployargs.md#callback-property) | `string` | The address of the `IVerifyCallback` contract if it exists. MAY be `address(0)` to signify that callbacks should NOT run. |

## Property Details

<a id="admin-property"></a>

### admin

The address to ASSIGN ALL ADMIN ROLES to initially. This address is free and encouraged to delegate fine grained permissions to many other sub-admin addresses, then revoke it's own "root" access.

<b>Signature:</b>

```typescript
admin: string;
```

<a id="callback-property"></a>

### callback

The address of the `IVerifyCallback` contract if it exists. MAY be `address(0)` to signify that callbacks should NOT run.

<b>Signature:</b>

```typescript
callback?: string;
```
