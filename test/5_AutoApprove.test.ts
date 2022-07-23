import { assert } from 'chai';
import { ethers } from 'hardhat';
import { AutoApprove, StateConfig, Verify, VM } from '../src';
import { concat, hexZeroPad, op } from '../src/utils';
import { deployErc721, expectAsyncError, getEventArgs } from './utils';
import { Verify__factory } from '../typechain';
import { ApproveEvent } from '../typechain/Verify';


const verifyInterFace = Verify__factory.createInterface();

describe("SDK - AutoApprove", async function () {
  it("should automatically approve sender if AutoApprove has APPROVER role", async () => {
    const signers = await ethers.getSigners();

    const deployer = signers[1];
    const admin = signers[2];
    const signer1 = signers[3];
    const aprAdmin = signers[4];

    const correctID = hexZeroPad(ethers.utils.randomBytes(32), 32);

    const stateConfig: StateConfig = {
      // prettier-ignore
      sources: [
        concat([
            op(VM.Opcodes.CONTEXT, 1),
            op(VM.Opcodes.CONSTANT, 0),
          op(VM.Opcodes.EQUAL_TO),
        ]),
      ],
      constants: [correctID],
    };

    const autoApprove = await AutoApprove.deploy(
      deployer,
      stateConfig
    );

    const verify = await Verify.deploy(deployer, {
      admin: admin.address,
      callback: autoApprove.address,
    });

    await autoApprove.connect(deployer).transferOwnership(verify.address);

    const evidenceAdd = hexZeroPad(correctID, 32);

    // Can't approve without permissions
    await expectAsyncError(
      (async () => {
        try {
          await verify.connect(signer1).add(evidenceAdd)
        }
        catch {
          throw new Error("autoApprove approved without approver role")
        }
      })(),
      "autoApprove approved without approver role"
    );

    // make AutoApprove an approver
    await verify
      .connect(admin)
      .grantRole(await verify.APPROVER_ADMIN(), aprAdmin.address);
    await verify
      .connect(admin)
      .renounceRole(await verify.APPROVER_ADMIN(), admin.address);
    await verify
      .connect(aprAdmin)
      .grantRole(await verify.APPROVER(), autoApprove.address);

    // now signer1 can get their account automatically approved
    await verify.connect(signer1).add(evidenceAdd);
  });

  it("should automatically approve sender if evidence matches the correct ID", async () => {
    const signers = await ethers.getSigners();

    const deployer = signers[1];
    const admin = signers[2];
    const signer1 = signers[3];
    const aprAdmin = signers[4];

    const correctID = hexZeroPad(ethers.utils.randomBytes(32), 32);

    const stateConfig: StateConfig = {
      // prettier-ignore
      sources: [
        concat([
            op(VM.Opcodes.CONTEXT, 1),
            op(VM.Opcodes.CONSTANT, 0),
          op(VM.Opcodes.EQUAL_TO),
        ]),
      ],
      constants: [correctID],
    };

    const autoApprove = await AutoApprove.deploy(
      deployer,
      stateConfig
    );

    const verify = await Verify.deploy(deployer, {
      admin: admin.address,
      callback: autoApprove.address,
    });

    await autoApprove.connect(deployer).transferOwnership(verify.address);

    const evidenceAdd = hexZeroPad(correctID, 32);

    // make AutoApprove an approver
    await verify
      .connect(admin)
      .grantRole(await verify.APPROVER_ADMIN(), aprAdmin.address);
    await verify
      .connect(admin)
      .renounceRole(await verify.APPROVER_ADMIN(), admin.address);
    await verify
      .connect(aprAdmin)
      .grantRole(await verify.APPROVER(), autoApprove.address);

    // now signer1 can get their account automatically approved
    const addTx = await verify.connect(signer1).add(evidenceAdd);

    const { sender, evidence } = (await getEventArgs(
      addTx,
      "Approve",
      verify.address, 
      verifyInterFace
    )) as ApproveEvent["args"];

    assert(sender === autoApprove.address, "wrong approve sender");
    assert(evidence.account === signer1.address, "wrong evidence account");
    assert(evidence.data === evidenceAdd, "wrong evidence data");
  });
  
  it("should automatically approve only if account owns the NFT", async () => {
    const signers = await ethers.getSigners();

    const signer0 = signers[0];
    const deployer = signers[1];
    const admin = signers[2];
    const aprAdmin = signers[3];
    const signer1 = signers[4];

    let tokenERC721 = await deployErc721();

    const vTokenAddr = op(VM.Opcodes.CONSTANT, 0);
    const cAccount = op(VM.Opcodes.CONTEXT, 0);
    const cNftId = op(VM.Opcodes.CONTEXT, 1);

    const stateConfig: StateConfig = {
      // prettier-ignore
      sources: [
        concat([
              vTokenAddr,
              cNftId,
            op(VM.Opcodes.IERC721_OWNER_OF),
            cAccount,
          op(VM.Opcodes.EQUAL_TO),
        ])],
      constants: [tokenERC721.address],
    };

    const autoApprove = await AutoApprove.deploy(
      deployer,
      stateConfig
    );

    const verify = await Verify.deploy(deployer, {
      admin: admin.address,
      callback: autoApprove.address,
    });

    await autoApprove.connect(deployer).transferOwnership(verify.address);

    // make AutoApprove an approver
    await verify
      .connect(admin)
      .grantRole(await verify.APPROVER_ADMIN(), aprAdmin.address);
    await verify
      .connect(admin)
      .renounceRole(await verify.APPROVER_ADMIN(), admin.address);
    await verify
      .connect(aprAdmin)
      .grantRole(await verify.APPROVER(), autoApprove.address);

    // signer1 acquires NFT with id 1
    await tokenERC721.mintNewToken();
    await tokenERC721.transferFrom(signer0.address, signer1.address, 1);
    const evidenceAdd0 = hexZeroPad("0x1", 32);
    const addTx0 = await verify.connect(signer1).add(evidenceAdd0);
    (await getEventArgs(
      addTx0,
      "Approve",
      verify.address,
      verifyInterFace
    )) as ApproveEvent["args"];

  });
});