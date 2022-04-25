export interface OpMeta {
  opcode: number;
  name: string;
  input: string;
}

interface State {
  stackIndex: number;
  stack: Array<any>;
  sources: Array<Uint8Array>;
  constants: Array<number> | Array<Uint8Array>;
  opmetas: Array<OpMeta>;
}

export const generateHumanFriendlySource = (
  sources: Array<Uint8Array>,
  constants: Array<number> | Array<Uint8Array>,
  opmetas: Array<OpMeta>
) => {
  const state: State = {
    stackIndex: 0,
    stack: [],
    sources,
    constants,
    opmetas,
  };

  return _eval(state, 0);
};

const _eval = (state: State, sourceIndex: number) => {
  let i = 0;
  let op: OpMeta & { operand: number };

  const ops = pairs(state.sources[sourceIndex]).map(pair => {
    const opmeta = state.opmetas.find(opmeta => opmeta.opcode === pair[0]);
    if (typeof opmeta === 'undefined') {
      throw Error('Unknown opcode' + pair[1]);
    }

    return {
      operand: pair[1],
      ...opmeta,
    };
  });

  while (i < ops.length) {
    op = ops[i];
    i++;

    if (op.input === 'constantIndex') {
      if (op.operand < 128) {
        state.stack[state.stackIndex] = {
          val: state.constants[op.operand],
          consumed: false,
        };
      } else {
        state.stack[state.stackIndex] = {
          val: '^' + (op.operand - 128),
          consumed: false,
        };
      }
      state.stackIndex++;
    } else if (op.input === 'blockNumber') {
      state.stack[state.stackIndex] = {
        val: 'BLOCK_NUMBER()',
        consumed: false,
      };
      state.stackIndex++;
    } else if (op.input === 'blockTimestamp') {
      state.stack[state.stackIndex] = {
        val: 'BLOCK_TIMESTAMP()',
        consumed: false,
      };
      state.stackIndex++;
    } else if (op.input === 'takeFromStack') {
      applyOp(state, op);
    } else if (op.input === 'zipmap') {
      zipmap(state, op.operand);
    }
  }

  return state.stack
    .filter(item => item.consumed === false)
    .map(item => {
      item.consumed = true;
      return item.val;
    })
    .join(' ');
};

const applyOp = (state: State, op: OpMeta & { operand: number }) => {
  let baseIndex = state.stackIndex - op.operand;
  let top = state.stackIndex - 1;
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

const zipmap = (state: State, operand: number) => {
  let tempString = `ZIPMAP(\n`;

  const sourceIndex = operand & 0x07;
  const stepSize = (operand >> 3) & 0x03;
  const valLength = (operand >> 5) & 0x07;

  let tempArr = [];

  for (let i = 0; i <= valLength; i++) {
    tempArr.push(
      stepSize > 0
        ? JSON.stringify(
            Array.from(divideArray(state.stack[i].val, stepSize))
          ).replace(/,/g, ', ')
        : state.stack[i].val
    );
    state.stack[i].consumed = true;
  }

  tempArr.push(_eval(state, sourceIndex));

  tempString += tempArr.map(entry => '    ' + entry).join(`,\n`);
  tempString += `\n)`;

  state.stack[state.stackIndex] = {
    val: tempString,
    consumed: false,
  };
};

const pairs = (arr: Uint8Array): Array<[number, number]> => {
  const pairs = [];
  for (let i = 0; i < arr.length; i += 2) {
    pairs.push(arr.slice(i, i + 2));
  }
  /* @ts-ignore */
  return pairs;
};

const divideArray = (arr: Uint8Array, times: number): Uint8Array => {
  let n = arr.length;
  for (let i = 0; i < times; i++) {
    n = n / 2;
  }

  return arr.filter((_, i) => i % n === n - 1);
};
