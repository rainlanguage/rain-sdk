import { assert } from 'chai';
import { ethers } from 'hardhat';
import { Tier, Time } from './utils';
import { BigNumber } from 'ethers';
import { 
  op,
  paddedUInt32,
  selectLte,
  arg,
  concat,
  callSize,
  tierRange,
  selectLteLogic,
  selectLteMode,
  assertError
} from '../src/utils'
import {
  StateConfig,
  RainJS,
  OpcodeFN,
  ApplyOpFn,
  VM,
} from '../src';



describe('SDK - RainJS', () => {
  it('should perform correctly with custom opcode function', async () => {
    
    const customBlockNumber: OpcodeFN = (state, operand, data) => {
      state.stack.push(
        BigNumber.from(data.blockNumber)
      )
    }
    const applyOpFn: ApplyOpFn = {};
    applyOpFn[VM.Opcodes.BLOCK_NUMBER] = customBlockNumber;

    const script: StateConfig = {
      constants: [1, 2, 3],
      sources: [
        concat([
          op(RainJS.Opcodes.BLOCK_NUMBER),
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.VAL, 1),
          op(RainJS.Opcodes.VAL, 2),
          op(RainJS.Opcodes.ADD, 3),
          op(RainJS.Opcodes.BLOCK_NUMBER),
          op(RainJS.Opcodes.ADD, 3),
        ])
      ],
      stackLength: 6,
      argumentsLength: 0
    }

    const rainJs = new RainJS(script, {applyOpFn});

    const result = await rainJs.run({blockNumber: 111});

    const expected = BigNumber.from(111 + 111 + (1 + 2 + 3));

    assert(
      expected.eq(result),
      `
      The addition operation failed:
      expected ${expected}
      got ${result}`
    );
  })

  it("should correctly perform a zipmap loop", async () => {

    const val1 = BigNumber.from(
      "0x" +
      paddedUInt32(0) +
      paddedUInt32(4) +
      paddedUInt32(0) +
      paddedUInt32(3) +
      paddedUInt32(0) +
      paddedUInt32(2) +
      paddedUInt32(0) +
      paddedUInt32(1)
    )
    const val2 = BigNumber.from(
      "0x" +
      paddedUInt32(0) +
      paddedUInt32(8) +
      paddedUInt32(0) +
      paddedUInt32(7) +
      paddedUInt32(0) +
      paddedUInt32(6) +
      paddedUInt32(0) +
      paddedUInt32(5)
    )
    const val3 = BigNumber.from(
      "0x" +
      paddedUInt32(0) +
      paddedUInt32(12) +
      paddedUInt32(0) +
      paddedUInt32(11) +
      paddedUInt32(0) +
      paddedUInt32(10) +
      paddedUInt32(0) +
      paddedUInt32(9)
    )
    const constants = [val1, val2, val3];

    const v1 = op(RainJS.Opcodes.VAL, 0);
    const v2 = op(RainJS.Opcodes.VAL, 1);
    const v3 = op(RainJS.Opcodes.VAL, 2);

    const a0 = op(RainJS.Opcodes.VAL, arg(0));
    const a1 = op(RainJS.Opcodes.VAL, arg(1));
    const a2 = op(RainJS.Opcodes.VAL, arg(2));

    // zero-based counting
    const sourceIndex = 1; // 1
    const loopSize = 2; // 1
    const valSize = 2; // 3

    const sources = [
      concat([
        v1,
        v2,
        v3,
        op(RainJS.Opcodes.ZIPMAP, callSize(sourceIndex, loopSize, valSize)),
        op(RainJS.Opcodes.ADD, 4),
      ]),
      concat([
        // (arg0 arg1 arg2 add)
        a0,
        a1,
        a2,
        op(RainJS.Opcodes.ADD, 3),
      ]),
    ];

    const script = {
      sources,
      constants,
      argumentsLength: 3,
      stackLength: 3,
    }

    const rainJs = new RainJS(script);

    const result = await rainJs.run();

    const expected = BigNumber.from((9+5+1) + (10+6+2) + (11+7+3) + (12+8+4));

  assert(
    expected.eq(result),
    `
    zipmap operation failed:
    expected: ${expected}
    got: ${result}`
  )
  })

  it('should log the current state of the script', async () => {
    
    const [signer] = await ethers.getSigners();
    
    const script: StateConfig = {
      constants: [1, 2, 3],
      sources: [
        concat([
          op(RainJS.Opcodes.BLOCK_NUMBER),
          op(RainJS.Opcodes.DEBUG),
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.VAL, 1),
          op(RainJS.Opcodes.VAL, 2),
          op(RainJS.Opcodes.ADD, 3),
          op(RainJS.Opcodes.DEBUG),
          op(RainJS.Opcodes.ADD, 2),
        ])
      ],
      stackLength: 8,
      argumentsLength: 0
    }

    const rainJs = new RainJS(script, {signer});

    const result = await rainJs.run();
    const block = await Time.currentBlock();
    const expected = BigNumber.from(block + (1 + 2 + 3));

    assert(
      expected.eq(result),
      `
      The addition operation failed:
      expected ${expected}
      got ${result}`
    );
  })

  it('should perform addition operation correctly with block number over span of 100 blocks repeatition', async () => {
    
    const [signer] = await ethers.getSigners();
    
    const script: StateConfig = {
      constants: [1, 2, 3],
      sources: [
        concat([
          op(RainJS.Opcodes.BLOCK_NUMBER),
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.VAL, 1),
          op(RainJS.Opcodes.VAL, 2),
          op(RainJS.Opcodes.ADD, 3),
          op(RainJS.Opcodes.ADD, 2),
        ])
      ],
      stackLength: 6,
      argumentsLength: 0
    }

    const rainJs = new RainJS(script, {signer});

    for (let i = 0 ; i < 100; i++) {
      const result = await rainJs.run();
      const block = await Time.currentBlock();
      const expected = BigNumber.from(block + (1 + 2 + 3));

      // advancing the blocks
      await Time.advanceBlock(1);

      assert(
        expected.eq(result),
        `
        The addition operation failed:
        expected ${expected}
        got ${result}`
      );
    }
  })

  it('should perform subtraction operation correctly with block number over span of 100 blocks repeatition', async () => {
    
    const [signer] = await ethers.getSigners();

    const script: StateConfig = {
      constants: [500, 2, 3],
      sources: [
        concat([
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.VAL, 1),
          op(RainJS.Opcodes.VAL, 2),
          op(RainJS.Opcodes.SUB, 3),
          op(RainJS.Opcodes.BLOCK_NUMBER),
          op(RainJS.Opcodes.SUB, 2),
        ])
      ],
      stackLength: 6,
      argumentsLength: 0
    }

    const rainJs = new RainJS(script, {signer});

    for (let i = 0 ; i < 100; i++) {
      const result = await rainJs.run();
      const block = await Time.currentBlock();
      const expected = BigNumber.from(500 - 2 - 3 - block);

      // advancing the blocks
      await Time.advanceBlock(1);

      assert(
        expected.eq(result),
        `
        The subtraction operation failed:
        expected ${expected}
        got ${result}`
      );
    }
  })

  it('should perform multiplication operation correctly with block timestamp over span of 100 blocks repeatition', async () => {
    
    const [signer] = await ethers.getSigners();
    
    const script: StateConfig = {
      constants: [2],
      sources: [
        concat([
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.BLOCK_TIMESTAMP),
          op(RainJS.Opcodes.MUL, 2),
        ])
      ],
      stackLength: 3,
      argumentsLength: 0
    }

    const rainJs = new RainJS(script, {signer});

    for (let i = 0 ; i < 100; i++) {
      const result = await rainJs.run();
      const time = await Time.currentTime();
      const expected = BigNumber.from(2 * time);

      // advancing the blocks
      await Time.advanceBlock(1);

      assert(
        expected.eq(result),
        `
        The multiplication operation failed:
        expected ${expected}
        got ${result}`
      );
    }
  })
  
  it('should perform division operation correctly with block timestamp over span of 100 blocks repeatition', async () => {
    
    const [signer] = await ethers.getSigners();
    
    const script: StateConfig = {
      constants: [2, 3],
      sources: [
        concat([
          op(RainJS.Opcodes.BLOCK_TIMESTAMP),
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.VAL, 1),
          op(RainJS.Opcodes.DIV, 3),
        ])
      ],
      stackLength: 4,
      argumentsLength: 0
    }

    const rainJs = new RainJS(script, {signer});

    for (let i = 0 ; i < 100; i++) {
      const result = await rainJs.run();
      const time = await Time.currentTime();
      const expected = BigNumber.from(time).div(2).div(3);

      // advancing the blocks
      await Time.advanceBlock(1);

      assert(
        expected.eq(result),
        `
        The division operation failed:
        expected ${expected}
        got ${result}`
      );
    }
  })

  it('should perform saturating add operation correctly', async () => {

    const script: StateConfig = {
      constants: [
        "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0",
        "0x4a3bc6def"
      ],
      sources: [
        concat([
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.VAL, 1),
          op(RainJS.Opcodes.SATURATING_ADD, 2),
        ])
      ],
      stackLength: 3,
      argumentsLength: 0
    }

    const rainJs = new RainJS(script);

    const result = await rainJs.run();
      
    const expected = ethers.constants.MaxUint256;

    assert(
      expected.eq(result),
      `
      The saturating add operation failed:
      expected ${expected}
      got ${result}`
    );
  })

  it('should perform saturating mul operation correctly', async () => {

    const script: StateConfig = {
      constants: [
        "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0",
        "0x4a3bc6def"
      ],
      sources: [
        concat([
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.VAL, 1),
          op(RainJS.Opcodes.SATURATING_MUL, 2),
        ])
      ],
      stackLength: 3,
      argumentsLength: 0
    }

    const rainJs = new RainJS(script);

    const result = await rainJs.run();
    
    const expected = ethers.constants.MaxUint256;

    assert(
      expected.eq(result),
      `
      The saturating mul operation failed:
      expected ${expected}
      got ${result}`
    );
  })

  it('should perform saturating sub operation correctly', async () => {

    const script: StateConfig = {
      constants: [
        "0x22",
        "0x44"
      ],
      sources: [
        concat([
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.VAL, 1),
          op(RainJS.Opcodes.SATURATING_SUB, 2),
        ])
      ],
      stackLength: 3,
      argumentsLength: 0
    }

    const rainJs = new RainJS(script);

    const result = await rainJs.run();
    
    const expected = ethers.constants.Zero;

    assert(
      expected.eq(result),
      `
      The saturating sub operation failed:
      expected ${expected}
      got ${result}`
    );
  })

  it('should perform mod operation correctly', async () => {
    
    const script: StateConfig = {
      constants: [
        "90",
        "44"
      ],
      sources: [
        concat([
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.VAL, 1),
          op(RainJS.Opcodes.MOD, 2),
        ])
      ],
      stackLength: 3,
      argumentsLength: 0
    }

    const rainJs = new RainJS(script);

    const result = await rainJs.run();
    
    const expected = ethers.constants.Two;

    assert(
      expected.eq(result),
      `
      The mod operation failed:
      expected ${expected}
      got ${result}`
    );
  })

  it('should perform exponention operation correctly', async () => {

    const script: StateConfig = {
      constants: [
        "2",
        "5"
      ],
      sources: [
        concat([
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.VAL, 1),
          op(RainJS.Opcodes.EXP, 2),
        ])
      ],
      stackLength: 3,
      argumentsLength: 0
    }

    const rainJs = new RainJS(script);

    const result = await rainJs.run();
    
    const expected = BigNumber.from("32");

    assert(
      expected.eq(result),
      `
      The exponention operation failed:
      expected ${expected}
      got ${result}`
    );
  })

  it('should perform scale18_mul operation correctly', async () => {

    const script: StateConfig = {
      constants: [
        "0x22",
        "0x44"
      ],
      sources: [
        concat([
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.VAL, 1),
          op(RainJS.Opcodes.SCALE18_MUL, 5),
        ])
      ],
      stackLength: 3,
      argumentsLength: 0
    }

    const rainJs = new RainJS(script);
    const result = await rainJs.run();

    const expected = BigNumber.from("0x22").mul("10000000000000").mul("0x44");

    assert(
      expected.eq(result),
      `
      The scale18 mul operation failed:
      expected ${expected}
      got ${result}`
    );
   })

   it('should perform scale18_div operation correctly', async () => {

    const script: StateConfig = {
      constants: [
        "0x22",
        "0x44"
      ],
      sources: [
        concat([
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.VAL, 1),
          op(RainJS.Opcodes.SCALE18_DIV, 10),
        ])
      ],
      stackLength: 3,
      argumentsLength: 0
    }

    const rainJs = new RainJS(script);
    const result = await rainJs.run();

    const expected = BigNumber.from("0x22").mul("100000000").div("0x44");

    assert(
      expected.eq(result),
      `
      The scale18 div operation failed:
      expected ${expected}
      got ${result}`
    );
   })

   it('should perform scale18 operation correctly', async () => {

    const script: StateConfig = {
      constants: [
        "220000000000000000012345",
      ],
      sources: [
        concat([
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.SCALE18, 22),
        ])
      ],
      stackLength: 2,
      argumentsLength: 0
    }

    const rainJs = new RainJS(script);
    const result = await rainJs.run();

    const expected = BigNumber.from("22000000000000000001");

    assert(
      expected.eq(result),
      `
      The scale18 operation failed:
      expected ${expected}
      got ${result}`
    );
   })

   it('should perform scalen operation correctly', async () => {

    const script: StateConfig = {
      constants: [
        "44371183800000000001",
    ],
      sources: [
        concat([
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.SCALEN, 3),
        ])
      ],
      stackLength: 2,
      argumentsLength: 0
    }

    const rainJs = new RainJS(script);
    const result = await rainJs.run();

    const expected = BigNumber.from("44371");

    assert(
      expected.eq(result),
      `
      The scalen operation failed:
      expected ${expected}
      got ${result}`
    );
   })

   it('should perform scale_by operation correctly', async () => {

    const script: StateConfig = {
      constants: [
        "44371183800127436851408839",
    ],
      sources: [
        concat([
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.SCALE_BY, 136),
        ])
      ],
      stackLength: 2,
      argumentsLength: 0
    }

    const rainJs = new RainJS(script);
    const result = await rainJs.run();

    const expected = BigNumber.from("443711838001274368");

    assert(
      expected.eq(result),
      `
      The scale_by operation failed:
      expected ${expected}
      got ${result}`
    );
  })

  it('should give the minimum value among the values', async () => {

    const script: StateConfig = {
      constants: [10, 20, 30, 40, 50, 60],
      sources: [
        concat([
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.VAL, 1),
          op(RainJS.Opcodes.VAL, 2),
          op(RainJS.Opcodes.VAL, 3),
          op(RainJS.Opcodes.VAL, 4),
          op(RainJS.Opcodes.MIN, 5),
        ])
      ],
      stackLength: 6,
      argumentsLength: 0
    }

    const rainJs = new RainJS(script);
    const result = await rainJs.run();

    const expected = BigNumber.from("10");

    assert(
      expected.eq(result),
      `
      The min operation failed:
      expected ${expected}
      got ${result}`
    );
  })

  it('should give the maximum value among the values', async () => {

    const script: StateConfig = {
      constants: [10, 20, 30, 40, 50, 60],
      sources: [
        concat([
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.VAL, 1),
          op(RainJS.Opcodes.VAL, 2),
          op(RainJS.Opcodes.VAL, 3),
          op(RainJS.Opcodes.VAL, 4),
          op(RainJS.Opcodes.VAL, 5),
          op(RainJS.Opcodes.MAX, 6),
        ])
      ],
      stackLength: 7,
      argumentsLength: 0
    }

    const rainJs = new RainJS(script);
    const result = await rainJs.run();

    const expected = BigNumber.from("60");

    assert(
      expected.eq(result),
      `
      The max operation failed:
      expected ${expected}
      got ${result}`
    );
  })

  it('eager_if and is_zero should work fine', async () => {

    const script: StateConfig = {
      constants: [10, 20, 30, 35],
      sources: [
        concat([
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.VAL, 1),
          op(RainJS.Opcodes.SATURATING_SUB, 2),
          op(RainJS.Opcodes.ISZERO),
          op(RainJS.Opcodes.VAL, 2),
          op(RainJS.Opcodes.VAL, 3),
          op(RainJS.Opcodes.EAGER_IF),
        ])
      ],
      stackLength: 7,
      argumentsLength: 0
    }

    const rainJs = new RainJS(script);
    const result = await rainJs.run();

    const expected = BigNumber.from("30");

    assert(
      expected.eq(result),
      `
      The eager_if operation failed:
      expected ${expected}
      got ${result}`
    );
  })

  it('eager_if and equal_to, less_than, greater_than, any and every should work fine', async () => {

    const script: StateConfig = {
      constants: [10, 20, ethers.constants.Zero, 30, 35],
      sources: [
        concat([
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.VAL, 1),
          op(RainJS.Opcodes.SATURATING_SUB, 2),
          op(RainJS.Opcodes.VAL, 2),
          op(RainJS.Opcodes.EQUAL_TO),
          op(RainJS.Opcodes.VAL, 3),
          op(RainJS.Opcodes.VAL, 4),
          op(RainJS.Opcodes.ADD, 2),
          op(RainJS.Opcodes.VAL, 3),
          op(RainJS.Opcodes.GREATER_THAN),
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.VAL, 1),
          op(RainJS.Opcodes.ADD, 2),
          op(RainJS.Opcodes.VAL, 4),
          op(RainJS.Opcodes.LESS_THAN),
          op(RainJS.Opcodes.ANY, 2),
          op(RainJS.Opcodes.EVERY, 2),
          op(RainJS.Opcodes.VAL, 3),
          op(RainJS.Opcodes.VAL, 4),
          op(RainJS.Opcodes.EAGER_IF),
        ])
      ],
      stackLength: 20,
      argumentsLength: 0
    }

    const rainJs = new RainJS(script);
    const result = await rainJs.run();

    const expected = BigNumber.from("30");

    assert(
      expected.eq(result),
      `
      The operation failed:
      expected ${expected}
      got ${result}`
    );
  })

  it('should correctly perform the update_block_for_tier_range and sat_diff with 2 reports', async () => {
    
    const [signer] = await ethers.getSigners();

    const script: StateConfig = {
      constants: [50],
      sources: [
        concat([
          op(RainJS.Opcodes.NEVER),
          op(RainJS.Opcodes.BLOCK_NUMBER),
          op(RainJS.Opcodes.UPDATE_BLOCKS_FOR_TIER_RANGE, tierRange(Tier.ZERO, Tier.EIGHT)),
          op(RainJS.Opcodes.NEVER),
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.UPDATE_BLOCKS_FOR_TIER_RANGE, tierRange(Tier.ZERO, Tier.EIGHT)),
          op(RainJS.Opcodes.SATURATING_DIFF),
        ])
      ],
      stackLength: 7,
      argumentsLength: 0
    }

    const rainJs = new RainJS(script, {signer});
    const result = await rainJs.run();

    const expected = BigNumber.from(
      "0x" + paddedUInt32(await Time.currentBlock() - 50).repeat(8)
    );

    assert(
      expected.eq(result),
      `
      The operation failed:
      expected ${expected}
      got ${result}`
    );
  })

  it('should correctly perform the update_block_for_tier_range and select_lte with "any logic and min mode" with 2 reports', async () => {
    
    const [signer] = await ethers.getSigners();

    const script: StateConfig = {
      constants: [1000, 50],
      sources: [
        concat([
          op(RainJS.Opcodes.NEVER),
          op(RainJS.Opcodes.VAL, 0),
          op(RainJS.Opcodes.UPDATE_BLOCKS_FOR_TIER_RANGE, tierRange(Tier.TWO, Tier.FOUR)),
          op(RainJS.Opcodes.NEVER),
          op(RainJS.Opcodes.VAL, 1),
          op(RainJS.Opcodes.UPDATE_BLOCKS_FOR_TIER_RANGE, tierRange(Tier.TWO, Tier.SIX)),
          op(RainJS.Opcodes.BLOCK_NUMBER),
          op(RainJS.Opcodes.SELECT_LTE, selectLte(selectLteLogic.any, selectLteMode.min, 2)),
        ])
      ],
      stackLength: 7,
      argumentsLength: 0
    }

    const rainJs = new RainJS(script, {signer});
    const result = await rainJs.run();

    const expected = BigNumber.from(
      "0x" + 
      paddedUInt32("0xffffffff").repeat(2) +
      paddedUInt32(50).repeat(4) +
      paddedUInt32("0xffffffff").repeat(2)
    );

    assert(
      expected.eq(result),
      `
      The operation failed:
      expected ${expected}
      got ${result}`
    );
  })
  
  it('should solve a mathematical expression (division, multiplication, summation)', async () => {
    
    const [signer] = await ethers.getSigners();
    
    const v4 = op(RainJS.Opcodes.VAL, 0);
    const v5 = op(RainJS.Opcodes.VAL, 1);
    const v2 = op(RainJS.Opcodes.VAL, 2);
    // ((((4 5 2 +) 2 /) 5 *) 4 5 *) 
    const script: StateConfig = {
      constants: [4, 5, 2],
      sources: [
        concat([
                v4,
                v5,
                v2,
                op(RainJS.Opcodes.ADD, 3),
              v2,
              op(RainJS.Opcodes.DIV, 2),
            v5,
            op(RainJS.Opcodes.MUL, 2),
          v4, 
          v5,
          op(RainJS.Opcodes.MUL, 3),
        ])
      ],
      stackLength: 11,
      argumentsLength: 0
    }

    const rainJs = new RainJS(script, {signer});
    const result = await rainJs.run();
    const expected = BigNumber.from(4+5+2).div(2).mul(5).mul(4).mul(5);
    assert(
      expected.eq(result),
      `
      The addition operation failed:
      expected ${expected}
      got ${result}`
    );

  })

  it("should error when trying to read an out-of-bounds argument", async () => {

    const errorMessage = "out-of-bound arguments";
    const constants = [1, 2, 3];
    const v1 = op(RainJS.Opcodes.VAL, 0);
    const v2 = op(RainJS.Opcodes.VAL, 1);
    const v3 = op(RainJS.Opcodes.VAL, 2);

    const a0 = op(RainJS.Opcodes.VAL, arg(0));
    const a1 = op(RainJS.Opcodes.VAL, arg(1));
    const aOOB = op(RainJS.Opcodes.VAL, arg(3)); // Should fail here

    // zero-based counting
    const sourceIndex = 1; // 1
    const loopSize = 0; // 1
    const valSize = 2; // 3

    const sources = [
      concat([
        v1,
        v2,
        v3,
        op(RainJS.Opcodes.ZIPMAP, callSize(sourceIndex, loopSize, valSize)),
      ]),
      concat([
        // (arg0 arg1 arg2 add)
        a0,
        a1,
        aOOB,
        op(RainJS.Opcodes.ADD, 3),
      ]),
    ];

    const script = {
      sources,
      constants,
      argumentsLength: 3,
      stackLength: 3,
    }

    const rainJs = new RainJS(script);
    await assertError(
      async () => await rainJs.run(),
      errorMessage
    );
  });
  
  it("should error when trying to read an out-of-bounds constant", async () => {
    
    const errorMessage = "out-of-bound constants";
    const constants = [1];
    const vOOB = op(RainJS.Opcodes.VAL, 1);

    const sources = [concat([vOOB])];

    const script = {
      sources,
      constants,
      argumentsLength: 0,
      stackLength: 1,
    }

    const rainJs = new RainJS(script);
    await assertError(
      async () => await rainJs.run(),
      errorMessage
    );
  });

  it("should throw error when stack underflows [eager_if]", async () => {
        
    const errorMessage = "Undefined stack variables";
    const constants = [0, 1];
    const v0 = op(RainJS.Opcodes.VAL, 0);
    const v1 = op(RainJS.Opcodes.VAL, 1);

    const sources = [
      concat([
        v0, 
        v1,
        op(RainJS.Opcodes.EAGER_IF),
      ]),
    ];

    const script = {
      sources,
      constants,
      argumentsLength: 0,
      stackLength: 3,
    }

    const rainJs = new RainJS(script);
    await assertError(
      async () => await rainJs.run(),
      errorMessage
    );
  });

  it("should throw error when stack underflows [add]", async () => {
        
    const errorMessage = "Undefined stack variables";
    const constants = [10, 1, 4];
    const v0 = op(RainJS.Opcodes.VAL, 0);
    const v1 = op(RainJS.Opcodes.VAL, 1);
    const v2 = op(RainJS.Opcodes.VAL, 2);

    const sources = [
      concat([
        v0, 
        v1,
        v2,
        op(RainJS.Opcodes.ADD, 4),
      ]),
    ];

    const script = {
      sources,
      constants,
      argumentsLength: 0,
      stackLength: 0,
    }

    const rainJs = new RainJS(script);
    
    await assertError(
      async () => await rainJs.run(),
      errorMessage
    );
  });

  it("should handle a zipmap op with maxed sourceIndex and valSize", async () => {
    const constants = [10, 20, 30, 40, 50, 60, 70, 80];

    const a0 = op(RainJS.Opcodes.VAL, arg(0));
    const a1 = op(RainJS.Opcodes.VAL, arg(1));
    const a2 = op(RainJS.Opcodes.VAL, arg(2));
    const a3 = op(RainJS.Opcodes.VAL, arg(3));
    const a4 = op(RainJS.Opcodes.VAL, arg(4));
    const a5 = op(RainJS.Opcodes.VAL, arg(5));
    const a6 = op(RainJS.Opcodes.VAL, arg(6));
    const a7 = op(RainJS.Opcodes.VAL, arg(7));

    // zero-based counting
    const sourceIndex = 1;
    const loopSize = 0; // no subdivision of uint256, normal constants
    const valSize = 7;

    const sources = [
      concat([
        op(RainJS.Opcodes.VAL, 0), // val0
        op(RainJS.Opcodes.VAL, 1), // val1
        op(RainJS.Opcodes.VAL, 2), // val2
        op(RainJS.Opcodes.VAL, 3), // val3
        op(RainJS.Opcodes.VAL, 4), // val4
        op(RainJS.Opcodes.VAL, 5), // val5
        op(RainJS.Opcodes.VAL, 6), // val6
        op(RainJS.Opcodes.VAL, 7), // val7
        op(RainJS.Opcodes.ZIPMAP, callSize(sourceIndex, loopSize, valSize)),
      ]),
      concat([
        // (arg0 arg1 arg2 ... add) (arg0 arg1 arg2 ... add)
        a0,
        a1,
        a2,
        a3,
        a4,
        a5,
        a6,
        a7,
        a0,
        a1,
        a2,
        a3,
        a4,
        a5,
        a6,
        a7,
        a0,
        a1,
        a2,
        a3,
        a4,
        a5,
        a6,
        a7,
        a0,
        a1,
        a2,
        a3,
        a4,
        a5,
        a6,
        a7,
        op(RainJS.Opcodes.ADD, 32), // max no. items
        a0,
        a1,
        a2,
        a3,
        a4,
        a5,
        a6,
        a7,
        a0,
        a1,
        a2,
        a3,
        a4,
        a5,
        a6,
        a7,
        a0,
        a1,
        a2,
        a3,
        a4,
        a5,
        a6,
        a7,
        a0,
        a1,
        a2,
        a3,
        a4,
        a5,
        op(RainJS.Opcodes.ADD, 30),
      ]),
    ];
    const script = {
      sources,
      constants,
      argumentsLength: 8,
      stackLength: 32,
    };
    const rainJs = new RainJS(script);
    
    const actualAdd = await rainJs.run();
    const expectedAdd = 1290; // second add
    assert(
      actualAdd.eq(expectedAdd),
      `wrong result of zipmap
      expected  ${expectedAdd}
      got       ${actualAdd}`
    );
   
  });

  it("should panic when accumulator underflows with subtraction op", async () => {

    const constants = [0, 1];
    const errorMessage = "negative value not allowed";
    const vZero = op(RainJS.Opcodes.VAL, 0);
    const vOne = op(RainJS.Opcodes.VAL, 1);
    // prettier-ignore
    const source = concat([
        vZero,
        vOne,
      op(RainJS.Opcodes.SUB, 2)
    ]);


    const script = {
      sources: [source],
      constants,
      argumentsLength: 0,
      stackLength: 10,
    };

    const rainJs = new RainJS(script);
    await assertError(
      async () => await rainJs.run(),
      errorMessage
    );
  });

  // Skipping as of now since overflow check is missing
  it.skip("should panic when accumulator overflows with multiplication op", async () => {

    const max_uint256 = ethers.BigNumber.from(
      "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
    );
    const constants = [max_uint256.div(2), 3];
    const errorMessage = "Arithmetic overflow error";
    const vHalfMaxUInt256 = op(RainJS.Opcodes.VAL, 0);
    const vThree = op(RainJS.Opcodes.VAL, 1);

    // (max_uint/2) * 3
    const source0 = concat([
        vHalfMaxUInt256,
        vThree,
      op(RainJS.Opcodes.MUL, 2)
    ]);

    const script = {
      sources: [source0],
      constants,
      argumentsLength: 0,
      stackLength: 10,
    };

    const rainJs = new RainJS(script);
    await assertError(
      async () => await rainJs.run(),
      errorMessage
    );
  });

  it.skip("should panic when accumulator overflows with exponentiation op", async () => {

    const max_uint256 = ethers.BigNumber.from(
      "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
    );
    const constants = [max_uint256.div(2), 2];
    const errorMessage = "Arithmetic overflow error";
    const vHalfMaxUInt256 = op(RainJS.Opcodes.VAL, 0);
    const vTwo = op(RainJS.Opcodes.VAL, 1);

    // (max_uint/2) ** 2
    const source0 = concat([
        vHalfMaxUInt256,
        vTwo,
      op(RainJS.Opcodes.EXP, 2)
    ]);

    const script = {
      sources: [source0],
      constants,
      argumentsLength: 0,
      stackLength: 10,
    };

    const rainJs = new RainJS(script);
    await assertError(
      async () => await rainJs.run(),
      errorMessage
    );
  });

  it.skip("should panic when accumulator overflows with addition op", async () => {

    const max_uint256 = ethers.BigNumber.from(
      "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
    );
    const constants = [max_uint256.div(2), 1];
    const errorMessage = "Arithmetic overflow error";
    const vHalfMaxUInt256 = op(RainJS.Opcodes.VAL, 0);
    const vOne = op(RainJS.Opcodes.VAL, 1);

    // max_uint256 + 1
    const source0 = concat([
        vHalfMaxUInt256,
        vOne,
      op(RainJS.Opcodes.ADD, 2)
    ]);

    const script = {
      sources: [source0],
      constants,
      argumentsLength: 0,
      stackLength: 10,
    };

    const rainJs = new RainJS(script);
    await assertError(
      async () => await rainJs.run(),
      errorMessage
    );
  });

})
