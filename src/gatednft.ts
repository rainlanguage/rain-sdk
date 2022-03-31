import {
  GatedNFT__factory,
  GatedNFT as GatedNFTContract,
  GatedNFTFactory__factory,
} from './typechain/rain-statusfi';
import { BigNumberish, CallOverrides, Signer } from 'ethers';
import { ConfigStruct } from './typechain/rain-statusfi/GatedNFTFactory';
import { RainContract } from './rain-contract';
import { AddressBook } from './addresses';

export enum Transferrable {
  NonTransferrable,
  Transferrable,
  TierGatedTransferrable,
}

type GatedNFTArgs = {
  config_: ConfigStruct;
  tier_: string;
  minimumStatus_: BigNumberish;
  maxPerAddress_: BigNumberish;
  transferrable_: Transferrable;
  maxMintable_: BigNumberish;
  royaltyRecipient_: string;
  royaltyBPS: BigNumberish;
  overrides?: CallOverrides;
};

export class GatedNFT extends RainContract {
  public readonly signer: Signer;
  public readonly gatedNFT: GatedNFTContract;
  public deploy: Function;

  constructor(address: string, signer: Signer) {
    super();
    this.signer = signer;
    this.gatedNFT = GatedNFT__factory.connect(address, signer);
  }

  public static deploy = async (
    signer: Signer,
    chainId: number,
    {
      config_,
      tier_,
      minimumStatus_,
      maxPerAddress_,
      transferrable_,
      maxMintable_,
      royaltyRecipient_,
      royaltyBPS,
    }: GatedNFTArgs
  ) => {
    const gatedNFTFactory = GatedNFTFactory__factory.connect(
      AddressBook.getAddressesForChainId(chainId).gatedNFT,
      signer
    );

    const tx = await gatedNFTFactory.createChildTyped(
      config_,
      tier_,
      minimumStatus_,
      maxPerAddress_,
      transferrable_,
      maxMintable_,
      royaltyRecipient_,
      royaltyBPS
    );

    const receipt = await tx.wait();

    const address = super.getNewChildFromReceipt(receipt, gatedNFTFactory);

    return new GatedNFT(address, signer);
  };
}
