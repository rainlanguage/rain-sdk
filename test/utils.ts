import { ethers } from 'hardhat';
import { BigNumberish } from 'ethers';
import { assert } from 'chai';

import { ReserveTokenTest, ReserveTokenERC721 } from '../typechain';


export const eighteenZeros = '000000000000000000';

/**
 * Hardhat network chainID
 */
export const chainId = 31337;

/**
 * Enum for each Tier
 */
export enum Tier {
  ZERO,
  ONE,
  TWO,
  THREE,
  FOUR,
  FIVE,
  SIX,
  SEVEN,
  EIGHT,
}

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

export async function deployErc20(): Promise<ReserveTokenTest> {
  const TokenFactory = await ethers.getContractFactory('ReserveTokenTest');
  return (await TokenFactory.deploy()) as ReserveTokenTest;
}

export async function deployErc721(): Promise<ReserveTokenERC721> {
  const TokenFactory = await ethers.getContractFactory('ReserveTokenERC721');
  return (await TokenFactory.deploy()) as ReserveTokenERC721;
}

/**
 * Expect that a async function/Promise throw an Error. Should be use only for
 * JS errors. To catch error in EVM, should use the ethereum-waffle library.
 *
 * @param cb - async functon or Promise (same)
 * @param errorMsg - (optional) Error message that is expected
 */
export async function expectAsyncError(
  cb: Promise<unknown>,
  errorMsg?: string
): Promise<void> {
  try {
    await cb;
    assert(false, 'no error was throw');
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown Error';

    if (message === 'no error was throw') {
      if (errorMsg) {
        assert(false, `Expected an error with "${errorMsg}" but ${message}`);
      }
      assert(false, message);
    }

    if (!errorMsg) {
      return;
    }

    if (errorMsg === message) {
      return;
    } else {
      assert(
        false,
        `Expected an error with "${errorMsg}" but got "${message}"`
      );
    }
  }
}

export const mockSubgraphReceipt = () => {};

export function arg(valIndex: number): number {
  let arg = 1;
  arg <<= 7;
  arg += valIndex;
  return arg;
}

/**
 * Constructs the operand for RainVM's `call` opcode by packing 3 numbers into a single byte. All parameters use zero-based counting i.e. an `fnSize` of 0 means to allocate one element (32 bytes) on the stack to define your functions, while an `fnSize` of 3 means to allocate all four elements (4 * 32 bytes) on the stack.
 *
 * @param sourceIndex - index of function source in `immutableSourceConfig.sources`
 * @param loopSize - number of times to subdivide vals, reduces uint size but allows for more vals (range 0-7)
 * @param valSize - number of vals in outer stack (range 0-7)
 */
export function callSize(
  sourceIndex: number,
  loopSize: number,
  valSize: number
): number {
  // CallSize(
  //   op_.val & 0x07,      // 00000111
  //   op_.val >> 3 & 0x03, // 00011000
  //   op_.val >> 5 & 0x07  // 11100000
  // )

  if (sourceIndex < 0 || sourceIndex > 7) {
    throw new Error('Invalid fnSize');
  } else if (loopSize < 0 || loopSize > 3) {
    throw new Error('Invalid loopSize');
  } else if (valSize < 0 || valSize > 7) {
    throw new Error('Invalid valSize');
  }
  let callSize = valSize;
  callSize <<= 2;
  callSize += loopSize;
  callSize <<= 3;
  callSize += sourceIndex;
  return callSize;
}

export async function createEmptyBlock(count?: number): Promise<void> {
  const signers = await ethers.getSigners();
  const tx = { to: signers[1].address };
  if (typeof count !== 'undefined' && count > 0) {
    for (let i = 0; i < count; i++) {
      await signers[0].sendTransaction(tx);
    }
  } else {
    await signers[0].sendTransaction(tx);
  }
};
