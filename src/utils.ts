import { BigNumber, ethers, utils } from 'ethers';
import { StateConfig, AllStandardOps } from '../src/classes/vm';

import type { BytesLike } from 'ethers';
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

export const { concat, hexlify, zeroPad, hexZeroPad, arrayify } = utils;

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
  return '0x' + report.toHexString().substring(2).padStart(64, '0');
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
 * // TODO: Move to CombineTier file
 * deducts percentage off of the results of a VM script based on the holding tier of a tier contract.
 *
 * @param config - the main VM script
 * @param tierAddress - the contract address of the tier contract.
 * @param tierDiscount - an array of 8 items - the discount value (range 0 - 99) of each tier are the 8 items of the array.
 * @param tierActivation - (optional) - an array of 8 items each holding the activation time (in number of blocks) of each tier, if the tier has been held more than this duration then the percentage will be applied.
 * @param index - (optional) the index of the config sources array that the discount applies to, the default index is 0.
 * @returns a VM script @see StateConfig
 */
export function tierBasedDiscounter(
  config: StateConfig,
  tierAddress: string,
  tierDiscount: number[],
  tierActivation?: (number | string)[],
  index?: number
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
    concat([
      op(AllStandardOps.NEVER),
      op(AllStandardOps.VAL, i - 1),
      op(AllStandardOps.UPDATE_BLOCKS_FOR_TIER_RANGE, tierRange(0, 8)),
      op(AllStandardOps.VAL, i - 2),
      op(AllStandardOps.VAL, i - 3),
      op(AllStandardOps.SENDER),
      op(AllStandardOps.REPORT),
      op(AllStandardOps.BLOCK_NUMBER),
      op(
        AllStandardOps.SELECT_LTE,
        selectLte(selectLteLogic.every, selectLteMode.first, 2)
      ),
      op(AllStandardOps.SATURATING_DIFF),
    ]);

  const TIER_BASED_DIS_ZIMAP = (
    i: number,
    sourceIndex: number,
    valSize: number
  ) =>
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

  if (tierActivation && tierActivation.length > 7) {
    const Index = index ? index : 0;
    const TierDiscountActivation = paddedUInt256(
      ethers.BigNumber.from(
        '0x' +
          paddedUInt32(tierActivation[7]) +
          paddedUInt32(tierActivation[6]) +
          paddedUInt32(tierActivation[5]) +
          paddedUInt32(tierActivation[4]) +
          paddedUInt32(tierActivation[3]) +
          paddedUInt32(tierActivation[2]) +
          paddedUInt32(tierActivation[1]) +
          paddedUInt32(tierActivation[0])
      )
    );
    const constants = [
      ...config.constants,
      TierDiscountActivation,
      tierAddress,
      TierDiscount,
      '100',
    ];
    config.sources[Index] = concat([
      config.sources[Index],
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
    const Index = index ? index : 0;
    const constants = [...config.constants, tierAddress, TierDiscount, '100'];
    config.sources[Index] = concat([
      config.sources[Index],
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
 * // TODO: Move to CombineTier file
 * multiples the results of a VM script based on the holding tier of a tier contract.
 *
 * @param config - the main VM script
 * @param tierAddress - the contract address of the tier contract.
 * @param tierMultiplier - an array of 8 items - the multiplier value (2 decimals max) of each tier are the 8 items of the array.
 * @param tierActivation - (optional) - an array of 8 items each holding the activation time (in number of blocks) of each tier, if the tier has been held more than this duration then the multiplier will be applied.
 * @param index - (optional) the index of the config sources array that the multiplier applies to, the default index is 0.
 * @returns a VM script @see StateConfig
 */
export function tierBasedMultiplier(
  config: StateConfig,
  tierAddress: string,
  tierMultiplier: number[],
  tierActivation?: (number | string)[],
  index?: number
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

  const TIER_BASED_MUL_ZIPMAP = (
    i: number,
    sourceIndex: number,
    valSize: number
  ) =>
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

  if (tierActivation && tierActivation.length > 7) {
    const Index = index ? index : 0;
    const TierMultiplierActivation = paddedUInt256(
      ethers.BigNumber.from(
        '0x' +
          paddedUInt32(tierActivation[7]) +
          paddedUInt32(tierActivation[6]) +
          paddedUInt32(tierActivation[5]) +
          paddedUInt32(tierActivation[4]) +
          paddedUInt32(tierActivation[3]) +
          paddedUInt32(tierActivation[2]) +
          paddedUInt32(tierActivation[1]) +
          paddedUInt32(tierActivation[0])
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
    config.sources[Index] = concat([
      config.sources[Index],
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
    const Index = index ? index : 0;
    const constants = [
      ...config.constants,
      tierAddress,
      TierMultiplier,
      '100',
      '0xffffffff',
    ];
    config.sources[Index] = concat([
      config.sources[Index],
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

/**
 * makes an address the owner of a VM Script - checks the sender address against the owner address and if it passes the final result will be determined by the main VM script and if it fails it will be 0 by default.
 *
 * @param config - the main VM script
 * @param ownerAddress - the address that is going to be the owner of the main VM script.
 * @param notOwnerVar - (optional) - the value or a 2nd VM script, that will be the final result in case that the sender is not the owner ,the default result value if no args passed and the check fails is 0.
 * @param index - (optional) the index of the config sources array that determines where the makeOwner sources apply to, default index is 0.
 * @returns a VM script. @see StateConfig
 */
export function makeOwner(
  config: StateConfig,
  ownerAddress: string,
  notOwnerVar?: number | string | StateConfig,
  index?: number
): StateConfig {
  const Index = index ? index : 0;
  const MAKE_OWNER = (i: any) =>
    concat([
      op(AllStandardOps.VAL, i),
      op(AllStandardOps.SENDER),
      op(AllStandardOps.EQUAL_TO),
    ]);

  if (notOwnerVar && typeof notOwnerVar === 'object') {
    const constants = [
      ...config.constants,
      ...notOwnerVar.constants,
      ownerAddress,
    ];
    for (let i = 0; i < notOwnerVar.sources.length; i++) {
      for (let j = 0; j < notOwnerVar.sources[i].length; j++) {
        if (notOwnerVar.sources[i][j] == 1) {
          notOwnerVar.sources[i] = replaceAt(
            notOwnerVar.sources[i],
            j + 1,
            +notOwnerVar.sources[i][j + 1] + config.constants.length
          );
        }
        if (notOwnerVar.sources[i][j] == 3) {
          let srcIndex = config.sources.length - 1;
          srcIndex <<= 5;
          notOwnerVar.sources[i] = replaceAt(
            notOwnerVar.sources[i],
            j + 1,
            +notOwnerVar.sources[i][j + 1] + srcIndex
          );
        }
        j++;
      }
    }
    config.sources[Index] = concat([
      MAKE_OWNER(constants.length - 1),
      config.sources[Index],
      notOwnerVar.sources[0],
      op(AllStandardOps.EAGER_IF),
    ]);
    notOwnerVar.sources.splice(0, 1);
    const sources = [...config.sources, ...notOwnerVar.sources];

    const finalStackLength = BigNumber.from(config.stackLength)
      .add(notOwnerVar.stackLength)
      .add(4);
    const finalArgumentsLength = BigNumber.from(config.argumentsLength).add(
      notOwnerVar.argumentsLength
    );

    return {
      constants,
      sources,
      stackLength: finalStackLength,
      argumentsLength: finalArgumentsLength,
    };
  } else {
    const NotOwnerVar = notOwnerVar ? notOwnerVar : 0;
    const constants = [...config.constants, ownerAddress, NotOwnerVar];
    config.sources[Index] = concat([
      MAKE_OWNER(constants.length - 2),
      config.sources[Index],
      op(AllStandardOps.VAL, constants.length - 1),
      op(AllStandardOps.EAGER_IF),
    ]);
    const sources = config.sources;
    return {
      constants,
      sources,
      stackLength: Number(config.stackLength) + 5,
      argumentsLength: config.argumentsLength,
    };
  }
}

/**
 * combines 2 individual VM scripts
 *
 * @param config1 - the first VM script that will be combined. (default sits at top)
 * @param config2 - the second VM script that will be combined. (default sits at bottom)
 * @param numberOfSources - number of sources to combine, starting from sources index of each script.
 * @param position - (optional) an array representing the positions of config1 script where config2 script will be merged at; default setting will apply if not specified; position array length must be equal to sourcesNo or else it will be ignored.
 * @param index1 - (optional) - the index of the config1 sources array that will be combined, the default index is 0.
 * @param index2 - (optional) - the index of the config2 sources array that will be combined, the default index is 0.
 * @returns combined VM script. @see StateConfig
 */
export function vmStateCombiner(
  config1: StateConfig,
  config2: StateConfig,
  numberOfSources: number,
  position?: number[],
  index1?: number,
  index2?: number
): StateConfig {
  const Index1 = index1 ? index1 : 0;
  const Index2 = index2 ? index2 : 0;
  const constants = [...config1.constants, ...config2.constants];

  for (let i = 0; i < config2.sources.length; i++) {
    for (let j = 0; j < config2.sources[i].length; j++) {
      if (config2.sources[i][j] == 1) {
        config2.sources[i] = replaceAt(
          config2.sources[i],
          j + 1,
          +config2.sources[i][j + 1] + config1.constants.length
        );
      }
      if (config2.sources[i][j] == 3) {
        let srcIndex = config1.sources.length - numberOfSources;
        srcIndex <<= 5;
        config2.sources[i] = replaceAt(
          config2.sources[i],
          j + 1,
          +config2.sources[i][j + 1] + srcIndex
        );
      }
      j++;
    }
  }

  if (position && position.length == numberOfSources) {
    for (let i = 0; i < numberOfSources; i++) {
      const sources1 = config1.sources[Index1 + i];
      const arrSource1 = toUint8Array(sources1);

      config1.sources[Index1 + i] = concat([
        arrSource1.subarray(0, position[i] * 2),
        config2.sources[Index2 + i],
        arrSource1.subarray(position[i] * 2),
      ]);
    }
  } else {
    for (let i = 0; i < numberOfSources; i++) {
      config1.sources[Index1 + i] = concat([
        config1.sources[Index1 + i],
        config2.sources[Index2 + i],
      ]);
    }
  }

  config2.sources.splice(Index2, numberOfSources);
  const sources = [...config1.sources, ...config2.sources];

  const finalStackLength = BigNumber.from(config1.stackLength).add(
    config2.stackLength
  );
  const finalArgumentsLength = BigNumber.from(config1.argumentsLength).add(
    config2.argumentsLength
  );

  return {
    constants,
    sources,
    stackLength: finalStackLength,
    argumentsLength: finalArgumentsLength,
  };
}

/**
 * Replace a value in a BytesLike. Set `replacement` in the `index` on the `original` BytesLike value
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
  original = toUint8Array(original);
  const originalParsed = Array.from(original);
  originalParsed[index] = parseInt(replacement.toString());
  return originalParsed;
};

export function skip(places: number, conditional = false): number {
  let skip = conditional ? 1 : 0;
  skip <<= 7;
  // JS ints are already signed.
  skip |= places & 0x7f;
  return skip;
}

/**
 * @public
 * Check and convert any type of `BytesLike` to an `Uint8Array`
 *
 * @param data - Byteslike to convert
 * @returns An Uint8Array
 */
export function toUint8Array(data: BytesLike): Uint8Array {
  if (!utils.isBytes(data)) {
    if (utils.isHexString(data)) {
      data = utils.arrayify(data);
    } else {
      if (utils.isHexString('0x' + data)) {
        data = utils.arrayify('0x' + data);
      } else {
        throw new Error(`Invalid Hexadecimal expression ${'0x' + data}`);
      }
    }
  }

  return Uint8Array.from(data);
}
