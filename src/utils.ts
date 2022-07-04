import { BigNumber, BigNumberish, ethers, utils } from 'ethers';
import type { BytesLike } from 'ethers';

export const {
  /**
   * @public ethers concat
   * @see ethers.concat
   */
  concat,
  /**
   * @public ethers hexlify
   * @see ethers.hexlify
   */
  hexlify,
  /**
   * @public ethers zeroPad
   * @see ethers.zeroPad
   */
  zeroPad,
  /**
   * @public ethers hexZeroPad
   * @see ethers.hexZeroPad
   */
  hexZeroPad,
  /**
   * @public ethers arrayify
   * @see ethers.arrayify
   */
  arrayify,
  /**
   * @public ethers parseUnits
   * @see ethers.parseUnits
   */
  parseUnits,
} = utils;

/**
 * @public a native type for ethers Hexable
 */
export type Hexable = utils.Hexable;

/**
 * @public An enum for selectLte logic
 */
export enum selectLteLogic {
  every,
  any,
}

/**
 * @public An enum for selectLte mode
 */
export enum selectLteMode {
  min,
  max,
  first,
}

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
 * Utility function that transforms a BigNumberish from the output of the ITierV2 contract report
 *
 * @param report - report as bignumberish from the ITierV2 contract
 * @returns hexadecimal string of the report already padded (64 char hexString)
 */
export const paddedUInt256 = (report: BigNumberish): string => {
  if (BigNumber.from(report).gt(ethers.constants.MaxUint256)) {
    throw new Error(`${report} exceeds max uint256`);
  }
  return (
    '0x' +
    hexlify(report, { allowMissingPrefix: true }).substring(2).padStart(64, '0')
  );
};

/**
 * @public Utility function to produce 32 bits size hexString
 *
 * @param number - the value to convert into a 32bit size hexString
 *
 * @returns a 8 char hexString (without 0x prefix)
 */
export const paddedUInt32 = (number: BigNumberish): string => {
  if (BigNumber.from(number).gt('0xffffffff')) {
    throw new Error(`${number} exceeds max uint32`);
  }
  return hexlify(number, { allowMissingPrefix: true })
    .substring(2)
    .padStart(8, '0');
};

/**
 * @public function to pack start/end tier range into a byte size number for the UPDATE_BLOCKS_FOR_TIER_RANGE opcode
 *
 * @param startTier - the start tier of the updating which ranges between 0 to 8 (exclusive)
 * @param endTier - the end tier of the updating which ranges between 0 to 8 (inclusive)
 *
 * @returns a byte size number
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
 * Constructs the operand for RainVM's `zipmap` opcode by packing 3 numbers into a single byte.
 * All parameters use zero-based counting i.e. an `fnSize` of 0 means to allocate one element (32 bytes)
 * on the stack to define your functions, while an `fnSize` of 3 means to allocate all four elements
 * (4 * 32 bytes) on the stack.
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
    throw new Error('Invalid fnIndex');
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
 * @public function to set up the operand for a SELECT_LTE opcode
 *
 * @param logic - 0 = every, 1 = any, acts like a logical and/or for the check against BLOCK_NUMBER
 * @param mode - 0 = min, 1 = max, 2 = first, the way to select the reports that pass the check against BLOCK_NUMBER
 * @param length - the number of reports to stack for SELECT_LTE opcode
 *
 * @returns a byte size number
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
 * @public Utility function to produce 64 bits size hexString
 *
 * @param number - the value to convert into a 64bit size hexString
 *
 * @returns a 16 character hexString (without 0x prefix)
 */
export const paddedUInt64 = (number: BigNumberish): string => {
  if (BigNumber.from(number).gt('0xffffffffffffffff')) {
    throw new Error(`${number} exceeds max uint64`);
  }
  return hexlify(number, { allowMissingPrefix: true })
    .substring(2)
    .padStart(16, '0');
};

/**
 * @public Utility function to produce 128 bits size hexString
 *
 * @param number - the value to convert into a 128bit size hexString
 *
 * @returns a 32 character hexString (without 0x prefix)
 */
export const paddedUInt128 = (number: BigNumberish): string => {
  if (BigNumber.from(number).gt('0xffffffffffffffffffffffffffffffff')) {
    throw new Error(`${number} exceeds max uint128`);
  }
  return hexlify(number, { allowMissingPrefix: true })
    .substring(2)
    .padStart(32, '0');
};

/**
 * @public
 * Utility function that transforms a BigNumberish to an ether address (40 char length hexString)
 *
 * @param report - value as bignumberish
 * @returns hexadecimal string as an ether address (40 char length hexString)
 */
export const paddedUInt160 = (address: BigNumberish): string => {
  if (
    BigNumber.from(address).gt('0xffffffffffffffffffffffffffffffffffffffff')
  ) {
    throw new Error(`${address} exceeds max uint160`);
  }
  return (
    '0x' +
    hexlify(address, { allowMissingPrefix: true })
      .substring(2)
      .padStart(40, '0')
  );
};
