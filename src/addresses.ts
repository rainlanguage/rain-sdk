const addressBook = [
  {
    chainId: 8001,
    addresses: {
      gatedNFT: '0x48087b53c0B0AF584Fde72192f96a6267Df776C0',
    }
  }, 
];

export class AddressBook {
  public static getAddressesForChainId(chainId: number) {
    const network = addressBook.find(n => n.chainId === chainId);
    if (network?.addresses) {
      throw new Error('No deployed contracts for this chain.');
    }
    return network.addresses;
  }
}
