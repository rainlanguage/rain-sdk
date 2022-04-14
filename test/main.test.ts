import { expect } from 'chai';
import { ethers } from 'hardhat';
import {
  chainId,
  Tier,
  TierLevels,
  Addresses,
  expectAsyncError,
} from './utils';

// import { ERC20BalanceTier, ERC20TransferTier, Verify } from '../dist';
import {
  ERC20BalanceTier,
  ERC20TransferTier,
  ERC721BalanceTier,
  VerifyTier,
  Verify,
} from '../src';

/**
 * Addresses saved that are in SDK BookAddresses deployed to Hardhat network.
 * **These addresses are deterministically generated with the HH signers.**
 */
export let addresses: Addresses;

// Meanwhile
async function deployErc20() {
  const TokenFactory = await ethers.getContractFactory('ReserveTokenTest');
  return await TokenFactory.deploy();
}

async function deployErc721() {
  const TokenFactory = await ethers.getContractFactory('ReserveTokenERC721');
  return await TokenFactory.deploy();
}

before('Initializing and deploying contracts to hardhat network', async () => {
  // ⚠️ Contract Factories instances ⚠️
  const RedeemableERC20FactoryFactory = await ethers.getContractFactory(
    'RedeemableERC20Factory'
  );

  const VerifyFactoryFactory = await ethers.getContractFactory('VerifyFactory');

  const VerifyTierFactoryFactory = await ethers.getContractFactory(
    'VerifyTierFactory'
  );

  const ERC20BalanceTierFactoryFactory = await ethers.getContractFactory(
    'ERC20BalanceTierFactory'
  );

  const ERC20TransferTierFactoryFactory = await ethers.getContractFactory(
    'ERC20TransferTierFactory'
  );

  const CombineTierFactoryFactory = await ethers.getContractFactory(
    'CombineTierFactory'
  );

  const ERC721BalanceTierFactoryFactory = await ethers.getContractFactory(
    'ERC721BalanceTierFactory'
  );

  const GatedNFTFactoryFactory = await ethers.getContractFactory(
    'GatedNFTFactory'
  );

  const RedeemableERC20ClaimEscrowFactory = await ethers.getContractFactory(
    'RedeemableERC20ClaimEscrow'
  );

  const NoticeBoardFactory = await ethers.getContractFactory('NoticeBoard');

  const EmissionsERC20FactoryFactory = await ethers.getContractFactory(
    'EmissionsERC20Factory'
  );

  const SaleFactoryFactory = await ethers.getContractFactory('SaleFactory');

  // ⚠️ Deployments to hardhat test network ⚠️
  const RedeemableERC20Factory = await RedeemableERC20FactoryFactory.deploy();

  const VerifyFactory = await VerifyFactoryFactory.deploy();

  const VerifyTierFactory = await VerifyTierFactoryFactory.deploy();

  const ERC20BalanceTierFactory = await ERC20BalanceTierFactoryFactory.deploy();

  const ERC20TransferTierFactory = await ERC20TransferTierFactoryFactory.deploy();

  const CombineTierFactory = await CombineTierFactoryFactory.deploy();

  const ERC721BalanceTierFactory = await ERC721BalanceTierFactoryFactory.deploy();

  const GatedNFTFactory = await GatedNFTFactoryFactory.deploy();

  const RedeemableERC20ClaimEscrow = await RedeemableERC20ClaimEscrowFactory.deploy();

  const NoticeBoard = await NoticeBoardFactory.deploy();

  const EmissionsERC20Factory = await EmissionsERC20FactoryFactory.deploy();

  const SaleFactory = await SaleFactoryFactory.deploy({
    maximumSaleTimeout: 10000,
    maximumCooldownDuration: 1000,
    redeemableERC20Factory: RedeemableERC20Factory.address,
  });

  // ⚠️ Saving the addresses to our test 😅 ⚠️
  addresses = {
    RedeemableERC20Factory: RedeemableERC20Factory.address,
    VerifyFactory: VerifyFactory.address,
    VerifyTierFactory: VerifyTierFactory.address,
    ERC20BalanceTierFactory: ERC20BalanceTierFactory.address,
    ERC20TransferTierFactory: ERC20TransferTierFactory.address,
    CombineTierFactory: CombineTierFactory.address,
    ERC721BalanceTierFactory: ERC721BalanceTierFactory.address,
    GatedNFTFactory: GatedNFTFactory.address,
    RedeemableERC20ClaimEscrow: RedeemableERC20ClaimEscrow.address,
    NoticeBoard: NoticeBoard.address,
    EmissionsERC20Factory: EmissionsERC20Factory.address,
    SaleFactory: SaleFactory.address,
  };
});

describe('SDK Test', () => {
  describe('Verify', () => {
    // Verify Roles.
    // TODO: Is it redundant? Because it is the same that the class or how will be the best way to test this?
    const DEFAULT_ADMIN_ROLE = ethers.utils.hexZeroPad('0x00', 32);

    const APPROVER = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes('APPROVER')
    );
    const REMOVER = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('REMOVER'));
    const BANNER = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('BANNER'));

    const APPROVER_ADMIN = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes('APPROVER_ADMIN')
    );
    const REMOVER_ADMIN = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes('REMOVER_ADMIN')
    );

    const BANNER_ADMIN = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes('BANNER_ADMIN')
    );

    it('Deploying VerifyChild', async () => {
      // TODO: Separete expects as unit testing
      const [signer] = await ethers.getSigners();
      const verify = await Verify.deploy(signer, chainId, {
        admin: signer.address,
        callback: ethers.constants.AddressZero,
      });

      expect(verify.DEFAULT_ADMIN_ROLE).to.equals(DEFAULT_ADMIN_ROLE);

      expect(verify.APPROVER).to.equals(APPROVER);
      expect(verify.REMOVER).to.equals(REMOVER);
      expect(verify.BANNER).to.equals(BANNER);

      expect(verify.APPROVER_ADMIN).to.equals(APPROVER_ADMIN);
      expect(verify.REMOVER_ADMIN).to.equals(REMOVER_ADMIN);
      expect(verify.BANNER_ADMIN).to.equals(BANNER_ADMIN);

      expect(await verify.callback()).to.equals(ethers.constants.AddressZero);

      const erc165Id = '0x01ffc9a7';
      expect(await verify.supportsInterface(erc165Id)).to.be.true;
      expect(await verify.supportsInterface('0xffffffff')).to.be.false;
    });
  });

  describe('Tiers', () => {
    // TODO: search the script to decode reports
    // console.log((await tier.report(ethers.constants.AddressZero)).toString());

    it('Deploying ERC20BalanceTierChild', async () => {
      const token = await deployErc20();

      const [signer] = await ethers.getSigners();
      const tier = await ERC20BalanceTier.deploy(signer, chainId, {
        erc20: token.address,
        tierValues: TierLevels,
      });

      expect(TierLevels).to.be.deep.equal(await tier.tierValues());
      await expectAsyncError(
        tier.setTier('', 2, []),
        'SET TIER: NOT IMPLEMENTED'
      );
    });

    it('Deploying ERC20TransferTierChild', async () => {
      const token = await deployErc20();

      const [signer] = await ethers.getSigners();
      const tier = await ERC20TransferTier.deploy(signer, chainId, {
        erc20: token.address,
        tierValues: TierLevels,
      });

      expect(TierLevels).to.be.deep.equal(await tier.tierValues());

      const requiredTierFive = TierLevels[4];

      await token.transfer(tier.address, requiredTierFive);
      await token.connect(signer).approve(tier.address, requiredTierFive);

      const beforeSet = await tier.report(signer.address);

      await tier.setTier(signer.address, Tier.FIVE, []);

      expect(await tier.report(signer.address)).to.be.not.equals(beforeSet);
    });

    it('Deploying ERC721BalanceTierChild', async () => {
      const token = await deployErc721();

      const [signer] = await ethers.getSigners();
      const tier = await ERC721BalanceTier.deploy(signer, chainId, {
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

      const verify = await Verify.deploy(signer, chainId, {
        admin: signer.address,
        callback: ethers.constants.AddressZero,
      });

      const tier = await VerifyTier.deploy(signer, chainId, verify.address);

      await expectAsyncError(
        tier.setTier('', 2, []),
        'SET TIER: NOT IMPLEMENTED'
      );
    });
  });

  describe('test', () => {});
});
