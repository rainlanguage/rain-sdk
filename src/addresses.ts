const addressBook = [
  {
    chainId: 8001,
    addresses: {
      gatedNFTFactory: '0xD9AD3A87E4c1F604091c1A0E147c88B3A9E1B4ad',
      saleFactory: '0x7fbc27f1d14e0c59e2f4346b5166692659c4694d',
    },
  },
  {
    // These addresess are deployed in
    chainId: 31337,
    addresses: {
      redeemableERC20Factory: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      verifyFactory: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      verifyTierFactory: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
      erc20BalanceTierFactory: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
      erc20TransferTierFactory: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
      combineTierFactory: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
      erc721BalanceTierFactory: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
      gatedNFTFactory: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
      redeemableERC20ClaimEscrow: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
      noticeBoard: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
      emissionsERC20Factory: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
      saleFactory: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
    },
  },
];

export class AddressBook {
  public static getAddressesForChainId(chainId: number) {
    const network = addressBook.find(n => n.chainId === chainId);
    if (!network?.addresses) {
      throw new Error('No deployed contracts for this chain.');
    }
    return network.addresses;
  }
}
