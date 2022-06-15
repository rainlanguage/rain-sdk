import { ethers } from 'hardhat';
import {
  BigNumber,
  BigNumberish,
  Signer,
  ContractTransaction,
  utils,
} from 'ethers';
import { assert } from 'chai';

import {
  ReserveTokenTest,
  ReserveTokenERC721,
  ReserveTokenERC1155,
} from '../typechain';
import { Interface } from 'ethers/lib/utils';

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

export enum SaleStatus {
  Pending,
  Active,
  Success,
  Fail,
}

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
  AlwaysTier: string;
}

export const sixZeros = '000000';
export const eighteenZeros = '000000000000000000';

export const RESERVE_ONE = ethers.BigNumber.from('1' + sixZeros);
export const ONE = ethers.BigNumber.from('1' + eighteenZeros);
export const zeroAddress = ethers.constants.AddressZero;

/**
 * Return the Levels tier used by default with ERC20 tokens. LEVELS always will be an array with 8 elements to
 * correspond to the 8 TierLevels
 */
export const TierLevelsERC20: BigNumberish[] = Array.from(Array(8).keys()).map(
  (value) => ethers.BigNumber.from(++value + eighteenZeros)
); // [1,2,3,4,5,6,7,8] each mul by 1*10**18

export const TierLevelsERC721 = Array.from(Array(8).keys()).map((value) =>
  ethers.BigNumber.from(++value)
); // [1,2,3,4,5,6,7,8]

export async function deployErc20(signer?: Signer): Promise<ReserveTokenTest> {
  const TokenFactory = await ethers.getContractFactory(
    'ReserveTokenTest',
    signer
  );
  return (await TokenFactory.deploy()) as ReserveTokenTest;
}

export async function deployErc721(
  signer?: Signer
): Promise<ReserveTokenERC721> {
  const TokenFactory = await ethers.getContractFactory(
    'ReserveTokenERC721',
    signer
  );
  return (await TokenFactory.deploy()) as ReserveTokenERC721;
}

export async function deployErc1155(
  signer?: Signer
): Promise<ReserveTokenERC1155> {
  const TokenFactory = await ethers.getContractFactory(
    'ReserveTokenERC1155',
    signer
  );
  return (await TokenFactory.deploy()) as ReserveTokenERC1155;
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

/**
 * Time related helpers
 */
export class Time {
  /** Helper to convert between time units */
  public static duration = {
    seconds: function (val: BigNumberish) {
      return BigNumber.from(val);
    },
    minutes: function (val: BigNumberish) {
      return BigNumber.from(val).mul(this.seconds('60'));
    },
    hours: function (val: BigNumberish) {
      return BigNumber.from(val).mul(this.minutes(60));
    },
    days: function (val: BigNumberish) {
      return BigNumber.from(val).mul(this.hours('24'));
    },
    weeks: function (val: BigNumberish) {
      return BigNumber.from(val).mul(this.days('7'));
    },
    years: function (val: BigNumberish) {
      return BigNumber.from(val).mul(this.days('365'));
    },
  };

  /**
   * Returns the time of the last mined block in seconds
   */
  public static async currentTime(): Promise<number> {
    return (
      await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;
  }

  /**
   * Return the current block
   */
  public static async currentBlock(): Promise<number> {
    return await ethers.provider.getBlockNumber();
  }

  /**
   * Advance an amount of block(s) mine them
   */
  public static async advanceBlock(amount: number = 1) {
    if (amount < 0) {
      throw new Error(`Cannot mine negative blocks: ${amount}`);
    }

    await ethers.provider.send('evm_mine', []);
    if (amount > 1) {
      await this.advanceBlock(amount - 1);
    }
  }

  /**
   * Increases time by the passed duration in seconds. Note that could exist a gap between the timestamp
   * mined in the block
   */
  public static async increase(duration: BigNumberish) {
    if (!BigNumber.isBigNumber(duration)) {
      duration = BigNumber.from(duration);
    }

    if (duration.isNegative()) {
      throw Error(`Cannot increase time by a negative amount (${duration})`);
    }

    await ethers.provider.send('evm_increaseTime', [duration.toNumber()]);

    await this.advanceBlock();
  }
}

/**
 *
 * @param tx transaction where event occurs
 * @param eventName name of event
 * @returns Event arguments, can be deconstructed by array index or by object key
 */
export const getEventArgs = async (
  tx: ContractTransaction,
  eventName: string,
  contractAddress: string,
  iface: Interface
): Promise<utils.Result> => {
  const receipt = await tx.wait();

  const objectEvent = receipt.events?.find(
    (x) =>
      x.event === eventName &&
      x.address.toLowerCase() === contractAddress.toLowerCase()
  );

  if (!objectEvent) {
    throw new Error(`Could not find event with name ${eventName}`);
  }

  return iface.decodeEventLog(
    iface.getEvent(eventName),
    objectEvent.data,
    objectEvent.topics
  );
};

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
}
