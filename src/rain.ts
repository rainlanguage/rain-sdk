import { BigNumberish, Signer } from 'ethers';
import { GatedNFT, Transferrable } from './gatednft';
import { ConfigStruct } from './typechain/rain-statusfi/GatedNFT';

export class Rain {
  public readonly chainId!: number;
  public readonly signer!: Signer;

  constructor(signer: Signer, chainId: number) {
    this.chainId = chainId;
    this.signer = signer;
  }

  public deploy = {
    gatedNft: async (
      config_: ConfigStruct,
      tier_: string,
      minimumStatus_: BigNumberish,
      maxPerAddress_: BigNumberish,
      transferrable_: Transferrable,
      maxMintable_: BigNumberish,
      royaltyRecipient_: string,
      royaltyBPS: BigNumberish
    ): Promise<GatedNFT> => {
      return await GatedNFT.deploy(this.signer, this.chainId, {
        config_,
        tier_,
        minimumStatus_,
        maxPerAddress_,
        transferrable_,
        maxMintable_,
        royaltyRecipient_,
        royaltyBPS,
      });
    },
  };
}
