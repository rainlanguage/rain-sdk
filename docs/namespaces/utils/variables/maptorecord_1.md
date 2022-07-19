
# Function utils.mapToRecord()

Conver a Map to a equivelant Record (a key/value pair object). Map keys must be of type acceptable by Record constructor, which are string, number or symbol.

<b>Signature:</b>

```typescript
function mapToRecord<K extends string | number | symbol, T>(map: Map<K, any>, properties?: string[]): Record<K, T>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  map | `Map<K, any>` | The Map to conver to Record |
|  properties | `string[]` | (optional) properties to pick from the second item of the Map's elements. |

<b>Returns:</b>

`Record<K, T>`

a new Record (a key/value pait object)

