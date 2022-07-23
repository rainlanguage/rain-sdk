import { OrderBook__factory } from '../typechain';
import { Signer, BigNumberish, BytesLike, ContractTransaction } from 'ethers';
import {
  RainContract,
  ReadTxOverrides,
  TxOverrides,
} from '../classes/rainContract';
import {
  StateConfig,
  StorageOpcodesRange,
  AllStandardOps,
} from '../classes/vm';

/**
 * @public
 * Type for the opcodes availables in a OrderBook instance.
 */
export type OrderBookOpcodes = typeof AllStandardOps & {
  ORDER_FUNDS_CLEARED: number;
  COUNTERPARTY_FUNDS_CLEARED: number;
};

/**
 * @public
 * A class for calling method on a Rain OrderBook contract.
 *
 * @remarks
 * This class provides an easy way to interact with the OrderBook contract.
 *
 * @example
 * ```typescript
 * import { OrderBook } from 'rain-sdk'
 *
 * const orderBook = await Orderbook.get(signer);
 * or
 * const orderBook = new OrderBook(address, signer);
 *
 * const addOrderArg = {
 *   inputToken: token1Address;
 *   inputVaultId: vaultID_1;
 *   outputToken: token2Address;
 *   outputVaultId: vaultID_2;
 *   tracking: tracking;
 *   vmStateConfig: _stateConfig;
 * }
 *
 * const tx = await orderBook.addOrder(addOrderArg);
 * ```
 */
export class OrderBook extends RainContract {
  protected static readonly nameBookReference: string = 'orderBook';

  /**
   * Constructs a new OrderBook from a known address.
   *
   * @param address - The address of the OrderBook contract
   * @param signer - An ethers.js Signer
   * @returns A new OrderBook instance
   */
  constructor(address: string, signer: Signer) {
    OrderBook.checkAddress(address);

    super(address, signer);
    const _orderBook = OrderBook__factory.connect(address, signer);

    this.addOrder = _orderBook.addOrder;
    this.clear = _orderBook.clear;
    this.deposit = _orderBook.deposit;
    this.removeOrder = _orderBook.removeOrder;
    this.storageOpcodesRange = _orderBook.storageOpcodesRange;
    this.withdraw = _orderBook.withdraw;
  this.packedFunctionPointers = _orderBook.packedFunctionPointers;
  }

  /**
   * All the opcodes avaialbles in the OrderBook contract.
   *
   * @remarks
   * This expose all the standard opcodes along with the specific local OrderBook opcodes.
   */
  public static Opcodes: OrderBookOpcodes = {
    ...AllStandardOps,
    ORDER_FUNDS_CLEARED: 0 + AllStandardOps.length,
    COUNTERPARTY_FUNDS_CLEARED: 1 + AllStandardOps.length,
  };

  /**
   * Get the OrderBook instance
   *
   * The function ask to the provider inside of the ethers signer what is the chain
   * identifier to get the address of the Orderbook Contract in this chain and connect to it.
   *
   * @param signer - ethers signer connected to the instance
   * @returns A OrderBook instance
   */
  public static get = async (signer: Signer): Promise<OrderBook> => {
    return new OrderBook(
      this.getBookAddress(await this.getChainId(signer)),
      signer
    );
  };

  /**
   * Connect to this Orderbook instance with a new signer
   *
   * @param signer - The new signer which will be connected
   * @returns The Orderbook Contract instance with a new signer 
   */
  public readonly connect = (signer: Signer): OrderBook => {
    return new OrderBook(this.address, signer);
  };

  /**
   * @public
   * Adds an order config for signer (as the owner) into the Orderbook
   * 
   * @param orderConfig_ - @see OrderConfig The order with signer as owner to be added to this Orderbook contract 
   * @param overrides - @see TxOverrides
   */
  public readonly addOrder: (
    orderConfig_: OrderConfig,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * @public
   * Removes an order from the Orderbook completely.
   * 
   * @param order_ - @see Order The order to be removed from this Orderbook contract
   * @param overrides - @see TxOverrides
   */
  public readonly removeOrder: (
    order_: Order,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * @public
   * Allows the sender to deposit any tokens into their own vaults.
   * The deposit will be 'config_.amount' of the 'config_.token' into 'config_.vaultId'
   * 
   * @param config_ - @see DepositConfig All config required to deposit. Consists of 'amount', 'token' address and 'vaultId'
   * @param overrides - @see TxOverrides 
   */
  public readonly deposit: (
    config_: DepositConfig,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * @public
   * Allows the sender to withdraw any tokens from their own vaults. Notably if the amount is less than the current vault 
   * balance then the vault will be cleared to 0 rather than the withdraw transaction reverting.
   * The withdraw will be 'config_.amount' of the 'config_.token' from 'config_.vaultId'
   * 
   * @param config_ - @see WithdrawConfig All config required to withdraw. Consists of 'amount', 'token' address and 'vaultId'.
   * @param overrides - @see TxOverrides
   */
  public readonly withdraw: (
    config_: WithdrawConfig,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * @public
   * Clears 2 matching order against each other, a_ inputToken must match to b_ outputToken and 
   * a_ outputToken must match to b_ inputToken. Order a_ clears into Order b_ and vice versa.
   * The difference of the clearing amounts will go into the bounty's vaults and if any of them are negative
   * then the transaction will revert
   * 
   * @param a_ - @see Order The first order
   * @param b_ - @see Order The second order
   * @param clearConfig_ - @see ClearConfig The corresponding vault IDs of the bounty
   * @param overrides - @see TxOverrides
   * @returns
   */
  public readonly clear: (
    a_: Order,
    b_: Order,
    clearConfig_: ClearConfig,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Returns the pointer and length for sale's storage opcodes
   * 
   * @param overrides - @see ReadTxOverrides
   * @returns a StorageOpcodesRange
   */
  public readonly storageOpcodesRange: (
    overrides?: ReadTxOverrides
  ) => Promise<StorageOpcodesRange>;

   /**
   * Pointers to opcode functions, necessary for being able to read the packedBytes
   * 
   * @param overrides - @see ReadTxOverrides
   * @returns the opcode functions pointers
   */
   public readonly packedFunctionPointers: (overrides?: ReadTxOverrides) => Promise<string>;
}

/**
 * @public
 * token the address of the desired token
 * vaultId corresponding token vault id
 */
export type IOConfig = { token: string; vaultId: BigNumberish };

/**
 * @public
 * A type for an order configuration without any specific owner
 */
export type OrderConfig = {
  validInputs: IOConfig[];
  validOutputs: IOConfig[];
  tracking: BigNumberish;
  vmStateConfig: StateConfig;
};

/**
 * @public
 * Type for an order containing all that is required in an order.
 * An Order is an @see OrderConfig with an owner
 */
export type Order = {
  owner: string;
  validInputs: IOConfig[];
  validOutputs: IOConfig[];
  tracking: BigNumberish;
  vmState: BytesLike;
};

/**
 * @public
 * Type for depositing some token amount into a vault used in @see deposit
 * 
 * 'token' which is the token address to be deposited
 * 'vaultId' of the signer that token is being deposited
 * 'amount' of token to be deposited into the vault
 */
export type DepositConfig = {
  token: string;
  vaultId: BigNumberish;
  amount: BigNumberish;
};

/**
 * @public
 * Type for withdrawing some token amount from a vault used in @see withdraw
 * 
 * 'token' which is the token address to be withdrawn
 * 'vaultId' of the signer that token is being withdrawn
 * 'amount' of token to be withdrawn from the vault
 */
export type WithdrawConfig = {
  token: string;
  vaultId: BigNumberish;
  amount: BigNumberish;
};

/**
 * @public
 * Type for clear vaultIds used when in @see clear when clearing 2 orders that will collect the bounties into its vaults
 */
 export type ClearConfig = {
  aInputIndex: BigNumberish;
  aOutputIndex: BigNumberish;
  bInputIndex: BigNumberish;
  bOutputIndex: BigNumberish;
  aBountyVaultId: BigNumberish;
  bBountyVaultId: BigNumberish;
};

/**
 * @public
 * Type for changes in state of an orderbook vaults after an successful clear
 */
export type ClearStateChange = {
  aOutput: BigNumberish;
  bOutput: BigNumberish;
  aInput: BigNumberish;
  bInput: BigNumberish;
};

/**
 * @public
 * Enum for operand of the Orderbook's CONTEXT opcode
 */
export enum OrderbookContext {
  /**
   * 0 or the index of the context array for Orderbook CONTEXT opcode
   * stacks the Orderhash
   */
  OrderHash,
  /**
   * 1 or the index of the context array in the Oderbook CONTEXT opcode
   * stacks the counterparty address
   */
  CounterParty,
  /**
   * length of Orderbook's valid context opcodes
   */
  length,
}

/**
 * @public
 * Enum for operand of the Orderbook's STORAGE opcode
 */
export enum OrderbookStorage {
  /**
   * length of Orederbook's valid storage opcodes
   */
  length,
}