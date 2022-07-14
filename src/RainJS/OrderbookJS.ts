import { Signer } from 'ethers';
import { StateConfig } from '../classes/vm';
import { ApplyOpFn, RainJS, StateJS } from './RainJS';
import { OrderBook, OrderbookContext, OrderbookStorage } from '../contracts/orderBook';


// @TODO - not complete, local opcodes functions need to be added
/**
 * @public - The javascript version of OrderbookVM which inherits RainJS with local Orderbook opcodes.
 * @see Orderbook.sol in contracts
 *
 */
export class OrderbookJS extends RainJS {

  /**
   * OrderbookJS valid storage range
   */
  protected readonly StorageRange = OrderbookStorage.length;

  /**
   * OrderbookJS valid context length
   */
  protected readonly ContextLength = OrderbookContext.length;

  // /**
  //  * 
  //  */
  // public chainId?: number;

  /**
   * Constructor of OrderbookJS to create a instance of this class with Orderbook's local opcodes.
   * @see RainJS
   *
   * @param state - A regular StateConfig
   * @param options - (optional) additional arguments for instantiating this class
   * (a Signer, a Orderbook Contract and custom opcode functions)
   *
   */
  constructor(
    state: StateConfig,
    options?: {
      signer?: Signer;
      contract?: string;
      applyOpFn?: ApplyOpFn;
      storageOpFn?: ApplyOpFn; // for overriding the OrderbookJS's STORAGE opcode function
      chainId?: number
    }
  ) {
    super(
      state,
      {
        signer: options?.signer,
        contract: options?.contract,
        applyOpFn: options?.applyOpFn,
      }
    );

    // assigning custom functions to the STORAGE/CONTEXT functions
    // custom functions should be passed at the time construction
    if (options?.storageOpFn !== undefined) {
      this._STORAGE_ = options.storageOpFn;
    }
    // if (options && options.chainId !== undefined) {
    //   this.chainId = options.chainId;
    // }
  }

  // /**
  //  * 
  //  * @param chainId 
  //  */
  // public setChainId (chainId: number) {
  //   this.chainId = chainId;
  // }

  protected _OPCODE_: ApplyOpFn = {

    ...this._OPCODE_,

    [OrderBook.Opcodes.ORDER_FUNDS_CLEARED]: async (

      state: StateJS,
      operand: number,
      data?: any
    ) => {
      // if (this.chainId && data.chainId !== undefined) {
      //   const chainId = this.chainId !== undefined ? this.chainId : data.chainId;
      //   const EndPoint = AddressBook.getSubgraphEndpoint(chainId);
      //   let subgraphData = await fetch(EndPoint, {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //       query: `
      //         query {
      //           redeemableEscrowDeposits(where: 
      //             {iSaleAddress:"${SALE_ADDRESS}"}
      //           ) {
      //             id

      //           }
      //         }
      //       `
      //     })
      //   });
      //   subgraphData = await subgraphData.json();
      //   subgraphData = subgraphData.data.redeemableEscrowDeposits[0];

      //   state.stack.push(BigNumber.from(subgraphData))
      // }
      // else throw new Error("undefined chainID")
    },

    [OrderBook.Opcodes.COUNTERPARTY_FUNDS_CLEARED]: async (
      state: StateJS,
      operand: number,
      data?: any
    ) => {

    },
  };

  /**
   * key/value pair of STORAGE opcodes of the Orderbook JSVM (empty with no functions)
   * @remarks Orderbook doesnt have any STORAGE opcode by default and in its contract level,
   * however in JSVM there is the ability to pass in custom opcode functions to it
   */
  protected _STORAGE_: ApplyOpFn = {};
  
}
