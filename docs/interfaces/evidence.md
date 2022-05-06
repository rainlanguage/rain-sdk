[Home](../index.md) &gt; [Evidence](./evidence.md)

# Interface Evidence

Structure of arbitrary evidence to support any action taken. Priviledged roles are expected to provide evidence just as applicants as an audit trail will be preserved permanently in the logs.

<b>Signature:</b>

```typescript
interface Evidence 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [account](./evidence.md#account-property) | `string` | The account this evidence is relevant to. |
|  [data](./evidence.md#data-property) | `BytesLike` | Arbitrary bytes representing evidence. MAY be e.g. a reference to a sufficiently decentralised external system such as an IPFS hash. |

## Property Details

<a id="account-property"></a>

### account

The account this evidence is relevant to.

<b>Signature:</b>

```typescript
account: string;
```

<a id="data-property"></a>

### data

Arbitrary bytes representing evidence. MAY be e.g. a reference to a sufficiently decentralised external system such as an IPFS hash.

<b>Signature:</b>

```typescript
data: BytesLike;
```
