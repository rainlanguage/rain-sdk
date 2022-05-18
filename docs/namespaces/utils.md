
# Namespace utils

## Enumerations

|  Enumeration | Description |
|  --- | --- |
|  [selectLteLogic](./utils/enums/selectltelogic.md) |  |
|  [selectLteMode](./utils/enums/selectltemode.md) |  |

## Functions

|  Function | Description |
|  --- | --- |
|  [arg(valIndex)](./utils/variables/arg_1.md) |  |
|  [callSize(sourceIndex, loopSize, valSize)](./utils/variables/callsize_1.md) | Constructs the operand for RainVM's `call` AllStandardOps by packing 3 numbers into a single byte. All parameters use zero-based counting i.e. an `fnSize` of 0 means to allocate one element (32 bytes) on the stack to define your functions, while an `fnSize` of 3 means to allocate all four elements (4 \* 32 bytes) on the stack. |
|  [selectLte(logic, mode, length)](./utils/variables/selectlte_1.md) |  |
|  [skip(places, conditional)](./utils/variables/skip_1.md) |  |
|  [tierRange(startTier, endTier)](./utils/variables/tierrange_1.md) |  |
|  [toUint8Array(data)](./utils/variables/touint8array_1.md) | Check and convert any type of `BytesLike` to an `Uint8Array` |

## Variables

|  Variable | Description |
|  --- | --- |
|  [arrayify](./utils/variables/arrayify.md) |  |
|  [bytify](./utils/variables/bytify.md) | Converts a value to raw bytes representation. Assumes `value` is less than or equal to 1 byte, unless a desired `bytesLength` is specified. |
|  [concat](./utils/variables/concat.md) |  |
|  [hexlify](./utils/variables/hexlify.md) |  |
|  [hexZeroPad](./utils/variables/hexzeropad.md) |  |
|  [op](./utils/variables/op.md) | Converts an opcode and operand to bytes, and returns their concatenation. |
|  [paddedUInt256](./utils/variables/paddeduint256.md) | Utility function that transforms a BigNumber from the output of the ITier contract report |
|  [paddedUInt32](./utils/variables/paddeduint32.md) |  |
|  [parseUnits](./utils/variables/parseunits.md) |  |
|  [replaceAt](./utils/variables/replaceat.md) | Replace a value in a BytesLike. Set `replacement` in the `index` on the `original` BytesLike value |
|  [zeroPad](./utils/variables/zeropad.md) |  |

## Type Aliases

|  Type Alias | Description |
|  --- | --- |
|  [Hexable](./utils/types/hexable.md) |  |

