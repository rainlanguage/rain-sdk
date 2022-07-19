
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
|  [input](./iopmeta.md#input-property) | `string` |  |
|  [jsvmfn](./iopmeta.md#jsvmfn-property) | [OpFn](./opfn.md) |  |
|  [name](./iopmeta.md#name-property) | `string` |  |
|  [pops](./iopmeta.md#pops-property) | `(opcode: number, operand: number) => number` |  |
|  [pushes](./iopmeta.md#pushes-property) | `(opcode: number, operand: number) => number` |  |

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

<a id="input-property"></a>

### input

<b>Signature:</b>

```typescript
input: string;
```

<a id="jsvmfn-property"></a>

### jsvmfn

<b>Signature:</b>

```typescript
jsvmfn: OpFn;
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
