import { expect } from 'chai';
import { generateHumanFriendlySource } from '../src/friendlySource';
// import { concat } from "ethers/lib/utils";

import { concat, Hexable, hexlify, zeroPad } from 'ethers/lib/utils';

import type { BytesLike } from 'ethers';

function bytify(
  value: number | BytesLike | Hexable,
  bytesLength = 1
): BytesLike {
  return zeroPad(hexlify(value), bytesLength);
}

function op(code: number, erand = 0): Uint8Array {
  return concat([bytify(erand), bytify(code)]);
}

// function arg(valIndex: number): number {
//   let arg = 1;
//   arg <<= 7;
//   arg += valIndex;
//   return arg;
// }

const enum Opcode {
  END,
  VAL,
  ZIPMAP,
  BLOCK_NUMBER,
  ADD,
  SUB,
  MUL,
  DIV,
  MOD,
  POW,
  MIN,
  MAX,
}

const opMeta = [
  {
    opcode: Opcode.END,
    name: 'END',
    input: '',
  },
  {
    opcode: Opcode.VAL,
    name: 'VAL',
    input: 'constantIndex',
  },
  {
    opcode: Opcode.ZIPMAP,
    name: 'ZIPMAP',
    input: '',
  },
  {
    opcode: Opcode.BLOCK_NUMBER,
    name: 'BLOCK_NUMBER',
    input: 'blockNumber',
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
    opcode: Opcode.POW,
    name: 'POW',
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
  it('generates friendly source for a simple equation', () => {
    const constants = [33, 11, 22];

    const source = concat([
      // (max 22 11 33)
      op(Opcode.MAX, 3),
      op(Opcode.VAL, 2),
      op(Opcode.VAL, 1),
      op(Opcode.VAL, 0),
    ]);

    const friendly = generateHumanFriendlySource(source, constants, opMeta);

    expect(friendly).to.eq('MAX(22, 11, 33)');
  });

  it('generates friendly source for a basic program (return current block number)', () => {
    const constants = [];
    const source = concat([op(Opcode.BLOCK_NUMBER)]);

    const friendly = generateHumanFriendlySource(source, constants, opMeta);

    expect(friendly).to.eq('BLOCK_NUMBER()');
  });

  it('generates friendly source for a calculation using the block number as a value', () => {
    const constants = [1, 2, 3, 4, 6];

    const source = concat([
      // (* (+ 3 4 (- 2 1)) (/ 6 3) B)
      op(Opcode.MUL, 3),
      op(Opcode.ADD, 3),
      op(Opcode.VAL, 2),
      op(Opcode.VAL, 3),
      op(Opcode.SUB, 2),
      op(Opcode.VAL, 1),
      op(Opcode.VAL, 0),
      op(Opcode.DIV, 2),
      op(Opcode.VAL, 4),
      op(Opcode.VAL, 2),
      op(Opcode.BLOCK_NUMBER),
    ]);

    const friendly = generateHumanFriendlySource(source, constants, opMeta);

    expect(friendly).to.eq(
      'MUL(ADD(3, 4, SUB(2, 1)), DIV(6, 3), BLOCK_NUMBER())'
    );
  });

  it('generates friendly source for a mathematical expression (division, product, summation)', () => {
    const constants = [2, 3];

    const source = concat([
      // (/ (* (+ 2 2 2) 3) 2 3)
      op(Opcode.DIV, 3),
      op(Opcode.MUL, 2),
      op(Opcode.ADD, 3),
      op(Opcode.VAL, 0),
      op(Opcode.VAL, 0),
      op(Opcode.VAL, 0),
      op(Opcode.VAL, 1),
      op(Opcode.VAL, 0),
      op(Opcode.VAL, 1),
    ]);

    const friendly = generateHumanFriendlySource(source, constants, opMeta);

    expect(friendly).to.eq('DIV(MUL(ADD(2, 2, 2), 3), 2, 3)');
  });
});
