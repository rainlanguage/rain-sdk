import { BigNumber } from '@ethersproject/bignumber';

export type TrustConfig = {
  creator: string;
  minimumCreatorRaise: BigNumber;
  seeder: string;
  seederFee: BigNumber;
  seederUnits: BigNumber;
  seederCooldownDuration: BigNumber;
  redeemInit: BigNumber;
};

export type RedeemableERC20Config = {
  name: string;
  symbol: string;
  tier: string;
  minimumStatus: BigNumber;
  totalSupply: BigNumber;
};

export type RedeemableERC20PoolConfig = {
  reserve: string;
  reserveInit: BigNumber;
  initialValuation: BigNumber;
  finalValuation: BigNumber;
  minimumTradingDuration: BigNumber;
};

export type Config = {
  trustConfig: TrustConfig;
  redeemableERC20Config: RedeemableERC20Config;
  redeemableERC20PoolConfig: RedeemableERC20PoolConfig;
};
