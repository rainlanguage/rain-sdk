import {
  RedeemableERC20Pool as RedeemableERC20PoolContract,
  RedeemableERC20Pool__factory,
} from '@beehiveinnovation/rain-protocol/typechain';
import { Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';

export class RedeemableERC20Pool {
  public readonly chainId: number;
  public readonly contract: RedeemableERC20PoolContract;
  protected readonly signerOrProvider;

  constructor(contract: RedeemableERC20PoolContract, chainId: number) {
    this.chainId = chainId;
    this.contract = contract;
    this.signerOrProvider = contract.signer || contract.provider;
    Object.assign(this, contract);
  }

  public static async fromAddress(
    address: string,
    signerOrProvider: Signer | Provider,
    chainId: number
  ): Promise<RedeemableERC20Pool> {
    const redeemableERC20PoolContract = RedeemableERC20Pool__factory.connect(
      address,
      signerOrProvider
    );
    return new RedeemableERC20Pool(redeemableERC20PoolContract, chainId);
  }
}
