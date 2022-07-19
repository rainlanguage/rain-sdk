import { BigNumber } from 'ethers';
import { StateConfig } from '../classes/vm';


/**
 * @public
 * An interface/type of JSVM opcodes' function's body
 */
export interface OpFn { 
	
	(state: StateJSVM, operand: number, data?: any): void 
}


/**
 * @public
 * An interface for creating a key/value pair of opcodes functions to override.
 */
export interface FnPtrs extends Record<number, OpFn> {}
 
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
	 * The RainJS's stack.
	 */
	readonly stack: BigNumber[];

	/**
	 * Used only for zipmap opcode
	 */
	readonly argumentsStack: BigNumber[];

}

/**
 * @public
 * 18 decimals or i.e "DECIMALS" - used for fixed point match
 */ 
export const eighteenZeros = "1000000000000000000";

/**
 * @public
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
 * @public
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
 * @public
 * type for simulating and storing ERC721 contract data
 */
export interface erc721 {

	[id: string]: {
		ownerOf: string
	}

}

/**
 * @public
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
 * @public
 * type for simulating and storing multiple ERC20 tokens
 */
export interface erc20s {

	[address: string]: erc20

}

/**
 * @public
 * type for simulating and storing multiple ERC721 tokens
 */
export interface erc721s {

	[address: string]: erc721

}

/**
 * @public
 * type for simulating and storing multiple ERC1155 tokens
 */
export interface erc1155s {

	[address: string]: erc1155

}

/**
 * @public
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
 * @public
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
 * @public
 * type for simulating and storing multiple orderbook Orders
 */
export interface orders {

	[orderHash: string]: order 

}

/**
 * @public
 * type for bounty config
 */
export interface bountyConfig {

	aVaultId: string,
	bVaultId: string,

}

/**
 * @public
 * type for simulating and storing matched order cleared funds
 */
export interface clearedFunds {

	[orderHash: string]: BigNumber

}

/**
 * @public
 * type for simulating and storing matched order counterparty cleared funds
 */
export interface clearedCounterPartyFunds {

	[orderHash: string]: {
		[counterPartyAddress: string]: BigNumber
	}

}