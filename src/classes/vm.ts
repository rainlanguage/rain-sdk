import { Tier } from './iTierV2';
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
 * Parameter that will use to converted to the source.
 *
 * Use an opcode and operand (optional)
 */
export type OPerand = [number, (number | BytesLike | utils.Hexable)?];

/**
 * @public
 * The main class cointaining the methods for constructing and making VM scripts.
 * 
 * @remarks
 * Please note that all methods (except combiner, pair and multi) in this class assume
 * that 'config'(s) parameter passed to them are in fact resolved to one value. Meaning
 * that each config passed to the methods will not result in more than one value in the
 * VM stack. This is essential point to pay attention to when using this class's methods
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
    let sourceModify1: Uint8Array[] = [];
    let sourceModify2: Uint8Array[] = [];

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
        sourceModify1[i] = arrayify(config1.sources[i], {
          allowMissingPrefix: true,
        });
        for (let j = 0; j < sourceModify1[i].length; j++) {
          if (sourceModify1[i][j] === 0) {
            if (sourceModify1[i][j + 1] >= config1.constants.length) {
              sourceModify1[i][j + 1] += config2.constants.length;
            }
          }
          if (sourceModify1[i][j] === 4) {
            sourceModify1[i][j + 1]++;
          }
          j++;
        }
      }
      for (let i = 0; i < config2.sources.length; i++) {
        sourceModify2[i] = arrayify(config2.sources[i], {
          allowMissingPrefix: true,
        });
        for (let j = 0; j < sourceModify2[i].length; j++) {
          if (sourceModify2[i][j] === 0) {
            if (sourceModify2[i][j + 1] < config2.constants.length) {
              sourceModify2[i][j + 1] += config1.constants.length;
            } else {
              sourceModify2[i][j + 1] += argCount + config1.constants.length;
            }
          }
          if (sourceModify2[i][j] === 4) {
            sourceModify2[i][j + 1] += config1.sources.length;
          }
          j++;
        }
      }

      sources = [
        sourceModify1[0],
        sourceModify2[0],
        ...sourceModify1.splice(1),
        ...sourceModify2.splice(1),
      ];
    } else {
      const Index = options?.index ? options.index : 0;

      for (let i = 0; i < config1.sources.length; i++) {
        sourceModify1[i] = arrayify(config1.sources[i], {
          allowMissingPrefix: true,
        });
        for (let j = 0; j < sourceModify1[i].length; j++) {
          if (sourceModify1[i][j] === 0) {
            if (sourceModify1[i][j + 1] >= config1.constants.length) {
              sourceModify1[i][j + 1] += config2.constants.length;
            }
          }
          j++;
        }
      }
      for (let i = 0; i < config2.sources.length; i++) {
        sourceModify2[i] = arrayify(config2.sources[i], {
          allowMissingPrefix: true,
        });
        for (let j = 0; j < sourceModify2[i].length; j++) {
          if (sourceModify2[i][j] === 0) {
            if (sourceModify2[i][j + 1] < config2.constants.length) {
              sourceModify2[i][j + 1] += config1.constants.length;
            } else {
              sourceModify2[i][j + 1] += config1.constants.length + argCount;
            }
          }
          if (sourceModify2[i][j] === 4) {
            const srcIndexIncrement = config1.sources.length - NumberOfSources;
            const srcIndex = sourceModify2[i][j + 1] & 7;
            sourceModify2[i][j + 1] =
              srcIndex < NumberOfSources
                ? sourceModify2[i][j + 1] + Index
                : sourceModify2[i][j + 1] + srcIndexIncrement;
          }
          j++;
        }
      }
      if (options?.position && options.position.length === NumberOfSources) {
        for (let i = 0; i < NumberOfSources; i++) {
          sourceModify1[Index + i] = concat([
            sourceModify1[Index + i].subarray(0, options.position[i] * 2),
            sourceModify2[i],
            sourceModify1[Index + i].subarray(options.position[i] * 2),
          ]);
        }
      } else {
        for (let i = 0; i < NumberOfSources; i++) {
          sourceModify1[Index + i] = concat([
            sourceModify1[Index + i],
            sourceModify2[i],
          ]);
        }
      }

      sourceModify2.splice(0, NumberOfSources);
      sources = [...sourceModify1, ...sourceModify2];
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
   * @param stackReassignment - (optional) pass false if STACK opcode operands dont need to be reassigned to 
   * their new relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to
   * any value outside of their own script scope (other scripts that are being combined) this way the STACK opcode 
   * operand will stay untouched when scripts combine
   *
   * @returns a @see StatecConfig
   */
  public static pair(
    amountConfig: StateConfig,
    priceConfig: StateConfig,
    stackReassignment: boolean = true
  ): StateConfig {
    if (stackReassignment) {
      for (let i = 0; i < priceConfig.sources.length; i++) {
        let _stackOpcodeModify = arrayify(
          priceConfig.sources[i],
          {allowMissingPrefix: true}
        );
        for (let j = 0; j < _stackOpcodeModify.length; j++) {
          if (_stackOpcodeModify[j] === 1) {
            _stackOpcodeModify[j + 1]++;
          }
          j++;
        }
        priceConfig.sources[i] = _stackOpcodeModify;
      }
    }

    return VM.combiner(amountConfig, priceConfig);
  }

  /**
   * A method to combine multiple StateConfigs together each on top of the other at the first item in final sources.
   * 
   * @param configs - An array of StateConfigs to combine together and its lengths should be more than 2
   * (can use VM.pair() method for combining 2 configs - @see pair
   * @param stackReassignment - (optional) pass false if STACK opcode operands dont need to be reassigned to their new 
   * relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own 
   * script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine
   * 
   * @returns a @see StateConfig
   */
  public static multi(configs: StateConfig[], stackReassignment: boolean = true): StateConfig {

    if (configs.length > 1) {
      let _result: StateConfig = configs[0];

      for (let i = 1; i < configs.length; i++) {
        if (stackReassignment) {
          for (let j = 0; j < configs[i].sources.length; j++) {
            let _stackOpcodeModify = arrayify(
              configs[i].sources[j],
              {allowMissingPrefix: true}
            );
            for (let k = 0; k < _stackOpcodeModify.length; k++) {
              if (_stackOpcodeModify[k] === 1) {
                _stackOpcodeModify[k + 1] = _stackOpcodeModify[k + 1] + i;
              }
              k++;
            }
            configs[i].sources[j] = _stackOpcodeModify;
          }
        }
        _result = VM.combiner(_result, configs[i])
      }
      return _result;
    }
    else throw new Error("not a valid argument")
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
  public static setOwnership(
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

    const MAKE_OWNER = {
      constants: [ownerAddress],
      sources: [
        concat([
          op(VM.Opcodes.CONSTANT, 0),
          op(VM.Opcodes.SENDER),
          op(VM.Opcodes.EQUAL_TO),
        ])
      ]
    }

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
      MAKE_OWNER,
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
   * Deducts percentage off of the result of a VM script based on a tier contract.
   *
   * @param config - the main VM script
   * @param tierAddress - the contract address of the tier contract.
   * @param tierDiscount - an array of 8 items - the discount value (range 0 - 99) of each tier are the 8 items of the array.
   * @param options - used for additional configuraions:
   *    - (param) index to identify which sources item in config.sources the tierMultiplier applies to, if not specified, it will be 0.
   *    - (param) tierActivation An array of numbers, representing the amount of timestamps each tier must hold in order to get the discount,
   *       e.g. the first item in array is 100 mean tier 1 needs to be held at least 100 timestamps to get the discount.(used for stake tier contract)
   *    - (param) tierContext an array of values mostly used for stake tier contracts.
   *    - (param) delegatedReport - (optional) Used to determine if this script is being used for combinetier contract 
   *       or standalone then it will produce the result for SENDER(false) or ACCOUNT(true) i.e CONTEXT[0]
   *
   * @returns a VM script @see StateConfig
   */
  public static setDiscountForTiers(
    config: StateConfig,
    tierAddress: string,
    tierDiscount: number[],
    options?: {
      index?: number,
      tierActivation?: (string | number)[],
      tierContext?: BigNumber[],
      delegatedReport?: boolean,
    }
  ): StateConfig {
    const Index = options?.index ? options.index : 0;
    const delegated = options?.delegatedReport !== undefined ? options.delegatedReport : false;

    const TierDiscount = paddedUInt256(
      BigNumber.from(
        '0x' +
          paddedUInt32(Math.floor(100 - tierDiscount[7])) +
          paddedUInt32(Math.floor(100 - tierDiscount[6])) +
          paddedUInt32(Math.floor(100 - tierDiscount[5])) +
          paddedUInt32(Math.floor(100 - tierDiscount[4])) +
          paddedUInt32(Math.floor(100 - tierDiscount[3])) +
          paddedUInt32(Math.floor(100 - tierDiscount[2])) +
          paddedUInt32(Math.floor(100 - tierDiscount[1])) +
          paddedUInt32(Math.floor(100 - tierDiscount[0]))
      )
    );

  
    const CONTEXT_ = options?.tierContext && options.tierContext.length === 8 
    ? {
        constants: options.tierContext,
        sources: concat([
          op(VM.Opcodes.CONSTANT, 5),
          op(VM.Opcodes.CONSTANT, 6),
          op(VM.Opcodes.CONSTANT, 7),
          op(VM.Opcodes.CONSTANT, 8),
          op(VM.Opcodes.CONSTANT, 9),
          op(VM.Opcodes.CONSTANT, 10),
          op(VM.Opcodes.CONSTANT, 11),
          op(VM.Opcodes.CONSTANT, 12),
        ])
      }
    : {
        constants: [],
        sources: concat([])
    } 


    const TIER_BASED_DIS = () =>
      concat([
        op(VM.Opcodes.CONSTANT, 0),
        op(VM.Opcodes.CONSTANT, 3),
        op(VM.Opcodes.UPDATE_TIMES_FOR_TIER_RANGE, tierRange(0, 8)),
        op(VM.Opcodes.CONSTANT, 2),
        op(VM.Opcodes.CONSTANT, 1),
        delegated ? op(VM.Opcodes.CONTEXT, 0) : op(VM.Opcodes.SENDER),
        CONTEXT_.sources,
        op(VM.Opcodes.ITIERV2_REPORT, CONTEXT_.constants.length),
        op(VM.Opcodes.BLOCK_TIMESTAMP),
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
        op(VM.Opcodes.BLOCK_TIMESTAMP),
        op(VM.Opcodes.UPDATE_TIMES_FOR_TIER_RANGE, tierRange(0, 8)),
        op(VM.Opcodes.CONSTANT, 1),
        delegated ? op(VM.Opcodes.CONTEXT, 0) : op(VM.Opcodes.SENDER),
        CONTEXT_.sources,
        op(VM.Opcodes.ITIERV2_REPORT, CONTEXT_.constants.length),
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
        op(VM.Opcodes.CONSTANT, 14),
        op(VM.Opcodes.CONSTANT, 15),
        op(VM.Opcodes.LESS_THAN),
        op(VM.Opcodes.CONSTANT, 3),
      ]);



    const _discounterConfig: StateConfig = 
      options?.tierActivation && options.tierActivation.length === 8
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
            ...CONTEXT_.constants
          ],
          sources: [
            concat([
              TIER_BASED_DIS(),
              ACTIVATION_TIME(),
              TIER_BASED_DIS_ZIPMAP(2),
            ]),
            concat([
              ACTIVATION_TIME_FN(),
              TIER_BASED_DIS_FN(5 + CONTEXT_.constants.length),
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
            ...CONTEXT_.constants
          ],
          sources: [
            concat([TIER_BASED_DIS(), TIER_BASED_DIS_ZIPMAP(0)]),
            TIER_BASED_DIS_FN(4 + CONTEXT_.constants.length),
          ],
        };

    return VM.combiner(config, _discounterConfig, { index: Index });
  }

  /**
   * Multiply the result of a VM script based on a tier contract.
   *
   * @param config - the main VM script
   * @param tierAddress - the contract address of the tier contract.
   * @param tierMultiplier - an array of 8 items - the multiplier value (2 decimals max) of each tier are the 8 items of the array.
   * @param options - used for additional configuraions:
   *    - (param) index to identify which sources item in config.sources the tierMultiplier applies to, if not specified, it will be 0.
   *    - (param) tierActivation An array of numbers, representing the amount of timestamps each tier must hold in order to get the multiplier,
   *       e.g. the first item in array is 100 mean tier 1 needs to be held at least 100 timestamps to get the multiplier.(used for stake tier contract)
   *    - (param) tierContext an array of values mostly used for stake tier contracts.
   *    - (param) delegatedReport - (optional) Used to determine if this script is being used for combinetier contract 
   *       or standalone then it will produce the result for SENDER(false) or ACCOUNT(true) i.e CONTEXT[0]
   *
   * @returns a VM script @see StateConfig
   */
  public static setMultiplierForTiers(
    config: StateConfig,
    tierAddress: string,
    tierMultiplier: number[],
    options?: {
      index?: number,
      tierActivation?: (string | number)[],
      tierContext?: BigNumber[],
      delegatedReport?: boolean,
    }
  ): StateConfig {
    const Index = options?.index ? options.index : 0;
    const delegated = options?.delegatedReport !== undefined ? options.delegatedReport : false;

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


    const CONTEXT_ = options?.tierContext && options.tierContext.length === 8 
    ? {
        constants: options.tierContext,
        sources: concat([
          op(VM.Opcodes.CONSTANT, 6),
          op(VM.Opcodes.CONSTANT, 7),
          op(VM.Opcodes.CONSTANT, 8),
          op(VM.Opcodes.CONSTANT, 9),
          op(VM.Opcodes.CONSTANT, 10),
          op(VM.Opcodes.CONSTANT, 11),
          op(VM.Opcodes.CONSTANT, 12),
          op(VM.Opcodes.CONSTANT, 13),
        ])
      }
    : {
        constants: [],
        sources: concat([])
    }

    const TIER_BASED_MUL = () =>
      concat([
        op(VM.Opcodes.CONSTANT, 2),
        op(VM.Opcodes.CONSTANT, 1),
        delegated ? op(VM.Opcodes.CONTEXT, 0) : op(VM.Opcodes.SENDER),
        CONTEXT_.sources,
        op(VM.Opcodes.ITIERV2_REPORT, CONTEXT_.constants.length),
        op(VM.Opcodes.BLOCK_TIMESTAMP),
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
        op(VM.Opcodes.BLOCK_TIMESTAMP),
        op(VM.Opcodes.UPDATE_TIMES_FOR_TIER_RANGE, tierRange(0, 8)),
        op(VM.Opcodes.CONSTANT, 1),
        delegated ? op(VM.Opcodes.CONTEXT, 0) : op(VM.Opcodes.SENDER),
        CONTEXT_.sources,
        op(VM.Opcodes.ITIERV2_REPORT, CONTEXT_.constants.length),
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
        op(VM.Opcodes.CONSTANT, 15),
        op(VM.Opcodes.CONSTANT, 16),
        op(VM.Opcodes.LESS_THAN),
        op(VM.Opcodes.CONSTANT, 3),
      ]);

    const _multiplierConfig: StateConfig = 
      options?.tierActivation && options.tierActivation.length === 8
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
            ...CONTEXT_.constants,
          ],
          sources: [
            concat([
              TIER_BASED_MUL(),
              ACTIVATION_TIME(),
              TIER_BASED_MUL_ZIPMAP(2),
            ]),
            concat([
              ACTIVATION_TIME_FN(),
              TIER_BASED_MUL_FN(6 + CONTEXT_.constants.length),
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
            ...CONTEXT_.constants
          ],
          sources: [
            concat([TIER_BASED_MUL(), TIER_BASED_MUL_ZIPMAP(0)]),
            TIER_BASED_MUL_FN(5 + CONTEXT_.constants.length),
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
  public static setTimers(
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

  /**
   * Method to create a simple time based rule
   * 
   * @param timestamp - the timestamp to set the rule for
   * @param type - type of the check, meaning current timestamp to be gt, gte, lt, lte than the "timestamp"
   * 
   * @returns A @see StateConfig
   */
  public static beforeAfterTime(
    timestamp: number,
    type: "gt" | "lt" | "gte" | "lte"
  ): StateConfig {
      let src = new Uint8Array();

      if (type === "gte") {
        timestamp = timestamp === 0 ? 0 : timestamp - 1;
        src = op(VM.Opcodes.GREATER_THAN)
      }
      if (type === "lte") {
        timestamp++;
        src = op(VM.Opcodes.LESS_THAN)
      }
      if (type === "lt") {
        src = op(VM.Opcodes.LESS_THAN)
      }
      if (type === "gt") {
        src = op(VM.Opcodes.GREATER_THAN)
      }

      return {
      constants: [timestamp],
      sources: [
        concat([
          op(VM.Opcodes.BLOCK_TIMESTAMP),
          op(VM.Opcodes.CONSTANT, 0),
          src
        ])
      ]
    };
  }


  /**
   * Method to create a simple block number based rule
   * 
   * @param blockNumber - the block number to set the rule for
   * @param type - type of the check, meaning current block number to be gt, gte, lt, lte than the "blockNumber"
   * 
   * @returns A @see StateConfig
   */
  public static beforeAfterBlock(
    blockNumber: number,
    type: "gt" | "lt" | "gte" | "lte"  
    ): StateConfig {
      let src = new Uint8Array();

      if (type === "gte") {
        blockNumber = blockNumber === 0 ? 0 : blockNumber - 1;
        src = op(VM.Opcodes.GREATER_THAN)
      }
      if (type === "lte") {
        blockNumber++;
        src = op(VM.Opcodes.LESS_THAN)
      }
      if (type === "lt") {
        src = op(VM.Opcodes.LESS_THAN)
      }
      if (type === "gt") {
        src = op(VM.Opcodes.GREATER_THAN)
      }

      return {
      constants: [blockNumber],
      sources: [
        concat([
          op(VM.Opcodes.BLOCK_TIMESTAMP),
          op(VM.Opcodes.CONSTANT, 0),
          src
        ])
      ]
    };
  }

  /**
   * Method to multiply multiple scripts together
   * 
   * @param configs - an array of configs to multiply
   * @param stackReassignment - (optional) pass false if STACK opcode operands dont need to be reassigned to their new 
   * relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own 
   * script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine
   * 
   * @returns a @see StateConfig 
   */
  public static mulTogether(configs: StateConfig[], stackReassignment: boolean = true): StateConfig { 
    let result_ = VM.multi(configs, stackReassignment)
    result_.sources[0] = concat([
      result_.sources[0],
      op(VM.Opcodes.MUL, configs.length)
    ])

    return result_;
  }

  /**
   * Method to add multiple scripts together
   * 
   * @param configs - an array of configs to add 
   * @param stackReassignment - (optional) pass false if STACK opcode operands dont need to be reassigned to their new 
   * relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own 
   * script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine
   * @returns a @see StateConfig 
   */
  public static addTogether(configs: StateConfig[], stackReassignment: boolean = true): StateConfig {
    let result_ = VM.multi(configs, stackReassignment)
    result_.sources[0] = concat([
      result_.sources[0],
      op(VM.Opcodes.ADD, configs.length)
    ])

    return result_;
  }

  /**
   * Method to get maximum of multiple scripts
   * 
   * @param configs - an array of configs to get maximum of 
   * @param stackReassignment - (optional) pass false if STACK opcode operands dont need to be reassigned to their new 
   * relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own 
   * script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine
   * @returns a @see StateConfig 
   */
  public static max(configs: StateConfig[], stackReassignment: boolean = true): StateConfig {
    let result_ = VM.multi(configs, stackReassignment)
    result_.sources[0] = concat([
      result_.sources[0],
      op(VM.Opcodes.MAX, configs.length)
    ])

    return result_;
  }

  /**
   * Method to get minimum of multiple scripts
   * 
   * @param configs - an array of configs to get minimum of  
   * @param stackReassignment - (optional) pass false if STACK opcode operands dont need to be reassigned to their new 
   * relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own 
   * script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine
   * @returns a @see StateConfig 
   */
  public static min(configs: StateConfig[], stackReassignment: boolean = true): StateConfig {
    let result_ = VM.multi(configs, stackReassignment)
    result_.sources[0] = concat([
      result_.sources[0],
      op(VM.Opcodes.MIN, configs.length)
    ])

    return result_;
  }

  /**
   * Method to create an if/else script
   * 
   * @param condition - the condition script ie the if check statement
   * @param ifStatement - the script(statement) if the check passes
   * @param elseStatement - the script(statement) if the check fails
   * @param stackReassignment - (optional) pass false if STACK opcode operands dont need to be reassigned to their new 
   * relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own 
   * script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine
   * @returns a @see StateConfig 
   */
  public static ifelse(
    condition: StateConfig,
    ifStatement: StateConfig,
    elseStatement: StateConfig,
    stackReassignment: boolean = true
  ): StateConfig {

    let result_ = VM.multi([condition, ifStatement, elseStatement], stackReassignment)
    result_.sources[0] = concat([
      result_.sources[0],
      op(VM.Opcodes.EAGER_IF)
    ])

    return result_;
  }

  /**
   * Methdo to create a simple signle value script, ie CONTANT
   * 
   * @param value - the value
   * 
   * @returns a @see StateConfig 
   */
  public static constant(value: BigNumberish): StateConfig {
    if (!(value instanceof BigNumber)) {
      value = BigNumber.from(value);
    } 

    return {
      constants: [value],
      sources: [concat([op(VM.Opcodes.CONSTANT, 0)])]
    };
  }

  /**
   * Method to check if a script is zero or not. will return 1 if is zero and 0 if it is not
   * 
   * @param config - the script to check
   * 
   * @returns a @see StateConfig in VM boolean format (true non-zero, false zero)
   */
  public static not(config: StateConfig): StateConfig {
    config.sources[0] = concat([
      config.sources[0],
      op(VM.Opcodes.ISZERO)
    ])

    return config;
  }

  /**
   * Method to and multiple scripts together ie EVERY
   * 
   * @param configs - an array of configs to and
   * @param stackReassignment - (optional) pass false if STACK opcode operands dont need to be reassigned to their new 
   * relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own 
   * script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine
   * @returns a @see StateConfig in VM boolean format (true non-zero, false zero)
   */
  public static and(configs: StateConfig[], stackReassignment: boolean = true): StateConfig {
    let result_ = VM.multi(configs, stackReassignment)
    result_.sources[0] = concat([
      result_.sources[0],
      op(VM.Opcodes.EVERY, configs.length)
    ])

    return result_;
  }

  /**
   * Method to or multiple scripts together ie ANY
   * 
   * @param configs - an array of configs to or
   * @param stackReassignment - (optional) pass false if STACK opcode operands dont need to be reassigned to their new 
   * relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own 
   * script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine
   * @returns a @see StateConfig in VM boolean format (true non-zero, false zero)
   */
  public static or(configs: StateConfig[], stackReassignment: boolean = true): StateConfig {
    let result_ = VM.multi(configs, stackReassignment)
    result_.sources[0] = concat([
      result_.sources[0],
      op(VM.Opcodes.ANY, configs.length)
    ])

    return result_;
  }

  /**
   * Method to nand multiple scripts together
   * 
   * @param configs - an array of configs to nand
   * @param stackReassignment - (optional) pass false if STACK opcode operands dont need to be reassigned to their new 
   * relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own 
   * script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine
   * @returns a @see StateConfig in VM boolean format (true non-zero, false zero)
   */
  public static nand(configs: StateConfig[], stackReassignment: boolean = true): StateConfig {
    let result_ = VM.multi(configs, stackReassignment)
    result_.sources[0] = concat([
      result_.sources[0],
      op(VM.Opcodes.EVERY, configs.length),
      op(VM.Opcodes.ISZERO)
    ])

    return result_;
  }

  /**
   * Method to nor multiple scripts together
   * 
   * @param configs - an array of configs to nor
   * @param stackReassignment - (optional) pass false if STACK opcode operands dont need to be reassigned to their new 
   * relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own 
   * script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine
   * @returns a @see StateConfig in VM boolean format (true non-zero, false zero)
   */
  public static nor(configs: StateConfig[], stackReassignment: boolean = true): StateConfig {
    let result_ = VM.multi(configs, stackReassignment)
    result_.sources[0] = concat([
      result_.sources[0],
      op(VM.Opcodes.ANY, configs.length),
      op(VM.Opcodes.ISZERO)
    ])

    return result_;
  }

  /**
   * Method to xor multiple scripts together
   * 
   * @remarks
   * This method when used in a contract will be gas intensive specially the configs or number of them are larg already
   * 
   * @param configs - an array of configs to xor
   * @param stackReassignment - (optional) pass false if STACK opcode operands dont need to be reassigned to their new 
   * relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own 
   * script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine
   * @returns a @see StateConfig in VM boolean format (true non-zero, false zero)
   */
  public static xor(configs: StateConfig[], stackReassignment: boolean = true): StateConfig {
    const and: StateConfig = {constants: [], sources: [concat([op(VM.Opcodes.EVERY, configs.length)])]};
    const nor: StateConfig = {
      constants: [],
      sources: [
        concat([
          op(VM.Opcodes.ANY, configs.length),
          op(VM.Opcodes.ISZERO)
        ])
      ]
    };
    let result_ = VM.multi([...configs, and, ...configs, nor], stackReassignment)
    result_.sources[0] = concat([
      result_.sources[0],
      op(VM.Opcodes.ANY, 2),
      op(VM.Opcodes.ISZERO),
    ]);

    return result_;
  }

  /**
   * Method to xnor multiple scripts together
   * 
   * @remarks
   * This method when used in a contract will be gas intensive specially the configs or number of them are larg already
   * 
   * @param configs - an array of configs to xnor
   * @param stackReassignment - (optional) pass false if STACK opcode operands dont need to be reassigned to their new 
   * relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own 
   * script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine
   * @returns a @see StateConfig in VM boolean format (true non-zero, false zero)
   */
   public static xnor(configs: StateConfig[], stackReassignment: boolean = true): StateConfig {
    const and: StateConfig = {constants: [], sources: [concat([op(VM.Opcodes.EVERY, configs.length)])]};
    const nor: StateConfig = {
      constants: [],
      sources: [
        concat([
          op(VM.Opcodes.ANY, configs.length),
          op(VM.Opcodes.ISZERO)
        ])
      ]
    };
    let result_ = VM.multi([...configs, and, ...configs, nor], stackReassignment)
    result_.sources[0] = concat([
      result_.sources[0],
      op(VM.Opcodes.ANY, 2)
    ]);

    return result_;
  }

  /**
   * Method to check if a script is equal to another script or not. will return 1 if is true and 0 if it is not
   * 
   * @param config1 - first script
   * @param config2 - second script
   * @param stackReassignment - (optional) pass false if STACK opcode operands dont need to be reassigned to their new 
   * relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own 
   * script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine
   * @returns a @see StateConfig in VM boolean format (true non-zero, false zero)
   */
  public static eq(config1: StateConfig, config2: StateConfig, stackReassignment: boolean = true): StateConfig {
    let result_ = VM.pair(config1, config2, stackReassignment);
    result_.sources[0] = concat([
      result_.sources[0],
      op(VM.Opcodes.EQUAL_TO)
    ])

    return result_;
  }

  /**
   * Method to check if a script is greater than another script or not. will return 1 if is true and 0 if it is not
   * 
   * @param config1 - first script
   * @param config2 - second script
   * @param stackReassignment - (optional) pass false if STACK opcode operands dont need to be reassigned to their new 
   * relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own 
   * script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine
   * @returns a @see StateConfig in VM boolean format (true non-zero, false zero)
   */
  public static gt(config1: StateConfig, config2: StateConfig, stackReassignment: boolean = true): StateConfig {
    let result_ = VM.pair(config1, config2, stackReassignment);
    result_.sources[0] = concat([
      result_.sources[0],
      op(VM.Opcodes.GREATER_THAN)
    ])

    return result_;
  }

  /**
   * Method to check if a script is less than another script or not. will return 1 if is true and 0 if it is not
   * 
   * @param config1 - first script
   * @param config2 - second script
   * @param stackReassignment - (optional) pass false if STACK opcode operands dont need to be reassigned to their new 
   * relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own 
   * script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine
   * @returns a @see StateConfig in VM boolean format (true non-zero, false zero)
   */
  public static lt(config1: StateConfig, config2: StateConfig, stackReassignment: boolean = true): StateConfig {
    let result_ = VM.pair(config1, config2, stackReassignment);
    result_.sources[0] = concat([
      result_.sources[0],
      op(VM.Opcodes.LESS_THAN)
    ])

    return result_;
  }

  /**
   * Method to check if a script is greater than or equal to another script or not. will return 1 if is true and 0 if it is not
   * 
   * @param config1 - first script
   * @param config2 - second script 
   * @param stackReassignment - (optional) pass false if STACK opcode operands dont need to be reassigned to their new 
   * relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own 
   * script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine
   * @returns a @see StateConfig in VM boolean format (true non-zero, false zero)
   */
  public static gte(config1: StateConfig, config2: StateConfig, stackReassignment: boolean = true): StateConfig {
    let result_ = VM.pair(config1, config2, stackReassignment);
    result_.sources[0] = concat([
      result_.sources[0],
      op(VM.Opcodes.LESS_THAN),
      op(VM.Opcodes.ISZERO)
    ])

    return result_;
  }

  /**
   * Method to check if a script is less than or equal to another script or not. will return 1 if is true and 0 if it is not
   * 
   * @param config1 - first script
   * @param config2 - second script
   * @param stackReassignment - (optional) pass false if STACK opcode operands dont need to be reassigned to their new 
   * relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own 
   * script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine
   * @returns a @see StateConfig in VM boolean format (true non-zero, false zero)
   */
  public static lte(config1: StateConfig, config2: StateConfig, stackReassignment: boolean = true): StateConfig {
    let result_ = VM.pair(config1, config2, stackReassignment);
    result_.sources[0] = concat([
      result_.sources[0],
      op(VM.Opcodes.GREATER_THAN),
      op(VM.Opcodes.ISZERO)
    ])

    return result_;
  }

  // /**
  //  * Produce different values from the result of a VM script based on a tier contract.
  //  *
  //  * @param tierAddress - the contract address of the tier contract.
  //  * @param tierValues - an array of 8 items - the value (6 decimals max) of each tier are the 8 items of the array.
  //  * @param options - used for additional configuraions:
  //  *    - (param) index to identify which sources item in config.sources the TierValues applies to, if not specified, it will be 0.
  //  *    - (param) tierActivation An array of numbers, representing the amount of timestamps each tier must hold in order to get the different value,
  //  *       e.g. the first item in array is 100 mean tier 1 needs to be held at least 100 timestamps to get the respective value. (used for stake tier contract)
  //  *    - (param) tierContext an array of values mostly used for stake tier contracts.
  //  *    - (param) finalDecimals produce the final values in this fixed decimals - 0 by deafult
  //  *    - (param) delegatedReport - (optional) Used to determine if this script is being used for combinetier contract 
  //  *       or standalone then it will produce the result for SENDER(false) or ACCOUNT(true) i.e CONTEXT[0]
  //  *
  //  * @returns a VM script @see StateConfig
  //  */
  //  public static setValueForTiers(
  //   tierAddress: string,
  //   tierValues: BigNumber[],
  //   options?: {
  //     index?: number,
  //     tierActivation?: (string | number)[],
  //     tierContext?: BigNumber[],
  //     finalDecimals?: number,
  //     delegatedReport?: boolean
  //   }
  // ): StateConfig {
  //   const Index = options?.index ? options.index : 0;
  //   const delegated = options?.delegatedReport !== undefined ? options.delegatedReport : false;
  //   const Decimals = ("1").padEnd((options?.finalDecimals ? options.finalDecimals : 0), "0");

  //   const TierValues = paddedUInt256(
  //     BigNumber.from(
  //       '0x' +
  //         paddedUInt32(tierValues[7]) +
  //         paddedUInt32(tierValues[6]) +
  //         paddedUInt32(tierValues[5]) +
  //         paddedUInt32(tierValues[4]) +
  //         paddedUInt32(tierValues[3]) +
  //         paddedUInt32(tierValues[2]) +
  //         paddedUInt32(tierValues[1]) +
  //         paddedUInt32(tierValues[0])
  //     )
  //   );

    
  //   const CONTEXT_ = options?.tierContext && options.tierContext.length === 8
  //   ? {
  //       constants: options.tierContext,
  //       sources: concat([
  //         op(VM.Opcodes.CONSTANT, 7),
  //         op(VM.Opcodes.CONSTANT, 8),
  //         op(VM.Opcodes.CONSTANT, 9),
  //         op(VM.Opcodes.CONSTANT, 10),
  //         op(VM.Opcodes.CONSTANT, 11),
  //         op(VM.Opcodes.CONSTANT, 12),
  //         op(VM.Opcodes.CONSTANT, 13),
  //         op(VM.Opcodes.CONSTANT, 14),
  //       ])
  //     }
  //   : {
  //     constants: [],
  //     sources: concat([])
  //   }

  //   const TIER_BASED_VAL = () =>
  //     concat([
  //       op(VM.Opcodes.CONSTANT, 2),
  //       op(VM.Opcodes.CONSTANT, 1),
  //       delegated ? op(VM.Opcodes.CONTEXT, 0) : op(VM.Opcodes.SENDER),
  //       CONTEXT_.sources,
  //       op(VM.Opcodes.ITIERV2_REPORT, CONTEXT_.constants.length),
  //       op(VM.Opcodes.BLOCK_TIMESTAMP),
  //       op(
  //         VM.Opcodes.SELECT_LTE,
  //         selectLte(selectLteLogic.every, selectLteMode.first, 2)
  //       ),
  //     ]);
  //   const TIER_BASED_VAL_ZIPMAP = (valSize: number) =>
  //     concat([
  //       op(VM.Opcodes.ZIPMAP, callSize(1, 3, valSize)),
  //       op(VM.Opcodes.ADD, 8),
  //       op(VM.Opcodes.CONSTANT, 5), 
  //       op(VM.Opcodes.MUL, 2),
  //     ]);
  //   const ACTIVATION_TIME = () =>
  //     concat([
  //       op(VM.Opcodes.CONSTANT, 0),
  //       op(VM.Opcodes.BLOCK_TIMESTAMP),
  //       op(VM.Opcodes.UPDATE_TIMES_FOR_TIER_RANGE, tierRange(0, 8)),
  //       op(VM.Opcodes.CONSTANT, 1),
  //       delegated ? op(VM.Opcodes.CONTEXT, 0) : op(VM.Opcodes.SENDER),
  //       CONTEXT_.sources,
  //       op(VM.Opcodes.ITIERV2_REPORT, CONTEXT_.constants.length),
  //       op(VM.Opcodes.SATURATING_DIFF),
  //       op(VM.Opcodes.CONSTANT, 6),
  //     ]);
  //   const TIER_BASED_VAL_FN = (i: number) =>
  //     concat([
  //       op(VM.Opcodes.CONSTANT, i),
  //       op(VM.Opcodes.CONSTANT, 4),
  //       op(VM.Opcodes.LESS_THAN),
  //       op(VM.Opcodes.CONSTANT, i),
  //       op(VM.Opcodes.CONSTANT, 3),
  //       op(VM.Opcodes.EAGER_IF),
  //     ]);
  //   const ACTIVATION_TIME_FN = () =>
  //     concat([
  //       op(VM.Opcodes.CONSTANT, 16),
  //       op(VM.Opcodes.CONSTANT, 17),
  //       op(VM.Opcodes.LESS_THAN),
  //       op(VM.Opcodes.CONSTANT, 3),
  //     ]);

  //   const _tierValuesConfig: StateConfig = 
  //     options?.tierActivation && options.tierActivation.length === 8
  //     ? {
  //         constants: [
  //           ethers.constants.MaxUint256,
  //           tierAddress,
  //           TierValues,
  //           ascending ? '0' : '0xffffffff',
  //           '0xffffffff',
  //           Decimals,
  //           paddedUInt256(
  //             BigNumber.from(
  //               '0x' +
  //                 paddedUInt32(options.tierActivation[7]) +
  //                 paddedUInt32(options.tierActivation[6]) +
  //                 paddedUInt32(options.tierActivation[5]) +
  //                 paddedUInt32(options.tierActivation[4]) +
  //                 paddedUInt32(options.tierActivation[3]) +
  //                 paddedUInt32(options.tierActivation[2]) +
  //                 paddedUInt32(options.tierActivation[1]) +
  //                 paddedUInt32(options.tierActivation[0])
  //             )
  //           ),
  //           ...CONTEXT_.constants,
  //         ],
  //         sources: [
  //           concat([
  //             TIER_BASED_VAL(),
  //             ACTIVATION_TIME(),
  //             TIER_BASED_VAL_ZIPMAP(2),
  //           ]),
  //           concat([
  //             ACTIVATION_TIME_FN(),
  //             TIER_BASED_VAL_FN(7 + CONTEXT_.constants.length),
  //             op(VM.Opcodes.EAGER_IF),
  //           ]),
  //         ],
  //       }
  //     : {
  //         constants: [
  //           ethers.constants.MaxUint256,
  //           tierAddress,
  //           TierValues,
  //           ascending ? '0' : '0xffffffff',
  //           '0xffffffff',
  //           Decimals,
  //           ...CONTEXT_.constants
  //         ],
  //         sources: [
  //           concat([TIER_BASED_VAL(), TIER_BASED_VAL_ZIPMAP(0)]),
  //           TIER_BASED_VAL_FN(6 + CONTEXT_.constants.length),
  //         ],
  //       };

  //   return VM.combiner(config, _tierValuesConfig, { index: Index });
  // }

  /**
   * A method to generate the StateConfig out of EVM assets' opcodes
   * 
   * @param type - the type of the asset script
   * @param address - an array of address(es) of the asset(s) contract(s), only IERC20-Balance-of-Batch uses more than 1 address
   * @param id - an array of id(s) of either tokenId(s) or snapshotId(s) , only IERC20-Balance-of-Batch uses more than 1 id
   * @param delegatedCall - (optional) if true CONTEXT opcode will be used and if false SENDER opcode will be used
   * 
   * @returns a VM script @see StateConfig
   */
  public static getAsset(    
    type: 
      "erc20-balance-of" |
      "erc20-total-supply" |
      "snapshot-balance-of" |
      "snapshot-total-supply" |
      "erc721-balance-of" |
      "erc721-owner-of" |
      "erc1155-balance-of" |
      "erc1155-balance-of-batch",
    address: string[],
    id?: BigNumber[],
    delegatedCall: boolean = false
  ) : StateConfig {

    if (type === "erc20-balance-of" && address[0]) {
      return {
        constants: [address[0]],
        sources: [
          concat([
            op(VM.Opcodes.CONSTANT, 0),
            delegatedCall ? op(VM.Opcodes.SENDER) : op(VM.Opcodes.CONTEXT, 0),
            op(VM.Opcodes.IERC20_BALANCE_OF),
          ])
        ]
      }
    }
    else if (type === "erc20-total-supply" && address[0]) {
      return {
        constants: [address[0]],
        sources: [
          concat([
            op(VM.Opcodes.CONSTANT, 0),
            op(VM.Opcodes.IERC20_TOTAL_SUPPLY)
          ])
        ]
      }
    }
    else if (type === "snapshot-balance-of" && address[0] && id?.length) {
      return {
        constants: [address[0], id[0]],
        sources: [
          concat([
            op(VM.Opcodes.CONSTANT, 0),
            delegatedCall ? op(VM.Opcodes.SENDER) : op(VM.Opcodes.CONTEXT, 0),
            op(VM.Opcodes.CONSTANT, 1),
            op(VM.Opcodes.IERC20_SNAPSHOT_BALANCE_OF_AT)
          ])
        ]
      }
    }
    else if (type === "snapshot-total-supply" && address[0] && id?.length) {
      return {
        constants: [address[0], id[0]],
        sources: [
          concat([
            op(VM.Opcodes.CONSTANT, 0),
            op(VM.Opcodes.CONSTANT, 1),
            op(VM.Opcodes.IERC20_SNAPSHOT_TOTAL_SUPPLY_AT)
          ])
        ]
      }
    }
    else if (type === "erc721-balance-of" && address[0]) {
      return {
        constants: [address[0]],
        sources: [
          concat([
            op(VM.Opcodes.CONSTANT, 0),
            delegatedCall ? op(VM.Opcodes.SENDER) : op(VM.Opcodes.CONTEXT, 0),
            op(VM.Opcodes.IERC721_BALANCE_OF)
          ])
        ]
      }
    }
    else if (type === "erc721-owner-of" && address[0] && id?.length) {
      return {
        constants: [address[0], id[0]],
        sources: [
          concat([
            op(VM.Opcodes.CONSTANT, 0),
            op(VM.Opcodes.CONSTANT, 1),
            op(VM.Opcodes.IERC721_OWNER_OF)
          ])
        ]
      }
    }
    else if (type === "erc1155-balance-of" && address[0] && id?.length) {
      return {
        constants: [address[0], id[0]],
        sources: [
          concat([
            op(VM.Opcodes.CONSTANT, 0),
            delegatedCall ? op(VM.Opcodes.SENDER) : op(VM.Opcodes.CONTEXT, 0),
            op(VM.Opcodes.CONSTANT, 1),
            op(VM.Opcodes.IERC1155_BALANCE_OF)
          ])
        ]
      }
    }
    else if (type === "erc1155-balance-of-batch" && address.length === id?.length) {
      let i = 0;
      let sources: Uint8Array[] = [];
      for (i; i < address.length; i++) {
        sources.push(op(VM.Opcodes.CONSTANT, i))
      };
      sources.push(delegatedCall ? op(VM.Opcodes.SENDER) : op(VM.Opcodes.CONTEXT, 0));
      for (i; i < address.length * 2; i++) {
        sources.push(op(VM.Opcodes.CONSTANT, i))
      };
      return {
        constants: [...address, ...id],
        sources
      }
    }
    else throw new Error("not valid arguments for constructor") 
  }

  /**
   * Method to check if an address has any tier status or not, i.e if is in tier contract or not
   * 
   * @param tierConfig - the tier report config @see CombineTierGenerator
   * @param stackReassignment - (optional) pass false if STACK opcode operands dont need to be reassigned to their new 
   * relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own 
   * script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine
   * @returns a VM script @see StateConfig
   */
  public static hasAnyTier(
    tierConfig: StateConfig,
    stackReassignment: boolean = true
  ) : StateConfig {

    return VM.lt(
      tierConfig,
      VM.constant(ethers.constants.MaxUint256),
      stackReassignment
    )
  }

  /**
   * Method to check if an address has at least the "TIER" status
   * 
   * @param tierConfig - the tier report config @see CombineTierGenerator
   * @param tier - the minimum tier needed to be held
   * @param stackReassignment - (optional) pass false if STACK opcode operands dont need to be reassigned to their new 
   * relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own 
   * script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine
   * @returns a VM script @see StateConfig
   */
  public static hasMinTier(
    tierConfig: StateConfig,
    tier: Tier,
    stackReassignment: boolean = true
  ) : StateConfig {

    const reportCheck = paddedUInt256(
      "0x" +
      paddedUInt32("0xffffffff").repeat(8 - tier) +
      paddedUInt32("0").repeat(tier)
    )

    return VM.gte(tierConfig, VM.constant(reportCheck), stackReassignment)
  }

  /**
   * @public
   * Method to create a simple STACK opcode script
   * 
   * @param operand - stack operand
   * @returns a VM script @see StateConfig
   */
  public static stack(operand: number): StateConfig {
    return {
      constants: [],
      sources: [concat([op(VM.Opcodes.STACK, operand)])]
    }
  }

    /**
   * @public
   * Method to create a simple CONTEXT opcode script
   * 
   * @param operand - context operand
   * @returns a VM script @see StateConfig
   */
  public static input(operand: number): StateConfig {
    return {
      constants: [],
      sources: [concat([op(VM.Opcodes.CONTEXT, operand)])]
    }
  }

  /**
   * @public
   * Create a new raw linear decreasing value StateConfig.
   *
   * @param startValue - The starting value
   * @param endValue - The ending value
   * @param startTimestamp - Start timestamp
   * @param endTimestamp - End timestamp
   * @returns a @see StateConfig
   */
   public static dec(
    startValue: BigNumber,
    endValue: BigNumber,
    startTimestamp: number,
    endTimestamp: number
  ) {
    let raiseDuration = endTimestamp - startTimestamp;
    let valueChange = (startValue.sub(endValue)).div(raiseDuration);

    return ({
      constants: [
        startValue,
        endValue,
        valueChange,
        startTimestamp,
      ],
      sources: [
        concat([
          op(VM.Opcodes.BLOCK_TIMESTAMP),
          op(VM.Opcodes.CONSTANT, 3),
          op(VM.Opcodes.SATURATING_SUB, 2),
          op(VM.Opcodes.CONSTANT, 2),
          op(VM.Opcodes.MUL, 2),
          op(VM.Opcodes.CONSTANT, 0),
          op(VM.Opcodes.SATURATING_SUB, 2),
          op(VM.Opcodes.CONSTANT, 1),
          op(VM.Opcodes.MIN, 2),
        ])
      ],
    });
  }

  /**
   * @public
   * Create a new raw linear increasing value StateConfig.
   *
   * @param startValue - The starting value
   * @param endValue - The ending value
   * @param startTimestamp - Start timestamp
   * @param endTimestamp - End timestamp
   * @returns a @see StateConfig
   */
   public static inc(
    startValue: BigNumber,
    endValue: BigNumber,
    startTimestamp: number,
    endTimestamp: number
  ) {
    let raiseDuration = endTimestamp - startTimestamp;
    let valueChange = (endValue.sub(startValue)).div(raiseDuration);

    return ({
      constants: [
        startValue,
        endValue,
        valueChange,
        startTimestamp,
      ],
      sources: [
        concat([
          op(VM.Opcodes.BLOCK_TIMESTAMP),
          op(VM.Opcodes.CONSTANT, 3),
          op(VM.Opcodes.SATURATING_SUB, 2),
          op(VM.Opcodes.CONSTANT, 2),
          op(VM.Opcodes.MUL, 2),
          op(VM.Opcodes.CONSTANT, 0),
          op(VM.Opcodes.ADD, 2),
          op(VM.Opcodes.CONSTANT, 1),
          op(VM.Opcodes.MIN, 2),
        ])
      ],
    });
  }

  /**
   * @public
   * Method to apply discount on a StateConfig based on a condition passing
   * 
   * @param config - The StateConfig to apply discount on
   * @param condition - The condition of StateConfig type
   * @param discount - discount percentage (between 0 - 99 and 2 decimals max)
   * @returns a @see StateConfig
   */
  public static setDisccount(config: StateConfig, condition: StateConfig, discount: number): StateConfig {
    if ( discount >= 0 && discount <= 99 ) {
      const _discount = Math.floor(10000 - (100 * discount));
      const _discounter: StateConfig = VM.pair(
        condition,
        {
          constants: [_discount, 10000],
          sources: [
            concat([
              op(VM.Opcodes.CONSTANT, 0),
              op(VM.Opcodes.CONSTANT, 1),
              op(VM.Opcodes.EAGER_IF),
              op(VM.Opcodes.MUL, 2),
              op(VM.Opcodes.CONSTANT, 1),
              op(VM.Opcodes.DIV, 2),
            ])
          ]
        }
      );
  
      return VM.pair(config, _discounter, false);
    }
    else throw new Error(`Invalid discount`)
  }

  /**
   * @public
   * Method to apply multiplier to a StateConfig based on a condition passing
   * 
   * @param config - The StateConfig to apply multiplier to
   * @param condition - The condition of StateConfig type
   * @param multiplier - multulpier (2 decimals max) 
   */
  public static setMultiplier(config: StateConfig, condition: StateConfig, multiplier: number): StateConfig {
    const _multiply = Math.floor(100 * multiplier);
    const _multiplier: StateConfig = VM.pair(
      condition,
      {
        constants: [_multiply, 100],
        sources: [
          concat([
            op(VM.Opcodes.CONSTANT, 0),
            op(VM.Opcodes.CONSTANT, 1),
            op(VM.Opcodes.EAGER_IF),
            op(VM.Opcodes.MUL, 2),
            op(VM.Opcodes.CONSTANT, 1),
            op(VM.Opcodes.DIV, 2),
          ])
        ]
      }
    );

    return VM.pair(config, _multiplier, false);
  }

}