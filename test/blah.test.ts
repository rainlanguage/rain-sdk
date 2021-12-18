import { expect } from 'chai';
describe('Tests', () => {
  it('Works', () => {
    expect(1 + 1).to.be.equal(2);
  });
  it('Fails', () => {
    expect(() => {
      throw new Error('');
    }).to.throw();
  });
});
