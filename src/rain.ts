import { BigNumberish, Signer } from 'ethers';
import { GatedNFT, Transferrable } from './gatednft';
import { ConfigStruct } from './typechain/GatedNFT';

export class Rain {
  public readonly chainId!: number;
  public readonly signer!: Signer;

  constructor(signer: Signer, chainId: number) {
    this.chainId = chainId;
    this.signer = signer;
  }

  public deploy = {
    gatedNft: async (
      config: ConfigStruct,
      tier: string,
      minimumStatus: BigNumberish,
      maxPerAddress: BigNumberish,
      transferrable: Transferrable,
      maxMintable: BigNumberish,
      royaltyRecipient: string,
      royaltyBPS: BigNumberish
    ): Promise<GatedNFT> => {
      return await GatedNFT.deploy(this.signer, this.chainId, {
        config,
        tier,
        minimumStatus,
        maxPerAddress,
        transferrable,
        maxMintable,
        royaltyRecipient,
        royaltyBPS,
      });
    },
  };
}
