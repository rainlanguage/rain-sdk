import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Verify } from '../src';
import { Time } from './utils';


describe('SDK - Verify', () => {
  it('should deploy a Verify child', async () => {
    const [signer] = await ethers.getSigners();
    const verify = await Verify.deploy(signer, {
      admin: signer.address,
      callback: ethers.constants.AddressZero,
    });

    expect(await Verify.isChild(verify.signer, verify.address)).to.be.true;
  });

  it('should grant roles correctly', async () => {
    const [deployer, user1] = await ethers.getSigners();
    const verify = await Verify.deploy(deployer, {
      admin: deployer.address,
      callback: ethers.constants.AddressZero,
    });

    // Grant approver role to deployer
    await verify.grantRole(await verify.APPROVER(), deployer.address);

    // Approving user1
    await verify.approve([{ account: user1.address, data: [] }]);

    // Obtaining the current state of user1
    const stateUser1 = await verify.state(user1.address);
    // Current block in chain
    const currentTime = await Time.currentTime();

    expect(await verify.statusAtTime(stateUser1, currentTime)).to.be.equals(
      verify.status.APPROVED
    );
  });

  it('should change the signer in a Verify instance correctly', async () => {
    const [admin, newSigner] = await ethers.getSigners();

    // Deploy to get the address
    const Verify_Admin = await Verify.deploy(admin, {
      admin: admin.address,
      callback: ethers.constants.AddressZero,
    });

    // Admin grant an admin role to signer
    const txAdmin = await Verify_Admin.grantRole(
      await Verify_Admin.APPROVER_ADMIN(),
      newSigner.address
    );
    expect(txAdmin.from).to.equals(admin.address);

    // Connect to new signer
    const Verify_Signer = Verify_Admin.connect(newSigner);
    expect(Verify_Admin.address).to.be.equals(Verify_Signer.address);

    // signer grant a approver to himself
    const txNewSigner = await Verify_Signer.grantRole(
      await Verify_Signer.APPROVER(),
      newSigner.address
    );
    expect(txNewSigner.from).to.equals(newSigner.address);
  });
});
