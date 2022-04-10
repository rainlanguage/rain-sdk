import { expect } from 'chai';
import { ethers } from 'hardhat';
import { TierLevels, Addresses } from './utils';

import { ERC20BalanceTier } from '../src';

/**
 * Hardhat network chainID
 */
export const chainId = 31337;

/**
 * Addresses saved that are in SDK BookAddresses deployed to Hardhat network.
 * **These addresses are deterministically generated with the HH signers.**
 */
export let addresses: Addresses;

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
  it('Deploying TierChild', async () => {
    const TokenFactory = await ethers.getContractFactory('ReserveTokenTest');
    const token = await TokenFactory.deploy();

    const [signer] = await ethers.getSigners();
    const tier = await ERC20BalanceTier.deploy(signer, chainId, {
      erc20: token.address,
      tierValues: TierLevels,
    });

    expect(TierLevels).to.be.deep.equal(await tier.tierValues());
  });
});
