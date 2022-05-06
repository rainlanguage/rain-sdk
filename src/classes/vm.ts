import { BytesLike, BigNumberish, utils } from 'ethers';
import { op, concat } from '../utils';

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
  BLOCK_NUMBER,
  BLOCK_TIMESTAMP,
  SENDER,
  THIS_ADDRESS,
  SCALE18_MUL,
  SCALE18_DIV,
  SCALE18,
  SCALEN,
  SCALE_BY,
  SCALE18_ONE,
  SCALE18_DECIMALS,
  ADD,
  SATURATING_ADD,
  SUB,
  SATURATING_SUB,
  MUL,
  SATURATING_MUL,
  DIV,
  MOD,
  EXP,
  MIN,
  MAX,
  ISZERO,
  EAGER_IF,
  EQUAL_TO,
  LESS_THAN,
  GREATER_THAN,
  EVERY,
  ANY,
  REPORT,
  NEVER,
  ALWAYS,
  SATURATING_DIFF,
  UPDATE_BLOCKS_FOR_TIER_RANGE,
  SELECT_LTE,
  IERC20_BALANCE_OF,
  IERC20_TOTAL_SUPPLY,
  IERC721_BALANCE_OF,
  IERC721_OWNER_OF,
  IERC1155_BALANCE_OF,
  IERC1155_BALANCE_OF_BATCH,
  length,
}

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
   *
   * @returns
   */
  public static createVMSources(OPerands: OPerand[]): [Uint8Array] {
    return [concat(OPerands.map((x) => op(x[0], x[1] || 0)))];
  }
}

/**
 * @public
 *
 * Parameter that will use to converted to the source.
 *
 * Use an opcode and operand (optional)
 *
 */
export type OPerand = [number, (number | BytesLike | utils.Hexable)?];
