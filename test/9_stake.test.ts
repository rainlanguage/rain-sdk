import { expect } from 'chai';
import { ethers } from 'hardhat';
import { ERC20, Stake } from '../src';
import { ReserveToken } from '../typechain';

describe('SDK - Stake', () => {

  it('should deploy a Stake child correctly', async () => {
    const [deployer, staker] = await ethers.getSigners();
    const TokenFactory = await ethers.getContractFactory(
      'ReserveToken',
      deployer
    );
    const erc20Contract = await TokenFactory.deploy() as ReserveToken;
    const erc20Address = erc20Contract.address;
    
    // Create the instances
    const erc20Deployer = new ERC20(erc20Address, deployer);
    const reserveToken = erc20Deployer.connect(staker);

    // Transfer tokens from the deployer to the staker with the instances
    const amountToTransfer = '50000000';
    await erc20Deployer.approve(staker.address, amountToTransfer);
    await reserveToken.transferFrom(
      deployer.address,
      staker.address,
      amountToTransfer
    );
    expect(await reserveToken.balanceOf(staker.address)).to.be.equals(
      amountToTransfer
    );


    console.log("userA balance of reserveToken before deploying the stake contract:   " + (await reserveToken.balanceOf(staker.address)))
    console.log("--------------------------------------------------------------------")

    console.log("deploying the stake contract with initial ratio of 1:1")
    console.log("--------------------------------------------------------------------")

    const stake = await Stake.deploy(staker, {
      token: reserveToken.address,
        initialRatio: "1000000000000000000000000000000",
        name: "stToken",
        symbol: "sss"
    })
    console.log("stake contract deployed")
    console.log("--------------------------------------------------------------------")

    console.log("stToken totalSupply before deposit:   " + (await stake.totalSupply()))
    console.log("reserveToken balance of stake contract before deposit:   " + (await reserveToken.balanceOf(stake.address)))
    console.log("--------------------------------------------------------------------")

    console.log("userA depositing 20 reserveToken into stake")
    await reserveToken.approve(stake.address, ethers.constants.MaxUint256);
    await stake.deposit("20000000")
    console.log("--------------------------------------------------------------------")

    console.log("stToken totalSupply after deposit:   " + (await stake.totalSupply()))
    console.log("reserveToken balance of stake contract after deposit:   " + (await reserveToken.balanceOf(stake.address)))
    console.log("userA balance of stToken after depositing into stake:   " + (await stake.balanceOf(staker.address)))
    console.log("userA balance of reserveToken after depositing into stake:   " + (await reserveToken.balanceOf(staker.address)))
    console.log("--------------------------------------------------------------------")

    console.log("userA withdrawing 10 reserveToken from stake")
    await stake.withdraw("10000000")
    console.log("--------------------------------------------------------------------")

    console.log("stToken totalSupply after withdraw:   " + (await stake.totalSupply()))
    console.log("reserveToken balance of stake contract after withdraw:   " + (await reserveToken.balanceOf(stake.address)))
    console.log("userA balance of stToken after withdrawing from stake:   " + (await stake.balanceOf(staker.address)))
    console.log("userA balance of reserveToken after withdrawing from stake:   " + (await reserveToken.balanceOf(staker.address)))

  });
})