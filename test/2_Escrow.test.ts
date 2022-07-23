import { expect } from 'chai';
import { ethers } from 'hardhat';
import { RedeemableERC20ClaimEscrow__factory } from '../typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import type { DepositEvent } from '../src/typechain/RedeemableERC20ClaimEscrow';
import {
  ONE,
  Time,
  chainId,
  RESERVE_ONE,
  zeroAddress,
  deployErc20,
  expectAsyncError,
  SaleStatus,
  getEventArgs,
} from './utils';
import {
  FixedPrice,
  RedeemableERC20ClaimEscrow,
  Sale,
  RedeemableERC20,
  BetweenBlocks,
  AddressBook,
  ERC20,
  SaleVmFrom,
  BuyAmount,
} from '../src';



const EscrowInterface = RedeemableERC20ClaimEscrow__factory.createInterface();

/**
 * Deploy a sale with prederminated values and already started (optional)
 *
 */
const deploySale = async (
  deployer: SignerWithAddress,
  tierAddress?: string,
  startSale = true
): Promise<{
  sale: Sale;
  redeemableERC20: RedeemableERC20;
}> => {
  const signers = await ethers.getSigners();
  const recipient = signers[signers.length - 1];
  const saleReserve = await deployErc20(deployer);
  if (!tierAddress) {
    tierAddress = AddressBook.getAddressesForChainId(chainId).alwaysTier;
  }

  // 5 blocks from now
  const startBlock = (await Time.currentBlock()) + 2;
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

  // All configs calculated outside of deploy method
  const saleConfig = {
    vmStateConfig: new SaleVmFrom(
      new BetweenBlocks(startBlock, endBlock),
      new BuyAmount(),
      new FixedPrice(75, 6),
    ),
    // canStartStateConfig: new BetweenBlocks(startBlock),
    // canEndStateConfig: new BetweenBlocks(endBlock),
    // calculatePriceStateConfig: new FixedPrice('75', 6),
    recipient: recipient.address,
    reserve: saleReserve.address,
    cooldownDuration: 1,
    minimumRaise,
    dustSize: 0,
    saleTimeout: 100,
  };

  const redeemableConfig = {
    erc20Config: redeemableERC20Config,
    tier: tierAddress,
    minimumTier: 0,
    distributionEndForwardingAddress: ethers.constants.AddressZero,
  };

  // Deploying sale
  const sale = await Sale.deploy(deployer, saleConfig, redeemableConfig);
  // Getting the redeemable
  const redeemableERC20 = new RedeemableERC20(await sale.token(), deployer);

  // Start the sale
  if (startSale) {
    await Time.advanceBlock(startBlock - (await Time.currentBlock()));
    await sale.start();
  }

  return { sale, redeemableERC20 };
};

describe('SDK - ClaimEscrow', () => {
  it('should fail when a not formatted address is provided as Sale or Token', async () => {
    const [signer] = await ethers.getSigners();

    // Zero address is used since is already formatted
    const token = ethers.constants.AddressZero;
    const sale = ethers.constants.AddressZero;

    const invalidAddress = '0xabcdabcdabcdabcdabcd';

    expectAsyncError(
      RedeemableERC20ClaimEscrow.get(invalidAddress, token, signer),
      'SALE: NOT A VALID FORMAT ADDRESS'
    );

    expectAsyncError(
      RedeemableERC20ClaimEscrow.get(sale, invalidAddress, signer),
      'TOKEN: NOT A VALID FORMAT ADDRESS'
    );
  });

  it('should get the escrow from the SDK correctly', async () => {
    const [deployer, depositor] = await ethers.getSigners();

    const escrowReserve = await deployErc20(deployer);

    // Deploying sale
    const { sale } = await deploySale(deployer);

    // Buy tokens from saleS

    // Getting escrow with sale and reserve connect to depositor
    const escrow = await RedeemableERC20ClaimEscrow.get(
      sale.address,
      escrowReserve.address,
      depositor
    );

    expect(escrow.address).to.be.string;
  });

  it('should be able to deposit correctly', async () => {
    const [deployer, depositor, buyer] = await ethers.getSigners();

    const escrowReserve = await deployErc20(deployer);

    // Deploying sale
    const { sale, redeemableERC20 } = await deploySale(deployer);

    expect(await sale.saleStatus()).to.be.equals(
      SaleStatus.Active,
      `escrow test - sale is not active`
    );

    // Sending saleReserve tokens to the buyer
    const saleReserve = new ERC20(await sale.reserve(), deployer);
    await saleReserve.transfer(buyer.address, await saleReserve.totalSupply());

    expect(await redeemableERC20.balanceOf(buyer.address)).to.be.equals(0);

    // Config for buy all the rTokens of the sale with buyer
    const desiredAmount = await redeemableERC20.totalSupply();
    const buyConfig = {
      feeRecipient: zeroAddress,
      fee: 0,
      minimumUnits: desiredAmount,
      desiredUnits: desiredAmount,
      maximumPrice: (await sale.calculateBuy(desiredAmount))[1],
    };

    // Approving all the balance to sale
    await saleReserve
      .connect(buyer)
      .approve(sale.address, await saleReserve.balanceOf(buyer.address));

    // Buying all tokens in the sale
    await sale.connect(buyer).buy(buyConfig);

    expect(await sale.saleStatus()).to.be.equals(SaleStatus.Success);

    // Getting escrow with sale and reserve connect to depositor
    const escrow = await RedeemableERC20ClaimEscrow.get(
      sale.address,
      escrowReserve.address,
      depositor
    );

    // Sending escrow tokens to deposit and approving the escrow to use it
    const amountToDeposit = 50000;
    await escrowReserve.transfer(depositor.address, amountToDeposit);
    await escrowReserve
      .connect(depositor)
      .approve(escrow.address, amountToDeposit);

    // Making the Deposit
    const tx = await escrow.deposit(amountToDeposit);

    // Should use a query with the subgraph to get any status of the escrow
    // instead of reading events directly from the transaction
    const {
      sale: saleAddress,
      token: reserveDeposited,
      amount: amountDeposited,
    } = (await getEventArgs(
      tx,
      'Deposit',
      escrow.address,
      EscrowInterface
    )) as DepositEvent['args'];

    expect(saleAddress).to.be.equals(sale.address);
    expect(reserveDeposited).to.be.equals(escrowReserve.address);
    expect(amountDeposited).to.be.equals(amountToDeposit);
  });

  it('should be able to change the sale correctly', async () => {
    const [deployer, depositor, buyer] = await ethers.getSigners();

    const escrowReserve = await deployErc20(deployer);

    // Deploying two diffrent sales
    const { sale: sale_1, redeemableERC20: redeemable_1 } = await deploySale(
      deployer
    );

    const { sale: sale_2, redeemableERC20: redeemable_2 } = await deploySale(
      deployer
    );

    expect(sale_1.address).to.be.not.equals(sale_2.address);

    // Sending both saleReserve tokens to the buyer
    const saleReserve_1 = new ERC20(await sale_1.reserve(), deployer);
    await saleReserve_1.transfer(
      buyer.address,
      await saleReserve_1.totalSupply()
    );
    expect(await redeemable_1.balanceOf(buyer.address)).to.be.equals(0);

    const saleReserve_2 = new ERC20(await sale_2.reserve(), deployer);
    await saleReserve_2.transfer(
      buyer.address,
      await saleReserve_2.totalSupply()
    );

    expect(await redeemable_2.balanceOf(buyer.address)).to.be.equals(0);

    // Same props in Sale creation, should be the same properties in both sales
    expect(await redeemable_1.totalSupply()).to.be.equals(
      await redeemable_2.totalSupply(),
      'escrow test - wrong totalsupply'
    );

    // Config for buy all the rTokens of the sale with buyer
    const desiredAmount = await redeemable_1.totalSupply();
    const buyConfig = {
      feeRecipient: zeroAddress,
      fee: 0,
      minimumUnits: desiredAmount,
      desiredUnits: desiredAmount,
      maximumPrice: (await sale_1.calculateBuy(desiredAmount))[1],
    };

    // Approving all the balance to sales
    await saleReserve_1
      .connect(buyer)
      .approve(sale_1.address, await saleReserve_1.balanceOf(buyer.address));

    await saleReserve_2
      .connect(buyer)
      .approve(sale_2.address, await saleReserve_2.balanceOf(buyer.address));

    // Buying all tokens in the sale
    await sale_1.connect(buyer).buy(buyConfig);
    await sale_2.connect(buyer).buy(buyConfig);

    expect(await sale_1.saleStatus()).to.be.equals(SaleStatus.Success);
    expect(await sale_2.saleStatus()).to.be.equals(SaleStatus.Success);

    // Getting escrow with sale and reserve connect to depositor
    const escrow_1 = await RedeemableERC20ClaimEscrow.get(
      sale_1.address,
      escrowReserve.address,
      depositor
    );

    // Escrow with different sale
    const escrow_2 = escrow_1.changeSale(sale_2.address);

    expect(escrow_1.sale).to.be.not.equals(
      escrow_2.sale,
      'escrow test - sale has not been changed'
    );

    // Sending escrow tokens to deposit in both tx and approving the escrow to use it
    const amountToDeposit = 50000;
    await escrowReserve.transfer(depositor.address, amountToDeposit * 2);
    await escrowReserve
      .connect(depositor)
      .approve(escrow_1.address, amountToDeposit * 2);

    // Making the Deposit with Sale1
    const tx_1 = await escrow_1.deposit(amountToDeposit);

    // Making the Deposit with Sale2
    const tx_2 = await escrow_2.deposit(amountToDeposit);

    // Should use a query with the subgraph to get any status of the escrow
    // instead of reading events directly from the transaction
    const { sale: saleAddress_1 } = (await getEventArgs(
      tx_1,
      'Deposit',
      escrow_1.address,
      EscrowInterface
    )) as DepositEvent['args'];

    const { sale: saleAddress_2 } = (await getEventArgs(
      tx_2,
      'Deposit',
      escrow_2.address,
      EscrowInterface
    )) as DepositEvent['args'];

    expect(saleAddress_1).to.be.equals(sale_1.address);
    expect(saleAddress_2).to.be.equals(sale_2.address);
  });
});