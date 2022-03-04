const addressBook = [
  {
    chainId: 8001,
    trustFactory: '0x48087b53c0B0AF584Fde72192f96a6267Df776C0',
  }, 
];

export class AddressBook {
  public static getFactoryAddressFromChainId(chainId: number) {
    const addresses = addressBook.filter(a => a.chainId === chainId);
    if (!addresses.length) {
      throw new Error('No deployed TrustFactory for this chain');
    }
    return addresses[0].trustFactory;
  }
}
