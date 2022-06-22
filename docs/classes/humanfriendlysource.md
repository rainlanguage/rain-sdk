
# Class HumanFriendlySource

The generator of friendly human readable source.

Parse a State to a more human readable form, so feel free to use it and make more friendly anyone that want to read the script that is being used in the code.

If you find an issue or you want to propose a better way to show a specific script or opcodes, please feel to do it on: https://github.com/beehive-innovation/rain-sdk/issues

<b>Signature:</b>

```typescript
class HumanFriendlySource 
```

## Static Methods

|  Method | Description |
|  --- | --- |
|  [get(\_state)](./humanfriendlysource.md#get-method-static-1) |  |
|  [prettify(\_text, n)](./humanfriendlysource.md#prettify-method-static-1) | Make more readable the output from the HumanFriendly Source with an indented |

## Static Method Details

<a id="get-method-static-1"></a>

### get(\_state)

<b>Signature:</b>

```typescript
static get(_state: StateConfig): string;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  \_state | [StateConfig](../interfaces/stateconfig.md) |  |

<b>Returns:</b>

`string`

<a id="prettify-method-static-1"></a>

### prettify(\_text, n)

Make more readable the output from the HumanFriendly Source with an indented

<b>Signature:</b>

```typescript
static prettify(_text: string, n?: number): string;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  \_text | `string` | The output from the HumanFriendlySource |
|  n | `number` | The amount spaces based of each indent |

<b>Returns:</b>

`string`

The pretty output

