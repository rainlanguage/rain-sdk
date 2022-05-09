import { BytesLike, BigNumberish, utils } from 'ethers';
import { op, concat } from '../utils';

/**
 * @public
 *
 * All the standard Op Codes
 */
export enum AllStandardOps {
  /**
   * @deprecated **DONT USE SKIP!**
   *
   * It is a skip as this is the fallback value for unset solidity bytes.
   * Any additional "whitespace" in rain scripts will be noops as `0 0` is
   * "skip self". The val can be used to skip additional opcodes but take
   * care to not underflow the source itself.
   */
  SKIP,
  /**
   * Copies a value either off `constants` or `arguments` to the top of
   * the stack. The high bit of the operand specifies which, `0` for
   * `constants` and `1` for `arguments`.
   */
  VAL,
  /**
   * Duplicates the value at index `operand_` to the top of the stack
   */
  DUP,
  /**
   * Takes N values off the stack, interprets them as an array then zips
   * and maps a source from `sources` over them. The source has access to
   * the original constants using `1 0` and to zipped arguments as `1 1`.
   */
  ZIPMAP,
  /**
   * ABI encodes the entire stack and logs it to the hardhat console.
   */
  DEBUG,
  /**
   * Opcode for the block number.
   */
  BLOCK_NUMBER,
  /**
   * Opcode for the block timestamp.
   */
  BLOCK_TIMESTAMP,
  /**
   * Opcode for the `msg.sender`.
   */
  SENDER,
  /**
   * Opcode for `this` address of the current contract.
   */
  THIS_ADDRESS,
  /**
   * Opcode for multiplication.
   */
  SCALE18_MUL,
  /**
   * Opcode for division.
   */
  SCALE18_DIV,
  /**
   * Opcode to rescale some fixed point number to 18 OOMs in situ.
   */
  SCALE18,
  /**
   * Opcode to rescale an 18 OOMs fixed point number to scale N.
   */
  SCALEN,
  /**
   * Opcode to rescale an arbitrary fixed point number by some OOMs.
   */
  SCALE_BY,
  /**
   * Opcode for stacking the definition of one.
   */
  SCALE18_ONE,
  /**
   * Opcode for stacking number of fixed point decimals used.
   */
  SCALE18_DECIMALS,
  /**
   * Opcode for addition.
   */
  ADD,
  /**
   * Opcode for saturating addition.
   */
  SATURATING_ADD,
  /**
   * Opcode for subtraction.
   */
  SUB,
  /**
   * Opcode for saturating subtraction.
   */
  SATURATING_SUB,
  /**
   * Opcode for multiplication.
   */
  MUL,
  /**
   * Opcode for saturating multiplication.
   */
  SATURATING_MUL,
  /**
   * Opcode for division
   */
  DIV,
  /**
   * Opcode for modulo.
   */
  MOD,
  /**
   * Opcode for exponentiation.
   */
  EXP,
  /**
   * Opcode for minimum.
   */
  MIN,
  /**
   * Opcode for maximum.
   */
  MAX,
  /**
   * Opcode for ISZERO.
   */
  ISZERO,
  /**
   * Eager because BOTH x_ and y_ must be eagerly evaluated
   * before EAGER_IF will select one of them. If both x_ and y_
   * are cheap (e.g. constant values) then this may also be the
   * simplest and cheapest way to select one of them. If either
   * x_ or y_ is expensive consider using the conditional form
   * of OP_SKIP to carefully avoid it instead.
   */
  EAGER_IF,
  /**
   * Opcode for EQUAL_TO.
   */
  EQUAL_TO,
  /**
   * Opcode for LESS_THAN.
   */
  LESS_THAN,
  /**
   * Opcode for GREATER_THAN.
   */
  GREATER_THAN,
  /**
   * Opcode for EVERY.
   */
  EVERY,
  /**
   * Opcode for ANY.
   */
  ANY,
  /**
   * Opcode to call `report` on an `ITier` contract.
   */
  REPORT,
  /**
   * Opcode to stack a report that has never been held for all tiers.
   */
  NEVER,
  /**
   * Opcode to stack a report that has always been held for all tiers.
   */
  ALWAYS,
  /**
   * Opcode to calculate the tierwise diff of two reports.
   */
  SATURATING_DIFF,
  /**
   * Opcode to update the blocks over a range of tiers for a report.
   */
  UPDATE_BLOCKS_FOR_TIER_RANGE,
  /**
   * Opcode to tierwise select the best block lte a reference block.
   */
  SELECT_LTE,
  /**
   * Opcode for `IERC20` `balanceOf`.
   */
  IERC20_BALANCE_OF,
  /**
   * Opcode for `IERC20` `totalSupply`.
   */
  IERC20_TOTAL_SUPPLY,
  /**
   * Opcode for `IERC721` `balanceOf`.
   */
  IERC721_BALANCE_OF,
  /**
   * Number of provided opcodes for `IERC721Ops`.
   */
  IERC721_OWNER_OF,
  /**
   * Opcode for `IERC1155` `balanceOf`.
   */
  IERC1155_BALANCE_OF,
  /**
   * Number of provided opcodes for `IERC1155Ops`.
   */
  IERC1155_BALANCE_OF_BATCH,
  length,
}

/**
 * @public
 *
 * Config required to build a new `State`.
 */
export interface StateConfig {
  /**
   * Sources verbatim.
   */
  sources: BytesLike[];
  /**
   * Constants verbatim.
   */
  constants: BigNumberish[];
  /**
   * Sets the length of the uint256[] of the stack.
   */
  stackLength: BigNumberish;
  /**
   * Sets the length of the uint256[] of the arguments.
   */
  argumentsLength: BigNumberish;
}

/**
 * @public
 *
 * Everything required to evaluate and track the state of a rain script.
 * As this is a struct it will be in memory when passed to `RainVM` and so
 * will be modified by reference internally. This is important for gas
 * efficiency; the stack, arguments and stackIndex will likely be mutated by
 * the running script.
 */
export interface State {
  /**
   * Opcodes write to the stack at the stack index and can
   * consume from the stack by decrementing the index and reading between the
   * old and new stack index.
   * IMPORANT: The stack is never zeroed out so the index must be used to
   * find the "top" of the stack as the result of an `eval`.
   */
  stackIndex: BigNumberish;
  /**
   * Stack is the general purpose runtime state that opcodes can
   * read from and write to according to their functionality.
   */
  stack: BigNumberish[];
  /**
   * Sources available to be executed by `eval`.
   * Notably `ZIPMAP` can also select a source to execute by index.
   */
  sources: BytesLike[];
  /**
   * Constants that can be copied to the stack by index by `VAL`.
   */
  constants: BigNumberish[];
  /**
   * `ZIPMAP` populates arguments which can be copied to the stack by `VAL`.
   */
  arguments: BigNumberish[];
}

/**
 * @public
 *2
 * Parameter that will use to converted to the source.
 *
 * Use an opcode and operand (optional)
 */
export type OPerand = [number, (number | BytesLike | utils.Hexable)?];

/**
 * @public
 *
 *
 */
export class VM {
  /**
   * All the standard Op Codes
   */
  public static Opcodes = { ...AllStandardOps };

  /**
   * Create a VM sources to be ready to use in any call just providing the combination desired.
   *
   * @param OPerands - All the configuration with the opcodes and operands. If any combination
   * does not have an operand with an opcode, a 0 (zero) will be use with the opcode as the
   * operand. Please @see OPerand
   * @returns A source
   */
  public static createVMSources(OPerands: OPerand[]): [Uint8Array] {
    return [concat(OPerands.map((x) => op(x[0], x[1] || 0)))];
  }
}
