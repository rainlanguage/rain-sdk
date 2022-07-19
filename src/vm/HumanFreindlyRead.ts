import { BytesLike, BigNumberish, BigNumber } from 'ethers';
import { AllStandardOps, StateConfig } from '../classes/vm';
import { CombineTierStorage } from '../contracts/tiers/combineTier';
import {
  EmissionsERC20Context,
  EmissionsERC20Storage,
} from '../contracts/emissionsERC20';
import { OrderbookContext, OrderbookStorage } from '../contracts/orderBook';
import { SaleContext, SaleStorage } from '../contracts/sale';
import {
  arrayify,
  paddedUInt256,
  selectLteLogic,
  selectLteMode,
} from '../utils';

interface OpMeta {
  opcode: number;
  name: string;
  input: string;
}

interface OpInfo extends OpMeta {
  operand: number;
}

/**
 * State that contain the information about the script.
 */
interface State {
  stackIndex: BigNumberish;
  stack: Stack[];
  sources: BytesLike[];
  constants: BigNumberish[];
}

/**
 * A type to indentify the status of each value in the stack
 */
type Stack = {
  /**
   * Current value
   */
  val: any;
  /**
   * Flag to identify if a value was read and use it.
   * This means that after mix with other value in stack will be deleted
   */
  consumed: boolean;
  /**
   * Flag to identify if the value was duplicate.
   * A value that was duplicate will be considered as consumed, but still accessible in the stack.
   * At the end, if the value was not mixed, will be discard to the final output
   */
  wasDup?: boolean;
};

/**
 * Type identify the pair relate to the [opcode, operand]
 */
type Pair = [number, number];

/**
 * @public
 *
 * Specific the configuration of the generation method
 */
export type Config = {
  /**
   * With this we can get the context.
   * This will be the contract name eg: sale, combineTier (It's not case-sensitive)
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
    input: 'CONTEXT',
  },
  {
    opcode: AllStandardOps.STORAGE,
    name: 'STORAGE',
    input: 'STORAGE',
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
 * Parse an State/Script to a more human readable form, making easier to understand. This form allow to the users read exactly
 * what the Script is made for, like the conditions, values used, etc. Also, anyone can learn to write their own scripts
 * if use the Human Form to see the output for each combination that they made.
 *
 * If you find an issue or you want to propose a better way to show a specific script or opcodes, please
 * feel to do it on: https://github.com/beehive-innovation/rain-sdk/issues
 */
export class HumanFriendlyRead {
  private static opMeta: OpMeta[] = newOpMeta;
  private static _context: string | undefined;
  private static _pretty: boolean;

  /**
   * Obtain the friendly output from an script.
   * @param _state - The state or script to generate the friendly version @see StateConfig
   * @param _config - The configuration that will run the generator. @see Config
   * @returns
   */
  public static get(
    _state: StateConfig,
    _config: Config = { contract: '', pretty: false }
  ): string {
    this._context = _config?.contract?.toLowerCase();
    this._pretty = _config.pretty ? true : false;
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
      if (_text[i] === ',' && skip > 0) {
        _text = _text.slice(0, i + 1) + space + _text.slice(i + 1);
      }
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
          if (counter === 0 && (_text[i + 1] || _text[i + 1])) {
            _text = _text.slice(0, i + 1) + '\n\n' + _text.slice(i + 1);
          }
        } else {
          skip--;
        }

      }
    }
    return _text;
  }

  private static _eval = (_state: State, sourceIndex: number) => {
    let i = 0;
    let op: OpInfo;

    let state: State = {
      stackIndex: 0,
      stack: [],
      sources: _state.sources,
      constants: _state.constants,
    };

    const ops = this.pairs(state.sources[sourceIndex]).map((pair) => {
      let opmeta = this.opMeta.find((opmeta) => opmeta.opcode === pair[0]);
      if (typeof opmeta === 'undefined') {
        // still undefined
        if (typeof opmeta === 'undefined') {
          throw Error(`Unknown opcode: ${pair[0]}`);
        }
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
      } else if (op.input === 'DUP') {
        state.stack[op.operand].consumed = true;
        state.stack[op.operand].wasDup = true;
        const valueDup = {
          val: state.stack[op.operand].val,
          consumed: false,
        };
        state.stack.push(valueDup);
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
          val: 'CURRENT_TIMESTAMP',
          consumed: false,
        };
        state.stackIndex = BigNumber.from(_stackIndex).add(1).toNumber();
      } else if (op.input === 'SCALE18_DECIMALS') {
        state.stack[_stackIndex] = {
          val: 'SCALE18_DECIMALS()',
          consumed: false,
        };
        state.stackIndex = BigNumber.from(_stackIndex).add(1).toNumber();
      } else if (op.input === 'SCALE18_ONE') {
        state.stack[_stackIndex] = {
          val: 'SCALE18_ONE()',
          consumed: false,
        };
        state.stackIndex = BigNumber.from(_stackIndex).add(1).toNumber();
      } else if (op.input === 'NEVER') {
        state.stack[_stackIndex] = {
          val: 'NEVER()',
          consumed: false,
        };
        state.stackIndex = BigNumber.from(_stackIndex).add(1).toNumber();
      } else if (op.input === 'REMAINING_UNITS') {
        state.stack[_stackIndex] = {
          val: 'REMAINING_UNITS()',
          consumed: false,
        };
        state.stackIndex = BigNumber.from(_stackIndex).add(1).toNumber();
      } else if (op.input === 'TOTAL_RESERVE_IN') {
        state.stack[_stackIndex] = {
          val: 'TOTAL_RESERVE_IN()',
          consumed: false,
        };
        state.stackIndex = BigNumber.from(_stackIndex).add(1).toNumber();
      } else if (op.input === 'CURRENT_BUY_UNITS') {
        state.stack[_stackIndex] = {
          val: 'CURRENT_BUY_UNITS()',
          consumed: false,
        };
        state.stackIndex = BigNumber.from(_stackIndex).add(1).toNumber();
      } else if (op.input === 'TOKEN_ADDRESS') {
        state.stack[_stackIndex] = {
          val: 'TOKEN_ADDRESS()',
          consumed: false,
        };
        state.stackIndex = BigNumber.from(_stackIndex).add(1).toNumber();
      } else if (op.input === 'RESERVE_ADDRESS') {
        state.stack[_stackIndex] = {
          val: 'RESERVE_ADDRESS()',
          consumed: false,
        };
        state.stackIndex = BigNumber.from(_stackIndex).add(1).toNumber();
      } else if (op.input === 'ACCOUNT') {
        state.stack[_stackIndex] = {
          val: 'ACCOUNT()',
          consumed: false,
        };
        state.stackIndex = BigNumber.from(_stackIndex).add(1).toNumber();
      } else if (op.input === 'CLAIMANT_ACCOUNT') {
        state.stack[_stackIndex] = {
          val: 'CLAIMANT_ACCOUNT()',
          consumed: false,
        };
        state.stackIndex = BigNumber.from(_stackIndex).add(1).toNumber();
      } else if (op.input === 'CURRENT_UNITS') {
        state.stack[_stackIndex] = {
          val: 'CURRENT_UNITS()',
          consumed: false,
        };
        state.stackIndex = BigNumber.from(_stackIndex).add(1).toNumber();
      } else if (op.input === 'CONTEXT') {
        //
        let context = `CONTEXT Argument ${op.operand} passed to contract function at call`;
        let valid = true;
        if (this._context === 'sale') {
          valid = isValidContext(op.operand, SaleContext.length);
          context = SaleContext[op.operand];
        }
        //
        else if (this._context === 'emissions') {
          valid = isValidContext(op.operand, EmissionsERC20Context.length);
          context = EmissionsERC20Context[op.operand];
        }
        //
        else if (this._context === 'orderbook') {
          valid = isValidContext(op.operand, OrderbookContext.length);
          context = OrderbookContext[op.operand];
        }

        if (valid) {
          state.stack[_stackIndex] = {
            val: context,
            consumed: false,
          };
          state.stackIndex = BigNumber.from(_stackIndex).add(1).toNumber();
        } else {
          throw new Error(
            `Wrong context value '${op.operand}' given for the context '${this._context}'`
          );
        }
      } else if (op.input === 'STORAGE') {
        //
        let storage = '';
        if (this._context === 'sale') {
          storage = SaleStorage[op.operand];
        } else if (this._context === 'emissions') {
          storage = EmissionsERC20Storage[op.operand];
        } else if (this._context === 'orderbook') {
          storage = OrderbookStorage[op.operand];
        } else if (this._context === 'combinetier') {
          storage = CombineTierStorage[op.operand];
        } else {
          throw new Error('Not contract/context provided to get the STORAGE');
        }

        state.stack[_stackIndex] = {
          val: storage,
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
    const sourceIndex = operand & 0x07;
    const stepSize = (operand >> 3) & 0x03;
    const valLength = (operand >> 5) & 0x07;
    const amountValues = `${2 ** stepSize}`;

    let tempString = `ZIPMAP_${amountValues}(\n`;

    let tempArr = [];
    let leng = state.stack.length - 1;

    for (let i = leng - valLength; i <= leng; i++) {
      if (stepSize > 0) {
        const divided = this.divideArray(state.stack[i].val, stepSize);
        const _value =
          typeof divided === 'string'
            ? divided
            : JSON.stringify(Array.from(divided)).replace(/,/g, ', ');
        tempArr.push(_value);
      } else {
        tempArr.push(state.stack[i].val);
      }

      state.stack[i].consumed = true;
    }

    tempArr.push(this._eval(state, sourceIndex));

    tempString += tempArr.map((entry) => '    ' + entry).join(`,\n`);
    tempString += `\n)`;

    state.stackIndex = BigNumber.from(state.stackIndex).sub(valLength);

    // Minus 1 becuase the zipmap is not added yet
    const baseIndex = BigNumber.from(state.stackIndex).toNumber() - 1;

    // Cleaning the stack
    state.stack = this.cleanStack(state.stack, baseIndex);

    state.stack[baseIndex] = {
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
    let selectLteFlag = false;

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
      const _stackLength = this.identifyZipmap(state.stack, 2);

      // At least one zipmap was found to fll all the required stack from MIN
      if (_stackLength !== -1) {
        baseIndex = _stackIndex - _stackLength;
      }
      // Since no zipmap was found, the stack could fill the the stack required
      else {
        baseIndex = _stackIndex - 2;
      }

      cursor = baseIndex;
      tempArr = [state.stack[cursor].val + '*10**18'];
      //
    } else if (op.opcode === AllStandardOps.EAGER_IF) {
      const _stackLength = this.identifyZipmap(state.stack, 3);

      // At least one zipmap was found to fll all the required stack from MIN
      if (_stackLength !== -1) {
        baseIndex = _stackIndex - _stackLength;
      }
      // Since no zipmap was found, the stack could fill the the stack required
      else {
        baseIndex = _stackIndex - 3;
      }

      cursor = baseIndex;
      tempArr = [state.stack[cursor].val];
      //
    } else if (
      op.opcode === AllStandardOps.SCALE18 ||
      op.opcode === AllStandardOps.ISZERO ||
      op.opcode === AllStandardOps.IERC20_TOTAL_SUPPLY ||
      this.flagOp(op.opcode)
    ) {
      const _stackLength = this.identifyZipmap(state.stack, 1);

      // At least one zipmap was found to fll all the required stack from MIN
      if (_stackLength !== -1) {
        baseIndex = _stackIndex - _stackLength;
      }
      // Since no zipmap was found, the stack could fill the the stack required
      else {
        baseIndex = _stackIndex - 1;
      }

      operandFlag = this.flagOp(op.opcode);
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
      op.opcode === AllStandardOps.IERC20_BALANCE_OF ||
      op.opcode === AllStandardOps.ITIERV2_REPORT
    ) {
      const _stackLength = this.identifyZipmap(state.stack, 2);

      // At least one zipmap was found to fll all the required stack from MIN
      if (_stackLength !== -1) {
        baseIndex = _stackIndex - _stackLength;
      }
      // Since no zipmap was found, the stack could fill the the stack required
      else {
        baseIndex = _stackIndex - 2;
      }

      cursor = baseIndex;
      tempArr = [state.stack[cursor].val];
      //
    } else if (op.opcode === AllStandardOps.SELECT_LTE) {
      const _stackLength = this.identifyZipmap(state.stack, 3);

      // At least one zipmap was found to fll all the required stack from MIN
      if (_stackLength !== -1) {
        baseIndex = _stackIndex - _stackLength;
      }
      // Since no zipmap was found, the stack could fill the the stack required
      else {
        baseIndex = _stackIndex - 3;
      }

      selectLteFlag = true;
      cursor = baseIndex;
      tempArr = [];
    } else if (
      op.opcode === AllStandardOps.MIN ||
      op.opcode === AllStandardOps.MAX ||
      op.opcode === AllStandardOps.ADD ||
      op.opcode === AllStandardOps.SUB ||
      op.opcode === AllStandardOps.MUL ||
      op.opcode === AllStandardOps.DIV ||
      op.opcode === AllStandardOps.SATURATING_ADD ||
      op.opcode === AllStandardOps.SATURATING_SUB ||
      op.opcode === AllStandardOps.SATURATING_MUL
    ) {
      const operand = this.identifyZipmap(state.stack, op.operand);

      // At least one zipmap was found to fll all the required stack from MIN
      if (operand !== -1) {
        baseIndex = _stackIndex - operand;
      }
      // Since no zipmap was found, the stack could fill the the stack required
      else if (_stackIndex >= op.operand) {
        baseIndex = _stackIndex - op.operand;
      }
      // All the stack should fill the requiremnte (?)
      else {
        baseIndex = 0;
      }
      cursor = baseIndex;
      tempArr = [state.stack[cursor].val];
    } else {
      tempArr = [state.stack[cursor].val];
    }

    state.stack[cursor].consumed = true;

    while (cursor < top || operandFlag || tierRangeFlag || selectLteFlag) {
      cursor++;
      if (selectLteFlag) {
        const logic_ = op.operand >> 7;
        const mode_ = (op.operand >> 5) & 0x3;
        const reportsLength_ = op.operand & 0x1f;
        let selectLteText = 'Invalid selectLte';
        if ((logic_ === 0 || logic_ === 1) && mode_ >= 0 && mode_ <= 2) {
          selectLteText = `${selectLteLogic[logic_]}, ${selectLteMode[mode_]}, ${reportsLength_}`;
        }
        tempArr.push(selectLteText);
        selectLteFlag = false;
        cursor -= 2;
      } else if (operandFlag) {
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

    // Cleaning the stack
    state.stack = this.cleanStack(state.stack, state.stackIndex);
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
  ): (number | string)[] | string => {
    if (arr.constructor === Uint8Array) {
      let n = arr.length;
      for (let i = 0; i < times; i++) {
        n = n / 2;
      }
      return Array.from(arr.filter((_, i) => i % n === n - 1));
    } else {
      try {
        /**
         * If it's not an Uint8Array, then it's an possible HexString or BigNumber comming from constants.
         * Mostly these cases should come from reports. Raise an issue on repo if you see any error.
         */
        BigNumber.from(arr);

        const _eachLength = (32 / 2 ** times) * 2;
        const regex = new RegExp(`.{1,${_eachLength}}`, 'g');
        let value = paddedUInt256(BigNumber.from(arr));

        return value.slice(2).match(regex)!;
      } catch (e) {
        // If fail, we just return the value normally as string
        return arr.toString();
      }
    }
  };

  private static getSigned8(_value: number): number {
    if ((_value & 0x80) > 0) {
      _value = _value - 0x100;
    }
    return _value;
  }

  private static tierRangeFromOp(_op: number): [number, number] {
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

  private static cleanStack(
    _stack: Stack[],
    length: number
  ): { val: any; consumed: boolean }[] {
    let j = 0;
    let k = 0;
    let _newStack: { val: any; consumed: boolean }[] = [];
    while (j < length) {
      if (!_stack[k].consumed || (_stack[k].consumed && _stack[k].wasDup)) {
        _newStack[j] = _stack[k];
        j++;
      }
      k++;
    }
    return _newStack;
  }

  private static identifyZipmap(
    _stack: { val: any; consumed: boolean }[],
    stackToRead: number
  ): number {
    if (stackToRead <= 0) {
      return -1;
    }
    let zipmapCounter = 0;
    let _stackReturn = stackToRead;
    let i = _stack.length - 1;

    while (i >= 0 && _stack.length - i <= _stackReturn) {
      const _text: string = _stack[i].val.toString();
      if (_text.slice(0, 6) === 'ZIPMAP') {
        zipmapCounter++;
        const _zipmapStack = parseInt(_text.slice(7, 8));
        _stackReturn -= _zipmapStack;
      }
      i--;
    }
    return _stackReturn === stackToRead ? -1 : _stackReturn + zipmapCounter;
  }
}

/**
 * Check the operand agains the length of the EnumContext to see if it's valid
 * @param _operand - Operand to check
 * @param _length - The length in the enum Context
 */
function isValidContext(_operand: number, _length: number): boolean {
  if (_operand >= 0 && _operand < _length) return true;
  return false;
}
