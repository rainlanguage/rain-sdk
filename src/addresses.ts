const addressBook = [
  {
    chainId: 80001,
    addresses: {
      combineTierFactory: '0x975520345dA72EBc02713e10D8Bc117a4ADe94e7',
      erc20BalanceTierFactory: '0x493DA4e4690b0dedC3C16ddD6308ea101f182240',
      erc20TransferTierFactory: '0xc45d346c43Fad2eb8b5E3A3833BB2225Da992B3d',
      erc721BalanceTierFactory: '0x72de0FC71B8870Dfd5e766A0EA08A3077F405dF4',
      emissionsERC20Factory: '0x92666d3e73e876D5f8Be2E6B79989A6A81e8F3FB',
      gatedNFTFactory: '0x87115DfC71B8e4691a692dbF6cDD8a54C12b208C',
      noticeBoard: '0xe0d0B33A3cA373bf89Ef100B0F2eF8196F2652FE',
      redeemableERC20ClaimEscrow: '0x9AA51395f1Ab80a02Bf6F4553A89dE9Fd71B1844',
      redeemableERC20Factory: '0xdaCD5d24b876e3BbebE9619a28CdeEa26117Bf64',
      saleFactory: '0xcb7A7ce54EE654A0018E7FC48ADa0C0DCF634a2C',
      verifyFactory: '0x9718Fb2F6669b38F3caEbbD6d113cA33499E0F87',
      verifyTierFactory: '0xfA4482A7F559367A3c0c0968926D9c08c4deeB86',
    },
  },
  {
    // These addresess are deployed in HH Network (test)
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

/**
 * @public
 * Type for all the addresses stored in the Book
 */
export type Addresses = {
  [key: string]: string;
  redeemableERC20Factory: string;
  verifyFactory: string;
  verifyTierFactory: string;
  erc20BalanceTierFactory: string;
  erc20TransferTierFactory: string;
  combineTierFactory: string;
  erc721BalanceTierFactory: string;
  gatedNFTFactory: string;
  redeemableERC20ClaimEscrow: string;
  noticeBoard: string;
  emissionsERC20Factory: string;
  saleFactory: string;
};

/**
 *  @public
 */
export class AddressBook {
  public static getAddressesForChainId = (chainId: number): Addresses => {
    const network = addressBook.find(n => n.chainId === chainId);
    if (!network?.addresses) {
      throw new Error('No deployed contracts for this chain.');
    }
    return network.addresses;
  };
}
