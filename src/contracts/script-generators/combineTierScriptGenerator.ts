import { StateConfig, VM } from '../../classes/vm';
import { BigNumberish, BigNumber, BytesLike } from 'ethers';
import { CombineTier } from '../tiers/combineTier';
import { Tier } from '../../classes/tierContract';
import { 
  concat,
  op,
  selectLte,
  callSize,
  tierRange,
  arg,
  paddedUInt32,
  paddedUInt256,
  selectLteLogic,
  selectLteMode 
} from '../../utils';
import { CombineTierJS } from '../../RainJS/CombineTierJS';


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
  public stackLength: BigNumberish;
  public argumentsLength: BigNumberish;

  /**
   * Constructor for this class
   * 
   * @param reportVar - either a tier contract address or a StateConfig of REPROT script (or any other form of StateConfig desired)
   */
  constructor (reportVar: string | StateConfig) {
    
    if (typeof reportVar == "string") {
      this.constants = [reportVar];
      this.sources = [
        concat([
          op(CombineTier.Opcodes.VAL, 0),
          op(CombineTier.Opcodes.ACCOUNT),
          op(CombineTier.Opcodes.REPORT),
        ])
      ];
      this.stackLength = 3;
      this.argumentsLength = 0;
    }
    else {
      this.constants = reportVar.constants;
      this.sources = reportVar.sources;
      this.stackLength = reportVar.stackLength;
      this.argumentsLength = reportVar.argumentsLength;
    }
  }

  /**
   * Combines 2 tier report with selectLte with its logic and mode, and can be chained for multiple reports each with their own logic and mode
   * 
   * @param reportVar - either a tier contract address or a StateConfig of REPROT script (or any other form of StateConfig desired)
   * @param logic - selectLte logic
   * @param mode - selectLte mode
   * @param number - (optional) if passed it would be the number to compare reports against, if not passed reports will be compared against BLOCK_NUMBER
   * 
   * @returns this
   */
  public combineWith (
    reportVar: string | StateConfig,
    logic: selectLteLogic,
    mode: selectLteMode,
    number?: number
  ) : this {

    const _buttom: StateConfig = typeof reportVar == "string"
      ? new CombineTierGenerator(reportVar)
      : reportVar;

    const _combiner: StateConfig = {
      constants: number ? [number] : [],
      sources: [
        concat([
          number
            ? op(CombineTier.Opcodes.VAL, 0)
            : op(CombineTier.Opcodes.BLOCK_NUMBER),
          op(CombineTier.Opcodes.SELECT_LTE, selectLte(logic, mode, 2))
        ])
      ],
      stackLength: 2,
      argumentsLength: 0
    }

    let _result: StateConfig = VM.combiner(_buttom, _combiner);
    _result = VM.combiner(this, _result);

    this.constants = _result.constants;
    this.sources = _result.sources;
    this.stackLength = _result.stackLength;
    this.argumentsLength = _result.argumentsLength;

    return this;
  }

  /**
   * Method to update a report at given tier range (can be any range between 0 to 8)
   * 
   * @param startTier - start of the report updating range (exclusive)
   * @param endTier - end of the report updating range (inclusive)
   * @param number - (optional) if passed it would be the number to compare reports against, if not passed reports will be compared against BLOCK_NUMBER
   * 
   * @returns this
   */
  public updateReport (
    startTier: Tier,
    endTier: Tier,
    number?: number
  ) : this {

    const _updater: StateConfig = {
      constants: number ? [number] : [],
      sources: [
        concat([
          number
            ? op(CombineTier.Opcodes.VAL, 0)
            : op(CombineTier.Opcodes.BLOCK_NUMBER),
          op(
            CombineTier.Opcodes.UPDATE_BLOCKS_FOR_TIER_RANGE,
            tierRange(startTier, endTier)
          ),
        ])
      ],
      stackLength: 2,
      argumentsLength: 0
    };

    const _result: StateConfig = VM.combiner(this, _updater);

    this.constants = _result.constants;
    this.sources = _result.sources;
    this.stackLength = _result.stackLength;
    this.argumentsLength = _result.argumentsLength;

    return this
  }


  /**
   * Saturating difference between 2 reports
   * 
   * @param reportVar - either a tier contract address or a StateConfig of REPROT script (or any other form of StateConfig desired)
   * 
   * @returns this
   */
  public differenceFrom (
    reportVar: string | StateConfig,
  ) : this {

    const _buttom: StateConfig = typeof reportVar == "string"
      ? new CombineTierGenerator(reportVar)
      : reportVar;

    const _differ: StateConfig = {
      constants: [],
      sources: [
        concat([
          op(CombineTier.Opcodes.SATURATING_DIFF)
        ])
      ],
      stackLength: 1,
      argumentsLength: 0
    };

    let _result: StateConfig = VM.combiner(_buttom, _differ);
    _result = VM.combiner(this, _result);

    this.constants = _result.constants;
    this.sources = _result.sources;
    this.stackLength = _result.stackLength;
    this.argumentsLength = _result.argumentsLength;

    return this;
  }


  /**
   * Creats a holding time ALWAYS/NEVER tier script for a CombineTier contract out of a TransferTier.
   * 
   * @param numberOfBlocks - A number or an array of numbers represting the number of blocks a given tier must be held to get ALWAYS report or else it gets NEVER report.
   * @returns this
   */
  public isTierHeldFor (
    numberOfBlocks: number[],
  ) : this {

    const _shifter = paddedUInt256(
      BigNumber.from(
        "0x" +
        paddedUInt32("7") +
        paddedUInt32("6") +
        paddedUInt32("5") +
        paddedUInt32("4") +
        paddedUInt32("3") +
        paddedUInt32("2") +
        paddedUInt32("1") +
        paddedUInt32("0")
      )
    );
    
    numberOfBlocks[0] = numberOfBlocks[0] ? numberOfBlocks[0] : 0;
    numberOfBlocks[1] = numberOfBlocks[1] && numberOfBlocks[1] <= numberOfBlocks[0] ? numberOfBlocks[1] : numberOfBlocks[0];
    numberOfBlocks[2] = numberOfBlocks[2] && numberOfBlocks[2] <= numberOfBlocks[1] ? numberOfBlocks[2] : numberOfBlocks[1];
    numberOfBlocks[3] = numberOfBlocks[3] && numberOfBlocks[3] <= numberOfBlocks[2] ? numberOfBlocks[3] : numberOfBlocks[2];
    numberOfBlocks[4] = numberOfBlocks[4] && numberOfBlocks[4] <= numberOfBlocks[3] ? numberOfBlocks[4] : numberOfBlocks[3];
    numberOfBlocks[5] = numberOfBlocks[5] && numberOfBlocks[5] <= numberOfBlocks[4] ? numberOfBlocks[5] : numberOfBlocks[4];
    numberOfBlocks[6] = numberOfBlocks[6] && numberOfBlocks[6] <= numberOfBlocks[5] ? numberOfBlocks[6] : numberOfBlocks[5];
    numberOfBlocks[7] = numberOfBlocks[7] && numberOfBlocks[7] <= numberOfBlocks[6] ? numberOfBlocks[7] : numberOfBlocks[6];

    const _blocks = paddedUInt256(
      BigNumber.from(
        "0x" +
        paddedUInt32(numberOfBlocks[7]) +
        paddedUInt32(numberOfBlocks[6]) +
        paddedUInt32(numberOfBlocks[5]) +
        paddedUInt32(numberOfBlocks[4]) +
        paddedUInt32(numberOfBlocks[3]) +
        paddedUInt32(numberOfBlocks[2]) +
        paddedUInt32(numberOfBlocks[1]) +
        paddedUInt32(numberOfBlocks[0])
      )
    );
    
    this.sources[0] = concat([
      op(CombineTier.Opcodes.NEVER),
      op(CombineTier.Opcodes.BLOCK_NUMBER),
      op(CombineTier.Opcodes.UPDATE_BLOCKS_FOR_TIER_RANGE, tierRange(Tier.ZERO, Tier.EIGHT)),
      this.sources[0],
      op(CombineTier.Opcodes.SATURATING_DIFF)
    ])

    let _result: StateConfig = {
      constants: [
        _blocks,
        _shifter,
        "0x100000000",
        "0",
        "0xffffffff"
      ],
      sources: [
        concat([
          op(CombineTier.Opcodes.VAL, 0),
          op(CombineTier.Opcodes.VAL, 1),
          op(CombineTier.Opcodes.ZIPMAP, callSize(1, 3, 2)),
          op(CombineTier.Opcodes.ADD, 8)
        ]),
        concat([
          op(CombineTier.Opcodes.VAL, arg(1)),
          op(CombineTier.Opcodes.VAL, arg(0)),
          op(CombineTier.Opcodes.GREATER_THAN),
          op(CombineTier.Opcodes.VAL, 4),
          op(CombineTier.Opcodes.VAL, 3),
          op(CombineTier.Opcodes.EAGER_IF),
          op(CombineTier.Opcodes.VAL, 2),
          op(CombineTier.Opcodes.VAL, arg(2)),
          op(CombineTier.Opcodes.EXP, 2),
          op(CombineTier.Opcodes.MUL, 2),
        ])
      ],
      stackLength: 15,
      argumentsLength: 3
    };

    _result = VM.combiner(this, _result);

    this.constants = _result.constants;
    this.sources = _result.sources;
    this.stackLength = _result.stackLength;
    this.argumentsLength = _result.argumentsLength;

    return this;
  }
};


/**
 * @public A class for creating a report-like script which inherits from CombineTierGenerator
 */
export class BuildReport extends CombineTierGenerator {

  /**
   * Contructor of this class 
   * 
   * @param number - (optional) A number or an array of numbers represting the report at each tier,
   * if not passed, BLOCK_NUMBER will be used to creat the report of each tier
   */
  constructor (number?: number | number[]) {

    let _result: StateConfig;

    if (number != undefined) {
      _result = {
        constants: [
          paddedUInt256(
            BigNumber.from(
              "0x" +
              paddedUInt32(typeof number == "number" ? number : number[7] != undefined ? number[7] : 0) +
              paddedUInt32(typeof number == "number" ? number : number[6] != undefined ? number[6] : 0) +
              paddedUInt32(typeof number == "number" ? number : number[5] != undefined ? number[5] : 0) +
              paddedUInt32(typeof number == "number" ? number : number[4] != undefined ? number[4] : 0) +
              paddedUInt32(typeof number == "number" ? number : number[3] != undefined ? number[3] : 0) +
              paddedUInt32(typeof number == "number" ? number : number[2] != undefined ? number[2] : 0) +
              paddedUInt32(typeof number == "number" ? number : number[1] != undefined ? number[1] : 0) +
              paddedUInt32(typeof number == "number" ? number : number[0] != undefined ? number[0] : 0)
            )
          )
        ],
        sources: [
          concat([
            op(CombineTier.Opcodes.VAL, 0)
          ])
        ],
        stackLength: 1,
        argumentsLength: 0
      }
    }
    else {
      _result = {
        constants: [],
        sources: [
          concat([
            op(CombineTier.Opcodes.NEVER),
            op(CombineTier.Opcodes.BLOCK_NUMBER),
            op(
              CombineTier.Opcodes.UPDATE_BLOCKS_FOR_TIER_RANGE,
              tierRange(Tier.ZERO, Tier.EIGHT)
            )
          ])
        ],
        stackLength: 3,
        argumentsLength: 0
      }
    }
    super(_result);
  }
}
