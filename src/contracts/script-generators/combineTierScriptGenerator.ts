import { Tier } from '../../classes/iTierV2';
import { StateConfig, VM } from '../../classes/vm';
import { BigNumberish, BigNumber, BytesLike, ethers } from 'ethers';
import {
  concat,
  op,
  selectLte,
  callSize,
  tierRange,
  paddedUInt32,
  paddedUInt256,
  selectLteLogic,
  selectLteMode
} from '../../utils';

/**
 * @public The script generator for generating CombineTier scripts although it is worth mentioning that
 * the usecases would not be only limited to CombineTier contract and can be used for any script.
 *
 * @example new CombineTier(a tierAddress or a StateConfig)
 */
export class CombineTierGenerator {

  // StateConfig Properties of this class
  public constants: BigNumberish[];
  public sources: BytesLike[];

  /**
   * Constructor for this class
   *
   * @param reporter - either a tier contract address or a StateConfig of REPROT script (or any other form of StateConfig desired)
   * @param options - (optional) used for additional configuration of the script
   *    - (param) delegatedReport - (optional) Used to determine if this script is being used for combinetier contract 
   * or standalone then it will produce the result for SENDER(false) or ACCOUNT(true) i.e CONTEXT[0]
   *    - (param) hasReportForSingleTier - (optional) Used to determine if this script needs to have a second
   *        script used for getting the ITIERV2_TIME_FOR_TIER for a combineTier contract reportTimeForTier, default is false
   *    - (optional) dynamicTierContext - (optional) true if tier context will be passed at runtime to the report function
   *    - (param) staticTierContext - (optional) an array of 8 values used as Stake thresholds or in general as REPORT opcodes context
   */
  constructor(
    reporter: string | StateConfig,
    options?: {
      delegatedReport?: boolean,
      hasReportForSingleTier?: boolean,
      dynamicTierContext?: boolean,
      staticTierContext?: BigNumber[]
    }
  ) {
    const CONTEXT_ = 
      typeof reporter === "string"
      ? options?.dynamicTierContext
      ? {
        constants: [],
          sources: concat([
            op(VM.Opcodes.CONTEXT, 2),
            op(VM.Opcodes.CONTEXT, 3),
            op(VM.Opcodes.CONTEXT, 4),
            op(VM.Opcodes.CONTEXT, 5),
            op(VM.Opcodes.CONTEXT, 6),
            op(VM.Opcodes.CONTEXT, 7),
            op(VM.Opcodes.CONTEXT, 8),
            op(VM.Opcodes.CONTEXT, 9),
          ])
      }
      : options?.staticTierContext && options?.staticTierContext.length === 8
      ? {
          constants: options.staticTierContext,
          sources: concat([
            op(VM.Opcodes.CONSTANT, 1),
            op(VM.Opcodes.CONSTANT, 2),
            op(VM.Opcodes.CONSTANT, 3),
            op(VM.Opcodes.CONSTANT, 4),
            op(VM.Opcodes.CONSTANT, 5),
            op(VM.Opcodes.CONSTANT, 6),
            op(VM.Opcodes.CONSTANT, 7),
            op(VM.Opcodes.CONSTANT, 8),
          ])
      }
      : {
        constants: [],
        sources: concat([])
      }
      : {
          constants: [],
          sources: concat([])
      }

    let report_: StateConfig;

    const singleReport_ = {
      constants: [
        paddedUInt256(
          paddedUInt32('8') +
          paddedUInt32('7') +
          paddedUInt32('6') +
          paddedUInt32('5') +
          paddedUInt32('4') +
          paddedUInt32('3') +
          paddedUInt32('2') +
          paddedUInt32('1')
        ),
        "0"
      ],
      sources: [
        concat([
          op(VM.Opcodes.THIS_ADDRESS),
          options?.delegatedReport ? op(VM.Opcodes.CONTEXT, 0) : op(VM.Opcodes.SENDER, 0),
          op(VM.Opcodes.ITIERV2_REPORT),
          op(VM.Opcodes.CONSTANT, 0),
          op(VM.Opcodes.ZIPMAP, callSize(1, 3, 1)),
          op(VM.Opcodes.ADD, 8)
        ]),
        concat([
          op(VM.Opcodes.CONTEXT, 1),
          op(VM.Opcodes.CONSTANT, 3),
          op(VM.Opcodes.EQUAL_TO),
          op(VM.Opcodes.CONSTANT, 2),
          op(VM.Opcodes.CONSTANT, 1),
          op(VM.Opcodes.EAGER_IF)
        ])
      ]
    };

    if (typeof reporter == 'string') {
      report_ = {
        constants: [reporter],
        sources: [
          concat([
            op(VM.Opcodes.CONSTANT, 0),
            options?.delegatedReport ? op(VM.Opcodes.CONTEXT, 0) : op(VM.Opcodes.SENDER, 0),
            CONTEXT_.sources,
            op(VM.Opcodes.ITIERV2_REPORT, CONTEXT_.constants.length),
          ])
        ]
      }
    } 
    else {
      report_ = reporter;
    }

    report_ = options?.hasReportForSingleTier 
    ? typeof reporter == 'string'
    ? {
      constants: report_.constants,
      sources: [
        ...report_.sources,
        concat([
          op(VM.Opcodes.CONSTANT, 0),
          op(VM.Opcodes.CONTEXT, 0),
          op(VM.Opcodes.CONTEXT, 1),
          CONTEXT_.sources,
          op(VM.Opcodes.ITIERV2_REPORT_TIME_FOR_TIER, CONTEXT_.constants.length),
        ])
      ]
    }
    : VM.combiner(report_, singleReport_, {numberOfSources: 0})
    : report_;

    this.constants = report_.constants;
    this.sources = report_.sources;

  }

  /**
   * Combines 2 tier report with selectLte with its logic and mode, and can be chained for multiple reports each with their own logic and mode
   *
   * @param reporter - either a tier contract address or a StateConfig of REPROT script (or any other form of StateConfig desired)
   * @param logic - selectLte logic
   * @param mode - selectLte mode
   * @param hasReportForSingleTier - (optional) Used to determine if this script needs to have a second
   * script used for getting the ITIERV2_TIME_FOR_TIER for a combineTier contract reportTimeForTier, default is false
   * @param delegatedReport - (optional) Used to determine if this script is being used for combinetier contract 
   * or standalone then it will produce the result for SENDER(false) or ACCOUNT(true) i.e CONTEXT[0]
   * @param number - (optional) if passed it would be the number to compare reports against, if not passed reports will be compared against BLOCK_TIMESTAMP
   *
   * @returns CombineTierGenerator
   */
  public combineWith(
    reporter: string | StateConfig,
    logic: selectLteLogic,
    mode: selectLteMode,
    hasReportForSingleTier: boolean = false,
    delegatedReport?: boolean,
    number?: number
  ): CombineTierGenerator {
    const _buttom = new CombineTierGenerator(reporter, {delegatedReport, hasReportForSingleTier})

    const _combiner: StateConfig = {
      constants: number ? [number] : [],
      sources: [
        concat([
          number ? op(VM.Opcodes.CONSTANT, 0) : op(VM.Opcodes.BLOCK_TIMESTAMP),
          op(VM.Opcodes.SELECT_LTE, selectLte(logic, mode, 2)),
        ])
      ],
    };

    if (hasReportForSingleTier) _combiner.sources.push(
      concat([
        number ? op(VM.Opcodes.CONSTANT, 0) : op(VM.Opcodes.BLOCK_TIMESTAMP),
        op(VM.Opcodes.SELECT_LTE, selectLte(logic, mode, 2)),
      ])
    )

    let _result: StateConfig = VM.combiner(_buttom, _combiner, {numberOfSources: hasReportForSingleTier ? 2 : 1});
    _result = VM.combiner(this, _result, {numberOfSources: hasReportForSingleTier ? 2 : 1});

    this.constants = _result.constants;
    this.sources = _result.sources;

    return this;
  }

  /**
   * Method to update a report at given tier range (can be any range between 0 to 8)
   *
   * @param startTier - start of the report updating range (exclusive)
   * @param endTier - end of the report updating range (inclusive)
   * @param number - (optional) if passed it would be the number to compare reports against, if not passed reports will be compared against BLOCK_TIMESTAMP
   *
   * @returns CombineTierGenerator
   */
  public updateReport(
    startTier: Tier,
    endTier: Tier,
    number?: number
  ): CombineTierGenerator {
    const _updater: StateConfig = {
      constants: number ? [number] : [],
      sources: [
        concat([
          number ? op(VM.Opcodes.CONSTANT, 0) : op(VM.Opcodes.BLOCK_TIMESTAMP),
          op(
            VM.Opcodes.UPDATE_TIMES_FOR_TIER_RANGE,
            tierRange(startTier, endTier)
          ),
        ]),
      ],
    };

    const _result: StateConfig = VM.combiner(this, _updater);

    this.constants = _result.constants;
    this.sources = _result.sources;

    return this;
  }

  /**
   * Saturating difference between 2 reports
   *
   * @param reporter - either a tier contract address or a StateConfig of REPROT script (or any other form of StateConfig desired)
   * @param delegatedReport - (optional) Used to determine if this script is being used for combinetier contract 
   * or standalone then it will produce the result for SENDER(false) or ACCOUNT(true) i.e CONTEXT[0]
   *
   * @returns CombineTierGenerator
   */
  public differenceFrom(reporter: string | StateConfig, delegatedReport?: boolean): this {
    const _buttom = new CombineTierGenerator(reporter, {delegatedReport})

    const _differ: StateConfig = {
      constants: [],
      sources: [concat([op(VM.Opcodes.SATURATING_DIFF)])],
    };

    let _result: StateConfig = VM.combiner(_buttom, _differ);
    _result = VM.combiner(this, _result);

    this.constants = _result.constants;
    this.sources = _result.sources;

    return this;
  }

  /**
   * Creats a holding time ALWAYS/NEVER tier script for a Combinetier contract out of a Stake contract.
   *
   * @param duration - An array of numbers represting the duration in timestamp a given 
   * tier must be held to get ALWAYS report or else it gets NEVER report.
   * 
   * @returns CombineTierGenerator
   */
  public isTierHeldFor(duration: number[]): CombineTierGenerator {

    const _shifter = paddedUInt256(
          paddedUInt32('7') +
          paddedUInt32('6') +
          paddedUInt32('5') +
          paddedUInt32('4') +
          paddedUInt32('3') +
          paddedUInt32('2') +
          paddedUInt32('1') +
          paddedUInt32('0')
    );

    duration[0] = duration[0] ? duration[0] : 0;
    duration[1] = duration[1] && duration[1] <= duration[0] ? duration[1] : duration[0];
    duration[2] = duration[2] && duration[2] <= duration[1] ? duration[2] : duration[1];
    duration[3] = duration[3] && duration[3] <= duration[2] ? duration[3] : duration[2];
    duration[4] = duration[4] && duration[4] <= duration[3] ? duration[4] : duration[3];
    duration[5] = duration[5] && duration[5] <= duration[4] ? duration[5] : duration[4];
    duration[6] = duration[6] && duration[6] <= duration[5] ? duration[6] : duration[5];
    duration[7] = duration[7] && duration[7] <= duration[6] ? duration[7] : duration[6];

    const _blocks = paddedUInt256(
      BigNumber.from(
        "0x" +
        paddedUInt32(duration[7]) +
        paddedUInt32(duration[6]) +
        paddedUInt32(duration[5]) +
        paddedUInt32(duration[4]) +
        paddedUInt32(duration[3]) +
        paddedUInt32(duration[2]) +
        paddedUInt32(duration[1]) +
        paddedUInt32(duration[0])
      )
    );

    let _result: StateConfig = {
      constants: [_blocks, _shifter, '100000000', '0', '0xffffffff', ethers.constants.MaxUint256],
      sources: [
        concat([
          op(VM.Opcodes.CONSTANT, 5),
          op(VM.Opcodes.BLOCK_NUMBER),
          op(VM.Opcodes.UPDATE_TIMES_FOR_TIER_RANGE, tierRange(Tier.ZERO, Tier.EIGHT)),
          op(VM.Opcodes.SATURATING_DIFF),
          op(VM.Opcodes.CONSTANT, 0),
          op(VM.Opcodes.CONSTANT, 1),
          op(VM.Opcodes.ZIPMAP, callSize(1, 3, 2)),
          op(VM.Opcodes.ADD, 8),
        ]),
        concat([
          op(VM.Opcodes.CONSTANT, 7),
          op(VM.Opcodes.CONSTANT, 6),
          op(VM.Opcodes.GREATER_THAN, 2),
          op(VM.Opcodes.CONSTANT, 4),
          op(VM.Opcodes.CONSTANT, 3),
          op(VM.Opcodes.EAGER_IF),
          op(VM.Opcodes.CONSTANT, 2),
          op(VM.Opcodes.CONSTANT, 8),
          op(VM.Opcodes.EXP, 2),
          op(VM.Opcodes.MUL, 2),
        ]),
      ],
    };

    _result = VM.combiner(this, _result, { position: [3] });

    this.constants = _result.constants;
    this.sources = _result.sources;

    return this;
  }
}

/**
 * @public A class for creating a report-like script which inherits from CombineTierGenerator
 */
export class BuildReport extends CombineTierGenerator {
  /**
   * Contructor of this class
   *
   * @param number - (optional) A number or an array of numbers represting the report at each tier,
   * if not passed, BLOCK_TIMESTAMP will be used to creat the report of each tier which would result in 
   * a dynamic report when the script is executed by combineTier contract report function
   * @param delegatedReport - (optional) Used to determine if this script is being used for combinetier contract 
   * or standalone then it will produce the result for SENDER(false) or ACCOUNT(true) i.e CONTEXT[0]
   * @param hasReportForSingleTier - (optional) Used to determine if this script needs to be combined with another
   *  script used for getting the ITIERV2_TIME_FOR_TIER, default is false
   */
  constructor(
    number?: number | number[],
    delegatedReport?: boolean,
    hasReportForSingleTier?: boolean,
    ) {
    let _result: StateConfig;

    if (number != undefined) {
      _result = {
        constants: [
          paddedUInt256(
            BigNumber.from(
              '0x' +
                paddedUInt32(
                  typeof number == 'number'
                    ? number
                    : number[7] != undefined
                    ? number[7]
                    : 0
                ) +
                paddedUInt32(
                  typeof number == 'number'
                    ? number
                    : number[6] != undefined
                    ? number[6]
                    : 0
                ) +
                paddedUInt32(
                  typeof number == 'number'
                    ? number
                    : number[5] != undefined
                    ? number[5]
                    : 0
                ) +
                paddedUInt32(
                  typeof number == 'number'
                    ? number
                    : number[4] != undefined
                    ? number[4]
                    : 0
                ) +
                paddedUInt32(
                  typeof number == 'number'
                    ? number
                    : number[3] != undefined
                    ? number[3]
                    : 0
                ) +
                paddedUInt32(
                  typeof number == 'number'
                    ? number
                    : number[2] != undefined
                    ? number[2]
                    : 0
                ) +
                paddedUInt32(
                  typeof number == 'number'
                    ? number
                    : number[1] != undefined
                    ? number[1]
                    : 0
                ) +
                paddedUInt32(
                  typeof number == 'number'
                    ? number
                    : number[0] != undefined
                    ? number[0]
                    : 0
                )
            )
          ),
        ],
        sources: [concat([op(VM.Opcodes.CONSTANT, 0)])],
      };
    } else {
      _result = {
        constants: [ethers.constants.MaxUint256],
        sources: [
          concat([
            op(VM.Opcodes.CONSTANT, 0),
            op(VM.Opcodes.BLOCK_TIMESTAMP),
            op(
              VM.Opcodes.UPDATE_TIMES_FOR_TIER_RANGE,
              tierRange(Tier.ZERO, Tier.EIGHT)
            ),
          ]),
        ],
      };
    }
    super(_result, {hasReportForSingleTier, delegatedReport});
  }
};

// /**
//  * @public
//  * class to create a the vmStateConfig for CombineTier as BalanceTier.
//  * this will perform similar to ERC20BalanceTier in RainVM version 1.0
//  * 
//  */
// export class ERC20BalanceTier extends CombineTierGenerator {

//   /**
//    * Constructor for ERC20BalanceTier vmStateConfig
//    * 
//    * @param tierValues - an array of 8 values for each tier values
//    * @param tokenAddress - the ERC20 token address
//    * @param tokenDecimals - the ERC20 token decimals
//    */
//   constructor (
//     public readonly tierValues: (number | string)[],
//     public readonly tokenAddress: string,
//     tokenDecimals: number = 18
//   ) {
//     const constants = [
//       paddedUInt256(
//         paddedUInt32(parseUnits(tierValues[7].toString(), tokenDecimals)) +
//         paddedUInt32(parseUnits(tierValues[6].toString(), tokenDecimals)) +
//         paddedUInt32(parseUnits(tierValues[5].toString(), tokenDecimals)) +
//         paddedUInt32(parseUnits(tierValues[4].toString(), tokenDecimals)) +
//         paddedUInt32(parseUnits(tierValues[3].toString(), tokenDecimals)) +
//         paddedUInt32(parseUnits(tierValues[2].toString(), tokenDecimals)) +
//         paddedUInt32(parseUnits(tierValues[1].toString(), tokenDecimals)) +
//         paddedUInt32(parseUnits(tierValues[0].toString(), tokenDecimals))
//       ),
//       tokenAddress,
//       paddedUInt256(
//         paddedUInt32('7') +
//         paddedUInt32('6') +
//         paddedUInt32('5') +
//         paddedUInt32('4') +
//         paddedUInt32('3') +
//         paddedUInt32('2') +
//         paddedUInt32('1') +
//         paddedUInt32('0')
//       ),
//       "0xffffffff",
//       "0",
//       "100000000"
//     ];
//      const sources = [
//       concat([
//         op(VM.Opcodes.CONSTANT, 0),
//         op(VM.Opcodes.CONSTANT, 2),
//         op(VM.Opcodes.ZIPMAP, callSize(1, 3, 1)),
//         op(VM.Opcodes.ADD, 8),
//       ]),
//       concat([
//         op(VM.Opcodes.CONSTANT, 1),
//         op(VM.Opcodes.CONTEXT, 0),
//         op(VM.Opcodes.IERC20_BALANCE_OF),
//         op(VM.Opcodes.CONSTANT, 6),
//         op(VM.Opcodes.LESS_THAN),
//         op(VM.Opcodes.CONSTANT, 3),
//         op(VM.Opcodes.CONSTANT, 4),
//         op(VM.Opcodes.EAGER_IF),
//         op(VM.Opcodes.CONSTANT, 5),
//         op(VM.Opcodes.CONSTANT, 7),
//         op(VM.Opcodes.EXP, 2),
//         op(VM.Opcodes.MUL, 2),
//       ])
//     ];
//     super({constants, sources}, {hasReportForSingleTier: true, delegatedReport: true});
//   }
// };

/**
 * @public
 * class to create a the vmStateConfig for CombineTier as BalanceTier.
 * this will perform similar to ERC721BalancTier in RainVM version 1.0
 * 
 */
 export class ERC721BalanceTier extends CombineTierGenerator {

  /**
   * Constructor for ERC721BalanceTier vmStateConfig
   * 
   * @param tierValues - an array of 8 values for each tier values
   * @param tokenAddress - the ERC721 token address
   */
  constructor (
    public readonly tierValues: (number | string)[],
    public readonly tokenAddress: string
  ) {
    const constants = [
      paddedUInt256(
        paddedUInt32(tierValues[7].toString()) +
        paddedUInt32(tierValues[6].toString()) +
        paddedUInt32(tierValues[5].toString()) +
        paddedUInt32(tierValues[4].toString()) +
        paddedUInt32(tierValues[3].toString()) +
        paddedUInt32(tierValues[2].toString()) +
        paddedUInt32(tierValues[1].toString()) +
        paddedUInt32(tierValues[0].toString())
      ),
      tokenAddress,
      paddedUInt256(
        paddedUInt32('7') +
        paddedUInt32('6') +
        paddedUInt32('5') +
        paddedUInt32('4') +
        paddedUInt32('3') +
        paddedUInt32('2') +
        paddedUInt32('1') +
        paddedUInt32('0')
      ),
      "0xffffffff",
      "0",
      "100000000"
    ];
     const sources = [
      concat([
        op(VM.Opcodes.CONSTANT, 0),
        op(VM.Opcodes.CONSTANT, 2),
        op(VM.Opcodes.ZIPMAP, callSize(1, 3, 1)),
        op(VM.Opcodes.ADD, 8),
      ]),
      concat([
        op(VM.Opcodes.CONSTANT, 1),
        op(VM.Opcodes.CONTEXT, 0),
        op(VM.Opcodes.IERC721_BALANCE_OF),
        op(VM.Opcodes.CONSTANT, 6),
        op(VM.Opcodes.LESS_THAN),
        op(VM.Opcodes.CONSTANT, 3),
        op(VM.Opcodes.CONSTANT, 4),
        op(VM.Opcodes.EAGER_IF),
        op(VM.Opcodes.CONSTANT, 5),
        op(VM.Opcodes.CONSTANT, 7),
        op(VM.Opcodes.EXP, 2),
        op(VM.Opcodes.MUL, 2),
      ])
    ];
    super({constants, sources}, {hasReportForSingleTier: true, delegatedReport: true});
  }
}

/**
 * @public
 * class to create a the vmStateConfig for CombineTier as BalanceTier.
 * this will perform similar to ERC1155BalancTier witha certain toke ID
 * 
 */
 export class ERC1155BalanceTier extends CombineTierGenerator {

  /**
   * Constructor for ERC1155BalanceTier vmStateConfig
   * 
   * @param tierValues - an array of 8 values for each tier values
   * @param tokenId - ID of the token
   * @param tokenAddress - the ERC1155 token address
   */
  constructor (
    public readonly tierValues: (number | string)[],
    public readonly tokenId: BigNumber,
    public readonly tokenAddress: string,
  ) {
    const constants = [
      paddedUInt256(
        paddedUInt32(tierValues[7].toString()) +
        paddedUInt32(tierValues[6].toString()) +
        paddedUInt32(tierValues[5].toString()) +
        paddedUInt32(tierValues[4].toString()) +
        paddedUInt32(tierValues[3].toString()) +
        paddedUInt32(tierValues[2].toString()) +
        paddedUInt32(tierValues[1].toString()) +
        paddedUInt32(tierValues[0].toString())
      ),
      tokenAddress,
      tokenId,
      paddedUInt256(
        paddedUInt32('7') +
        paddedUInt32('6') +
        paddedUInt32('5') +
        paddedUInt32('4') +
        paddedUInt32('3') +
        paddedUInt32('2') +
        paddedUInt32('1') +
        paddedUInt32('0')
      ),
      "0xffffffff",
      "0",
      "100000000"
    ];
     const sources = [
      concat([
        op(VM.Opcodes.CONSTANT, 0),
        op(VM.Opcodes.CONSTANT, 3),
        op(VM.Opcodes.ZIPMAP, callSize(1, 3, 1)),
        op(VM.Opcodes.ADD, 8),
      ]),
      concat([
        op(VM.Opcodes.CONSTANT, 1),
        op(VM.Opcodes.CONTEXT, 0),
        op(VM.Opcodes.CONSTANT, 2),
        op(VM.Opcodes.IERC1155_BALANCE_OF),
        op(VM.Opcodes.CONSTANT, 7),
        op(VM.Opcodes.LESS_THAN),
        op(VM.Opcodes.CONSTANT, 4),
        op(VM.Opcodes.CONSTANT, 3),
        op(VM.Opcodes.EAGER_IF),
        op(VM.Opcodes.CONSTANT, 6),
        op(VM.Opcodes.CONSTANT, 8),
        op(VM.Opcodes.EXP, 2),
        op(VM.Opcodes.MUL, 2),
      ])
    ];
    super({constants, sources}, {hasReportForSingleTier: true, delegatedReport: true});
  }
}

/**
 * @public
 * class to create a the vmStateConfig for CombineTier as BalanceTier.
 * this will perform similar to ERC20BalanceTier in RainVM version 1.0
 * 
 */
export class ERC20BalanceTier {
    // StateConfig Properties of this class
    public constants: BigNumberish[];
    public sources: BytesLike[];

  constructor (
    public readonly tierValues: (number | string)[],
    public readonly tokenAddress: string
  ) {
    this.constants = [
      tokenAddress,
      ...tierValues,
      "0",
      "0xffffffff00000000000000000000000000000000000000000000000000000000",
      "0xffffffffffffffff000000000000000000000000000000000000000000000000",
      "0xffffffffffffffffffffffff0000000000000000000000000000000000000000",
      "0xffffffffffffffffffffffffffffffff00000000000000000000000000000000",
      "0xffffffffffffffffffffffffffffffffffffffff000000000000000000000000",
      "0xffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000",
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000",
      ethers.constants.MaxUint256,
    ]
    this.sources = [
      concat([
        op(VM.Opcodes.CONSTANT, 0),
        op(VM.Opcodes.CONTEXT, 0),
        op(VM.Opcodes.IERC20_BALANCE_OF),

        op(VM.Opcodes.STACK, 0),
        op(VM.Opcodes.CONSTANT, 1),
        op(VM.Opcodes.LESS_THAN, 2),
        op(VM.Opcodes.CONSTANT, 17),

        op(VM.Opcodes.STACK, 0),
        op(VM.Opcodes.CONSTANT, 2),
        op(VM.Opcodes.LESS_THAN, 2),
        op(VM.Opcodes.CONSTANT, 16),

        op(VM.Opcodes.STACK, 0),
        op(VM.Opcodes.CONSTANT, 3),
        op(VM.Opcodes.LESS_THAN, 2),
        op(VM.Opcodes.CONSTANT, 15),

        op(VM.Opcodes.STACK, 0),
        op(VM.Opcodes.CONSTANT, 4),
        op(VM.Opcodes.LESS_THAN, 2),
        op(VM.Opcodes.CONSTANT, 14),

        op(VM.Opcodes.STACK, 0),
        op(VM.Opcodes.CONSTANT, 5),
        op(VM.Opcodes.LESS_THAN, 2),
        op(VM.Opcodes.CONSTANT, 13),

        op(VM.Opcodes.STACK, 0),
        op(VM.Opcodes.CONSTANT, 6),
        op(VM.Opcodes.LESS_THAN, 2),
        op(VM.Opcodes.CONSTANT, 12),

        op(VM.Opcodes.STACK, 0),
        op(VM.Opcodes.CONSTANT, 7),
        op(VM.Opcodes.LESS_THAN, 2),
        op(VM.Opcodes.CONSTANT, 11),

        op(VM.Opcodes.STACK, 0),
        op(VM.Opcodes.CONSTANT, 8),
        op(VM.Opcodes.LESS_THAN, 2),
        op(VM.Opcodes.CONSTANT, 10),
        op(VM.Opcodes.CONSTANT, 9),
        op(VM.Opcodes.EAGER_IF),

        op(VM.Opcodes.EAGER_IF),
        op(VM.Opcodes.EAGER_IF),
        op(VM.Opcodes.EAGER_IF),
        op(VM.Opcodes.EAGER_IF),
        op(VM.Opcodes.EAGER_IF),
        op(VM.Opcodes.EAGER_IF),
        op(VM.Opcodes.EAGER_IF),
      ]),
      concat([
        op(VM.Opcodes.CONSTANT, 17),
      ])
    ]
  }
}