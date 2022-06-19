import { ethers, BigNumberish, BigNumber, BytesLike } from 'ethers';
import { EmissionsERC20Context } from '../emissionsERC20';
import { Tier } from '../../classes/tierContract';
import { VM } from '../../classes/vm';
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
} from '../../utils';

/**
 * @public
 * A type for newing Emissions script
 */
export type EmissionsConfig = {
  tierAddress: string;
  blockTime: number;
  period: number;
  periodicRewards: {
    tier1: number;
    tier2: number;
    tier3: number;
    tier4: number;
    tier5: number;
    tier6: number;
    tier7: number;
    tier8: number;
  };
  maxPeriodicRewards?: {
    tier1: number;
    tier2: number;
    tier3: number;
    tier4: number;
    tier5: number;
    tier6: number;
    tier7: number;
    tier8: number;
  };
  numberOfIncrements?: number;
};

/**
 * @public A linear minting emissions over a period of time. holding more before claiming would result in a more reward.
 *
 */
export class LinearEmissions {
  // StateConfig Properties of this class
  public constants: BigNumberish[];
  public sources: BytesLike[];

  /**
   * Constructor for this class
   *
   * @param config - An EmissionsConfig
   */
  constructor(config: EmissionsConfig) {
    const eighteenZeros = '000000000000000000';
    const sixZeros = '000000';

    const BN_ONE = BigNumber.from('1' + eighteenZeros);

    // We're using uints, so we need to scale reward per block up to get out of the decimal places, but a precision of 18 zeros is
    // too much to fit within a uint32 (since we store block rewards per tier in a report-like format). Six zeros should be enough.
    const BN_ONE_REWARD = BigNumber.from('1' + sixZeros);
    const BLOCKS_PER_PERIOD = Math.floor(config.period / config.blockTime);

    const PERIODIC_REWARD_TIER1 = BigNumber.from(
      config.periodicRewards.tier1
    ).mul(BN_ONE_REWARD);

    const PERIODIC_REWARD_TIER2 = BigNumber.from(config.periodicRewards.tier2)
      .mul(BN_ONE_REWARD)
      .sub(PERIODIC_REWARD_TIER1);

    const PERIODIC_REWARD_TIER3 = BigNumber.from(config.periodicRewards.tier3)
      .mul(BN_ONE_REWARD)
      .sub(PERIODIC_REWARD_TIER2.add(PERIODIC_REWARD_TIER1));

    const PERIODIC_REWARD_TIER4 = BigNumber.from(config.periodicRewards.tier4)
      .mul(BN_ONE_REWARD)
      .sub(
        PERIODIC_REWARD_TIER3.add(PERIODIC_REWARD_TIER2).add(
          PERIODIC_REWARD_TIER1
        )
      );

    const PERIODIC_REWARD_TIER5 = BigNumber.from(config.periodicRewards.tier4)
      .mul(BN_ONE_REWARD)
      .sub(
        PERIODIC_REWARD_TIER4.add(PERIODIC_REWARD_TIER3)
          .add(PERIODIC_REWARD_TIER2)
          .add(PERIODIC_REWARD_TIER1)
      );

    const PERIODIC_REWARD_TIER6 = BigNumber.from(config.periodicRewards.tier4)
      .mul(BN_ONE_REWARD)
      .sub(
        PERIODIC_REWARD_TIER5.add(PERIODIC_REWARD_TIER4)
          .add(PERIODIC_REWARD_TIER3)
          .add(PERIODIC_REWARD_TIER2)
          .add(PERIODIC_REWARD_TIER1)
      );

    const PERIODIC_REWARD_TIER7 = BigNumber.from(config.periodicRewards.tier4)
      .mul(BN_ONE_REWARD)
      .sub(
        PERIODIC_REWARD_TIER6.add(PERIODIC_REWARD_TIER5)
          .add(PERIODIC_REWARD_TIER4)
          .add(PERIODIC_REWARD_TIER3)
          .add(PERIODIC_REWARD_TIER2)
          .add(PERIODIC_REWARD_TIER1)
      );

    const PERIODIC_REWARD_TIER8 = BigNumber.from(config.periodicRewards.tier4)
      .mul(BN_ONE_REWARD)
      .sub(
        PERIODIC_REWARD_TIER7.add(PERIODIC_REWARD_TIER6)
          .add(PERIODIC_REWARD_TIER5)
          .add(PERIODIC_REWARD_TIER4)
          .add(PERIODIC_REWARD_TIER3)
          .add(PERIODIC_REWARD_TIER2)
          .add(PERIODIC_REWARD_TIER1)
      );

    const REWARD_PER_BLOCK_TIER1 = PERIODIC_REWARD_TIER1.div(BLOCKS_PER_PERIOD);
    const REWARD_PER_BLOCK_TIER2 = PERIODIC_REWARD_TIER2.div(BLOCKS_PER_PERIOD);
    const REWARD_PER_BLOCK_TIER3 = PERIODIC_REWARD_TIER3.div(BLOCKS_PER_PERIOD);
    const REWARD_PER_BLOCK_TIER4 = PERIODIC_REWARD_TIER4.div(BLOCKS_PER_PERIOD);
    const REWARD_PER_BLOCK_TIER5 = PERIODIC_REWARD_TIER5.div(BLOCKS_PER_PERIOD);
    const REWARD_PER_BLOCK_TIER6 = PERIODIC_REWARD_TIER6.div(BLOCKS_PER_PERIOD);
    const REWARD_PER_BLOCK_TIER7 = PERIODIC_REWARD_TIER7.div(BLOCKS_PER_PERIOD);
    const REWARD_PER_BLOCK_TIER8 = PERIODIC_REWARD_TIER8.div(BLOCKS_PER_PERIOD);

    const BASE_REWARD_PER_TIER = paddedUInt256(
      ethers.BigNumber.from(
        '0x' +
          paddedUInt32(REWARD_PER_BLOCK_TIER8) +
          paddedUInt32(REWARD_PER_BLOCK_TIER7) +
          paddedUInt32(REWARD_PER_BLOCK_TIER6) +
          paddedUInt32(REWARD_PER_BLOCK_TIER5) +
          paddedUInt32(REWARD_PER_BLOCK_TIER4) +
          paddedUInt32(REWARD_PER_BLOCK_TIER3) +
          paddedUInt32(REWARD_PER_BLOCK_TIER2) +
          paddedUInt32(REWARD_PER_BLOCK_TIER1)
      )
    );

    // prettier-ignore
    const REWARD = () =>
      concat([
        op(VM.Opcodes.CONSTANT, 6),
        op(VM.Opcodes.CONSTANT, 7),
        op(VM.Opcodes.MUL, 2),
      ]);

    // prettier-ignore
    const PROGRESS = () =>
      concat([
        op(VM.Opcodes.CONSTANT, 4),
        op(VM.Opcodes.CONSTANT, 6),
        op(VM.Opcodes.CONSTANT, 4),
        op(VM.Opcodes.MUL, 2),
        op(VM.Opcodes.CONSTANT, 3),
        op(VM.Opcodes.DIV, 2),
        op(VM.Opcodes.MIN, 2),
      ]);

    // prettier-ignore
    const MULTIPLIER = () =>
      concat([
        PROGRESS(),
        op(VM.Opcodes.CONSTANT, 4),
        op(VM.Opcodes.ADD, 2),
      ]);

    // prettier-ignore
    const FN = () =>
      concat([
        REWARD(),
        MULTIPLIER(),
        op(VM.Opcodes.MUL, 2),
        op(VM.Opcodes.CONSTANT, 5),
        op(VM.Opcodes.DIV, 2),
      ]);

    // prettier-ignore
    const CURRENT_BLOCK_AS_REPORT = () =>
      concat([
        op(VM.Opcodes.CONSTANT, 0),
        op(VM.Opcodes.BLOCK_NUMBER),
        op(
    // TODO: @rouzwelt
    // @ts-ignore
          VM.Opcodes.UPDATE_BLOCKS_FOR_TIER_RANGE,
          tierRange(Tier.ZERO, Tier.EIGHT)
        ),
      ]);

    // prettier-ignore
    const LAST_CLAIM_REPORT = () =>
      concat([
        op(VM.Opcodes.THIS_ADDRESS),
        op(
          VM.Opcodes.CONTEXT,
          EmissionsERC20Context.ClaimantAccount
        ),
    // TODO: @rouzwelt
    // @ts-ignore
        op(VM.Opcodes.REPORT),
      ]);

    // prettier-ignore
    const TIER_REPORT = () =>
      concat([
        op(VM.Opcodes.CONSTANT, 1),
        op(
          VM.Opcodes.CONTEXT,
          EmissionsERC20Context.ClaimantAccount
        ),
              // TODO: @rouzwelt
    // @ts-ignore
        op(VM.Opcodes.REPORT),
      ]);

    // prettier-ignore
    const TIERWISE_DIFF = () =>
      concat([
        CURRENT_BLOCK_AS_REPORT(),
        TIER_REPORT(),
        LAST_CLAIM_REPORT(),
        op(VM.Opcodes.BLOCK_NUMBER),
        op(
          VM.Opcodes.SELECT_LTE, 
          selectLte(selectLteLogic.any, selectLteMode.max, 2)
        ),
        op(VM.Opcodes.SATURATING_DIFF),
      ]);

    // prettier-ignore
    const SOURCE = () =>
      concat([
        TIERWISE_DIFF(),
        op(VM.Opcodes.CONSTANT, 2),
        op(VM.Opcodes.ZIPMAP, callSize(1, 3, 1)),
        op(VM.Opcodes.ADD, 8),
      ]);

    this.constants = [
      ethers.constants.MaxUint256,
      config.tierAddress,
      BASE_REWARD_PER_TIER,
      BLOCKS_PER_PERIOD,
      BN_ONE,
      BN_ONE_REWARD,
    ];
    this.sources = [SOURCE(), FN()];
  }
}

/**
 * @public
 * A sequential minting emission, minting can only be done once in every period of time,
 * also can set a max reward with increment over the span of several periods.
 */
export class SequentialEmissions {
  // StateConfig Properties of this class
  public constants: BigNumberish[];
  public sources: BytesLike[];

  /**
   * Constructor for this class
   *
   * @param config - An EmissionsConfig
   */
  constructor(config: EmissionsConfig) {
    const eighteenZeros = '000000000000000000';
    const sixZeros = '000000';

    const BN_ONE = BigNumber.from('1' + eighteenZeros);

    // We're using uints, so we need to scale reward per block up to get out of the decimal places, but a precision of 18 zeros is
    // too much to fit within a uint32 (since we store block rewards per tier in a report-like format). Six zeros should be enough.
    const BN_ONE_REWARD = BigNumber.from('1' + sixZeros);
    const BLOCKS_PER_PERIOD = Math.floor(config.period / config.blockTime);

    const PERIODIC_REWARD_TIER1 = BigNumber.from(
      config.periodicRewards.tier1
    ).mul(BN_ONE_REWARD);

    const PERIODIC_REWARD_TIER2 = BigNumber.from(config.periodicRewards.tier2)
      .mul(BN_ONE_REWARD)
      .sub(PERIODIC_REWARD_TIER1);

    const PERIODIC_REWARD_TIER3 = BigNumber.from(config.periodicRewards.tier3)
      .mul(BN_ONE_REWARD)
      .sub(PERIODIC_REWARD_TIER2.add(PERIODIC_REWARD_TIER1));

    const PERIODIC_REWARD_TIER4 = BigNumber.from(config.periodicRewards.tier4)
      .mul(BN_ONE_REWARD)
      .sub(
        PERIODIC_REWARD_TIER3.add(PERIODIC_REWARD_TIER2).add(
          PERIODIC_REWARD_TIER1
        )
      );

    const PERIODIC_REWARD_TIER5 = BigNumber.from(config.periodicRewards.tier4)
      .mul(BN_ONE_REWARD)
      .sub(
        PERIODIC_REWARD_TIER4.add(PERIODIC_REWARD_TIER3)
          .add(PERIODIC_REWARD_TIER2)
          .add(PERIODIC_REWARD_TIER1)
      );

    const PERIODIC_REWARD_TIER6 = BigNumber.from(config.periodicRewards.tier4)
      .mul(BN_ONE_REWARD)
      .sub(
        PERIODIC_REWARD_TIER5.add(PERIODIC_REWARD_TIER4)
          .add(PERIODIC_REWARD_TIER3)
          .add(PERIODIC_REWARD_TIER2)
          .add(PERIODIC_REWARD_TIER1)
      );

    const PERIODIC_REWARD_TIER7 = BigNumber.from(config.periodicRewards.tier4)
      .mul(BN_ONE_REWARD)
      .sub(
        PERIODIC_REWARD_TIER6.add(PERIODIC_REWARD_TIER5)
          .add(PERIODIC_REWARD_TIER4)
          .add(PERIODIC_REWARD_TIER3)
          .add(PERIODIC_REWARD_TIER2)
          .add(PERIODIC_REWARD_TIER1)
      );

    const PERIODIC_REWARD_TIER8 = BigNumber.from(config.periodicRewards.tier4)
      .mul(BN_ONE_REWARD)
      .sub(
        PERIODIC_REWARD_TIER7.add(PERIODIC_REWARD_TIER6)
          .add(PERIODIC_REWARD_TIER5)
          .add(PERIODIC_REWARD_TIER4)
          .add(PERIODIC_REWARD_TIER3)
          .add(PERIODIC_REWARD_TIER2)
          .add(PERIODIC_REWARD_TIER1)
      );

    const PERIODIC_REWARD_PER_TIER = paddedUInt256(
      ethers.BigNumber.from(
        '0x' +
          paddedUInt32(PERIODIC_REWARD_TIER8) +
          paddedUInt32(PERIODIC_REWARD_TIER7) +
          paddedUInt32(PERIODIC_REWARD_TIER6) +
          paddedUInt32(PERIODIC_REWARD_TIER5) +
          paddedUInt32(PERIODIC_REWARD_TIER4) +
          paddedUInt32(PERIODIC_REWARD_TIER3) +
          paddedUInt32(PERIODIC_REWARD_TIER2) +
          paddedUInt32(PERIODIC_REWARD_TIER1)
      )
    );

    const PERIODIC_MAX_TIER1 = config.maxPeriodicRewards
      ? BigNumber.from(
          config.maxPeriodicRewards.tier1 - config.periodicRewards.tier1
        ).mul(BN_ONE_REWARD)
      : ethers.constants.Zero;

    const PERIODIC_MAX_TIER2 = config.maxPeriodicRewards
      ? BigNumber.from(
          config.maxPeriodicRewards.tier2 - config.periodicRewards.tier2
        )
          .mul(BN_ONE_REWARD)
          .sub(PERIODIC_MAX_TIER1)
      : ethers.constants.Zero;

    const PERIODIC_MAX_TIER3 = config.maxPeriodicRewards
      ? BigNumber.from(
          config.maxPeriodicRewards.tier3 - config.periodicRewards.tier3
        )
          .mul(BN_ONE_REWARD)
          .sub(PERIODIC_MAX_TIER2.add(PERIODIC_MAX_TIER1))
      : ethers.constants.Zero;

    const PERIODIC_MAX_TIER4 = config.maxPeriodicRewards
      ? BigNumber.from(
          config.maxPeriodicRewards.tier4 - config.periodicRewards.tier4
        )
          .mul(BN_ONE_REWARD)
          .sub(
            PERIODIC_MAX_TIER3.add(PERIODIC_MAX_TIER2).add(PERIODIC_MAX_TIER1)
          )
      : ethers.constants.Zero;

    const PERIODIC_MAX_TIER5 = config.maxPeriodicRewards
      ? BigNumber.from(
          config.maxPeriodicRewards.tier5 - config.periodicRewards.tier5
        )
          .mul(BN_ONE_REWARD)
          .sub(
            PERIODIC_MAX_TIER4.add(PERIODIC_MAX_TIER3)
              .add(PERIODIC_MAX_TIER2)
              .add(PERIODIC_MAX_TIER1)
          )
      : ethers.constants.Zero;

    const PERIODIC_MAX_TIER6 = config.maxPeriodicRewards
      ? BigNumber.from(
          config.maxPeriodicRewards.tier6 - config.periodicRewards.tier6
        )
          .mul(BN_ONE_REWARD)
          .sub(
            PERIODIC_MAX_TIER5.add(PERIODIC_MAX_TIER4)
              .add(PERIODIC_MAX_TIER3)
              .add(PERIODIC_MAX_TIER2)
              .add(PERIODIC_MAX_TIER1)
          )
      : ethers.constants.Zero;

    const PERIODIC_MAX_TIER7 = config.maxPeriodicRewards
      ? BigNumber.from(
          config.maxPeriodicRewards.tier7 - config.periodicRewards.tier7
        )
          .mul(BN_ONE_REWARD)
          .sub(
            PERIODIC_MAX_TIER6.add(PERIODIC_MAX_TIER5)
              .add(PERIODIC_MAX_TIER4)
              .add(PERIODIC_MAX_TIER3)
              .add(PERIODIC_MAX_TIER2)
              .add(PERIODIC_MAX_TIER1)
          )
      : ethers.constants.Zero;

    const PERIODIC_MAX_TIER8 = config.maxPeriodicRewards
      ? BigNumber.from(
          config.maxPeriodicRewards.tier8 - config.periodicRewards.tier8
        )
          .mul(BN_ONE_REWARD)
          .sub(
            PERIODIC_MAX_TIER7.add(PERIODIC_MAX_TIER6)
              .add(PERIODIC_MAX_TIER5)
              .add(PERIODIC_MAX_TIER4)
              .add(PERIODIC_MAX_TIER3)
              .add(PERIODIC_MAX_TIER2)
              .add(PERIODIC_MAX_TIER1)
          )
      : ethers.constants.Zero;

    const PERIODIC_INC_TIER1 = PERIODIC_MAX_TIER1.div(
      config.numberOfIncrements ? config.numberOfIncrements - 1 : 1
    );
    const PERIODIC_INC_TIER2 = PERIODIC_MAX_TIER2.div(
      config.numberOfIncrements ? config.numberOfIncrements - 1 : 1
    );
    const PERIODIC_INC_TIER3 = PERIODIC_MAX_TIER3.div(
      config.numberOfIncrements ? config.numberOfIncrements - 1 : 1
    );
    const PERIODIC_INC_TIER4 = PERIODIC_MAX_TIER4.div(
      config.numberOfIncrements ? config.numberOfIncrements - 1 : 1
    );
    const PERIODIC_INC_TIER5 = PERIODIC_MAX_TIER5.div(
      config.numberOfIncrements ? config.numberOfIncrements - 1 : 1
    );
    const PERIODIC_INC_TIER6 = PERIODIC_MAX_TIER6.div(
      config.numberOfIncrements ? config.numberOfIncrements - 1 : 1
    );
    const PERIODIC_INC_TIER7 = PERIODIC_MAX_TIER7.div(
      config.numberOfIncrements ? config.numberOfIncrements - 1 : 1
    );
    const PERIODIC_INC_TIER8 = PERIODIC_MAX_TIER8.div(
      config.numberOfIncrements ? config.numberOfIncrements - 1 : 1
    );

    const PERIODIC_INC_PER_TIER = paddedUInt256(
      ethers.BigNumber.from(
        '0x' +
          paddedUInt32(PERIODIC_INC_TIER8) +
          paddedUInt32(PERIODIC_INC_TIER7) +
          paddedUInt32(PERIODIC_INC_TIER6) +
          paddedUInt32(PERIODIC_INC_TIER5) +
          paddedUInt32(PERIODIC_INC_TIER4) +
          paddedUInt32(PERIODIC_INC_TIER3) +
          paddedUInt32(PERIODIC_INC_TIER2) +
          paddedUInt32(PERIODIC_INC_TIER1)
      )
    );

    this.constants = [
      ethers.constants.MaxUint256,
      config.tierAddress,
      PERIODIC_REWARD_PER_TIER,
      PERIODIC_INC_PER_TIER,
      BLOCKS_PER_PERIOD,
      BN_ONE,
      BN_ONE_REWARD,
      config.numberOfIncrements ? config.numberOfIncrements : 0,
      1,
      '10',
      2,
    ];

    this.sources = [
      concat([
        op(VM.Opcodes.CONSTANT, 0),
        op(VM.Opcodes.BLOCK_NUMBER),
        op(
          // TODO: @rouzwelt
          // @ts-ignore
          VM.Opcodes.UPDATE_BLOCKS_FOR_TIER_RANGE,
          tierRange(Tier.ZERO, Tier.EIGHT)
        ),
        op(VM.Opcodes.CONSTANT, 1),
        op(VM.Opcodes.CONTEXT, EmissionsERC20Context.ClaimantAccount),
        // TODO: @rouzwelt
        // @ts-ignore
        op(VM.Opcodes.REPORT),
        op(VM.Opcodes.SATURATING_DIFF),
        op(VM.Opcodes.THIS_ADDRESS),
        op(VM.Opcodes.CONTEXT, EmissionsERC20Context.ClaimantAccount),
        // TODO: @rouzwelt
        // @ts-ignore
        op(VM.Opcodes.REPORT),
        op(VM.Opcodes.CONSTANT, 1),
        op(VM.Opcodes.CONTEXT, EmissionsERC20Context.ClaimantAccount),
        // TODO: @rouzwelt
        // @ts-ignore
        op(VM.Opcodes.REPORT),
        op(VM.Opcodes.SATURATING_DIFF),
        op(VM.Opcodes.CONSTANT, 2),
        op(VM.Opcodes.CONSTANT, 3),
        op(VM.Opcodes.ZIPMAP, callSize(1, 3, 3)),
        op(VM.Opcodes.ADD, 8),
        op(VM.Opcodes.CONSTANT, 5),
        op(VM.Opcodes.MUL, 2),
        op(VM.Opcodes.CONSTANT, 6),
        op(VM.Opcodes.DIV, 2),
      ]),
      concat([
        op(VM.Opcodes.CONSTANT, 11),
        op(VM.Opcodes.CONSTANT, 4),
        op(VM.Opcodes.DIV, 2),
        op(VM.Opcodes.CONSTANT, 7),
        op(VM.Opcodes.GREATER_THAN),
        op(VM.Opcodes.CONSTANT, 7),
        op(VM.Opcodes.CONSTANT, 12),
        op(VM.Opcodes.CONSTANT, 4),
        op(VM.Opcodes.DIV, 2),
        op(VM.Opcodes.SATURATING_SUB, 2),
        op(VM.Opcodes.CONSTANT, 12),
        op(VM.Opcodes.CONSTANT, 4),
        op(VM.Opcodes.DIV, 2),
        op(VM.Opcodes.CONSTANT, 7),
        op(VM.Opcodes.CONSTANT, 8),
        op(VM.Opcodes.SATURATING_SUB, 2),
        op(VM.Opcodes.ADD, 2),
        op(VM.Opcodes.CONSTANT, 9),
        op(VM.Opcodes.MUL, 2),
        op(VM.Opcodes.CONSTANT, 10),
        op(VM.Opcodes.DIV, 2),
        op(VM.Opcodes.MUL, 2),
        op(VM.Opcodes.CONSTANT, 9),
        op(VM.Opcodes.DIV, 2),
        op(VM.Opcodes.CONSTANT, 11),
        op(VM.Opcodes.CONSTANT, 4),
        op(VM.Opcodes.DIV, 2),
        op(VM.Opcodes.CONSTANT, 12),
        op(VM.Opcodes.CONSTANT, 4),
        op(VM.Opcodes.DIV, 2),
        op(VM.Opcodes.SATURATING_SUB, 2),
        op(VM.Opcodes.CONSTANT, 7),
        op(VM.Opcodes.CONSTANT, 12),
        op(VM.Opcodes.CONSTANT, 4),
        op(VM.Opcodes.DIV, 2),
        op(VM.Opcodes.SATURATING_SUB, 2),
        op(VM.Opcodes.SATURATING_SUB, 2),
        op(VM.Opcodes.CONSTANT, 7),
        op(VM.Opcodes.CONSTANT, 8),
        op(VM.Opcodes.SATURATING_SUB, 2),
        op(VM.Opcodes.MUL, 2),
        op(VM.Opcodes.ADD, 2),
        op(VM.Opcodes.CONSTANT, 13),
        op(VM.Opcodes.MUL, 2),
        op(VM.Opcodes.CONSTANT, 11),
        op(VM.Opcodes.CONSTANT, 4),
        op(VM.Opcodes.DIV, 2),
        op(VM.Opcodes.CONSTANT, 12),
        op(VM.Opcodes.CONSTANT, 4),
        op(VM.Opcodes.DIV, 2),
        op(VM.Opcodes.SATURATING_SUB, 2),
        op(VM.Opcodes.CONSTANT, 11),
        op(VM.Opcodes.CONSTANT, 4),
        op(VM.Opcodes.DIV, 2),
        op(VM.Opcodes.CONSTANT, 8),
        op(VM.Opcodes.SATURATING_SUB, 2),
        op(VM.Opcodes.CONSTANT, 12),
        op(VM.Opcodes.CONSTANT, 4),
        op(VM.Opcodes.DIV, 2),
        op(VM.Opcodes.ADD, 2),
        op(VM.Opcodes.CONSTANT, 9),
        op(VM.Opcodes.MUL, 2),
        op(VM.Opcodes.CONSTANT, 10),
        op(VM.Opcodes.DIV, 2),
        op(VM.Opcodes.MUL, 2),
        op(VM.Opcodes.CONSTANT, 9),
        op(VM.Opcodes.DIV, 2),
        op(VM.Opcodes.CONSTANT, 13),
        op(VM.Opcodes.MUL, 2),
        op(VM.Opcodes.EAGER_IF),
        op(VM.Opcodes.CONSTANT, 14),
        op(VM.Opcodes.CONSTANT, 11),
        op(VM.Opcodes.CONSTANT, 4),
        op(VM.Opcodes.DIV, 2),
        op(VM.Opcodes.CONSTANT, 12),
        op(VM.Opcodes.CONSTANT, 4),
        op(VM.Opcodes.DIV, 2),
        op(VM.Opcodes.SATURATING_SUB, 2),
        op(VM.Opcodes.MUL, 2),
        op(VM.Opcodes.ADD, 2),
      ]),
    ];
  }
}
