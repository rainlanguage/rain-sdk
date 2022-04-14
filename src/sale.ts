import { BigNumberish, Signer, Overrides } from 'ethers';
import { AddressBook } from './addresses';
import { RainContract } from './rain-contract';
import {
  Sale__factory,
  Sale as SaleContract,
  SaleFactory__factory,
} from './typechain';
import { StateConfigStruct } from './typechain/Sale';

/**
 * A class for deploying and calling methods on a Sale.
 * @remarks
 *
 * This class provides an easy way to deploy Sales using Rain's canonical factories, and methods for interacting with an already deployed Sale.
 * @example
 * ```typescript
 * import { Sale } from 'rain-sdk'
 * // To deploy a new Sale, pass an ethers.js Signer, the chainId and the config for the Sale.
 * const newSale = await Sale.deploy(signer, chainId, {_config, saleRedeemableERC20Config_})
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

export class Sale extends RainContract {
  public readonly sale!: SaleContract;

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
    this.sale = Sale__factory.connect(address, signer);
  }

  /**
   * Deploys a new Sale.
   *
   * @param signer - An ethers.js Signer
   * @param chainId - The chain id of the network (e.g. 80001)
   * @param args - Arguments for deploying a Sale @see SaleDeployArguments
   * @param overrides - Specific transaction values to send it (e.g gasLimit, nonce or gasPrice)
   * @returns A new Sale instance
   *
   */
  public static deploy = async (
    signer: Signer,
    chainId: number,
    args: SaleDeployArguments,
    overrides: Overrides = {}
  ) => {
    const saleFactory = SaleFactory__factory.connect(
      AddressBook.getAddressesForChainId(chainId).saleFactory,
      signer
    );

    const { saleConfig, saleRedeemableERC20Config } = args;

    const tx = await saleFactory.createChildTyped(
      saleConfig,
      saleRedeemableERC20Config,
      overrides
    );

    const receipt = await tx.wait();

    const address = super.getNewChildFromReceipt(receipt, saleFactory);

    return new Sale(address, signer);
  };

  /**
   * Checks if address is registered as a child contract of this SaleFactory on a specific network
   *
   * @param signer - An ethers.js Signer
   * @param chainId - The chain id of the network (e.g. 80001)
   * @param maybeChild - Address to check registration for.
   * @returns `true` if address was deployed by this contract factory, otherwise `false`
   */
  public static isChild = async (
    signer: Signer,
    chainId: number,
    maybeChild: string
  ): Promise<boolean> => {
    return await super._isChild(
      signer,
      AddressBook.getAddressesForChainId(chainId).saleFactory,
      maybeChild
    );
  };

  // TODO: Currently, these properties are not initialized. Need to assign them in construction time
  public readonly buy = this.sale.buy;
  public readonly calculatePrice = this.sale.calculatePrice;
  public readonly canEnd = this.sale.canEnd;
  public readonly canStart = this.sale.canStart;
  public readonly claimFees = this.sale.claimFees;
  public readonly end = this.sale.end;
  public readonly start = this.sale.start;
  public readonly refund = this.sale.refund;
  public readonly reserve = this.sale.reserve;
  public readonly token = this.sale.token;
  public readonly saleStatus = this.sale.saleStatus;
}

interface SaleConfigStruct {
  /**
   * State config for the script that allows a Sale to start.
   */
  canStartStateConfig: StateConfigStruct;
  /**
   * State config for the script that allows a Sale to end. IMPORTANT: A Sale can always end if/when its rTKN sells out, regardless
   * of the result of this script.
   */
  canEndStateConfig: StateConfigStruct;
  /**
   * State config for the script that defines the current price quoted by a Sale.
   */
  calculatePriceStateConfig: StateConfigStruct;
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

interface SaleRedeemableERC20ConfigStruct {
  /**
   * ERC20 config
   */
  erc20Config: ERC20ConfigStruct;
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

interface ERC20ConfigStruct {
  /**
   * Name as defined by Open Zeppelin ERC20.
   */
  name: string;
  /**
   * Symbol as defined by Open Zeppelin ERC20.
   */
  symbol: string;
  /**
   * Distributor address of the initial supply.
   */
  distributor: string;
  /**
   * Initial supply to mint.
   */
  initialSupply: BigNumberish;
}

interface SaleDeployArguments {
  /**
   * Everything required to configure (initialize) a Sale.
   */
  saleConfig: SaleConfigStruct;
  /**
   * Config for the RedeemableERC20 token that is minted by the Sale
   */
  saleRedeemableERC20Config: SaleRedeemableERC20ConfigStruct;
}
