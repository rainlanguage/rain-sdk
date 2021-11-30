import {
  ConfigurableRightsPool,
  ConfigurableRightsPool__factory,
} from '@beehiveinnovation/rain-protocol/typechain/';
import { Token } from '@uniswap/sdk-core';
import { Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';

export class CRP {
  public readonly chainId: number;
  public readonly signerOrProvider: Signer | Provider;
  protected token: Token | any = null;
  public readonly contract: ConfigurableRightsPool;

  constructor(contract: ConfigurableRightsPool, chainId: number) {
    this.chainId = chainId;
    this.contract = contract;
    this.signerOrProvider = contract.signer || contract.provider;
    Object.assign(this, contract);
  }

  public static async fromAddress(
    address: string,
    signerOrProvider: Signer | Provider,
    chainId: number
  ): Promise<CRP> {
    const crp = ConfigurableRightsPool__factory.connect(
      address,
      signerOrProvider
    );
    return new CRP(crp, chainId);
  }
}
