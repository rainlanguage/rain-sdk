import { BigNumber } from 'ethers';
import { StateConfig } from '../../classes/vm';

/**
 * @public
 * 18 decimals or i.e "DECIMALS" - used for fixed point match
 */ 
export const eighteenZeros = "1000000000000000000";

/**
 * @public
 * A simple key/value pair object used as storage in simulation classes to store the required data in BigNumber format
 */
export interface sStore extends Record<string, BigNumber> {}

/**
 * @public
 * type for simulating and storing ITier contract data
 */
export interface sITiers extends Record<string, {report: sStore}> {}

/**
 * @public
 * type for SimERC20 with snapshots
 */
export interface sSnapshot extends Record<string, {totalSupplyAt: BigNumber, balanceOfAt: sStore}> {}

/**
 * @public
 * type for simulating and storing ERC20token contract data
 */
export interface sERC20 {
  totalSupply: BigNumber,
  decimals: number,
  balanceOf: sStore,
  snapshots?: sSnapshot
}

/**
 * @public
 * type for simulating and storing ERC721 contract data
 */
export interface sERC721 extends Record<string, {ownerOf: string}> {}

/**
 * @public
 * type for simulating and storing ERC1155 contract data
 */
export interface sERC1155 extends Record<string , {balanceOf: sStore}> {}

/**
 * @public
 * type for simulating and storing multiple ERC20 tokens
 */
export interface sERC20s extends Record<string, sERC20> {}

/**
 * @public
 * type for simulating and storing multiple ERC721 tokens
 */
export interface sERC721s extends Record<string, sERC721> {}

/**
 * @public
 * type for simulating and storing multiple ERC1155 tokens
 */
export interface sERC1155s extends Record<string, sERC1155> {}

/**
 * @public
 * type for simulating and storing orderbook Vaults data
 */
export interface sVaults extends Record<string, Record<string, sStore>> {}

/**
 * @public
 * token the address of the desired token
 * vaultId corresponding token vault id
 */
export type sIOConfig = { token: string; vaultId: string };

/**
 * @public
 * type for simulating and storing orderbook Order data
 */
export interface sOrder {
  orderHash: string,
  owner: string,
  validInputs: sIOConfig[];
  validOutputs: sIOConfig[];
  vmConfig: StateConfig
}

/** 
 * @public
 * type for simulating and storing multiple orderbook Orders
 */
export interface sOrders extends Record<string, sOrder> {}

/**
 * @public
 * type for bounty config
 */
export interface sClearConfig {
  aInputIndex: number,
  aOutputIndex: number,
  bInputIndex: number,
  bOutputIndex: number,
  aBountyVaultId: string,
  bBountyVaultId: string,
}

/**
 * @public
 * type for simulating and storing matched order cleared funds
 */
export interface sClearedFunds extends sStore {}

/**
 * @public
 * type for simulating and storing matched order counterparty cleared funds
 */
export interface sClearedCounterPartyFunds extends Record<string, sStore> {}

/**
 * @public
 * Interface for matchmaker forcasting a script
 */
 export interface ReserveBook extends Record<string, { minP: BigNumber, maxP: BigNumber }> {}