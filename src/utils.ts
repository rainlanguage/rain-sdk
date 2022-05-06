import type { BytesLike } from 'ethers';
import { BigNumber, ethers, utils } from 'ethers';
import { StateConfig, AllStandardOps, VM } from './classes/vm';

export type Hexable = utils.Hexable;

export enum selectLteLogic {
  every,
  any,
}
export enum selectLteMode {
  min,
  max,
  first,
}

export const { concat, hexlify, zeroPad, hexZeroPad } = utils;

/**
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
 *
 * Utility function that transforms a BigNumber from the output of the ITier contract report
 * @param report - report as bignumber from the ITier contract
 * @returns hexadecimal string of the report already padded
 */
export const paddedUInt256 = (report: BigNumber): string => {
  if (report.gt(ethers.constants.MaxUint256)) {
    throw new Error(`${report} exceeds max uint256`);
  }
  return hexZeroPad(report.toHexString(), 32);
};

export const paddedUInt32 = (number: number | BytesLike | Hexable): string => {
  if (ethers.BigNumber.from(number).gt(ethers.constants.MaxUint256)) {
    throw new Error(`${number} exceeds max uint32`);
  }
  return hexlify(number).substring(2).padStart(8, '0');
};

export function arg(valIndex: number): number {
  let arg = 1;
  arg <<= 7;
  arg += valIndex;
  return arg;
}

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
 *
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

export function selectLte(logic: number, mode: number, length: number): number {
  let lte = logic;
  lte <<= 2;
  lte += mode;
  lte <<= 5;
  lte += length;
  return lte;
}

/**
 * VM Script to deduct a percentage off of the main script that it is been called for based on the holding tier of a tier contract.
 *
 * @param config - the main VM script
 * @param tierAddress - the contract address of the tier contract.
 * @param tierMultiplier - an array of 8 items - the discount value (range 0 - 99) of each tier are the 8 items of the array.
 * @param args - (optional) 1. an array of 8 items each holding the activation time (in days) of each tier, if the tier has been held more than this duration then the percentage will be applied - 2. avg block per second.
 * @returns {StateConfig} - a VM state
 */
export function tierBasedDiscounter(
  config: StateConfig,
  tierAddress: string,
  tierDiscount: number[],
  ...args: any[]
): StateConfig {
  const TierDiscount = paddedUInt256(
    ethers.BigNumber.from(
      '0x' +
        paddedUInt32(100 - tierDiscount[7]) +
        paddedUInt32(100 - tierDiscount[6]) +
        paddedUInt32(100 - tierDiscount[5]) +
        paddedUInt32(100 - tierDiscount[4]) +
        paddedUInt32(100 - tierDiscount[3]) +
        paddedUInt32(100 - tierDiscount[2]) +
        paddedUInt32(100 - tierDiscount[1]) +
        paddedUInt32(100 - tierDiscount[0])
    )
  );
  const TIER_BASED_DIS = (i: number) =>
    VM.createVMSources([
      [AllStandardOps.NEVER],
      [AllStandardOps.VAL, i - 1],
      [AllStandardOps.UPDATE_BLOCKS_FOR_TIER_RANGE, tierRange(0, 8)],
      [AllStandardOps.VAL, i - 2],
      [AllStandardOps.VAL, i - 3],
      [AllStandardOps.SENDER],
      [AllStandardOps.REPORT],
      [AllStandardOps.BLOCK_NUMBER],
      [
        AllStandardOps.SELECT_LTE,
        selectLte(selectLteLogic.every, selectLteMode.first, 2),
      ],
      [AllStandardOps.SATURATING_DIFF],
    ])[0];

  const TIER_BASED_DIS_ZIMAP = (i: number, sourceIndex: number, valSize: number) =>
    concat([
      op(AllStandardOps.ZIPMAP, callSize(sourceIndex, 3, valSize)),
      op(AllStandardOps.MIN, 8),
      op(AllStandardOps.MUL, 2),
      op(AllStandardOps.VAL, i - 1),
      op(AllStandardOps.DIV, 2),
    ]);

  const ACTIVATION_TIME = (i: number) =>
    concat([
      op(AllStandardOps.NEVER),
      op(AllStandardOps.BLOCK_NUMBER),
      op(AllStandardOps.UPDATE_BLOCKS_FOR_TIER_RANGE, tierRange(0, 8)),
      op(AllStandardOps.VAL, i - 3),
      op(AllStandardOps.SENDER),
      op(AllStandardOps.REPORT),
      op(AllStandardOps.SATURATING_DIFF),
      op(AllStandardOps.VAL, i - 4),
    ]);

  const TIER_BASED_DIS_FN = (i: number) =>
    concat([
      op(AllStandardOps.VAL, i - 1),
      op(AllStandardOps.VAL, arg(0)),
      op(AllStandardOps.SUB, 2),
      op(AllStandardOps.EAGER_IF),
    ]);

  const ACTIVATION_TIME_FN = (i: number) =>
    concat([
      op(AllStandardOps.VAL, arg(1)),
      op(AllStandardOps.VAL, arg(2)),
      op(AllStandardOps.LESS_THAN),
      op(AllStandardOps.VAL, i - 1),
    ]);

  if (args[0]) {
    const avgBlockPerDay = args[1] ? 86400 / args[1] : 43200; // 43200 - avg number of blocks per day for polygon network
    const TierDiscountActivation = paddedUInt256(
      ethers.BigNumber.from(
        '0x' +
          paddedUInt32(args[0][7] * avgBlockPerDay) +
          paddedUInt32(args[0][6] * avgBlockPerDay) +
          paddedUInt32(args[0][5] * avgBlockPerDay) +
          paddedUInt32(args[0][4] * avgBlockPerDay) +
          paddedUInt32(args[0][3] * avgBlockPerDay) +
          paddedUInt32(args[0][2] * avgBlockPerDay) +
          paddedUInt32(args[0][1] * avgBlockPerDay) +
          paddedUInt32(args[0][0] * avgBlockPerDay)
      )
    );
    const constants = [
      ...config.constants,
      TierDiscountActivation,
      tierAddress,
      TierDiscount,
      '100',
    ];
    config.sources[0] = concat([
      config.sources[0],
      TIER_BASED_DIS(constants.length),
      ACTIVATION_TIME(constants.length),
      TIER_BASED_DIS_ZIMAP(constants.length, config.sources.length, 2),
    ]);

    const sources = [
      ...config.sources,
      concat([
        ACTIVATION_TIME_FN(constants.length),
        TIER_BASED_DIS_FN(constants.length),
        op(AllStandardOps.EAGER_IF),
      ]),
    ];
    return {
      constants,
      sources,
      stackLength: Number(config.stackLength) + 30,
      argumentsLength: Number(config.argumentsLength) + 3,
    };
  } else {
    const constants = [...config.constants, tierAddress, TierDiscount, '100'];
    config.sources[0] = concat([
      config.sources[0],
      TIER_BASED_DIS(constants.length),
      TIER_BASED_DIS_ZIMAP(constants.length, config.sources.length, 0),
    ]);
    const sources = [...config.sources, TIER_BASED_DIS_FN(constants.length)];
    return {
      constants,
      sources,
      stackLength: Number(config.stackLength) + 20,
      argumentsLength: Number(config.argumentsLength) + 1,
    };
  }
}

/**
 * VM Script to multiply the main script that it is been called for based on the holding tier of a tier contract.
 *
 * @param config - the main VM script
 * @param tierAddress - the contract address of the tier contract.
 * @param tierMultiplier - an array of 8 items - the multiplier value (2 decimals max) of each tier are the 8 items of the array.
 * @param args - (optional) 1. an array of 8 items each holding the activation time (in days) of each tier, if the tier has been held more than this duration then the multiplier will be applied - 2. avg block per second.
 * @returns {StateConfig} - a VM state
 */
export function tierBasedMultiplier(
  config: StateConfig,
  tierAddress: string,
  tierMultiplier: number[],
  ...args: any[]
): StateConfig {
  const TierMultiplier = paddedUInt256(
    ethers.BigNumber.from(
      '0x' +
        paddedUInt32(tierMultiplier[7] * 100) +
        paddedUInt32(tierMultiplier[6] * 100) +
        paddedUInt32(tierMultiplier[5] * 100) +
        paddedUInt32(tierMultiplier[4] * 100) +
        paddedUInt32(tierMultiplier[3] * 100) +
        paddedUInt32(tierMultiplier[2] * 100) +
        paddedUInt32(tierMultiplier[1] * 100) +
        paddedUInt32(tierMultiplier[0] * 100)
    )
  );

  const TIER_BASED_MUL = (i: number) =>
    concat([
      op(AllStandardOps.VAL, i - 3),
      op(AllStandardOps.VAL, i - 4),
      op(AllStandardOps.SENDER),
      op(AllStandardOps.REPORT),
      op(AllStandardOps.BLOCK_NUMBER),
      op(
        AllStandardOps.SELECT_LTE,
        selectLte(selectLteLogic.every, selectLteMode.first, 2)
      ),
    ]);

  const TIER_BASED_MUL_ZIPMAP = (i: number, sourceIndex: number, valSize: number) =>
    concat([
      op(AllStandardOps.ZIPMAP, callSize(sourceIndex, 3, valSize)),
      op(AllStandardOps.MAX, 8),
      op(AllStandardOps.MUL, 2),
      op(AllStandardOps.VAL, i - 2),
      op(AllStandardOps.DIV, 2),
    ]);

  const ACTIVATION_TIME = (i: number) =>
    concat([
      op(AllStandardOps.NEVER),
      op(AllStandardOps.BLOCK_NUMBER),
      op(AllStandardOps.UPDATE_BLOCKS_FOR_TIER_RANGE, tierRange(0, 8)),
      op(AllStandardOps.VAL, i - 4),
      op(AllStandardOps.SENDER),
      op(AllStandardOps.REPORT),
      op(AllStandardOps.SATURATING_DIFF),
      op(AllStandardOps.VAL, i - 5),
    ]);

  const TIER_BASED_MUL_FN = (i: number) =>
    concat([
      op(AllStandardOps.VAL, arg(0)),
      op(AllStandardOps.VAL, i - 1),
      op(AllStandardOps.LESS_THAN),
      op(AllStandardOps.VAL, arg(0)),
      op(AllStandardOps.VAL, i - 2),
      op(AllStandardOps.EAGER_IF),
    ]);

  const ACTIVATION_TIME_FN = (i: number) =>
    concat([
      op(AllStandardOps.VAL, arg(1)),
      op(AllStandardOps.VAL, arg(2)),
      op(AllStandardOps.LESS_THAN),
      op(AllStandardOps.VAL, i - 2),
    ]);

  if (args[0]) {
    const avgBlockPerDay = args[1] ? 86400 / args[1] : 43200; // 43200 - avg number of blocks per day for polygon network
    const TierMultiplierActivation = paddedUInt256(
      ethers.BigNumber.from(
        '0x' +
          paddedUInt32(args[0][7] * avgBlockPerDay) +
          paddedUInt32(args[0][6] * avgBlockPerDay) +
          paddedUInt32(args[0][5] * avgBlockPerDay) +
          paddedUInt32(args[0][4] * avgBlockPerDay) +
          paddedUInt32(args[0][3] * avgBlockPerDay) +
          paddedUInt32(args[0][2] * avgBlockPerDay) +
          paddedUInt32(args[0][1] * avgBlockPerDay) +
          paddedUInt32(args[0][0] * avgBlockPerDay)
      )
    );
    const constants = [
      ...config.constants,
      TierMultiplierActivation,
      tierAddress,
      TierMultiplier,
      '100',
      '0xffffffff',
    ];
    config.sources[0] = concat([
      config.sources[0],
      TIER_BASED_MUL(constants.length),
      ACTIVATION_TIME(constants.length),
      TIER_BASED_MUL_ZIPMAP(constants.length, config.sources.length, 2),
    ]);
    const sources = [
      ...config.sources,
      concat([
        ACTIVATION_TIME_FN(constants.length),
        TIER_BASED_MUL_FN(constants.length),
        op(AllStandardOps.EAGER_IF),
      ]),
    ];
    return {
      constants,
      sources,
      stackLength: Number(config.stackLength) + 30,
      argumentsLength: Number(config.argumentsLength) + 3,
    };
  } else {
    const constants = [
      ...config.constants,
      tierAddress,
      TierMultiplier,
      '100',
      '0xffffffff',
    ];
    config.sources[0] = concat([
      config.sources[0],
      TIER_BASED_MUL(constants.length),
      TIER_BASED_MUL_ZIPMAP(constants.length, config.sources.length, 0),
    ]);
    const sources = [...config.sources, TIER_BASED_MUL_FN(constants.length)];
    return {
      constants,
      sources,
      stackLength: Number(config.stackLength) + 20,
      argumentsLength: Number(config.argumentsLength) + 1,
    };
  }
}

export {};
