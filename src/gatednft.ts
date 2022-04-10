import {
  GatedNFT__factory,
  GatedNFT as GatedNFTContract,
  GatedNFTFactory__factory,
} from './typechain';
import { BigNumberish, BytesLike, Signer, Overrides } from 'ethers';
// import { ConfigStruct } from './typechain/GatedNFTFactory';
import { RainContract } from './rain-contract';
import { AddressBook } from './addresses';

export class GatedNFT extends RainContract {
  public readonly gatedNFT: GatedNFTContract;

  constructor(address: string, signer: Signer) {
    super(address, signer);
    this.gatedNFT = GatedNFT__factory.connect(address, signer);
  }

  /**
   * Deploys a new GatedNFT.
   *
   * @param signer - An ethers.js Signer
   * @param chainId - The chain id of the network (e.g. 80001)
   * @param args - Arguments for deploying a GatedNFT @see GatedNFTDeployArguments
   * @param overrides - **(optional)** Specific transaction values to send it (e.g gasLimit, nonce or gasPrice)
   * @returns A new GatedNFT instance
   *
   */
  public static deploy = async (
    signer: Signer,
    chainId: number,
    args: GatedNFTDeployArguments,
    overrides: Overrides = {}
  ) => {
    const gatedNFTFactory = GatedNFTFactory__factory.connect(
      AddressBook.getAddressesForChainId(chainId).gatedNFTFactory,
      signer
    );

    const {
      config,
      tier,
      minimumStatus,
      maxPerAddress,
      transferrable,
      maxMintable,
      royaltyRecipient,
      royaltyBPS,
    } = args;

    const tx = await gatedNFTFactory.createChildTyped(
      config,
      tier,
      minimumStatus,
      maxPerAddress,
      transferrable,
      maxMintable,
      royaltyRecipient,
      royaltyBPS,
      overrides
    );

    const receipt = await tx.wait();

    const address = super.getNewChildFromReceipt(receipt, gatedNFTFactory);

    const gatedNFT = new GatedNFT(address, signer);

    // @ts-ignore
    gatedNFT.gatedNFT.deployTransaction = tx;

    return gatedNFT;
  };
}
/**
 * Determine the status about how the GatedNFT contract will handle the transfers
 */
export enum Transferrable {
  NonTransferrable,
  Transferrable,
  TierGatedTransferrable,
}

/**
 * Configuration of the basic information that will be added to the ERC721 NFT
 */
interface ConfigStruct {
  /**
   * Name of the token as defined by Open Zeppelin ERC721
   */
  name: string;
  /**
   * Symbol of the token as defined by Open Zeppelin ERC721
   */
  symbol: string;
  /**
   * Description that will contain the GatedNFT
   */
  description: string;
  /**
   * An animation url of the NFT
   */
  animationUrl: string;
  /**
   * An image url of the NFT
   */
  imageUrl: string;
  /**
   * The hash of the NFT animation
   */
  animationHash: BytesLike;
  /**
   * The hash of the NFT image
   */
  imageHash: BytesLike;
}

interface GatedNFTDeployArguments {
  /**
   * Configuration of the basic information that will be added to the ERC721 NFT
   */
  config: ConfigStruct;
  /**
   * Tier contract to compare statuses against on any transaction.
   */
  tier: string;
  /**
   * Minimum tier required for mints and transfers. Can be '0'.
   */
  minimumStatus: BigNumberish;
  /**
   * Maximun of mint that is allowed per address
   */
  maxPerAddress: BigNumberish;
  /**
   * Determine the status about how the GatedNFT contract will handle the transfers
   */
  transferrable: Transferrable;
  /**
   * Maximun of tokens that will be mint in the contract
   */
  maxMintable: BigNumberish;
  /**
   * The royalty recipient
   */
  royaltyRecipient: string;
  /**
   * The royalty BPS
   */
  royaltyBPS: BigNumberish;
}
