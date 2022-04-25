export interface OpMeta {
  opcode: number;
  name: string;
  input: string;
}

export const generateHumanFriendlySource = (
  sources: Array<Uint8Array>,
  constants: Array<number> | Array<Uint8Array>,
  opmetas: Array<OpMeta>
) => {
  const ops = pairs(sources.flatMap(uints => Array.from(uints))).map(pair => ({
    operand: pair[0],
    ...opmetas.find(opmeta => opmeta.opcode === pair[1]),
  }));

  const stack = [];
  let stackIndex = 0;
  let baseIndex = 0;
  let i = 0;
  let top = 0;
  let cursor = 0;
  let op: OpMeta & { operand: number };
  let tempString = '';
  let tempArr = [];

  while (i < ops.length) {
    op = ops[i];
    i++;

    if (op.input === 'constantIndex') {
      stack[stackIndex] = {
        val: constants[op.operand],
        consumed: false,
      };
      stackIndex++;
    } else if (op.input === 'blockNumber') {
      stack[stackIndex] = {
        val: 'BLOCK_NUMBER()',
        consumed: false,
      };
      stackIndex++;
    } else if (op.input === 'blockTimestamp') {
      stack[stackIndex] = {
        val: 'BLOCK_TIMESTAMP()',
        consumed: false,
      };
      stackIndex++;
    } else if (op.input === 'takeFromStack') {
      baseIndex = stackIndex - op.operand;
      top = stackIndex - 1;
      cursor = baseIndex;
      tempString = op.name + '(';
      tempArr = [stack[cursor].val];
      stack[cursor].consumed = true;
      while (cursor < top) {
        cursor++;
        tempArr.push(stack[cursor].val);
        stack[cursor].consumed = true;
      }
      tempString += tempArr.join(', ');
      tempString += ')';
      stack[baseIndex] = {
        val: tempString,
        consumed: false,
      };
      stackIndex = baseIndex + 1;
    }
  }

  return stack
    .filter(item => item.consumed === false)
    .map(item => item.val)
    .join(' ');
};

const pairs = (arr: Array<number>): Array<[number, number]> => {
  const pairs = [];
  for (let i = 0; i < arr.length; i += 2) {
    pairs.push(arr.slice(i, i + 2));
  }
  return pairs;
};
