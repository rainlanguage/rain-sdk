import { assert } from 'chai';
import { ethers } from 'hardhat';
import { concat, op } from '../src/utils';
import { OrderBook__factory, ReserveTokenTest } from '../typechain';
import { 
  OrderBook,
  OrderConfig,
  ClearConfig,
  DepositConfig,
  WithdrawConfig,
  ClearStateChange 
} from '../src';
import { 
  ClearEvent,
  DepositEvent,
  WithdrawEvent,
  AfterClearEvent,
  OrderDeadEvent,
  OrderLiveEvent
} from '../typechain/OrderBook';
import { 
  ONE, 
  deployErc20,
  eighteenZeros,
  max_uint256,
  getEventArgs,
  compareStructs,
  fixedPointDiv,
  minBN,
  fixedPointMul,
  compareSolStructs
} from './utils';


const orderbookInterface = OrderBook__factory.createInterface();

describe('SDK - OrderBook', async function () {
  let tokenA: ReserveTokenTest,
    tokenB: ReserveTokenTest;

  beforeEach(async () => {
    tokenA = await deployErc20() as ReserveTokenTest;
    tokenB = await deployErc20() as ReserveTokenTest;
  });

  it("should add orders", async function () {
    const signers = await ethers.getSigners();

    const sender = signers[0]
    const alice = signers[1];
    const bob = signers[2];

    const orderBook = await OrderBook.get(sender);

    const aliceInputVault = ethers.BigNumber.from(1);
    const aliceOutputVault = ethers.BigNumber.from(2);
    const bobInputVault = ethers.BigNumber.from(1);
    const bobOutputVault = ethers.BigNumber.from(2);

    // ASK ORDER

    const askPrice = ethers.BigNumber.from("90" + eighteenZeros);
    const askConstants = [max_uint256, askPrice];
    const vAskOutputMax = op(OrderBook.Opcodes.CONSTANT, 0);
    const vAskPrice = op(OrderBook.Opcodes.CONSTANT, 1);
    // prettier-ignore
    const askSource = concat([
      vAskOutputMax,
      vAskPrice,
    ]);


    const askOrderConfig: OrderConfig = {
      validInputs: [{
        token: tokenA.address,
        vaultId: aliceInputVault
      }],
      validOutputs: [{
        token: tokenB.address,
        vaultId: aliceOutputVault,
      }],
      tracking: "0x00",
      vmStateConfig: {
        sources: [askSource],
        constants: askConstants,
      },
    };

    const txAskOrderLive = await (orderBook.connect(alice)).addOrder(askOrderConfig);

    const { sender: askSender, config: askConfig } = await getEventArgs(
      txAskOrderLive,
      "OrderLive",
      orderBook.address,
      orderbookInterface
    )as OrderLiveEvent["args"];

    assert(askSender === alice.address, "wrong sender");
    compareStructs(askConfig, askOrderConfig);

    // BID ORDER

    const bidPrice = fixedPointDiv(ONE, askPrice);
    const bidConstants = [max_uint256, bidPrice];
    const vBidOutputMax = op(OrderBook.Opcodes.CONSTANT, 0);
    const vBidPrice = op(OrderBook.Opcodes.CONSTANT, 1);
    // prettier-ignore
    const bidSource = concat([
      vBidOutputMax,
      vBidPrice,
    ]);
    const bidOrderConfig: OrderConfig = {
      validInputs: [{
        token: tokenB.address,
        vaultId: bobInputVault,
      }],
      validOutputs: [{
        token: tokenA.address,
        vaultId: bobOutputVault,
      }],
      tracking: "0x00",
      vmStateConfig: {
        sources: [bidSource],
        constants: bidConstants,
      },
    };

    const txBidOrderLive = await orderBook
      .connect(bob)
      .addOrder(bidOrderConfig);

    const { sender: bidSender, config: bidConfig } = (await getEventArgs(
      txBidOrderLive,
      "OrderLive",
      orderBook.address,
      orderbookInterface
    )) as OrderLiveEvent["args"];

    assert(bidSender === bob.address, "wrong sender");
    compareStructs(bidConfig, bidOrderConfig);
  });

  it("should allow deposits", async function () {
    const signers = await ethers.getSigners();

    const sender = signers[0];
    const alice = signers[1];
    const bob = signers[2];

    const orderBook = await OrderBook.get(sender);

    const aliceOutputVault = ethers.BigNumber.from(2);
    const bobOutputVault = ethers.BigNumber.from(2);

    const amountB = ethers.BigNumber.from("1000" + eighteenZeros);
    const amountA = ethers.BigNumber.from("1000" + eighteenZeros);

    await tokenB.transfer(alice.address, amountB);
    await tokenA.transfer(bob.address, amountA);

    const depositConfigStructAlice: DepositConfig = {
      token: tokenB.address,
      vaultId: aliceOutputVault,
      amount: amountB,
    };
    const depositConfigStructBob: DepositConfig = {
      token: tokenA.address,
      vaultId: bobOutputVault,
      amount: amountA,
    };

    await tokenB
      .connect(alice)
      .approve(orderBook.address, depositConfigStructAlice.amount);
    await tokenA
      .connect(bob)
      .approve(orderBook.address, depositConfigStructBob.amount);

    // Alice deposits tokenB into her output vault
    const txDepositOrderAlice = await orderBook
      .connect(alice)
      .deposit(depositConfigStructAlice);
    // Bob deposits tokenA into his output vault
    const txDepositOrderBob = await orderBook
      .connect(bob)
      .deposit(depositConfigStructBob);

    const { sender: depositAliceSender, config: depositAliceConfig } =
      (await getEventArgs(
        txDepositOrderAlice,
        "Deposit",
        orderBook.address,
        orderbookInterface
      )) as DepositEvent["args"];
    const { sender: depositBobSender, config: depositBobConfig } =
      (await getEventArgs(
        txDepositOrderBob,
        "Deposit",
        orderBook.address,
        orderbookInterface
      )) as DepositEvent["args"];

    assert(depositAliceSender === alice.address);
    compareStructs(depositAliceConfig, depositConfigStructAlice);
    assert(depositBobSender === bob.address);
    compareStructs(depositBobConfig, depositConfigStructBob);
    
  });

  it("should support removing orders", async function () {
    const signers = await ethers.getSigners();

    const sender = signers[0];
    const alice = signers[1];

    const orderBook = await OrderBook.get(sender);

    const aliceInputVault = ethers.BigNumber.from(1);
    const aliceOutputVault = ethers.BigNumber.from(2);

    const askPrice = ethers.BigNumber.from("90" + eighteenZeros);
    const askConstants = [max_uint256, askPrice];
    const vAskOutputMax = op(OrderBook.Opcodes.CONSTANT, 0);
    const vAskPrice = op(OrderBook.Opcodes.CONSTANT, 1);
    // prettier-ignore
    const askSource = concat([
      vAskOutputMax,
      vAskPrice,
    ]);
    const askOrderConfig: OrderConfig = {
      validInputs: [{
        token: tokenA.address,
        vaultId: aliceInputVault,
      }],
      validOutputs: [{
        token: tokenB.address,
        vaultId: aliceOutputVault,
      }],
      tracking: "0x00",
      vmStateConfig: {
        sources: [askSource],
        constants: askConstants,
      },
    };

    const txAskOrderLive = await orderBook
      .connect(alice)
      .addOrder(askOrderConfig);

    const { sender: askLiveSender, config: askLiveConfig } =
      (await getEventArgs(
        txAskOrderLive,
        "OrderLive",
        orderBook.address,
        orderbookInterface
      )) as OrderLiveEvent["args"];

    assert(askLiveSender === alice.address, "wrong sender");
    compareStructs(askLiveConfig, askOrderConfig);

    // REMOVE ASK ORDER

    const txAskOrderDead = await orderBook
      .connect(alice)
      .removeOrder(askLiveConfig);

    const { sender: askDeadSender, config: askDeadConfig } =
      (await getEventArgs(
        txAskOrderDead,
        "OrderDead",
        orderBook.address,
        orderbookInterface
      )) as OrderDeadEvent["args"];

    assert(askDeadSender === alice.address, "wrong sender");
    compareStructs(askDeadConfig, askOrderConfig);
  });

  it("should allow withdrawals from vaults", async function () {
    const signers = await ethers.getSigners();
    const sender = signers[0];
    const alice = signers[1];

    const orderBook = await OrderBook.get(sender);

    const vaultId = ethers.BigNumber.from(1);

    // DEPOSITS
    const amount = ethers.BigNumber.from("1000" + eighteenZeros);
    await tokenA.transfer(alice.address, amount);

    const depositConfigStruct: DepositConfig = {
      token: tokenA.address,
      vaultId,
      amount,
    };

    await tokenA
      .connect(alice)
      .approve(orderBook.address, depositConfigStruct.amount);

    // Alice deposits tokenA into her non-append-only vault
    const txDeposit = await orderBook
      .connect(alice)
      .deposit(depositConfigStruct);

    const { sender: depositSender, config: depositConfig } =
      (await getEventArgs(
        txDeposit,
        "Deposit",
        orderBook.address,
        orderbookInterface
      )) as DepositEvent["args"];

    assert(depositSender === alice.address);
    compareStructs(depositConfig, depositConfigStruct);

    const aliceTokenABalance0 = await tokenA.balanceOf(alice.address);

    const withdrawConfigStruct: WithdrawConfig = {
      token: tokenA.address,
      vaultId: vaultId,
      amount,
    };

    const txWithdraw = await orderBook
      .connect(alice)
      .withdraw(withdrawConfigStruct);

    const { sender: withdrawSender, config: withdrawConfig } =
      (await getEventArgs(
        txWithdraw,
        "Withdraw",
        orderBook.address,
        orderbookInterface
      )) as WithdrawEvent["args"];

    assert(withdrawSender === alice.address);
    compareStructs(withdrawConfig, withdrawConfigStruct);

    const aliceTokenABalance1 = await tokenA.balanceOf(alice.address);

    assert(aliceTokenABalance0.isZero());
    assert(aliceTokenABalance1.eq(amount));
  });

  it("should add ask and bid orders and clear the order", async function () {
    const signers = await ethers.getSigners();

    const sender = signers[0];
    const alice = signers[1];
    const bob = signers[2];
    const bountyBot = signers[3];

    const orderBook = await OrderBook.get(sender);

    const aliceInputVault = ethers.BigNumber.from(1);
    const aliceOutputVault = ethers.BigNumber.from(2);
    const bobInputVault = ethers.BigNumber.from(1);
    const bobOutputVault = ethers.BigNumber.from(2);
    const bountyBotVaultA = ethers.BigNumber.from(1);
    const bountyBotVaultB = ethers.BigNumber.from(2);

    // ASK ORDER

    const askPrice = ethers.BigNumber.from("90" + eighteenZeros);
    const askConstants = [max_uint256, askPrice];
    const vAskOutputMax = op(OrderBook.Opcodes.CONSTANT, 0);
    const vAskPrice = op(OrderBook.Opcodes.CONSTANT, 1);
    // prettier-ignore
    const askSource = concat([
      vAskOutputMax,
      vAskPrice,
    ]);
    const askOrderConfig: OrderConfig = {
      validInputs: [{
              token: tokenA.address,
      vaultId: aliceInputVault,
      }],
      validOutputs: [{
              token: tokenB.address,
      vaultId: aliceOutputVault,
      }],


      tracking: "0x00",
      vmStateConfig: {
        sources: [askSource],
        constants: askConstants,
      },
    };

    const txAskOrderLive = await orderBook
      .connect(alice)
      .addOrder(askOrderConfig);

    const { sender: askSender, config: askConfig } = (await getEventArgs(
      txAskOrderLive,
      "OrderLive",
      orderBook.address,
      orderbookInterface
    )) as OrderLiveEvent["args"];

    assert(askSender === alice.address, "wrong sender");
    compareStructs(askConfig, askOrderConfig);

    // BID ORDER
    const bidPrice = fixedPointDiv(ONE, askPrice);
    const bidConstants = [max_uint256, bidPrice];
    const vBidOutputMax = op(OrderBook.Opcodes.CONSTANT, 0);
    const vBidPrice = op(OrderBook.Opcodes.CONSTANT, 1);
    // prettier-ignore
    const bidSource = concat([
      vBidOutputMax,
      vBidPrice,
    ]);
    const bidOrderConfig: OrderConfig = {
      validInputs: [{
              token: tokenB.address,
      vaultId: bobInputVault,
      }],
      validOutputs: [{
              token: tokenA.address,
      vaultId: bobOutputVault,
      }],


      tracking: "0x00",
      vmStateConfig: {
        sources: [bidSource],
        constants: bidConstants,
      },
    };

    const txBidOrderLive = await orderBook
      .connect(bob)
      .addOrder(bidOrderConfig);

    const { sender: bidSender, config: bidConfig } = (await getEventArgs(
      txBidOrderLive,
      "OrderLive",
      orderBook.address,
      orderbookInterface
    )) as OrderLiveEvent["args"];

    assert(bidSender === bob.address, "wrong sender");
    compareStructs(bidConfig, bidOrderConfig);

    // DEPOSITS
    const amountB = ethers.BigNumber.from("1000" + eighteenZeros);
    const amountA = ethers.BigNumber.from("1000" + eighteenZeros);

    await tokenB.transfer(alice.address, amountB);
    await tokenA.transfer(bob.address, amountA);

    const depositConfigStructAlice: DepositConfig = {
      token: tokenB.address,
      vaultId: aliceOutputVault,
      amount: amountB,
    };
    const depositConfigStructBob: DepositConfig = {
      token: tokenA.address,
      vaultId: bobOutputVault,
      amount: amountA,
    };

    await tokenB
      .connect(alice)
      .approve(orderBook.address, depositConfigStructAlice.amount);
    await tokenA
      .connect(bob)
      .approve(orderBook.address, depositConfigStructBob.amount);

    // Alice deposits tokenB into her output vault
    const txDepositOrderAlice = await orderBook
      .connect(alice)
      .deposit(depositConfigStructAlice);
    // Bob deposits tokenA into his output vault
    const txDepositOrderBob = await orderBook
      .connect(bob)
      .deposit(depositConfigStructBob);

    const { sender: depositAliceSender, config: depositAliceConfig } =
      (await getEventArgs(
        txDepositOrderAlice,
        "Deposit",
        orderBook.address,
        orderbookInterface
      )) as DepositEvent["args"];
    const { sender: depositBobSender, config: depositBobConfig } =
      (await getEventArgs(
        txDepositOrderBob,
        "Deposit",
        orderBook.address,
        orderbookInterface
      )) as DepositEvent["args"];

    assert(depositAliceSender === alice.address);
    compareStructs(depositAliceConfig, depositConfigStructAlice);
    assert(depositBobSender === bob.address);
    compareStructs(depositBobConfig, depositConfigStructBob);

    // BOUNTY BOT CLEARS THE ORDER

    const bountyConfig: ClearConfig = {
      aInputIndex: 0,
      aOutputIndex: 0,
      bInputIndex: 0,
      bOutputIndex: 0,
      aBountyVaultId: bountyBotVaultA,
      bBountyVaultId: bountyBotVaultB,
    };

    const txClearOrder = await orderBook
      .connect(bountyBot)
      .clear(askConfig, bidConfig, bountyConfig);

    const {
      sender: clearSender,
      a_: clearA_,
      b_: clearB_,
      clearConfig: clearBountyConfig,
    } = (await getEventArgs(
      txClearOrder,
      "Clear",
      orderBook.address,
      orderbookInterface
    )) as ClearEvent["args"];
    const { stateChange: clearStateChange } = (await getEventArgs(
      txClearOrder,
      "AfterClear",
      orderBook.address,
      orderbookInterface
    )) as AfterClearEvent["args"];

    const aOutputMaxExpected = amountA;
    const bOutputMaxExpected = amountB;

    const aOutputExpected = minBN(
      aOutputMaxExpected,
      fixedPointMul(bidPrice, amountA)
    );
    const bOutputExpected = minBN(
      bOutputMaxExpected,
      fixedPointMul(askPrice, amountB)
    );

    const expectedClearStateChange: ClearStateChange = {
      aOutput: aOutputExpected,
      bOutput: bOutputExpected,
      aInput: fixedPointMul(askPrice, aOutputExpected),
      bInput: fixedPointMul(bidPrice, bOutputExpected),
    };

    assert(clearSender === bountyBot.address);
    compareSolStructs(clearA_, askConfig);
    compareSolStructs(clearB_, bidConfig);
    compareStructs(clearBountyConfig, bountyConfig);
    compareStructs(clearStateChange, expectedClearStateChange);
  });

});