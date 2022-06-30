
# Class HumanFriendlySource

The generator of friendly human readable source.

Parse an State/Script to a more human readable form, making easier to understand. This form allow to the users read exactly what the Script is made for, like the conditions, values used, etc. Also, anyone can learn to write their own scripts if use the Human Form to see the output for each combination that they made. \* If you find an issue or you want to propose a better way to show a specific script or opcodes, please feel to do it on: https://github.com/beehive-innovation/rain-sdk/issues

<b>Signature:</b>

```typescript
class HumanFriendlySource 
```

## Static Methods

|  Method | Description |
|  --- | --- |
|  [get(\_state, \_config)](./humanfriendlysource.md#get-method-static-1) | Obtain the friendly output from an script. |
|  [prettify(\_text, \_config)](./humanfriendlysource.md#prettify-method-static-1) | Make more readable the output from the HumanFriendly Source adding indenting following the parenthesis |

## Static Method Details

<a id="get-method-static-1"></a>

### get(\_state, \_config)

Obtain the friendly output from an script.

<b>Signature:</b>

```typescript
static get(_state: StateConfig, _config?: Config): string;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  \_state | [StateConfig](../interfaces/stateconfig.md) | The state or script to generate the friendly version |
|  \_config | [Config](../types/config.md) | The configuration that will run the generator. |

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

