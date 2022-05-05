import { expect } from 'chai';
import { ethers } from 'hardhat';

import { Verify } from '../src';

describe('Verify', () => {
  it('should deploy a Verify child', async () => {
    const [signer] = await ethers.getSigners();
    const verify = await Verify.deploy(signer, {
      admin: signer.address,
      callback: ethers.constants.AddressZero,
    });

    expect(await Verify.isChild(verify.signer, verify.address)).to.be.true;
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
