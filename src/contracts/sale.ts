import {
  BigNumberish,
  BigNumber,
  Signer,
  ContractTransaction,
  constants,
} from 'ethers';

import {
  ERC20Config,
  TxOverrides,
  ReadTxOverrides,
} from '../classes/rainContract';
import { StateConfig, VM } from '../classes/vm';

import { FactoryContract } from '../classes/factoryContract';
import { Tier } from '../classes/tierContract';
import { RedeemableERC20 } from './redeemableERC20';

import { ERC20 } from './generics/erc20';

import {
  parseUnits,
  paddedUInt256,
  paddedUInt32,
  concat,
  op,
  arg,
  callSize,
  tierRange,
  selectLte,
  selectLteMode,
  selectLteLogic,
} from '../utils';

import { Sale__factory, SaleFactory__factory } from '../typechain';

// TODO: Refactor Sale class

/**
 * @public
 * A class for deploying and calling methods on a Sale.
 *
 * @remarks
 *
 * This class provides an easy way to deploy Sales using Rain's canonical factories, and methods for interacting with an already deployed Sale.
 * @example
 * ```typescript
 * import { Sale } from 'rain-sdk'
 * // To deploy a new Sale, pass an ethers.js Signer and the config for the Sale.
 * const newSale = await Sale.deploy(signer, SaleArgs)
 *
 * // To connect to an existing Sale just pass the address and an ethers.js Signer.
 * const existingSale = new Sale(address, signer)
 *
 * // Once you have a Sale, you can call the smart contract methods:
 * await existingSale.start()
 * await existingSale.buy(config_)
 * ```
 *
 */
export class Sale extends FactoryContract {
  protected static readonly nameBookReference = 'saleFactory';

  /**
   * Constructs a new Sale from a known address.
   *
   * @param address - The address of the Sale contract
   * @param signer - An ethers.js Signer
   * @returns A new Sale instance
   *
   */
  constructor(address: string, signer: Signer) {
    Sale.checkAddress(address);

    super(address, signer);
    const _sale = Sale__factory.connect(address, signer);

    this.buy = _sale.buy;
    this.refund = _sale.refund;
    this.calculatePrice = _sale.calculatePrice;
    this.claimFees = _sale.claimFees;
    this.start = _sale.start;
    this.end = _sale.end;
    this.canStart = _sale.canStart;
    this.canEnd = _sale.canEnd;
    this.saleStatus = _sale.saleStatus;
    this.timeout = _sale.timeout;
    this.reserve = _sale.reserve;
    this.token = _sale.token;
  }

  /**
   * All the standard and Sale Opcodes
   */
  public static Opcodes = {
    ...VM.Opcodes,
    /**
     * local opcode to stack remaining rTKN units.
     */
    REMAINING_UNITS: 0 + VM.Opcodes.length,
    /**
     * local opcode to stack total reserve taken in so far.
     */
    TOTAL_RESERVE_IN: 1 + VM.Opcodes.length,
    /**
     * local opcode to stack the rTKN units/amount of the current buy.
     */
    CURRENT_BUY_UNITS: 2 + VM.Opcodes.length,
    /**
     * local opcode to stack the address of the rTKN.
     */
    TOKEN_ADDRESS: 3 + VM.Opcodes.length,
    /**
     * local opcode to stack the address of the reserve token.
     */
    RESERVE_ADDRESS: 4 + VM.Opcodes.length,
  };

  /**
   * Deploys a new Sale.
   *
   * @param signer - An ethers.js Signer
   * @param saleConfig - Arguments for the Sale configuration @see saleConfig
   * @param saleRedeemableERC20Config - Arguments for the Redeemable configuration @see saleRedeemableERC20Config
   * @param overrides - @see TxOverrides
   * @returns A new Sale instance
   *
   */
  public static deploy = async (
    signer: Signer,
    saleConfig: SaleConfig,
    saleRedeemableERC20Config: SaleRedeemableERC20Config,
    overrides: TxOverrides = {}
  ): Promise<Sale> => {
    const saleFactory = SaleFactory__factory.connect(
      this.getBookAddress(await this.getChainId(signer)),
      signer
    );

    const tx = await saleFactory.createChildTyped(
      saleConfig,
      saleRedeemableERC20Config,
      overrides
    );
    const receipt = await tx.wait();
    const address = this.getNewChildFromReceipt(receipt, saleFactory);
    return new Sale(address, signer);
  };

  public readonly connect = (signer: Signer): Sale => {
    return new Sale(this.address, signer);
  };

  /**
   * Checks if address is registered as a child contract of this SaleFactory on a specific network
   *
   * @param signer - An ethers.js Signer
   * @param maybeChild - Address to check registration for.
   * @returns `true` if address was deployed by this contract factory, otherwise `false`
   */
  public static isChild = async (
    signer: Signer,
    maybeChild: string
  ): Promise<boolean> => {
    return await this._isChild(signer, maybeChild);
  };

  /**
   * Obtain the instance redeemable token from this sale.
   *
   * @param signer - The signer that will be connected to the Redeemable token instance. If not
   * provided, the same signer of this instance will be used.
   * @returns A Redeemable instance with all the redeemableERC20 methods
   */
  public readonly getRedeemable = async (
    signer: Signer = this.signer
  ): Promise<RedeemableERC20> => {
    return new RedeemableERC20(await this.token(), signer);
  };

  /**
   * Obtain the instance of the reserve from this sale as a generic ERC20 Token
   *
   * @param signer - The signer that will be connected to the Reserve token instance. If not
   * provided, the same signer of this instance will be used.
   * @returns A reserve ERC20 token instance with all the generic methods
   */
  public readonly getReserve = async (
    signer: Signer = this.signer
  ): Promise<ERC20> => {
    return new ERC20(await this.reserve(), signer);
  };

  /**
   * Main entrypoint to the sale. Sells rTKN in exchange for reserve token. The price curve
   * is eval'd to produce a reserve price quote. Each 1 unit of rTKN costs `price` reserve
   * token where BOTH the rTKN units and price are treated as 18 decimal fixed point values.
   * If the reserve token has more or less precision by its own conventions (e.g. "decimals"
   * method on ERC20 tokens) then the price will need to scale accordingly. The receipt is
   * _logged_ rather than returned as it cannot be used in same block for a refund anyway due
   * to cooldowns.
   *
   * @param config - All parameters to configure the purchase. @see BuyConfig
   * @param overrides - @see TxOverrides
   */
  public readonly buy: (
    config: BuyConfig,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Rollback a buy given its receipt.
   * Ignoring gas (which cannot be refunded) the refund process rolls back all state changes
   * caused by a buy, other than the receipt id increment. Refunds are limited by the global
   * cooldown to mitigate rapid buy/refund cycling that could cause volatile price curves or
   * other unwanted side effects for other sale participants. Cooldowns are bypassed if the
   * sale ends and is a failure.
   *
   * @param receipt - The receipt of the buy to rollback.
   * @param overrides - @see TxOverrides
   */
  public readonly refund: (
    receipt: Receipt,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Calculates the current reserve price quoted for 1 unit of rTKN. Used internally to process `buy`
   *
   * @param units - Amount of rTKN to quote a price for, will be available to the price script from
   * OPCODE_CURRENT_BUY_UNITS.
   * @param overrides - @see ReadTxOverrides
   * @returns The current price
   */
  public readonly calculatePrice: (
    units: BigNumberish,
    overrides?: ReadTxOverrides
  ) => Promise<BigNumber>;

  /**
   * After a sale ends in success all fees collected for a recipient can be cleared. If the
   * raise is active or fails then fees cannot be claimed as they are set aside in case of
   * refund. A failed raise implies that all buyers should immediately refund and zero fees
   * claimed.
   *
   * @param recipient - The recipient to claim fees for. Does NOT need to be the `msg.sender`.
   * @param overrides - @see TxOverrides
   */
  public readonly claimFees: (
    recipient: string,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Start the sale (move from pending to active).
   * - `canStart` MUST return true.
   *
   * @param overrides - @see TxOverrides
   */
  public readonly start: (
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * End the sale (move from active to success or fail).
   * - `canEnd` MUST return true.
   *
   * @param overrides - @see TxOverrides
   */
  public readonly end: (
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Can the sale start?
   * Evals `canStartStatePointer` to a boolean that determines whether the sale can start
   * (move from pending to active). Buying from and ending the sale will both always fail
   * if the sale never started.
   * The sale can ONLY start if it is currently in pending status.
   *
   * @param overrides - @see ReadTxOverrides
   * @returns true if can start the sale
   */
  public readonly canStart: (overrides?: ReadTxOverrides) => Promise<boolean>;

  /**
   * Can the sale end?
   * Evals `canEndStatePointer` to a boolean that determines whether the sale can end (move
   * from active to success/fail). Buying will fail if the sale has ended. If the sale is out
   * of rTKN stock it can ALWAYS end and in this case will NOT eval the "can end" script.
   * The sale can ONLY end if it is currently in active status.
   *
   * @param overrides - @see ReadTxOverrides
   * @returns true if can end the sale
   */
  public readonly canEnd: (overrides?: ReadTxOverrides) => Promise<boolean>;

  /**
   * Returns the current `SaleStatus` of the sale.
   * Represents a linear progression of the sale through its major lifecycle  events.
   *
   * @param overrides - @see ReadTxOverrides
   * @returns The sale status
   */
  public readonly saleStatus: (overrides?: ReadTxOverrides) => Promise<number>;

  /**
   * Timeout the sale (move from pending or active to fail). The ONLY condition for a timeout
   * is that the `saleTimeout` block set during initialize is in the past. This means that
   * regardless of what happens re: starting, ending, buying, etc. if the sale does NOT manage
   * to unambiguously end by the timeout block then it can timeout to a fail state. This means
   * that any downstream escrows or similar can always expect that eventually they will see a
   * pass/fail state and so are safe to lock funds while a Sale is active.
   *
   * @param overrides - @see TxOverrides
   */
  public readonly timeout: (
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Returns the address of the token that sale prices are denominated in.
   * MUST NOT change during the lifecycle of the sale contract.
   *
   * @param overrides - @see ReadTxOverrides
   * @returns the token reserve address
   */
  public readonly reserve: (overrides?: ReadTxOverrides) => Promise<string>;

  /**
   * Returns the address of the token being sold in the sale.
   * MUST NOT change during the lifecycle of the sale contract.
   *
   * @param overrides - @see ReadTxOverrides
   * @returns the token redeemable address
   */
  public readonly token: (overrides?: ReadTxOverrides) => Promise<string>;

  // TODO: reorganize scripts positions (?)
  // Scripts

  /**
   * Create a condition as VM state configuration to that is true AFTER a `blockNumber` in the chain.
   *
   * @param blockNumber - block number that will be use as comparision
   * @returns A VM Configturation
   */
  public static afterBlockNumberConfig(blockNumber: BigNumberish): StateConfig {
    return {
      sources: VM.createVMSources([
        [this.Opcodes.BLOCK_NUMBER],
        [this.Opcodes.VAL, 0],
        [this.Opcodes.GREATER_THAN],
      ]),
      constants: [BigNumber.from(blockNumber).sub(1)],
      stackLength: 3,
      argumentsLength: 0,
    };
  }

  /**
   * Create a condition as VM state configuration to that is true AFTER a `timestamp` in the chain.
   *
   * @param timestamp - timestamp that will be use as comparision
   * @returns A VM Configturation
   */
  public static afterTimestampConfig(timestamp: BigNumberish): StateConfig {
    return {
      sources: VM.createVMSources([
        [this.Opcodes.BLOCK_TIMESTAMP],
        [this.Opcodes.VAL, 0],
        [this.Opcodes.GREATER_THAN],
      ]),
      constants: [BigNumber.from(timestamp)],
      stackLength: 3,
      argumentsLength: 0,
    };
  }

  // GENERATOR

  /**
   *
   * @returns
   */
  public static AFTER_TIMESTAMP = () =>
    VM.createVMSources([
      [this.Opcodes.BLOCK_TIMESTAMP],
      [this.Opcodes.VAL, 0],
      [this.Opcodes.GREATER_THAN],
    ])[0];

  /**
   *
   * @returns
   */
  public static EXTRA_TIME = () =>
    VM.createVMSources([
      [this.Opcodes.TOTAL_RESERVE_IN],
      [this.Opcodes.VAL, 2],
      [this.Opcodes.LESS_THAN],
      [this.Opcodes.EVERY, 2],
      [this.Opcodes.BLOCK_TIMESTAMP],
      [this.Opcodes.VAL, 1],
      [this.Opcodes.GREATER_THAN],
      [this.Opcodes.ANY, 2],
    ])[0];

  /**
   *
   * @param i
   * @returns
   */
  public static CREATOR_CONTROL = (i: number) =>
    VM.createVMSources([
      [this.Opcodes.SENDER],
      [this.Opcodes.VAL, i],
      [this.Opcodes.EQUAL_TO],
      [this.Opcodes.EVERY, 2],
    ])[0];

  public static FIXED_PRICE_SOURCES = () =>
    VM.createVMSources([[this.Opcodes.VAL, 0]])[0];

  public static vFLO_SOURCES = () =>
    VM.createVMSources([
      [this.Opcodes.TOTAL_RESERVE_IN],
      [this.Opcodes.VAL, 0],
      [this.Opcodes.ADD, 2],
      [this.Opcodes.VAL, 1],
      [this.Opcodes.BLOCK_TIMESTAMP],
      [this.Opcodes.VAL, 3],
      [this.Opcodes.SUB, 2],
      [this.Opcodes.VAL, 2],
      [this.Opcodes.MUL, 2],
      [this.Opcodes.SUB, 2],
      [this.Opcodes.VAL, 4],
      [this.Opcodes.MAX, 2],
      [this.Opcodes.MUL, 2],
      [this.Opcodes.REMAINING_UNITS],
      [this.Opcodes.DIV, 2],
    ])[0];

  public static INC_PRICE_SOURCES = () =>
    VM.createVMSources([
      [this.Opcodes.BLOCK_TIMESTAMP],
      [this.Opcodes.VAL, 3],
      [this.Opcodes.SUB, 2],
      [this.Opcodes.VAL, 2],
      [this.Opcodes.MUL, 2],
      [this.Opcodes.VAL, 0],
      [this.Opcodes.ADD, 2],
      [this.Opcodes.VAL, 1],
      [this.Opcodes.MIN, 2],
    ])[0];

  public static MIN_CAP_SOURCES = (i: number) =>
    VM.createVMSources([
      [this.Opcodes.VAL, i],
      [this.Opcodes.CURRENT_BUY_UNITS],
      [this.Opcodes.TOKEN_ADDRESS],
      [this.Opcodes.SENDER],
      [this.Opcodes.IERC20_BALANCE_OF],
      [this.Opcodes.ADD, 2],
      [this.Opcodes.LESS_THAN],
    ])[0];

  public static MAX_CAP_SOURCES = () =>
    VM.createVMSources([
      [this.Opcodes.CURRENT_BUY_UNITS],
      [this.Opcodes.TOKEN_ADDRESS],
      [this.Opcodes.SENDER],
      [this.Opcodes.IERC20_BALANCE_OF],
      [this.Opcodes.ADD, 2],
      [this.Opcodes.GREATER_THAN],
    ])[0];

  public static EXTRA_TIME_DISCOUNT = (i: number) =>
    VM.createVMSources([
      [this.Opcodes.VAL, i - 4],
      [this.Opcodes.BLOCK_TIMESTAMP],
      [this.Opcodes.GREATER_THAN],
      [this.Opcodes.VAL, i - 3],
      [this.Opcodes.TOKEN_ADDRESS],
      [this.Opcodes.SENDER],
      [this.Opcodes.IERC20_BALANCE_OF],
      [this.Opcodes.GREATER_THAN],
      [this.Opcodes.ANY, 2],
    ])[0];

  public static TIER_DISCOUNTS = (i: number, valSize: number) => [
    op(this.Opcodes.NEVER),
    op(this.Opcodes.VAL, i - 1),
    op(
      this.Opcodes.UPDATE_BLOCKS_FOR_TIER_RANGE,
      tierRange(Tier.ZERO, Tier.EIGHT)
    ),
    op(this.Opcodes.VAL, i - 2),
    op(this.Opcodes.VAL, i - 3),
    op(this.Opcodes.SENDER),
    op(this.Opcodes.REPORT),
    op(this.Opcodes.BLOCK_NUMBER),
    op(
      this.Opcodes.SELECT_LTE,
      selectLte(selectLteLogic.every, selectLteMode.first, 2)
    ),
    op(this.Opcodes.SATURATING_DIFF),
    op(this.Opcodes.ZIPMAP, callSize(1, 3, valSize)),
    op(this.Opcodes.MIN, 8),
    op(this.Opcodes.MUL, 2),
    op(this.Opcodes.VAL, i - 1),
    op(this.Opcodes.DIV, 2),
  ];

  public static TIER_CAP_MULTIPLIER = (i: number, valSize: number) => [
    op(this.Opcodes.VAL, i - 2),
    op(this.Opcodes.VAL, i - 6),
    op(this.Opcodes.VAL, i - 7),
    op(this.Opcodes.SENDER),
    op(this.Opcodes.REPORT),
    op(this.Opcodes.BLOCK_NUMBER),
    op(
      this.Opcodes.SELECT_LTE,
      selectLte(selectLteLogic.every, selectLteMode.first, 2)
    ),
    op(this.Opcodes.ZIPMAP, callSize(2, 3, valSize)),
    op(this.Opcodes.MAX, 8),
    op(this.Opcodes.MUL, 2),
    op(this.Opcodes.VAL, i - 5),
    op(this.Opcodes.DIV, 2),
    op(this.Opcodes.VAL, i - 4),
    op(this.Opcodes.ADD, 2),
  ];

  public static TIER_DISCOUNTS_FN = (i: number) =>
    VM.createVMSources([
      [this.Opcodes.VAL, i - 1],
      [this.Opcodes.VAL, arg(0)],
      [this.Opcodes.SUB, 2],
    ])[0];

  public static TIER_CAP_MULTIPLIER_FN = (i: number) =>
    VM.createVMSources([
      [this.Opcodes.VAL, arg(0)],
      [this.Opcodes.VAL, i - 3],
      [this.Opcodes.LESS_THAN],
      [this.Opcodes.VAL, arg(0)],
      [this.Opcodes.VAL, i - 5],
      [this.Opcodes.EAGER_IF],
    ])[0];

  public static TIER_PERK_ACTIVATION = (i: number) =>
    VM.createVMSources([
      [this.Opcodes.NEVER],
      [this.Opcodes.BLOCK_NUMBER],
      [
        this.Opcodes.UPDATE_BLOCKS_FOR_TIER_RANGE,
        tierRange(Tier.ZERO, Tier.EIGHT),
      ],
      [this.Opcodes.VAL, i - 3],
      [this.Opcodes.SENDER],
      [this.Opcodes.REPORT],
      [this.Opcodes.SATURATING_DIFF],
      [this.Opcodes.VAL, i - 4],
    ])[0];

  public static TIER_PERK_ACTIVATION_FN = (i: number) =>
    VM.createVMSources([
      [this.Opcodes.VAL, arg(1)],
      [this.Opcodes.VAL, arg(2)],
      [this.Opcodes.LESS_THAN],
      [this.Opcodes.VAL, i - 1],
    ])[0];

  public static saleStateConfigGenerator = (
    saleParams: SaleParams,
    deployerAddress: string
  ): SaleConfig => {
    const constants = this.saleConstantsGenerator(saleParams);
    const sources = this.saleSourcesGenerator(saleParams, constants.length);
    return {
      canStartStateConfig: this.canStartEndConfigGenerator(
        saleParams.inputValues.startTimestamp,
        0,
        saleParams,
        deployerAddress
      ),
      canEndStateConfig: this.canStartEndConfigGenerator(
        saleParams.inputValues.endTimestamp,
        saleParams.canEndType,
        saleParams,
        deployerAddress
      ),
      calculatePriceStateConfig: {
        sources,
        constants,
        stackLength:
          (sources[0].length + sources[1].length + sources[2].length) / 2 + 5,
        argumentsLength:
          saleParams.tierDiscountType +
          saleParams.tierCapMulType +
          (saleParams.tierDiscountActType + saleParams.tierCapMulActType) * 2,
      },
      recipient: saleParams.inputValues.recipient,
      reserve: saleParams.inputValues.reserve,
      saleTimeout: saleParams.inputValues.saleTimeout,
      cooldownDuration: parseInt(saleParams.inputValues.cooldownDuration),
      minimumRaise: parseUnits(
        saleParams.inputValues.minimumRaise.toString(),
        saleParams.inputValues.reserveErc20.erc20decimals
      ),
      dustSize: 0,
    };
  };

  private static saleConstantsGenerator(saleParams: SaleParams) {
    if (saleParams.maxCapType && !saleParams.minCapType) {
      return this.capMulConstants(saleParams);
    } else if (!saleParams.maxCapType && saleParams.minCapType) {
      return [
        ...this.tierDiscountConstants(saleParams),
        parseUnits(saleParams.inputValues.minWalletCap.toString()).sub(1),
        constants.MaxUint256,
      ];
    } else if (saleParams.maxCapType && saleParams.minCapType) {
      return [
        ...this.capMulConstants(saleParams),
        parseUnits(saleParams.inputValues.minWalletCap.toString()).sub(1),
      ];
    } else return this.tierDiscountConstants(saleParams);
  }

  private static saleSourcesGenerator(saleParams: SaleParams, i: number) {
    let j =
      i - 2 - (saleParams.tierCapMulType * 5 + saleParams.tierCapMulActType);
    const CAP_CONDITION_SOURCES = (i: number) =>
      VM.createVMSources([[this.Opcodes.VAL, i], [this.Opcodes.EAGER_IF]])[0];

    if (saleParams.maxCapType && !saleParams.minCapType) {
      return [
        concat([
          this.tierCapMulSources(saleParams, i)[0],
          this.tierDiscountSources(saleParams, j)[0],
          CAP_CONDITION_SOURCES(i - 1),
        ]),
        this.tierDiscountSources(saleParams, j)[1],
        this.tierCapMulSources(saleParams, i)[1],
      ];
    } else if (!saleParams.maxCapType && saleParams.minCapType) {
      return [
        concat([
          this.MIN_CAP_SOURCES(i - 2),
          this.tierDiscountSources(saleParams, i - 2)[0],
          CAP_CONDITION_SOURCES(i - 1),
        ]),
        this.tierDiscountSources(saleParams, i - 2)[1],
        concat([]),
      ];
    } else if (saleParams.maxCapType && saleParams.minCapType) {
      return [
        concat([
          this.tierCapMulSources(saleParams, i - 1)[0],
          this.MIN_CAP_SOURCES(i - 1),
          op(this.Opcodes.EVERY, 2),
          this.tierDiscountSources(saleParams, j - 1)[0],
          CAP_CONDITION_SOURCES(i - 2),
        ]),
        this.tierDiscountSources(saleParams, j - 1)[1],
        this.tierCapMulSources(saleParams, i - 1)[1],
      ];
    } else return [...this.tierDiscountSources(saleParams, i), concat([])];
  }

  private static tierDiscountConstants(saleParams: SaleParams) {
    if (saleParams.tierDiscountType) {
      const TierDiscount = paddedUInt256(
        BigNumber.from(
          '0x' +
            paddedUInt32(100 - saleParams.inputValues.discountTier8) +
            paddedUInt32(100 - saleParams.inputValues.discountTier7) +
            paddedUInt32(100 - saleParams.inputValues.discountTier6) +
            paddedUInt32(100 - saleParams.inputValues.discountTier5) +
            paddedUInt32(100 - saleParams.inputValues.discountTier5) +
            paddedUInt32(100 - saleParams.inputValues.discountTier3) +
            paddedUInt32(100 - saleParams.inputValues.discountTier2) +
            paddedUInt32(100 - saleParams.inputValues.discountTier1)
        )
      );
      if (saleParams.tierDiscountActType) {
        return [
          ...this.exTimeDiscountConstants(saleParams),
          paddedUInt256(
            BigNumber.from(
              '0x' +
                paddedUInt32(saleParams.inputValues.discountActTier8 * 43200) +
                paddedUInt32(saleParams.inputValues.discountActTier7 * 43200) +
                paddedUInt32(saleParams.inputValues.discountActTier6 * 43200) +
                paddedUInt32(saleParams.inputValues.discountActTier5 * 43200) +
                paddedUInt32(saleParams.inputValues.discountActTier4 * 43200) +
                paddedUInt32(saleParams.inputValues.discountActTier3 * 43200) +
                paddedUInt32(saleParams.inputValues.discountActTier2 * 43200) +
                paddedUInt32(saleParams.inputValues.discountActTier1 * 43200)
            )
          ),
          saleParams.inputValues.tierDiscountAddress,
          TierDiscount,
          '100',
        ];
      } else
        return [
          ...this.exTimeDiscountConstants(saleParams),
          saleParams.inputValues.tierDiscountAddress,
          TierDiscount,
          '100',
        ];
    } else return this.exTimeDiscountConstants(saleParams);
  }

  private static capMulConstants(saleParams: SaleParams) {
    if (saleParams.tierCapMulType) {
      const TierCapMultiplier = paddedUInt256(
        BigNumber.from(
          '0x' +
            paddedUInt32(saleParams.inputValues.capMulTier8 * 100) +
            paddedUInt32(saleParams.inputValues.capMulTier7 * 100) +
            paddedUInt32(saleParams.inputValues.capMulTier6 * 100) +
            paddedUInt32(saleParams.inputValues.capMulTier5 * 100) +
            paddedUInt32(saleParams.inputValues.capMulTier4 * 100) +
            paddedUInt32(saleParams.inputValues.capMulTier3 * 100) +
            paddedUInt32(saleParams.inputValues.capMulTier2 * 100) +
            paddedUInt32(saleParams.inputValues.capMulTier1 * 100)
        )
      );
      if (saleParams.tierCapMulActType) {
        return [
          ...this.tierDiscountConstants(saleParams),
          paddedUInt256(
            BigNumber.from(
              '0x' +
                paddedUInt32(saleParams.inputValues.capMulActTier8 * 43200) +
                paddedUInt32(saleParams.inputValues.capMulActTier7 * 43200) +
                paddedUInt32(saleParams.inputValues.capMulActTier6 * 43200) +
                paddedUInt32(saleParams.inputValues.capMulActTier5 * 43200) +
                paddedUInt32(saleParams.inputValues.capMulActTier4 * 43200) +
                paddedUInt32(saleParams.inputValues.capMulActTier3 * 43200) +
                paddedUInt32(saleParams.inputValues.capMulActTier2 * 43200) +
                paddedUInt32(saleParams.inputValues.capMulActTier1 * 43200)
            )
          ),
          saleParams.inputValues.tierCapMulAddress,
          TierCapMultiplier,
          '100',
          '1',
          '0xffffffff',
          parseUnits(saleParams.inputValues.maxWalletCap.toString()),
          constants.MaxUint256,
        ];
      } else
        return [
          ...this.tierDiscountConstants(saleParams),
          saleParams.inputValues.tierCapMulAddress,
          TierCapMultiplier,
          '100',
          '1',
          '0xffffffff',
          parseUnits(saleParams.inputValues.maxWalletCap.toString()),
          constants.MaxUint256,
        ];
    } else
      return [
        ...this.tierDiscountConstants(saleParams),
        parseUnits(saleParams.inputValues.maxWalletCap.toString()).add(1),
        constants.MaxUint256,
      ];
  }

  private static exTimeDiscountConstants(saleParams: SaleParams) {
    if (saleParams.canEndType && saleParams.extraTimeDiscountType) {
      return [
        ...this.saleConstantsSelector(
          saleParams.inputValues,
          saleParams.saleType
        ),
        saleParams.inputValues.endTimestamp,
        parseUnits(
          saleParams.inputValues.extraTimeDiscountThreshold.toString()
        ),
        100 - saleParams.inputValues.extraTimeDiscount,
        100,
      ];
    } else
      return this.saleConstantsSelector(
        saleParams.inputValues,
        saleParams.saleType
      );
  }

  private static saleConstantsSelector(
    inputValues: any,
    saleType: number
  ):
    | [BigNumber]
    | [BigNumber, BigNumber, BigNumber, any, BigNumber]
    | [BigNumber, BigNumber, BigNumber, any] {
    if (saleType == 0) {
      return [
        parseUnits(
          inputValues.startPrice.toString(),
          inputValues.reserveErc20.erc20decimals
        ),
      ];
    } else if (saleType == 1) {
      let raiseDuration = inputValues.endTimestamp - inputValues.startTimestamp;
      let balanceReserve = inputValues.minimumRaise * 5;
      let initWeight =
        (inputValues.initialSupply * inputValues.startPrice) / balanceReserve;
      let weightChange = (initWeight - 1) / raiseDuration;
      return [
        parseUnits(
          balanceReserve.toString(),
          inputValues.reserveErc20.erc20decimals
        ),
        parseUnits(initWeight.toString()),
        parseUnits(weightChange.toFixed(5).toString()),
        inputValues.startTimestamp,
        parseUnits(Number('1').toString()),
      ];
    } else if (saleType == 2) {
      let raiseDuration = inputValues.endTimestamp - inputValues.startTimestamp;
      let priceChange =
        (inputValues.endPrice - inputValues.startPrice) / raiseDuration;
      return [
        parseUnits(
          inputValues.startPrice.toString(),
          inputValues.reserveErc20.erc20decimals
        ),
        parseUnits(
          inputValues.endPrice.toString(),
          inputValues.reserveErc20.erc20decimals
        ),
        parseUnits(priceChange.toFixed(5).toString()),
        inputValues.startTimestamp,
      ];
    } else {
      throw new Error('Not a valid sale type');
    }
  }

  private static tierDiscountSources(saleParams: SaleParams, i: number) {
    if (saleParams.tierDiscountType) {
      if (saleParams.tierDiscountActType) {
        const _withActivation = this.TIER_DISCOUNTS(i, 2);
        _withActivation.splice(10, 0, this.TIER_PERK_ACTIVATION(i));
        return [
          concat([
            this.exTimeDiscountSources(saleParams, i - 4),
            concat(_withActivation),
          ]),
          concat([
            this.TIER_PERK_ACTIVATION_FN(i),
            this.TIER_DISCOUNTS_FN(i),
            op(this.Opcodes.EAGER_IF),
          ]),
        ];
      } else
        return [
          concat([
            this.exTimeDiscountSources(saleParams, i - 3),
            concat(this.TIER_DISCOUNTS(i, 0)),
          ]),
          this.TIER_DISCOUNTS_FN(i),
        ];
    } else return [this.exTimeDiscountSources(saleParams, i), concat([])];
  }

  private static tierCapMulSources(saleParams: SaleParams, i: number) {
    if (saleParams.tierCapMulType) {
      if (saleParams.tierCapMulActType) {
        const _withActivation = this.TIER_CAP_MULTIPLIER(i, 2);
        _withActivation.splice(7, 0, this.TIER_PERK_ACTIVATION(i - 4));
        return [
          concat([concat(_withActivation), this.MAX_CAP_SOURCES()]),
          concat([
            this.TIER_PERK_ACTIVATION_FN(i - 4),
            this.TIER_CAP_MULTIPLIER_FN(i),
            op(this.Opcodes.EAGER_IF),
          ]),
        ];
      } else
        return [
          concat([
            concat(this.TIER_CAP_MULTIPLIER(i, 0)),
            this.MAX_CAP_SOURCES(),
          ]),
          this.TIER_CAP_MULTIPLIER_FN(i),
        ];
    } else
      return [
        concat([op(this.Opcodes.VAL, i - 2), this.MAX_CAP_SOURCES()]),
        concat([]),
      ];
  }

  private static saleSourcesSelector(saleType: number) {
    if (saleType == 0) {
      return this.FIXED_PRICE_SOURCES();
    } else if (saleType == 1) {
      return this.vFLO_SOURCES();
    } else if (saleType == 2) {
      return this.INC_PRICE_SOURCES();
    } else {
      throw new Error('Not a valid sale type');
    }
  }

  private static exTimeDiscountSources(saleParams: SaleParams, i: number) {
    const DISCOUNT_CONDITION_SOURCES = (i: number) =>
      concat([
        op(this.Opcodes.VAL, i - 2),
        op(this.Opcodes.MUL, 2),
        op(this.Opcodes.VAL, i - 1),
        op(this.Opcodes.DIV, 2),
        op(this.Opcodes.EAGER_IF),
      ]);
    if (saleParams.canEndType && saleParams.extraTimeDiscountType) {
      let j = saleParams.maxCapType || saleParams.minCapType ? 2 : 1;
      return concat([
        this.EXTRA_TIME_DISCOUNT(i),
        this.saleSourcesSelector(saleParams.saleType),
        op(this.Opcodes.DUP, j),
        DISCOUNT_CONDITION_SOURCES(i),
      ]);
    } else return this.saleSourcesSelector(saleParams.saleType);
  }

  private static canStartEndConfigGenerator(
    timestamp: number,
    canEndType: number,
    saleParams: SaleParams,
    deployerAddress: string
  ): StateConfig {
    const ExtraTimeAmount = parseUnits(
      saleParams.inputValues.extraTimeAmount.toString()
    );
    const ExtraTime = saleParams.inputValues.extraTime * 60 + timestamp;
    let constants;
    let sources;
    if (canEndType && saleParams.creatorControlType) {
      constants = [timestamp, ExtraTime, ExtraTimeAmount, deployerAddress];
      sources = [
        concat([
          this.AFTER_TIMESTAMP(),
          this.EXTRA_TIME(),
          this.CREATOR_CONTROL(3),
        ]),
      ];
    } else if (canEndType && !saleParams.creatorControlType) {
      constants = [timestamp, ExtraTime, ExtraTimeAmount];
      sources = [concat([this.AFTER_TIMESTAMP(), this.EXTRA_TIME()])];
    } else if (!canEndType && saleParams.creatorControlType) {
      constants = [timestamp, deployerAddress];
      sources = [concat([this.AFTER_TIMESTAMP(), this.CREATOR_CONTROL(1)])];
    } else if (!canEndType && !saleParams.creatorControlType) {
      constants = [timestamp];
      sources = [this.AFTER_TIMESTAMP()];
    } else {
      throw new Error('Not a valid sale type');
    }
    return {
      constants,
      sources,
      stackLength: sources[0].length / 2 + 5,
      argumentsLength: 0,
    };
  }
}

/**
 * @public
 *
 * The configuration of the sale
 */
export interface SaleConfig {
  /**
   * State config for the script that allows a Sale to start.
   */
  canStartStateConfig: StateConfig;
  /**
   * State config for the script that allows a Sale to end. IMPORTANT: A Sale can always end if/when its rTKN sells out, regardless
   * of the result of this script.
   */
  canEndStateConfig: StateConfig;
  /**
   * State config for the script that defines the current price quoted by a Sale.
   */
  calculatePriceStateConfig: StateConfig;
  /**
   * The recipient of the proceeds of a Sale, if/when the Sale is successful.
   */
  recipient: string;
  /**
   * The reserve token the Sale is deonominated in.
   */
  reserve: string;
  /**
   * The number of blocks before this sale can timeout. SHOULD be well after the expected end time as a timeout will fail an active
   * or pending sale regardless of any funds raised.
   */
  saleTimeout: BigNumberish;
  /**
   * The amount of blocks after each buy/refund, before a user is allowed another buy/refund.
   */
  cooldownDuration: BigNumberish;
  /**
   * defines the amount of reserve required to raise tha defines success/fail of the sale. Reaching the minimum raise DOES NOT cause
   * the raise to end early (unless the "can end" script allows it of course).
   */
  minimumRaise: BigNumberish;
  /**
   * The minimum amount of rTKN that must remain in the Sale contract unless it is all purchased, clearing the raise to 0 stock and
   * thus ending the raise.
   */
  dustSize: BigNumberish;
}

/**
 * @public
 *
 * Configuration that will have the Redeemable of the Sale
 */
export interface SaleRedeemableERC20Config {
  /**
   * ERC20 config
   */
  erc20Config: ERC20Config;
  /**
   * Tier contract to compare statuses against on transfer. This effectively gates participation in a Sale.
   */
  tier: string;
  /**
   * Minimum tier required for transfers (i.e. to participate). Can be '0'.
   */
  minimumTier: BigNumberish;
  /**
   * Optional address to send rTKN to at the end of the distribution phase. If `0` address then all undistributed rTKN will burn itself at the end of the distribution.
   */
  distributionEndForwardingAddress: string;
}

/**
 * @public
 *
 * Arguments to deploy/create a new Sale
 */
export interface SaleDeployArguments {
  /**
   * Everything required to configure (initialize) a Sale.
   */
  saleConfig: SaleConfig;
  /**
   * Config for the RedeemableERC20 token that is minted by the Sale
   */
  saleRedeemableERC20Config: SaleRedeemableERC20Config;
}

/**
 * @public
 *
 * The configuration that is need it to buy in the sale
 */
export interface BuyConfig {
  feeRecipient: string;
  fee: BigNumberish;
  minimumUnits: BigNumberish;
  desiredUnits: BigNumberish;
  maximumPrice: BigNumberish;
}

/**
 * @public
 *
 * The receipt that contain the information of the buy
 */
export interface Receipt {
  price: BigNumberish;
  id: BigNumberish;
  feeRecipient: string;
  fee: BigNumberish;
  units: BigNumberish;
}

/**
 *
 */
export type SaleParams = {
  inputValues: any;
  saleType: number;
  maxCapType: 0 | 1;
  minCapType: 0 | 1;
  canEndType: 0 | 1;
  extraTimeDiscountType: 0 | 1;
  tierDiscountType: 0 | 1;
  tierDiscountActType: 0 | 1;
  tierCapMulType: 0 | 1;
  tierCapMulActType: 0 | 1;
  creatorControlType: 0 | 1;
};
