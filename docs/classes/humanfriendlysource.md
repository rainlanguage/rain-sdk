
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
|  [get(\_state, \_config)](./humanfriendlysource.md#get-method-static-1) |  |
|  [prettify(\_text, \_config)](./humanfriendlysource.md#prettify-method-static-1) | Make more readable the output from the HumanFriendly Source adding indenting following the parenthesis |

## Static Method Details

<a id="get-method-static-1"></a>

### get(\_state, \_config)

<b>Signature:</b>

```typescript
static get(_state: StateConfig, _config?: Config): string;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  \_state | [StateConfig](../interfaces/stateconfig.md) |  |
|  \_config | [Config](../types/config.md) |  |

<b>Returns:</b>

`string`

<a id="prettify-method-static-1"></a>

### prettify(\_text, \_config)

Make more readable the output from the HumanFriendly Source adding indenting following the parenthesis

If the string is already indentend, the method will wrongly generate the string

<b>Signature:</b>

```typescript
static prettify(_text: string, _config?: PrettifyConfig): string;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  \_text | `string` | The output from the HumanFriendlySource |
|  \_config | [PrettifyConfig](../types/prettifyconfig.md) | The configuration of the prettify method (experimental) |

<b>Returns:</b>

`string`

The pretty output

