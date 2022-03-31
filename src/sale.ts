import { Signer } from 'ethers';
import { AddressBook } from './addresses';
import { RainContract } from './rain-contract';
import {
  Sale__factory,
  Sale as SaleContract,
  SaleFactory__factory,
} from './typechain/rain-protocol';
import {
  SaleConfigStruct,
  SaleRedeemableERC20ConfigStruct,
} from './typechain/rain-protocol/Sale';

type SaleDeployArgs = {
  _config: SaleConfigStruct;
  saleRedeemableERC20Config_: SaleRedeemableERC20ConfigStruct;
};

export class Sale extends RainContract {
  public readonly signer: Signer;
  public readonly sale!: SaleContract;
  public deploy: Function;

  constructor(address: string, signer: Signer) {
    super();
    this.signer = signer;
    this.sale = Sale__factory.connect(address, signer);
  }

  public static deploy = async (
    signer: Signer,
    chainId: number,
    { _config, saleRedeemableERC20Config_ }: SaleDeployArgs
  ) => {
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
