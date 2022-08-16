import { Tier } from './tierContract';
import { BytesLike, BigNumberish, BigNumber, utils, ethers } from 'ethers';
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
  arg,
  arrayify,
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
   * Duplicates the value atoptions.index `operand_` to the top of the stack
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
 * Class related to hold the some of the common patterns around the Rain VM that are required to interact
 * with it.
 *
 * @remarks
 * The class is intented to contain general methods that can be used in a lot of scenarios and ways.
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
    // return [concat(OPerands.map((x) => op(x[0], x[1] || 0)))];
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
   * @remarks - please be aware if your script has DUP opcode, as DUP is relative to script and cannot be handled by this method
   * and needs to be dealt with manualy before calling this method.
   *
   * @param config1 - the first VM script that will be combined. (default sits at top)
   * @param config2 - the second VM script that will be combined. (default sits at bottom)
   * @param options - used for additional configuraions:
   *    - (param) index - to identify which sources item in config1.sources the combination starts at, if not specified, it will be 0.
   *    - (param) numberOfSource - for specifying how many sources item to combine.
   *    - (param) position - An array representing the positions of config1 script where config2 sources
   *       will be merged at; position, array length must be equal to 'numberOfSources' or else it will be ignored.
   *
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
    const Index = options?.index ? options.index : 0;
    const NumberOfSources = options?.numberOfSources
      ? options.numberOfSources
      : 1;

    const constants = [...config1.constants, ...config2.constants];

    for (let i = 0; i < config2.sources.length; i++) {
      const sourceModify = arrayify(config2.sources[i], {
        allowMissingPrefix: true,
      });
      for (let j = 0; j < sourceModify.length; j++) {
        if (sourceModify[j] == 1) {
          let argCheck = sourceModify[j + 1] >> 7;
          if (!argCheck) {
            sourceModify[j + 1] += config1.constants.length;
          }
        }
        if (sourceModify[j] == 3) {
          const srcIndexIncrement = config1.sources.length - NumberOfSources;
          const srcIndex = sourceModify[j + 1] & 7;
          sourceModify[j + 1] =
            srcIndex < NumberOfSources
              ? sourceModify[j + 1] + Index
              : sourceModify[j + 1] + srcIndexIncrement;
        }
        j++;
      }
      config2.sources[i] = sourceModify;
    }

    if (options?.position && options.position.length == NumberOfSources) {
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
     * method to create paired(amount-price) StateConfig, which is used for sale, orderbook, etc
     *
     * @param amountConfig - amount's StateConfig, the config sitting at top and returning the first value
     * @param priceConfig - price's StateConfig, the config sitting at bottom and returning the second value
     * @param stackReassignment - (optional) pass false if STACK opcode operands dont need to be reassigned to 
     * their new relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to
     * any value outside of their own script scope (other scripts that are being combined) this way the STACK opcode 
     * operand will stay untouched when scripts combine
     *
     * @returns a StatecConfig
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
          if (_stackOpcodeModify[j] === 2) {
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
   * @returns a StateConfig
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
              if (_stackOpcodeModify[k] === 2) {
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
   * Methdo to create a simple signle value script, ie CONTANT
   * 
   * @param value - the value
   * 
   * @returns a StateConfig 
   */
  public static constant(value: BigNumberish): StateConfig {
    if (!(value instanceof BigNumber)) {
      value = BigNumber.from(value);
    } 

    return {
      constants: [value],
      sources: [concat([op(VM.Opcodes.VAL, 0)])],
      stackLength: 1,
      argumentsLength: 0
    };
  }

    /**
   * @public
   * Method to create a simple STACK opcode script
   * 
   * @param operand - stack operand
   * @returns a StateConfig
   */
  public static stack(operand: number): StateConfig {
    return {
      constants: [],
      sources: [concat([op(VM.Opcodes.DUP, operand)])],
      stackLength: 1,
      argumentsLength: 0
    }
  }

  /**
   * Method to create a simple time based rule
   * 
   * @param timestamp - the timestamp to set the rule for
   * @param type - type of the check, meaning current timestamp to be gt, gte, lt, lte than the "timestamp"
   * 
   * @returns A StateConfig
   */
  public static beforeAfterTime(
    timestamp: number,
    type: "gt" | "lt" | "gte" | "lte"
  ): StateConfig {
    const time: StateConfig = {
      constants: [],
      sources: [concat([op(VM.Opcodes.BLOCK_TIMESTAMP)])],
      stackLength: 1,
      argumentsLength: 0
    }
    const val: StateConfig = {
      constants: [timestamp],
      sources: [concat([op(VM.Opcodes.VAL, 0)])],
      stackLength: 1,
      argumentsLength: 0
    }
    let result_: StateConfig = {
      constants: [],
      sources: [],
      stackLength: 0,
      argumentsLength: 0
    };

    if (type === "gte") {
      result_ = VM.gte(time, val)
    }
    if (type === "lte") {
      result_ = VM.lte(time, val)
    }
    if (type === "lt") {
      result_ = VM.lt(time, val)
    }
    if (type === "gt") {
      result_ = VM.gt(time, val)
    }

    return result_;
  }


  /**
   * Method to create a simple block number based rule
   * 
   * @param blockNumber - the block number to set the rule for
   * @param type - type of the check, meaning current block number to be gt, gte, lt, lte than the "blockNumber"
   * 
   * @returns A StateConfig
   */
  public static beforeAfterBlock(
    blockNumber: number,
    type: "gt" | "lt" | "gte" | "lte"  
  ): StateConfig {
    const time: StateConfig = {
      constants: [],
      sources: [concat([op(VM.Opcodes.BLOCK_NUMBER)])],
      stackLength: 1,
      argumentsLength: 0
    }
    const val: StateConfig = {
      constants: [blockNumber],
      sources: [concat([op(VM.Opcodes.VAL, 0)])],
      stackLength: 1,
      argumentsLength: 0
    }
    let result_: StateConfig = {
      constants: [],
      sources: [],
      stackLength: 0,
      argumentsLength: 0
    };

    if (type === "gte") {
      result_ = VM.gte(time, val)
    }
    if (type === "lte") {
      result_ = VM.lte(time, val)
    }
    if (type === "lt") {
      result_ = VM.lt(time, val)
    }
    if (type === "gt") {
      result_ = VM.gt(time, val)
    }

    return result_;
  }

  /**
   * Method to make a StateConfig that checks if the current time is between 2 provided times.
   * i.e. if the current time is between those 2 times, the result will be 1(true) and if not the result will be 0(false)
   *
   * @param startTimestamp - The start timestamp
   * @param endTimestamp - The end timestamp
   * @returns A StateConfig
   */
  public static betweenTimes(
    startTimestamp: number,
    endTimestamp: number
  ): StateConfig {
    return {
      constants: [startTimestamp, endTimestamp],
      sources: [
        concat([
          op(VM.Opcodes.BLOCK_TIMESTAMP),
          op(VM.Opcodes.VAL, 0),
          op(VM.Opcodes.GREATER_THAN),
          op(VM.Opcodes.BLOCK_TIMESTAMP),
          op(VM.Opcodes.VAL, 1),
          op(VM.Opcodes.LESS_THAN),
          op(VM.Opcodes.EVERY, 2),
        ]),
      ],
      stackLength: 7,
      argumentsLength: 0
    }
  }

  /**
   * Method to make a StateConfig that checks if the current block is between 2 provided block numbers.
   * i.e. if the current block is between those 2 block numbers, the result will be 1(true) and if not the result will be 0(false)
   *
   * @param startBlock - The start block number
   * @param endBlock - The end block number
   * @returns A StateConfig
   */
  public static betweenBlocks(
    startBlock: number,
    endBlock: number
  ): StateConfig {
    return {
      constants: [startBlock, endBlock],
      sources: [
        concat([
          op(VM.Opcodes.BLOCK_NUMBER),
          op(VM.Opcodes.VAL, 0),
          op(VM.Opcodes.GREATER_THAN),
          op(VM.Opcodes.BLOCK_NUMBER),
          op(VM.Opcodes.VAL, 1),
          op(VM.Opcodes.LESS_THAN),
          op(VM.Opcodes.EVERY, 2),
        ]),
      ],
      stackLength: 7,
      argumentsLength: 0
    }
  }

  /**
   * Method to multiply multiple scripts together
   * 
   * @param configs - an array of configs to multiply
   * @param stackReassignment - (optional) pass false if STACK opcode operands dont need to be reassigned to their new 
   * relative positioins in the script. i.e. if the individual scripts' STACK opcodes are refering to any value outside of their own 
   * script scope (refering to other scripts that are being combined). this way the STACK opcode operand will stay untouched when scripts combine
   * 
   * @returns a StateConfig 
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
   * @returns a StateConfig 
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
   * @returns a StateConfig 
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
   * @returns a StateConfig 
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
   * @returns a StateConfig 
   */
  public static ifelse(
    condition: StateConfig,
    ifStatement: StateConfig,
    elseStatement: StateConfig,
    stackReassignment: boolean = true
  ): StateConfig {

    let result_ = VM.multi(
      [condition, ifStatement, elseStatement],
      stackReassignment
    )
    result_.sources[0] = concat([
      result_.sources[0],
      op(VM.Opcodes.EAGER_IF)
    ])

    return result_;
  }

  /**
   * Method to check if a script is zero or not. will return 1 if is zero and 0 if it is not
   * 
   * @param config - the script to check
   * 
   * @returns a StateConfig in VM boolean format (true non-zero, false zero)
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
   * @returns a StateConfig in VM boolean format (true non-zero, false zero)
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
   * @returns a StateConfig in VM boolean format (true non-zero, false zero)
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
   * @returns a StateConfig in VM boolean format (true non-zero, false zero)
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
   * @returns a StateConfig in VM boolean format (true non-zero, false zero)
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
   * @returns a StateConfig in VM boolean format (true non-zero, false zero)
   */
  public static xor(configs: StateConfig[], stackReassignment: boolean = true): StateConfig {
    const and: StateConfig = {
      constants: [],
      sources: [concat([op(VM.Opcodes.EVERY, configs.length)])],
      stackLength: 1,
      argumentsLength: 0
    };
    const nor: StateConfig = {
      constants: [],
      sources: [
        concat([
          op(VM.Opcodes.ANY, configs.length),
          op(VM.Opcodes.ISZERO)
        ])
      ],
      stackLength: 1,
      argumentsLength: 0
    };

    let result_ = VM.multi(
      [...configs, and, ...configs, nor],
      stackReassignment
    )
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
   * @returns a StateConfig in VM boolean format (true non-zero, false zero)
   */
   public static xnor(configs: StateConfig[], stackReassignment: boolean = true): StateConfig {
    const and: StateConfig = {
      constants: [],
      sources: [concat([op(VM.Opcodes.EVERY, configs.length)])],
      stackLength: 1,
      argumentsLength: 0
    };
    const nor: StateConfig = {
      constants: [],
      sources: [
        concat([
          op(VM.Opcodes.ANY, configs.length),
          op(VM.Opcodes.ISZERO)
        ])
      ],
      stackLength: 1,
      argumentsLength: 0
    };
    let result_ = VM.multi(
      [...configs, and, ...configs, nor],
      stackReassignment
    )
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
   * @returns a StateConfig in VM boolean format (true non-zero, false zero)
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
   * @returns a StateConfig in VM boolean format (true non-zero, false zero)
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
   * @returns a StateConfig in VM boolean format (true non-zero, false zero)
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
   * @returns a StateConfig in VM boolean format (true non-zero, false zero)
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
   * @returns a StateConfig in VM boolean format (true non-zero, false zero)
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

  /**
   * A method to generate the StateConfig out of EVM assets' opcodes
   * 
   * @param type - the type of the asset script
   * @param address - an array of address(es) of the asset(s) contract(s), only IERC20-Balance-of-Batch uses more than 1 address
   * @param id - an array of id(s) of either tokenId(s) or snapshotId(s) , only IERC20-Balance-of-Batch uses more than 1 id
   * @param delegatedCall - (optional) if true CONTEXT opcode will be used and if false SENDER opcode will be used
   * 
   * @returns a StateConfig
   */
  public static getAsset(    
    type: 
      "erc20-balance-of" |
      "erc20-total-supply" |
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
            op(VM.Opcodes.VAL, 0),
            delegatedCall ? op(VM.Opcodes.length) : op(VM.Opcodes.SENDER),
            op(VM.Opcodes.IERC20_BALANCE_OF),
          ])
        ],
        stackLength: 3,
        argumentsLength: 0
      }
    }
    else if (type === "erc20-total-supply" && address[0]) {
      return {
        constants: [address[0]],
        sources: [
          concat([
            op(VM.Opcodes.VAL, 0),
            op(VM.Opcodes.IERC20_TOTAL_SUPPLY)
          ])
        ],
        stackLength: 2,
        argumentsLength: 0
      }
    }
    else if (type === "erc721-balance-of" && address[0]) {
      return {
        constants: [address[0]],
        sources: [
          concat([
            op(VM.Opcodes.VAL, 0),
            delegatedCall ? op(VM.Opcodes.length) : op(VM.Opcodes.SENDER),
            op(VM.Opcodes.IERC721_BALANCE_OF)
          ])
        ],
        stackLength: 3,
        argumentsLength: 0
      }
    }
    else if (type === "erc721-owner-of" && address[0] && id?.length) {
      return {
        constants: [address[0], id[0]],
        sources: [
          concat([
            op(VM.Opcodes.VAL, 0),
            op(VM.Opcodes.VAL, 1),
            op(VM.Opcodes.IERC721_OWNER_OF)
          ])
        ],
        stackLength: 3,
        argumentsLength: 0
      }
    }
    else if (type === "erc1155-balance-of" && address[0] && id?.length) {
      return {
        constants: [address[0], id[0]],
        sources: [
          concat([
            op(VM.Opcodes.VAL, 0),
            delegatedCall ? op(VM.Opcodes.length) : op(VM.Opcodes.SENDER),
            op(VM.Opcodes.VAL, 1),
            op(VM.Opcodes.IERC1155_BALANCE_OF)
          ])
        ],
        stackLength: 4,
        argumentsLength: 0
      }
    }
    else if (type === "erc1155-balance-of-batch" && address.length === id?.length) {
      let i = 0;
      let sources: Uint8Array[] = [];
      for (i; i < address.length; i++) {
        sources.push(op(VM.Opcodes.VAL, i))
      };
      sources.push(delegatedCall ? op(VM.Opcodes.length) : op(VM.Opcodes.SENDER));
      for (i; i < address.length * 2; i++) {
        sources.push(op(VM.Opcodes.VAL, i))
      };
      return {
        constants: [...address, ...id],
        sources,
        stackLength: (address.length * 2) + 2,
        argumentsLength: 0
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
   * @returns a StateConfig
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
   * @returns a StateConfig
   */
  public static hasMinTier(
    tierConfig: StateConfig,
    tier: Tier,
    stackReassignment: boolean = true
  ) : StateConfig {

    const reportCheck = paddedUInt256(
      "0x" +
      paddedUInt32("0xffffffff").repeat(8 - tier + 1) +
      paddedUInt32("0").repeat(tier - 1)
    )

    return VM.lt(tierConfig, VM.constant(reportCheck), stackReassignment)
  }

  /**
   * @public
   * Create a new raw linear decreasing value StateConfig.
   *
   * @param startValue - The starting value
   * @param endValue - The ending value
   * @param startPoint - Starting point, either timestamp or block number
   * @param endPoint - Ending point, either timestamp or block number
   * @param byBlock - Whether increasing by block or timestamp, pass true to be based on block
   * @returns a StateConfig
   */
   public static dec(
    startValue: BigNumber,
    endValue: BigNumber,
    startPoint: number,
    endPoint: number,
    byBlock: boolean = false
  ): StateConfig {
    let duration = endPoint - startPoint;
    let valueChange = (startValue.sub(endValue)).div(duration);

    return ({
      constants: [
        startValue,
        endValue,
        valueChange,
        startPoint,
      ],
      sources: [
        concat([
          byBlock ? op(VM.Opcodes.BLOCK_NUMBER) : op(VM.Opcodes.BLOCK_TIMESTAMP),
          op(VM.Opcodes.VAL, 3),
          op(VM.Opcodes.SATURATING_SUB, 2),
          op(VM.Opcodes.VAL, 2),
          op(VM.Opcodes.MUL, 2),
          op(VM.Opcodes.VAL, 0),
          op(VM.Opcodes.SATURATING_SUB, 2),
          op(VM.Opcodes.VAL, 1),
          op(VM.Opcodes.MAX, 2),
        ])
      ],
      stackLength: 10,
      argumentsLength: 0
    });
  }

  /**
   * @public
   * Create a new raw linear increasing value StateConfig.
   *
   * @param startValue - The starting value
   * @param endValue - The ending value
   * @param startPoint - Starting point, either timestamp or block number
   * @param endPoint - Ending point, either timestamp or block number
   * @param byBlock - Whether increasing by block or timestamp, pass true to be based on block
   * @returns a StateConfig
   */
   public static inc(
    startValue: BigNumber,
    endValue: BigNumber,
    startPoint: number,
    endPoint: number,
    byBlock: boolean = false
  ): StateConfig {
    let duration = endPoint - startPoint;
    let valueChange = (endValue.sub(startValue)).div(duration);

    return ({
      constants: [
        startValue,
        endValue,
        valueChange,
        startPoint,
      ],
      sources: [
        concat([
          byBlock ? op(VM.Opcodes.BLOCK_NUMBER) : op(VM.Opcodes.BLOCK_TIMESTAMP),
          op(VM.Opcodes.VAL, 3),
          op(VM.Opcodes.SATURATING_SUB, 2),
          op(VM.Opcodes.VAL, 2),
          op(VM.Opcodes.MUL, 2),
          op(VM.Opcodes.VAL, 0),
          op(VM.Opcodes.ADD, 2),
          op(VM.Opcodes.VAL, 1),
          op(VM.Opcodes.MIN, 2),
        ])
      ],
      stackLength: 10,
      argumentsLength: 0
    });
  }

  /**
   * @public
   * Method to apply discount on a StateConfig based on a condition passing
   * 
   * @param config - The StateConfig to apply discount on
   * @param condition - The condition of StateConfig type
   * @param discount - discount percentage (between 0 - 99 and 2 decimals max)
   * @returns a StateConfig
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
              op(VM.Opcodes.VAL, 0),
              op(VM.Opcodes.VAL, 1),
              op(VM.Opcodes.EAGER_IF),
              op(VM.Opcodes.MUL, 2),
              op(VM.Opcodes.VAL, 1),
              op(VM.Opcodes.DIV, 2),
            ])
          ],
          stackLength: 6,
          argumentsLength: 0
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
   * @returns a StateConfig
   */
  public static setMultiplier(config: StateConfig, condition: StateConfig, multiplier: number): StateConfig {
    const _multiply = Math.floor(100 * multiplier);
    const _multiplier: StateConfig = VM.pair(
      condition,
      {
        constants: [_multiply, 100],
        sources: [
          concat([
            op(VM.Opcodes.VAL, 0),
            op(VM.Opcodes.VAL, 1),
            op(VM.Opcodes.EAGER_IF),
            op(VM.Opcodes.MUL, 2),
            op(VM.Opcodes.VAL, 1),
            op(VM.Opcodes.DIV, 2),
          ])
        ],
        stackLength: 6,
        argumentsLength: 0
      }
    );

    return VM.pair(config, _multiplier, false);
  }


  /**
   * @public
   * Create a new raw linear increasing value StateConfig increasing by a margin over each period.
   *
   * @param startValue - The starting value
   * @param startPoint - Starting point, either timestamp or block number
   * @param margin - The amount to increase by each period passing
   * @param periodLength - The length of each period
   * @param endValue - Ending point, either timestamp or block number
   * @param byBlock - Whether increasing by block or timestamp, pass true to be based on block
   * @returns a StateConfig
   */
  public static incBy(
    startValue: BigNumber,
    startPoint: number,
    margin: BigNumber,
    periodLength: number,
    endValue?: number,
    byBlock: boolean = false,
  ): StateConfig {
    const constants_ = endValue
    ? [
      startValue,
      startPoint,
      margin,
      periodLength,
      endValue
    ]
    : [
      startValue,
      startPoint,
      margin,
      periodLength
    ]

    const end_ = endValue
    ? [
      op(VM.Opcodes.VAL, 4),
      op(VM.Opcodes.MIN, 2)
    ]
    : [];

    return ({
      constants: constants_,
      sources: [
        concat([
          byBlock ? op(VM.Opcodes.BLOCK_NUMBER) : op(VM.Opcodes.BLOCK_TIMESTAMP),
          op(VM.Opcodes.VAL, 1),
          op(VM.Opcodes.SATURATING_SUB, 2),
          op(VM.Opcodes.VAL, 3),
          op(VM.Opcodes.DIV, 2),
          op(VM.Opcodes.VAL, 2),
          op(VM.Opcodes.MUL, 2),
          op(VM.Opcodes.VAL, 0),
          op(VM.Opcodes.ADD, 2),
          ...end_
        ])
      ],
      stackLength: 10,
      argumentsLength: 0
    });
  }

  /**
   * @public
   * Create a new raw linear decreasing value StateConfig decreasing by a margin over each period.
   *
   * @param startValue - The starting value
   * @param startPoint - Starting point, either timestamp or block number
   * @param margin - The amount to decrease by each period passing
   * @param periodLength - The length of each period
   * @param endValue - Ending point, either timestamp or block number
   * @param byBlock - Whether decreasing by block or timestamp, pass true to be based on block
   * @returns a StateConfig
   */
  public static decBy(
    startValue: BigNumber,
    startPoint: number,
    margin: BigNumber,
    periodLength: number,
    endValue?: number,
    byBlock: boolean = false,
  ): StateConfig {
    const constants_ = endValue
    ? [
      startValue,
      startPoint,
      margin,
      periodLength,
      endValue
    ]
    : [
      startValue,
      startPoint,
      margin,
      periodLength
    ]

    const end_ = endValue
    ? [
      op(VM.Opcodes.VAL, 4),
      op(VM.Opcodes.MAX, 2)
    ]
    : [];

    return ({
      constants: constants_,
      sources: [
        concat([
          byBlock ? op(VM.Opcodes.BLOCK_NUMBER) : op(VM.Opcodes.BLOCK_TIMESTAMP),
          op(VM.Opcodes.VAL, 1),
          op(VM.Opcodes.SATURATING_SUB, 2),
          op(VM.Opcodes.VAL, 3),
          op(VM.Opcodes.DIV, 2),
          op(VM.Opcodes.VAL, 2),
          op(VM.Opcodes.MUL, 2),
          op(VM.Opcodes.VAL, 0),
          op(VM.Opcodes.SATURATING_SUB, 2),
          ...end_
        ])
      ],
      stackLength: 10,
      argumentsLength: 0
    });
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
    const Index = options?.index ? options.index : 0;

    const MAKE_OWNER = (i: any) =>
      concat([
        op(VM.Opcodes.VAL, i),
        op(VM.Opcodes.SENDER),
        op(VM.Opcodes.EQUAL_TO),
      ]);

    if (options?.notOwnerVar && typeof options.notOwnerVar === 'object') {
      let _result = this.combiner(config, options.notOwnerVar, {
        index: options.index,
        position: options.position,
      });
      _result.constants.push(ownerAddress);
      _result.sources[Index] = concat([
        MAKE_OWNER(_result.constants.length - 1),
        _result.sources[Index],
        op(VM.Opcodes.EAGER_IF),
      ]);
      _result.stackLength = BigNumber.from(_result.stackLength).add(4);

      return _result;
    } else {
      const NotOwnerVar =
        options?.notOwnerVar && typeof options?.notOwnerVar == 'number'
          ? options.notOwnerVar
          : 0;
      const constants = [...config.constants, ownerAddress, NotOwnerVar];
      config.sources[Index] = concat([
        MAKE_OWNER(constants.length - 2),
        config.sources[Index],
        op(VM.Opcodes.VAL, constants.length - 1),
        op(VM.Opcodes.EAGER_IF),
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
  public static setDiscountForTiers(
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
      ]);

    const ACTIVATION_TIME_FN = (i: number) =>
      concat([
        op(VM.Opcodes.VAL, arg(1)),
        op(VM.Opcodes.VAL, arg(2)),
        op(VM.Opcodes.LESS_THAN),
        op(VM.Opcodes.VAL, i - 1),
      ]);

    if (options?.tierActivation && options.tierActivation.length > 7) {
      const TierDiscountActivation = paddedUInt256(
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
   * @param options - used for additional configuraions:
   *    - (param) index to identify which sources item in config.sources the tierMultiplier applies to, if not specified, it will be 0.
   *    - (param) tierActivation An array of numbers, representing the amount of blocks each tier must hold in order to get the multiplier,
   *       e.g. the first item in array is 100 mean tier 1 needs to be held at least 100 blocks to get the multiplier.
   *
   * @returns a VM script @see StateConfig
   */
  public static setMultiplierForTiers(
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

    if (options?.tierActivation && options.tierActivation.length > 7) {
      const TierMultiplierActivation = paddedUInt256(
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
   * A method to merge multiple (more than 1) scripts to be executed based on time slices.
   *
   * @param configs - An array of StateConfigs that will be merged and executed at runtime in order by time slices
   * @param times - An array of numbers representing either BLOCK_NUMBER or TIMESTAMP that time slices will be between each of the 2 items in the array
   * its length should be number of configs - 1.
   * @param inBlockNumber - (optional) false by default which means the time slices will be based on TIMESTAMP, pass true to base it on BLOCK_NUMBER
   *
   * @returns a VM script @see StateConfig
   */
  public static setTimer(
    configs: StateConfig[],
    times: number[],
    inBlockNumber: boolean = false
  ): StateConfig {
    if (configs.length == times.length + 1) {
      let _result: StateConfig;

      const SLICER = (i: number): StateConfig => {
        return {
          constants: [times[i]],
          sources: [
            concat([
              inBlockNumber
                ? op(VM.Opcodes.BLOCK_NUMBER)
                : op(VM.Opcodes.BLOCK_TIMESTAMP),
              op(VM.Opcodes.VAL, 0),
              op(VM.Opcodes.LESS_THAN),
            ]),
          ],
          stackLength: 3,
          argumentsLength: 0,
        };
      };

      _result = VM.combiner(SLICER(0), configs[0]);

      for (let i = 1; i < configs.length; i++) {
        if (i + 1 == configs.length) {
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
