import { expect } from 'chai';
import { ethers } from 'hardhat';
import {
  chainId,
  Tier,
  TierLevels,
  Addresses,
  deployErc20,
  deployErc721,
  expectAsyncError,
} from './utils';

// import {
//   ERC20BalanceTier,
//   ERC20TransferTier,
//   ERC721BalanceTier,
//   VerifyTier,
//   Verify,
// } from '../dist';
import {
  StandardOps,
  AddressBook,
  Sale,
  Verify,
  GatedNFT,
  VerifyTier,
  CombineTier,
  NoticeBoard,
  EmissionsERC20,
  RedeemableERC20,
  ERC20BalanceTier,
  ERC20TransferTier,
  ERC721BalanceTier,
  RedeemableERC20ClaimEscrow,
} from '../src';

/**
 * Addresses saved that are in SDK BookAddresses deployed to Hardhat network.
 * **These addresses are deterministically generated with the HH signers.**
 */
export let addresses: Addresses;

// TODO: search the script to decode reports
// await tier.report(ethers.constants.AddressZero)).toString());

// Meanwhile

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
  describe('SDK - BookAddress', () => {
    it('should fail if no address stored in the book for a chain', () => {
      const arbitraryId = 1234;
      expect(() => AddressBook.getAddressesForChainId(arbitraryId)).to.throw(
        Error,
        'No deployed contracts for this chain.'
      );
    });

    it('should get the address directly from the book', () => {
      const address = AddressBook.getAddressesForChainId(chainId).noticeBoard;
      expect(address).to.be.equals(addresses.NoticeBoard);
    });

    it('should get the RedeemableERC20Factory address', () => {
      const address = RedeemableERC20.getBookAddress(chainId);
      expect(address).to.be.equals(addresses.RedeemableERC20Factory);
    });

    it('should get the VerifyFactory address', async () => {
      const address = Verify.getBookAddress(chainId);
      expect(address).to.be.equals(addresses.VerifyFactory);
    });

    it('should get the VerifyTierFactory address', async () => {
      const address = VerifyTier.getBookAddress(chainId);
      expect(address).to.be.equals(addresses.VerifyTierFactory);
    });

    it('should get the ERC20BalanceTierFactory address', async () => {
      const address = ERC20BalanceTier.getBookAddress(chainId);
      expect(address).to.be.equals(addresses.ERC20BalanceTierFactory);
    });

    it('should get the ERC20TransferTierFactory address', async () => {
      const address = ERC20TransferTier.getBookAddress(chainId);
      expect(address).to.be.equals(addresses.ERC20TransferTierFactory);
    });

    it('should get the CombineTierFactory address', async () => {
      const address = CombineTier.getBookAddress(chainId);
      expect(address).to.be.equals(addresses.CombineTierFactory);
    });

    it('should get the  ERC721BalanceTierFactory address', async () => {
      const address = ERC721BalanceTier.getBookAddress(chainId);
      expect(address).to.be.equals(addresses.ERC721BalanceTierFactory);
    });

    it('should get the  GatedNFTFactory address', async () => {
      const address = GatedNFT.getBookAddress(chainId);
      expect(address).to.be.equals(addresses.GatedNFTFactory);
    });

    it('should get the  EmissionsERC20Factory address', async () => {
      const address = EmissionsERC20.getBookAddress(chainId);
      expect(address).to.be.equals(addresses.EmissionsERC20Factory);
    });

    it('should get the  SaleFactory address', async () => {
      const address = Sale.getBookAddress(chainId);
      expect(address).to.be.equals(addresses.SaleFactory);
    });

    it('should get the RedeemableERC20ClaimEscrow address', () => {
      const address = RedeemableERC20ClaimEscrow.getBookAddress(chainId);
      expect(address).to.be.equals(addresses.RedeemableERC20ClaimEscrow);
    });

    it('should get the NoticeBoard address', () => {
      const address = NoticeBoard.getBookAddress(chainId);
      expect(address).to.be.equals(addresses.NoticeBoard);
    });
  });

  describe('ClaimEscrow', () => {
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
  });

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

  describe('ERC20BalanceTier', () => {
    it('Deploying ERC20BalanceTierChild', async () => {
      const [signer] = await ethers.getSigners();
      const token = await deployErc20();
      const tier = await ERC20BalanceTier.deploy(signer, {
        erc20: token.address,
        tierValues: TierLevels,
      });

      expect(TierLevels).to.be.deep.equal(await tier.tierValues());
      await expectAsyncError(
        tier.setTier('', 2, []),
        'SET TIER: NOT IMPLEMENTED'
      );
    });
  });

  describe('Tiers', () => {
    it('Deploying ERC20TransferTierChild', async () => {
      const token = await deployErc20();

      const [signer] = await ethers.getSigners();
      const tier = await ERC20TransferTier.deploy(signer, {
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

  describe('GatedNFT', () => {
    it('should deploy a GatedNFTChild', async () => {
      const [signer, receipient] = await ethers.getSigners()
      const token = await deployErc20();
      const tier = await ERC20BalanceTier.deploy(signer, {
        erc20: token.address,
        tierValues: TierLevels,
      });

      const gatedConfig = {
        name: 'Test',
        symbol: 'TEST',
        description: 'Testing',
        animationUrl:
          'https://ipfs.io/ipfsbafybeify52a63pgcshhbtkff4nxxxp2zp5yjn2xw43jcy4knwful7ymmgy',
        imageUrl:
          'https://ipfs.io/ipfsbafybeify52a63pgcshhbtkff4nxxxp2zp5yjn2xw43jcy4knwful7ymmgy',
        animationHash:
          '0x0000000000000000000000000000000000000000000000000000000000000000',
        imageHash:
          '0x0000000000000000000000000000000000000000000000000000000000000000',
      };

      const deployArgs = {
        config: gatedConfig,
        tier: tier.address,
        minimumStatus: 1,
        maxPerAddress: 1,
        transferrable: 0,
        maxMintable: 1000,
        royaltyRecipient: receipient.address,
        royaltyBPS: 1
      }

      const gatedNFT = await GatedNFT.deploy(signer, deployArgs);

      expect(await GatedNFT.isChild(signer, gatedNFT.address)).to.be.true;
    });
  });

  describe('Sale', () => {
    // TODO: Create a sale to test the opcode with afterBlockNumberConfig method
    it('Opcodes', () => {
      // TODO: Remove it. Just for visual check
      expect(StandardOps.length).to.be.equals(Sale.Opcode.REMAINING_UNITS);
    });
  });
});
