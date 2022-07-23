import { BigNumber } from 'ethers';
import { StateConfig } from '../classes/vm';


/**
 * @public
 * An interface/type of JSVM opcodes' function's body
 */
export interface OpJSVM { 
  (state: StateJSVM, operand: number, data?: any): void 
}


/**
 * @public
 * An interface for creating a key/value pair of opcodes functions to override.
 */
export interface FnPtrsJSVM extends Record<number, OpJSVM> {}
 
/**
 * @public - An interface, StateJS is basically javascript version of 'State' struct
 * in RainVM, although it doesn't need stackLength and argumentsLength to operate. It
 * receives a regular RainVM in the constructor and initiates the stack for it and all
 * opcodes do their operations to the stack.
 * @see State in RainVM.sol
 *
 */
export interface StateJSVM {
  /**
   * The property to store the RainVM script constants.
   */
  readonly constants: BigNumber[];

  /**
   * The property to store the RainVM script sources.
   */
  readonly sources: Uint8Array[];

  /**
   * The RainJSVM's stack.
   */
  readonly stack: BigNumber[];

  /**
   * Used only for zipmap opcode arguments
   */
  readonly argStack: BigNumber[];

}

/**
 * @public
 * 18 decimals or i.e "DECIMALS" - used for fixed point match
 */ 
export const eighteenZeros = "1000000000000000000";

/**
 * @public
 * A simple key/value pair object used as storage in simulation classes to store the required data
 */
export interface SStore extends Record<string, BigNumber> {}

/**
 * @public
 * type for simulating and storing ITier contract data
 */
export interface SITiers extends Record<string, {report: SStore}> {}

/**
 * @public
 * type for SimERC20 with snapshots
 */
export interface SSnapshot extends Record<string, {totalSupplyAt: BigNumber, balanceOfAt: SStore}> {}

/**
 * @public
 * type for simulating and storing ERC20token contract data
 */
export interface SERC20 {
  totalSupply: BigNumber,
  decimals: number,
  balanceOf: SStore,
  snapshots?: SSnapshot
}

/**
 * @public
 * type for simulating and storing ERC721 contract data
 */
export interface SERC721 extends Record<string, {ownerOf: string}> {}

/**
 * @public
 * type for simulating and storing ERC1155 contract data
 */
export interface SERC1155 extends Record<string , {balanceOf: SStore}> {}

/**
 * @public
 * type for simulating and storing multiple ERC20 tokens
 */
export interface SERC20s extends Record<string, SERC20> {}

/**
 * @public
 * type for simulating and storing multiple ERC721 tokens
 */
export interface SERC721s extends Record<string, SERC721> {}

/**
 * @public
 * type for simulating and storing multiple ERC1155 tokens
 */
export interface SERC1155s extends Record<string, SERC1155> {}

/**
 * @public
 * type for simulating and storing orderbook Vaults data
 */
export interface SVaults extends Record<string, Record<string, SStore>> {}

/**
 * @public
 * token the address of the desired token
 * vaultId corresponding token vault id
 */
export type SIOConfig = { token: string; vaultId: string };

/**
 * @public
 * type for simulating and storing orderbook Order data
 */
export interface SOrder {
  orderHash: string,
  owner: string,
  validInputs: SIOConfig[];
  validOutputs: SIOConfig[];
  vmConfig: StateConfig
}

/** 
 * @public
 * type for simulating and storing multiple orderbook Orders
 */
export interface SOrders extends Record<string, SOrder> {}

/**
 * @public
 * type for bounty config
 */
export interface SClearConfig {
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
export interface SClearedFunds extends SStore {}

/**
 * @public
 * type for simulating and storing matched order counterparty cleared funds
 */
export interface SClearedCounterPartyFunds extends Record<string, SStore> {}

/**
 * @public
 * Interface for matchmaker forcasting a script
 */
 export interface ReserveBook extends Record<string, { minP: BigNumber, maxP: BigNumber }> {}