import { StateConfig, VM } from '../../classes/vm';
import { BigNumberish, BigNumber, BytesLike, ethers } from 'ethers';
import { CombineTierContext } from '../tiers/combineTier';
import { Tier } from '../../classes/tierContract';
import {
  concat,
  op,
  selectLte,
  callSize,
  tierRange,
  paddedUInt32,
  paddedUInt256,
  selectLteLogic,
  selectLteMode,
  parseUnits,
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
   */
  constructor(reporter: string | StateConfig) {
    if (typeof reporter == 'string') {
      this.constants = [reporter];
      this.sources = [
        concat([
          op(VM.Opcodes.CONSTANT, 0),
          op(VM.Opcodes.CONTEXT, CombineTierContext.Account),
          op(VM.Opcodes.ITIERV2_REPORT),
        ]),
      ];
    } else {
      this.constants = reporter.constants;
      this.sources = reporter.sources;
    }
  }

  /**
   * Combines 2 tier report with selectLte with its logic and mode, and can be chained for multiple reports each with their own logic and mode
   *
   * @param reporter - either a tier contract address or a StateConfig of REPROT script (or any other form of StateConfig desired)
   * @param logic - selectLte logic
   * @param mode - selectLte mode
   * @param number - (optional) if passed it would be the number to compare reports against, if not passed reports will be compared against BLOCK_TIMESTAMP
   *
   * @returns this
   */
  public combineWith(
    reporter: string | StateConfig,
    logic: selectLteLogic,
    mode: selectLteMode,
    number?: number
  ): CombineTierGenerator {
    const _buttom: StateConfig =
      typeof reporter == 'string'
        ? new CombineTierGenerator(reporter)
        : reporter;

    const _combiner: StateConfig = {
      constants: number ? [number] : [],
      sources: [
        concat([
          number ? op(VM.Opcodes.CONSTANT, 0) : op(VM.Opcodes.BLOCK_TIMESTAMP),
          op(VM.Opcodes.SELECT_LTE, selectLte(logic, mode, 2)),
        ]),
      ],
    };

    let _result: StateConfig = VM.combiner(_buttom, _combiner);
    _result = VM.combiner(this, _result);

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
   * @returns this
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
   *
   * @returns this
   */
  public differenceFrom(reporter: string | StateConfig): this {
    const _buttom: StateConfig =
      typeof reporter == 'string'
        ? new CombineTierGenerator(reporter)
        : reporter;

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
   * Creats a holding time ALWAYS/NEVER tier script for a CombineTier contract out of a TransferTier.
   *
   * @param reporter - either a TransferTier contract address or a StateConfig of TransferTier REPORT script (or can be any other form of StateConfig desired)
   * @param numberOfBlocks - A number or an array of numbers represting the number of blocks a given tier must be held to get ALWAYS report or else it gets NEVER report.
   *
   * @returns this
   */
  public isTierHeldFor(
    reporter: string | StateConfig,
    numberOfBlocks: number | number[],
    thresholds?: (number | string)[],
    tokenDecimals: number = 18
  ): CombineTierGenerator {
    let stakeContext: StateConfig = {
      constants: [],
      sources: []
    };
    if (thresholds && thresholds.length > 0) {
      for (let i = 0; i < thresholds.length; i++) {
        stakeContext.constants.push(
          parseUnits(thresholds[i].toString(), tokenDecimals)
        );
        stakeContext.sources.push(
          concat([
            op(VM.Opcodes.CONSTANT, i)
          ])
        );
      }
      stakeContext.sources = [
        concat([
          ...stakeContext.sources
        ])
      ];
    }

    const _report: StateConfig =
      typeof reporter == 'string'
        ? stakeContext.constants.length > 0 
          ? VM.combiner(new CombineTierGenerator(reporter), stakeContext, {position: [2]}) 
          : new CombineTierGenerator(reporter)
        : reporter;

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

    const _blocks = paddedUInt256(
      BigNumber.from(
        '0x' +
          paddedUInt32(
            typeof numberOfBlocks == 'number'
              ? numberOfBlocks
              : numberOfBlocks[7]
          ) +
          paddedUInt32(
            typeof numberOfBlocks == 'number'
              ? numberOfBlocks
              : numberOfBlocks[6]
          ) +
          paddedUInt32(
            typeof numberOfBlocks == 'number'
              ? numberOfBlocks
              : numberOfBlocks[5]
          ) +
          paddedUInt32(
            typeof numberOfBlocks == 'number'
              ? numberOfBlocks
              : numberOfBlocks[4]
          ) +
          paddedUInt32(
            typeof numberOfBlocks == 'number'
              ? numberOfBlocks
              : numberOfBlocks[3]
          ) +
          paddedUInt32(
            typeof numberOfBlocks == 'number'
              ? numberOfBlocks
              : numberOfBlocks[2]
          ) +
          paddedUInt32(
            typeof numberOfBlocks == 'number'
              ? numberOfBlocks
              : numberOfBlocks[1]
          ) +
          paddedUInt32(
            typeof numberOfBlocks == 'number'
              ? numberOfBlocks
              : numberOfBlocks[0]
          )
      )
    );

    let _result: StateConfig = {
      constants: [_blocks, _shifter, '100000000', '0', '0xffffffff'],
      sources: [
        concat([
          op(VM.Opcodes.CONSTANT, 0),
          op(VM.Opcodes.CONSTANT, 1),
          op(VM.Opcodes.ZIPMAP, callSize(1, 3, 2)),
          op(VM.Opcodes.ADD, 8),
        ]),
        concat([
          op(VM.Opcodes.BLOCK_TIMESTAMP),
          op(VM.Opcodes.CONSTANT, 5),
          op(VM.Opcodes.SATURATING_SUB, 2),
          op(VM.Opcodes.CONSTANT, 6),
          op(VM.Opcodes.LESS_THAN),
          op(VM.Opcodes.CONSTANT, 4),
          op(VM.Opcodes.CONSTANT, 3),
          op(VM.Opcodes.EAGER_IF),
          op(VM.Opcodes.CONSTANT, 2),
          op(VM.Opcodes.CONSTANT, 7),
          op(VM.Opcodes.EXP, 2),
          op(VM.Opcodes.MUL, 2),
        ]),
      ],
    };

    _result = VM.combiner(_report, _result);

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
   * if not passed, BLOCK_TIMESTAMP will be used to creat the report of each tier
   */
  constructor(number?: number | number[]) {
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
    super(_result);
  }
};

/**
 * @public
 * class to create a the vmStateConfig for CombineTier as BalanceTier.
 * this will perform similar to ERC20BalancTier in RainVM version 1.0
 * 
 */
export class ERC20BalanceTier extends CombineTierGenerator {

  /**
   * Constructor for ERC20BalanceTier vmStateConfig
   * 
   * @param tierValues - an array of 8 values for each tier values
   * @param tokenAddress - the ERC20 token address
   * @param tokenDecimals - the ERC20 token decimals
   */
  constructor (
    public readonly tierValues: (number | string)[],
    public readonly tokenAddress: string,
    tokenDecimals: number = 18
  ) {
    const constants = [
      paddedUInt256(
        paddedUInt32(parseUnits(tierValues[7].toString(), tokenDecimals)) +
        paddedUInt32(parseUnits(tierValues[6].toString(), tokenDecimals)) +
        paddedUInt32(parseUnits(tierValues[5].toString(), tokenDecimals)) +
        paddedUInt32(parseUnits(tierValues[4].toString(), tokenDecimals)) +
        paddedUInt32(parseUnits(tierValues[3].toString(), tokenDecimals)) +
        paddedUInt32(parseUnits(tierValues[2].toString(), tokenDecimals)) +
        paddedUInt32(parseUnits(tierValues[1].toString(), tokenDecimals)) +
        paddedUInt32(parseUnits(tierValues[0].toString(), tokenDecimals))
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
        op(VM.Opcodes.IERC20_BALANCE_OF),
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
    super({constants, sources});
  }
};

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
    super({constants, sources});
  }
}
