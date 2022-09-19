
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

// to get only parse tree object
let parseTree = Parser.getParseTree(textScript, customOpMeta, customMultiOutputPlaceholderChar);

// to get only StateConfig
let stateConfig = Parser.getStateConfig(textScript, customOpMeta, customMultiOutputPlaceholderChar);

```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [constants](./parser.md#constants-property-static) | `BigNumberish[]` |  |
|  [parseTree](./parser.md#parseTree-property-static) | <pre>Record<number, {&#010;    tree: ParseTree[];&#010;    position: number[];&#010;}></pre> |  |
|  [sources](./parser.md#sources-property-static) | `BytesLike[]` |  |

## Static Methods

|  Method | Description |
|  --- | --- |
|  [get(script, opmeta, placeholderChar)](./parser.md#get-method-static-1) | Method to get parse tree object and StateConfig |
|  [getParseTree(script, opmeta, placeholderChar)](./parser.md#getParseTree-method-static-1) | Method to get the parse tree object |
|  [getStateConfig(script, opmeta, placeholderChar)](./parser.md#getStateConfig-method-static-1) | Method to get the StateConfig |

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
static parseTree: Record<number, {
        tree: ParseTree[];
        position: number[];
    }>;
```

<a id="sources-property-static"></a>

### sources

<b>Signature:</b>

```typescript
static sources: BytesLike[];
```

## Static Method Details

<a id="get-method-static-1"></a>

### get(script, opmeta, placeholderChar)

Method to get parse tree object and StateConfig

<b>Signature:</b>

```typescript
static get(script: string, opmeta?: typeof OpMeta, placeholderChar?: string): [
        Record<number, {
            tree: ParseTree[];
            position: number[];
        }>,
        StateConfig
    ];
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  script | `string` | the text script |
|  opmeta | `typeof OpMeta` | (optional) custom opmeta |
|  placeholderChar | `string` | (optional) custom multi output placeholder character, default is "\_" |

<b>Returns:</b>

`[
        Record<number, {
            tree: ParseTree[];
            position: number[];
        }>,
        StateConfig
    ]`

Array of parse tree object and StateConfig

<a id="getParseTree-method-static-1"></a>

### getParseTree(script, opmeta, placeholderChar)

Method to get the parse tree object

<b>Signature:</b>

```typescript
static getParseTree(script: string, opmeta?: typeof OpMeta, placeholderChar?: string): Record<number, {
        tree: ParseTree[];
        position: number[];
    }>;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  script | `string` | the text script |
|  opmeta | `typeof OpMeta` | (optional) custom opmeta |
|  placeholderChar | `string` | (optional) custom multi output placeholder character, default is "\_" |

<b>Returns:</b>

`Record<number, {
        tree: ParseTree[];
        position: number[];
    }>`

A parse tree object

<a id="getStateConfig-method-static-1"></a>

### getStateConfig(script, opmeta, placeholderChar)

Method to get the StateConfig

<b>Signature:</b>

```typescript
static getStateConfig(script: string, opmeta?: typeof OpMeta, placeholderChar?: string): StateConfig;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  script | `string` | the text script |
|  opmeta | `typeof OpMeta` | (optional) custom opmeta |
|  placeholderChar | `string` | (optional) custom multi output placeholder character, default is "\_" |

<b>Returns:</b>

`StateConfig`

A StateConfig

