import { ethers, BigNumberish, BigNumber, BytesLike } from 'ethers';
import { Sale } from '../sale';
import { StateConfig, VM } from '../../classes/vm';
import { parseUnits, concat, op } from '../../utils';

/**
 * @public
 * Standard cap per wallet modes
 */
export enum WalletCapMode {
  min,
  max,
  both,
}

/**
 * @public - PriceCurve is an class that all the other sale types (sub-classes) will inherit from.
 *
 * @remarks - It holds all the global methods for generating a sale script with different features for a sale
 * such as tier discount which makes depolying a new sale contracts with different features easy.
 *
 * @remarks - the order of calling the methods of this class is important, meaning in order to get the
 * desired result for the sale, mthods should be called in correct order, although it is worth saying
 * that even if the order is not followed, the result will still be reliable if that is been done by intention.
 * For example if we call 'applyExtraTime' method after the the 'applyTierDiscount' method, the extra
 * time discount will be applied to the result of 'applyTierDiscount' and if before that, it will be vice versa.
 * The general order for calling these methods is:
 *    1.applyExtraTimeDiscount
 *    2.applyTierDiscount
 *    3.applyWalletCap
 *
 */
export class PriceCurve {
  // StateConfig Properties of this class
  public constants: BigNumberish[];
  public sources: BytesLike[];
  public stackLength: BigNumberish;
  public argumentsLength: BigNumberish;

  /**
   * Constructor of PriceCurve class.
   *
   * @param stateConfig - A StatecConfig
   */
  constructor(stateConfig: StateConfig) {
    this.constants = stateConfig.constants;
    this.sources = stateConfig.sources;
    this.stackLength = stateConfig.stackLength;
    this.argumentsLength = stateConfig.argumentsLength;
  }

  /**
   * Method to apply extra time discount to the sale. if sale's continues into extra time
   * then those addresses that have met the critera of extra time discount which is already
   * purchased a certain amount of rTKN will get some discount on price for their next purchase.
   *
   * @remarks - Sale should have extra time feature in order for extra time discount to be effective.
   * @see SaleDuration.applyExtraTime - to deploy a sale that has extra time feature
   *
   * @param endTimestamp - Usual end time of the sale.
   * @param extraTimeDiscountThreshold - the criteria for extra time discount, if the address has already
   * purchased more than this amount then it will recieve the discount for its next purchases once the sale
   * is gone into extra time.
   * @param extraTimeDiscount - The amount of discount the address will receive.
   *
   * @returns this
   *
   */
  public applyExtraTimeDiscount(
    endTimestamp: number,
    extraTimeDiscountThreshold: number,
    extraTimeDiscount: number
  ): this {
    const EXTRA_TIME_DISCOUNT = (i: number) =>
      concat([
        op(Sale.Opcodes.VAL, i - 4),
        op(Sale.Opcodes.BLOCK_TIMESTAMP),
        op(Sale.Opcodes.GREATER_THAN),
        op(Sale.Opcodes.VAL, i - 3),
        op(Sale.Opcodes.TOKEN_ADDRESS),
        op(Sale.Opcodes.SENDER),
        op(Sale.Opcodes.IERC20_BALANCE_OF),
        op(Sale.Opcodes.GREATER_THAN),
        op(Sale.Opcodes.ANY, 2),
      ]);

    const DISCOUNT_CONDITION_SOURCES = (i: number) =>
      concat([
        op(Sale.Opcodes.VAL, i - 2),
        op(Sale.Opcodes.MUL, 2),
        op(Sale.Opcodes.VAL, i - 1),
        op(Sale.Opcodes.DIV, 2),
        op(Sale.Opcodes.EAGER_IF),
      ]);

    this.constants.push(
      endTimestamp,
      parseUnits(extraTimeDiscountThreshold.toString()),
      100 - extraTimeDiscount,
      100
    );

    this.sources[0] = concat([
      EXTRA_TIME_DISCOUNT(this.constants.length),
      this.sources[0],
      op(Sale.Opcodes.DUP, 1),
      DISCOUNT_CONDITION_SOURCES(this.constants.length),
    ]);

    this.stackLength = Number(this.stackLength) + 20;

    return this;
  }

  /**
   * Method to apply tiers' discounts to the sale. Tiered addresses will get discount based on the tier they hold.
   *
   * @param tierAddress - The Tier contract address.
   * @param tierDiscount - An array of each tiers' discount ranging between 0 - 99.
   * @param tierActivation - (optional) An array of number of blocks for each tier that will be the required period of time for that tiered
   * address to hold the tier's in order to be eligible for that tier's discount.
   *
   * @returns this
   *
   */
  public applyTierDiscount(
    tierAddress: string,
    tierDiscount: number[],
    tierActivation?: (number | string)[]
  ): this {
    const stateConfig = VM.toTierDiscounter(
      this,
      tierAddress,
      tierDiscount,
      { tierActivation }
    );
    this.constants = stateConfig.constants;
    this.sources = stateConfig.sources;
    this.stackLength = stateConfig.stackLength;
    this.argumentsLength = stateConfig.argumentsLength;

    return this;
  }

  /**
   * Method to apply cap per wallet to the sale. addresses can only buy that certain amount of rTKNs.
   * With the option of applying multiplier for max cap per wallet.
   *
   * @param mode - The mode that determines if there is max or min cap per wallet or both.
   * @param options - (optional) Additional arguments to configure the cap per wallet behaviour:
   *    - (param) minWalletCap - The number for min cap per wallet, addresses cannot buy less number of rTKNs than this amount.
   *    - (param) maxWalletCap - The number for max cap per wallet, addresses cannot buy more number of rTKNs than this amount.
   *    - (param) tierMultiplierMode - Set true in order to apply Multiplier for max cap per wallet.
   *    - (param) tierAddress - The Tier contract address for tiers' max cap per wallet multiplier.
   *    - (param) tierMultiplier - An array of each tiers' Multiplier value.
   *    - (param) tierActivation - An array of number of blocks for each tier that will be the required period of time for that tiered
   *       address to hold the tier's in order to be eligible for that tier's multiplier.
   *
   * @returns this
   *
   */
  public applyWalletCap(
    mode: WalletCapMode,
    options?: {
      minWalletCap?: number;
      maxWalletCap?: number;
      tierMultiplierMode?: boolean;
      tierAddress?: string;
      tierMultiplier?: number[];
      tierActivation?: (number | string)[];
    }
  ): this {
    const MIN_CAP_SOURCES = (i: number) =>
      concat([
        op(Sale.Opcodes.VAL, i),
        op(Sale.Opcodes.CURRENT_BUY_UNITS),
        op(Sale.Opcodes.TOKEN_ADDRESS),
        op(Sale.Opcodes.SENDER),
        op(Sale.Opcodes.IERC20_BALANCE_OF),
        op(Sale.Opcodes.ADD, 2),
        op(Sale.Opcodes.LESS_THAN),
      ]);
    const MAX_CAP_SOURCES = () =>
      concat([
        op(Sale.Opcodes.CURRENT_BUY_UNITS),
        op(Sale.Opcodes.TOKEN_ADDRESS),
        op(Sale.Opcodes.SENDER),
        op(Sale.Opcodes.IERC20_BALANCE_OF),
        op(Sale.Opcodes.ADD, 2),
        op(Sale.Opcodes.GREATER_THAN),
      ]);

    if (mode == WalletCapMode.min && options?.minWalletCap) {
      this.constants.push(
        parseUnits(options.minWalletCap.toString()).sub(1),
        ethers.constants.MaxUint256
      );
      this.sources[0] = concat([
        this.sources[0],
        MIN_CAP_SOURCES(this.constants.length - 2),
        op(Sale.Opcodes.DUP, 0),
        op(Sale.Opcodes.VAL, this.constants.length - 1),
        op(Sale.Opcodes.EAGER_IF),
      ]);
      this.stackLength = Number(this.stackLength) + 15;

      return this;
    } else if (mode == WalletCapMode.max && options?.maxWalletCap) {
      if (
        options.tierMultiplierMode &&
        options.tierAddress &&
        options.tierMultiplier
      ) {
        let maxCapConfig: StateConfig = {
          constants: [parseUnits(options.maxWalletCap.toString())],
          sources: [concat([op(Sale.Opcodes.VAL, 0)])],
          stackLength: 1,
          argumentsLength: 0,
        };
        maxCapConfig = VM.toTierMultiplier(
          maxCapConfig,
          options.tierAddress,
          options.tierMultiplier,
          { tierActivation: options.tierActivation }
        );
        maxCapConfig.constants.push(1, ethers.constants.MaxUint256);
        maxCapConfig.sources[0] = concat([
          maxCapConfig.sources[0],
          op(Sale.Opcodes.VAL, maxCapConfig.constants.length - 2),
          op(Sale.Opcodes.ADD, 2),
          MAX_CAP_SOURCES(),
          op(Sale.Opcodes.DUP, 0),
          op(Sale.Opcodes.VAL, maxCapConfig.constants.length - 1),
          op(Sale.Opcodes.EAGER_IF),
        ]);
        const stateConfig = VM.combiner(this, maxCapConfig);
        this.constants = stateConfig.constants;
        this.sources = stateConfig.sources;
        this.stackLength = stateConfig.stackLength;
        this.argumentsLength = stateConfig.argumentsLength;

        return this;
      } else {
        this.constants.push(
          parseUnits(options.maxWalletCap.toString()).add(1),
          ethers.constants.MaxUint256
        );
        this.sources[0] = concat([
          this.sources[0],
          op(Sale.Opcodes.VAL, this.constants.length - 2),
          MAX_CAP_SOURCES(),
          op(Sale.Opcodes.VAL, this.constants.length - 1),
          op(Sale.Opcodes.EAGER_IF),
        ]);
        this.stackLength = Number(this.stackLength) + 10;

        return this;
      }
    } else if (
      mode == WalletCapMode.both &&
      options?.minWalletCap &&
      options?.maxWalletCap
    ) {
      if (
        options.tierMultiplierMode &&
        options.tierAddress &&
        options.tierMultiplier
      ) {
        let bothCapConfig: StateConfig = {
          constants: [parseUnits(options.maxWalletCap.toString())],
          sources: [concat([op(Sale.Opcodes.VAL, 0)])],
          stackLength: 1,
          argumentsLength: 0,
        };
        bothCapConfig = VM.toTierMultiplier(
          bothCapConfig,
          options.tierAddress,
          options.tierMultiplier,
          { tierActivation: options.tierActivation }
        );
        bothCapConfig.constants.push(
          1,
          parseUnits(options.minWalletCap.toString()).sub(1),
          ethers.constants.MaxUint256
        );
        bothCapConfig.sources[0] = concat([
          bothCapConfig.sources[0],
          op(Sale.Opcodes.VAL, bothCapConfig.constants.length - 3),
          op(Sale.Opcodes.ADD, 2),
          MAX_CAP_SOURCES(),
          MIN_CAP_SOURCES(bothCapConfig.constants.length - 2),
          op(Sale.Opcodes.EVERY, 2),
          op(Sale.Opcodes.DUP, 0),
          op(Sale.Opcodes.VAL, bothCapConfig.constants.length - 1),
          op(Sale.Opcodes.EAGER_IF),
        ]);
        const stateConfig = VM.combiner(this, bothCapConfig);
        this.constants = stateConfig.constants;
        this.sources = stateConfig.sources;
        this.stackLength = stateConfig.stackLength;
        this.argumentsLength = stateConfig.argumentsLength;

        return this;
      } else {
        this.constants.push(
          parseUnits(options.maxWalletCap.toString()).add(1),
          parseUnits(options.minWalletCap.toString()).sub(1),
          ethers.constants.MaxUint256
        );
        this.sources[0] = concat([
          this.sources[0],
          op(Sale.Opcodes.VAL, this.constants.length - 3),
          MAX_CAP_SOURCES(),
          MIN_CAP_SOURCES(this.constants.length - 2),
          op(Sale.Opcodes.EVERY, 2),
          op(Sale.Opcodes.DUP, 0),
          op(Sale.Opcodes.VAL, this.constants.length - 1),
          op(Sale.Opcodes.EAGER_IF),
        ]);
        this.stackLength = Number(this.stackLength) + 25;

        return this;
      }
    } else {
      throw new Error('Invalid arguments');
    }
  }
}

/**
 * @public - A sub-class of PriceCurve for creating a Fixed Price sale type.
 * The price is a constant value over the span of the sale.
 *
 * @example
 * ```typescript
 * //For generating a Fixed Price sale type pass in the required arguments to the constructor.
 * const saleType = new FixedPrice(price)
 * ```
 */
export class FixedPrice extends PriceCurve {
  /**
   * Constructs a new raw FixedPrice sale type to be used in a Sale contract.
   *
   * @param price - The constant price of the rTKN.
   * @param erc20decimals - (optional) Number of decimals of the reserve asset (default value 18).
   *
   * @returns a VM StateConfig
   *
   */
  constructor(price: BigNumberish, erc20decimals: number = 18) {
    super({
      constants: [parseUnits(BigNumber.from(price).toString(), erc20decimals)],
      sources: [FixedPrice.FIXED_PRICE_SOURCES()],
      stackLength: 1,
      argumentsLength: 0,
    });
  }

  // fixed price script
  public static FIXED_PRICE_SOURCES = () => concat([op(Sale.Opcodes.VAL, 0)]);
}

/**
 * @public - A sub-class of PriceCurve for creating an vLBP i.e virtual LBP sale type.
 *
 * @remarks - It is called virtual FLO or LBP because there is no actual seeding required.
 * Price starts at 'startPrice' and goes to down over the span of the sale's duration
 * if no buys happen. If buys happen then price will go up (exactly like the real LBP)
 *
 * @example
 * ```typescript
 * //For generating a vLBP sale type pass in the required arguments to the constructor.
 * const saleType = new vLBP(startPrice, startTimestamp, endTimestamp, minimumRaise, initialSupply)
 * ```
 */
export class vLBP extends PriceCurve {
  /**
   * Constructs a new raw vLBP sale type to be used in a Sale contract.
   *
   * @param startPrice - The starting price of the sale for rTKN.
   * @param startTimestamp - Start timestamp of the sale for rTKN.
   * @param endTimestamp - End timestamp of the sale.
   * @param minimumRaise - Used for virtualizing the seed amount and calculating the assets' weights.
   * @param initialSupply - Used for calculating the assets' weights.
   * @param erc20decimals - (optional) Number of decimals of the reserve asset. (default value 18)
   *
   * @returns a VM StateConfig
   *
   */
  constructor(
    startPrice: number,
    startTimestamp: number,
    endTimestamp: number,
    minimumRaise: number,
    initialSupply: number,
    erc20decimals: number = 18
  ) {
    let raiseDuration = endTimestamp - startTimestamp;
    let balanceReserve = minimumRaise * 5;
    let initWeight = (initialSupply * startPrice) / balanceReserve;
    let weightChange = (initWeight - 1) / raiseDuration;
    super({
      constants: [
        parseUnits(balanceReserve.toString(), erc20decimals),
        parseUnits(initWeight.toString()),
        parseUnits(weightChange.toFixed(5).toString()),
        startTimestamp,
        parseUnits((1).toString()),
      ],
      sources: [vLBP.vLBP_SOURCES()],
      stackLength: 15,
      argumentsLength: 0,
    });
  }

  //vLBP script
  public static vLBP_SOURCES = () =>
    concat([
      op(Sale.Opcodes.TOTAL_RESERVE_IN),
      op(Sale.Opcodes.VAL, 0),
      op(Sale.Opcodes.ADD, 2),
      op(Sale.Opcodes.VAL, 1),
      op(Sale.Opcodes.BLOCK_TIMESTAMP),
      op(Sale.Opcodes.VAL, 3),
      op(Sale.Opcodes.SATURATING_SUB, 2),
      op(Sale.Opcodes.VAL, 2),
      op(Sale.Opcodes.MUL, 2),
      op(Sale.Opcodes.SATURATING_SUB, 2),
      op(Sale.Opcodes.VAL, 4),
      op(Sale.Opcodes.MAX, 2),
      op(Sale.Opcodes.MUL, 2),
      op(Sale.Opcodes.REMAINING_UNITS),
      op(Sale.Opcodes.DIV, 2),
    ]);
}

/**
 * @public - A sub-class of PriceCurve for creating an linear Increasing sale type.
 *
 * @remarks - Price starts at 'startPrice' and goes to 'endPrice' over the span of the sale's duration.
 *
 * @example
 * ```typescript
 * //For generating a Increasing Price sale type pass in the required arguments to the constructor.
 * const saleType = new IncreasingPrice(startPrice, endPrice, startTimestamp, endTimestamp)
 * ```
 */
export class IncreasingPrice extends PriceCurve {
  /**
   * Constructs a new raw linear Increasing Price sale type to be used in a Sale contract.
   *
   * @param startPrice - The starting price of the sale for rTKN.
   * @param endPrice - The ending price of the sale for rTKN.
   * @param startTimestamp - Start timestamp of the sale.
   * @param endTimestamp - End timestamp of the sale
   * @param erc20decimals - (optional) Number of decimals of the reserve asset. (default value 18)
   *
   * @returns a VM StateConfig
   *
   */
  constructor(
    startPrice: number,
    endPrice: number,
    startTimestamp: number,
    endTimestamp: number,
    erc20decimals: number = 18
  ) {
    let raiseDuration = endTimestamp - startTimestamp;
    let priceChange = (endPrice - startPrice) / raiseDuration;
    super({
      constants: [
        parseUnits(startPrice.toString(), erc20decimals),
        parseUnits(endPrice.toString(), erc20decimals),
        parseUnits(priceChange.toFixed(5).toString()),
        startTimestamp,
      ],
      sources: [IncreasingPrice.INC_PRICE_SOURCES()],
      stackLength: 10,
      argumentsLength: 0,
    });
  }

  // linear increasing price script
  public static INC_PRICE_SOURCES = () =>
    concat([
      op(Sale.Opcodes.BLOCK_TIMESTAMP),
      op(Sale.Opcodes.VAL, 3),
      op(Sale.Opcodes.SUB, 2),
      op(Sale.Opcodes.VAL, 2),
      op(Sale.Opcodes.MUL, 2),
      op(Sale.Opcodes.VAL, 0),
      op(Sale.Opcodes.ADD, 2),
      op(Sale.Opcodes.VAL, 1),
      op(Sale.Opcodes.MIN, 2),
    ]);
}

/**
 * @public - A class used for creating a VM state for Sale's canEnd/StartStateConfig based on timestamp.
 *
 * @remarks - If the VM result is greater than '0' then sale can start/end and if it is '0' it simply
 * cannot. The basic constructed object is a simple timestamp based condition for sale's
 * canStart/EndStateConfig, but with using the methods in the class more complex conditions
 * can be created for how the sale's duration will work.
 *
 * @remarks - Like all the method calls, order of calling methods in this class is important in order to produce
 * the desired result, although calling in any order will produce a reliable result, that depends on what the
 * intention is. For example 'applyOwner' should be called at last in order to apply the ownership over the whole script.
 * The general methods calling order in this class is:
 *    1.applyExtarTime or afterMinimumRaise (one of which only)
 *    2.applyOwner
 *
 * @example
 * ```typescript
 * //For generating a canStart/End StateConfig for the sale pass in the required arguments to the constructor.
 * const saleType = new SaleDuration(timestamp)
 * ```
 */
export class SaleDurationInTimestamp {
  // StateConfig Properties of this class
  public constants: BigNumberish[];
  public sources: BytesLike[];
  public stackLength: BigNumberish;
  public argumentsLength: BigNumberish;

  /**
   * Constructs a new canStart/End config to be used in a Sale contract's canStart/End functions.
   *
   * @param timestamp - Timestamp that will be used in constructor to create a simple time based canStart/End condition.
   * If the current timestamp is greater than 'timestamp' the sale can start/end and if not the sale cannot start/end.
   *
   */
  constructor(readonly timestamp: number) {
    this.constants = [timestamp];
    this.sources = [
      concat([
        op(Sale.Opcodes.BLOCK_TIMESTAMP),
        op(Sale.Opcodes.VAL, 0),
        op(Sale.Opcodes.GREATER_THAN),
      ]),
    ];
    this.stackLength = 3;
    this.argumentsLength = 0;
  }

  /**
   * Method to apply extra time to the sale duration. if the extra time criteria which is raising more
   * than 'extraTimeAmount' has been met the sale continue for longer (for 'extraTime' more minutes).
   *
   * @remarks - If the sale has extra time discount, it is important that this method to be applied for canEndStateConfig of the sale.
   * @remarks - This method is designed for sale's canEndStateConfig and should 'not' be used for canStart
   * @see PriceCurve.applyExtraTimeDiscount - to deploy a sale that has discount when it goes into extra time.
   *
   * @param extraTime - The amount of time (in minutes) that sale can continue for, if the extra time criteria has been met.
   * @param extraTimeAmount - The criteria for extra time, if the raised amount exceeds this amount then the raise can continue into extra time.
   *
   * @returns this
   *
   */
  public applyExtraTime(
    extraTime: number,
    extraTimeAmount: number,
    ecr20decimals: number = 18
  ): this {
    const EXTRA_TIME = () =>
      concat([
        op(Sale.Opcodes.TOTAL_RESERVE_IN),
        op(Sale.Opcodes.VAL, 2),
        op(Sale.Opcodes.LESS_THAN),
        op(Sale.Opcodes.EVERY, 2),
        op(Sale.Opcodes.BLOCK_TIMESTAMP),
        op(Sale.Opcodes.VAL, 1),
        op(Sale.Opcodes.GREATER_THAN),
        op(Sale.Opcodes.ANY, 2),
      ]);

    const ExtraTimeAmount = parseUnits(extraTimeAmount.toString(), ecr20decimals);
    const ExtraTime = extraTime * 60 + this.timestamp;
    this.constants.push(ExtraTime, ExtraTimeAmount);
    this.sources[0] = concat([this.sources[0], EXTRA_TIME()]);
    this.stackLength = Number(this.stackLength) + 10;

    return this;
  }

  /**
   * Method to apply owner to the sale's canStart and/or canEnd function.
   * Sale's canStart/End functions are public and can be triggered by anyone when the criteria is met, but with using this method for sale's
   * canStart/EndStateConfig, it can configured in a way that only a certain address can actually trigger the sale's start/end functions.
   *
   * @remarks - applyOwnership will apply the ownership over the StateConfig it is been called for, so the order of call is important to get
   * the desired result.
   *
   * @param ownerAddress - The address that will be the owner, only this wallet address can start or end a raise if this method is applied.
   *
   * @returns this
   *
   */
  public applyOwnership(ownerAddress: string): this {
    const stateConfig = VM.toOwnerMaker(this, ownerAddress);
    this.constants = stateConfig.constants;
    this.sources = stateConfig.sources;
    this.stackLength = stateConfig.stackLength;
    this.argumentsLength = stateConfig.argumentsLength;

    return this;
  }

  /**
   * A method for the sale to be able to end once the sale hits minimumRaise i.e. the minimum amount
   * that needs to be raiseed so the raises status becomes "success" after raise ends.
   * 
   * @remarks please note that this method should not be used with applyExtraTime as they are opossit 
   * of eachother and also the order of using this method along with other methods of this class is 
   * important
   * 
   * @param minimumRaise - the minimumRaise parameter of the raise which is passed at the time of
   * sale's deployment as part of the SaleConfig
   *  
   * @returns this
   */
  public afterMinimumRaise (minimumRaise: number, erc20decimals: number = 18) : this {
    const MinimumRaise = parseUnits(minimumRaise.toString(), erc20decimals);

    let _minimumRaise: StateConfig = {
      constants: [MinimumRaise],
      sources: [
        concat([
          op(Sale.Opcodes.VAL, 1),
          op(Sale.Opcodes.TOTAL_RESERVE_IN),
          op(Sale.Opcodes.LESS_THAN),
          op(Sale.Opcodes.ANY, 2),
        ])
      ],
      stackLength: 4,
      argumentsLength: 0
    };
    _minimumRaise = VM.combiner(this, _minimumRaise)

    this.constants = _minimumRaise.constants;
    this.sources = _minimumRaise.sources;
    this.stackLength = _minimumRaise.stackLength;
    this.argumentsLength = _minimumRaise.argumentsLength;

    return this
  }
}

/**
 * @public - A class used for creating a VM state for Sale's canEnd/StartStateConfig based on block number.
 *
 * @remarks - If the VM result is greater than '0' then sale can start/end and if it is '0' it simply
 * cannot. The basic constructed object is a simple block number based condition for sale's
 * canStart/EndStateConfig, but with using the methods in the class more complex conditions
 * can be created for how the sale's duration will work.
 * It is worth mentioning that using a timestamp based canStart/EndStateConfig is much more desireable as most f the
 * PriceCurve configs are designed with timestamp, so if you want to use the block number based canStart/EndStateConfig,
 * please make sure to to match with timestamp used in PriceCurve configs.
 *
 * @remarks - Like all the method calls, order of calling methods in this class is important in order to produce
 * the desired result, although calling in any order will produce a reliable result, that depends on what the
 * intention is. For example 'applyOwner' should be called at last in order to apply the ownership over the whole script.
 * The general methods calling order in this class is:
 *    1.applyExtarTime or afterMinimumRaise (one of which only)
 *    2.applyOwner
 *
 * @example
 * ```typescript
 * //For generating a canStart/End StateConfig for the sale pass in the required arguments to the constructor.
 * const saleType = new SaleDuration(blockNumber)
 * ```
 */
export class SaleDurationInBlocks {
  // StateConfig Properties of this class
  public constants: BigNumberish[];
  public sources: BytesLike[];
  public stackLength: BigNumberish;
  public argumentsLength: BigNumberish;

  /**
   * Constructs a new canStart/End config to be used in a Sale contract's canStart/End functions.
   *
   * @param blockNumber - blockNumber that will be used in constructor to create a simple block number based canStart/End condition.
   * If the current BlockNumber is greater than 'blockNumber' the sale can start/end and if not the sale cannot start/end.
   *
   */
  constructor(readonly blockNumber: number) {
    this.constants = [blockNumber - 1];
    this.sources = [
      concat([
        op(Sale.Opcodes.BLOCK_NUMBER),
        op(Sale.Opcodes.VAL, 0),
        op(Sale.Opcodes.GREATER_THAN),
      ]),
    ];
    this.stackLength = 3;
    this.argumentsLength = 0;
  }

  /**
   * Method to apply extra time to the sale duration. if the extra time criteria which is raising more
   * than 'extraTimeAmount' has been met the sale continue for longer (for 'extraTimeBlocks' more blocks).
   *
   * @remarks - If the sale has extra time discount, it is important that this method to be applied for canEndStateConfig of the sale.
   * @remarks - This method is designed for sale's canEndStateConfig and should 'not' be used for canStart
   * @see PriceCurve.applyExtraTimeDiscount - to deploy a sale that has discount when it goes into extra time.
   *
   * @param extraTimeBlocks - The amount of time (in blocks) that sale can continue for, if the extra time criteria has been met.
   * @param extraTimeAmount - The criteria for extra time, if the raised amount exceeds this amount then the raise can continue into extra time.
   *
   * @returns this
   *
   */
  public applyExtraTime(
    extraTimeBlocks: number,
    extraTimeAmount: number,
    erc20decimals: number = 18
  ): this {
    const EXTRA_TIME = () =>
      concat([
        op(Sale.Opcodes.TOTAL_RESERVE_IN),
        op(Sale.Opcodes.VAL, 2),
        op(Sale.Opcodes.LESS_THAN),
        op(Sale.Opcodes.EVERY, 2),
        op(Sale.Opcodes.BLOCK_NUMBER),
        op(Sale.Opcodes.VAL, 1),
        op(Sale.Opcodes.GREATER_THAN),
        op(Sale.Opcodes.ANY, 2),
      ]);

    const ExtraTimeAmount = parseUnits(extraTimeAmount.toString(), erc20decimals);
    const ExtraTime = extraTimeBlocks + this.blockNumber;

    this.constants.push(ExtraTime, ExtraTimeAmount);
    this.sources[0] = concat([this.sources[0], EXTRA_TIME()]);
    this.stackLength = Number(this.stackLength) + 10;

    return this;
  }

  /**
   * Method to apply owner to the sale's canStart and/or canEnd function.
   * Sale's canStart/End functions are public and can be triggered by anyone when the criteria is met, but with using this method for sale's
   * canStart/EndStateConfig, it can configured in a way that only a certain address can actually trigger the sale's start/end functions.
   *
   * @remarks - applyOwnership will apply the ownership over the StateConfig it is been called for, so the order of call is important to get
   * the desired result.
   *
   * @param ownerAddress - The address that will be the owner, only this wallet address can start or end a raise if this method is applied.
   *
   * @returns this
   *
   */
  public applyOwnership(ownerAddress: string): this {
    const stateConfig = VM.toOwnerMaker(this, ownerAddress);
    this.constants = stateConfig.constants;
    this.sources = stateConfig.sources;
    this.stackLength = stateConfig.stackLength;
    this.argumentsLength = stateConfig.argumentsLength;

    return this;
  }

  /**
   * A method for the sale to be able to end once the sale hits minimumRaise i.e. the minimum amount
   * that needs to be raiseed so the raises status becomes "success" after raise ends.
   * 
   * @remarks please note that this method should not be used with applyExtraTime as they are opossit 
   * of eachother and also the order of using this method along with other methods of this class is 
   * important
   * 
   * @param minimumRaise - the minimumRaise parameter of the raise which is passed at the time of
   * sale's deployment as part of the SaleConfig
   *  
   * @returns this
   */
  public afterMinimumRaise (minimumRaise: number, erc20decimals: number = 18) : this {
    const MinimumRaise = parseUnits(minimumRaise.toString(), erc20decimals);

    let _minimumRaise: StateConfig = {
      constants: [MinimumRaise],
      sources: [
        concat([
          op(Sale.Opcodes.VAL, 1),
          op(Sale.Opcodes.TOTAL_RESERVE_IN),
          op(Sale.Opcodes.LESS_THAN),
          op(Sale.Opcodes.ANY, 2),
        ])
      ],
      stackLength: 4,
      argumentsLength: 0
    };
    _minimumRaise = VM.combiner(this, _minimumRaise)

    this.constants = _minimumRaise.constants;
    this.sources = _minimumRaise.sources;
    this.stackLength = _minimumRaise.stackLength;
    this.argumentsLength = _minimumRaise.argumentsLength;

    return this
  }
}
