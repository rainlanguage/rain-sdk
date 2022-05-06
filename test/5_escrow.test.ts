// import { expect } from 'chai';
import { ethers } from 'hardhat';

import { expectAsyncError } from './utils';

import { RedeemableERC20ClaimEscrow } from '../src';

describe('ClaimEscrow', () => {
  it('should fail when a not formatted address is provided as Sale or Token', async () => {
    const [signer] = await ethers.getSigners();

    // Zero address is used since is already formatted
    const token = ethers.constants.AddressZero;
    const sale = ethers.constants.AddressZero;

    const invalidAddress = '0xabcdabcdabcdabcdabcd';

    expectAsyncError(
      RedeemableERC20ClaimEscrow.get(invalidAddress, token, signer),
      'SALE: NOT A VALID FORMAT ADDRESS'
    );

    expectAsyncError(
      RedeemableERC20ClaimEscrow.get(sale, invalidAddress, signer),
      'TOKEN: NOT A VALID FORMAT ADDRESS'
    );
  });
});
