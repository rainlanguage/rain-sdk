import {
  BPool__factory,
  BPool,
} from '@beehiveinnovation/rain-protocol/typechain/';
import { Token } from '@uniswap/sdk-core';
import { Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';

export class Pool {
  public readonly chainId: number;
  public readonly signerOrProvider: Signer | Provider;
  protected token: Token | any = null;
  public readonly contract: BPool;

  constructor(contract: BPool, chainId: number) {
    this.chainId = chainId;
    this.contract = contract;
    this.signerOrProvider = contract.signer || contract.provider;
    Object.assign(this, contract);
  }

  public static async fromAddress(
    address: string,
    signerOrProvider: Signer | Provider,
    chainId: number
  ): Promise<Pool> {
    const bPool = BPool__factory.connect(address, signerOrProvider);
    return new Pool(bPool, chainId);
  }
}
