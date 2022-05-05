import { concat, Hexable, hexlify, zeroPad } from "ethers/lib/utils";
import type { BytesLike } from "ethers";
import { BigNumber, Contract, ethers } from "ethers";
import { State, StandardOps, op } from '../src/classes/vm';


/**
 * Converts a value to raw bytes representation. Assumes `value` is less than or equal to 1 byte, unless a desired `bytesLength` is specified.
 *
 * @param value - value to convert to raw bytes format
 * @param bytesLength - (defaults to 1) number of bytes to left pad if `value` doesn't completely fill the desired amount of memory. Will throw `InvalidArgument` error if value already exceeds bytes length.
 * @returns {Uint8Array} - raw bytes representation
 */
export function bytify(
  value: number | BytesLike | Hexable,
  bytesLength = 1
): BytesLike {
  return zeroPad(hexlify(value), bytesLength);
};


export const paddedUInt256 = (report: BigNumber): string => {
  if (report.gt(ethers.constants.MaxUint256)) {
    throw new Error(`${report} exceeds max uint256`);
  }
  return "0x" + report.toHexString().substring(2).padStart(64, "0");
};

export const paddedUInt32 = (number: number | BytesLike | Hexable): string => {
  if (ethers.BigNumber.from(number).gt(ethers.constants.MaxUint256)) {
    throw new Error(`${number} exceeds max uint32`);
  }
  return hexlify(number).substring(2).padStart(8, "0");
};

export function arg(valIndex: number): number {
  let arg = 1;
  arg <<= 7;
  arg += valIndex;
  return arg;
};

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
};

/**
 * Constructs the operand for RainVM's `call` StandardOps by packing 3 numbers into a single byte. All parameters use zero-based counting i.e. an `fnSize` of 0 means to allocate one element (32 bytes) on the stack to define your functions, while an `fnSize` of 3 means to allocate all four elements (4 * 32 bytes) on the stack.
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
    throw new Error("Invalid fnSize");
  } else if (loopSize < 0 || loopSize > 3) {
    throw new Error("Invalid loopSize");
  } else if (valSize < 0 || valSize > 7) {
    throw new Error("Invalid valSize");
  }
  let callSize = valSize;
  callSize <<= 2;
  callSize += loopSize;
  callSize <<= 3;
  callSize += sourceIndex;
  return callSize;
};

export function selectLte(logic: number, mode: number, length: number): number {
  let lte = logic;
  lte <<= 2;
  lte += mode;
  lte <<= 5;
  lte += length;
  return lte;
};

export enum selectLteLogic {
  every,
  any,
};

export enum selectLteMode {
  min,
  max,
  first,
};


/**
 * VM Script to deduct a percentage off of the main script that it is been called for based on a tiers.
 *
 * @param config - the main VM script
 * @param tierParams - an array of 9 items - the tier contract address is the first item and the percentage(range between 0 - 99) of each tier are the next 8 items of the array.
 * @param args - an array of 8 items each holding the activation time (in days) of each tier, if the tier has been held more than this duration then the percentage will be applied, if passed to the function. 
 * @returns {State} - a VM state
 */
export function tierBasedDiscounter(config: State, tierParams, ...args) : State {
  const tierAddress = tierParams[0]
  const tierDiscount = paddedUInt256(
    ethers.BigNumber.from(
      "0x" + 
      paddedUInt32(100 - tierParams[8]) +
      paddedUInt32(100 - tierParams[7]) +
      paddedUInt32(100 - tierParams[6]) +
      paddedUInt32(100 - tierParams[5]) +
      paddedUInt32(100 - tierParams[4]) +
      paddedUInt32(100 - tierParams[3]) +
      paddedUInt32(100 - tierParams[2]) +
      paddedUInt32(100 - tierParams[1])
    )
  )

  const TIER_BASED_DIS = (i) => 
    concat([ 
      op(StandardOps.NEVER),
      op(StandardOps.VAL, i - 1),
      op(StandardOps.UPDATE_BLOCKS_FOR_TIER_RANGE,tierRange(0, 8)),
      op(StandardOps.VAL, i - 2),
      op(StandardOps.VAL, i - 3),
      op(StandardOps.SENDER),
      op(StandardOps.REPORT),
      op(StandardOps.BLOCK_NUMBER),
      op(StandardOps.SELECT_LTE, selectLte(selectLteLogic.every, selectLteMode.first, 2)),
      op(StandardOps.SATURATING_DIFF),
    ])

  const TIER_BASED_DIS_ZIMAP = (i, sourceIndex, valSize) => 
    concat([
      op(StandardOps.ZIPMAP, callSize(sourceIndex, 3, valSize)),
      op(StandardOps.MIN, 8),
      op(StandardOps.MUL, 2),
      op(StandardOps.VAL, i - 1),
      op(StandardOps.DIV, 2)
    ])

  const ACTIVATION_TIME = (i) => 
    concat([
      op(StandardOps.NEVER),
      op(StandardOps.BLOCK_NUMBER),
      op(StandardOps.UPDATE_BLOCKS_FOR_TIER_RANGE,tierRange(0, 8)),
      op(StandardOps.VAL, i - 3),
      op(StandardOps.SENDER),
      op(StandardOps.REPORT),
      op(StandardOps.SATURATING_DIFF),
      op(StandardOps.VAL, i - 4),
    ])

  const TIER_BASED_DIS_FN = (i) => 
    concat([
      op(StandardOps.VAL, i - 1),
      op(StandardOps.VAL, arg(0)),
      op(StandardOps.SUB, 2),
      op(StandardOps.EAGER_IF)
    ])

  const ACTIVATION_TIME_FN = (i) => 
    concat([
      op(StandardOps.VAL, arg(1)),
      op(StandardOps.VAL, arg(2)),
      op(StandardOps.LESS_THAN),
      op(StandardOps.VAL, i - 1),
    ])

  if (args[0]) {
    const tierDiscountActtivation = paddedUInt256(
      ethers.BigNumber.from(
        "0x" + 
        paddedUInt32(args[0][7] * 43200) +
        paddedUInt32(args[0][6] * 43200) +
        paddedUInt32(args[0][5] * 43200) +
        paddedUInt32(args[0][4] * 43200) +
        paddedUInt32(args[0][3] * 43200) +
        paddedUInt32(args[0][2] * 43200) +
        paddedUInt32(args[0][1] * 43200) +
        paddedUInt32(args[0][0] * 43200)
      )
    )
    const constants = [...config.constants, tierDiscountActtivation, tierAddress, tierDiscount, "100"]
    config.sources[0] =
      concat([
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
          op(StandardOps.EAGER_IF)
        ])
      ];
    return {
      constants,
      sources,
      stackLength: Number(config.stackLength) + 30,
      argumentsLength: Number(config.argumentsLength) + 3
    }
  }
  else {
    const constants = [...config.constants, tierAddress, tierDiscount, "100"]
    config.sources[0] =
      concat([
        config.sources[0],
        TIER_BASED_DIS(constants.length),
        TIER_BASED_DIS_ZIMAP(constants.length, config.sources.length, 0),
      ]);
    const sources = [
      ...config.sources,
      TIER_BASED_DIS_FN(constants.length),
    ];
    return {
      constants,
      sources,
      stackLength: Number(config.stackLength) + 20,
      argumentsLength: Number(config.argumentsLength) + 1
    }
  }
};


/**
 * VM Script to multiply the main script that it is been called for based on a tiers.
 *
 * @param config - the main VM script
 * @param tierParams - an array of 9 items - the tier contract address is the first item and the multiplier (2 decimals max) of each tier are the next 8 items of the array.
 * @param args - an array of 8 items each holding the activation time (in days) of each tier, if the tier has been held more than this duration then the multiplier will be applied, if passed to the function. 
 * @returns {State} - a VM state
 */
export function tierBasedMultiplier(config: State, tierParams, ...args) : State {
  const tierAddress = tierParams[0]
  const tierMultiplier = paddedUInt256(
    ethers.BigNumber.from(
      "0x" + 
      paddedUInt32(tierParams[8] * 100) +
      paddedUInt32(tierParams[7] * 100) +
      paddedUInt32(tierParams[6] * 100) +
      paddedUInt32(tierParams[5] * 100) +
      paddedUInt32(tierParams[4] * 100) +
      paddedUInt32(tierParams[3] * 100) +
      paddedUInt32(tierParams[2] * 100) +
      paddedUInt32(tierParams[1] * 100)
    )
  )

  const TIER_BASED_MUL = (i) =>
    concat([
      op(StandardOps.VAL, i - 3),
      op(StandardOps.VAL, i - 4),
      op(StandardOps.SENDER),
      op(StandardOps.REPORT),
      op(StandardOps.BLOCK_NUMBER),
      op(StandardOps.SELECT_LTE, selectLte(selectLteLogic.every, selectLteMode.first, 2)),
      op(StandardOps.NEVER),
      op(StandardOps.BLOCK_NUMBER),
      op(StandardOps.UPDATE_BLOCKS_FOR_TIER_RANGE,tierRange(0, 8)),
    ])

  const TIER_BASED_MUL_ZIPMAP = (i, sourceIndex, valSize) =>
    concat([
      op(StandardOps.ZIPMAP, callSize(sourceIndex, 3, valSize)),
      op(StandardOps.MAX, 8),
      op(StandardOps.MUL, 2),
      op(StandardOps.VAL, i - 2),
      op(StandardOps.DIV, 2),
    ])

  const ACTIVATION_TIME = (i) =>
    concat([
      op(StandardOps.VAL, i - 4),
      op(StandardOps.SENDER),
      op(StandardOps.REPORT),
      op(StandardOps.SATURATING_DIFF),
      op(StandardOps.VAL, i - 5),
    ])

  const TIER_BASED_MUL_FN = (i) =>
    concat([
      op(StandardOps.VAL, arg(0)),
      op(StandardOps.VAL, i - 1),
      op(StandardOps.LESS_THAN),
      op(StandardOps.VAL, arg(0)),
      op(StandardOps.VAL, i - 2),
      op(StandardOps.EAGER_IF),
    ])

  const ACTIVATION_TIME_FN = (i) =>
    concat([
      op(StandardOps.VAL, arg(1)),
      op(StandardOps.VAL, arg(2)),
      op(StandardOps.LESS_THAN),
      op(StandardOps.VAL, i - 2),
    ])
    
  if(args[0]) {
    const tierMultiplierActivation = paddedUInt256(
      ethers.BigNumber.from(
        "0x" + 
        paddedUInt32(args[0][7] * 43200) +
        paddedUInt32(args[0][6] * 43200) +
        paddedUInt32(args[0][5] * 43200) +
        paddedUInt32(args[0][4] * 43200) +
        paddedUInt32(args[0][3] * 43200) +
        paddedUInt32(args[0][2] * 43200) +
        paddedUInt32(args[0][1] * 43200) +
        paddedUInt32(args[0][0] * 43200)
      )
    )
    const constants = [...config.constants, tierMultiplier, tierAddress, tierMultiplierActivation, "100", "0xffffffff"]
    config.sources[0]= 
      concat([
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
        op(StandardOps.EAGER_IF),
      ])
    ];
    return {
      constants,
      sources,
      stackLength: Number(config.stackLength) + 30,
      argumentsLength: Number(config.argumentsLength) + 3
    }
  }
  else {
    const constants = [...config.constants, tierAddress, tierMultiplier, "100", "0xffffffff"]
    config.sources[0]= 
      concat([
        config.sources[0],
        TIER_BASED_MUL(constants.length),
        TIER_BASED_MUL_ZIPMAP(constants.length, config.sources.length, 0),
      ]);
    const sources = [
      ...config.sources,
      TIER_BASED_MUL_FN(constants.length),
    ];
    return {
      constants,
      sources,
      stackLength: Number(config.stackLength) + 20,
      argumentsLength: Number(config.argumentsLength) + 1
    }
  }
};

