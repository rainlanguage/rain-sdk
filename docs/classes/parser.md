
# Class Parser

Parser is a mini compiler to generate a valid StateConfig (deployable bytes) from a text script

<b>Signature:</b>

```typescript
class Parser 
```

## Example


```typescript
// to import
import { Parser } from "rain-sdk";

// to set the custom opmeta
Parser.set(OpMeta)

// to execute the parsing and get parse tree object and StateConfig
let parseTree;
let stateConfig
[ parseTree, stateConfig ] = Parser.get(textScript, customOpMeta, customMultiOutputPlaceholderChar);

// to get parse tree object only
let parseTree = Parser.getParseTree(textScript, customOpMeta, customMultiOutputPlaceholderChar);

// to get StateConfig only
let stateConfig = Parser.getStateConfig(textScript, customOpMeta, customMultiOutputPlaceholderChar);

// to build StateConfig (bytes) from ParseTree object or a Node or array of Node
let argument: Node || Node[] || ParseTree
let stateConfig = Parser.buildBytes(argument)

```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [constants](./parser.md#constants-property-static) | `BigNumberish[]` |  |
|  [parseTree](./parser.md#parseTree-property-static) | [ParseTree](../types/parsetree.md) |  |
|  [resolveMultiOutput](./parser.md#resolveMultiOutput-property-static) | `(totalCount: number, depthLevel: number) => void` | Method to resolve multi output nodes at current state of parsing |
|  [sources](./parser.md#sources-property-static) | `BytesLike[]` |  |

## Static Methods

|  Method | Description |
|  --- | --- |
|  [buildBytes(parseTree, offset)](./parser.md#buildBytes-method-static-1) | Method to get StateConfig (bytes) from a Parse Tree object or a Node or array of Nodes |
|  [get(expression, opmeta, multiOutputPlaceholderChar)](./parser.md#get-method-static-1) | Method to get parse tree object and StateConfig |
|  [getParseTree(expression, opmeta, multiOutputPlaceholderChar)](./parser.md#getParseTree-method-static-1) | Method to get the parse tree object |
|  [getStateConfig(expression, opmeta, multiOutputPlaceholderChar)](./parser.md#getStateConfig-method-static-1) | Method to get the StateConfig |
|  [updateArgs(config)](./parser.md#updateArgs-method-static-1) | Method to update the arguments of zipmaps after full buyes build (if any present) |

## Static Property Details

<a id="constants-property-static"></a>

### constants

<b>Signature:</b>

```typescript
static constants: BigNumberish[];
```

<a id="parseTree-property-static"></a>

### parseTree

<b>Signature:</b>

```typescript
static parseTree: ParseTree;
```

<a id="resolveMultiOutput-property-static"></a>

### resolveMultiOutput

Method to resolve multi output nodes at current state of parsing

<b>Signature:</b>

```typescript
static resolveMultiOutput: (totalCount: number, depthLevel: number) => void;
```

<a id="sources-property-static"></a>

### sources

<b>Signature:</b>

```typescript
static sources: BytesLike[];
```

## Static Method Details

<a id="buildBytes-method-static-1"></a>

### buildBytes(parseTree, offset)

Method to get StateConfig (bytes) from a Parse Tree object or a Node or array of Nodes

<b>Signature:</b>

```typescript
static buildBytes(parseTree: Node | Node[] | Record<number, Node[]>, offset?: number): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  parseTree | `Node \| Node[] \| Record<number, Node[]>` | Tree like object (Parse Tree object or a Node or array of Nodes) to get the StateConfig from |
|  offset | `number` | This argument is used internally and should be ignored when calling this method externally |

<b>Returns:</b>

`StateConfig`

StateConfig

<a id="get-method-static-1"></a>

### get(expression, opmeta, multiOutputPlaceholderChar)

Method to get parse tree object and StateConfig

<b>Signature:</b>

```typescript
static get(expression: string, opmeta?: typeof OpMeta, multiOutputPlaceholderChar?: string): [ParseTree, StateConfig];
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  expression | `string` | the text expression |
|  opmeta | `typeof OpMeta` | (optional) custom opmeta |
|  multiOutputPlaceholderChar | `string` | (optional) custom multi output placeholder character, default is "\_" |

<b>Returns:</b>

`[ParseTree, StateConfig]`

Array of parse tree object and StateConfig

<a id="getParseTree-method-static-1"></a>

### getParseTree(expression, opmeta, multiOutputPlaceholderChar)

Method to get the parse tree object

<b>Signature:</b>

```typescript
static getParseTree(expression: string, opmeta?: typeof OpMeta, multiOutputPlaceholderChar?: string): ParseTree;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  expression | `string` | the text expression |
|  opmeta | `typeof OpMeta` | (optional) custom opmeta |
|  multiOutputPlaceholderChar | `string` | (optional) custom multi output placeholder character, default is "\_" |

<b>Returns:</b>

`ParseTree`

A parse tree object

<a id="getStateConfig-method-static-1"></a>

### getStateConfig(expression, opmeta, multiOutputPlaceholderChar)

Method to get the StateConfig

<b>Signature:</b>

```typescript
static getStateConfig(expression: string, opmeta?: typeof OpMeta, multiOutputPlaceholderChar?: string): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  expression | `string` | the text expression |
|  opmeta | `typeof OpMeta` | (optional) custom opmeta |
|  multiOutputPlaceholderChar | `string` | (optional) custom multi output placeholder character, default is "\_" |

<b>Returns:</b>

`StateConfig`

A StateConfig

<a id="updateArgs-method-static-1"></a>

### updateArgs(config)

Method to update the arguments of zipmaps after full buyes build (if any present)

<b>Signature:</b>

```typescript
static updateArgs(config: StateConfig): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  config | [StateConfig](../interfaces/stateconfig.md) |  |

<b>Returns:</b>

`StateConfig`

