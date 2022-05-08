import { expect } from 'chai';
import { ethers } from 'hardhat';
import {
  TierLevelsERC20,
  deployErc20,
  ONE,
  RESERVE_ONE,
  zeroAddress,
} from './utils';

import { ReserveTokenTest } from '../typechain';

import { VM, Sale, ERC20BalanceTier } from '../src';

describe('SDK - Sale', () => {
  let reserve: ReserveTokenTest, tier: ERC20BalanceTier;

  before('deploy required contracts', async () => {
    const [deployer] = await ethers.getSigners();
    reserve = await deployErc20(deployer);
    tier = await ERC20BalanceTier.deploy(deployer, {
      tierValues: TierLevelsERC20,
      erc20: reserve.address,
    });
  });

  it('should deploy a Sale child correctly', async () => {
    const [deployer, recipient] = await ethers.getSigners();

    // 5 blocks from now
    const startBlock = (await ethers.provider.getBlockNumber()) + 5;
    const saleDuration = 30;
    const minimumRaise = ethers.BigNumber.from('150000').mul(RESERVE_ONE);

    const totalTokenSupply = ethers.BigNumber.from('2000').mul(ONE);
    const redeemableERC20Config = {
      name: 'Token',
      symbol: 'TKN',
      distributor: zeroAddress,
      initialSupply: totalTokenSupply,
    };

    const staticPrice = ethers.BigNumber.from('75').mul(RESERVE_ONE);
    const constants = [staticPrice];
    const sources = VM.createVMSources([[Sale.Opcodes.VAL, 0]]);

    // All configs calculated outside of deploy method
    const saleConfig = {
      canStartStateConfig: Sale.afterBlockNumberConfig(startBlock),
      canEndStateConfig: Sale.afterBlockNumberConfig(startBlock + saleDuration),
      calculatePriceStateConfig: {
        sources,
        constants,
        stackLength: 1,
        argumentsLength: 0,
      },
      recipient: recipient.address,
      reserve: reserve.address,
      cooldownDuration: 1,
      minimumRaise,
      dustSize: 0,
      saleTimeout: 100,
    };

    const redeemableConfig = {
      erc20Config: redeemableERC20Config,
      tier: tier.address,
      minimumTier: tier.levels.ZERO,
      distributionEndForwardingAddress: ethers.constants.AddressZero,
    };

    const sale = await Sale.deploy(deployer, saleConfig, redeemableConfig);

    expect(
      await Sale.isChild(deployer, sale.address),
      'Address is not a Sale factory children'
    ).to.be.true;
  });

  xit('should start and finish the sale based in blocknumber correctly', async () => {
    //
  });

  it('should start and finish the sale based in timestamp correctly');
});
