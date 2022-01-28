import { expect } from 'chai';
import { AddressBook } from '../src/addresses';

describe('Addresses', () => {

  it('returns the correct factory address when sending a chainId', () => {
    let trustFactoryAddress = AddressBook.getFactoryAddressFromChainId(8001);
    expect(trustFactoryAddress).to.be.equal('0x48087b53c0B0AF584Fde72192f96a6267Df776C0');
  });

  it('throws an error if there is no deployed TrustFactory for the chain', () => {
    expect(() => {
      AddressBook.getFactoryAddressFromChainId(8002);
    }).to.throw();
  });
});
