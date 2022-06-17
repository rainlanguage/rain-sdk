import { BytesLike, BigNumberish, BigNumber } from 'ethers';
import { arrayify } from './utils';
import { AllStandardOps, StateConfig } from './classes/vm';

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

export const newOpMeta: OpMeta[] = [
  {
    opcode: AllStandardOps.SKIP,
    name: 'SKIP',
    input: '',
  },
  {
    opcode: AllStandardOps.VAL,
    name: 'VAL',
    input: 'constantIndex',
  },
  {
    opcode: AllStandardOps.DUP,
    name: 'DUP',
    input: '',
  },
  {
    opcode: AllStandardOps.ZIPMAP,
    name: 'ZIPMAP',
    input: 'zipmap',
  },
  {
    opcode: AllStandardOps.DEBUG,
    name: 'DEBUG',
    input: '',
  },
  {
    opcode: AllStandardOps.BLOCK_NUMBER,
    name: 'BLOCK_NUMBER',
    input: 'blockNumber',
  },
  {
    opcode: AllStandardOps.BLOCK_TIMESTAMP,
    name: 'BLOCK_TIMESTAMP',
    input: 'blockTimestamp',
  },
  {
    opcode: AllStandardOps.SENDER,
    name: 'SENDER',
    input: 'msgSender',
  },
  {
    opcode: AllStandardOps.THIS_ADDRESS,
    name: 'THIS_ADDRESS',
    input: 'thisAddress',
  },
  {
    opcode: AllStandardOps.SCALE18_MUL,
    name: 'SCALE18_MUL',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.SCALE18_DIV,
    name: 'SCALE18_DIV',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.SCALE18,
    name: 'SCALE18',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.SCALEN,
    name: 'SCALEN',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.SCALE_BY,
    name: 'SCALE_BY',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.SCALE18_ONE,
    name: 'SCALE18_ONE',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.SCALE18_DECIMALS,
    name: 'SCALE18_DECIMALS',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.ADD,
    name: 'ADD',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.SATURATING_ADD,
    name: 'SATURATING_ADD',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.SUB,
    name: 'SUB',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.SATURATING_SUB,
    name: 'SATURATING_SUB',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.MUL,
    name: 'MUL',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.SATURATING_MUL,
    name: 'SATURATING_MUL',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.DIV,
    name: 'DIV',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.MOD,
    name: 'MOD',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.EXP,
    name: 'EXP',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.MIN,
    name: 'MIN',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.MAX,
    name: 'MAX',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.ISZERO,
    name: 'ISZERO',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.EAGER_IF,
    name: 'EAGER_IF',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.EQUAL_TO,
    name: 'EQUAL_TO',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.LESS_THAN,
    name: 'LESS_THAN',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.GREATER_THAN,
    name: 'GREATER_THAN',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.EVERY,
    name: 'EVERY',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.ANY,
    name: 'ANY',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.REPORT,
    name: 'REPORT',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.NEVER,
    name: 'NEVER',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.ALWAYS,
    name: 'ALWAYS',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.SATURATING_DIFF,
    name: 'SATURATING_DIFF',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.UPDATE_BLOCKS_FOR_TIER_RANGE,
    name: 'UPDATE_BLOCKS_FOR_TIER_RANGE',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.SELECT_LTE,
    name: 'SELECT_LTE',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.IERC20_BALANCE_OF,
    name: 'IERC20_BALANCE_OF',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.IERC20_TOTAL_SUPPLY,
    name: 'IERC20_TOTAL_SUPPLY',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.IERC721_BALANCE_OF,
    name: 'IERC721_BALANCE_OF',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.IERC721_OWNER_OF,
    name: 'IERC721_OWNER_OF',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.IERC1155_BALANCE_OF,
    name: 'IERC1155_BALANCE_OF',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.IERC1155_BALANCE_OF_BATCH,
    name: 'IERC1155_BALANCE_OF_BATCH',
    input: 'takeFromStack',
  },
];

export class HumanFriendlySource {
  private static opMeta: OpMeta[] = newOpMeta;

  public static get(_state: StateConfig): string {
    // public static get(sources: BytesLike[], constants: BigNumberish[]): string {
    const state: State = {
      stackIndex: 0,
      stack: [],
      sources: _state.sources,
      constants: _state.constants,
    };

    return this._eval(state, 0);
  }

  private static _eval = (state: State, sourceIndex: number) => {
    let i = 0;
    let op: OpInfo;

    const ops = this.pairs(state.sources[sourceIndex]).map((pair) => {
      const opmeta = this.opMeta.find((opmeta) => opmeta.opcode === pair[0]);
      if (typeof opmeta === 'undefined') {
        throw Error(`Unknown opcode: ${pair[0]}`);
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
      } else if (op.input === 'msgSender') {
        state.stack[_stackIndex] = {
          val: 'SENDER()',
          consumed: false,
        };
        state.stackIndex = BigNumber.from(_stackIndex).add(1).toNumber();
      } else if (op.input === 'thisAddress') {
        state.stack[_stackIndex] = {
          val: 'THIS_ADDRESS()',
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
