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
import { OrderBook__factory } from '../typechain';

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
 * A class for calling method on a OrderBook.
 *
 * @remarks
 * This class provides an easy way to interact with the OrderBook contract.
 *
 * @example
 * ```typescript
 * import { OrderBook } from 'rain-sdk'
 *
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
   *
   */
  constructor(address: string, signer: Signer) {
    super(address, signer);
    const _orderBook = OrderBook__factory.connect(address, signer);

    this.addOrder = _orderBook.addOrder;
    this.clear = _orderBook.clear;
    this.deposit = _orderBook.deposit;
    this.fnPtrs = _orderBook.fnPtrs;
    this.removeOrder = _orderBook.removeOrder;
    this.storageOpcodesRange = _orderBook.storageOpcodesRange;
    this.withdraw = _orderBook.withdraw;
  }

  /**
   * All the opcodes avaialbles in the OrderBook contract.
   *
   * @remarks
   * This expose all the standard opcodes along with the specific opcodes of the OrderBook.
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
   * identifier to get the address in this chain.
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

  public readonly connect = (signer: Signer): OrderBook => {
    return new OrderBook(this.address, signer);
  };

  public readonly addOrder: (
    orderConfig_: OrderConfig,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  public readonly clear: (
    a_: Order,
    b_: Order,
    bountyConfig_: BountyConfig,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  public readonly deposit: (
    config_: DepositConfig,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  public readonly fnPtrs: (overrides?: ReadTxOverrides) => Promise<string>;

  public readonly removeOrder: (
    order_: Order,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  public readonly storageOpcodesRange: (
    overrides?: ReadTxOverrides
  ) => Promise<StorageOpcodesRange>;

  public readonly withdraw: (
    config_: WithdrawConfig,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;
}

/**
 * @public
 */
export type OrderConfig = {
  inputToken: string;
  inputVaultId: BigNumberish;
  outputToken: string;
  outputVaultId: BigNumberish;
  tracking: BigNumberish;
  vmStateConfig: StateConfig;
};

/**
 * @public
 * Order
 */
export type Order = {
  owner: string;
  inputToken: string;
  inputVaultId: BigNumberish;
  outputToken: string;
  outputVaultId: BigNumberish;
  tracking: BigNumberish;
  vmState: BytesLike;
};

/**
 * @public
 */
export type BountyConfig = {
  aVaultId: BigNumberish;
  bVaultId: BigNumberish;
};

/**
 * @public
 */
export type DepositConfig = {
  token: string;
  vaultId: BigNumberish;
  amount: BigNumberish;
};

/**
 * @public
 */
export type WithdrawConfig = {
  token: string;
  vaultId: BigNumberish;
  amount: BigNumberish;
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
