import { BytesLike, BigNumberish, BigNumber } from 'ethers';
import { arrayify } from './utils';

export interface OpMeta {
  opcode: number;
  name: string;
  input: string;
}

interface OpInfo extends OpMeta {
  operand: number;
}

interface State {
  stackIndex: BigNumberish;
  stack: { val: any; consumed: boolean }[];
  sources: BytesLike[];
  constants: BigNumberish[];
}

type Pair = [number, number];

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

export class HumanFriendlySource {
  private static opMeta: OpMeta[] = [
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

  public static get(sources: BytesLike[], constants: BigNumberish[]): string {
    const state: State = {
      stackIndex: 0,
      stack: [],
      sources,
      constants,
    };

    return this._eval(state, 0);
  }

  private static _eval = (state: State, sourceIndex: number) => {
    let i = 0;
    let op: OpInfo;

    const ops = this.pairs(state.sources[sourceIndex]).map((pair) => {
      const opmeta = this.opMeta.find((opmeta) => opmeta.opcode === pair[0]);
      if (typeof opmeta === 'undefined') {
        throw Error('Unknown opcode' + pair[1]);
      }

      return {
        operand: pair[1],
        ...opmeta,
      };
    });

    while (i < ops.length) {
      const _stackIndex = BigNumber.from(state.stackIndex).toNumber();
      op = ops[i];
      i++;

      if (op.input === 'constantIndex') {
        if (op.operand < 128) {
          state.stack[_stackIndex] = {
            val: state.constants[op.operand],
            consumed: false,
          };
        } else {
          state.stack[_stackIndex] = {
            val: '^' + (op.operand - 128),
            consumed: false,
          };
        }
        state.stackIndex = BigNumber.from(_stackIndex).add(1).toNumber();
      } else if (op.input === 'blockNumber') {
        state.stack[_stackIndex] = {
          val: 'BLOCK_NUMBER()',
          consumed: false,
        };
        state.stackIndex = BigNumber.from(_stackIndex).add(1).toNumber();
      } else if (op.input === 'blockTimestamp') {
        state.stack[_stackIndex] = {
          val: 'BLOCK_TIMESTAMP()',
          consumed: false,
        };
        state.stackIndex = BigNumber.from(_stackIndex).add(1).toNumber();
      } else if (op.input === 'takeFromStack') {
        this.applyOp(state, op);
      } else if (op.input === 'zipmap') {
        this.zipmap(state, op.operand);
      }
    }

    return state.stack
      .filter((item) => item.consumed === false)
      .map((item) => {
        item.consumed = true;
        return item.val;
      })
      .join(' ');
  };

  private static zipmap = (state: State, operand: number) => {
    let tempString = `ZIPMAP(\n`;

    const sourceIndex = operand & 0x07;
    const stepSize = (operand >> 3) & 0x03;
    const valLength = (operand >> 5) & 0x07;

    let tempArr = [];

    for (let i = 0; i <= valLength; i++) {
      tempArr.push(
        stepSize > 0
          ? JSON.stringify(
              Array.from(this.divideArray(state.stack[i].val, stepSize))
            ).replace(/,/g, ', ')
          : state.stack[i].val
      );
      state.stack[i].consumed = true;
    }

    tempArr.push(this._eval(state, sourceIndex));

    tempString += tempArr.map((entry) => '    ' + entry).join(`,\n`);
    tempString += `\n)`;

    state.stack[BigNumber.from(state.stackIndex).toNumber()] = {
      val: tempString,
      consumed: false,
    };
  };

  private static applyOp = (state: State, op: OpInfo) => {
    const _stackIndex = BigNumber.from(state.stackIndex).toNumber();
    let baseIndex = _stackIndex - op.operand;
    let top = _stackIndex - 1;
    let cursor = baseIndex;
    let tempString = op.name + '(';
    let tempArr = [state.stack[cursor].val];
    state.stack[cursor].consumed = true;
    while (cursor < top) {
      cursor++;
      tempArr.push(state.stack[cursor].val);
      state.stack[cursor].consumed = true;
    }
    tempString += tempArr.join(', ');
    tempString += ')';
    state.stack[baseIndex] = {
      val: tempString,
      consumed: false,
    };
    state.stackIndex = baseIndex + 1;
  };

  private static pairs = (arr: BytesLike): Pair[] => {
    const _arr = Array.from(arrayify(arr));
    const pairs: Pair[] = [];
    for (let i = 0; i < arr.length; i += 2) {
      pairs.push(_arr.slice(i, i + 2) as Pair);
    }
    return pairs;
  };

  private static divideArray = (arr: Uint8Array, times: number): Uint8Array => {
    let n = arr.length;
    for (let i = 0; i < times; i++) {
      n = n / 2;
    }

    return arr.filter((_, i) => i % n === n - 1);
  };
}

// const increaseBN2 = (_value: BigNumberish): BigNumberish => {
//   return BigNumber.from(_value).add(1).toNumber();
// };
