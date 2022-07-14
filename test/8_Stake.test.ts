import { assert } from 'chai';
import { ethers } from 'hardhat';
import { hexlify } from '../src/utils';
import { ReserveToken } from '../typechain';
import { Stake, StakeDeployArgs } from '../src';
import { 
  ONE,
  Tier,
  Time,
  sixZeros,
  THRESHOLDS,
  max_uint32,
  deployReserve,
  timestampToReport 
} from './utils';


describe('SDK - Stake' , async function () {

  let token: ReserveToken;

  beforeEach(async () => {
    token = await deployReserve() as ReserveToken;
  });

  it("should calculate correct mint amounts based on current supply", async function () {
    const signers = await ethers.getSigners();
    const deployer = signers[0];
    const alice = signers[1];

    const stakeDeployArgs: StakeDeployArgs = {
      name: "Stake Token",
      symbol: "STKN",
      token: token.address,
      initialRatio: ONE,
    };

    const stake = await Stake.deploy(deployer, stakeDeployArgs);

    const amount = ethers.BigNumber.from("1000" + sixZeros);

    const tokenPoolSize0_ = await token.balanceOf(stake.address);
    const totalSupply0_ = await stake.totalSupply();
    assert(tokenPoolSize0_.eq(totalSupply0_));
    assert(tokenPoolSize0_.isZero());

    // Alice deposits reserve tokens
    await token.transfer(alice.address, amount);
    await token.connect(alice).approve(stake.address, amount);
    await stake.connect(alice).deposit(amount);

    const expectedMint0 = amount.mul(stakeDeployArgs.initialRatio).div(ONE);
    const actualMint0 = await stake.totalSupply();

    assert(
      expectedMint0.eq(actualMint0),
      `wrong amount minted when supply == 0
      expected  ${expectedMint0}
      got       ${actualMint0}`
    );

    const tokenPoolSize1_ = await token.balanceOf(stake.address);
    const totalSupply1_ = await stake.totalSupply();
    assert(tokenPoolSize1_.eq(totalSupply1_));

    // Alice deposits more reserve tokens
    await token.transfer(alice.address, amount);
    await token.connect(alice).approve(stake.address, amount);
    await stake.connect(alice).deposit(amount);

    const expectedMint1 = actualMint0.mul(amount).div(tokenPoolSize1_);
    const actualMint1 = (await stake.totalSupply()).sub(actualMint0);

    assert(
      expectedMint1.eq(actualMint1),
      `wrong amount minted when supply > 0
      expected  ${expectedMint1}
      got       ${actualMint1}`
    );
  });

  it("should process minimum deposit of 1 token", async function () {
    const signers = await ethers.getSigners();
    const deployer = signers[0];
    const alice = signers[2];

    const stakeDeployArgs: StakeDeployArgs = {
      name: "Stake Token",
      symbol: "STKN",
      token: token.address,
      initialRatio: ONE,
    };

    const stake = await Stake.deploy(deployer, stakeDeployArgs);

    // Give Alice some reserve tokens and deposit them
    await token.transfer(alice.address, 2);
    await token.connect(alice).approve(stake.address, 1);
    await stake.connect(alice).deposit(1);
    await token.connect(alice).approve(stake.address, 1);
    await stake.connect(alice).deposit(1);
  });

  it("should process deposit of 2 tokens", async function () {
    const signers = await ethers.getSigners();
    const deployer = signers[0];
    const alice = signers[2];

    const stakeDeployArgs: StakeDeployArgs = {
      name: "Stake Token",
      symbol: "STKN",
      token: token.address,
      initialRatio: ONE,
    };

    const stake = await Stake.deploy(deployer, stakeDeployArgs);

    // Give Alice some reserve tokens and deposit them
    await token.transfer(alice.address, 4);
    await token.connect(alice).approve(stake.address, 2);
    await stake.connect(alice).deposit(2);
    await token.connect(alice).approve(stake.address, 2);
    await stake.connect(alice).deposit(2);
  });

  it("should process deposits", async function () {
    const signers = await ethers.getSigners();
    const deployer = signers[0];
    const alice = signers[2];

    const stakeDeployArgs: StakeDeployArgs = {
      name: "Stake Token",
      symbol: "STKN",
      token: token.address,
      initialRatio: ONE,
    };

    const stake = await Stake.deploy(deployer, stakeDeployArgs);

    // Give Alice some reserve tokens
    await token.transfer(
      alice.address,
      ethers.BigNumber.from("1000" + sixZeros)
    );

    const tokenBalanceAlice0 = await token.balanceOf(alice.address);
    const stTokenSupply0 = await stake.totalSupply();

    assert(stTokenSupply0.isZero(), "initial stToken supply was not 0");

    // deposit some of Alice's tokens
    await token
      .connect(alice)
      .approve(stake.address, tokenBalanceAlice0.div(10));
    await stake.connect(alice).deposit(tokenBalanceAlice0.div(10));

    const tokenBalanceAlice1 = await token.balanceOf(alice.address);
    const stTokenBalanceAlice1 = await stake.balanceOf(alice.address);
    const stTokenSupply1 = await stake.totalSupply();

    assert(
      tokenBalanceAlice1.eq(tokenBalanceAlice0.sub(tokenBalanceAlice0.div(10))),
      "deposit did not transfer correct token amount to Stake contract"
    );
    assert(
      !stTokenSupply1.isZero(),
      "no stToken was minted after first deposit"
    );
    assert(
      !stTokenBalanceAlice1.isZero(),
      "alice did not receive stToken upon depositing token"
    );
    assert(
      stTokenBalanceAlice1.eq(stTokenSupply1),
      "alice balance was not equal to total stToken supply"
    );

    // deposit more of Alice's tokens
    await token
      .connect(alice)
      .approve(stake.address, tokenBalanceAlice0.div(10));
    await stake.connect(alice).deposit(tokenBalanceAlice0.div(10));

    const tokenBalanceAlice2 = await token.balanceOf(alice.address);
    const stTokenBalanceAlice2 = await stake.balanceOf(alice.address);
    const stTokenSupply2 = await stake.totalSupply();

    assert(
      tokenBalanceAlice2.eq(tokenBalanceAlice1.sub(tokenBalanceAlice0.div(10))),
      "deposit did not transfer correct token amount to Stake contract"
    );
    assert(
      !stTokenSupply2.isZero(),
      "no stToken was minted after first deposit"
    );
    assert(
      !stTokenBalanceAlice2.isZero(),
      "alice did not receive stToken upon depositing token"
    );
    assert(
      stTokenBalanceAlice2.eq(stTokenSupply2),
      "alice balance was not equal to total stToken supply"
    );
  });

  // @TODO - upgrade to latest rain commit and activate this test

//   it("should process deposit and withdraw with a non 1:1 ratio", async function () {
//     const signers = await ethers.getSigners();
//     const deployer = signers[0];
//     const alice = signers[2];
    
//     // Create the instances
//     // const erc20Deployer = new ERC20(erc20Address, deployer);
//     // const reserveToken = erc20Deployer.connect(staker);
// ;
//     // Transfer tokens from the deployer to the alice with the instances
//     const amountToTransfer = ethers.BigNumber.from('50000000');
//     await token.connect(deployer).approve(deployer.address, amountToTransfer);

//     //await token.connect(alice);
//     await token.transferFrom(
//       deployer.address,
//       alice.address,
//       amountToTransfer
//     );

//     const tokenBalanceAlice = await token.balanceOf(alice.address)

//     assert(
//       tokenBalanceAlice.eq(amountToTransfer),
//       "Alice did not received the tokens"
//     );

//     const stakeDeployArgs: StakeDeployArgs = {
//       name: "Stake Token",
//       symbol: "STKN",
//       token: token.address,
//       initialRatio: "1000000000000000000000000000000",
//     };
//     const stake = await Stake.deploy(alice, stakeDeployArgs)

//     const stTokenTotalSupply0 = await stake.totalSupply();
//     const tokenBalanceStake0 = await token.balanceOf(stake.address);

//     assert(
//       stTokenTotalSupply0.isZero(),
//       "stToken supply is not zero before any deposits"
//     );
//     assert(
//       tokenBalanceStake0.isZero(),
//       "stake contract token balance is not zero before any deposits"
//     );

//     await token.connect(alice).approve(stake.address, ethers.constants.MaxUint256);
//     const depositUnits = ethers.BigNumber.from("20000000");
//     // alice depositing 
//     await stake.deposit(depositUnits);


//     const stTokenTotalSupply1 = await stake.totalSupply();
//     const tokenBalanceStake1 = await token.balanceOf(stake.address);
//     const stTokenBalanceAlice0 = await stake.balanceOf(alice.address);
//     const tokenBalanceAlice0 = await token.balanceOf(alice.address);

//     assert(
//       stTokenTotalSupply1.eq(depositUnits.mul(10**12)),
//       "stToken has not minted correct units"
//     );
//     assert(
//       tokenBalanceStake1.eq(depositUnits),
//       "stake contract token balance is not equal to deposited amount"
//     );
//     assert(
//       stTokenBalanceAlice0.eq(depositUnits.mul(10**12)),
//       "Alice has not received correct share units"
//     );
//     assert(
//       tokenBalanceAlice0.eq(amountToTransfer.sub(depositUnits)),
//       "alice doesn't have correct token balance after deposit"
//     );

//     // alice withdrawing half of her shares
//     const shares = await stake.balanceOf(alice.address)
//     await stake.withdraw(shares.div(2))

//     const stTokenTotalSupply2 = await stake.totalSupply();
//     const tokenBalanceStake2 = await token.balanceOf(stake.address);
//     const stTokenBalanceAlice1 = await stake.balanceOf(alice.address);
//     const tokenBalanceAlice1 = await token.balanceOf(alice.address) 
      
//     assert(
//       stTokenTotalSupply2.eq(stTokenTotalSupply1.div(2)),
//       "stToken has not burned correct units"
//     );
//     assert(
//       tokenBalanceStake2.eq(tokenBalanceStake1.div(2)),
//       "stake contract token balance has not transfered correct units to alice"
//     );
//     assert(
//       stTokenBalanceAlice1.eq(stTokenBalanceAlice0.div(2)),
//       "alice doesn't have correct share units after withdrawing"
//     );
//     assert(
//       tokenBalanceAlice1.eq(tokenBalanceAlice0.add(depositUnits.div(2))),
//       "alice has not received correct token units after withdrawing"
//     );
//   });

  it("should return one-to-many reports i.e. when different lists of thresholds are checked against", async function () {
    const signers = await ethers.getSigners();
    const deployer = signers[0];
    const alice = signers[2];

    const stakeDeployArgs: StakeDeployArgs = {
      name: "Stake Token",
      symbol: "STKN",
      token: token.address,
      initialRatio: ONE,
    };

    const stake = await Stake.deploy(deployer, stakeDeployArgs);

    // Give Alice reserve tokens and desposit them
    const depositAmount0 = THRESHOLDS[3].add(1);
    await token.transfer(alice.address, depositAmount0);
    await token.connect(alice).approve(stake.address, depositAmount0);
    await stake.connect(alice).deposit(depositAmount0);

    const depositTimestamp0 = await Time.currentTime();

    const thresholds0 = THRESHOLDS;
    const thresholds1 = [1500, 2500, 3500, 4500, 5500, 6500, 7500, 8500].map(
      (value) => ethers.BigNumber.from(value + sixZeros)
    );

    const report0 = await stake.report(alice.address, thresholds0);
    const report1 = await stake.report(alice.address, thresholds1);

    const expected0 = timestampToReport([
      depositTimestamp0,
      depositTimestamp0,
      depositTimestamp0,
      depositTimestamp0,
      0xffffffff,
      0xffffffff,
      0xffffffff,
      0xffffffff,
    ]);
    const expected1 = timestampToReport([
      depositTimestamp0,
      depositTimestamp0,
      depositTimestamp0,
      0xffffffff, // not enough to reach tier 4 according to `thresholds1`
      0xffffffff,
      0xffffffff,
      0xffffffff,
      0xffffffff,
    ]);

    assert(
      report0.eq(expected0),
      `did not return correct stake report0
      expected  ${hexlify(expected0)}
      got       ${hexlify(report0)}`
    );
    assert(
      report1.eq(expected1),
      `did not return correct stake report1
      expected  ${hexlify(expected1)}
      got       ${hexlify(report1)}`
    );
  });

    // @TODO - upgrade to latest rain commit and activate this test

  // it("should return time for tier ONE when enough tokens have been staked to exceed the 1st threshold", async () => {
  //   const signers = await ethers.getSigners();
  //   const deployer = signers[0];
  //   const alice = signers[1];

  //   const stakeDeployArgs: StakeDeployArgs = {
  //     name: "Stake Token",
  //     symbol: "STKN",
  //     token: token.address,
  //     initialRatio: ONE,
  //   };

  //   const stake = await Stake.deploy(deployer, stakeDeployArgs);

  //   // Give Alice reserve tokens and desposit them
  //   const depositAmount0 = THRESHOLDS[0].add(1); // exceeds 1st threshold
  //   await token.transfer(alice.address, depositAmount0);
  //   await token.connect(alice).approve(stake.address, depositAmount0);
  //   await stake.connect(alice).deposit(depositAmount0);

  //   const time_ = await stake.reportTimeForTier(
  //     alice.address,
  //     Tier.ONE,
  //     THRESHOLDS
  //   );

  //   const blockTime_ = await Time.currentTime();
  //   assert(
  //     time_.eq(blockTime_),
  //     "did not exceed 1st threshold, according to reportTimeForTier"
  //   );
  // });

  // @TODO - upgrade to latest rain commit and activate this test
  
  // it("should return ALWAYS time for tier ZERO", async () => {
  //   const signers = await ethers.getSigners();
  //   const deployer = signers[0];
  //   const alice = signers[1];

  //   const stakeDeployArgs: StakeDeployArgs = {
  //     name: "Stake Token",
  //     symbol: "STKN",
  //     token: token.address,
  //     initialRatio: ONE,
  //   };

  //   const stake = await Stake.deploy(deployer, stakeDeployArgs);

  //   const time_ = await stake.reportTimeForTier(alice.address, Tier.ZERO, []);

  //   assert(time_.isZero());
  // });

  it("should return NEVER time if tier greater than context length", async () => {
    const signers = await ethers.getSigners();
    const deployer = signers[0];
    const alice = signers[1];

    const stakeDeployArgs: StakeDeployArgs = {
      name: "Stake Token",
      symbol: "STKN",
      token: token.address,
      initialRatio: ONE,
    };

    const stake = await Stake.deploy(deployer, stakeDeployArgs);

    // Give Alice reserve tokens and desposit them
    const depositAmount0 = THRESHOLDS[0].add(1); // exceeds 1st threshold
    await token.transfer(alice.address, depositAmount0);
    await token.connect(alice).approve(stake.address, depositAmount0);
    await stake.connect(alice).deposit(depositAmount0);

    const time0_ = await stake.reportTimeForTier(alice.address, Tier.ONE, []);
    const time1_ = await stake.reportTimeForTier(alice.address, Tier.TWO, [
      THRESHOLDS[0],
    ]);
    const time2_ = await stake.reportTimeForTier(
      alice.address,
      Tier.THREE,
      THRESHOLDS.slice(0, 1)
    );
    const time3_ = await stake.reportTimeForTier(
      alice.address,
      Tier.FOUR,
      THRESHOLDS.slice(0, 2)
    );
    const time4_ = await stake.reportTimeForTier(
      alice.address,
      Tier.FIVE,
      THRESHOLDS.slice(0, 3)
    );
    const time5_ = await stake.reportTimeForTier(
      alice.address,
      Tier.SIX,
      THRESHOLDS.slice(0, 4)
    );
    const time6_ = await stake.reportTimeForTier(
      alice.address,
      Tier.SEVEN,
      THRESHOLDS.slice(0, 5)
    );
    const time7_ = await stake.reportTimeForTier(
      alice.address,
      Tier.EIGHT,
      THRESHOLDS.slice(0, 6)
    );

    assert(time0_.eq(max_uint32));
    assert(time1_.eq(max_uint32));
    assert(time2_.eq(max_uint32));
    assert(time3_.eq(max_uint32));
    assert(time4_.eq(max_uint32));
    assert(time5_.eq(max_uint32));
    assert(time6_.eq(max_uint32));
    assert(time7_.eq(max_uint32));
  });
});
