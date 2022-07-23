import { expect } from 'chai';
import { ethers } from 'hardhat';
import { BigNumber } from 'ethers';
import { ReserveTokenTest } from '../typechain';
import {
  deployErc20,
  ONE,
  RESERVE_ONE,
  zeroAddress,
  Time,
  SaleStatus,
} from './utils';
import {
  VM,
  Sale,
  CombineTier,
  BetweenTimestamps,
  BetweenBlocks,
  SaleVmFrom,
  BuyAmount,
} from '../src';


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
    const sources = VM.createVMSources([[VM.Opcodes.CONSTANT, 0]]);

    // All configs calculated outside of deploy method
    const saleConfig = {
      vmStateConfig: new SaleVmFrom(
        new BetweenBlocks(startBlock, startBlock + saleDuration),
        new BuyAmount(),
        { sources, constants }
      ),
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
    const sources = VM.createVMSources([[VM.Opcodes.CONSTANT, 0]]);

    // All configs calculated outside of deploy method
    const saleConfig = {
      vmStateConfig: new SaleVmFrom(
        new BetweenBlocks(startBlock, endBlock),
        new BuyAmount(),
        { sources, constants }
      ),
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
    expect(await sale.canLive(), 'sale should be not ready to live').to.be
      .false;

    // Increase the blocks to start
    while ((await Time.currentBlock()) < startBlock) {
      await Time.advanceBlock();
    }

    expect(await sale.canLive(), 'sale should be ready to live').to.be.true;

    // Start the sale
    await sale.start();
    expect(await sale.saleStatus()).to.be.equals(SaleStatus.Active);

    expect(await sale.canLive(), 'sale should not be ready to not live (end)')
      .to.be.true;

    // Increase the blocks to end
    while ((await Time.currentBlock()) < endBlock) {
      await Time.advanceBlock();
    }

    expect(await sale.canLive(), 'sale should be ready to not live (end)').to.be
      .false;

    await sale.end();
  });

  it('should start and finish the sale based in timestamp correctly', async () => {
    const [deployer, recipient] = await ethers.getSigners();

    const startTimestamp = (await Time.currentTime()) + 30; // 30 seconds from now
    const saleDuration = Time.duration.hours(10); // 10 hours
    const endTimestamp = startTimestamp + Number(saleDuration);

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
    const sources = VM.createVMSources([[VM.Opcodes.CONSTANT, 0]]);

    // All configs calculated outside of deploy method
    const saleConfig = {
      vmStateConfig: new SaleVmFrom(
        new BetweenTimestamps(startTimestamp, endTimestamp),
        new BuyAmount(),
        { sources, constants }
      ),
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
    expect(await sale.canLive(), 'sale should be not ready to live').to.be
      .false;

    // Increase the timestamp to start (+1 to because is AFTER timestamp)
    await Time.increase(startTimestamp - (await Time.currentTime()) + 1);

    expect(await sale.canLive(), 'sale should be ready to live').to.be.true;

    // Start the sale
    await sale.start();
    expect(await sale.saleStatus()).to.be.equals(SaleStatus.Active);

    expect(await sale.canLive(), 'sale should not be ready to not live (end)')
      .to.be.true;

    // Increase the timestamp to end (+1 to because is AFTER timestamp)
    await Time.increase(
      BigNumber.from(endTimestamp)
        .sub(await Time.currentTime())
        .add(1)
    );

    expect(await sale.canLive(), 'sale should be ready to not live (end)').to.be
      .false;

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
    const sources = VM.createVMSources([[VM.Opcodes.CONSTANT, 0]]);

    // All configs calculated outside of deploy method
    const saleConfig = {
      vmStateConfig: new SaleVmFrom(
        new BetweenBlocks(startBlock, endBlock),
        new BuyAmount(),
        { sources, constants }
      ),
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

    // Increase the blocks to start
    await Time.advanceBlock(startBlock - (await Time.currentBlock()));
    expect(await sale.canLive(), 'sale should be ready to live').to.be.true;

    // Start the sale
    await sale.start();
    expect(await sale.saleStatus()).to.be.equals(SaleStatus.Active);

    // Providing tokens to buyer and approving the sale to use it
    const amount = minimumRaise;
    await reserve.transfer(buyer.address, amount);
    await reserve.connect(buyer).approve(sale.address, amount);

    const desiredAmount = totalTokenSupply;

    expect((await sale.calculateBuy(desiredAmount))[1]).to.be.equals(
      staticPrice
    );

    const buyConfig = {
      feeRecipient: zeroAddress,
      fee: 0,
      minimumUnits: desiredAmount,
      desiredUnits: desiredAmount,
      maximumPrice: (await sale.calculateBuy(desiredAmount))[1],
    };

    await sale.connect(buyer).buy(buyConfig);

    expect(await sale.saleStatus()).to.be.equals(SaleStatus.Success);
  });
});