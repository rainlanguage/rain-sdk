import { expect } from 'chai';
import { ethers } from 'hardhat';

import {
  chainId,
  TierLevels,
  deployErc20,
  deployErc721,
  expectAsyncError,
} from './utils';
import { ReserveTokenTest } from '../typechain';

import * as Util from './utils';

import {
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
} from '../dist';
// import {
//   AddressBook,
//   Sale,
//   Verify,
//   GatedNFT,
//   VerifyTier,
//   CombineTier,
//   NoticeBoard,
//   EmissionsERC20,
//   RedeemableERC20,
//   ERC20BalanceTier,
//   ERC20TransferTier,
//   ERC721BalanceTier,
//   RedeemableERC20ClaimEscrow,
// } from '../src';

/**
 * Addresses saved that are in SDK BookAddresses deployed to Hardhat network.
 * **These addresses are deterministically generated with the HH signers.**
 */
export let addresses: Util.Addresses;

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

      expect(await tier.currentTier(user.address)).to.be.equals(
        tier.levels.ZERO
      );

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
      expect(await tier.currentTier(user.address)).to.be.equals(
        tier.levels.ZERO
      );

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

      expect(await tier.currentTier(user.address)).to.be.equals(
        tier.levels.TWO
      );
    });
  });

  describe('ERC20TransferTier', () => {
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

      expect(await token.allowance(signer.address, tier.address)).to.be.equals(
        0
      );

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

      expect(await tierUser.currentTier(user.address)).to.be.equals(
        levels.ZERO
      );

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
      const [signer, user] = await ethers.getSigners();
      const token = await deployErc20();
      const tier = await ERC20TransferTier.deploy(signer, {
        erc20: token.address,
        tierValues: TierLevels,
      });

      const tierUser = tier.connect(user);
      const levels = tierUser.levels;

      // Set as initial level tier seven
      const amountToTierSeven = await tierUser.amountToTier(levels.SEVEN);
      await token.transfer(user.address, amountToTierSeven);

      await tierUser.approveTokenForTier(amountToTierSeven);
      await tierUser.setTier(user.address, levels.SEVEN, []);

      expect(await tierUser.currentTier(user.address)).to.be.equals(
        levels.SEVEN
      );

      // user want to decrease to Tier 4
      const balanceBefore = await token.balanceOf(user.address);
      const amountReturnedExpected = await tierUser.amountToTier(levels.FOUR);

      await tierUser.setTier(user.address, levels.FOUR, []);

      expect(await tierUser.currentTier(user.address)).to.be.equals(
        levels.FOUR
      );
      expect(await token.balanceOf(user.address)).to.be.equals(
        balanceBefore.add(amountReturnedExpected)
      );
    });
  });

  describe('Tiers', () => {
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
      const [signer, receipient] = await ethers.getSigners();
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
        royaltyBPS: 1,
      };

      const gatedNFT = await GatedNFT.deploy(signer, deployArgs);

      expect(await GatedNFT.isChild(signer, gatedNFT.address)).to.be.true;
    });
  });

  describe('Sale', () => {
    let reserve: ReserveTokenTest, tier: ERC20BalanceTier;

    before('deploy required contracts', async () => {
      const [deployer] = await ethers.getSigners();
      reserve = await deployErc20(deployer);
      tier = await ERC20BalanceTier.deploy(deployer, {
        tierValues: TierLevels,
        erc20: reserve.address,
      });
    });

    it('should deploy a Sale child with StateConfigs calculated outside deploy method', async () => {
      const [deployer, recipient] = await ethers.getSigners();

      // 5 blocks from now
      const startBlock = (await ethers.provider.getBlockNumber()) + 5;
      const saleDuration = 30;
      const minimumRaise = ethers.BigNumber.from('150000').mul(
        Util.RESERVE_ONE
      );

      const totalTokenSupply = ethers.BigNumber.from('2000').mul(Util.ONE);
      const redeemableERC20Config = {
        name: 'Token',
        symbol: 'TKN',
        distributor: Util.zeroAddress,
        initialSupply: totalTokenSupply,
      };

      const staticPrice = ethers.BigNumber.from('75').mul(Util.RESERVE_ONE);

      const constants = [staticPrice];
      const vBasePrice = Sale.op(Sale.Opcodes.VAL, 0);

      const sources = [Sale.concat([vBasePrice])];

      // All configs calculated outside of deploy method
      const saleConfig = {
        canStartStateConfig: Sale.afterBlockNumberConfig(startBlock),
        canEndStateConfig: Sale.afterBlockNumberConfig(
          startBlock + saleDuration
        ),
        calculatePriceStateConfig: {
          sources,
          constants,
          stackLength: 1,
          argumentsLength: 0,
        },
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

    it('should deploy a Sale child with canStart config as number', async () => {
      const [deployer, recipient] = await ethers.getSigners();

      // 5 blocks from now
      const startBlock = (await ethers.provider.getBlockNumber()) + 5;
      const saleDuration = 30;
      const minimumRaise = ethers.BigNumber.from('150000').mul(
        Util.RESERVE_ONE
      );

      const totalTokenSupply = ethers.BigNumber.from('2000').mul(Util.ONE);
      const redeemableERC20Config = {
        name: 'Token',
        symbol: 'TKN',
        distributor: Util.zeroAddress,
        initialSupply: totalTokenSupply,
      };

      const staticPrice = ethers.BigNumber.from('75').mul(Util.RESERVE_ONE);

      const constants = [staticPrice];
      const vBasePrice = Sale.op(Sale.Opcodes.VAL, 0);

      const sources = [Sale.concat([vBasePrice])];

      // using canStartStateConfig as number directly
      const saleConfig = {
        canStartStateConfig: startBlock,
        canEndStateConfig: Sale.afterBlockNumberConfig(
          startBlock + saleDuration
        ),
        calculatePriceStateConfig: {
          sources,
          constants,
          stackLength: 1,
          argumentsLength: 0,
        },
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

    it('should deploy a Sale child with canEnd config as number', async () => {
      const [deployer, recipient] = await ethers.getSigners();

      // 5 blocks from now
      const startBlock = (await ethers.provider.getBlockNumber()) + 5;
      const saleDuration = 30;
      const minimumRaise = ethers.BigNumber.from('150000').mul(
        Util.RESERVE_ONE
      );

      const totalTokenSupply = ethers.BigNumber.from('2000').mul(Util.ONE);
      const redeemableERC20Config = {
        name: 'Token',
        symbol: 'TKN',
        distributor: Util.zeroAddress,
        initialSupply: totalTokenSupply,
      };

      const staticPrice = ethers.BigNumber.from('75').mul(Util.RESERVE_ONE);

      const constants = [staticPrice];
      const vBasePrice = Sale.op(Sale.Opcodes.VAL, 0);

      const sources = [Sale.concat([vBasePrice])];

      // using canStart and canEnd as number directly
      const saleConfig = {
        canStartStateConfig: startBlock,
        canEndStateConfig: startBlock + saleDuration,
        calculatePriceStateConfig: {
          sources,
          constants,
          stackLength: 1,
          argumentsLength: 0,
        },
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

    it('should deploy a Sale child providing directly the staticPrice', async () => {
      const [deployer, recipient] = await ethers.getSigners();

      // 5 blocks from now
      const startBlock = (await ethers.provider.getBlockNumber()) + 5;
      const saleDuration = 30;
      const minimumRaise = ethers.BigNumber.from('150000').mul(
        Util.RESERVE_ONE
      );

      const totalTokenSupply = ethers.BigNumber.from('2000').mul(Util.ONE);
      const redeemableERC20Config = {
        name: 'Token',
        symbol: 'TKN',
        distributor: Util.zeroAddress,
        initialSupply: totalTokenSupply,
      };

      const staticPrice = ethers.BigNumber.from('75').mul(Util.RESERVE_ONE);

      // using cdirectly the price
      const saleConfig = {
        canStartStateConfig: startBlock,
        canEndStateConfig: startBlock + saleDuration,
        calculatePriceStateConfig: staticPrice,
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
  });
});
