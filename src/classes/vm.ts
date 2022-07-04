import { BytesLike, BigNumberish, utils, BigNumber, ethers } from 'ethers';
import {
  paddedUInt256,
  paddedUInt32,
  concat,
  op,
  tierRange,
  selectLte,
  selectLteMode,
  selectLteLogic,
  callSize,
  arrayify,
} from '../utils';

/**
 * @public
 *
 * All the standard Op Codes
 */
export enum AllStandardOps {
  /**
   * Copies a value either off `constants` or `arguments` to the top of
   * the stack. arguments will go at the end of the constants array.
   */
  CONSTANT,
  /**
   * Duplicates any value in the stack to the top of the stack. The operand
   * specifies the index to copy from.
   */
  STACK,
  /**
   * stacks an item of the contextual array of values of an underlying contract
   * passed by caller when calling the contract's methods. operand is the index
   * to access the desired item in the array.
   */
  CONTEXT,
  /**
   * used as local opcodes i.e. opcodes to stack the contract's storage contents i.e.
   * porperties/variables. operand determines the storage location to be stacked.
   */
  STORAGE,
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
   * Opcode for `IERC20` `balanceOf`.
   */
  IERC20_BALANCE_OF,
  /**
   * Opcode for `IERC20` `totalSupply`.
   */
  IERC20_TOTAL_SUPPLY,
  /**
   * Opcode for `IERC20` use an Snapshot `balanceOfAt`.
   */
  IERC20_SNAPSHOT_BALANCE_OF_AT,
  /**
   * Opcode for `IERC20` use an Snapshot `totalSupplyAt`.
   */
  IERC20_SNAPSHOT_TOTAL_SUPPLY_AT,
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
   * Opcode for the block number.
   */
  BLOCK_NUMBER,
  /**
   * Opcode for the `msg.sender`.
   */
  SENDER,
  /**
   * Opcode for `this` address of the current contract.
   */
  THIS_ADDRESS,
  /**
   * Opcode for the block timestamp.
   */
  BLOCK_TIMESTAMP,
  /**
   * Opcode to rescale some fixed point number to 18 OOMs in situ.
   */
  SCALE18,
  /**
   * Opcode for division.
   */
  SCALE18_DIV,
  /**
   * Opcode for multiplication.
   */
  SCALE18_MUL,
  /**
   * Opcode to rescale an arbitrary fixed point number by some OOMs.
   */
  SCALE_BY,
  /**
   * Opcode to rescale an 18 OOMs fixed point number to scale N.
   */
  SCALEN,
  /**
   * Opcode for ANY.
   */
  ANY,
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
   * Opcode for EVERY.
   */
  EVERY,
  /**
   * Opcode for GREATER_THAN.
   */
  GREATER_THAN,
  /**
   * Opcode for ISZERO.
   */
  ISZERO,
  /**
   * Opcode for LESS_THAN.
   */
  LESS_THAN,
  /**
   * Opcode for saturating addition.
   */
  SATURATING_ADD,
  /**
   * Opcode for saturating multiplication.
   */
  SATURATING_MUL,
  /**
   * Opcode for saturating subtraction.
   */
  SATURATING_SUB,
  /**
   * Opcode for addition.
   */
  ADD,
  /**
   * Opcode for division
   */
  DIV,
  /**
   * Opcode for exponentiation.
   */
  EXP,
  /**
   * Opcode for maximum.
   */
  MAX,
  /**
   * Opcode for minimum.
   */
  MIN,
  /**
   * Opcode for modulo.
   */
  MOD,
  /**
   * Opcode for multiplication.
   */
  MUL,
  /**
   * Opcode for subtraction.
   */
  SUB,
  /**
   * Opcode to call `report` on an `ITierV2` contract.
   */
  ITIERV2_REPORT,
  /**
   * Opcode to call `reportTimeForTier` on an `ITierV2` contract.
   */
  ITIERV2_REPORT_TIME_FOR_TIER,
  /**
   * Opcode to calculate the tierwise diff of two reports.
   */
  SATURATING_DIFF,
  /**
   * Opcode to tierwise select the best block lte a reference block.
   */
  SELECT_LTE,
  /**
   * Opcode to update the timestamp over a range of tiers for a report.
   */
  UPDATE_TIMES_FOR_TIER_RANGE,
  /**
   * length of available opcodes
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
}

/**
 * @public
 * Interface for accessible by vm storage's slots range available for a contract to be
 * used as local opcodes.
 */
export interface StorageOpcodesRange {
  /**
   * pointer to the storage slot of the first property of properties of a contract used
   * as STORAGE opcode.
   */
  pointer: BigNumberish;
  /**
   * Length of the storage opcodes of a contract, i.e. the number of local opcodes
   */
  length: BigNumberish;
}

/**
 * @public
 * Enum for DEBUG opcode operands
 */
export enum Debug {
  /**
   * ABI of the current state of State
   */
  StateAbi,
  /**
   * current state of State as packed bytes
   */
  StatePacked,
  /**
   * current state of stack
   */
  Stack,
  /**
   * current stack index
   */
  StackIndex,
  /**
   * length of DEBUG's valid operands
   */
  length,
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
  public static createVMSources(
    OPerands: (OPerand | Uint8Array)[]
  ): [Uint8Array] {
    return [
      concat(
        OPerands.map((x) => {
          if (x.constructor === Uint8Array) {
            return x;
          } else {
            return op(x[0], x[1] || 0);
          }
        })
      ),
    ];
  }

  /**
   * Combines 2 individual VM scripts
   *
   * @remarks - please be aware if your script has STACK opcode, as STACK is relative to script and cannot be handled by this method
   * and needs to be dealt with manualy before calling this method.
   *
   * @param config1 - the first VM script that will be combined. (default sits at top)
   * @param config2 - the second VM script that will be combined. (default sits at bottom)
   * @param options - used for additional configuraions:
   *    - (param) index - to identify which sources item in config1.sources the combination starts at, if not specified, it will be 0.
   *    - (param) - numberOfSources - for specifying how many sources item to combine.
   *    - (param) position - An array representing the positions of config1 script where config2 sources
   *       will be merged at; position, array length must be equal to 'numberOfSources' or else it will be ignored.
   * @returns combined VM script. @see StateConfig
   */
  public static combiner(
    config1: StateConfig,
    config2: StateConfig,
    options?: {
      index?: number;
      numberOfSources?: number;
      position?: number[];
    }
  ): StateConfig {
    const NumberOfSources =
      options?.numberOfSources !== undefined ? options.numberOfSources : 1;
    let sourceModify1;
    let sourceModify2;

    const constants = [...config1.constants, ...config2.constants];
    let sources: BytesLike[];

    let argCount = 0;
    for (let i = 0; i < config1.sources.length; i++) {
      let src = arrayify(config1.sources[i], { allowMissingPrefix: true });
      for (let j = 0; j < src.length; j++) {
        if (src[j] === 4) {
          argCount += (src[j + 1] >> 5) + 1;
        }
        j++;
      }
    }

    if (NumberOfSources === 0) {
      for (let i = 0; i < config1.sources.length; i++) {
        sourceModify1 = arrayify(config1.sources[i], {
          allowMissingPrefix: true,
        });
        for (let j = 0; j < sourceModify1.length; j++) {
          if (sourceModify1[j] === 0) {
            if (sourceModify1[j + 1] >= config1.constants.length) {
              sourceModify1[j + 1] += config2.constants.length;
            }
          }
          if (sourceModify1[j] === 4) {
            sourceModify1[j + 1]++;
          }
          j++;
        }
        config1.sources[i] = sourceModify1;
      }
      for (let i = 0; i < config2.sources.length; i++) {
        sourceModify2 = arrayify(config2.sources[i], {
          allowMissingPrefix: true,
        });
        for (let j = 0; j < sourceModify2.length; j++) {
          if (sourceModify2[j] === 0) {
            if (sourceModify2[j + 1] < config2.constants.length) {
              sourceModify2[j + 1] += config1.constants.length;
            } else {
              sourceModify2[j + 1] += argCount + config1.constants.length;
            }
          }
          if (sourceModify2[j] === 4) {
            sourceModify2[j + 1] += config1.sources.length;
          }
          j++;
        }
        config2.sources[i] = sourceModify2;
      }

      sources = [
        config1.sources[0],
        config2.sources[0],
        ...config1.sources.splice(1),
        ...config2.sources.splice(1),
      ];
    } else {
      const Index = options?.index ? options.index : 0;

      for (let i = 0; i < config1.sources.length; i++) {
        sourceModify1 = arrayify(config1.sources[i], {
          allowMissingPrefix: true,
        });
        for (let j = 0; j < sourceModify1.length; j++) {
          if (sourceModify1[j] === 0) {
            if (sourceModify1[j + 1] >= config1.constants.length) {
              sourceModify1[j + 1] += config2.constants.length;
            }
          }
          j++;
        }
        config1.sources[i] = sourceModify1;
      }
      for (let i = 0; i < config2.sources.length; i++) {
        sourceModify2 = arrayify(config2.sources[i], {
          allowMissingPrefix: true,
        });
        for (let j = 0; j < sourceModify2.length; j++) {
          if (sourceModify2[j] === 0) {
            if (sourceModify2[j + 1] < config2.constants.length) {
              sourceModify2[j + 1] += config1.constants.length;
            } else {
              sourceModify2[j + 1] += config1.constants.length + argCount;
            }
          }
          if (sourceModify2[j] === 4) {
            const srcIndexIncrement = config1.sources.length - NumberOfSources;
            const srcIndex = sourceModify2[j + 1] & 7;
            sourceModify2[j + 1] =
              srcIndex < NumberOfSources
                ? sourceModify2[j + 1] + Index
                : sourceModify2[j + 1] + srcIndexIncrement;
          }
          j++;
        }
        config2.sources[i] = sourceModify2;
      }

      if (options?.position && options.position.length === NumberOfSources) {
        for (let i = 0; i < NumberOfSources; i++) {
          const sourceModify = arrayify(config1.sources[Index + i], {
            allowMissingPrefix: true,
          });
          config1.sources[Index + i] = concat([
            sourceModify.subarray(0, options.position[i] * 2),
            config2.sources[i],
            sourceModify.subarray(options.position[i] * 2),
          ]);
        }
      } else {
        for (let i = 0; i < NumberOfSources; i++) {
          config1.sources[Index + i] = concat([
            config1.sources[Index + i],
            config2.sources[i],
          ]);
        }
      }

      config2.sources.splice(0, NumberOfSources);
      sources = [...config1.sources, ...config2.sources];
    }

    let offset = 0;
    for (let i = 0; i < sources.length; i++) {
      let srcModify = arrayify(sources[i], { allowMissingPrefix: true });
      for (let j = 0; j < srcModify.length; j++) {
        let offsetReset;
        let argModify;
        let opernadArr = [];

        if (srcModify[j] === 4) {
          argModify = arrayify(sources[srcModify[j + 1] & 7], {
            allowMissingPrefix: true,
          });

          for (let k = 0; k < argModify.length; k++) {
            if (argModify[k] === 0 && argModify[k + 1] >= constants.length) {
              opernadArr.push(argModify[k + 1]);
            }
            k++;
          }
          offsetReset = opernadArr.reduce((e, m) => (e < m ? e : m));
          for (let k = 0; k < argModify.length; k++) {
            if (argModify[k] === 0 && argModify[k + 1] >= constants.length) {
              argModify[k + 1] -= offsetReset;
              argModify[k + 1] += constants.length + offset;
            }
            k++;
          }
          sources[srcModify[j + 1] & 7] = argModify;
          offset += (srcModify[j + 1] >> 5) + 1;
        }
        j++;
      }
    }

    return {
      constants,
      sources,
    };
  }

  /**
   * method to create paired(amount-price) StateConfig, which is used for sale, orderbook, etc
   *
   * @param amountConfig - amount's StateConfig, the config sitting at top and returning the first value
   * @param priceConfig - price's StateConfig, the config sitting at bottom and returning the second value
   *
   * @returns a @see StatecConfig
   */
  public static pair(
    amountConfig: StateConfig,
    priceConfig: StateConfig
  ): StateConfig {
    let _stackOpcodeModify = arrayify(priceConfig.sources[0], {
      allowMissingPrefix: true,
    });

    for (let i = 0; i < _stackOpcodeModify.length; i++) {
      if (_stackOpcodeModify[i] === 1) {
        _stackOpcodeModify[i + 1]++;
      }
      i++;
    }
    priceConfig.sources[0] = _stackOpcodeModify;

    return VM.combiner(amountConfig, priceConfig);
  }

  /**
   * Make an address the owner of a VM Script - checks the sender address against the owner address and if it passes the final
   * result will be determined by the main VM script and if it fails it will be 0 by default.
   *
   * @remarks - please be aware if your script has DUP opcode, as DUP is relative to script and cannot be handled by this method
   * and needs to be dealt with manualy before calling this method.
   *
   * @param config - the main VM script
   * @param ownerAddress - the address that is going to be the owner of the main VM script.
   * @param options - used for additional configuraions:
   *    - (param) index - to identify which sources item in config.sources the combination starts at, if not specified, it will be 0.
   *    - (param) position - An array representing the positions of config script where notOwnerVar sources (if exists)
   *       will be merged at; position, array length must be equal to 'numberOfSources' or else it will be ignored.
   *    - (param) notOwnerVar - the value or the script that will be executed if the owner check fails, if not specified 0 will be applied.
   *
   * @returns a VM script. @see StateConfig
   */
  public static toOwnerMaker(
    config: StateConfig,
    ownerAddress: string,
    options?: {
      index?: number;
      position?: number[];
      notOwnerVar?: StateConfig | number;
    }
  ): StateConfig {
    let _result: StateConfig;
    const Index = options?.index ? options.index : 0;

    const MAKE_OWNER = (i: any) =>
      concat([
        op(VM.Opcodes.CONSTANT, i),
        op(VM.Opcodes.SENDER),
        op(VM.Opcodes.EQUAL_TO),
      ]);

    if (options?.notOwnerVar && typeof options.notOwnerVar === 'object') {
      _result = this.combiner(config, options.notOwnerVar, {
        index: Index,
        position: options?.position,
      });
    } else {
      const NotOwnerVar =
        options?.notOwnerVar && typeof options?.notOwnerVar == 'number'
          ? options.notOwnerVar
          : 0;

      _result = this.combiner(
        config,
        {
          constants: [NotOwnerVar],
          sources: [concat([op(VM.Opcodes.CONSTANT, 0)])],
        },
        {
          index: Index,
          position: options?.position,
        }
      );
    }

    _result = this.combiner(
      {
        constants: [ownerAddress],
        sources: [MAKE_OWNER(0)],
      },
      _result,
      { index: Index }
    );
    _result.sources[Index] = concat([
      _result.sources[Index],
      op(VM.Opcodes.EAGER_IF),
    ]);

    return _result;
  }

  /**
   * Deducts percentage off of the result of a VM script based on the holding tier of a tier contract.
   *
   * @param config - the main VM script
   * @param tierAddress - the contract address of the tier contract.
   * @param tierDiscount - an array of 8 items - the discount value (range 0 - 99) of each tier are the 8 items of the array.
   * @param options - used for additional configuraions:
   *    - (param) index to identify which sources item in config.sources the tierMultiplier applies to, if not specified, it will be 0.
   *    - (param) tierActivation An array of numbers, representing the amount of blocks each tier must hold in order to get the discount,
   *       e.g. the first item in array is 100 mean tier 1 needs to be held at least 100 blocks to get the discount.
   *
   * @returns a VM script @see StateConfig
   */
  public static toTierDiscounter(
    config: StateConfig,
    tierAddress: string,
    tierDiscount: number[],
    options?: {
      index?: number;
      tierActivation?: (string | number)[];
    }
  ): StateConfig {
    const Index = options?.index ? options.index : 0;

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

    const TIER_BASED_DIS = () =>
      concat([
        op(VM.Opcodes.CONSTANT, 0),
        op(VM.Opcodes.CONSTANT, 3),
        // TODO: @rouzwelt
        // @ts-ignore
        op(VM.Opcodes.UPDATE_BLOCKS_FOR_TIER_RANGE, tierRange(0, 8)),
        op(VM.Opcodes.CONSTANT, 2),
        op(VM.Opcodes.CONSTANT, 1),
        op(VM.Opcodes.SENDER),
        // TODO: @rouzwelt
        // @ts-ignore
        op(VM.Opcodes.REPORT),
        op(VM.Opcodes.BLOCK_NUMBER),
        op(
          VM.Opcodes.SELECT_LTE,
          selectLte(selectLteLogic.every, selectLteMode.first, 2)
        ),
        op(VM.Opcodes.SATURATING_DIFF),
      ]);
    const TIER_BASED_DIS_ZIPMAP = (valSize: number) =>
      concat([
        op(VM.Opcodes.ZIPMAP, callSize(1, 3, valSize)),
        op(VM.Opcodes.MIN, 8),
        op(VM.Opcodes.MUL, 2),
        op(VM.Opcodes.CONSTANT, 3),
        op(VM.Opcodes.DIV, 2),
      ]);
    const ACTIVATION_TIME = () =>
      concat([
        op(VM.Opcodes.CONSTANT, 0),
        op(VM.Opcodes.BLOCK_NUMBER),
        // TODO: @rouzwelt
        // @ts-ignore
        op(VM.Opcodes.UPDATE_BLOCKS_FOR_TIER_RANGE, tierRange(0, 8)),
        op(VM.Opcodes.CONSTANT, 1),
        op(VM.Opcodes.SENDER),
        // TODO: @rouzwelt
        // @ts-ignore
        op(VM.Opcodes.REPORT),
        op(VM.Opcodes.SATURATING_DIFF),
        op(VM.Opcodes.CONSTANT, 4),
      ]);
    const TIER_BASED_DIS_FN = (i: number) =>
      concat([
        op(VM.Opcodes.CONSTANT, 3),
        op(VM.Opcodes.CONSTANT, i),
        op(VM.Opcodes.SUB, 2),
      ]);
    const ACTIVATION_TIME_FN = () =>
      concat([
        op(VM.Opcodes.CONSTANT, 6),
        op(VM.Opcodes.CONSTANT, 7),
        op(VM.Opcodes.LESS_THAN),
        op(VM.Opcodes.CONSTANT, 3),
      ]);

    const _discounterConfig: StateConfig = options?.tierActivation
      ? {
          constants: [
            ethers.constants.MaxUint256,
            tierAddress,
            TierDiscount,
            '100',
            paddedUInt256(
              BigNumber.from(
                '0x' +
                  paddedUInt32(options.tierActivation[7]) +
                  paddedUInt32(options.tierActivation[6]) +
                  paddedUInt32(options.tierActivation[5]) +
                  paddedUInt32(options.tierActivation[4]) +
                  paddedUInt32(options.tierActivation[3]) +
                  paddedUInt32(options.tierActivation[2]) +
                  paddedUInt32(options.tierActivation[1]) +
                  paddedUInt32(options.tierActivation[0])
              )
            ),
          ],
          sources: [
            concat([
              TIER_BASED_DIS(),
              ACTIVATION_TIME(),
              TIER_BASED_DIS_ZIPMAP(2),
            ]),
            concat([
              ACTIVATION_TIME_FN(),
              TIER_BASED_DIS_FN(5),
              op(VM.Opcodes.EAGER_IF),
            ]),
          ],
        }
      : {
          constants: [
            ethers.constants.MaxUint256,
            tierAddress,
            TierDiscount,
            '100',
          ],
          sources: [
            concat([TIER_BASED_DIS(), TIER_BASED_DIS_ZIPMAP(0)]),
            TIER_BASED_DIS_FN(4),
          ],
        };

    return VM.combiner(config, _discounterConfig, { index: Index });
  }

  /**
   * Multiply the result of a VM script based on the holding tier of a tier contract.
   *
   * @param config - the main VM script
   * @param tierAddress - the contract address of the tier contract.
   * @param tierMultiplier - an array of 8 items - the multiplier value (2 decimals max) of each tier are the 8 items of the array.
   * @param options - used for additional configuraions:
   *    - (param) index to identify which sources item in config.sources the tierMultiplier applies to, if not specified, it will be 0.
   *    - (param) tierActivation An array of numbers, representing the amount of blocks each tier must hold in order to get the multiplier,
   *       e.g. the first item in array is 100 mean tier 1 needs to be held at least 100 blocks to get the multiplier.
   *
   * @returns a VM script @see StateConfig
   */
  public static toTierMultiplier(
    config: StateConfig,
    tierAddress: string,
    tierMultiplier: number[],
    options?: {
      index?: number;
      tierActivation?: (string | number)[];
    }
  ): StateConfig {
    const Index = options?.index ? options.index : 0;

    const TierMultiplier = paddedUInt256(
      BigNumber.from(
        '0x' +
          paddedUInt32(Math.floor(tierMultiplier[7] * 100)) +
          paddedUInt32(Math.floor(tierMultiplier[6] * 100)) +
          paddedUInt32(Math.floor(tierMultiplier[5] * 100)) +
          paddedUInt32(Math.floor(tierMultiplier[4] * 100)) +
          paddedUInt32(Math.floor(tierMultiplier[3] * 100)) +
          paddedUInt32(Math.floor(tierMultiplier[2] * 100)) +
          paddedUInt32(Math.floor(tierMultiplier[1] * 100)) +
          paddedUInt32(Math.floor(tierMultiplier[0] * 100))
      )
    );

    const TIER_BASED_MUL = () =>
      concat([
        op(VM.Opcodes.CONSTANT, 2),
        op(VM.Opcodes.CONSTANT, 1),
        op(VM.Opcodes.SENDER),
        // TODO: @rouzwelt
        // @ts-ignore
        op(VM.Opcodes.REPORT),
        op(VM.Opcodes.BLOCK_NUMBER),
        op(
          VM.Opcodes.SELECT_LTE,
          selectLte(selectLteLogic.every, selectLteMode.first, 2)
        ),
      ]);
    const TIER_BASED_MUL_ZIPMAP = (valSize: number) =>
      concat([
        op(VM.Opcodes.ZIPMAP, callSize(1, 3, valSize)),
        op(VM.Opcodes.MAX, 8),
        op(VM.Opcodes.MUL, 2),
        op(VM.Opcodes.CONSTANT, 3),
        op(VM.Opcodes.DIV, 2),
      ]);
    const ACTIVATION_TIME = () =>
      concat([
        op(VM.Opcodes.CONSTANT, 0),
        op(VM.Opcodes.BLOCK_NUMBER),
        // TODO: @rouzwelt
        // @ts-ignore
        op(VM.Opcodes.UPDATE_BLOCKS_FOR_TIER_RANGE, tierRange(0, 8)),
        op(VM.Opcodes.CONSTANT, 1),
        op(VM.Opcodes.SENDER),
        // TODO: @rouzwelt
        // @ts-ignore
        op(VM.Opcodes.REPORT),
        op(VM.Opcodes.SATURATING_DIFF),
        op(VM.Opcodes.CONSTANT, 5),
      ]);
    const TIER_BASED_MUL_FN = (i: number) =>
      concat([
        op(VM.Opcodes.CONSTANT, i),
        op(VM.Opcodes.CONSTANT, 4),
        op(VM.Opcodes.LESS_THAN),
        op(VM.Opcodes.CONSTANT, i),
        op(VM.Opcodes.CONSTANT, 3),
        op(VM.Opcodes.EAGER_IF),
      ]);
    const ACTIVATION_TIME_FN = () =>
      concat([
        op(VM.Opcodes.CONSTANT, 7),
        op(VM.Opcodes.CONSTANT, 8),
        op(VM.Opcodes.LESS_THAN),
        op(VM.Opcodes.CONSTANT, 3),
      ]);

    const _multiplierConfig: StateConfig = options?.tierActivation
      ? {
          constants: [
            ethers.constants.MaxUint256,
            tierAddress,
            TierMultiplier,
            '100',
            '0xffffffff',
            paddedUInt256(
              BigNumber.from(
                '0x' +
                  paddedUInt32(options.tierActivation[7]) +
                  paddedUInt32(options.tierActivation[6]) +
                  paddedUInt32(options.tierActivation[5]) +
                  paddedUInt32(options.tierActivation[4]) +
                  paddedUInt32(options.tierActivation[3]) +
                  paddedUInt32(options.tierActivation[2]) +
                  paddedUInt32(options.tierActivation[1]) +
                  paddedUInt32(options.tierActivation[0])
              )
            ),
          ],
          sources: [
            concat([
              TIER_BASED_MUL(),
              ACTIVATION_TIME(),
              TIER_BASED_MUL_ZIPMAP(2),
            ]),
            concat([
              ACTIVATION_TIME_FN(),
              TIER_BASED_MUL_FN(6),
              op(VM.Opcodes.EAGER_IF),
            ]),
          ],
        }
      : {
          constants: [
            ethers.constants.MaxUint256,
            tierAddress,
            TierMultiplier,
            '100',
            '0xffffffff',
          ],
          sources: [
            concat([TIER_BASED_MUL(), TIER_BASED_MUL_ZIPMAP(0)]),
            TIER_BASED_MUL_FN(5),
          ],
        };

    return VM.combiner(config, _multiplierConfig, { index: Index });
  }

  /**
   * A method to merge multiple (more than 1) scripts to be executed based on time slices.
   *
   * @param configs - An array of StateConfigs that will be merged and executed at runtime in order by time slices
   * @param times - An array of numbers representing either BLOCK_NUMBER or TIMESTAMP that time slices will be between each of the 2 items in the array
   * its length should be number of configs - 1.
   * @param inBlockNumber - (optional) false by default which means the time slices will be based on TIMESTAMP, pass true to base it on BLOCK_NUMBER
   *
   * @returns a VM script @see StateConfig
   */
  public static toTimeSlicer(
    configs: StateConfig[],
    times: number[],
    inBlockNumber: boolean = false
  ): StateConfig {
    if (configs.length === times.length + 1) {
      let _result: StateConfig;

      const SLICER = (i: number): StateConfig => {
        return {
          constants: [times[i]],
          sources: [
            concat([
              inBlockNumber
                ? op(VM.Opcodes.BLOCK_NUMBER)
                : op(VM.Opcodes.BLOCK_TIMESTAMP),
              op(VM.Opcodes.CONSTANT, 0),
              op(VM.Opcodes.LESS_THAN)
            ]),
          ],
        };
      };

      _result = VM.combiner(SLICER(0), configs[0]);

      for (let i = 1; i < configs.length; i++) {
        if (i + 1 === configs.length) {
          _result = VM.combiner(_result, configs[i]);
        } else {
          _result = VM.combiner(_result, SLICER(i));
          _result = VM.combiner(_result, configs[i]);
        }
      }
      for (let i = 1; i < configs.length; i++) {
        _result.sources[0] = concat([
          _result.sources[0],
          op(VM.Opcodes.EAGER_IF),
        ]);
      }

      return _result;
    } else throw new Error('invalid number of times or configs arguments');
  }
}
