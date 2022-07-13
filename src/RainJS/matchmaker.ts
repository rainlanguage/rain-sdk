import { BigNumber } from "ethers";
import { OrderbookJS } from "./OrderbookJS";
import { VM } from "../classes/vm";
import { OrderbookSimulation } from "./vmSimulation";
import { FixedPrice, IncDecPrice } from "../contracts/script-generators/saleScriptGenerator";
import { parseUnits } from "../utils";
import { 
  order,
  erc20s,
  eighteenZeros,
  bountyConfig
} from "./types";


/**
 * Interface for matchmaker forcasting a script
 */
export interface forcast {
  [orderHash: string]: {
    minP: BigNumber,
    maxP: BigNumber,
    minOut: BigNumber,
    maxOut: BigNumber,
    minIn:BigNumber,
    maxIn: BigNumber
  }
}

/**
 * @public 
 * A class for finding matches among orders off-chain in a simulated environment
 */
export class MatchMaker extends OrderbookSimulation {

  /**
   * The forcast property of the matchmaker
   */
  public orderForcast: forcast = {};

  /**
   * The type of stores all the found matches
   */
  public foundMatches: {orderA: string, orderB: string}[] = [];

  /**
   * Method that inherits from the parent class addOrder and after perfroming that will execute orderEval method
   * 
   * @param order - the order to be added
   * 
   * @return void
   */
  public async addOrder(order: order): Promise<void> {
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
  //   let vaultBalanceFlag = this.vaults[sender][tokenAddress].vaultId[vaultId].isZero() ? true : false;
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
   * Method to evaluate and forcast the order's script
   * 
   * @param order - the order to be evaluated
   * 
   * @returns void 
   */
  public async orderEval(order: order, timestamp?: number, blockNumber?: number) {
    this.script = order.vmConfig;
    const jsvm = new OrderbookJS(this.script, {applyOpFn: this.OpFns});
    const result1 = await jsvm.run({context: [order.orderHash], timestamp, blockNumber});

    const out1 = result1[0];
    const p1 = result1[1];
    const in1 = out1.mul(p1).div(eighteenZeros);

    let _timestamp = timestamp ? timestamp + 3600 : 3600;
    let _blockNumber = blockNumber ? blockNumber + 1800 : 1800;

    const result2 = await jsvm.run({context: [order.orderHash], timestamp: _timestamp, blockNumber: _blockNumber})

    const out2 = result2[0];
    const p2 = result2[1];
    const in2 = out2.mul(p2).div(eighteenZeros);

    this.orderForcast[order.orderHash] = {
      minP: p2.gt(p1) ? p1 : p2,
      maxP: p2.gt(p1) ? p2 : p1,
      minOut: out2.gt(out1) ? out1 : out2,
      maxOut: out2.gt(out1) ? out2 : out1,
      minIn: in2.gt(in1) ? in1 : in2,
      maxIn: in2.gt(in1) ? in2 : in1,
    }
  }

  /**
   * The main method to perform matchmaking and find matches among orders
   * 
   * @param bountyConfig - the BountyConfig of this matchmaker class
   * 
   * @returns 
   */
  public async makeMatch(bountyConfig: bountyConfig) : Promise<{orderA: string, orderB: string}[]> {

    const orderHashs = Object.keys(this.orders);
    let result = [];

    if (orderHashs.length > 1) {
      for(let i = 0; i <orderHashs.length; i++) {
        if (
            !this.vaults[this.orders[orderHashs[i]].owner][this.orders[orderHashs[i]].outputToken]
            .vaultId[this.orders[orderHashs[i]].outputVaultId].isZero()
          ) {
          for (let j = 0; j < orderHashs.length; j++) {
            if (
              this.orders[orderHashs[i]].outputToken === this.orders[orderHashs[j]].inputToken && 
              this.orders[orderHashs[i]].inputToken === this.orders[orderHashs[j]].outputToken
            ) {
              if (
                (this.orderForcast[orderHashs[i]].minP.mul(this.orderForcast[orderHashs[j]].maxP)
                .div(eighteenZeros)).lte(parseUnits((1).toString())) ||
                (this.orderForcast[orderHashs[i]].maxP.mul(this.orderForcast[orderHashs[j]].minP)
                .div(eighteenZeros)).lte(parseUnits((1).toString()))
              ) {
                await this.clear(
                  this.orders[orderHashs[i]],
                  this.orders[orderHashs[j]], 
                  bountyConfig
                )
                result.push({orderA: orderHashs[i], orderB: orderHashs[j]})
              }
            }
          }
        }
      }
    }
    return result;
  }
}



////////// ---------------------| Demo |------------------------ *** Demo *** -----------------------| Demo |---------------------- \\\\\\\\\\
//run the demo locally to see the results of a orderbook matchmaking simulation

// a function for benchmarking
var timer = function(name: string) {
  var start = new Date();
  return {
    stop: function() {
      var end  = new Date();
      var time = end.getTime() - start.getTime();
      return {name, time}
    }
  }
};

//simulating some addresses
let sender1 = "0x11111";
let sender2 = "0x22222";
let sender3 = "0x33333";
let sender4 = "0x44444";
let sender6 = "0x66666";
let orderbook = "0x55555";

//simulating some erc20 tokens
let tokens: erc20s = {
  "0x1": {
    totalSupply: parseUnits((1000).toString()),
    decimals: 18,
    balanceOf: {
      [sender1]: parseUnits((500).toString()),
      [sender2]: parseUnits((100).toString()),
      [sender3]: parseUnits((200).toString()),
      [sender4]: parseUnits((100).toString()),
      [orderbook]: parseUnits((0).toString()),
    }
  },
  "0x2": {
    totalSupply: parseUnits((2000).toString()),
    decimals: 18,
    balanceOf: {
      [sender1]: parseUnits((200).toString()),
      [sender2]: parseUnits((150).toString()),
      [sender3]: parseUnits((350).toString()),
      [sender4]: parseUnits((220).toString()),
      [orderbook]: parseUnits((0).toString()),
    }
  },
  "0x3": {
    totalSupply: parseUnits((500).toString()),
    decimals: 18,
    balanceOf: {
      [sender1]: parseUnits((20).toString()),
      [sender2]: parseUnits((100).toString()),
      [sender3]: parseUnits((50).toString()),
      [sender4]: parseUnits((130).toString()),
      [orderbook]: parseUnits((0).toString()),
    }
  },
}

// some scripts for orders
const scriptA = VM.pair(new FixedPrice(4), new FixedPrice(2));
const scriptB = VM.pair(new FixedPrice(10), new FixedPrice(0.4));
const scriptC = VM.pair(new FixedPrice(2), new IncDecPrice(0.1, 8, 1, 900));

// simulating some orders usinf the data above
const order1 : order = {
  orderHash: "0x1abc",
  owner: sender1,
  inputToken: "0x1",
  outputToken: "0x2",
  inputVaultId: "0x101",
  outputVaultId: "0x201",
  vmConfig: scriptA
};
const order2 : order = {
  orderHash: "0x2abc",
  owner: sender2,
  inputToken: "0x2",
  outputToken: "0x3",
  inputVaultId: "0x202",
  outputVaultId: "0x302",
  vmConfig: scriptC
};
const order3 : order = {
  orderHash: "0x3abc",
  owner: sender3,
  inputToken: "0x2",
  outputToken: "0x1",
  inputVaultId: "0x203",
  outputVaultId: "0x103",
  vmConfig: scriptB
};
const order4 : order = {
  orderHash: "0x4abc",
  owner: sender4,
  inputToken: "0x3",
  outputToken: "0x2",
  inputVaultId: "0x304",
  outputVaultId: "0x204",
  vmConfig: scriptB
};

// bounty config for performing the matchmaking
const bountyConfig1: bountyConfig = {
  aVaultId: "0x88",
  bVaultId: "0x99"
}

// simulating an orderbook cycle
async function bot() {
  try{
    const matchmaker = new MatchMaker(orderbook, sender6);
    matchmaker.timestamp = () => 1;

    matchmaker.addAssets(tokens);
    matchmaker.setSender(sender6);

    console.log("checking sender1 balance of token 0x2:")
    console.log("sender1 token0x2 balance before adding order and depositing:  " + matchmaker.erc20s["0x2"].balanceOf[sender1].div(eighteenZeros).toNumber());

    console.log("---------------------------------------")
    console.log("adding orders")
    await matchmaker.addOrder(order1);
    await matchmaker.addOrder(order3);
    await matchmaker.addOrder(order2);
    await matchmaker.addOrder(order4);

    console.log("---------------------------------------")
    console.log("checking output valut balances of sener1 and sender3")
    console.log("sender1 outputValt balance before depositing:  " + matchmaker.vaults[sender1]["0x2"].vaultId["0x201"].div("100000000000000").toNumber()/10000)
    console.log("sender3 outputValt balance before depositing:  " + matchmaker.vaults[sender3]["0x1"].vaultId["0x103"].div("100000000000000").toNumber()/10000)
    console.log("sender2 outputValt balance before depositing:  " + matchmaker.vaults[sender2]["0x3"].vaultId["0x302"].div("100000000000000").toNumber()/10000)
    console.log("sender4 outputValt balance before depositing:  " + matchmaker.vaults[sender4]["0x2"].vaultId["0x204"].div("100000000000000").toNumber()/10000)
    
    console.log("---------------------------------------")
    console.log("depositing 30 tokens for order1 and 40 tokens for order3")
    matchmaker.deposit(sender1, "0x2", "0x201", 30);
    matchmaker.deposit(sender3, "0x1", "0x103", 40);
    matchmaker.deposit(sender2, "0x3", "0x302", 70);
    matchmaker.deposit(sender4, "0x2", "0x204", 60);

    console.log("---------------------------------------")
    console.log("checking the balances of sender1 and sender3 output vaults")

    console.log("sender1 outputValt balance after depositing:  " + matchmaker.vaults[sender1]["0x2"].vaultId["0x201"].div("100000000000000").toNumber()/10000)
    console.log("sender3 outputValt balance after depositing:  " + matchmaker.vaults[sender3]["0x1"].vaultId["0x103"].div("100000000000000").toNumber()/10000)
    console.log("sender2 outputValt balance after depositing:  " + matchmaker.vaults[sender2]["0x3"].vaultId["0x302"].div("100000000000000").toNumber()/10000)
    console.log("sender4 outputValt balance after depositing:  " + matchmaker.vaults[sender4]["0x2"].vaultId["0x204"].div("100000000000000").toNumber()/10000)

    console.log("---------------------------------------")
    console.log("checking sender1 balance of token 0x2")
    console.log("sender1 token0x2 balance after dpositing:   " + matchmaker.erc20s["0x2"].balanceOf[sender1].div(eighteenZeros).toNumber())

    console.log("---------------------------------------")
    console.log("performing the match")

    var t = timer("benchmark")
    await matchmaker.makeMatch(bountyConfig1);
    let result = t.stop()

    console.log("---------------------------------------")
    console.log("checking output balances of sender1's and sender3's output vaults")
    console.log("sender1 outputValt balance after matching:  " + matchmaker.vaults[sender1]["0x2"].vaultId["0x201"].div("100000000000000").toNumber()/10000)
    console.log("sender3 outputValt balance after matching:  " + matchmaker.vaults[sender3]["0x1"].vaultId["0x103"].div("100000000000000").toNumber()/10000)
    console.log("sender2 outputValt balance after matching:  " + matchmaker.vaults[sender2]["0x3"].vaultId["0x302"].div("100000000000000").toNumber()/10000)
    console.log("sender4 outputValt balance after matching:  " + matchmaker.vaults[sender4]["0x2"].vaultId["0x204"].div("100000000000000").toNumber()/10000)

    console.log("---------------------------------------")
    console.log("checking input balances of sender1's and sender3's output vaults")
    console.log("sender1 inputValt balance after matching:  " + matchmaker.vaults[sender1]["0x1"].vaultId["0x101"].div("100000000000000").toNumber()/10000)
    console.log("sender3 inputValt balance after matching:  " + matchmaker.vaults[sender3]["0x2"].vaultId["0x203"].div("100000000000000").toNumber()/10000)
    console.log("sender2 inputValt balance after matching:  " + matchmaker.vaults[sender2]["0x2"].vaultId["0x202"].div("100000000000000").toNumber()/10000)
    console.log("sender4 inputValt balance after matching:  " + matchmaker.vaults[sender4]["0x3"].vaultId["0x304"].div("100000000000000").toNumber()/10000)

    console.log("---------------------------------------")
    console.log("checking total bounty balance")
    console.log("total bounties collected of token0x2:  " + Object.values(matchmaker.vaults[sender6]["0x2"].vaultId).reduce((e, m) => e.add(m))
    .div("100000000000000").toNumber()/10000)
    console.log("total bounties collected of token0x1:  " + Object.values(matchmaker.vaults[sender6]["0x1"].vaultId).reduce((e, m) => e.add(m))
    .div("100000000000000").toNumber()/10000)
    console.log("total bounties collected of token0x3:  " + Object.values(matchmaker.vaults[sender6]["0x3"].vaultId).reduce((e, m) => e.add(m))
    .div("100000000000000").toNumber()/10000)
    // console.log("bounty aOutput of token0x2 Vault0x88 balance:  " + matchmaker.vaults[sender6]["0x2"].vaultId["0x88"].div("10000000000000000").toNumber()/100)
    // console.log("bounty bOutput of token0x1 Vault0x99 balance:  " + matchmaker.vaults[sender6]["0x1"].vaultId["0x99"].div("10000000000000000").toNumber()/100)
    // console.log("bounty aOutput of token0x1 Vault0x88 balance:  " + matchmaker.vaults[sender6]["0x1"].vaultId["0x88"].div("10000000000000000").toNumber()/100)
    // console.log("bounty bOutput of token0x2 Vault0x99 balance:  " + matchmaker.vaults[sender6]["0x2"].vaultId["0x99"].div("10000000000000000").toNumber()/100)

    // second matchmaking round
    // increasing the timestamp for second matchmaking
    // matchmaker.timestamp = 1700

    // let result2 = await matchmaker.makeMatch();
    // console.log(result2);

    console.log("---------------------------------------")
    console.log(result.name + " of this matchmaking round: " + result.time + " ms")
  }
  catch(err){
    console.log(err)
  }
}
bot()