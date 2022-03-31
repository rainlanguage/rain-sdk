const addressBook = [
  {
    chainId: 8001,
    addresses: {
      gatedNFT: '0xD9AD3A87E4c1F604091c1A0E147c88B3A9E1B4ad',
      sale: '0x7fbc27f1d14e0c59e2f4346b5166692659c4694d',
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
