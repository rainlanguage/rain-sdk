
# Enum AllStandardOps

All the standard Op Codes

<b>Signature:</b>

```typescript
enum AllStandardOps 
```

## Enumeration Members

|  Member | Value | Description |
|  --- | --- | --- |
|  ADD | `16` | Opcode for addition. |
|  ALWAYS | `36` | Opcode to stack a report that has always been held for all tiers. |
|  ANY | `33` | Opcode for ANY. |
|  BLOCK\_NUMBER | `5` | Opcode for the block number. |
|  BLOCK\_TIMESTAMP | `6` | Opcode for the block timestamp. |
|  DEBUG | `4` | ABI encodes the entire stack and logs it to the hardhat console. |
|  DIV | `22` | Opcode for division |
|  DUP | `2` | Duplicates the value atoptions.index `operand_` to the top of the stack |
|  EAGER\_IF | `28` | Eager because BOTH x\_ and y\_ must be eagerly evaluated before EAGER\_IF will select one of them. If both x\_ and y\_ are cheap (e.g. constant values) then this may also be the simplest and cheapest way to select one of them. If either x\_ or y\_ is expensive consider using the conditional form of OP\_SKIP to carefully avoid it instead. |
|  EQUAL\_TO | `29` | Opcode for EQUAL\_TO. |
|  EVERY | `32` | Opcode for EVERY. |
|  EXP | `24` | Opcode for exponentiation. |
|  GREATER\_THAN | `31` | Opcode for GREATER\_THAN. |
|  IERC1155\_BALANCE\_OF | `44` | Opcode for `IERC1155` `balanceOf`<!-- -->. |
|  IERC1155\_BALANCE\_OF\_BATCH | `45` | Number of provided opcodes for `IERC1155Ops`<!-- -->. |
|  IERC20\_BALANCE\_OF | `40` | Opcode for `IERC20` `balanceOf`<!-- -->. |
|  IERC20\_TOTAL\_SUPPLY | `41` | Opcode for `IERC20` `totalSupply`<!-- -->. |
|  IERC721\_BALANCE\_OF | `42` | Opcode for `IERC721` `balanceOf`<!-- -->. |
|  IERC721\_OWNER\_OF | `43` | Number of provided opcodes for `IERC721Ops`<!-- -->. |
|  ISZERO | `27` | Opcode for ISZERO. |
|  length | `46` | Length of the Standard Opcodes |
|  LESS\_THAN | `30` | Opcode for LESS\_THAN. |
|  MAX | `26` | Opcode for maximum. |
|  MIN | `25` | Opcode for minimum. |
|  MOD | `23` | Opcode for modulo. |
|  MUL | `20` | Opcode for multiplication. |
|  NEVER | `35` | Opcode to stack a report that has never been held for all tiers. |
|  REPORT | `34` | Opcode to call `report` on an `ITier` contract. |
|  SATURATING\_ADD | `17` | Opcode for saturating addition. |
|  SATURATING\_DIFF | `37` | Opcode to calculate the tierwise diff of two reports. |
|  SATURATING\_MUL | `21` | Opcode for saturating multiplication. |
|  SATURATING\_SUB | `19` | Opcode for saturating subtraction. |
|  SCALE\_BY | `13` | Opcode to rescale an arbitrary fixed point number by some OOMs. |
|  SCALE18 | `11` | Opcode to rescale some fixed point number to 18 OOMs in situ. |
|  SCALE18\_DECIMALS | `15` | Opcode for stacking number of fixed point decimals used. |
|  SCALE18\_DIV | `10` | Opcode for division. |
|  SCALE18\_MUL | `9` | Opcode for multiplication. |
|  SCALE18\_ONE | `14` | Opcode for stacking the definition of one. |
|  SCALEN | `12` | Opcode to rescale an 18 OOMs fixed point number to scale N. |
|  SELECT\_LTE | `39` | Opcode to tierwise select the best block lte a reference block. |
|  SENDER | `7` | Opcode for the `msg.sender`<!-- -->. |
|  SKIP | `0` |  |
|  SUB | `18` | Opcode for subtraction. |
|  THIS\_ADDRESS | `8` | Opcode for `this` address of the current contract. |
|  UPDATE\_BLOCKS\_FOR\_TIER\_RANGE | `38` | Opcode to update the blocks over a range of tiers for a report. |
|  VAL | `1` | Copies a value either off `constants` or `arguments` to the top of the stack. The high bit of the operand specifies which, `0` for `constants` and `1` for `arguments`<!-- -->. |
|  ZIPMAP | `3` | Takes N values off the stack, interprets them as an array then zips and maps a source from `sources` over them. The source has access to the original constants using `1 0` and to zipped arguments as `1 1`<!-- -->. |

