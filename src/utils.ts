import { BigNumber, ethers, utils } from 'ethers';

import type { BytesLike } from 'ethers';

/**
 * @public
 */
export type Hexable = utils.Hexable;

/**
 * @public
 */
export enum selectLteLogic {
  every,
  any,
}

/**
 * @public
 */
export enum selectLteMode {
  min,
  max,
  first,
}

export const {
  /**
   * @public
   */
  concat,
  /**
   * @public
   */
  hexlify,
  /**
   * @public
   */
  zeroPad,
  /**
   * @public
   */
  hexZeroPad,
  /**
   * @public
   */
  arrayify,
  /**
   * @public
   */
  parseUnits,
} = utils;

/**
 * @public
 * Converts an opcode and operand to bytes, and returns their concatenation.
 *
 * @param code - the opcode
 * @param erand - the operand, currently limited to 1 byte (defaults to 0)
 */
export const op = (
  code: number,
  erand: number | BytesLike | utils.Hexable = 0
): Uint8Array => {
  return concat([bytify(code), bytify(erand)]);
};

/**
 * @public
 * Converts a value to raw bytes representation. Assumes `value` is less than or equal to 1 byte,
 * unless a desired `bytesLength` is specified.
 *
 * @param value - value to convert to raw bytes format
 * @param bytesLength - (defaults to 1) number of bytes to left pad if `value` doesn't completely
 * fill the desired amount of memory. Will throw `InvalidArgument` error if value already exceeds
 * bytes length.
 * @returns raw bytes representation as Uint8Array
 */
export const bytify = (
  value: number | BytesLike | utils.Hexable,
  bytesLength = 1
): BytesLike => {
  return zeroPad(hexlify(value), bytesLength);
};

/**
 * @public
 * Utility function that transforms a BigNumber from the output of the ITier contract report
 *
 * @param report - report as bignumber from the ITier contract
 * @returns hexadecimal string of the report already padded
 */
export const paddedUInt256 = (report: BigNumber): string => {
  if (report.gt(ethers.constants.MaxUint256)) {
    throw new Error(`${report} exceeds max uint256`);
  }
  return '0x' + report.toHexString().substring(2).padStart(64, '0');
};

/**
 * @public
 */
export const paddedUInt32 = (number: number | BytesLike | Hexable): string => {
  if (ethers.BigNumber.from(number).gt(ethers.constants.MaxUint256)) {
    throw new Error(`${number} exceeds max uint32`);
  }
  return hexlify(number).substring(2).padStart(8, '0');
};

/**
 * @public
 */
export function arg(valIndex: number): number {
  let arg = 1;
  arg <<= 7;
  arg += valIndex;
  return arg;
}

/**
 * @public
 */
export function tierRange(startTier: number, endTier: number): number {
  //   op_.val & 0x0f, //     00001111
  //   op_.val & 0xf0, //     11110000

  if (startTier < 0 || startTier > 8) {
    throw new Error(`Invalid startTier ${startTier}`);
  } else if (endTier < 0 || endTier > 8) {
    throw new Error(`Invalid endTier ${endTier}`);
  }
  let range = endTier;
  range <<= 4;
  range += startTier;
  return range;
}

/**
 * @public
 * Constructs the operand for RainVM's `call` AllStandardOps by packing 3 numbers into a single byte. All parameters use zero-based counting i.e. an `fnSize` of 0 means to allocate one element (32 bytes) on the stack to define your functions, while an `fnSize` of 3 means to allocate all four elements (4 * 32 bytes) on the stack.
 *
 * @param sourceIndex - index of function source in `immutableSourceConfig.sources`
 * @param loopSize - number of times to subdivide vals, reduces uint size but allows for more vals (range 0-7)
 * @param valSize - number of vals in outer stack (range 0-7)
 */
export function callSize(
  sourceIndex: number,
  loopSize: number,
  valSize: number
): number {
  // CallSize(
  //   op_.val & 0x07,      // 00000111
  //   op_.val >> 3 & 0x03, // 00011000
  //   op_.val >> 5 & 0x07  // 11100000
  // )

  if (sourceIndex < 0 || sourceIndex > 7) {
    throw new Error('Invalid fnSize');
  } else if (loopSize < 0 || loopSize > 3) {
    throw new Error('Invalid loopSize');
  } else if (valSize < 0 || valSize > 7) {
    throw new Error('Invalid valSize');
  }
  let callSize = valSize;
  callSize <<= 2;
  callSize += loopSize;
  callSize <<= 3;
  callSize += sourceIndex;
  return callSize;
}

/**
 * @public
 */
export function selectLte(logic: number, mode: number, length: number): number {
  let lte = logic;
  lte <<= 2;
  lte += mode;
  lte <<= 5;
  lte += length;
  return lte;
}

/**
 * @public
 * Replace a value in a BytesLike. Set `replacement` in the `index` on the `original` BytesLike value
 *
 * @param original - Value that will be changed
 * @param index - index/position where the new value will be set
 * @param replacement - the new value to replace
 * @returns BytesLike with the value replaced
 */
export const replaceAt = (
  original: BytesLike,
  index: number,
  replacement: string | number
): BytesLike => {
  const originalParsed = arrayify(original, { allowMissingPrefix: true });
  originalParsed[index] = parseInt(replacement.toString());
  return originalParsed;
};

/**
 * @public
 */
export function skip(places: number, conditional = false): number {
  let skip = conditional ? 1 : 0;
  skip <<= 7;
  // JS ints are already signed.
  skip |= places & 0x7f;
  return skip;
}

