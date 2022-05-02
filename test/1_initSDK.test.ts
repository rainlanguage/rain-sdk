import { ethers } from 'hardhat';
import { expect } from 'chai';
import { Addresses, chainId } from './utils';

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
} from '../src';

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

  // Deploying AlwaysTier
  const sourceAlways = CombineTier.concat([
    CombineTier.op(CombineTier.Opcodes.ALWAYS),
  ]);
  const alwaysArg = {
    sources: [sourceAlways],
    constants: [],
    stackLength: 8,
    argumentsLength: 0,
  };

  const tx = await CombineTierFactory.createChildTyped(alwaysArg);
  const AlwaysTier = CombineTier.getNewChildFromReceipt(
    await tx.wait(),
    CombineTierFactory
  );

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
    AlwaysTier: AlwaysTier,
  };
});

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

  it('should get the AlwaysTier address', () => {
    const address = AddressBook.getAddressesForChainId(chainId).alwaysTier;
    expect(address).to.be.equals(addresses.AlwaysTier);
  });
});
