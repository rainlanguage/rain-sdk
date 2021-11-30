import {
  SeedERC20 as SeedERC20Contract,
  SeedERC20__factory,
} from '@beehiveinnovation/rain-protocol/typechain/';
import { Token } from '@uniswap/sdk-core';
import { Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { memoize } from 'async';

export class SeedERC20 {
  public readonly chainId: number;
  public readonly signerOrProvider: Signer | Provider;
  public readonly contract: SeedERC20Contract;

  constructor(contract: SeedERC20Contract, chainId: number) {
    this.chainId = chainId;
    this.contract = contract;
    this.signerOrProvider = contract.signer || contract.provider;
  }

  public static async fromAddress(
    address: string,
    signerOrProvider: Signer | Provider,
    chainId: number
  ): Promise<SeedERC20> {
    const seeder = SeedERC20__factory.connect(address, signerOrProvider);
    return new SeedERC20(seeder, chainId);
  }

  public getToken = async () => memoize(this._getToken);

  protected async _getToken(): Promise<Token> {
    return new Token(
      this.chainId,
      this.contract.address,
      await this.contract.decimals(),
      await this.contract.symbol(),
      await this.contract.name()
    );
  }
}
