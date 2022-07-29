
# Namespace utils

## Enumerations

|  Enumeration | Description |
|  --- | --- |
|  [selectLteLogic](./utils/enums/selectltelogic.md) | An enum for selectLte logic |
|  [selectLteMode](./utils/enums/selectltemode.md) | An enum for selectLte mode |

## Functions

|  Function | Description |
|  --- | --- |
|  [callSize(sourceIndex, loopSize, valSize)](./utils/variables/callsize_1.md) | Constructs the operand for RainVM's `zipmap` opcode by packing 3 numbers into a single byte. All parameters use zero-based counting i.e. an `fnSize` of 0 means to allocate one element (32 bytes) on the stack to define your functions, while an `fnSize` of 3 means to allocate all four elements (4 \* 32 bytes) on the stack. |
|  [extractFromMap(map, properties)](./utils/variables/extractfrommap_1.md) | Extract some of the properites from a Map as a new Map with same keys. |
|  [extractFromRecord(record, properties)](./utils/variables/extractfromrecord_1.md) | Extract some of the properties from a Record as new Record with same keys. |
|  [isBigNumberish(value)](./utils/variables/isbignumberish_1.md) | function to check if the a value is of type BigNumberish |
|  [mapToRecord(map, properties)](./utils/variables/maptorecord_1.md) | Conver a Map to a equivelant Record (a key/value pair object). Map keys must be of type acceptable by Record constructor, which are string, number or symbol. |
|  [recordToMap(record, properties)](./utils/variables/recordtomap_1.md) | Conver a Record (a key/value pair object) to a equivelant Map. Map keys will be of type acceptable by Record constructor, which are string, number or symbol. |
|  [selectLte(logic, mode, length)](./utils/variables/selectlte_1.md) | function to set up the operand for a SELECT\_LTE opcode |
|  [tierRange(startTier, endTier)](./utils/variables/tierrange_1.md) | function to pack start/end tier range into a byte size number for the UPDATE\_BLOCKS\_FOR\_TIER\_RANGE opcode |

## Variables

|  Variable | Description |
|  --- | --- |
|  [areEqualConfigs](./utils/variables/areequalconfigs.md) | Checks 2 StateConfig objects to see if they are equal or not |
|  [arrayify](./utils/variables/arrayify.md) | ethers arrayify |
|  [arrToReport](./utils/variables/arrtoreport.md) | Convert an array of 8 BigNumberish values to 8 32bit values packed in a HexString uint256 i.e. Report |
|  [bytify](./utils/variables/bytify.md) | Converts a value to raw bytes representation. Assumes `value` is less than or equal to 1 byte, unless a desired `bytesLength` is specified. |
|  [concat](./utils/variables/concat.md) | ethers concat |
|  [hexlify](./utils/variables/hexlify.md) | ethers hexlify |
|  [hexZeroPad](./utils/variables/hexzeropad.md) | ethers hexZeroPad |
|  [isTier](./utils/variables/istier.md) | Check if a contract is a valid ITierV2 contract or not |
|  [op](./utils/variables/op.md) | Converts an opcode and operand to bytes, and returns their concatenation. |
|  [paddedUInt128](./utils/variables/paddeduint128.md) | Utility function to produce 128 bits size hexString |
|  [paddedUInt160](./utils/variables/paddeduint160.md) | Utility function that transforms a BigNumberish to an ether address (40 char length hexString) |
|  [paddedUInt256](./utils/variables/paddeduint256.md) | Utility function that transforms a BigNumberish from the output of the ITierV2 contract report |
|  [paddedUInt32](./utils/variables/paddeduint32.md) | Utility function to produce 32 bits size hexString |
|  [paddedUInt64](./utils/variables/paddeduint64.md) | Utility function to produce 64 bits size hexString |
|  [parseUnits](./utils/variables/parseunits.md) | ethers parseUnits |
|  [replaceAt](./utils/variables/replaceat.md) | Replace a value in a BytesLike. Set `replacement` in the `index` on the `original` BytesLike value |
|  [zeroPad](./utils/variables/zeropad.md) | ethers zeroPad |

## Type Aliases

|  Type Alias | Description |
|  --- | --- |
|  [Hexable](./utils/types/hexable.md) | a native type for ethers Hexable |

