import { expect } from 'chai';
import { generateHumanFriendlySource } from '../src/friendlySource';
import { concat, Hexable, hexlify, zeroPad } from 'ethers/lib/utils';
import { BytesLike } from 'ethers';

function bytify(
  value: number | BytesLike | Hexable,
  bytesLength = 1
): BytesLike {
  return zeroPad(hexlify(value), bytesLength);
}

function op(code: number, erand = 0): Uint8Array {
  return concat([bytify(erand), bytify(code)]);
}

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
  it.skip('should support source scripts with leading zeroes', () => {
    // TODO
  });

  it.skip('should support source scripts with trailing zeroes', () => {
    // TODO
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

  it.skip('should return correct remainder when using modulo op (zero rem)', () => {
    // No value in testing?
  });

  it.skip('should return correct remainder when using modulo op (non-zero rem)', () => {
    // No value in testing?
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

  it.skip('should perform exponentiation correctly', () => {
    // No value in testing?
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

  it.skip('should handle a zipmap which loops 4 times', () => {
    // TODO
  });

  it.skip('should handle a zipmap which loops twice', () => {
    // TODO
  });

  it.skip('should handle a zipmap op with maxed sourceIndex and valSize', () => {
    // TODO
  });

  it.skip('should handle a zipmap op which runs multiple functions (across multiple fn vals)', () => {
    // TODO
  });

  it.skip('should handle a zipmap op which runs multiple functions (using single inner zipmap function source)', () => {
    // TODO
  });

  it.skip('should handle a simple call op', () => {
    // TODO
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
