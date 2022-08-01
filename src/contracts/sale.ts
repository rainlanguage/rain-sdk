import { ERC20 } from './generics/erc20';
import { RedeemableERC20 } from './redeemableERC20';
import { FactoryContract } from '../classes/factoryContract';
import { StateConfig, StorageOpcodesRange } from '../classes/vm';
import { Sale__factory, SaleFactory__factory } from '../typechain';
import { BigNumberish, BigNumber, Signer, ContractTransaction } from 'ethers';
import { ERC20Config, TxOverrides, ReadTxOverrides } from '../classes/rainContract';


/**
 * @public
 * Enum for operand of the sale's Storage Opcodes
 */
export enum SaleStorage {
  /**
   * 0 or the location of the _remainingUnits property in the sale 
   * contract used as the operand for STORAGE opcode
   * operand for STORAGE opcode to stack remaining rTKN units.
   */
  RemainingUnits,
  /**
   * 1 or the location of the _totalReserveIn property in the sale 
   * contract used as the operand for STORAGE opcode.
   * operand for STORAGE opcode to stack total reserve taken in so far.
   */
  TotalReserveIn,
  /**
   * 2 or the location of the _token property in the sale 
   * contract used as the operand for STORAGE opcode.
   * operand for STORAGE opcode to stack the address of the rTKN.
   */
  TokenAddress,
  /**
   * 3 or the location of the _reserve property in the sale 
   * contract used as the operand for STORAGE opcode.
   * operand for STORAGE opcode to stack the address of the reserve token.
   */
  ReserveAddress,
  /**
   * length of Sale's valid storage opcodes - 4
   */
  length
};

/**
 * @public
 * Enum for operand of the sale's CONTEXT opcode
 */
export enum SaleContext {
  /**
   * 0 or the index of the context array in the sale 
   * contract used as the operand for CONTEXT opcode.
   * operand for CONTEXT opcode to stack the rTKN units/amount of the current buy.
   */
  CurrentBuyUnits,
  /**
   * length of Sale's valid context opcode - 1
   */
  length
}

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
  protected static readonly nameBookReference: string = 'saleFactory';

  /**
   * Constructs a new Sale from a known address.
   *
   * @param address - The address of the Sale contract
   * @param signer - An ethers.js Signer
   * @returns A new Sale instance
   *
   */
  constructor(address: string, signer: Signer) {
    super(address, signer);

    Sale.checkAddress(address);

    const _sale = Sale__factory.connect(address, signer);

    this.buy = _sale.buy;
    this.refund = _sale.refund;
    this.calculateBuy = _sale.calculateBuy;
    this.claimFees = _sale.claimFees;
    this.start = _sale.start;
    this.end = _sale.end;
    this.canLive = _sale.canLive;
    this.saleStatus = _sale.saleStatus;
    this.timeout = _sale.timeout;
    this.reserve = _sale.reserve;
    this.token = _sale.token;
    this.packedFunctionPointers = _sale.packedFunctionPointers;
    this.storageOpcodesRange = _sale.storageOpcodesRange;
    this.packedFunctionPointers = _sale.packedFunctionPointers;
  }

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

  /**
   * @public
   * Conncect to this Sale contract with another signer
   * 
   * @param signer - the signer to get connected to the Sale instance
   * @returns the Sale instance with the new signer
   */
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
   * @param targetUnits - Amount of rTKN to quote a price for, will be available for vm as CONTEXT opcode.
   * @param overrides - @see ReadTxOverrides
   * @returns The max units that can be bought and current price.
   */
  public readonly calculateBuy: (
    targetUnits: BigNumberish,
    overrides?: ReadTxOverrides
  ) => Promise<[BigNumber, BigNumber]>;

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
   * Start the sale (move from pending to active). This is also done automatically 
   * inline with each `buy` call so is optional for anon to call outside of a purchase.
   * - `canLive` MUST return true and sale status must be `Pending`.
   *
   * @param overrides - @see TxOverrides
   */
  public readonly start: (
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * End the sale (move from active to success or fail).
   * This is also done automatically inline with each `buy` call so is
   * optional for anon to call outside of a purchase.
   * - `canLive` MUST return true and sale status must be either `Active`.
   *
   * @param overrides - @see TxOverrides
   */
  public readonly end: (
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Can the sale live?
   * Evals the "can live" script.
   * If a non zero value is returned then the sale can move from pending to
   * active, or remain active.
   * If a zero value is returned the sale can remain pending or move from
   * active to a finalised status.
   * An out of stock (0 remaining units) WILL ALWAYS return `false` without
   * evaluating the script.
   * 
   * @param overrides - @see ReadTxOverrides
   * @returns true if can start the sale
   */
  public readonly canLive: (overrides?: ReadTxOverrides) => Promise<boolean>;

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

  /**
   * Pointers to opcode functions, necessary for being able to read the packedBytes
   * 
   * @param overrides - @see ReadTxOverrides
   * @returns the opcode functions pointers
   */
  public readonly packedFunctionPointers: (overrides?: ReadTxOverrides) => Promise<string>;

  /**
   * Returns the pointer and length for sale's storage opcodes
   * 
   * @param overrides - @see ReadTxOverrides
   * @returns a StorageOpcodesRange
   */
  public readonly storageOpcodesRange: (overrides?: ReadTxOverrides) => Promise<StorageOpcodesRange>;
}

/**
 * @public
 *
 * The configuration of the sale
 */
export interface SaleConfig {
  /**
   * SateConfig that has both canLive and calculateBuy StateConfigs for a sale.
   * The first item in the sources is the canLive StateConfig and the second item
   * in the sources is the calculateBuy StateConfig.
   */
  vmStateConfig: StateConfig;
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
 * The receipt that contain the information of the buy
 */
export interface Receipt {
  price: BigNumberish;
  id: BigNumberish;
  feeRecipient: string;
  fee: BigNumberish;
  units: BigNumberish;
}