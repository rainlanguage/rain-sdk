[Home](../index.md) &gt; [AllStandardOps](./allstandardops.md)

# Enum AllStandardOps

All the standard Op Codes

<b>Signature:</b>

```typescript
enum AllStandardOps 
```

## Enumeration Members

|  Member | Value | Description |
|  --- | --- | --- |
|  ADD | `16` |  |
|  ALWAYS | `36` |  |
|  ANY | `33` |  |
|  BLOCK\_NUMBER | `5` |  |
|  BLOCK\_TIMESTAMP | `6` |  |
|  DEBUG | `4` | ABI encodes the entire stack and logs it to the hardhat console. |
|  DIV | `22` |  |
|  DUP | `2` | Duplicates the value at index `operand_` to the top of the stack |
|  EAGER\_IF | `28` |  |
|  EQUAL\_TO | `29` |  |
|  EVERY | `32` |  |
|  EXP | `24` |  |
|  GREATER\_THAN | `31` |  |
|  IERC1155\_BALANCE\_OF | `44` |  |
|  IERC1155\_BALANCE\_OF\_BATCH | `45` |  |
|  IERC20\_BALANCE\_OF | `40` |  |
|  IERC20\_TOTAL\_SUPPLY | `41` |  |
|  IERC721\_BALANCE\_OF | `42` |  |
|  IERC721\_OWNER\_OF | `43` |  |
|  ISZERO | `27` |  |
|  length | `46` |  |
|  LESS\_THAN | `30` |  |
|  MAX | `26` |  |
|  MIN | `25` |  |
|  MOD | `23` |  |
|  MUL | `20` |  |
|  NEVER | `35` |  |
|  REPORT | `34` |  |
|  SATURATING\_ADD | `17` |  |
|  SATURATING\_DIFF | `37` |  |
|  SATURATING\_MUL | `21` |  |
|  SATURATING\_SUB | `19` |  |
|  SCALE\_BY | `13` |  |
|  SCALE18 | `11` |  |
|  SCALE18\_DECIMALS | `15` |  |
|  SCALE18\_DIV | `10` |  |
|  SCALE18\_MUL | `9` |  |
|  SCALE18\_ONE | `14` |  |
|  SCALEN | `12` |  |
|  SELECT\_LTE | `39` |  |
|  SENDER | `7` |  |
|  SKIP | `0` |  |
|  SUB | `18` |  |
|  THIS\_ADDRESS | `8` |  |
|  UPDATE\_BLOCKS\_FOR\_TIER\_RANGE | `38` |  |
|  VAL | `1` | Copies a value either off `constants` or `arguments` to the top of the stack. The high bit of the operand specifies which, `0` for `constants` and `1` for `arguments`<!-- -->. |
|  ZIPMAP | `3` | Takes N values off the stack, interprets them as an array then zips and maps a source from `sources` over them. The source has access to the original constants using `1 0` and to zipped arguments as `1 1`<!-- -->. |

