import { BytesLike, BigNumberish, BigNumber } from 'ethers';
import { AllStandardOps, StateConfig } from './classes/vm';
import { CombineTierContext } from './contracts/tiers/combineTier';
import { EmissionsERC20Context } from './contracts/emissionsERC20';
import { OrderbookContext } from './contracts/orderBook';
import { SaleContext } from './contracts/sale';
import { arrayify, paddedUInt256 } from './utils';

interface OpMeta {
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

/**
 * @public
 *
 * Specific the configuration of the generation method
 */
export type Config = {
  /**
   * With this we can get the context.
   * This will be the contract name eg: sale, combineTier
   */
  contract?: string;
  /**
   * Enable the prettify to the result of get
   */
  pretty?: boolean;
};

/**
 * @public 
 *
 * Specific the configuration of the Prettify method.
 */
export type PrettifyConfig = {
  /**
   * Multiplier to the indent space
   */
  n?: number;
  /**
   * Max length to each line
   */
  length?: number;
};

const newOpMeta: OpMeta[] = [
  {
    opcode: AllStandardOps.CONSTANT,
    name: 'CONSTANTS',
    input: 'constantIndex',
  },
  {
    opcode: AllStandardOps.STACK,
    name: 'STACK',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.CONTEXT,
    name: 'CONTEXT',
    input: 'CONTEXT', // TODO
  },
  {
    opcode: AllStandardOps.STORAGE,
    name: 'STORAGE',
    input: 'takeFromStack',
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
    opcode: AllStandardOps.IERC20_SNAPSHOT_BALANCE_OF_AT,
    name: 'IERC20_SNAPSHOT_BALANCE_OF_AT',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.IERC20_SNAPSHOT_TOTAL_SUPPLY_AT,
    name: 'IERC20_SNAPSHOT_TOTAL_SUPPLY_AT',
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
  {
    opcode: AllStandardOps.BLOCK_NUMBER,
    name: 'BLOCK_NUMBER',
    input: 'blockNumber',
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
    opcode: AllStandardOps.BLOCK_TIMESTAMP,
    name: 'BLOCK_TIMESTAMP',
    input: 'blockTimestamp',
  },
  {
    opcode: AllStandardOps.SCALE18,
    name: 'SCALE18',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.SCALE18_DIV,
    name: 'SCALE18_DIV',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.SCALE18_MUL,
    name: 'SCALE18_MUL',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.SCALE_BY,
    name: 'SCALE_BY',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.SCALEN,
    name: 'SCALEN',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.ANY,
    name: 'ANY',
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
    opcode: AllStandardOps.EVERY,
    name: 'EVERY',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.GREATER_THAN,
    name: 'GREATER_THAN',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.ISZERO,
    name: 'ISZERO',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.LESS_THAN,
    name: 'LESS_THAN',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.SATURATING_ADD,
    name: 'SATURATING_ADD',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.SATURATING_MUL,
    name: 'SATURATING_MUL',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.SATURATING_SUB,
    name: 'SATURATING_SUB',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.ADD,
    name: 'ADD',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.DIV,
    name: 'DIV',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.EXP,
    name: 'EXP',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.MAX,
    name: 'MAX',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.MIN,
    name: 'MIN',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.MOD,
    name: 'MOD',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.MUL,
    name: 'MUL',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.SUB,
    name: 'SUB',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.ITIERV2_REPORT,
    name: 'ITIERV2_REPORT',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.ITIERV2_REPORT_TIME_FOR_TIER,
    name: 'ITIERV2_REPORT_TIME_FOR_TIER',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.SATURATING_DIFF,
    name: 'SATURATING_DIFF',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.SELECT_LTE,
    name: 'SELECT_LTE',
    input: 'takeFromStack',
  },
  {
    opcode: AllStandardOps.UPDATE_TIMES_FOR_TIER_RANGE,
    name: 'UPDATE_TIMES_FOR_TIER_RANGE',
    input: 'takeFromStack',
  },
];

/**
 * @public
 * The generator of friendly human readable source.
 *
 * @remarks
 * Parse a State to a more human readable form, so feel free to use it and make more friendly
 * anyone that want to read the script that is being used in the code.
 *
 * If you find an issue or you want to propose a better way to show a specific script or opcodes, please
 * feel to do it on: https://github.com/beehive-innovation/rain-sdk/issues
 */
export class HumanFriendlySource {
  private static opMeta: OpMeta[] = newOpMeta;
  private static _context: string | undefined;
  private static _pretty: boolean;

  public static get(
    _state: StateConfig,
    _config: Config = { contract: '', pretty: false }
  ): string {
    this._context = _config?.contract?.toLowerCase();
    this._pretty = _config.pretty ? true : false;

    // public static get(sources: BytesLike[], constants: BigNumberish[]): string {
    const state: State = {
      stackIndex: 0,
      stack: [],
      sources: _state.sources,
      constants: _state.constants,
    };

    const _result = this._eval(state, 0);
    return this._pretty ? this.prettify(_result) : _result;
  }

  /**
   * Make more readable the output from the HumanFriendly Source adding indenting following the parenthesis
   *
   * @remarks
   * If the string is already indentend, the method will wrongly generate the string
   *
   * @param _text - The output from the HumanFriendlySource
   * @param _config - The configuration of the prettify method (experimental)
   * @returns The pretty output
   */
  public static prettify(_text: string, _config: PrettifyConfig = {}): string {
    let { n, length } = _config;
    if (!n) n = 2;
    if (!length) length = 20;

    _text = _text.replace(/\s/g, '');
    let space = ' ';
    let counter = 0;
    let skip = 0;
    for (let i = 0; i < _text.length; i++) {
      if (
        _text[i] === '(' ||
        _text[i] === '[' ||
        (_text[i] === ',' && skip === 0)
      ) {
        if (
          _text[i] === ',' ||
          this.needIndent(_text, i, length - counter * n)
        ) {
          if (_text[i] !== ',') counter++;
          _text =
            _text.slice(0, i + 1) +
            '\n' +
            space.repeat(counter * n) +
            _text.slice(i + 1);
        } else {
          skip++;
        }
      }
      if (_text[i] === ')' || _text[i] === ']') {
        if (skip === 0) {
          counter--;
          _text =
            _text.slice(0, i) +
            '\n' +
            space.repeat(counter * n) +
            _text.slice(i);
          i = i + counter * n + 1;
        } else {
          skip--;
        }
      }
    }
    return _text;
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
          val: 'CURRENT_BLOCK',
          consumed: false,
        };
        state.stackIndex = BigNumber.from(_stackIndex).add(1).toNumber();
      } else if (op.input === 'msgSender') {
        state.stack[_stackIndex] = {
          val: 'SENDER',
          consumed: false,
        };
        state.stackIndex = BigNumber.from(_stackIndex).add(1).toNumber();
      } else if (op.input === 'thisAddress') {
        state.stack[_stackIndex] = {
          val: 'THIS_ADDRESS',
          consumed: false,
        };
        state.stackIndex = BigNumber.from(_stackIndex).add(1).toNumber();
      } else if (op.input === 'blockTimestamp') {
        state.stack[_stackIndex] = {
          val: 'CURRENT_TIMESTAMP',
          consumed: false,
        };
        state.stackIndex = BigNumber.from(_stackIndex).add(1).toNumber();
      } else if (op.input === 'SCALE18_DECIMALS') {
        state.stack[_stackIndex] = {
          val: 'SCALE18_DECIMALS',
          consumed: false,
        };
        state.stackIndex = BigNumber.from(_stackIndex).add(1).toNumber();
      } else if (op.input === 'SCALE18_ONE') {
        state.stack[_stackIndex] = {
          val: 'SCALE18_ONE',
          consumed: false,
        };
        state.stackIndex = BigNumber.from(_stackIndex).add(1).toNumber();
      } else if (op.input === 'CONTEXT') {
        //
        let context: string;
        if (this._context === 'sale') {
          context = SaleContext[op.operand];
        } else if (this._context === 'emissions') {
          context = EmissionsERC20Context[op.operand];
        } else if (this._context === 'orderbook') {
          context = OrderbookContext[op.operand];
        } else if (this._context === 'combinetier') {
          context = CombineTierContext[op.operand];
        } else {
          context = `CONTEXT[${op.operand}]`;
        }
        state.stack[_stackIndex] = {
          val: context,
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
    let tempString = op.name + '(';
    let cursor = baseIndex;
    let tempArr: any[];

    let operandFlag = false;
    let tierRangeFlag = false;

    if (
      op.opcode === AllStandardOps.IERC1155_BALANCE_OF_BATCH ||
      op.opcode === AllStandardOps.IERC1155_BALANCE_OF
    ) {
      baseIndex = _stackIndex - 1 - (op.operand + 1) * 2;
      cursor = baseIndex;
      tempArr = [state.stack[cursor].val];
      //
    } else if (op.opcode === AllStandardOps.UPDATE_TIMES_FOR_TIER_RANGE) {
      tierRangeFlag = true;
      baseIndex = _stackIndex - 2;
      cursor = baseIndex;
      tempArr = [state.stack[cursor].val];
      //
    } else if (
      op.opcode === AllStandardOps.SCALE18_DIV ||
      op.opcode === AllStandardOps.SCALE18_MUL
    ) {
      baseIndex = _stackIndex - 2;
      cursor = baseIndex;
      tempArr = [state.stack[cursor].val + '*10**18'];
      //
    } else if (op.opcode === AllStandardOps.EAGER_IF) {
      baseIndex = _stackIndex - 3;
      cursor = baseIndex;
      tempArr = [state.stack[cursor].val];
      //
    } else if (
      op.opcode === AllStandardOps.SCALE18 ||
      op.opcode === AllStandardOps.ISZERO ||
      op.opcode === AllStandardOps.IERC20_TOTAL_SUPPLY ||
      this.flagOp(op.opcode)
    ) {
      operandFlag = this.flagOp(op.opcode);
      baseIndex = _stackIndex - 1;
      cursor = baseIndex;
      tempArr = [state.stack[cursor].val];
      //
    } else if (
      op.opcode === AllStandardOps.GREATER_THAN ||
      op.opcode === AllStandardOps.LESS_THAN ||
      op.opcode === AllStandardOps.EQUAL_TO ||
      op.opcode === AllStandardOps.SATURATING_DIFF ||
      op.opcode === AllStandardOps.IERC721_OWNER_OF ||
      op.opcode === AllStandardOps.IERC721_BALANCE_OF ||
      op.opcode === AllStandardOps.IERC20_BALANCE_OF
    ) {
      baseIndex = _stackIndex - 2;
      cursor = baseIndex;
      tempArr = [state.stack[cursor].val];
      //
    } else {
      tempArr = [state.stack[cursor].val];
    }

    state.stack[cursor].consumed = true;

    while (cursor < top || operandFlag || tierRangeFlag) {
      cursor++;
      if (operandFlag) {
        tempArr.push(this.getSigned8(op.operand));
        operandFlag = false;
      } else if (tierRangeFlag) {
        const [_start, _end] = this.tierRangeFromOp(op.operand);
        let range = 'Invalid Range';
        if (_end > _start) {
          range = `(${_start}, ${_end})`;
        } else {
          range = `(${_end})`;
        }
        tempArr.push(range);
        tierRangeFlag = false;
        cursor--;
      } else {
        tempArr.push(state.stack[cursor].val);
        state.stack[cursor].consumed = true;
      }
    }
    tempString += tempArr.join(', ');
    tempString += ')';
    state.stack[baseIndex] = {
      val: tempString,
      consumed: false,
    };
    state.stackIndex = baseIndex + 1;
  };

  private static flagOp(_a: number) {
    const spcOpces = [AllStandardOps.SCALE_BY, AllStandardOps.SCALEN];
    return spcOpces.includes(_a);
  }

  private static pairs = (arr: BytesLike): Pair[] => {
    const _arr = Array.from(arrayify(arr));
    const pairs: Pair[] = [];
    for (let i = 0; i < arr.length; i += 2) {
      pairs.push(_arr.slice(i, i + 2) as Pair);
    }
    return pairs;
  };

  private static divideArray = (
    arr: Uint8Array | string | BigNumber,
    times: number
  ): (number | string)[] => {
    if (arr.constructor === Uint8Array) {
      let n = arr.length;
      for (let i = 0; i < times; i++) {
        n = n / 2;
      }
      return Array.from(arr.filter((_, i) => i % n === n - 1));
    } else {
      // If it's not an Uint8Array, then it's an HexString or BigNumber comming from constants.
      // Mostly these case should come from reports. Raise an issue on repo if you see any error.
      let value = paddedUInt256(BigNumber.from(arr));
      return value.slice(2).match(/.{1,8}/g)!;
    }
  };

  private static getSigned8(_value: number): number {
    if ((_value & 0x80) > 0) {
      _value = _value - 0x100;
    }
    return _value;
  }

  private static tierRangeFromOp(_op: number): [number, number] {
    //   op_.val & 0x0f, //     00001111
    //   op_.val & 0xf0, //     11110000

    const startTier_ = _op & 0x0f;
    const endTier_ = (_op >> 4) & 0x0f;
    return [startTier_, endTier_];
  }

  private static needIndent(text: string, index: number, max: number): boolean {
    const openRef = text[index];
    const closeRef = openRef === '(' ? ')' : ']';
    text = text.slice(index + 1);

    let counter = 0;
    for (let i = 0; i < text.length && i < max + 1; i++) {
      if (text[i] === openRef) counter++;
      if (text[i] === closeRef) {
        if (counter === 0) return false;
        counter--;
      }
    }
    return true;
  }
}
