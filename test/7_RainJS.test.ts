import { assert } from 'chai';
import { ethers } from 'hardhat';
import { BigNumber } from 'ethers';
import { expectAsyncError, Tier, Time } from './utils';
import { StateConfig, RainJS, OpcodeFN, ApplyOpFn, VM } from '../src';
import {
  op,
  paddedUInt32,
  selectLte,
  concat,
  callSize,
  tierRange,
  selectLteLogic,
  selectLteMode,
} from '../src/utils';


describe('SDK - RainJS', () => {
  it('should perform correctly with custom opcode function', async () => {
    const customBlockNumber: OpcodeFN = (state, operand, data) => {
      state.stack.push(BigNumber.from(data.blockNumber));
    };
    const applyOpFn: ApplyOpFn = {};
    applyOpFn[VM.Opcodes.BLOCK_NUMBER] = customBlockNumber;

    const script: StateConfig = {
      constants: [1, 2, 3],
      sources: [
        concat([
          op(VM.Opcodes.BLOCK_NUMBER),
          op(VM.Opcodes.CONSTANT, 0),
          op(VM.Opcodes.CONSTANT, 1),
          op(VM.Opcodes.CONSTANT, 2),
          op(VM.Opcodes.ADD, 3),
          op(VM.Opcodes.BLOCK_NUMBER),
          op(VM.Opcodes.ADD, 3),
        ]),
      ],
    };

    const rainJs = new RainJS(script, { applyOpFn });

    const result = await rainJs.run({ blockNumber: 111 });

    const expected = BigNumber.from(111 + 111 + (1 + 2 + 3));

    assert(
      expected.eq(result),
      `
      The addition operation failed:
      expected ${expected}
      got ${result}`
    );
  });

  it('should correctly perform a zipmap loop', async () => {
    const val1 = BigNumber.from(
      '0x' +
        paddedUInt32(0) +
        paddedUInt32(4) +
        paddedUInt32(0) +
        paddedUInt32(3) +
        paddedUInt32(0) +
        paddedUInt32(2) +
        paddedUInt32(0) +
        paddedUInt32(1)
    );
    const val2 = BigNumber.from(
      '0x' +
        paddedUInt32(0) +
        paddedUInt32(8) +
        paddedUInt32(0) +
        paddedUInt32(7) +
        paddedUInt32(0) +
        paddedUInt32(6) +
        paddedUInt32(0) +
        paddedUInt32(5)
    );
    const val3 = BigNumber.from(
      '0x' +
        paddedUInt32(0) +
        paddedUInt32(12) +
        paddedUInt32(0) +
        paddedUInt32(11) +
        paddedUInt32(0) +
        paddedUInt32(10) +
        paddedUInt32(0) +
        paddedUInt32(9)
    );
    const constants = [val1, val2, val3];

    const v1 = op(VM.Opcodes.CONSTANT, 0);
    const v2 = op(VM.Opcodes.CONSTANT, 1);
    const v3 = op(VM.Opcodes.CONSTANT, 2);

    const a0 = op(VM.Opcodes.CONSTANT, 3);
    const a1 = op(VM.Opcodes.CONSTANT, 4);
    const a2 = op(VM.Opcodes.CONSTANT, 5);

    // zero-based counting
    const sourceIndex = 1; // 1
    const loopSize = 2; // 1
    const valSize = 2; // 3

    const sources = [
      concat([
        v1,
        v2,
        v3,
        op(VM.Opcodes.ZIPMAP, callSize(sourceIndex, loopSize, valSize)),
        op(VM.Opcodes.ADD, 4),
      ]),
      concat([
        // (arg0 arg1 arg2 add)
        a0,
        a1,
        a2,
        op(VM.Opcodes.ADD, 3),
      ]),
    ];

    const script = {
      sources,
      constants,
      argumentsLength: 3,
      stackLength: 3,
    };

    const rainJs = new RainJS(script);

    const result = await rainJs.run();

    const expected = BigNumber.from(
      9 + 5 + 1 + (10 + 6 + 2) + (11 + 7 + 3) + (12 + 8 + 4)
    );

    assert(
      expected.eq(result),
      `
    zipmap operation failed:
    expected: ${expected}
    got: ${result}`
    );
  });

  it('should log the current state of the script', async () => {
    const [signer] = await ethers.getSigners();

    const script: StateConfig = {
      constants: [1, 2, 3],
      sources: [
        concat([
          op(VM.Opcodes.BLOCK_NUMBER),
          op(VM.Opcodes.DEBUG),
          op(VM.Opcodes.CONSTANT, 0),
          op(VM.Opcodes.CONSTANT, 1),
          op(VM.Opcodes.CONSTANT, 2),
          op(VM.Opcodes.ADD, 3),
          op(VM.Opcodes.DEBUG),
          op(VM.Opcodes.ADD, 2),
        ]),
      ],
    };

    const rainJs = new RainJS(script, { signer });

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
  });

  it('should perform addition operation correctly with block number over span of 100 blocks repeatition', async () => {
    const [signer] = await ethers.getSigners();

    const script: StateConfig = {
      constants: [1, 2, 3],
      sources: [
        concat([
          op(VM.Opcodes.BLOCK_NUMBER),
          op(VM.Opcodes.CONSTANT, 0),
          op(VM.Opcodes.CONSTANT, 1),
          op(VM.Opcodes.CONSTANT, 2),
          op(VM.Opcodes.ADD, 3),
          op(VM.Opcodes.ADD, 2),
        ]),
      ],
    };

    const rainJs = new RainJS(script, { signer });

    for (let i = 0; i < 100; i++) {
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
  });

  it('should perform subtraction operation correctly with block number over span of 100 blocks repeatition', async () => {
    const [signer] = await ethers.getSigners();

    const script: StateConfig = {
      constants: [500, 2, 3],
      sources: [
        concat([
          op(VM.Opcodes.CONSTANT, 0),
          op(VM.Opcodes.CONSTANT, 1),
          op(VM.Opcodes.CONSTANT, 2),
          op(VM.Opcodes.SUB, 3),
          op(VM.Opcodes.BLOCK_NUMBER),
          op(VM.Opcodes.SUB, 2),
        ]),
      ],
    };

    const rainJs = new RainJS(script, { signer });

    for (let i = 0; i < 100; i++) {
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
  });

  it('should perform multiplication operation correctly with block timestamp over span of 100 blocks repeatition', async () => {
    const [signer] = await ethers.getSigners();

    const script: StateConfig = {
      constants: [2],
      sources: [
        concat([
          op(VM.Opcodes.CONSTANT, 0),
          op(VM.Opcodes.BLOCK_TIMESTAMP),
          op(VM.Opcodes.MUL, 2),
        ]),
      ],
    };

    const rainJs = new RainJS(script, { signer });

    for (let i = 0; i < 100; i++) {
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
  });

  it('should perform division operation correctly with block timestamp over span of 100 blocks repeatition', async () => {
    const [signer] = await ethers.getSigners();

    const script: StateConfig = {
      constants: [2, 3],
      sources: [
        concat([
          op(VM.Opcodes.BLOCK_TIMESTAMP),
          op(VM.Opcodes.CONSTANT, 0),
          op(VM.Opcodes.CONSTANT, 1),
          op(VM.Opcodes.DIV, 3),
        ]),
      ],
    };

    const rainJs = new RainJS(script, { signer });

    for (let i = 0; i < 100; i++) {
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
  });

  it('should perform saturating add operation correctly', async () => {
    const script: StateConfig = {
      constants: [
        '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0',
        '0x4a3bc6def',
      ],
      sources: [
        concat([
          op(VM.Opcodes.CONSTANT, 0),
          op(VM.Opcodes.CONSTANT, 1),
          op(VM.Opcodes.SATURATING_ADD, 2),
        ]),
      ],
    };

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
  });

  it('should perform saturating mul operation correctly', async () => {
    const script: StateConfig = {
      constants: [
        '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0',
        '0x4a3bc6def',
      ],
      sources: [
        concat([
          op(VM.Opcodes.CONSTANT, 0),
          op(VM.Opcodes.CONSTANT, 1),
          op(VM.Opcodes.SATURATING_MUL, 2),
        ]),
      ],
    };

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
  });

  it('should perform saturating sub operation correctly', async () => {
    const script: StateConfig = {
      constants: ['0x22', '0x44'],
      sources: [
        concat([
          op(VM.Opcodes.CONSTANT, 0),
          op(VM.Opcodes.CONSTANT, 1),
          op(VM.Opcodes.SATURATING_SUB, 2),
        ]),
      ],
    };

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
  });

  it('should perform mod operation correctly', async () => {
    const script: StateConfig = {
      constants: ['90', '44'],
      sources: [
        concat([
          op(VM.Opcodes.CONSTANT, 0),
          op(VM.Opcodes.CONSTANT, 1),
          op(VM.Opcodes.MOD, 2),
        ]),
      ],
    };

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
  });

  it('should perform exponention operation correctly', async () => {
    const script: StateConfig = {
      constants: ['2', '5'],
      sources: [
        concat([
          op(VM.Opcodes.CONSTANT, 0),
          op(VM.Opcodes.CONSTANT, 1),
          op(VM.Opcodes.EXP, 2),
        ]),
      ],
    };

    const rainJs = new RainJS(script);

    const result = await rainJs.run();

    const expected = BigNumber.from('32');

    assert(
      expected.eq(result),
      `
      The exponention operation failed:
      expected ${expected}
      got ${result}`
    );
  });

  it('should perform scale18_mul operation correctly', async () => {
    const script: StateConfig = {
      constants: ['0x22', '0x44'],
      sources: [
        concat([
          op(VM.Opcodes.CONSTANT, 0),
          op(VM.Opcodes.CONSTANT, 1),
          op(VM.Opcodes.SCALE18_MUL, 5),
        ]),
      ],
    };

    const rainJs = new RainJS(script);
    const result = await rainJs.run();

    const expected = BigNumber.from('0x22').mul('10000000000000').mul('0x44');

    assert(
      expected.eq(result),
      `
      The scale18 mul operation failed:
      expected ${expected}
      got ${result}`
    );
  });

  it('should perform scale18_div operation correctly', async () => {
    const script: StateConfig = {
      constants: ['0x22', '0x44'],
      sources: [
        concat([
          op(VM.Opcodes.CONSTANT, 0),
          op(VM.Opcodes.CONSTANT, 1),
          op(VM.Opcodes.SCALE18_DIV, 10),
        ]),
      ],
    };

    const rainJs = new RainJS(script);
    const result = await rainJs.run();

    const expected = BigNumber.from('0x22').mul('100000000').div('0x44');

    assert(
      expected.eq(result),
      `
      The scale18 div operation failed:
      expected ${expected}
      got ${result}`
    );
  });

  it('should perform scale18 operation correctly', async () => {
    const script: StateConfig = {
      constants: ['220000000000000000012345'],
      sources: [
        concat([op(VM.Opcodes.CONSTANT, 0), op(VM.Opcodes.SCALE18, 22)]),
      ],
    };

    const rainJs = new RainJS(script);
    const result = await rainJs.run();

    const expected = BigNumber.from('22000000000000000001');

    assert(
      expected.eq(result),
      `
      The scale18 operation failed:
      expected ${expected}
      got ${result}`
    );
  });

  it('should perform scalen operation correctly', async () => {
    const script: StateConfig = {
      constants: ['44371183800000000001'],
      sources: [concat([op(VM.Opcodes.CONSTANT, 0), op(VM.Opcodes.SCALEN, 3)])],
    };

    const rainJs = new RainJS(script);
    const result = await rainJs.run();

    const expected = BigNumber.from('44371');

    assert(
      expected.eq(result),
      `
      The scalen operation failed:
      expected ${expected}
      got ${result}`
    );
  });

  it('should perform scale_by operation correctly', async () => {
    const script: StateConfig = {
      constants: ['44371183800127436851408839'],
      sources: [
        concat([op(VM.Opcodes.CONSTANT, 0), op(VM.Opcodes.SCALE_BY, 248)]),
      ],
    };

    const rainJs = new RainJS(script);
    const result = await rainJs.run();

    const expected = BigNumber.from('443711838001274368');

    assert(
      expected.eq(result),
      `
      The scale_by operation failed:
      expected ${expected}
      got ${result}`
    );
  });

  it('should give the minimum value among the values', async () => {
    const script: StateConfig = {
      constants: [10, 20, 30, 40, 50, 60],
      sources: [
        concat([
          op(VM.Opcodes.CONSTANT, 0),
          op(VM.Opcodes.CONSTANT, 1),
          op(VM.Opcodes.CONSTANT, 2),
          op(VM.Opcodes.CONSTANT, 3),
          op(VM.Opcodes.CONSTANT, 4),
          op(VM.Opcodes.MIN, 5),
        ]),
      ],
    };

    const rainJs = new RainJS(script);
    const result = await rainJs.run();

    const expected = BigNumber.from('10');

    assert(
      expected.eq(result),
      `
      The min operation failed:
      expected ${expected}
      got ${result}`
    );
  });

  it('should give the maximum value among the values', async () => {
    const script: StateConfig = {
      constants: [10, 20, 30, 40, 50, 60],
      sources: [
        concat([
          op(VM.Opcodes.CONSTANT, 0),
          op(VM.Opcodes.CONSTANT, 1),
          op(VM.Opcodes.CONSTANT, 2),
          op(VM.Opcodes.CONSTANT, 3),
          op(VM.Opcodes.CONSTANT, 4),
          op(VM.Opcodes.CONSTANT, 5),
          op(VM.Opcodes.MAX, 6),
        ]),
      ],
    };

    const rainJs = new RainJS(script);
    const result = await rainJs.run();

    const expected = BigNumber.from('60');

    assert(
      expected.eq(result),
      `
      The max operation failed:
      expected ${expected}
      got ${result}`
    );
  });

  it('eager_if and is_zero should work fine', async () => {
    const script: StateConfig = {
      constants: [10, 20, 30, 35],
      sources: [
        concat([
          op(VM.Opcodes.CONSTANT, 0),
          op(VM.Opcodes.CONSTANT, 1),
          op(VM.Opcodes.SATURATING_SUB, 2),
          op(VM.Opcodes.ISZERO),
          op(VM.Opcodes.CONSTANT, 2),
          op(VM.Opcodes.CONSTANT, 3),
          op(VM.Opcodes.EAGER_IF),
        ]),
      ],
    };

    const rainJs = new RainJS(script);
    const result = await rainJs.run();

    const expected = BigNumber.from('30');

    assert(
      expected.eq(result),
      `
      The eager_if operation failed:
      expected ${expected}
      got ${result}`
    );
  });

  it('eager_if and equal_to, less_than, greater_than, any and every should work fine', async () => {
    const script: StateConfig = {
      constants: [10, 20, ethers.constants.Zero, 30, 35],
      sources: [
        concat([
          op(VM.Opcodes.CONSTANT, 0),
          op(VM.Opcodes.CONSTANT, 1),
          op(VM.Opcodes.SATURATING_SUB, 2),
          op(VM.Opcodes.CONSTANT, 2),
          op(VM.Opcodes.EQUAL_TO),
          op(VM.Opcodes.CONSTANT, 3),
          op(VM.Opcodes.CONSTANT, 4),
          op(VM.Opcodes.ADD, 2),
          op(VM.Opcodes.CONSTANT, 3),
          op(VM.Opcodes.GREATER_THAN),
          op(VM.Opcodes.CONSTANT, 0),
          op(VM.Opcodes.CONSTANT, 1),
          op(VM.Opcodes.ADD, 2),
          op(VM.Opcodes.CONSTANT, 4),
          op(VM.Opcodes.LESS_THAN),
          op(VM.Opcodes.ANY, 2),
          op(VM.Opcodes.EVERY, 2),
          op(VM.Opcodes.CONSTANT, 3),
          op(VM.Opcodes.CONSTANT, 4),
          op(VM.Opcodes.EAGER_IF),
        ]),
      ],
    };

    const rainJs = new RainJS(script);
    const result = await rainJs.run();

    const expected = BigNumber.from('30');

    assert(
      expected.eq(result),
      `
      The operation failed:
      expected ${expected}
      got ${result}`
    );
  });

  it('should correctly perform the update_block_for_tier_range and sat_diff with 2 reports', async () => {
    const [signer] = await ethers.getSigners();

    const script: StateConfig = {
      constants: [50, ethers.constants.MaxUint256],
      sources: [
        concat([
          op(VM.Opcodes.CONSTANT, 1),
          op(VM.Opcodes.BLOCK_NUMBER),
          op(
            VM.Opcodes.UPDATE_TIMES_FOR_TIER_RANGE,
            tierRange(Tier.ZERO, Tier.EIGHT)
          ),
          op(VM.Opcodes.CONSTANT, 1),
          op(VM.Opcodes.CONSTANT, 0),
          op(
            VM.Opcodes.UPDATE_TIMES_FOR_TIER_RANGE,
            tierRange(Tier.ZERO, Tier.EIGHT)
          ),
          op(VM.Opcodes.SATURATING_DIFF),
        ]),
      ],
    };

    const rainJs = new RainJS(script, { signer });
    const result = await rainJs.run();

    const expected = BigNumber.from(
      '0x' + paddedUInt32((await Time.currentBlock()) - 50).repeat(8)
    );

    assert(
      expected.eq(result),
      `
      The operation failed:
      expected ${expected}
      got ${result}`
    );
  });

  it('should correctly perform the update_block_for_tier_range and select_lte with "any logic and min mode" with 2 reports', async () => {
    const [signer] = await ethers.getSigners();

    const script: StateConfig = {
      constants: [1000, 50, ethers.constants.MaxUint256],
      sources: [
        concat([
          op(VM.Opcodes.CONSTANT, 2),
          op(VM.Opcodes.CONSTANT, 0),
          op(
            VM.Opcodes.UPDATE_TIMES_FOR_TIER_RANGE,
            tierRange(Tier.TWO, Tier.FOUR)
          ),
          op(VM.Opcodes.CONSTANT, 2),
          op(VM.Opcodes.CONSTANT, 1),
          op(
            VM.Opcodes.UPDATE_TIMES_FOR_TIER_RANGE,
            tierRange(Tier.TWO, Tier.SIX)
          ),
          op(VM.Opcodes.BLOCK_NUMBER),
          op(
            VM.Opcodes.SELECT_LTE,
            selectLte(selectLteLogic.any, selectLteMode.min, 2)
          ),
        ]),
      ],
    };

    const rainJs = new RainJS(script, { signer });
    const result = await rainJs.run();

    const expected = BigNumber.from(
      '0x' +
        paddedUInt32('0xffffffff').repeat(2) +
        paddedUInt32(50).repeat(4) +
        paddedUInt32('0xffffffff').repeat(2)
    );

    assert(
      expected.eq(result),
      `
      The operation failed:
      expected ${expected}
      got ${result}`
    );
  });

  it('should panic when exponention goes beyond the max numeric range (max uint256)', async () => {
    const [signer] = await ethers.getSigners();

    const script: StateConfig = {
      constants: [ethers.constants.MaxUint256.div(3), 3],
      sources: [
        concat([
          op(VM.Opcodes.CONSTANT, 0),
          op(VM.Opcodes.CONSTANT, 1),
          op(VM.Opcodes.EXP, 2),
        ]),
      ],
    };
    const rainJs = new RainJS(script, { signer });

    await expectAsyncError(rainJs.run(), 'max numeric range overflow');
  });
});
