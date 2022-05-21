import { expect } from 'chai';
import { ethers } from 'hardhat';
import {
  deployErc20,
  ONE,
  RESERVE_ONE,
  zeroAddress,
  Time,
  SaleStatus,
} from './utils';

import { ReserveTokenTest } from '../typechain';

import { VM, Sale, CombineTier, SaleDuration } from '../src';
import { BigNumber } from 'ethers';

describe('SDK - Sale', () => {
  let reserve: ReserveTokenTest, tier: CombineTier;

  before('deploy required contracts', async () => {
    const [deployer] = await ethers.getSigners();
    reserve = await deployErc20(deployer);
    // Using always tier
    tier = await CombineTier.getAlwaysTier(deployer);
  });

  it('should deploy a Sale child correctly', async () => {
    const [deployer, recipient] = await ethers.getSigners();

    // 5 blocks from now
    const startBlock = (await Time.currentBlock()) + 5;
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

  it('should start and finish the sale based in blocknumber correctly', async () => {
    const [deployer, recipient] = await ethers.getSigners();

    // 5 blocks from now
    const startBlock = (await Time.currentBlock()) + 5;
    const saleDuration = 30;
    const endBlock = startBlock + saleDuration;
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
      canEndStateConfig: Sale.afterBlockNumberConfig(endBlock),
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

    expect(await sale.saleStatus()).to.be.equals(SaleStatus.Pending);
    expect(await sale.canStart(), 'sale should be not ready to start').to.be
      .false;

    // Increase the blocks to start
    while ((await Time.currentBlock()) < startBlock) {
      await Time.advanceBlock();
    }

    expect(await sale.canStart(), 'sale should be ready to start').to.be.true;

    // Start the sale
    await sale.start();
    expect(await sale.saleStatus()).to.be.equals(SaleStatus.Active);

    expect(await sale.canEnd(), 'sale should be not ready to end').to.be.false;

    // Increase the blocks to end
    while ((await Time.currentBlock()) < endBlock) {
      await Time.advanceBlock();
    }

    expect(await sale.canEnd(), 'sale should be ready to end').to.be.true;

    await sale.end();
  });

  it('should start and finish the sale based in timestamp correctly', async () => {
    const [deployer, recipient] = await ethers.getSigners();

    const startTimestamp = (await Time.currentTime()) + 30; // 30 seconds from now
    const saleDuration = Time.duration.hours(10); // 10 hours
    const endTimestamp = BigNumber.from(startTimestamp).add(saleDuration);

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
      canStartStateConfig: new SaleDuration(startTimestamp).stateConfig,
      canEndStateConfig: new SaleDuration(endTimestamp).stateConfig,
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

    expect(await sale.saleStatus()).to.be.equals(SaleStatus.Pending);
    expect(await sale.canStart(), 'sale should be not ready to start').to.be
      .false;

    // Increase the timestamp to start (+1 to because is AFTER timestamp)
    await Time.increase(startTimestamp - (await Time.currentTime()) + 1);

    expect(await sale.canStart(), 'sale should be ready to start').to.be.true;

    // Start the sale
    await sale.start();
    expect(await sale.saleStatus()).to.be.equals(SaleStatus.Active);

    expect(await sale.canEnd(), 'sale should be not ready to end').to.be.false;

    // Increase the timestamp to end (+1 to because is AFTER timestamp)
    await Time.increase(endTimestamp.sub(await Time.currentTime()).add(1));

    expect(await sale.canEnd(), 'sale should be ready to end').to.be.true;

    await sale.end();
  });

  it('should be able to buy in the sale with the SDK', async () => {
    const [deployer, recipient, buyer] = await ethers.getSigners();

    // 5 blocks from now
    const startBlock = (await Time.currentBlock()) + 5;
    const saleDuration = 30;
    const endBlock = startBlock + saleDuration;
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
      canEndStateConfig: Sale.afterBlockNumberConfig(endBlock),
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
    // const redeemable = await sale.getRedeemable(deployer);

    expect(await sale.saleStatus()).to.be.equals(SaleStatus.Pending);

    // Increase the blocks to start
    await Time.advanceBlock(startBlock - (await Time.currentBlock()));
    expect(await sale.canStart(), 'sale should be ready to start').to.be.true;

    // Start the sale
    await sale.start();
    expect(await sale.saleStatus()).to.be.equals(SaleStatus.Active);

    // Providing tokens to buyer and approving the sale to use it
    const amount = minimumRaise;
    await reserve.transfer(buyer.address, amount);
    await reserve.connect(buyer).approve(sale.address, amount);

    const desiredAmount = totalTokenSupply;

    expect(await sale.calculatePrice(desiredAmount)).to.be.equals(staticPrice);

    const buyConfig = {
      feeRecipient: zeroAddress,
      fee: 0,
      minimumUnits: desiredAmount,
      desiredUnits: desiredAmount,
      maximumPrice: await sale.calculatePrice(desiredAmount),
    };

    await sale.connect(buyer).buy(buyConfig);

    expect(await sale.saleStatus()).to.be.equals(SaleStatus.Success);
  });
});
