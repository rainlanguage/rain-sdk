import { BytesLike, BigNumberish, BigNumber, utils } from 'ethers';
import {
  replaceAt,
  toUint8Array,
  paddedUInt256,
  paddedUInt32,
  concat,
  op,
  tierRange,
  selectLte,
  selectLteMode,
  selectLteLogic,
  callSize,
  arg,
} from '../utils';

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
  /**
   * Length of the Standard Opcodes
   */
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
 *
 * Parameter that will use to converted to the source.
 *
 * Use an opcode and operand (optional)
 */
export type OPerand = [number, (number | BytesLike | utils.Hexable)?];

/**
 * @public
 *
 * //TODO: Add doc
 */
export class VM {
  /**
   * All the standard Op Codes
   */
  public static Opcodes = AllStandardOps;

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

  /**
   * Make an address the owner of a VM Script - checks the sender address against the owner address and if it passes the final result will be determined by the main VM script and if it fails it will be 0 by default.
   *
   * @param config - the main VM script
   * @param ownerAddress - the address that is going to be the owner of the main VM script.
   * @param notOwnerVar - (optional) - the value or a 2nd VM script, that will be the final result in case that the sender is not the owner ,the default result value if no args passed and the check fails is 0.
   * @param index - (optional) the index of the config sources array that determines where the makeOwner sources apply to, default index is 0.
   * @returns a VM script. @see StateConfig
   */
  public static makeOwner(
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
   * Combines 2 individual VM scripts
   *
   * @param config1 - the first VM script that will be combined. (default sits at top)
   * @param config2 - the second VM script that will be combined. (default sits at bottom)
   * @param numberOfSources - number of sources to combine, starting from sources index of each script.
   * @param position - (optional) an array representing the positions of config1 script where config2 script will be merged at; default setting will apply if not specified; position array length must be equal to sourcesNo or else it will be ignored.
   * @param index1 - (optional) - the index of the config1 sources array that will be combined, the default index is 0.
   * @param index2 - (optional) - the index of the config2 sources array that will be combined, the default index is 0.
   * @returns combined VM script. @see StateConfig
   */
  public static vmStateCombiner(
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
   * Deducts percentage off of the result of a VM script based on the holding tier of a tier contract.
   *
   * @param config - the main VM script
   * @param tierAddress - the contract address of the tier contract.
   * @param tierDiscount - an array of 8 items - the discount value (range 0 - 99) of each tier are the 8 items of the array.
   * @param tierActivation - (optional) - an array of 8 items each holding the activation time (in number of blocks) of each tier, if the tier has been held more than this duration then the percentage will be applied.
   * @param index - (optional) the index of the config sources array that the discount applies to, the default index is 0.
   * @returns a VM script @see StateConfig
   */
  public static tierBasedDiscounter(
    config: StateConfig,
    tierAddress: string,
    tierDiscount: number[],
    tierActivation?: (number | string)[],
    index?: number
  ): StateConfig {
    const TierDiscount = paddedUInt256(
      BigNumber.from(
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
        op(VM.Opcodes.NEVER),
        op(VM.Opcodes.VAL, i - 1),
        op(VM.Opcodes.UPDATE_BLOCKS_FOR_TIER_RANGE, tierRange(0, 8)),
        op(VM.Opcodes.VAL, i - 2),
        op(VM.Opcodes.VAL, i - 3),
        op(VM.Opcodes.SENDER),
        op(VM.Opcodes.REPORT),
        op(VM.Opcodes.BLOCK_NUMBER),
        op(
          VM.Opcodes.SELECT_LTE,
          selectLte(selectLteLogic.every, selectLteMode.first, 2)
        ),
        op(VM.Opcodes.SATURATING_DIFF),
      ]);

    const TIER_BASED_DIS_ZIMAP = (
      i: number,
      sourceIndex: number,
      valSize: number
    ) =>
      concat([
        op(VM.Opcodes.ZIPMAP, callSize(sourceIndex, 3, valSize)),
        op(VM.Opcodes.MIN, 8),
        op(VM.Opcodes.MUL, 2),
        op(VM.Opcodes.VAL, i - 1),
        op(VM.Opcodes.DIV, 2),
      ]);

    const ACTIVATION_TIME = (i: number) =>
      concat([
        op(VM.Opcodes.NEVER),
        op(VM.Opcodes.BLOCK_NUMBER),
        op(VM.Opcodes.UPDATE_BLOCKS_FOR_TIER_RANGE, tierRange(0, 8)),
        op(VM.Opcodes.VAL, i - 3),
        op(VM.Opcodes.SENDER),
        op(VM.Opcodes.REPORT),
        op(VM.Opcodes.SATURATING_DIFF),
        op(VM.Opcodes.VAL, i - 4),
      ]);

    const TIER_BASED_DIS_FN = (i: number) =>
      concat([
        op(VM.Opcodes.VAL, i - 1),
        op(VM.Opcodes.VAL, arg(0)),
        op(VM.Opcodes.SUB, 2),
        op(VM.Opcodes.EAGER_IF),
      ]);

    const ACTIVATION_TIME_FN = (i: number) =>
      concat([
        op(VM.Opcodes.VAL, arg(1)),
        op(VM.Opcodes.VAL, arg(2)),
        op(VM.Opcodes.LESS_THAN),
        op(VM.Opcodes.VAL, i - 1),
      ]);

    if (tierActivation && tierActivation.length > 7) {
      const Index = index ? index : 0;
      const TierDiscountActivation = paddedUInt256(
        BigNumber.from(
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
          op(VM.Opcodes.EAGER_IF),
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
   * Multiply the result of a VM script based on the holding tier of a tier contract.
   *
   * @param config - the main VM script
   * @param tierAddress - the contract address of the tier contract.
   * @param tierMultiplier - an array of 8 items - the multiplier value (2 decimals max) of each tier are the 8 items of the array.
   * @param tierActivation - (optional) - an array of 8 items each holding the activation time (in number of blocks) of each tier, if the tier has been held more than this duration then the multiplier will be applied.
   * @param index - (optional) the index of the config sources array that the multiplier applies to, the default index is 0.
   * @returns a VM script @see StateConfig
   */
  public static tierBasedMultiplier(
    config: StateConfig,
    tierAddress: string,
    tierMultiplier: number[],
    tierActivation?: (number | string)[],
    index?: number
  ): StateConfig {
    const TierMultiplier = paddedUInt256(
      BigNumber.from(
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
        op(VM.Opcodes.VAL, i - 3),
        op(VM.Opcodes.VAL, i - 4),
        op(VM.Opcodes.SENDER),
        op(VM.Opcodes.REPORT),
        op(VM.Opcodes.BLOCK_NUMBER),
        op(
          VM.Opcodes.SELECT_LTE,
          selectLte(selectLteLogic.every, selectLteMode.first, 2)
        ),
      ]);

    const TIER_BASED_MUL_ZIPMAP = (
      i: number,
      sourceIndex: number,
      valSize: number
    ) =>
      concat([
        op(VM.Opcodes.ZIPMAP, callSize(sourceIndex, 3, valSize)),
        op(VM.Opcodes.MAX, 8),
        op(VM.Opcodes.MUL, 2),
        op(VM.Opcodes.VAL, i - 2),
        op(VM.Opcodes.DIV, 2),
      ]);

    const ACTIVATION_TIME = (i: number) =>
      concat([
        op(VM.Opcodes.NEVER),
        op(VM.Opcodes.BLOCK_NUMBER),
        op(VM.Opcodes.UPDATE_BLOCKS_FOR_TIER_RANGE, tierRange(0, 8)),
        op(VM.Opcodes.VAL, i - 4),
        op(VM.Opcodes.SENDER),
        op(VM.Opcodes.REPORT),
        op(VM.Opcodes.SATURATING_DIFF),
        op(VM.Opcodes.VAL, i - 5),
      ]);

    const TIER_BASED_MUL_FN = (i: number) =>
      concat([
        op(VM.Opcodes.VAL, arg(0)),
        op(VM.Opcodes.VAL, i - 1),
        op(VM.Opcodes.LESS_THAN),
        op(VM.Opcodes.VAL, arg(0)),
        op(VM.Opcodes.VAL, i - 2),
        op(VM.Opcodes.EAGER_IF),
      ]);

    const ACTIVATION_TIME_FN = (i: number) =>
      concat([
        op(VM.Opcodes.VAL, arg(1)),
        op(VM.Opcodes.VAL, arg(2)),
        op(VM.Opcodes.LESS_THAN),
        op(VM.Opcodes.VAL, i - 2),
      ]);

    if (tierActivation && tierActivation.length > 7) {
      const Index = index ? index : 0;
      const TierMultiplierActivation = paddedUInt256(
        BigNumber.from(
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
          op(VM.Opcodes.EAGER_IF),
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
}
