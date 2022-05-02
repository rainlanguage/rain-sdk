import { ethers } from 'hardhat';
import { expect } from 'chai';
import {
  TierLevels,
  deployErc20,
  deployErc721,
  expectAsyncError,
} from './utils';

import {
  Verify,
  VerifyTier,
  ERC20BalanceTier,
  ERC20TransferTier,
  ERC721BalanceTier,
} from '../src';

describe('SDK - ERC20BalanceTier', () => {
  it('should deploy an ERC20BalanceTier child', async () => {
    const [signer] = await ethers.getSigners();
    const token = await deployErc20();
    const tier = await ERC20BalanceTier.deploy(signer, {
      erc20: token.address,
      tierValues: TierLevels,
    });

    expect(
      await ERC20BalanceTier.isChild(signer, tier.address),
      'Address is not a ERC20BalanceTier factory children'
    ).to.be.true;
  });

  it('should get the corrects tier values from SDK', async () => {
    const [signer] = await ethers.getSigners();
    const token = await deployErc20();
    const tier = await ERC20BalanceTier.deploy(signer, {
      erc20: token.address,
      tierValues: TierLevels,
    });

    expect(TierLevels).to.be.deep.equal(await tier.tierValues());
  });

  it('should throw an error if try to call setTier from SDK', async () => {
    const [signer] = await ethers.getSigners();
    const token = await deployErc20();
    const tier = await ERC20BalanceTier.deploy(signer, {
      erc20: token.address,
      tierValues: TierLevels,
    });

    await expectAsyncError(
      tier.setTier('', 2, []),
      'SET TIER: NOT IMPLEMENTED'
    );
  });

  it('should calculate the amounts to reach a tier for different addresses and signers using connect', async () => {
    const [deployer, user1, user2] = await ethers.getSigners();
    const token = await deployErc20(deployer);

    // Tier connected to the deployer token and tier contracts
    const tierDeployer = await ERC20BalanceTier.deploy(deployer, {
      erc20: token.address,
      tierValues: TierLevels,
    });

    const tierUser1 = tierDeployer.connect(user1);
    const tierUser2 = tierDeployer.connect(user2);

    expect(await tierUser1.amountToTier(tierUser1.levels.FIVE)).to.be.equals(
      await tierDeployer.amountToTier(tierDeployer.levels.FIVE, user1.address)
    );

    expect(await tierUser2.amountToTier(tierUser2.levels.TWO)).to.be.equals(
      await tierDeployer.amountToTier(tierDeployer.levels.TWO, user2.address)
    );
  });

  it('should get the current tier as numeric readable expression levels', async () => {
    const [deployer, user] = await ethers.getSigners();
    const token = await deployErc20();
    const tier = await ERC20BalanceTier.deploy(deployer, {
      erc20: token.address,
      tierValues: TierLevels,
    });

    expect(await tier.currentTier(user.address)).to.be.equals(tier.levels.ZERO);

    // Provide to user tokens to get a tier 3
    const amount = await tier.connect(user).amountToTier(tier.levels.THREE);

    await token.transfer(user.address, amount);

    expect(await tier.currentTier(user.address)).to.be.equals(
      tier.levels.THREE
    );
  });

  it('should obtain the amount required to level up tiers with the current instance signer', async () => {
    const [signer, user] = await ethers.getSigners();
    const token = await deployErc20();
    const tier = await ERC20BalanceTier.deploy(signer, {
      erc20: token.address,
      tierValues: TierLevels,
    });

    // user want level four
    const levelFour = tier.levels.FOUR;
    const tierSigner2 = tier.connect(user);

    // User start as Tier zero because does not have tokens
    expect(await tier.currentTier(user.address)).to.be.equals(tier.levels.ZERO);

    // Sending tokens to user to get Tier four
    await token.transfer(
      user.address,
      await tierSigner2.amountToTier(levelFour)
    );

    expect(await tier.currentTier(user.address)).to.be.equals(levelFour);

    // User receive an arbitrary amount but not enought to get the next tier
    const levelFive = tier.levels.FIVE;
    const halfAmountToFive = (await tier.tierValues())[0].div(2);
    await token.transfer(user.address, halfAmountToFive);

    // User stay same tier four since need the more tokens to Tier five
    expect(await tier.currentTier(user.address)).to.be.equals(levelFour);

    // Sending the other half to get Tier Five
    await token.transfer(
      user.address,
      await tierSigner2.amountToTier(levelFive)
    );
    expect(await tier.currentTier(user.address)).to.be.equals(levelFive);
  });

  it('should obtain the amount that should be remove/burned to downgrade tiers', async () => {
    const [signer, user] = await ethers.getSigners();
    const token = await deployErc20();
    const tier = await ERC20BalanceTier.deploy(signer, {
      erc20: token.address,
      tierValues: TierLevels,
    });

    // Set as Tier 7 to user with an extra amount
    const tierSigner2 = tier.connect(user);
    const initAmount = await tierSigner2.amountToTier(tier.levels.SEVEN);

    await token.transfer(user.address, initAmount);

    expect(await tier.currentTier(user.address)).to.be.equals(
      tier.levels.SEVEN
    );

    // Amount required to downgrade to Tier Two
    const amountToDownGrade = await tierSigner2.amountToTier(tier.levels.TWO);

    // user remove the required amount from his account
    await token.connect(user).transfer(token.address, amountToDownGrade);

    expect(await tier.currentTier(user.address)).to.be.equals(tier.levels.TWO);
  });
});

describe('SDK - ERC20TransferTier', () => {
  it('should deploy an ERC20TransferTier child', async () => {
    const [signer] = await ethers.getSigners();
    const token = await deployErc20();
    const tier = await ERC20TransferTier.deploy(signer, {
      erc20: token.address,
      tierValues: TierLevels,
    });

    expect(
      await ERC20TransferTier.isChild(signer, tier.address),
      'Address is not a ERC20TransferTier factory children'
    ).to.be.true;
  });

  it('should get the corrects tier values from SDK', async () => {
    const [signer] = await ethers.getSigners();
    const token = await deployErc20();
    const tier = await ERC20TransferTier.deploy(signer, {
      erc20: token.address,
      tierValues: TierLevels,
    });

    expect(TierLevels).to.be.deep.equal(await tier.tierValues());
  });

  it('should calculate the amounts to reach a tier for different addresses and signers using connect', async () => {
    const [deployer, user1, user2] = await ethers.getSigners();
    const token = await deployErc20(deployer);

    // Tier connected to the deployer token and tier contracts
    const tierDeployer = await ERC20TransferTier.deploy(deployer, {
      erc20: token.address,
      tierValues: TierLevels,
    });

    const tierUser1 = tierDeployer.connect(user1);
    const tierUser2 = tierDeployer.connect(user2);

    expect(await tierUser1.amountToTier(tierUser1.levels.SIX)).to.be.equals(
      await tierDeployer.amountToTier(tierDeployer.levels.SIX, user1.address)
    );

    expect(await tierUser2.amountToTier(tierUser2.levels.FOUR)).to.be.equals(
      await tierDeployer.amountToTier(tierDeployer.levels.FOUR, user2.address)
    );
  });

  it('should approve to the ERC20TransferTier contract to use the owner tokens from SDK correctly', async () => {
    const [signer] = await ethers.getSigners();
    const token = await deployErc20();
    const tier = await ERC20TransferTier.deploy(signer, {
      erc20: token.address,
      tierValues: TierLevels,
    });

    expect(await token.allowance(signer.address, tier.address)).to.be.equals(0);

    // Using approval from SDK
    const approvedAmount = ethers.BigNumber.from('1000000000');

    await tier.approveTokenForTier(approvedAmount);

    expect(await token.allowance(signer.address, tier.address)).to.be.equals(
      approvedAmount,
      'Wrong amount approved'
    );
  });

  it('should set tier to level up and get the current tier level correclty', async () => {
    const [signer, user] = await ethers.getSigners();
    const token = await deployErc20();
    const tier = await ERC20TransferTier.deploy(signer, {
      erc20: token.address,
      tierValues: TierLevels,
    });

    const tierUser = tier.connect(user);
    const levels = tierUser.levels;

    expect(await tierUser.currentTier(user.address)).to.be.equals(levels.ZERO);

    // User want tier two
    await expect(
      tierUser.setTier(user.address, levels.TWO, []),
      'Wrong set tier success'
    ).to.be.revertedWith('ERC20: insufficient allowance');

    // The amount necessary to user get the tier two
    const approvedAmount = await tierUser.amountToTier(levels.TWO);

    // Sending to user the tokens
    await token.transfer(user.address, approvedAmount);

    // Approving the contract and set the tier two
    await tierUser.approveTokenForTier(approvedAmount);
    await tierUser.setTier(user.address, levels.TWO, []);

    expect(await tierUser.currentTier(user.address)).to.be.equals(levels.TWO);

    // Now use want tier six
    await expect(
      tierUser.setTier(user.address, levels.SIX, []),
      'Wrong set tier success'
    ).to.be.revertedWith('ERC20: insufficient allowance');

    const approvedAmount_2 = await tierUser.amountToTier(levels.SIX);

    // Sending to user the tokens
    await token.transfer(user.address, approvedAmount_2);

    // Approving the contract and set the tier SIX
    await tierUser.approveTokenForTier(approvedAmount_2);
    await tierUser.setTier(user.address, levels.SIX, []);

    expect(await tierUser.currentTier(user.address)).to.be.equals(levels.SIX);
  });

  it('should decrease the level tier and get the current tier level correctly', async () => {
    const [deployer, user] = await ethers.getSigners();
    const token = await deployErc20();
    const tierDeployer = await ERC20TransferTier.deploy(deployer, {
      erc20: token.address,
      tierValues: TierLevels,
    });

    // Connecting the instance to a new signer
    const tierUser = tierDeployer.connect(user);
    const levels = tierUser.levels;

    // Set as initial level tier seven
    const amountToTierSeven = await tierUser.amountToTier(levels.SEVEN);
    await token.transfer(user.address, amountToTierSeven);

    await tierUser.approveTokenForTier(amountToTierSeven);
    await tierUser.setTier(user.address, levels.SEVEN, []);

    expect(await tierUser.currentTier(user.address)).to.be.equals(levels.SEVEN);

    // user want to decrease to Tier 4
    const balanceBefore = await token.balanceOf(user.address);
    const amountReturnedExpected = await tierUser.amountToTier(levels.FOUR);

    await tierUser.setTier(user.address, levels.FOUR, []);

    expect(await tierUser.currentTier(user.address)).to.be.equals(levels.FOUR);
    expect(await token.balanceOf(user.address)).to.be.equals(
      balanceBefore.add(amountReturnedExpected)
    );
  });
});

describe('SDK - Tiers', () => {
  it('Deploying ERC721BalanceTierChild', async () => {
    const token = await deployErc721();

    const [signer] = await ethers.getSigners();
    const tier = await ERC721BalanceTier.deploy(signer, {
      erc721: token.address,
      tierValues: TierLevels,
    });

    expect(TierLevels).to.be.deep.equal(await tier.tierValues());
    await expectAsyncError(
      tier.setTier('', 2, []),
      'SET TIER: NOT IMPLEMENTED'
    );
  });

  it('Deploying VerifyTierChild', async () => {
    const [signer] = await ethers.getSigners();

    const verify = await Verify.deploy(signer, {
      admin: signer.address,
      callback: ethers.constants.AddressZero,
    });

    const tier = await VerifyTier.deploy(signer, verify.address);

    await expectAsyncError(
      tier.setTier('', 2, []),
      'SET TIER: NOT IMPLEMENTED'
    );
  });
});
