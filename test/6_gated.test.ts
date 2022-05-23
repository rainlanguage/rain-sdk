import { expect } from 'chai';
import { ethers } from 'hardhat';

import { TierLevelsERC20, deployErc20, chainId } from './utils';

import { GatedNFT, ERC20BalanceTier, AddressBook } from '../src';

describe('GatedNFT', () => {
  it('should deploy a GatedNFTChild', async () => {
    const [signer, recipient] = await ethers.getSigners();
    const token = await deployErc20();
    const tier = await ERC20BalanceTier.deploy(signer, {
      erc20: token.address,
      tierValues: TierLevelsERC20,
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
      royaltyRecipient: recipient.address,
      royaltyBPS: 1,
    };

    const gatedNFT = await GatedNFT.deploy(signer, deployArgs);

    expect(await GatedNFT.isChild(signer, gatedNFT.address)).to.be.true;
  });

  it('should mint an nft from the gatedNFT with an always tier', async () => {
    const [signer, recipient, minter] = await ethers.getSigners();
    const tierAddress = AddressBook.getAddressesForChainId(chainId).alwaysTier;

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
      tier: tierAddress,
      minimumStatus: 5, // doesn't care the min status, always tier allow anyone
      maxPerAddress: 1,
      transferrable: 0,
      maxMintable: 1000,
      royaltyRecipient: recipient.address,
      royaltyBPS: 1,
    };

    const gatedNFT = await GatedNFT.deploy(signer, deployArgs);
    expect(await GatedNFT.isChild(signer, gatedNFT.address)).to.be.true;

    expect(await gatedNFT.balanceOf(minter.address)).to.be.equals(0);

    await gatedNFT.connect(minter).mint(minter.address);

    expect(await gatedNFT.balanceOf(minter.address)).to.be.equals(1);
  });
});
