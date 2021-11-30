import {
  ERC20,
  ERC20__factory,
  RedeemableERC20,
  RedeemableERC20__factory,
} from '@beehiveinnovation/rain-protocol/typechain';
import { Token } from '@uniswap/sdk-core';
import { ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';

export class Redeemable {
  public readonly chainId: number;
  public readonly signerOrProvider: Signer | Provider;
  protected token: Token | any = null;
  public readonly contract: RedeemableERC20;

  constructor(contract: RedeemableERC20, chainId: number) {
    this.chainId = chainId;
    this.contract = contract;
    this.signerOrProvider = contract.signer || contract.provider;
    Object.assign(this, contract);
  }

  public static async fromAddress(
    address: string,
    signerOrProvider: Signer | Provider,
    chainId: number
  ): Promise<Redeemable> {
    const redeemableERC20 = RedeemableERC20__factory.connect(
      address,
      signerOrProvider
    );
    return new Redeemable(redeemableERC20, chainId);
  }

  public async getToken(): Promise<Token> {
    this.token =
      this.token ||
      new Token(
        this.chainId,
        this.contract.address,
        await this.contract.decimals(),
        await this.contract.symbol(),
        await this.contract.name()
      );
    return this.token;
  }

  public async getRedeemablesContracts(): Promise<ERC20[]> {
    const redeemAddresses = (await this.contract.getRedeemables()).filter(
      (address: string) => {
        return address !== ethers.constants.AddressZero;
      }
    );
    return redeemAddresses.map((address: string) => {
      return ERC20__factory.connect(address, this.signerOrProvider);
    });
  }

  public async getRedeemablesTokens(): Promise<Token[]> {
    return await Promise.all(
      (await this.getRedeemablesContracts()).map(async (contract: ERC20) => {
        return new Token(
          this.chainId,
          contract.address,
          await contract.decimals(),
          await contract.symbol(),
          await contract.name()
        );
      })
    );
  }

  // @TODO
  public getRedeemableShares() {}
}
