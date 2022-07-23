import { StateConfig } from '../classes/vm';
import { CallOptions, RainJSVM } from './RainJSVM';
import { OrderbookContext, OrderbookStorage } from '../contracts/orderBook';


// @TODO - not complete, local opcodes functions need to be added

/**
 * @public - The javascript version of OrderbookVM which inherits RainJSVM with local Orderbook opcodes.
 * @see Orderbook.sol in contracts
 *
 */
export class OrderbookJSVM extends RainJSVM {

  /**
   * OrderbookJSVM valid storage range
   */
  protected readonly StorageRange = OrderbookStorage.length;

  /**
   * OrderbookJSVM valid context length
   */
  protected readonly ContextLength = OrderbookContext.length;

  /**
   * Constructor of OrderbookJSVM to create a instance of this class with Orderbook's local opcodes.
   * @see RainJSVM
   *
   * @param state - A regular StateConfig
   * @param options - (optional) additional arguments for instantiating this class
   * (a Signer, a Orderbook Contract and custom opcode functions)
   *
   */
  constructor(state: StateConfig, options: CallOptions) {

    super(
      state,
      {
        opMeta: options?.opMeta,
        signer: options?.signer,
        contract: options?.contract,
        applyOpFn: options?.applyOpFn,
        storageOpFn: options?.storageOpFn
      }
    );
  }

  // @TODO - write orderbook local opcodes

  // /**
  //  * 
  //  * @param chainId 
  //  */
  // public setChainId (chainId: number) {
  //   this.chainId = chainId;
  // }
  // protected _OPCODE_: ApplyOpFn = {

  //  [OrderBook.Opcodes.ORDER_FUNDS_CLEARED]: async (state: StateJS, operand: number, data?: any) => {

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
  //  },

  //  [OrderBook.Opcodes.COUNTERPARTY_FUNDS_CLEARED]: async (state: StateJS, operand: number, data?: any) => {},
  // };
  
}

