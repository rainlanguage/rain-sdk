import { ethers } from 'hardhat';
import { BigNumberish } from 'ethers';

export const eighteenZeros = '000000000000000000';

/**
 * Return the Levels tier used by default. LEVELS always will be an array with 8 elements to
 * correspond to the 8 TierLevels
 */
export const TierLevels: BigNumberish[] = Array.from(
  Array(8).keys()
).map(value => ethers.BigNumber.from(++value + eighteenZeros)); // [1,2,3,4,5,6,7,8]

/**
 * Addresses saved that are in SDK BookAddresses deployed to Hardhat network.
 * **These addresses are deterministically generated with the HH signers.**
 */
export interface Addresses {
  RedeemableERC20Factory: string;
  VerifyFactory: string;
  VerifyTierFactory: string;
  ERC20BalanceTierFactory: string;
  ERC20TransferTierFactory: string;
  CombineTierFactory: string;
  ERC721BalanceTierFactory: string;
  GatedNFTFactory: string;
  RedeemableERC20ClaimEscrow: string;
  NoticeBoard: string;
  EmissionsERC20Factory: string;
  SaleFactory: string;
}
