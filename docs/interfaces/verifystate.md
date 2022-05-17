
# Interface VerifyState

Records the block a verify session reaches each status. If a status is not reached it is left as UNINITIALIZED, i.e. 0xFFFFFFFF. Most accounts will never be banned so most accounts will never reach every status, which is a good thing.

<b>Signature:</b>

```typescript
interface VerifyState 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [addedSince](./verifystate.md#addedSince-property) | `BigNumberish` | Block the address was added else 0xFFFFFFFF. |
|  [approvedSince](./verifystate.md#approvedSince-property) | `BigNumberish` | Block the address was approved else 0xFFFFFFFF. |
|  [bannedSince](./verifystate.md#bannedSince-property) | `BigNumberish` | Block the address was banned else 0xFFFFFFFF. |

## Property Details

<a id="addedSince-property"></a>

### addedSince

Block the address was added else 0xFFFFFFFF.

<b>Signature:</b>

```typescript
addedSince: BigNumberish;
```

<a id="approvedSince-property"></a>

### approvedSince

Block the address was approved else 0xFFFFFFFF.

<b>Signature:</b>

```typescript
approvedSince: BigNumberish;
```

<a id="bannedSince-property"></a>

### bannedSince

Block the address was banned else 0xFFFFFFFF.

<b>Signature:</b>

```typescript
bannedSince: BigNumberish;
```
