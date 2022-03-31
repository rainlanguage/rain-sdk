import { BigNumberish, Signer } from 'ethers';
import { AddressBook } from './addresses';
import { RainContract } from './rain-contract';
import {
  Sale__factory,
  Sale as SaleContract,
  SaleFactory__factory,
} from './typechain/rain-protocol';
import {
  SaleRedeemableERC20ConfigStruct,
  StateConfigStruct,
} from './typechain/rain-protocol/Sale';

interface SaleConfigStruct {
  /**
   * The state config for 'can start'
   */
  canStartStateConfig: StateConfigStruct;
  canEndStateConfig: StateConfigStruct;
  calculatePriceStateConfig: StateConfigStruct;
  recipient: string;
  reserve: string;
  cooldownDuration: BigNumberish;
  minimumRaise: BigNumberish;
  dustSize: BigNumberish;
}
interface SaleDeployArguments {
  /**
   * Config for the Sale
   */
  _config: SaleConfigStruct;
  /**
   * Config for the RedeemableERC20 token that is minted by the Sale
   */
  saleRedeemableERC20Config_: SaleRedeemableERC20ConfigStruct;
}

export class Sale extends RainContract {
  public readonly signer: Signer;
  public readonly sale!: SaleContract;
  public deploy: Function;

  /**
   * Constructs a new Sale from a known address.
   *
   * @param address - The address of the Sale contract
   * @param signer - An ethers.js Signer
   * @returns A new Sale instance
   *
   */
  constructor(address: string, signer: Signer) {
    super();
    this.signer = signer;
    this.sale = Sale__factory.connect(address, signer);
  }

  /**
   * Deploys a new Sale.
   *
   * @param signer - An ethers.js Signer
   * @param chainId - The chain id of the network (e.g. 80001)
   * @param args - Arguments for deploying a Sale @see SaleDeployArguments
   * @returns A new Sale instance
   *
   */
  public static deploy = async (
    signer: Signer,
    chainId: number,
    args: SaleDeployArguments
  ) => {
    const { _config, saleRedeemableERC20Config_ } = args;
    const saleFactory = SaleFactory__factory.connect(
      AddressBook.getAddressesForChainId(chainId).gatedNFT,
      signer
    );

    const tx = await saleFactory.createChildTyped(
      _config,
      saleRedeemableERC20Config_
    );

    const receipt = await tx.wait();

    const address = super.getNewChildFromReceipt(receipt, saleFactory);

    return new Sale(address, signer);
  };

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
