
# Interface IOpMeta


<b>Signature:</b>

```typescript
interface IOpMeta extends Record<string, any> 
```

## Implements Interfaces

- <b>IOpMeta</b>
    - Record

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [description](./iopmeta.md#description-property) | `string` |  |
|  [enum](./iopmeta.md#enum-property) | `number` |  |
|  [jsvmfn](./iopmeta.md#jsvmfn-property) | [OpJSVM](./opjsvm.md) |  |
|  [name](./iopmeta.md#name-property) | `string` |  |
|  [pops](./iopmeta.md#pops-property) | `(opcode: number, operand: number) => number` |  |
|  [pushes](./iopmeta.md#pushes-property) | `(opcode: number, operand: number) => number` |  |
|  [readableAlias](./iopmeta.md#readableAlias-property) | `string` |  |

## Property Details

<a id="description-property"></a>

### description

<b>Signature:</b>

```typescript
description?: string;
```

<a id="enum-property"></a>

### enum

<b>Signature:</b>

```typescript
enum: number;
```

<a id="jsvmfn-property"></a>

### jsvmfn

<b>Signature:</b>

```typescript
jsvmfn: OpJSVM;
```

<a id="name-property"></a>

### name

<b>Signature:</b>

```typescript
name: string;
```

<a id="pops-property"></a>

### pops

<b>Signature:</b>

```typescript
pops: (opcode: number, operand: number) => number;
```

<a id="pushes-property"></a>

### pushes

<b>Signature:</b>

```typescript
pushes: (opcode: number, operand: number) => number;
```

<a id="readableAlias-property"></a>

### readableAlias

<b>Signature:</b>

```typescript
readableAlias?: string;
```
