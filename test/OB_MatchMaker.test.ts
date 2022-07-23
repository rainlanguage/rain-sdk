import { paddedUInt160, paddedUInt256, parseUnits } from "../src/utils";
import { FixedPrice, IncDecPrice, SERC20s, SOrder, VM, MatchMaker, eighteenZeros } from "../src";


////////// ---------------------| Demo |------------------------ *** Demo *** -----------------------| Demo |---------------------- \\\\\\\\\\
describe('Orderbook MatchMaker', () => {
  it('should perform simple simulation match making over provided simulated orders', async () => {

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
    let sender1 = paddedUInt160("0x11111");
    let sender2 = paddedUInt160("0x22222");
    let sender3 = paddedUInt160("0x33333");
    let sender4 = paddedUInt160("0x44444");
    let sender6 = paddedUInt160("0x66666");
    let orderbook = paddedUInt160("0x55555");

    // simulating some tokens addresses
    const token1 = paddedUInt160("0x1")
    const token2 = paddedUInt160("0x2")
    const token3 = paddedUInt160("0x3")

    //simulating some erc20 tokens
    let tokens: SERC20s = {
      [token1]: {
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
      [token2]: {
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
      [token3]: {
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
    const orderHash1 = paddedUInt256("0x1abc")
    const vaultId101 = paddedUInt256("0x0101")
    const vaultId201 = paddedUInt256("0x0201")

    const orderHash2 = paddedUInt256("0x2abc")
    const vaultId202 = paddedUInt256("0x0202")
    const vaultId302 = paddedUInt256("0x0302")

    const orderHash3 = paddedUInt256("0x3abc")
    const vaultId203 = paddedUInt256("0x0203")
    const vaultId103 = paddedUInt256("0x0103")

    const orderHash4 = paddedUInt256("0x4abc")
    const vaultId304 = paddedUInt256("0x0304")
    const vaultId204 = paddedUInt256("0x0204")

    const order1 : SOrder = {
      orderHash: orderHash1,
      owner: sender1,
      validInputs: [{ token: token1, vaultId: vaultId101 }],
      validOutputs: [{ token: token2, vaultId: vaultId201 }],
      vmConfig: scriptA
    };
    const order2 : SOrder = {
      orderHash: orderHash2,
      owner: sender2,
      validInputs: [{ token: token2, vaultId: vaultId202 }],
      validOutputs: [{ token: token3, vaultId: vaultId302 }],
      vmConfig: scriptC
    };
    const order3 : SOrder = {
      orderHash: orderHash3,
      owner: sender3,
      validInputs: [{ token: token2, vaultId: vaultId203 }],
      validOutputs: [{ token: token1, vaultId: vaultId103 }],
      vmConfig: scriptB
    };
    const order4 : SOrder = {
      orderHash: orderHash4,
      owner: sender4,
      validInputs: [{ token: token3, vaultId: vaultId304 }],
      validOutputs: [{ token: token2, vaultId: vaultId204 }],
      vmConfig: scriptB
    };

    // bounty vaults for performing the matchmaking
    const bounty = {
      aBounty: paddedUInt256("0x88"),
      bBounty: paddedUInt256("0x99")
    }

    // simulating an orderbook cycle
    // async function bot() {
    //   try{
    const matchmaker = new MatchMaker(orderbook, sender6);
    matchmaker.timestamp = 1;

    matchmaker.addAssets(tokens);
    matchmaker.setSender(sender6);

    console.log("checking sender1 balance of token 0x2")
    console.log("sender1 token0x2 balance before adding order and depositing:  " + matchmaker.erc20s[token2].balanceOf[sender1].div(eighteenZeros).toNumber());

    console.log("---------------------------------------")
    console.log("adding orders")
    await matchmaker.addOrder(order1);
    await matchmaker.addOrder(order3);
    await matchmaker.addOrder(order2);
    await matchmaker.addOrder(order4);

    console.log("---------------------------------------")
    console.log("checking output valut balances of sener1 and sender3")
    console.log("sender1 outputValt balance before depositing:  " + matchmaker.vaults[sender1][token2][vaultId201].div("100000000000000").toNumber()/10000)
    console.log("sender3 outputValt balance before depositing:  " + matchmaker.vaults[sender3][token1][vaultId103].div("100000000000000").toNumber()/10000)
    console.log("sender2 outputValt balance before depositing:  " + matchmaker.vaults[sender2][token3][vaultId302].div("100000000000000").toNumber()/10000)
    console.log("sender4 outputValt balance before depositing:  " + matchmaker.vaults[sender4][token2][vaultId204].div("100000000000000").toNumber()/10000)
    
    console.log("---------------------------------------")
    console.log("depositing 30 tokens for order1 and 40 tokens for order3")
    matchmaker.deposit(sender1, token2, vaultId201, 30);
    matchmaker.deposit(sender3, token1, vaultId103, 40);
    matchmaker.deposit(sender2, token3, vaultId302, 70);
    matchmaker.deposit(sender4, token2, vaultId204, 60);

    console.log("---------------------------------------")
    console.log("checking the balances of sender1 and sender3 output vaults")

    console.log("sender1 outputValt balance after depositing:  " + matchmaker.vaults[sender1][token2][vaultId201].div("100000000000000").toNumber()/10000)
    console.log("sender3 outputValt balance after depositing:  " + matchmaker.vaults[sender3][token1][vaultId103].div("100000000000000").toNumber()/10000)
    console.log("sender2 outputValt balance after depositing:  " + matchmaker.vaults[sender2][token3][vaultId302].div("100000000000000").toNumber()/10000)
    console.log("sender4 outputValt balance after depositing:  " + matchmaker.vaults[sender4][token2][vaultId204].div("100000000000000").toNumber()/10000)

    console.log("---------------------------------------")
    console.log("checking sender1 balance of token 0x2")
    console.log("sender1 token0x2 balance after dpositing:   " + matchmaker.erc20s[token2].balanceOf[sender1].div(eighteenZeros).toNumber())

    console.log("---------------------------------------")
    console.log("performing the match")

    var t = timer("benchmark")
    await matchmaker.makeMatch(bounty);
    let result = t.stop()

    console.log("---------------------------------------")
    console.log("checking output balances of sender1's and sender3's output vaults")
    console.log("sender1 outputValt balance after matching:  " + matchmaker.vaults[sender1][token2][vaultId201].div("100000000000000").toNumber()/10000)
    console.log("sender3 outputValt balance after matching:  " + matchmaker.vaults[sender3][token1][vaultId103].div("100000000000000").toNumber()/10000)
    console.log("sender2 outputValt balance after matching:  " + matchmaker.vaults[sender2][token3][vaultId302].div("100000000000000").toNumber()/10000)
    console.log("sender4 outputValt balance after matching:  " + matchmaker.vaults[sender4][token2][vaultId204].div("100000000000000").toNumber()/10000)

    console.log("---------------------------------------")
    console.log("checking input balances of sender1's and sender3's output vaults")
    console.log("sender1 inputValt balance after matching:  " + matchmaker.vaults[sender1][token1][vaultId101].div("100000000000000").toNumber()/10000)
    console.log("sender3 inputValt balance after matching:  " + matchmaker.vaults[sender3][token2][vaultId203].div("100000000000000").toNumber()/10000)
    console.log("sender2 inputValt balance after matching:  " + matchmaker.vaults[sender2][token2][vaultId202].div("100000000000000").toNumber()/10000)
    console.log("sender4 inputValt balance after matching:  " + matchmaker.vaults[sender4][token3][vaultId304].div("100000000000000").toNumber()/10000)

    console.log("---------------------------------------")
    console.log("checking total bounty balance")
    console.log("total bounties collected of token0x2:  " + Object.values(matchmaker.vaults[sender6][token2]).reduce((e, m) => e.add(m))
    .div("100000000000000").toNumber()/10000)
    console.log("total bounties collected of token0x1:  " + Object.values(matchmaker.vaults[sender6][token1]).reduce((e, m) => e.add(m))
    .div("100000000000000").toNumber()/10000)
    console.log("total bounties collected of token0x3:  " + Object.values(matchmaker.vaults[sender6][token3]).reduce((e, m) => e.add(m))
    .div("100000000000000").toNumber()/10000)

    console.log("---------------------------------------")
    console.log(result.name + " of this matchmaking round: " + result.time + " ms")
    
    //   }
    //   catch(err){
    //     console.log(err)
    //   }
    // }

  });
})