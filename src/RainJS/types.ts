import { BigNumber} from 'ethers';
import { isHexString } from 'ethers/lib/utils';
import { StateConfig} from '../classes/vm';


// 18 decimals or i.e "DECIMALS" - used for fixed point match
export const eighteenZeros = "1000000000000000000";

/**
 * type for simulating and storing ITier contract data
 */
export interface itiers {
  [address: string]: {
    report: {
      [wallet: string]: BigNumber
    }
  }
}

/**
 * type for simulating and storing ERC20token contract data
 */
export interface erc20 {
  totalSupply: BigNumber,
  decimals: number,
  balanceOf: {
    [wallet: string]: BigNumber
  },
  snapshots?: {
    [id: string]: {
      totalSupplyAt: BigNumber,
      balanceOfAt: {
        [wallet: string]: BigNumber
      }
    }
  }
}

/**
 * type for simulating and storing ERC721 contract data
 */
export interface erc721 {
  [id: string]: {
    ownerOf: string
  }
}

/**
 * type for simulating and storing ERC1155 contract data
 */
export interface erc1155 {
  [id: string]: {
    balanceOf: {
      [wallet: string]: BigNumber
    }
  }
}

/**
 * type for simulating and storing multiple ERC20 tokens
 */
export interface erc20s {
  [address: string]: erc20
}

/**
 * type for simulating and storing multiple ERC721 tokens
 */
export interface erc721s {
  [address: string]: erc721
}

/**
 * type for simulating and storing multiple ERC1155 tokens
 */
export interface erc1155s {
  [address: string]: erc1155
}

/**
 * type for simulating and storing orderbook Vaults data
 */
export interface vaults {
  [owner: string]: {
    [tokenAddress: string]: {
      vaultId: {
        [vaultId: string]: BigNumber
      }
    }
  }
}

/**
 * type for simulating and storing orderbook Order data
 */
export interface order {
  orderHash: string,
  owner: string,
  inputToken: string,
  outputToken: string,
  inputVaultId: string,
  outputVaultId: string,
  vmConfig: StateConfig
}

/**
 * type for simulating and storing multiple orderbook Orders
 */
export interface orders {
  [orderHash: string]: order 
}

/**
 * type for bounty config
 */
export interface bountyConfig {
  aVaultId: string,
  bVaultId: string,
}

/**
 * type for simulating and storing matched order cleared funds
 */
export interface clearedFunds {
  [orderHash: string]: BigNumber
}

/**
 * type for simulating and storing matched order counterparty cleared funds
 */
export interface clearedCounterPartyFunds {
  [orderHash: string]: {
    [counterPartyAddress: string]: BigNumber
  }
}

/**
 * function to check if the strings values of the simulatioin types are correct
 * 
 * @param address - address string to check
 * 
 * @returns boolean
 */
export function isValidString(address: string) : boolean {
  if (isHexString(address) || !isNaN(Number(address))) {
    return true
  }
  else {
    try {
      BigInt(address)
      return true
    }
    catch(err) {
      return false
    }
  }
}