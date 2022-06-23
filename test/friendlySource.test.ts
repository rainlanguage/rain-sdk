import { expect } from 'chai';
import { ethers } from 'hardhat';

import {
  VM,
  HumanFriendlySource,
  utils,
  AllStandardOps,
  StateConfig,
  vLBP,
} from '../src';
import {
  eighteenZeros,
  sixZeros,
  max_uint256,
  Tier,
  blockNumbersToReport,
  getSigned8,
  Time,
} from './utils';

const {
  bytify,
  op,
  concat,
  arg,
  callSize,
  paddedUInt256,
  paddedUInt32,
  tierRange,
} = utils;

const Opcode = AllStandardOps;

describe('Human Friendly Source Generator', () => {
  it('should generate the human friendly from an exponentiation op source', async () => {
    const constants = [5, 2];

    const vFive = op(Opcode.VAL, 0);
    const vTwo = op(Opcode.VAL, 1);

    // prettier-ignore
    const source0 = VM.createVMSources([
        vFive,
        vTwo,
      [Opcode.EXP, 2]
    ]);

    const state: StateConfig = {
      sources: source0,
      constants,
      argumentsLength: 0,
      stackLength: 10,
    };

    const friendly0 = HumanFriendlySource.get(state);

    expect(friendly0).to.be.eq(`EXP(${constants[0]}, ${constants[1]})`);
  });

  it('should generate the human friendly from a multiplication op source', async () => {
    const constants = [4, 3];

    const vFour = op(Opcode.VAL, 0);
    const vThree = op(Opcode.VAL, 1);

    // prettier-ignore
    const source0 = VM.createVMSources([
        vFour,
        vThree,
      [Opcode.MUL, 2],
    ]);

    const state: StateConfig = {
      sources: source0,
      constants,
      argumentsLength: 0,
      stackLength: 10,
    };

    const friendly0 = HumanFriendlySource.get(state);

    expect(friendly0).to.be.eql(`MUL(${constants[0]}, ${constants[1]})`);
  });

  it('should generate the human friendly from a subtraction op source', async () => {
    const constants = [2, 1];

    const vTwo = op(Opcode.VAL, 0);
    const vOne = op(Opcode.VAL, 1);

    // prettier-ignore
    const source0 = VM.createVMSources([
        vTwo,
        vOne,
      [Opcode.SUB, 2]
    ]);

    const state: StateConfig = {
      sources: source0,
      constants,
      argumentsLength: 0,
      stackLength: 10,
    };

    const friendly0 = HumanFriendlySource.get(state);

    expect(friendly0).to.be.equal(`SUB(${constants[0]}, ${constants[1]})`);
  });

  it('should generate the human friendly from an addition op source', async () => {
    const constants = [6, 1];

    const vSix = op(Opcode.VAL, 0);
    const vOne = op(Opcode.VAL, 1);

    // prettier-ignore
    const source0 = VM.createVMSources([
        vSix,
        vOne,
      [Opcode.ADD, 2]
    ]);

    const state: StateConfig = {
      sources: source0,
      constants,
      argumentsLength: 0,
      stackLength: 10,
    };

    const friendly0 = HumanFriendlySource.get(state);

    expect(friendly0).to.be.equal(`ADD(${constants[0]}, ${constants[1]})`);
  });

  it('should generate the human friendly from the Scale18 decimals source', async () => {
    const constants: any = [];

    // prettier-ignore
    const sources = VM.createVMSources([
        [Opcode.SCALE18_DECIMALS]
      ])

    const state: StateConfig = {
      sources,
      constants,
      argumentsLength: 0,
      stackLength: 3,
    };

    const friendly0 = HumanFriendlySource.get(state);

    expect(friendly0).to.be.equal('SCALE18_DECIMALS()');
  });

  it('should generate the human friendly from the Scale18 ONE source', async () => {
    const constants: any = [];

    // prettier-ignore
    const sources = VM.createVMSources([
        op(Opcode.SCALE18_ONE)
      ])

    const state: StateConfig = {
      sources,
      constants,
      argumentsLength: 0,
      stackLength: 3,
    };

    const friendly0 = HumanFriendlySource.get(state);

    expect(friendly0).to.be.equal('SCALE18_ONE()');
  });

  it('should generate the human friendly from an arbitrary fixed point number DOWN by scale N', async () => {
    const value1 = ethers.BigNumber.from(1 + sixZeros);
    const n = 0xfc; // -4

    const constants = [value1];
    const v1 = op(Opcode.VAL, 0);

    // prettier-ignore
    const sources = VM.createVMSources([
        v1,
      op(Opcode.SCALE_BY, n)
    ]);

    const state: StateConfig = {
      sources,
      constants,
      argumentsLength: 0,
      stackLength: 3,
    };

    const friendly0 = HumanFriendlySource.get(state);

    expect(friendly0).to.be.equal(`SCALE_BY(${value1}, ${getSigned8(n)})`);
  });

  it('should generate the human friendly from an arbitrary fixed point number UP by scale N', async () => {
    const value1 = ethers.BigNumber.from(1 + sixZeros);
    const n = 0x04; // -4

    const constants = [value1];
    const v1 = op(Opcode.VAL, 0);

    // prettier-ignore
    const sources = VM.createVMSources([
        v1,
      op(Opcode.SCALE_BY, n)
    ]);

    const state: StateConfig = {
      sources,
      constants,
      argumentsLength: 0,
      stackLength: 3,
    };

    const friendly0 = HumanFriendlySource.get(state);

    expect(friendly0).to.be.equal(`SCALE_BY(${value1}, ${getSigned8(n)})`);
  });

  it('should generate the human friendly from scale an 18 OOMs number UP to scale N', async () => {
    const value1 = ethers.BigNumber.from(1 + eighteenZeros);
    const n = 20;

    const constants = [value1];
    const v1 = op(Opcode.VAL, 0);

    // prettier-ignore
    const sources = VM.createVMSources([
        v1,
      op(Opcode.SCALEN, n)
    ]);

    const state: StateConfig = {
      sources,
      constants,
      argumentsLength: 0,
      stackLength: 3,
    };

    const friendly0 = HumanFriendlySource.get(state);

    expect(friendly0).to.be.equal(`SCALEN(${value1}, ${getSigned8(n)})`);
  });

  it('should generate the human friendly from scale an 18 OOMs number DOWN to scale N', async () => {
    const value1 = ethers.BigNumber.from(1 + eighteenZeros);
    const n = 6;

    const constants = [value1];
    const v1 = op(Opcode.VAL, 0);

    // prettier-ignore
    const sources = VM.createVMSources([
        v1,
      op(Opcode.SCALEN, n)
    ]);

    const state: StateConfig = {
      sources,
      constants,
      argumentsLength: 0,
      stackLength: 3,
    };

    const friendly0 = HumanFriendlySource.get(state);

    expect(friendly0).to.be.equal(`SCALEN(${value1}, ${getSigned8(n)})`);
  });

  it('should generate the human friendly from scale a number by 18 OOM while dividing', async () => {
    const value1 = 50;
    const value2 = 3;

    const constants = [value1, value2];
    const v1 = op(Opcode.VAL, 0);
    const v2 = op(Opcode.VAL, 1);

    // prettier-ignore
    const sources = VM.createVMSources([
        v1,
        v2,
      op(Opcode.SCALE18_DIV)
    ]);

    const state: StateConfig = {
      sources,
      constants,
      argumentsLength: 0,
      stackLength: 3,
    };

    const friendly0 = HumanFriendlySource.get(state);

    expect(friendly0).to.be.equal(`SCALE18_DIV(${value1}*10**18, ${value2})`);
  });

  it('should generate the human friendly from scale a number by 18 OOM while multiplying', async () => {
    const value1 = 1;
    const value2 = 2;

    const constants = [value1, value2];
    const v1 = op(Opcode.VAL, 0);
    const v2 = op(Opcode.VAL, 1);

    // prettier-ignore
    const sources = VM.createVMSources([
        v1,
        v2,
      op(Opcode.SCALE18_MUL)
    ]);

    const state: StateConfig = {
      sources,
      constants,
      argumentsLength: 0,
      stackLength: 3,
    };

    const friendly0 = HumanFriendlySource.get(state);

    expect(friendly0).to.be.equal(`SCALE18_MUL(${value1}*10**18, ${value2})`);
  });

  it('should generate the human friendly from scale a number by 18 OOM in situ', async () => {
    const value = 1;

    const constants = [value];
    const v1 = op(Opcode.VAL, 0);

    // prettier-ignore
    const sources = VM.createVMSources([
        v1,
      op(Opcode.SCALE18)
    ]);

    const state: StateConfig = {
      sources,
      constants,
      argumentsLength: 0,
      stackLength: 3,
    };

    const friendly0 = HumanFriendlySource.get(state);

    expect(friendly0).to.be.equal(`SCALE18(${value})`);
  });

  it('should generate the human friendly from logic ops within a zipmap loop', async () => {
    const report = paddedUInt256(
      ethers.BigNumber.from(
        '0x' +
          paddedUInt32(1) +
          paddedUInt32(0) +
          paddedUInt32(3) +
          paddedUInt32(0) +
          paddedUInt32(5) +
          paddedUInt32(0) +
          paddedUInt32(7) +
          paddedUInt32(8)
      )
    );

    const reportMax = max_uint256;

    const constants = [report, reportMax];

    const vReport = op(Opcode.VAL, 0);
    const vReportMax = op(Opcode.VAL, 1);

    // BEGIN zipmap args

    const argReport = op(Opcode.VAL, arg(0));
    const argReportMax = op(Opcode.VAL, arg(1));

    // END zipmap args

    // prettier-ignore
    const ZIPMAP_FN = () =>
      concat([
            argReport,
          op(Opcode.ISZERO),
          argReportMax,
          argReport,
        op(Opcode.EAGER_IF),
      ]);

    // prettier-ignore
    const SOURCE = () =>
      concat([
          vReport,
          vReportMax,
        op(Opcode.ZIPMAP, callSize(1, 3, 1)),
      ]);

    const state: StateConfig = {
      // sources: [SOURCE()],
      sources: [SOURCE(), ZIPMAP_FN()],
      constants,
      argumentsLength: 2,
      stackLength: 32,
    };
    // 0x/00000001.00000000.00000003.00000000.00000005.00000000.00000007.00000008

    const friendly0 = HumanFriendlySource.get(state);

    expect(friendly0).to.eq(`ZIPMAP(
    ["00000001", "00000000", "00000003", "00000000", "00000005", "00000000", "00000007", "00000008"],
    ["FFFFFFFF", "FFFFFFFF", "FFFFFFFF", "FFFFFFFF", "FFFFFFFF", "FFFFFFFF", "FFFFFFFF", "FFFFFFFF"],
    EAGER_IF(ISZERO(^0), ^1, ^0)
)`);
  });

  it('should check whether any value in a list is non-zero', async () => {
    const constants = [0, 1, 2, 3];

    const v0 = op(Opcode.VAL, 0);
    const v1 = op(Opcode.VAL, 1);
    const v2 = op(Opcode.VAL, 2);
    const v3 = op(Opcode.VAL, 3);

    // prettier-ignore
    const source0 = VM.createVMSources([
      v1,
      v2,
      v3,
      op(Opcode.ANY, 3),
    ]);

    const state0: StateConfig = {
      sources: source0,
      constants,
      argumentsLength: 0,
      stackLength: 3,
    };

    const friendly0 = HumanFriendlySource.get(state0);
    expect(friendly0).to.be.equals(`ANY(1, 2, 3)`);

    // prettier-ignore
    const source1 = concat([
      v0,
      v0,
      op(Opcode.ANY, 2),
    ]);

    const state1: StateConfig = {
      sources: [source1],
      constants,
      argumentsLength: 0,
      stackLength: 3,
    };

    const friendly1 = HumanFriendlySource.get(state1);
    expect(friendly1).to.be.equals(`ANY(0, 0)`);

    // prettier-ignore
    const source2 = concat([
      v0,
      v0,
      v3,
      op(Opcode.ANY, 3),
    ]);

    const state2: StateConfig = {
      sources: [source2],
      constants,
      argumentsLength: 0,
      stackLength: 3,
    };

    const friendly2 = HumanFriendlySource.get(state2);
    expect(friendly2).to.be.equals(`ANY(0, 0, 3)`);
  });

  it('should check whether every value in a list is non-zero', async () => {
    const constants = [0, 1, 2, 3];

    const v0 = op(Opcode.VAL, 0);
    const v1 = op(Opcode.VAL, 1);
    const v2 = op(Opcode.VAL, 2);
    const v3 = op(Opcode.VAL, 3);

    // prettier-ignore
    const source0 = concat([
      v1,
      v2,
      v3,
      op(Opcode.EVERY, 3),
    ]);

    const state0: StateConfig = {
      sources: [source0],
      constants,
      argumentsLength: 0,
      stackLength: 3,
    };

    const friendly0 = HumanFriendlySource.get(state0);
    expect(friendly0).to.be.equals(`EVERY(1, 2, 3)`);

    // prettier-ignore
    const source1 = concat([
      v0,
      v1,
      v2,
      op(Opcode.EVERY, 3),
    ]);

    const state1: StateConfig = {
      sources: [source1],
      constants,
      argumentsLength: 0,
      stackLength: 3,
    };

    const friendly1 = HumanFriendlySource.get(state1);
    expect(friendly1).to.be.equals(`EVERY(0, 1, 2)`);

    // prettier-ignore
    const source2 = concat([
      v0,
      v3,
      op(Opcode.EVERY, 2),
    ]);

    const state2: StateConfig = {
      sources: [source2],
      constants,
      argumentsLength: 0,
      stackLength: 3,
    };

    const friendly2 = HumanFriendlySource.get(state2);
    expect(friendly2).to.be.equals(`EVERY(0, 3)`);
  });

  it("should perform ternary 'eager if' operation on 3 values on the stack", async () => {
    const constants = [0, 1, 2, 3];

    const v0 = op(Opcode.VAL, 0);
    const v1 = op(Opcode.VAL, 1);
    const v2 = op(Opcode.VAL, 2);
    const v3 = op(Opcode.VAL, 3);

    // prettier-ignore
    const source0 = concat([
      // 1 ? 2 : 3
      v1,
      v2,
      v3,
      op(Opcode.EAGER_IF),
    ]);

    const state0: StateConfig = {
      sources: [source0],
      constants,
      argumentsLength: 0,
      stackLength: 3,
    };

    const friendly0 = HumanFriendlySource.get(state0);
    expect(friendly0).to.be.equals(`EAGER_IF(1, 2, 3)`);

    // prettier-ignore
    const source1 = concat([
      // 2 ? 2 : 3
      v2,
      v2,
      v3,
      op(Opcode.EAGER_IF),
    ]);

    const state1: StateConfig = {
      sources: [source1],
      constants,
      argumentsLength: 0,
      stackLength: 3,
    };

    const friendly1 = HumanFriendlySource.get(state1);
    expect(friendly1).to.be.equals(`EAGER_IF(2, 2, 3)`);

    // prettier-ignore
    const source2 = concat([
      // 2 ? 2 : 3
      v0,
      v2,
      v3,
      op(Opcode.EAGER_IF),
    ]);

    const state2: StateConfig = {
      sources: [source2],
      constants,
      argumentsLength: 0,
      stackLength: 3,
    };

    const friendly2 = HumanFriendlySource.get(state2);
    expect(friendly2).to.be.equals(`EAGER_IF(0, 2, 3)`);
  });

  it('should check that value is greater than another value', async () => {
    const constants = [1, 2];

    // prettier-ignore
    const source0 = VM.createVMSources([
      op(Opcode.VAL, 1), // 2
      op(Opcode.VAL, 0), // 1
      op(Opcode.GREATER_THAN),
    ]);

    const state0: StateConfig = {
      sources: source0,
      constants,
      argumentsLength: 0,
      stackLength: 3,
    };

    const friendly0 = HumanFriendlySource.get(state0);
    expect(friendly0).to.be.equals(`GREATER_THAN(2, 1)`);

    // prettier-ignore
    const source1 = VM.createVMSources([
      op(Opcode.VAL, 0), // 1
      op(Opcode.VAL, 1), // 2
      op(Opcode.GREATER_THAN),
    ]);

    const state1: StateConfig = {
      sources: source1,
      constants,
      argumentsLength: 0,
      stackLength: 3,
    };

    const friendly1 = HumanFriendlySource.get(state1);
    expect(friendly1).to.be.equals(`GREATER_THAN(1, 2)`);
  });

  it('should check that value is less than another value', async () => {
    const constants = [1, 2];

    // prettier-ignore
    const source0 = VM.createVMSources([
      op(Opcode.VAL, 1), // 2
      op(Opcode.VAL, 0), // 1
      op(Opcode.LESS_THAN),
    ]);

    const state0: StateConfig = {
      sources: source0,
      constants,
      argumentsLength: 0,
      stackLength: 3,
    };
    const friendly0 = HumanFriendlySource.get(state0);
    expect(friendly0).to.be.equals(`LESS_THAN(2, 1)`);

    // prettier-ignore
    const source1 = VM.createVMSources([
      op(Opcode.VAL, 0), // 1
      op(Opcode.VAL, 1), // 2
      op(Opcode.LESS_THAN),
    ]);

    const state1: StateConfig = {
      sources: source1,
      constants,
      argumentsLength: 0,
      stackLength: 3,
    };
    const friendly1 = HumanFriendlySource.get(state1);
    expect(friendly1).to.be.equals(`LESS_THAN(1, 2)`);
  });

  it('should check that values are equal to each other', async () => {
    const constants = [1, 2];

    // prettier-ignore
    const source0 =  VM.createVMSources([
      op(Opcode.VAL, 1), // 2
      op(Opcode.VAL, 1), // 2
      op(Opcode.EQUAL_TO),
    ]);

    const state0: StateConfig = {
      sources: source0,
      constants,
      argumentsLength: 0,
      stackLength: 3,
    };
    const friendly0 = HumanFriendlySource.get(state0);
    expect(friendly0).to.be.equals(`EQUAL_TO(2, 2)`);

    // prettier-ignore
    const source1 =  VM.createVMSources([
      op(Opcode.VAL, 0), // 1
      op(Opcode.VAL, 1), // 2
      op(Opcode.EQUAL_TO),
    ]);

    const state1: StateConfig = {
      sources: source1,
      constants,
      argumentsLength: 0,
      stackLength: 3,
    };
    const friendly1 = HumanFriendlySource.get(state1);
    expect(friendly1).to.be.equals(`EQUAL_TO(1, 2)`);
  });

  it('should check that a value is zero', async () => {
    const constants = [0, 1];

    // prettier-ignore
    const source0 = VM.createVMSources([
      op(Opcode.VAL, 0),
      op(Opcode.ISZERO),
    ]);

    const state0: StateConfig = {
      sources: source0,
      constants,
      argumentsLength: 0,
      stackLength: 3,
    };
    const friendly0 = HumanFriendlySource.get(state0);
    expect(friendly0).to.be.equals(`ISZERO(0)`);

    // prettier-ignore
    const source1 =  VM.createVMSources([
      op(Opcode.VAL, 1),
      op(Opcode.ISZERO),
    ]);

    const state1: StateConfig = {
      sources: source1,
      constants,
      argumentsLength: 0,
      stackLength: 3,
    };
    const friendly1 = HumanFriendlySource.get(state1);
    expect(friendly1).to.be.equals(`ISZERO(1)`);
  });

  it('should support source scripts with leading zeroes', async () => {
    const block0 = await ethers.provider.getBlockNumber();
    const constants = [block0];

    // prettier-ignore
    const source0 = VM.createVMSources([
      // 0 0 0 0 0 0 0 0 0 0 (block0 BLOCK_NUMBER min)
      new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
        [Opcode.VAL, 0],
        [Opcode.BLOCK_NUMBER],
      [Opcode.MIN, 2],
    ]);

    const state: StateConfig = {
      sources: source0,
      constants,
      argumentsLength: 0,
      stackLength: 10,
    };
    const friendly0 = HumanFriendlySource.get(state);

    expect(friendly0).to.eq(`MIN(${block0}, BLOCK_NUMBER())`);
  });

  it('should support source scripts with trailing zeroes', async () => {
    const block0 = await ethers.provider.getBlockNumber();
    const constants = [block0];

    // prettier-ignore
    const source0 = VM.createVMSources([
      // (block0 BLOCK_NUMBER min) 0 0 0 0 0 0 0 0 0 0
        [Opcode.VAL, 0],
        [Opcode.BLOCK_NUMBER],
      [Opcode.MIN, 2],
      new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
    ]);

    const state: StateConfig = {
      sources: source0,
      constants,
      argumentsLength: 0,
      stackLength: 10,
    };
    const friendly0 = HumanFriendlySource.get(state);

    expect(friendly0).to.eq(`MIN(${block0}, BLOCK_NUMBER())`);
  });

  it('should return block.number and block.timestamp', () => {
    const constants: number[] = [];

    const source0 = VM.createVMSources([
      // (BLOCK_NUMBER)
      [Opcode.BLOCK_NUMBER],
    ]);

    const state0: StateConfig = {
      sources: source0,
      constants,
      argumentsLength: 0,
      stackLength: 10,
    };
    const friendly0 = HumanFriendlySource.get(state0);

    expect(friendly0).to.eq('BLOCK_NUMBER()');

    const source1 = VM.createVMSources([
      // (BLOCK_TIMESTAMP)
      [Opcode.BLOCK_TIMESTAMP],
    ]);

    const state1: StateConfig = {
      sources: source1,
      constants,
      argumentsLength: 0,
      stackLength: 10,
    };
    const friendly1 = HumanFriendlySource.get(state1);

    expect(friendly1).to.eq('BLOCK_TIMESTAMP()');
  });

  it('should return correct remainder when using modulo op on sequence of numbers', () => {
    const constants = [7, 4, 2];
    const v7 = op(Opcode.VAL, 0);
    const v4 = op(Opcode.VAL, 1);
    const v2 = op(Opcode.VAL, 2);

    // prettier-ignore
    const sources = VM.createVMSources([
      // (7 4 2 %)
        v7,
        v4, // -> r3
        v2, // -> r1
      op(Opcode.MOD, 3),
    ]);

    const state: StateConfig = {
      sources: sources,
      constants,
      argumentsLength: 0,
      stackLength: 10,
    };
    const friendly = HumanFriendlySource.get(state);

    expect(friendly).to.eq('MOD(7, 4, 2)');
  });

  it('should perform exponentiation on a sequence of numbers', () => {
    const constants = [2, 4, 3];
    const v2 = op(Opcode.VAL, 0);
    const v4 = op(Opcode.VAL, 1);
    const v3 = op(Opcode.VAL, 2);

    // prettier-ignore
    const sources = VM.createVMSources([
      // (2 4 3 ^)
        v2,
        v4,
        v3,
      [Opcode.EXP, 3],
    ]);
    const state: StateConfig = {
      sources: sources,
      constants,
      argumentsLength: 0,
      stackLength: 10,
    };
    const friendly = HumanFriendlySource.get(state);

    expect(friendly).to.eq('EXP(2, 4, 3)');
  });

  it('should return the maximum of a sequence of numbers', () => {
    const constants = [33, 11, 22];
    const v33 = op(Opcode.VAL, 0);
    const v11 = op(Opcode.VAL, 1);
    const v22 = op(Opcode.VAL, 2);

    // prettier-ignore
    const source = VM.createVMSources([
      // (22 11 33 max)
        v22,
        v11,
        v33,
      [Opcode.MAX, 3],
    ]);

    const state: StateConfig = {
      sources: source,
      constants,
      argumentsLength: 0,
      stackLength: 10,
    };
    const friendly = HumanFriendlySource.get(state);

    expect(friendly).to.eq('MAX(22, 11, 33)');
  });

  it('should return the minimum of a sequence of numbers', () => {
    const constants = [33, 11, 22];
    const v33 = op(Opcode.VAL, 0);
    const v11 = op(Opcode.VAL, 1);
    const v22 = op(Opcode.VAL, 2);

    // prettier-ignore
    const source = VM.createVMSources([
      // (22 11 33 min)
        v22,
        v11,
        v33,
      [Opcode.MIN, 3],
    ]);

    const state: StateConfig = {
      sources: source,
      constants,
      argumentsLength: 0,
      stackLength: 10,
    };
    const friendly = HumanFriendlySource.get(state);

    expect(friendly).to.eq('MIN(22, 11, 33)');
  });

  it('should run a basic program (return current block number)', () => {
    const constants: Array<number> = [];

    // prettier-ignore
    const source = VM.createVMSources([
      [Opcode.BLOCK_NUMBER]
    ]);

    const state: StateConfig = {
      sources: source,
      constants,
      argumentsLength: 0,
      stackLength: 10,
    };
    const friendly = HumanFriendlySource.get(state);

    expect(friendly).to.eq('BLOCK_NUMBER()');
  });

  it('should handle a zipmap which loops 4 times', () => {
    // The following 3 variables use zero-based counting.

    // Which index in `sources` array to use as our inner function to ZIPMAP.
    const sourceIndex = 1;

    // Number of times to 'break up' our uint256 constants into a concatenated array of 'sub-constants'.
    // In this case, we subdivide a constant 4 times, so we are left with 8 uint32 'sub-constants' concatenated together.
    const loopSize = 3;

    // Number of constants to zip together. Here we are zipping 2 constants together. Hence, our inner function will
    // accept 2 arguments at a time (arg0, arg1), which will be the sub-constants of the respective constants.
    const valSize = 1;

    // Size of each 'sub-constant' in bytes, which can be determined by how many times we broke up our uint256. In this case we have 32-bit unsigned integers.
    const valBytes = 32 / Math.pow(2, loopSize);

    // prettier-ignore
    const constants = [ // a.k.a. 'vals'
      concat([ // constant0 -> an array of sub-constants
        bytify(1, valBytes),
        bytify(2, valBytes),
        bytify(3, valBytes),
        bytify(4, valBytes),
        bytify(5, valBytes),
        bytify(6, valBytes),
        bytify(7, valBytes),
        bytify(8, valBytes),
      ]),
      concat([ // constant1 -> an array of sub-constants
        bytify(10, valBytes),
        bytify(20, valBytes),
        bytify(30, valBytes),
        bytify(40, valBytes),
        bytify(50, valBytes),
        bytify(60, valBytes),
        bytify(70, valBytes),
        bytify(80, valBytes),
      ]),
    ];

    // prettier-ignore
    const sources = [
      VM.createVMSources([
        // sourceIndex === 0 (main source)
        [Opcode.VAL, 0], // val0
        [Opcode.VAL, 1], // val1
        [Opcode.ZIPMAP, callSize(sourceIndex, loopSize, valSize)],
      ])[0],
      VM.createVMSources([
        // sourceIndex === 1 (inner ZIPMAP function)
        // (arg0 arg1 mul) (arg0 arg1 add)
        [Opcode.VAL, arg(0)],
        [Opcode.VAL, arg(1)],
        [Opcode.MUL, 2],
        [Opcode.VAL, arg(0)],
        [Opcode.VAL, arg(1)],
        [Opcode.ADD, 2],
      ])[0],
    ];

    const state: StateConfig = {
      sources: sources,
      constants,
      argumentsLength: 0,
      stackLength: 10,
    };
    const friendly = HumanFriendlySource.get(state);

    expect(friendly).to.eq(`ZIPMAP(
    [1, 2, 3, 4, 5, 6, 7, 8],
    [10, 20, 30, 40, 50, 60, 70, 80],
    MUL(^0, ^1) ADD(^0, ^1)
)`);
  });

  it('should handle a zipmap which loops twice', () => {
    // zero-based counting
    const sourceIndex = 1;
    const loopSize = 1;
    const valSize = 2;

    const valBytes = 32 / Math.pow(2, loopSize); // 128-bit unsigned

    const constants = [
      concat([bytify(3, valBytes), bytify(1, valBytes)]),
      concat([bytify(4, valBytes), bytify(2, valBytes)]),
      concat([bytify(5, valBytes), bytify(3, valBytes)]),
    ];

    const sources = [
      VM.createVMSources([
        op(Opcode.VAL, 2), // val0
        op(Opcode.VAL, 1), // val1
        op(Opcode.VAL, 0), // val2
        op(Opcode.ZIPMAP, callSize(sourceIndex, loopSize, valSize)),
      ])[0],
      VM.createVMSources([
        // (arg0 arg1 arg2 mul) (arg0 arg1 arg2 add)
        op(Opcode.VAL, arg(0)),
        op(Opcode.VAL, arg(1)),
        op(Opcode.VAL, arg(2)),
        op(Opcode.MUL, 3),
        op(Opcode.VAL, arg(0)),
        op(Opcode.VAL, arg(1)),
        op(Opcode.VAL, arg(2)),
        op(Opcode.ADD, 3),
      ])[0],
    ];

    const state: StateConfig = {
      sources: sources,
      constants,
      argumentsLength: 0,
      stackLength: 10,
    };
    const friendly = HumanFriendlySource.get(state);

    expect(friendly).to.eq(`ZIPMAP(
    [5, 3],
    [4, 2],
    [3, 1],
    MUL(^0, ^1, ^2) ADD(^0, ^1, ^2)
)`);
  });

  it('should handle a zipmap op with maxed sourceIndex and valSize', () => {
    const constants = [10, 20, 30, 40, 50, 60, 70, 80];

    const a0 = op(Opcode.VAL, arg(0));
    const a1 = op(Opcode.VAL, arg(1));
    const a2 = op(Opcode.VAL, arg(2));
    const a3 = op(Opcode.VAL, arg(3));
    const a4 = op(Opcode.VAL, arg(4));
    const a5 = op(Opcode.VAL, arg(5));
    const a6 = op(Opcode.VAL, arg(6));
    const a7 = op(Opcode.VAL, arg(7));

    // zero-based counting
    const sourceIndex = 1;
    const loopSize = 0; // no subdivision of uint256, normal constants
    const valSize = 7;

    const sources = [
      VM.createVMSources([
        op(Opcode.VAL, 0), // val0
        op(Opcode.VAL, 1), // val1
        op(Opcode.VAL, 2), // val2
        op(Opcode.VAL, 3), // val3
        op(Opcode.VAL, 4), // val4
        op(Opcode.VAL, 5), // val5
        op(Opcode.VAL, 6), // val6
        op(Opcode.VAL, 7), // val7
        op(Opcode.ZIPMAP, callSize(sourceIndex, loopSize, valSize)),
      ])[0],
      VM.createVMSources([
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
        op(Opcode.ADD, 32), // max no. items
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
        op(Opcode.ADD, 30),
      ])[0],
    ];
    const state: StateConfig = {
      sources: sources,
      constants,
      argumentsLength: 0,
      stackLength: 10,
    };
    const friendly = HumanFriendlySource.get(state);

    expect(friendly).to.eq(`ZIPMAP(
    10,
    20,
    30,
    40,
    50,
    60,
    70,
    80,
    ADD(^0, ^1, ^2, ^3, ^4, ^5, ^6, ^7, ^0, ^1, ^2, ^3, ^4, ^5, ^6, ^7, ^0, ^1, ^2, ^3, ^4, ^5, ^6, ^7, ^0, ^1, ^2, ^3, ^4, ^5, ^6, ^7) ADD(^0, ^1, ^2, ^3, ^4, ^5, ^6, ^7, ^0, ^1, ^2, ^3, ^4, ^5, ^6, ^7, ^0, ^1, ^2, ^3, ^4, ^5, ^6, ^7, ^0, ^1, ^2, ^3, ^4, ^5)
)`);
  });

  it('should handle a zipmap op which runs multiple functions (across multiple fn vals)', () => {
    const constants = [1, 2, 3];
    const v0 = op(Opcode.VAL, 0);
    const v1 = op(Opcode.VAL, 1);
    const v2 = op(Opcode.VAL, 2);

    const a0 = op(Opcode.VAL, arg(0));
    const a1 = op(Opcode.VAL, arg(1));
    const a2 = op(Opcode.VAL, arg(2));

    // zero-based counting
    const sourceIndex = 1;
    const loopSize = 0;
    const valSize = 2;

    const sources = [
      VM.createVMSources([
        v0,
        v1,
        v2,
        op(Opcode.ZIPMAP, callSize(sourceIndex, loopSize, valSize)),
      ])[0],
      VM.createVMSources([
        // (arg0 arg1 arg2 mul) (arg1 arg2 arg0 arg1 arg2 ... add)
        a0,
        a1,
        a2,
        op(Opcode.MUL, 3),
        a1,
        a2,
        a0,
        a1,
        a2,
        a0,
        a1,
        a2,
        a0,
        a1,
        a2,
        a0,
        a1,
        a2,
        op(Opcode.ADD, 14),
      ])[0],
    ];

    const state: StateConfig = {
      sources: sources,
      constants,
      argumentsLength: 0,
      stackLength: 10,
    };
    const friendly = HumanFriendlySource.get(state);

    expect(friendly).to.eq(`ZIPMAP(
    1,
    2,
    3,
    MUL(^0, ^1, ^2) ADD(^1, ^2, ^0, ^1, ^2, ^0, ^1, ^2, ^0, ^1, ^2, ^0, ^1, ^2)
)`);
  });

  it('should handle a zipmap op which runs multiple functions (using single inner zipmap function source)', () => {
    const constants = [3, 4, 5];
    const v3 = op(Opcode.VAL, 0);
    const v4 = op(Opcode.VAL, 1);
    const v5 = op(Opcode.VAL, 2);

    const a0 = op(Opcode.VAL, arg(0));
    const a1 = op(Opcode.VAL, arg(1));
    const a2 = op(Opcode.VAL, arg(2));

    // zero-based counting
    const sourceIndex = 1;
    const loopSize = 0;
    const valSize = 2;

    const sources = [
      concat([
        v3,
        v4,
        v5,
        op(Opcode.ZIPMAP, callSize(sourceIndex, loopSize, valSize)),
      ]),
      concat([
        // inner zipmap function source
        // (arg0 arg1 arg2 mul) (arg0 arg1 ar2 add)
        a0,
        a1,
        a2,
        op(Opcode.MUL, 3),
        a0,
        a1,
        a2,
        op(Opcode.ADD, 3),
      ]),
    ];

    const state: StateConfig = {
      sources: sources,
      constants,
      argumentsLength: 0,
      stackLength: 10,
    };
    const friendly = HumanFriendlySource.get(state);

    expect(friendly).to.eq(`ZIPMAP(
    3,
    4,
    5,
    MUL(^0, ^1, ^2) ADD(^0, ^1, ^2)
)`);
  });

  it('should handle a simple call op', () => {
    const constants = [1, 2, 3];
    const v1 = op(Opcode.VAL, 0);
    const v2 = op(Opcode.VAL, 1);
    const v3 = op(Opcode.VAL, 2);

    const a0 = op(Opcode.VAL, arg(0));
    const a1 = op(Opcode.VAL, arg(1));
    const a2 = op(Opcode.VAL, arg(2));

    // zero-based counting
    const sourceIndex = 1; // 1
    const loopSize = 0; // 1
    const valSize = 2; // 3

    const sources = [
      concat([
        v1,
        v2,
        v3,
        op(Opcode.ZIPMAP, callSize(sourceIndex, loopSize, valSize)),
      ]),
      concat([
        // (arg0 arg1 arg2 add)
        a0,
        a1,
        a2,
        op(Opcode.ADD, 3),
      ]),
    ];

    const state: StateConfig = {
      sources: sources,
      constants,
      argumentsLength: 0,
      stackLength: 10,
    };
    const friendly = HumanFriendlySource.get(state);

    expect(friendly).to.eq(`ZIPMAP(
    1,
    2,
    3,
    ADD(^0, ^1, ^2)
)`);
  });

  it('should perform a calculation using the block number as a value', () => {
    const constants = [1, 2, 3, 4, 6];

    const one = op(Opcode.VAL, 0);
    const two = op(Opcode.VAL, 1);
    const three = op(Opcode.VAL, 2);
    const four = op(Opcode.VAL, 3);
    const six = op(Opcode.VAL, 4);

    const sources = [
      concat([
        // (BLOCK_NUMBER (6 3 /) (3 4 (2 1 -) +) *)
        op(Opcode.BLOCK_NUMBER),
        six,
        three,
        op(Opcode.DIV, 2),
        three,
        four,
        two,
        one,
        op(Opcode.SUB, 2),
        op(Opcode.ADD, 3),
        op(Opcode.MUL, 3),
      ]),
    ];

    const state: StateConfig = {
      sources: sources,
      constants,
      argumentsLength: 0,
      stackLength: 10,
    };
    const friendly = HumanFriendlySource.get(state);

    expect(friendly).to.eq(
      'MUL(BLOCK_NUMBER(), DIV(6, 3), ADD(3, 4, SUB(2, 1)))'
    );
  });

  it('should calculate a mathematical expression (division, product, summation)', () => {
    const constants = [2, 3];
    const v2 = op(Opcode.VAL, 0);
    const v3 = op(Opcode.VAL, 1);

    const sources = [
      concat([
        // (((2 2 2 +) 3 *) 2 3 /)
        v2,
        v2,
        v2,
        op(Opcode.ADD, 3),
        v3,
        op(Opcode.MUL, 2),
        v2,
        v3,
        op(Opcode.DIV, 3),
      ]),
    ];

    const state: StateConfig = {
      sources: sources,
      constants,
      argumentsLength: 0,
      stackLength: 10,
    };
    const friendly = HumanFriendlySource.get(state);

    expect(friendly).to.eq('DIV(MUL(ADD(2, 2, 2), 3), 2, 3)');
  });

  it('should return remainder of dividing an initial number by the product of a sequence of numbers', () => {
    const constants = [3, 2, 13];
    const v3 = op(Opcode.VAL, 0);
    const v2 = op(Opcode.VAL, 1);
    const v13 = op(Opcode.VAL, 2);

    const sources = [
      concat([
        // (13 2 3 %)
        v13,
        v2,
        v3,
        op(Opcode.MOD, 3),
      ]),
    ];

    const state: StateConfig = {
      sources: sources,
      constants,
      argumentsLength: 0,
      stackLength: 10,
    };
    const friendly = HumanFriendlySource.get(state);

    expect(friendly).to.eq('MOD(13, 2, 3)');
  });

  it('should divide an initial number by the product of a sequence of numbers', () => {
    const constants = [3, 2, 12];
    const v3 = op(Opcode.VAL, 0);
    const v2 = op(Opcode.VAL, 1);
    const v12 = op(Opcode.VAL, 2);

    const sources = [
      concat([
        // (12 2 3 /)
        v12,
        v2,
        v3,
        op(Opcode.DIV, 3),
      ]),
    ];

    const state: StateConfig = {
      sources: sources,
      constants,
      argumentsLength: 0,
      stackLength: 10,
    };
    const friendly = HumanFriendlySource.get(state);

    expect(friendly).to.eq('DIV(12, 2, 3)');
  });

  it('should multiply a sequence of numbers together', () => {
    const constants = [5, 4, 3];
    const v5 = op(Opcode.VAL, 0);
    const v4 = op(Opcode.VAL, 1);
    const v3 = op(Opcode.VAL, 2);

    const sources = [
      concat([
        // (3 4 5 *)
        v3,
        v4,
        v5,
        op(Opcode.MUL, 3),
      ]),
    ];

    const state: StateConfig = {
      sources: sources,
      constants,
      argumentsLength: 0,
      stackLength: 10,
    };
    const friendly = HumanFriendlySource.get(state);

    expect(friendly).to.eq('MUL(3, 4, 5)');
  });

  it('should subtract a sequence of numbers from an initial number', () => {
    const constants = [3, 2, 10];
    const v3 = op(Opcode.VAL, 0);
    const v2 = op(Opcode.VAL, 1);
    const v10 = op(Opcode.VAL, 2);

    const sources = [
      concat([
        // (10 2 3 -)
        v10,
        v2,
        v3,
        op(Opcode.SUB, 3),
      ]),
    ];

    const state: StateConfig = {
      sources: sources,
      constants,
      argumentsLength: 0,
      stackLength: 10,
    };
    const friendly = HumanFriendlySource.get(state);

    expect(friendly).to.eq('SUB(10, 2, 3)');
  });

  it('should add a sequence of numbers together', () => {
    const constants = [3, 2, 1];
    const v3 = op(Opcode.VAL, 0);
    const v2 = op(Opcode.VAL, 1);
    const v1 = op(Opcode.VAL, 2);

    const sources = [
      concat([
        // (1 2 3 +)
        v1,
        v2,
        v3,
        op(Opcode.ADD, 3),
      ]),
    ];

    const state: StateConfig = {
      sources: sources,
      constants,
      argumentsLength: 0,
      stackLength: 10,
    };
    const friendly = HumanFriendlySource.get(state);

    expect(friendly).to.eq('ADD(1, 2, 3)');
  });

  it('should enforce maxTier for update tier range operation', async () => {
    const block = await ethers.provider.getBlockNumber();

    const constants0 = [block];

    const vBlock = op(Opcode.VAL, 0);

    // prettier-ignore
    const source0 = VM.createVMSources([
        op(Opcode.NEVER),
        vBlock,
      op(
        Opcode.UPDATE_BLOCKS_FOR_TIER_RANGE,
        tierRange(Tier.ZERO, Tier.SEVEN) // beyond max tier of Tier.EIGHT
      ),
    ]);

    const state: StateConfig = {
      sources: source0,
      constants: constants0,
      argumentsLength: 0,
      stackLength: 10,
    };
    const friendly = HumanFriendlySource.get(state);

    expect(friendly).to.eq(
      `UPDATE_BLOCKS_FOR_TIER_RANGE(NEVER(), (${Tier.ZERO}, ${Tier.SEVEN}), ${block})`
    );
  });

  it('should use saturating sub for diff where only some tiers would underflow', async () => {
    const constants0 = [
      //         0x01000000020000000300000004000000050000000600000007
      blockNumbersToReport([0, 1, 2, 3, 4, 5, 6, 7].reverse()),
      // 0x0200000000000000040000000000000006000000000000000800000000
      blockNumbersToReport([2, 0, 4, 0, 6, 0, 8, 0].reverse()),
    ];

    const vReport0 = op(Opcode.VAL, 0);
    const vReport1 = op(Opcode.VAL, 1);

    // prettier-ignore
    const source0 = VM.createVMSources([
        vReport0,
        vReport1,
      op(Opcode.SATURATING_DIFF),
    ]);

    const state: StateConfig = {
      sources: source0,
      constants: constants0,
      argumentsLength: 0,
      stackLength: 10,
    };
    const friendly = HumanFriendlySource.get(state);

    expect(friendly).to.be.equal(
      `SATURATING_DIFF(${constants0[0]}, ${constants0[1]})`
    );
  });

  it('should return ERC1155 batch balance result for multiple signers', async () => {
    const [signer1, signer2] = await ethers.getSigners();
    const tokenERC1155Factory = await ethers.getContractFactory('ReserveNFT');
    const tokenERC1155 = await tokenERC1155Factory.deploy();

    const tokenId = 0;
    const length = 2;

    const constants = [
      signer1.address,
      signer2.address,
      tokenERC1155.address,
      tokenId,
    ];
    const vSigner1 = op(Opcode.VAL, 0);
    const vSigner2 = op(Opcode.VAL, 1);
    const vTokenAddr = op(Opcode.VAL, 2);
    const vTokenId = op(Opcode.VAL, 3);

    // prettier-ignore
    const sources = VM.createVMSources([
        vTokenAddr,
        vSigner1,
        vSigner2,
        vTokenId,
        vTokenId,
      op(Opcode.IERC1155_BALANCE_OF_BATCH, length - 1)
    ]);

    const state: StateConfig = {
      sources,
      constants,
      argumentsLength: 0,
      stackLength: 5,
    };
    const friendly = HumanFriendlySource.get(state);

    expect(friendly).to.be.equal(
      `IERC1155_BALANCE_OF_BATCH(${tokenERC1155.address}, ${signer1.address}, ${signer2.address}, ${tokenId}, ${tokenId})`
    );
  });

  it('should return ERC1155 balance of signer', async () => {
    const [signer1] = await ethers.getSigners();
    const tokenERC1155Factory = await ethers.getContractFactory('ReserveNFT');
    const tokenERC1155 = await tokenERC1155Factory.deploy();

    const tokenId = 0;

    const constants = [signer1.address, tokenERC1155.address, tokenId];
    const vSigner1 = op(Opcode.VAL, 0);
    const vTokenAddr = op(Opcode.VAL, 1);
    const vTokenId = op(Opcode.VAL, 2);

    // prettier-ignore
    const sources = VM.createVMSources([
        vTokenAddr,
        vSigner1,
        vTokenId,
      op(Opcode.IERC1155_BALANCE_OF)
    ]);

    const state: StateConfig = {
      sources,
      constants,
      argumentsLength: 0,
      stackLength: 3,
    };
    const friendly = HumanFriendlySource.get(state);

    expect(friendly).to.be.equal(
      `IERC1155_BALANCE_OF(${tokenERC1155.address}, ${signer1.address}, ${tokenId})`
    );
  });

  it('should return owner of specific ERC721 token', async () => {
    const tokenERC721Factory = await ethers.getContractFactory(
      'ReserveTokenERC721'
    );
    const tokenERC721 = await tokenERC721Factory.deploy();

    const nftId = 0;
    const constants = [nftId, tokenERC721.address];
    const vNftId = op(Opcode.VAL, 0);
    const vTokenAddr = op(Opcode.VAL, 1);

    // prettier-ignore
    const sources = VM.createVMSources([
        vTokenAddr,
        vNftId,
      op(Opcode.IERC721_OWNER_OF)
    ]);

    const state: StateConfig = {
      sources,
      constants,
      argumentsLength: 0,
      stackLength: 3,
    };
    const friendly = HumanFriendlySource.get(state);

    expect(friendly).to.be.equal(
      `IERC721_OWNER_OF(${tokenERC721.address}, ${nftId})`
    );
  });

  it('should return ERC721 balance of signer', async () => {
    const [signer1] = await ethers.getSigners();
    const tokenERC721Factory = await ethers.getContractFactory(
      'ReserveTokenERC721'
    );
    const tokenERC721 = await tokenERC721Factory.deploy();
    const constants = [signer1.address, tokenERC721.address];

    const vSigner1 = op(Opcode.VAL, 0);
    const vTokenAddr = op(Opcode.VAL, 1);

    // prettier-ignore
    const sources = VM.createVMSources([
        vTokenAddr,
        vSigner1,
      op(Opcode.IERC721_BALANCE_OF)
    ]);

    const state: StateConfig = {
      sources,
      constants,
      argumentsLength: 0,
      stackLength: 3,
    };
    const friendly = HumanFriendlySource.get(state);

    expect(friendly).to.be.equal(
      `IERC721_BALANCE_OF(${tokenERC721.address}, ${signer1.address})`
    );
  });

  it('should return ERC20 total supply', async () => {
    const tokenERC20Factory = await ethers.getContractFactory('ReserveToken');
    const tokenERC20 = await tokenERC20Factory.deploy();

    const constants = [tokenERC20.address];
    const vTokenAddr = op(Opcode.VAL, 0);

    // prettier-ignore
    const sources = [
      concat([
          vTokenAddr,
        op(Opcode.IERC20_TOTAL_SUPPLY)
      ]),
    ];

    const state: StateConfig = {
      sources,
      constants,
      argumentsLength: 0,
      stackLength: 3,
    };
    const friendly = HumanFriendlySource.get(state);

    expect(friendly).to.be.equal(`IERC20_TOTAL_SUPPLY(${tokenERC20.address})`);
  });

  it('should return ERC20 balance', async () => {
    const [signer1] = await ethers.getSigners();
    const tokenERC20Factory = await ethers.getContractFactory('ReserveToken');
    const tokenERC20 = await tokenERC20Factory.deploy();

    const constants = [signer1.address, tokenERC20.address];
    const vSigner1 = op(Opcode.VAL, 0);
    const vTokenAddr = op(Opcode.VAL, 1);

    // prettier-ignore
    const sources = VM.createVMSources([
        vTokenAddr,
        vSigner1,
      op(Opcode.IERC20_BALANCE_OF)
    ]);

    const state: StateConfig = {
      sources,
      constants,
      argumentsLength: 0,
      stackLength: 3,
    };
    const friendly = HumanFriendlySource.get(state);

    expect(friendly).to.be.equal(
      `IERC20_BALANCE_OF(${tokenERC20.address}, ${signer1.address})`
    );
  });

  it('should support sale local opcodes', async () => {
    const startPrice = 100000;
    const startTimestamp = await Time.currentTime();
    const endTimestamp = startTimestamp + 30;
    const minimumRaise = 20000000;
    const initialSupply = 5000000;

    const script = new vLBP(
      startPrice,
      startTimestamp,
      endTimestamp,
      minimumRaise,
      initialSupply
    );

    const friendly0 = HumanFriendlySource.get(script, {
      contract: 'Sale',
      pretty: true,
    });

    const expected = `DIV(
  MUL(
    ADD(
      TOTAL_RESERVE_IN(),
      100000000000000000000000000
    ),
    MAX(
      SATURATING_SUB(
        5000000000000000000000,
        MUL(
          SATURATING_SUB(
            BLOCK_TIMESTAMP(),
            ${startTimestamp}
          ),
          166633330000000000000
        )
      ),
      1000000000000000000
    )
  ),
  REMAINING_UNITS()
)`;

    expect(friendly0).to.be.equals(expected);
  });
});
