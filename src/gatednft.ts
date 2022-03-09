import {
  GatedNFT__factory,
  GatedNFT as GatedNFTContract,
  GatedNFTFactory__factory,
  GatedNFTFactory as GatedNFTFactoryContract,
} from './typechain/rain-statusfi';
import { ContractReceipt, Signer } from 'ethers';
import { AddressBook } from '.';
import { ConfigStruct } from './typechain/rain-statusfi/GatedNFTFactory';
import { getNewChildFromReceipt } from './utils';

enum Transferrable {
  NonTransferrable,
  Transferrable,
  TierGatedTransferrable,
}

export class GatedNFTFactory {
  public readonly chainId: number;
  public readonly signer: Signer;
  public readonly gatedNFTFactory: GatedNFTFactoryContract;
  public readonly gatedNFT: GatedNFTFactoryContract;

  constructor(signer: Signer, chainId: number, address?: string) {
    console.log(signer);
    this.chainId = chainId;
    this.signer = signer;
    const _address =
      address || AddressBook.getAddressesForChainId(chainId).gatedNFT;
    this.gatedNFTFactory = GatedNFTFactory__factory.connect(_address, signer);
  }

  public async createChild(
    config: ConfigStruct,
    tier: string,
    minimumStatus: number,
    maxPerAddress: number,
    transferrable: Transferrable,
    maxMintable: number,
    royaltyRecipient: string,
    royaltyBPS: number
  ) {
    return this.gatedNFTFactory.createChildTyped(
      config,
      tier,
      minimumStatus,
      maxPerAddress,
      transferrable,
      maxMintable,
      royaltyRecipient,
      royaltyBPS
    );
  }
  // @TODO create a GatedNFT class and return that instead of the raw ethers Contract instance.
  public getFromAddress(address: string): GatedNFTContract {
    return GatedNFT__factory.connect(address, this.signer);
  }

  public getNewChildFromReceipt(receipt: ContractReceipt): GatedNFTContract {
    const childAddress = getNewChildFromReceipt(receipt, this.gatedNFTFactory);
    return GatedNFT__factory.connect(childAddress, this.signer);
  }
}
