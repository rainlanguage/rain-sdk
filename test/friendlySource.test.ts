import { expect } from 'chai';
import { generateHumanFriendlySource } from '../src/friendlySource';
import { concat } from 'ethers/lib/utils';
import { ethers } from 'hardhat';
import { bytify, op } from '../src/utils';
import { arg, callSize, createEmptyBlock } from './utils';

const enum Opcode {
  SKIP,
  VAL,
  DUP,
  ZIPMAP,
  DEBUG,
  BLOCK_NUMBER,
  BLOCK_TIMESTAMP,
  ADD,
  SUB,
  MUL,
  DIV,
  MOD,
  EXP,
  MIN,
  MAX,
}

const opMeta = [
  {
    opcode: Opcode.SKIP,
    name: 'SKIP',
    input: '',
  },
  {
    opcode: Opcode.VAL,
    name: 'VAL',
    input: 'constantIndex',
  },
  {
    opcode: Opcode.DUP,
    name: 'DUP',
    input: '',
  },
  {
    opcode: Opcode.ZIPMAP,
    name: 'ZIPMAP',
    input: 'zipmap',
  },
  {
    opcode: Opcode.DEBUG,
    name: 'DEBUG',
    input: '',
  },
  {
    opcode: Opcode.BLOCK_NUMBER,
    name: 'BLOCK_NUMBER',
    input: 'blockNumber',
  },
  {
    opcode: Opcode.BLOCK_TIMESTAMP,
    name: 'BLOCK_TIMESTAMP',
    input: 'blockTimestamp',
  },
  {
    opcode: Opcode.ADD,
    name: 'ADD',
    input: 'takeFromStack',
  },
  {
    opcode: Opcode.SUB,
    name: 'SUB',
    input: 'takeFromStack',
  },
  {
    opcode: Opcode.MUL,
    name: 'MUL',
    input: 'takeFromStack',
  },
  {
    opcode: Opcode.DIV,
    name: 'DIV',
    input: 'takeFromStack',
  },
  {
    opcode: Opcode.MOD,
    name: 'MOD',
    input: 'takeFromStack',
  },
  {
    opcode: Opcode.EXP,
    name: 'EXP',
    input: 'takeFromStack',
  },
  {
    opcode: Opcode.MIN,
    name: 'MIN',
    input: 'takeFromStack',
  },
  {
    opcode: Opcode.MAX,
    name: 'MAX',
    input: 'takeFromStack',
  },
];

describe('generateHumanFriendlySource', () => {
  it('should support source scripts with leading zeroes', async () => {
    await createEmptyBlock(5);

    const block0 = await ethers.provider.getBlockNumber();
    const constants = [block0];

    const vBlock = op(Opcode.VAL, 0);

    // prettier-ignore
    const source0 = concat([
      // 0 0 0 0 0 0 0 0 0 0 (block0 BLOCK_NUMBER min)
      new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
        vBlock,
        op(Opcode.BLOCK_NUMBER),
      op(Opcode.MIN, 2),
    ]);

    const friendly0 = generateHumanFriendlySource([source0], constants, opMeta);

    expect(friendly0).to.eq(`MIN(${block0}, BLOCK_NUMBER())`);
  });

  it('should support source scripts with trailing zeroes', async () => {
    await createEmptyBlock(5);

    const block0 = await ethers.provider.getBlockNumber();
    const constants = [block0];

    const vBlock = op(Opcode.VAL, 0);

    // prettier-ignore
    const source0 = concat([
      // (block0 BLOCK_NUMBER min) 0 0 0 0 0 0 0 0 0 0
        vBlock,
        op(Opcode.BLOCK_NUMBER),
      op(Opcode.MIN, 2),
      new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
    ]);

    const friendly0 = generateHumanFriendlySource([source0], constants, opMeta);

    expect(friendly0).to.eq(`MIN(${block0}, BLOCK_NUMBER())`);
  });

  it('should return block.number and block.timestamp', () => {
    const constants: Array<number> = [];

    const source0 = concat([
      // (BLOCK_NUMBER)
      op(Opcode.BLOCK_NUMBER),
    ]);

    const friendly0 = generateHumanFriendlySource([source0], constants, opMeta);

    expect(friendly0).to.eq('BLOCK_NUMBER()');

    const source1 = concat([
      // (BLOCK_TIMESTAMP)
      op(Opcode.BLOCK_TIMESTAMP),
    ]);

    const friendly1 = generateHumanFriendlySource([source1], constants, opMeta);

    expect(friendly1).to.eq('BLOCK_TIMESTAMP()');
  });

  it('should return correct remainder when using modulo op on sequence of numbers', () => {
    const constants = [7, 4, 2];
    const v7 = op(Opcode.VAL, 0);
    const v4 = op(Opcode.VAL, 1);
    const v2 = op(Opcode.VAL, 2);

    const sources = [
      concat([
        // (7 4 2 %)
        v7,
        v4, // -> r3
        v2, // -> r1
        op(Opcode.MOD, 3),
      ]),
    ];

    const friendly = generateHumanFriendlySource(sources, constants, opMeta);

    expect(friendly).to.eq('MOD(7, 4, 2)');
  });

  it('should perform exponentiation on a sequence of numbers', () => {
    const constants = [2, 4, 3];
    const v2 = op(Opcode.VAL, 0);
    const v4 = op(Opcode.VAL, 1);
    const v3 = op(Opcode.VAL, 2);

    const sources = [
      concat([
        // (2 4 3 ^)
        v2,
        v4,
        v3,
        op(Opcode.EXP, 3),
      ]),
    ];

    const friendly = generateHumanFriendlySource(sources, constants, opMeta);

    expect(friendly).to.eq('EXP(2, 4, 3)');
  });

  it('should return the maximum of a sequence of numbers', () => {
    const constants = [33, 11, 22];
    const v33 = op(Opcode.VAL, 0);
    const v11 = op(Opcode.VAL, 1);
    const v22 = op(Opcode.VAL, 2);

    const source = concat([
      // (22 11 33 max)
      v22,
      v11,
      v33,
      op(Opcode.MAX, 3),
    ]);

    const friendly = generateHumanFriendlySource([source], constants, opMeta);

    expect(friendly).to.eq('MAX(22, 11, 33)');
  });

  it('should return the minimum of a sequence of numbers', () => {
    const constants = [33, 11, 22];
    const v33 = op(Opcode.VAL, 0);
    const v11 = op(Opcode.VAL, 1);
    const v22 = op(Opcode.VAL, 2);

    const source = concat([
      // (22 11 33 min)
      v22,
      v11,
      v33,
      op(Opcode.MIN, 3),
    ]);

    const friendly = generateHumanFriendlySource([source], constants, opMeta);

    expect(friendly).to.eq('MIN(22, 11, 33)');
  });

  it('should run a basic program (return current block number)', () => {
    const constants: Array<number> = [];
    const source = concat([op(Opcode.BLOCK_NUMBER)]);

    const friendly = generateHumanFriendlySource([source], constants, opMeta);

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
      concat([ // sourceIndex === 0 (main source)
        op(Opcode.VAL, 0), // val0
        op(Opcode.VAL, 1), // val1
        op(Opcode.ZIPMAP, callSize(sourceIndex, loopSize, valSize)),
      ]),
      concat([ // sourceIndex === 1 (inner ZIPMAP function)
        // (arg0 arg1 mul) (arg0 arg1 add)
        op(Opcode.VAL, arg(0)),
        op(Opcode.VAL, arg(1)),
        op(Opcode.MUL, 2),
        op(Opcode.VAL, arg(0)),
        op(Opcode.VAL, arg(1)),
        op(Opcode.ADD, 2),
      ]),
    ];

    const friendly = generateHumanFriendlySource(sources, constants, opMeta);

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
      concat([
        op(Opcode.VAL, 2), // val0
        op(Opcode.VAL, 1), // val1
        op(Opcode.VAL, 0), // val2
        op(Opcode.ZIPMAP, callSize(sourceIndex, loopSize, valSize)),
      ]),
      concat([
        // (arg0 arg1 arg2 mul) (arg0 arg1 arg2 add)
        op(Opcode.VAL, arg(0)),
        op(Opcode.VAL, arg(1)),
        op(Opcode.VAL, arg(2)),
        op(Opcode.MUL, 3),
        op(Opcode.VAL, arg(0)),
        op(Opcode.VAL, arg(1)),
        op(Opcode.VAL, arg(2)),
        op(Opcode.ADD, 3),
      ]),
    ];

    const friendly = generateHumanFriendlySource(sources, constants, opMeta);

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
      concat([
        op(Opcode.VAL, 0), // val0
        op(Opcode.VAL, 1), // val1
        op(Opcode.VAL, 2), // val2
        op(Opcode.VAL, 3), // val3
        op(Opcode.VAL, 4), // val4
        op(Opcode.VAL, 5), // val5
        op(Opcode.VAL, 6), // val6
        op(Opcode.VAL, 7), // val7
        op(Opcode.ZIPMAP, callSize(sourceIndex, loopSize, valSize)),
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
      ]),
    ];

    const friendly = generateHumanFriendlySource(sources, constants, opMeta);

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
      concat([
        v0,
        v1,
        v2,
        op(Opcode.ZIPMAP, callSize(sourceIndex, loopSize, valSize)),
      ]),
      concat([
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
      ]),
    ];

    const friendly = generateHumanFriendlySource(sources, constants, opMeta);

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

    const friendly = generateHumanFriendlySource(sources, constants, opMeta);

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

    const friendly = generateHumanFriendlySource(sources, constants, opMeta);

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

    const friendly = generateHumanFriendlySource(sources, constants, opMeta);

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

    const friendly = generateHumanFriendlySource(sources, constants, opMeta);

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

    const friendly = generateHumanFriendlySource(sources, constants, opMeta);

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

    const friendly = generateHumanFriendlySource(sources, constants, opMeta);

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

    const friendly = generateHumanFriendlySource(sources, constants, opMeta);

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

    const friendly = generateHumanFriendlySource(sources, constants, opMeta);

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

    const friendly = generateHumanFriendlySource(sources, constants, opMeta);

    expect(friendly).to.eq('ADD(1, 2, 3)');
  });
});
