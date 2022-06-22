import { ethers } from 'hardhat';
import { expect } from 'chai';
import { expectAsyncError, chainId } from './utils';

import { AddressBook, Verify, VerifyTier, CombineTier } from '../src';

describe('SDK - VerifyTier', () => {
  it('should deploy an VerifyTier child', async () => {
    const [deployer, signer] = await ethers.getSigners();

    const verify = await Verify.deploy(deployer, {
      admin: deployer.address,
      callback: ethers.constants.AddressZero,
    });

    const tier = await VerifyTier.deploy(deployer, verify.address);

    expect(await VerifyTier.isChild(signer, tier.address)).to.be.true;
  });

  it('should throw an error if try to call setTier from SDK', async () => {
    const [deployer] = await ethers.getSigners();

    const verify = await Verify.deploy(deployer, {
      admin: deployer.address,
      callback: ethers.constants.AddressZero,
    });

    const tier = await VerifyTier.deploy(deployer, verify.address);

    await expectAsyncError(
      tier.setTier('', 2, []),
      'SET TIER: NOT IMPLEMENTED'
    );
  });

  it('should get correct tier after been approved', async () => {
    const [deployer, admin, user] = await ethers.getSigners();

    const verify = await Verify.deploy(deployer, {
      admin: admin.address,
      callback: ethers.constants.AddressZero,
    });

    // Connect the instance to the admin and grant the approver role to himself
    const verifyAdmin = verify.connect(admin);
    await verifyAdmin.grantRole(await verifyAdmin.APPROVER(), admin.address);

    // Deploy the verifyTier
    const tier = await VerifyTier.deploy(deployer, verify.address);

    expect(await tier.currentTier(user.address)).to.be.equals(tier.levels.ZERO);

    // Approve the user
    await verifyAdmin.approve([{ account: user.address, data: [] }]);

    expect(await tier.currentTier(user.address)).to.be.equals(
      tier.levels.EIGHT
    );
  });

  it('should get correct tier after been removed', async () => {
    const [deployer, admin, user] = await ethers.getSigners();

    const verify = await Verify.deploy(deployer, {
      admin: admin.address,
      callback: ethers.constants.AddressZero,
    });

    // Connect the instance to the admin and grant the approver role to himself
    const verifyAdmin = verify.connect(admin);
    await verifyAdmin.grantRole(await verifyAdmin.APPROVER(), admin.address);
    await verifyAdmin.grantRole(await verifyAdmin.REMOVER(), admin.address);

    // Deploy the verifyTier
    const tier = await VerifyTier.deploy(deployer, verify.address);

    expect(await tier.currentTier(user.address)).to.be.equals(tier.levels.ZERO);

    // Approve the user
    await verifyAdmin.approve([{ account: user.address, data: [] }]);

    expect(await tier.currentTier(user.address)).to.be.equals(
      tier.levels.EIGHT
    );

    // Remove the user
    await verifyAdmin.remove([{ account: user.address, data: [] }]);

    expect(await tier.currentTier(user.address)).to.be.equals(tier.levels.ZERO);
  });
});

describe('SDK - CombineTier', () => {
  it('should use always tier correctly', async () => {
    const [deployer, user1, user2] = await ethers.getSigners();
    (await deployer.provider?.getNetwork())?.chainId;
    // Get the always tier from book
    const alwaysTierAddress = AddressBook.getAddressesForChainId(
      (await deployer.provider?.getNetwork())?.chainId || chainId
    ).alwaysTier;

    const tier = new CombineTier(alwaysTierAddress, deployer);

    // Any address should be allowed in all tiers
    expect(await tier.currentTier(user1.address)).to.be.equals(
      tier.levels.EIGHT
    );
    expect(await tier.currentTier(user2.address)).to.be.equals(
      tier.levels.EIGHT
    );
  });
});
