import {
  ERC20,
  ERC20__factory,
} from '@beehiveinnovation/rain-protocol/typechain/';
import { Token } from '@uniswap/sdk-core';
import { Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';

export class Reserve {
  public readonly chainId: number;
  public readonly signerOrProvider: Signer | Provider;
  public readonly contract: ERC20;

  constructor(contract: ERC20, chainId: number) {
    this.chainId = chainId;
    this.contract = contract;
    this.signerOrProvider = contract.signer || contract.provider;
    Object.assign(this, contract);
  }

  public static async fromAddress(
    address: string,
    signerOrProvider: Signer | Provider,
    chainId: number
  ): Promise<Reserve> {
    const reserve = ERC20__factory.connect(address, signerOrProvider);
    return new Reserve(reserve, chainId);
  }

  public async getToken(): Promise<Token> {
    return new Token(
      this.chainId,
      this.contract.address,
      await this.contract.decimals(),
      await this.contract.symbol(),
      await this.contract.name()
    );
  }
}
