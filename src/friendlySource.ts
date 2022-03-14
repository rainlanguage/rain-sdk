export interface OpMeta {
  opcode: number;
  name: string;
  input: string;
}

export const generateHumanFriendlySource = (
  source: Uint8Array,
  constants: Array<number>,
  opmetas: Array<OpMeta>
) => {
  const ops = pairs(source).map(pair => ({
    operand: pair[0],
    ...opmetas.find(opmeta => opmeta.opcode === pair[1]),
  }));

  const stack = [];
  let stackIndex = 0;
  let baseIndex = 0;
  let i = ops.length - 1;
  let cursor = 0;
  let op: OpMeta & { operand: number };
  let tempString = '';
  let tempArr = [];

  while (i >= 0) {
    op = ops[i];
    i--;

    if (op.input === 'constantIndex') {
      stack[stackIndex] = constants[op.operand];
      stackIndex++;
    } else if (op.input === 'blockNumber') {
      stack[stackIndex] = 'BLOCK_NUMBER()';
      stackIndex++;
    } else if (op.input === 'takeFromStack') {
      stackIndex -= op.operand;
      baseIndex = stackIndex;
      cursor = baseIndex + op.operand - 1;
      tempString = op.name + '(';
      tempArr = [];
      while (cursor >= baseIndex) {
        tempArr.push(stack[cursor]);
        cursor--;
      }
      tempString += tempArr.join(', ');
      tempString += ')';
      stack[baseIndex] = tempString;
      stackIndex++;
    }
  }

  return stack[0];
};

const pairs = (arr: Uint8Array): Array<[number, number]> => {
  const pairs = [];
  for (let i = 0; i < arr.length; i += 2) {
    pairs.push(arr.slice(i, i + 2));
  }
  return pairs;
};
