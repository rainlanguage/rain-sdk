import { OrderbookJSVM } from "./../OrderbookJSVM";
import { OrderbookSimulation } from "./OrderbookSimulation";
import { parseUnits } from "../../utils";
import { sOrder, eighteenZeros, ReserveBook } from "./types";


/**
 * @public 
 * A class for finding matches among orders off-chain in a simulated environment
 */
export class MatchMaker extends OrderbookSimulation {

  /**
   * @public
   * The ReserveBook property of the matchmaker
   */
  public reservebook: ReserveBook = {};

  /**
   * @public
   * The type of stores all the found matches
   */
  public foundMatches: {orderA: string, orderB: string}[] = [];

  /**
   * @public
   * Method that inherits from the parent class addOrder and after perfroming that will execute orderEval method
   * 
   * @param order - the order to be added
   * 
   * @returns void
   */
  public async addOrder(order: sOrder): Promise<void> {

    super.addOrder(order);
    await this.orderEval(order)
  };

  // public async deposit(
  //   sender: string,
  //   tokenAddress: string,
  //   vaultId: string,
  //   units: number,
  //   tokenDecimals: number = 18
  // ): Promise<void> {
  //   let vaultBalanceFlag = this.vaults[sender][tokenAddress][vaultId].isZero() ? true : false;
  //   super.deposit(sender, tokenAddress, vaultId, units, tokenDecimals);
  //   for (let i = 0; i < Object.keys(this.orders).length; i++) {
  //     if (
  //       vaultBalanceFlag &&
  //       Object.values(this.orders)[i].owner === sender && 
  //       Object.values(this.orders)[i].outputToken === tokenAddress && 
  //       Object.values(this.orders)[i].outputVaultId === vaultId
  //     ) {
  //       await this.orderEval(this.orders[Object.keys(this.orders)[i]], this.timestamp, this.blockNumber)
  //     }
  //   }
  // }

  /**
   * @public
   * Method to evaluate and ReserveBook the order's script
   * 
   * @param order - the order to be evaluated
   * 
   * @returns void 
   */
  public async orderEval(order: sOrder, timestamp?: number, blockNumber?: number) {
    this.script = order.vmConfig;
    const jsvm = new OrderbookJSVM(this.script, {applyOpFn: this.OpFns});

    const result1 = await jsvm.run({
      context: [order.orderHash],
      timestamp, blockNumber
    });
    const p1 = result1[1];

    let _timestamp = timestamp ? timestamp + 3600 : 3600;
    let _blockNumber = blockNumber ? blockNumber + 1800 : 1800;

    const result2 = await jsvm.run({
      context: [order.orderHash],
      timestamp: _timestamp,
      blockNumber: _blockNumber
    })
    const p2 = result2[1];

    this.reservebook[order.orderHash] = {
      minP: p2.gt(p1) ? p1 : p2,
      maxP: p2.gt(p1) ? p2 : p1,
    }
  }

  /**
   * @public
   * The main method to perform matchmaking and find matches among orders
   * 
   * @param bounty - the Bounty Vault IDs
   */
  public async makeMatch(bounty: {aBounty: string, bBounty: string}) : Promise<{orderA: string, orderB: string}[]> {

    const orderHashes = Object.keys(this.orders);
    let result = [];

    if (orderHashes.length > 1) {
      for(let oh1 in orderHashes) {
        for (let i = 0; i < this.orders[orderHashes[oh1]].validOutputs.length; i++) {
          if (
              !this.vaults[this.orders[orderHashes[oh1]].owner][
                this.orders[orderHashes[oh1]].validOutputs[i].token
              ][this.orders[orderHashes[oh1]].validOutputs[i].vaultId].isZero()
            ) {
            for (let oh2 in orderHashes) {
              for (let j = 0; j < this.orders[orderHashes[oh2]].validInputs.length; j++) {
                if (this.orders[orderHashes[oh1]].validOutputs[i].token === this.orders[orderHashes[oh2]].validInputs[j].token) {
                  for (let k = 0; k < this.orders[orderHashes[oh1]].validInputs.length; k++) {
                    for (let l = 0; l < this.orders[orderHashes[oh2]].validOutputs.length; l++) {
                      if (this.orders[orderHashes[oh1]].validInputs[k].token === this.orders[orderHashes[oh2]].validOutputs[l].token) {
                        if (
                          (this.reservebook[orderHashes[oh1]].minP.mul(this.reservebook[orderHashes[oh2]].maxP)
                          .div(eighteenZeros)).lte(parseUnits((1).toString())) ||
                          (this.reservebook[orderHashes[oh1]].maxP.mul(this.reservebook[orderHashes[oh2]].minP)
                          .div(eighteenZeros)).lte(parseUnits((1).toString()))
                        ) {
                          await this.clear(
                            this.orders[orderHashes[oh1]],
                            this.orders[orderHashes[oh2]], 
                            {
                              aOutputIndex: i,
                              aInputIndex: k,
                              bOutputIndex: l,
                              bInputIndex: j,
                              aBountyVaultId: bounty.aBounty,
                              bBountyVaultId: bounty.bBounty,
                            }
                          )
                          result.push({orderA: orderHashes[oh1], orderB: orderHashes[oh2]})
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return result;
  }
  
}



