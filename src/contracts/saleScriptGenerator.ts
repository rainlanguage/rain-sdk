
import { ethers } from 'ethers';
import { Sale } from "./sale"
import { StateConfig, VM } from '../classes/vm';
import {
  parseUnits,
  concat,
  op,
} from '../utils';



/**
* Standard cap per wallet modes
*/
export enum WalletCapMode {
  min,
  max, 
  both
};

/**
* applyWalletCap call options
*/
export type WalletCapOptions = {
  minWalletCap?: number,
  maxWalletCap?: number,
  tierMultiplierMode?: boolean,
  tierAddress?: string,
  tierMultiplier?: number[],
  tierActivation?: (number | string)[],
}

/**
* @public - PriceCurve is an abstract class that all the other sale types (sub-classes) will inherit from.
* 
* @remarks - It holds all the global methods for generating a sale script with different features for a sale
* such as tier discount which makes depolying a new sale contracts with different features easy.
* 
* @important - the order of calling the methods of this class is important, meaning in order to get the 
* desired result for the sale, mthods should be called in correct order, although it is worth saying 
* that even if the order is not followed, the result will still be reliable if that is been done by intention.
* For example if we call 'applyExtraTime' method after the the 'applyTierDiscount' method, the extra 
* time discount will be applied to the result of 'applyTierDiscount' and if before that, it will be vice versa. 
* The general order for calling these methods is: 
*    1.applyExtraTimeDiscount
*    2.applyTierDiscount
*    3.applyWalletCap
* 
* Must be newed by the extending sub-classes.
*  
*/
export abstract class PriceCurve{

  /**
  * Constructor of PriceCurve class that must be instantiated by sun-classes.
  * 
  * @param stateConfig - Constructed by sub-classes
  */
  constructor(public stateConfig: StateConfig) {}

  /**
  * Method to apply extra time discount to the sale. if sale's continues into extra time 
  * then those addresses that have met the critera of extra time discount which is already 
  * purchased a certain amount of rTKN will get some discount on price for their next purchase.
  * 
  * @important - Sale should have extra time feature in order for extra time discount to be effective.
  * @see SaleDuration.applyExtraTime - to deploy a sale that has extra time feature
  * 
  * @param endTimestamp - Usual end time of the sale.
  * @param extraTimeDiscountThreshold - the criteria for extra time discount, if the address has already 
  * purchased more than this amount then it will recieve the discount for its next purchases once the sale 
  * is gone into extra time.
  * @param extraTimeDiscount - The amount of discount the address will receive.
  * 
  * @returns a VM StateConfig
  *
  */
  public applyExtraTimeDiscount(
    endTimestamp: number,
    extraTimeDiscountThreshold: number,
    extraTimeDiscount: number
  ) : this {
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
      this.stateConfig.constants.push(
        endTimestamp,
        parseUnits(extraTimeDiscountThreshold.toString()),
        100 - extraTimeDiscount,
        100,
      );
    this.stateConfig.sources = [
      concat([
        EXTRA_TIME_DISCOUNT(this.stateConfig.constants.length),
        ...this.stateConfig.sources,
        op(Sale.Opcodes.DUP, 1),
        DISCOUNT_CONDITION_SOURCES(this.stateConfig.constants.length),
      ])
    ];
    this.stateConfig.stackLength = Number(
      this.stateConfig.stackLength
    ) + 20;

    return this;
  }

  /**
  * Method to apply tiers' discounts to the sale. Tiered addresses will get discount based on the tier they hold. 
  * 
  * @param tierAddress - The Tier contract address.
  * @param tierDiscount - An array of each tiers' discount ranging between 0 - 99.
  * @param tierActivation - (optional) An array of number of blocks for each tier that will be the required period 
  * of time for a tiered address which that tier's status needs to be held in order to be eligible for that tier's discount.
  * 
  * @returns a VM StateConfig
  *
  */
  public applyTierDiscount(    
    tierAddress: string,
    tierDiscount: number[],
    tierActivation?: (number | string)[],
  ): this {
    this.stateConfig = VM.tierBasedDiscounter(
      this.stateConfig,
      tierAddress,
      tierDiscount,
      {tierActivation}
    );

    return this;
  }

  /**
  * Method to apply cap per wallet to the sale. addresses can only buy that certain amount of rTKNs.
  * With the option of applying multiplier for max cap per wallet. 
  * 
  * @param mode - The mode that determines if there is max or min cap per wallet or both.
  * @param options.minWalletCap - (optional) The number for min cap per wallet, addresses cannot buy less number of rTKNs than this amount.
  * @param options.maxWalletCap - (optional) The number for max cap per wallet, addresses cannot buy more number of rTKNs than this amount.
  * @param options.tierMultiplierMode - (optional) Set true in order to apply Multiplier for max cap per wallet.
  * @param options.tierAddress - (optional) The Tier contract address for tiers' max cap per wallet multiplier.
  * @param options.tierMultiplier - (optional) An array of each tiers' Multiplier value.
  * @param options.tierActivation - (optional) An array of number of blocks for each tier that will be the required period 
  * of time for a tiered address which that tier's status needs to be held in order to be eligible for that tier's discount. 
  * 
  * @returns a VM StateConfig
  *
  */
  public applyWalletCap(
    mode: WalletCapMode,
    options?: WalletCapOptions
  ) : this {
    if (!options) { options = { }; }

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

    if (mode == WalletCapMode.min && options.minWalletCap) {
      this.stateConfig.constants.push(
        parseUnits(options.minWalletCap.toString()).sub(1),
        ethers.constants.MaxUint256
      );
      this.stateConfig.sources[0] = 
        concat([
          this.stateConfig.sources[0],
          MIN_CAP_SOURCES(this.stateConfig.constants.length - 2),
          op(Sale.Opcodes.DUP, 0),
          op(Sale.Opcodes.VAL, this.stateConfig.constants.length - 1),
          op(Sale.Opcodes.EAGER_IF)
        ]);
        this.stateConfig.stackLength = Number(
          this.stateConfig.stackLength
        ) + 15;

      return this;  
    }

    else if (mode == WalletCapMode.max && options.maxWalletCap) {
      if (options.tierMultiplierMode && options.tierAddress && options.tierMultiplier) {
        let maxCapConfig: StateConfig = {
          constants: [
            parseUnits(options.maxWalletCap.toString())
          ],
          sources: [
            concat([
              op(Sale.Opcodes.VAL, 0)
            ])
          ],
          stackLength: 1,
          argumentsLength: 0
        };
        maxCapConfig = VM.tierBasedMultiplier(
          maxCapConfig,
          options.tierAddress,
          options.tierMultiplier,
          {tierActivation: options.tierActivation}
        );
        maxCapConfig.constants.push(
          ethers.constants.MaxUint256
        );
        maxCapConfig.sources[0] = 
          concat([
            maxCapConfig.sources[0],
            MAX_CAP_SOURCES(),
            op(Sale.Opcodes.DUP, 0),
            op(Sale.Opcodes.VAL, maxCapConfig.constants.length - 1),
            op(Sale.Opcodes.EAGER_IF),
          ]);
          this.stateConfig = VM.vmStateCombiner(
            this.stateConfig,
            maxCapConfig,
          );

        return this;
      }
      else {
        this.stateConfig.constants.push(
          parseUnits(options.maxWalletCap.toString()).add(1),
          ethers.constants.MaxUint256
        );
        this.stateConfig.sources[0] = 
          concat([
            this.stateConfig.sources[0],
            op(Sale.Opcodes.VAL, this.stateConfig.constants.length - 2),
            MAX_CAP_SOURCES(),
            op(Sale.Opcodes.VAL, this.stateConfig.constants.length - 1),
            op(Sale.Opcodes.EAGER_IF)
          ]);
          this.stateConfig.stackLength = Number(
            this.stateConfig.stackLength
          ) + 10;
          
        return this;
      }
    }

    else if (mode == WalletCapMode.both && options.minWalletCap && options.maxWalletCap) {
      if (options.tierMultiplierMode && options.tierAddress && options.tierMultiplier) {
        let bothCapConfig: StateConfig = {
          constants: [
            parseUnits(options.maxWalletCap.toString())
          ],
          sources: [
            concat([
              op(Sale.Opcodes.VAL, 0)
            ])
          ],
          stackLength: 1,
          argumentsLength: 0
        };
        bothCapConfig = VM.tierBasedMultiplier(
          bothCapConfig,
          options.tierAddress,
          options.tierMultiplier,
          {tierActivation: options.tierActivation}
        );
        bothCapConfig.constants.push(
          parseUnits(options.minWalletCap.toString()).sub(1),
          ethers.constants.MaxUint256
        );
        bothCapConfig.sources[0] = 
          concat([
            bothCapConfig.sources[0],
            MAX_CAP_SOURCES(),
            MIN_CAP_SOURCES(bothCapConfig.constants.length - 2),
            op(Sale.Opcodes.EVERY, 2),
            op(Sale.Opcodes.DUP, 0),
            op(Sale.Opcodes.VAL, bothCapConfig.constants.length - 1),
            op(Sale.Opcodes.EAGER_IF),
          ]);

          this.stateConfig = VM.vmStateCombiner(
            this.stateConfig,
            bothCapConfig,
          );
        return this;
      }
      else {
        this.stateConfig.constants.push(
          parseUnits(options.maxWalletCap.toString()).add(1),
          parseUnits(options.minWalletCap.toString()).sub(1),
          ethers.constants.MaxUint256
        );
        this.stateConfig.sources[0] = 
          concat([
            this.stateConfig.sources[0],
            op(Sale.Opcodes.VAL, this.stateConfig.constants.length - 3),
            MAX_CAP_SOURCES(),
            MIN_CAP_SOURCES(this.stateConfig.constants.length - 2),
            op(Sale.Opcodes.EVERY, 2),
            op(Sale.Opcodes.DUP, 0),
            op(Sale.Opcodes.VAL, this.stateConfig.constants.length - 1),
            op(Sale.Opcodes.EAGER_IF)
          ]);
          this.stateConfig.stackLength = Number(
            this.stateConfig.stackLength
          ) + 25;

        return this;
      }
    }

    else {
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
* 
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
  constructor(price: number, erc20decimals: number = 18) {
    super(
      {
        constants: [
          parseUnits(price.toString(), erc20decimals)
        ],
        sources: [FixedPrice.FIXED_PRICE_SOURCES()],
        stackLength: 1,
        argumentsLength: 0
      }
    )
  }

  // fixed price script
  public static FIXED_PRICE_SOURCES = () =>
    concat([
      op(Sale.Opcodes.VAL, 0)
    ]);
}


/**
* @public - A sub-class of PriceCurve for creating an vLBP i.e virtual LBP sale type. 
* 
* @remark - It is called virtual FLO or LBP because there is no actual seeding required.
* Price starts at 'startPrice' and goes to down over the span of the sale's duration
* if no buys happen. If buys happen then price will go up (exactly like the real LBP)
*
* @example
* ```typescript
* //For generating a vLBP sale type pass in the required arguments to the constructor.
* const saleType = new vLBP(startPrice, startTimestamp, endTimestamp, minimumRaise, initialSupply) 
* 
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
        super(
          {
            constants: [    
              parseUnits(balanceReserve.toString(),erc20decimals),
              parseUnits(initWeight.toString()),
              parseUnits(weightChange.toFixed(5).toString()),
              startTimestamp,
              parseUnits(1 .toString())
            ],
            sources: [vLBP.vFLO_SOURCES()],
            stackLength: 15,
            argumentsLength: 0
          }
        )
      }
  
  //vLBP script
  public static vFLO_SOURCES = () =>
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
* @rematks - Price starts at 'startPrice' and goes to 'endPrice' over the span of the sale's duration.
*
* @example
* ```typescript
* //For generating a Increasing Price sale type pass in the required arguments to the constructor.
* const saleType = new IncreasingPrice(startPrice, endPrice, startTimestamp, endTimestamp)
* 
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
      super(
        {
          constants: [
            parseUnits(startPrice.toString(),erc20decimals),
            parseUnits(endPrice.toString(),erc20decimals),
            parseUnits(priceChange.toFixed(5).toString()),
            startTimestamp
          ],
          sources: [IncreasingPrice.INC_PRICE_SOURCES()],
          stackLength: 10,
          argumentsLength: 0
        }
      )
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
};


/**
* @public - A class used for creating a VM state for Sale's canEnd/StartStateConfig based on timestamp. 
* 
* @remarks - If the VM result is greater than '0' then sale can start/end and if it is '0' it simply 
* cannot. The basic constructed object is a simple timestamp based condition for sale's 
* canStart/EndStateConfig, but with using the methods in the class more complex conditions 
* can be created for how the sale's duration will work.
*
* @important - Like all the method calls, order of calling methods in this class is important in order to produce
* the desired result, although calling in any order will produce a reliable result, that depends on what the 
* intention is. For example 'applyOwner' should be called at last in order to apply the ownership over the whole script. 
* The general methods calling order in this class is:
*    1.applyExtarTime
*    2.applyOwner
* 
* @example
* ```typescript
* //For generating a canStart/End StateConfig for the sale pass in the required arguments to the constructor.
* const saleType = new SaleDuration(timestamp)
* 
*/
export class SaleDuration {

  public stateConfig: StateConfig;

  /**
  * Constructs a new canStart/End config to be used in a Sale contract's canStart/End functions.
  * 
  * @param timestamp - Timestamp that will be used in constructor to create a simple time based canStart/End condition.
  * If the current timestamp is greater than 'timestamp' the sale can start/end and if not the sale cannot start/end.  
  * 
  * @returns a VM StateConfig
  * 
  */
  constructor(readonly timestamp: number) {
    this.stateConfig = {
      constants: [timestamp],
      sources: [
        concat([
          op(Sale.Opcodes.BLOCK_TIMESTAMP),
          op(Sale.Opcodes.VAL, 0),
          op(Sale.Opcodes.GREATER_THAN),
        ])
      ],
      stackLength: 3,
      argumentsLength: 0,
    }
  };

  /**
  * Method to apply extra time to the sale duration. if the extra time criteria which is raising more
  * than 'extraTimeAmount' has been met the sale continue for longer (for 'extraTime' more minutes).
  * 
  * @important - If the sale has extra time discount, it is important that this method to be applied for canEndStateConfig of the sale.
  * @important - This method is designed for sale's canEndStateConfig and should 'not' be used for canStart 
  * @see PriceCurve.applyExtraTimeDiscount - to deploy a sale that has discount when it goes into extra time.
  * 
  * @param extraTime - The amount of time (in minutes) that sale can continue for, if the extra time criteria has been met.
  * @param extraTimeAmount - The criteria for extra time, if the raised amount exceeds this amount then the raise can continue into extra time.
  * 
  * @returns a VM StateConfig
  *
  */
  public applyExtraTime(
    extraTime: number,
    extraTimeAmount: number, 
  ) : this {
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

    const ExtraTimeAmount = parseUnits(
      extraTimeAmount.toString()
    );
    const ExtraTime = extraTime * 60 + this.timestamp;
    this.stateConfig.constants.push(
      ExtraTime,
      ExtraTimeAmount
    );
    this.stateConfig.sources[0] = 
        concat([
          this.stateConfig.sources[0],
          EXTRA_TIME(),
        ]);
    this.stateConfig.stackLength = Number(
      this.stateConfig.stackLength
    ) + 10;

    return this;
  };  

  /**
  * Method to apply owner to the sale's canStart and/or canEnd function. 
  * Sale's canStart/End functions are public and can be triggered by anyone when the criteria is met, but with using this method for sale's
  * canStart/EndStateConfig, it can configured in a way that only a certain address can actually trigger the sale's start/end functions.
  * 
  * @important - applyOwnership will apply the ownership over the StateConfig it is been called for, so the order of call is important to get
  * the desired result.
  * 
  * @param ownerAddress - The address that will be the owner, only this wallet address can start or end a raise if this method is applied.
  * 
  * @returns a VM StateConfig
  *
  */
  public applyOwnership(
    ownerAddress: string
  ) : this {
    this.stateConfig = VM.makeOwner(
      this.stateConfig,
      ownerAddress,
    )
    return this; 
  };

};
