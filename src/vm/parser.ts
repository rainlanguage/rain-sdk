import { OpMeta } from './OpMeta';
import { BigNumberish, BytesLike } from 'ethers';
import { AllStandardOps, StateConfig } from '../classes/vm';
import {
  callSize,
  concat,
  isBigNumberish,
  mapToRecord,
  op,
  selectLte,
  tierRange,
} from '../utils';

/**
 * Expression Notations
 */
enum Notations {
  prefix,
  postfix,
  infix,
}

/**
 * @public
 * Type of Parser's Error node 
 */
export type Error = {
  error: string;
  position: number[];
};

/**
 * @public
 * Type of Parser's Value node 
 */
export type Value = { 
  value: BigNumberish;
  position: number[];
  error?: string 
};

/**
 * @public
 * Type of Parser's Opcode node 
 */
export type Op = {
  opcode: {
    name: string;
    position: number[];
  };
  operand: number;
  output: number;
  position: number[];
  parens: number[];
  parameters: Node[];
  data?: any;
  error?: string;
  infixOp?: boolean;
};

/**
 * @public
 * Type of Parser's Node
 */
export type Node = Error | Value | Op;

/**
 * @public
 * Type of Parser's State
 */
export type State = {
  parse: {
    tree: Node[];
    moCache: (Op | Value)[][]
  };
  track: {
    notation: number[];
    parens: {
      open: number[],
      close: number[]
    }
  };
  depthLevel: number;
  ambiguity: boolean;
};

/**
 * @public
 * Type of a parse tree object
 */
export type ParseTree = Record<
  number,
  { tree: Node[]; position: number[] }
>;

/**
 * @public
 * Parser is a mini compiler to generate a valid StateConfig (deployable bytes) from a text script
 * 
 * @example
 * ```typescript
 * // to import
 * import { Parser } from "rain-sdk";
 * 
 * // to set the custom opmeta
 * Parser.set(OpMeta)
 * 
 * // to execute the parsing and get parse tree object and StateConfig
 * let parseTree;
 * let stateConfig
 * [ parseTree, stateConfig ] = Parser.get(textScript, customOpMeta, customMultiOutputPlaceholderChar);
 * 
 * // to get parse tree object only
 * let parseTree = Parser.getParseTree(textScript, customOpMeta, customMultiOutputPlaceholderChar);
 * 
 * // to get StateConfig only
 * let stateConfig = Parser.getStateConfig(textScript, customOpMeta, customMultiOutputPlaceholderChar);
 * 
 * // to build StateConfig (bytes) from ParseTree object or a Node or array of Node
 * let argument: Node || Node[] || ParseTree
 * let stateConfig = Parser.buildBytes(argument)
 * ```
 */
export class Parser {
  public static constants: BigNumberish[] = [];
  public static sources: BytesLike[] = [];
  public static parseTree: ParseTree = {};

  private static exp: string;
  private static input: string;
  private static placeholder: string = '_';
  private static treeArray: Record<number, Node[]> = {};
  private static data: any[] = Object.values(mapToRecord(OpMeta, ['data']));
  private static names: string[] = Object.values(mapToRecord(OpMeta, ['name']));
  private static aliases: string[] = Object.values(mapToRecord(OpMeta, ['aliases']));
  private static zeroOperandOps: boolean[] = 
    Object.values(mapToRecord(OpMeta, ['isZeroOperand']));
  private static pops: ((opcode: number, operand: number) => number)[] = 
    Object.values(mapToRecord(OpMeta, ['pops']));
  private static pushes: ((opcode: number, operand: number) => number)[] = 
    Object.values(mapToRecord(OpMeta, ['pushes']));
  private static state: State = {
    parse: {
      tree: [],
      moCache: []
    },
    track: {
      notation: [],
      parens: {
        open: [],
        close: []
      }
    },
    depthLevel: 0,
    ambiguity: false,
  };


  /**
   * @public
   * Method to get parse tree object and StateConfig
   * 
   * @param expression - the text expression
   * @param opmeta - (optional) custom opmeta
   * @param multiOutputPlaceholderChar - (optional) custom multi output placeholder character, default is "_" 
   * @returns Array of parse tree object and StateConfig
   */
  public static get(
    expression: string,
    opmeta?: typeof OpMeta,
    multiOutputPlaceholderChar?: string
  ): [ParseTree, StateConfig] {
    this.parse(expression, opmeta, multiOutputPlaceholderChar);
    return [this.parseTree, { constants: this.constants, sources: this.sources } ]
  }

  /**
   * @public
   * Method to get the parse tree object
   * 
   * @param expression - the text expression
   * @param opmeta - (optional) custom opmeta
   * @param multiOutputPlaceholderChar - (optional) custom multi output placeholder character, default is "_" 
   * @returns A parse tree object
   */
  public static getParseTree(
    expression: string,
    opmeta?: typeof OpMeta,
    multiOutputPlaceholderChar?: string
  ): ParseTree {
    this.parse(expression, opmeta, multiOutputPlaceholderChar);
    return this.parseTree;
  }

  /**
   * @public
   * Method to get the StateConfig
   * 
   * @param expression - the text expression
   * @param opmeta - (optional) custom opmeta
   * @param multiOutputPlaceholderChar - (optional) custom multi output placeholder character, default is "_"
   * @returns A StateConfig
   */
  public static getStateConfig(
    expression: string,
    opmeta?: typeof OpMeta,
    multiOutputPlaceholderChar?: string
  ): StateConfig {
    this.parse(expression, opmeta, multiOutputPlaceholderChar);
    return {
      constants: this.constants,
      sources: this.sources
    }
  }

  /**
   * @public
   * Method to get StateConfig (bytes) from a Parse Tree object or a Node or array of Nodes
   * 
   * @param parseTree - Tree like object (Parse Tree object or a Node or array of Nodes) to get the StateConfig from
   * @param offset - This argument is used internally and should be ignored when calling this method externally
   * @returns StateConfig
   */
  public static buildBytes(
    parseTree: 
      | Node 
      | Node[] 
      | Record<number, Node[]>,
    offset?: number
  ): StateConfig {
    let constants: BigNumberish[] = [];
    let sources: BytesLike[] = [];
    let sourcesCache: BytesLike[] = [];
    let argOffset: number[] = [];
    let nodes : Node[][];
    let isRecord = false;

    // convertion to a single type
    if ("0" in parseTree) {
      let array: any = Object.values(parseTree);
      if (!("0" in array[0])) nodes = [array as Node[]];
      else {
        argOffset = this.countArgs(
          parseTree as Record<number, Node[]>
        );
        isRecord = true;
        nodes = array as Node[][];
      }
    }
    else nodes = [[parseTree as Node]];

    // check for errors
    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < nodes[i].length; j++) {
        if (!this.errorCheck(nodes[i][j])) return {
          constants: [],
          sources: []
        }
      }
    }

    argOffset = isRecord 
      ? this.countArgs(parseTree as Record<number, Node[]>) 
      : [0, 0];
    let argCount = isRecord ? argOffset.pop()! : 0;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < nodes[i].length; j++) {
        let node = nodes[i][j];
        if ("value" in node) {
          if (isBigNumberish(node.value)) {
            if (constants.includes(node.value)) {
              sourcesCache.push(
                op(AllStandardOps.CONSTANT, constants.indexOf(node.value))
              );
            }
            else {
              sourcesCache.push(
                op(AllStandardOps.CONSTANT, constants.length)
              );
              constants.push(node.value);
            }
          }
          else if ((node.value as string).includes("arg")) {
            let index = Number(
              (node.value as string).replace("arg(", "").slice(0, -1)
            );
            sourcesCache.push(
              op(this.names.length, isRecord ? argOffset[i] + index : offset ? offset + index : 0)
            );
          }
          else if (node.value === "MaxUint256") {
            if (constants.includes("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")) {
              sourcesCache.push(
                op(AllStandardOps.CONSTANT, constants.indexOf(node.value))
              );
            }
            else {
              sourcesCache.push(
                op(AllStandardOps.CONSTANT, constants.length)
              );
              constants.push("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
            }
          }
        }
        else {
          for (let i = 0; i < (node as Op).parameters.length; i++) {
            let tmp = this.buildBytes(
              (node as Op).parameters[i],
              isRecord ? argOffset[i] : offset ? offset : 0
            );
            for (let k = 0; k < tmp.sources.length; k++) {
              for (let l = 0; l < tmp.sources[k].length; l++) {
                if (tmp.sources[k][l] === 0) {
                  (tmp.sources[k] as Uint8Array)[l + 1] += constants.length;
                }
              }
            }
            sourcesCache.push(...tmp.sources);
            constants.push(...tmp.constants)
          }
          sourcesCache.push(
            op(
              this.names.indexOf((node as Op).opcode.name),
              (node as Op).operand
            )
          )
        }
      }
      sources.push(concat(sourcesCache))
      sourcesCache = [];
    }
    if (argCount > 0) {
      ({ constants, sources } = this.updateArgs({constants, sources}));
    }
    return {
      constants,
      sources
    }
  }

  /**
   * Method to set the opmeta
   */
  private static set(opmeta_: typeof OpMeta) {
    this.data = Object.values(mapToRecord(opmeta_, ['data']));
    this.names = Object.values(mapToRecord(opmeta_, ['name']));
    this.aliases = Object.values(mapToRecord(opmeta_, ['aliases']));
    this.pops = Object.values(mapToRecord(opmeta_, ['pops']));
    this.pushes = Object.values(mapToRecord(opmeta_, ['pushes']));
    this.zeroOperandOps = Object.values(
      mapToRecord(opmeta_, ['isZeroOperand'])
    );
  }

  /**
   * Method to reset the class private properties
   */
  private static reset = () => {
    this.state.parse.tree = [];
    this.state.depthLevel = 0;
    this.state.track.parens.open = [];
    this.state.track.parens.close = [];
  };

  /**
   * Method to find index of next element within the text expression
   */
  private static findIndex = (str: string): number => {
    let indexes = [];
    indexes[0] = str.indexOf('(');
    indexes[1] = str.indexOf(')');
    indexes[2] = str.indexOf(' ');
    if (indexes[0] === -1 && indexes[1] === -1 && indexes[2] === -1) {
      return -1;
    } 
    else {
      let ret = indexes.filter((v) => v !== -1);
      return ret.reduce((a, b) => (a <= b ? a : b));
    }
  };

  /**
   * Method to trim the text expression from whitespaces and commas from both ends
   */
  private static trim = (str: string): [string, number, number] => {
    let leadingOffset = 0;
    let trailingOffset = 0;
    [str, trailingOffset] = this.trimRight(str);
    [str, leadingOffset] = this.trimLeft(str);
    return [str, leadingOffset, trailingOffset];
  };

  /**
   * Method to trim the right side of the text expression from whitespaces and commas
   */
  private static trimRight = (str: string): [string, number] => {
    let trailingOffset = 0;
    while (str.endsWith(" ") || str.endsWith(",")) {
      str = str.slice(0, -1);
      trailingOffset++;
    }
    return [str, trailingOffset];
  }

  /**
   * Method to trim the left side of the text expression from whitespaces and commas
   */
  private static trimLeft = (str: string): [string, number] => {
    let leadingOffset = 0;
    while (str.startsWith(' ') || str.startsWith(',')) {
      str = str.slice(1, str.length);
      leadingOffset++;
    }
    return [str, leadingOffset];
  };

  /**
   * The main workhorse of Rain Parser which parses the words used in an 
   * expression and is responsible for building the Parse Tree and Bytes 
   */
  private static parse(script: string, opmeta?: typeof OpMeta, placeholder?: string) {
    this.reset();
    this.sources = [];
    this.constants = [];
    this.treeArray = [];
    this.parseTree = {};
    opmeta ? this.set(opmeta) : this.set(OpMeta);
    this.placeholder = placeholder ? placeholder : '_';

    let originalText = script;
    let offset = 0;
    [script, , offset] = this.trim(script);
    let expressions: string[] = [];
    let positions = [[0, originalText.length - 1]];
    let hasCurlyBrackets = false;

    // remove indents
    while(script.includes(`\n`)) script = script.replace(`\n`, "");

    if (script.startsWith('{') && script.indexOf('}') > -1) {
      hasCurlyBrackets = true;
      positions = [[originalText.indexOf('{'), originalText.indexOf('}')]];
      while (script.startsWith('{') && script.indexOf('}') > -1) {
        let tmp = script.slice(0, script.indexOf('}') + 1);
        let length = tmp.length - script.length;
        if (length === 0) length = -script.length;
        script = script.slice(length);
        script = this.trim(script)[0];
        expressions.push(tmp.slice(1, tmp.length - 1));

        if (script.startsWith('{') && script.indexOf('}') > -1) {
          positions.push([
            originalText.length - script.length - offset,
            originalText.length - script.length - offset + script.indexOf('}'),
          ]);
        }
      }
    } else expressions.push(script);

    for (let i = 0; i < expressions.length; i++) {
      this.reset();
      this.input = expressions[i];
      this.exp = expressions[i];
      this.exp = this.trim(this.exp)[0];

      while (this.exp.length > 0) {
        this.exp = this.trimLeft(this.exp)[0];
        let entry = hasCurlyBrackets ? positions[i][0] + 1 : positions[i][0];
        let currentPosition = entry + this.input.length - this.exp.length;

        if (this.exp.startsWith('(')) {
          this.state.track.parens.open.push(currentPosition);
          this.exp = this.exp.replace('(', "");
          if (
            this.state.track.notation[this.state.track.notation.length - 1] !==
              Notations.prefix ||
            this.state.track.notation[this.state.track.notation.length - 2] !==
              this.state.depthLevel
          ) {
            this.updateTree({
              opcode: {
                name: 'unknown opcode',
                position: [],
              },
              operand: NaN,
              output: NaN,
              position: [currentPosition],
              parens: [],
              parameters: [],
              error: 'unknown opcode',
            });
          }
          this.state.depthLevel++;
          let op = this.getTreeElement(
            this.state.depthLevel - 1
          ) as Op;
          op.parens.push(currentPosition);
          this.updateTree(op, true);
        } 
        else if (this.exp.startsWith(')')) {
          if (this.state.track.parens.open.length > 0) {
            let multiOutputResolvingDepth = this.state.depthLevel - 1;
            this.exp = this.exp.replace(')', "");
            let postfix = this.isPostfix(this.exp);
            this.state.track.parens.close.push(currentPosition);
            if (this.isInfix()) {
              this.state.track.notation.pop();
              this.state.track.notation.pop();
              if (postfix || this.isPrefix()) {
                this.resolveInfix(true);
                multiOutputResolvingDepth++;
              }
              else this.resolveInfix(false);
            }
            if (postfix && this.isPrefix()) {
              let op = this.getTreeElement(
                this.state.depthLevel - 1
              ) as Op;
              this.updateTree({
                  error: 'invalid notation',
                  position: [
                    op.position[0],
                    Number(postfix[2]) + currentPosition + 1,
                  ],
                },
                true
              );
              this.state.track.notation.pop();
              this.state.track.notation.pop();
            } 
            else if (postfix) {
              this.resolvePostfix(
                postfix[0],
                Number(postfix[1]) + currentPosition + 1,
                Number(postfix[2]) + currentPosition + 1,
                postfix[3]
              );
              this.exp = this.input.slice(
                Number(postfix[2]) + currentPosition + 2 - entry,
                this.input.length
              )
            } 
            else if (this.isPrefix()) {
              this.resolvePrefix();
              this.state.track.notation.pop();
              this.state.track.notation.pop();
            }
            let item = this.getTreeElement(
              multiOutputResolvingDepth
            ) as Op;
            if (item.output > 1) this.resolveMultiOutput(
              item.output,
              multiOutputResolvingDepth
            );
            this.state.depthLevel--;
          }
          else {
            this.state.parse.tree.push({
              error: "invalid closing paren",
              position: [currentPosition]
            })
          }
        }
        else this.consume(currentPosition);
      }
      this.parseTree[i] = {
        position: positions.shift()!,
        tree: this.state.parse.tree.splice(-this.state.parse.tree.length)
      }
      this.treeArray[i] = this.parseTree[i].tree;
    }
    ({ constants: this.constants, sources: this.sources } = this.buildBytes(this.treeArray));
  }

  /**
   * Method to check if the current state of parsing of a node is prefix or not
   */
  private static isPrefix(): boolean {
    return (
      this.state.track.notation[this.state.track.notation.length - 1] ===
        Notations.prefix &&
      this.state.track.notation[this.state.track.notation.length - 2] ===
        this.state.depthLevel - 1
    )
  }

  /**
   * * Method to check if the current state of parsing of a node is infix or not
   */
  private static isInfix(): boolean {
    return (
      this.state.track.notation[this.state.track.notation.length - 1] ===
        Notations.infix &&
      this.state.track.notation[this.state.track.notation.length - 2] ===
        this.state.depthLevel
    )
  }

  /**
   * * Method to check if the current state of parsing of a node is postfix or not
   */
  private static isPostfix(str: string): string[] | undefined {
    if (!str.length) return undefined;
    if (str[0] === ' ' || str[0] === '(' || str[0] === ')') return undefined;
    if (str.startsWith(',')) {
      let offset = 0;
      while (str.startsWith(',')) {
        str = str.replace(',', "");
        offset++;
      }
      if (str[0] === ' ' || str[0] === '(' || str[0] === ')') return undefined;
      for (let i = 0; i < this.names.length; i++) {
        if (str.startsWith(this.names[i])) {
          return [
            this.names[i],
            offset.toString(),
            (offset + this.names[i].length - 1).toString(),
            'illigal characters between opcode and parenthesis',
          ];
        }
      }
      for (let i = 0; i < this.aliases.length; i++) {
        if (this.aliases[i]) {
          for (let j = 0; j < this.aliases[i].length; j++) {
            if (str.startsWith(this.aliases[i][j])) {
              return [
                this.names[i],
                offset.toString(),
                (offset + this.aliases[i][j].length - 1).toString(),
                'illigal characters between opcode and parenthesis',
              ];
            }
          }
        }
      }
    }
    for (let i = 0; i < this.names.length; i++) {
      if (str.startsWith(this.names[i])) {
        if (str.replace(this.names[i], "").startsWith('(')) {
          this.state.ambiguity = true;
          return [
            this.names[i],
            '0',
            (this.names[i].length - 1).toString(),
            'ambiguous expression/opcode',
          ];
        }
        else {
          return [this.names[i], '0', (this.names[i].length - 1).toString()];
        }
      }
    }
    for (let i = 0; i < this.aliases.length; i++) {
      if (this.aliases[i]) {
        for (let j = 0; j < this.aliases[i].length; j++) {
          if (str.startsWith(this.aliases[i][j])) {
            if (str.replace(this.aliases[i][j], "").startsWith('(')) {
              this.state.ambiguity = true;
              return [
                this.names[i],
                '0',
                (this.aliases[i][j].length - 1).toString(),
                'ambiguous expression/opcode',
              ];
            } 
            else {
              return [
                this.names[i],
                '0',
                (this.aliases[i][j].length - 1).toString(),
              ];
            }
          }
        }
      }
    }
    return undefined;
  }

  /**
   * Method to get the last item of a Node at a specified depth level of parse tree
   */
  private static getTreeElement(depthLevel: number): Node {
    let tmp: Node[][] = [];
    tmp.push(this.state.parse.tree);
    for (let i = 0; i < depthLevel; i++) {
      tmp.push(
        (tmp[tmp.length - 1][tmp[tmp.length - 1].length - 1] as Op)
          .parameters
      );
    }
    return tmp[tmp.length - 1][tmp[tmp.length - 1].length - 1];
  }

  /**
   * Method to update the elements of a Node
   */
  private static updateTree(item: Node, replace?: boolean) {
    if (replace) {
      let tmp: Node[][] = [];
      tmp.push(this.state.parse.tree);
      for (let i = 0; i < this.state.depthLevel - 1; i++) {
        tmp.push(
          (tmp[tmp.length - 1][tmp[tmp.length - 1].length - 1] as Op)
            .parameters
        );
      }
      tmp[tmp.length - 1].pop();
      tmp[tmp.length - 1].push(item);
      while (tmp.length > 1) {
        let updatedParams = tmp.pop()!;
        (tmp[tmp.length - 1][
          tmp[tmp.length - 1].length - 1
        ] as Op).parameters = updatedParams;
      }
      this.state.parse.tree = tmp[0];
    }
    else {
      let tmp: Node[][] = [];
      tmp.push(this.state.parse.tree);
      for (let i = 0; i < this.state.depthLevel; i++) {
        tmp.push(
          (tmp[tmp.length - 1][tmp[tmp.length - 1].length - 1] as Op)
            .parameters
        );
      }
      tmp[tmp.length - 1].push(item);
      while (tmp.length > 1) {
        let updatedParams = tmp.pop()!;
        (tmp[tmp.length - 1][
          tmp[tmp.length - 1].length - 1
        ] as Op).parameters = updatedParams;
      }
      this.state.parse.tree = tmp[0];
    }
  }

  /**
   * Method to resolve prefix notations at current state of parsing
   */
  private static resolvePrefix() {
    this.state.track.parens.open.pop();
    let endPosition = this.state.track.parens.close.pop()!;
    let tmp: Node[][] = [];
    tmp.push(this.state.parse.tree);
    for (let i = 0; i < this.state.depthLevel - 1; i++) {
      tmp.push(
        (tmp[tmp.length - 1][tmp[tmp.length - 1].length - 1] as Op)
          .parameters
      );
    }
    let node = tmp[tmp.length - 1][tmp[tmp.length - 1].length - 1] as Op;
    node.position.push(endPosition);
    node.parens.push(endPosition);

    if (node.error === 'no closing parenthesis') node.error = undefined;
    if (!node.error) {
      tmp[tmp.length - 1][tmp[tmp.length - 1].length - 1] = this.resolveOp(node);
    }
    while (tmp.length > 1) {
      let resolvedExp = tmp.pop()!;
      (tmp[tmp.length - 1][
        tmp[tmp.length - 1].length - 1
      ] as Op).parameters = resolvedExp;
    }
    this.state.parse.tree = tmp[0];
  }

  /**
   * Method to resolve postfix notations at current state of parsing
   */
  private static resolvePostfix(
    opcode: string,
    startPosition: number,
    endPosition: number,
    error?: string
  ) {
    this.state.track.parens.open.pop();
    let tmp: Node[][] = [];
    tmp.push(this.state.parse.tree);
    for (let i = 0; i < this.state.depthLevel - 1; i++) {
      tmp.push(
        (tmp[tmp.length - 1][tmp[tmp.length - 1].length - 1] as Op)
          .parameters
      );
    }
    let node = tmp[tmp.length - 1][tmp[tmp.length - 1].length - 1] as Op;
    tmp[tmp.length - 1][tmp[tmp.length - 1].length - 1] = this.resolveOp({
      opcode: {
        name: opcode,
        position: [startPosition, endPosition],
      },
      operand: this.zeroOperandOps[this.names.indexOf(opcode)] ? 0 : NaN,
      output: this.pushes[this.names.indexOf(opcode)].name === 'zero' || 'one' || 'two' || 'three'
        ? this.pushes[this.names.indexOf(opcode)](0, 0)
        : NaN,
      position: [node.position[0], endPosition],
      parens: [node.position[0], this.state.track.parens.close.pop()!],
      parameters: node.parameters,
      data: this.data[this.names.indexOf(opcode)],
      error
    });
    while (tmp.length > 1) {
      let resolvedExp = tmp.pop()!;
      (tmp[tmp.length - 1][
        tmp[tmp.length - 1].length - 1
      ] as Op).parameters = resolvedExp;
    }
    this.state.parse.tree = tmp[0];
  }

  /**
   * Method to resolve infix notations at current state of parsing
   */
  private static resolveInfix(isParameter: boolean) {
    let tmp: Node[][] = [];
    tmp.push(this.state.parse.tree);
    for (let i = 0; i < this.state.depthLevel; i++) {
      tmp.push(
        (tmp[tmp.length - 1][tmp[tmp.length - 1].length - 1] as Op)
          .parameters
      );
    }
    let err = false;
    let op: Node;
    let elements: Node[] = tmp[tmp.length - 1];
    let node = tmp[tmp.length - 2][tmp[tmp.length - 2].length - 1] as Op;
    let closeParenPosition = 
      this.state.track.parens.close[this.state.track.parens.close.length - 1];
    
    // if prefix-infix
    if ('opcode' in elements[0] && elements[0].infixOp) {
      op = elements[0];
      op.position.push(...node.parens);
      op.parens.push(...node.parens);
      for (let i = 1; i < elements.length; i++) {
        let item = elements[i];
        if ('opcode' in item && item.infixOp) {
          err = true;
          op.error = 'invalid infix expression';
          break;
        }
      }
      if (!err) op.parameters = elements.slice(1, elements.length);
      op.position.push(closeParenPosition);
      op.parens.push(closeParenPosition);
    } 
    // if postfix-infix
    else if (
      'opcode' in elements[elements.length - 1] &&
      (elements[elements.length - 1] as Op).infixOp
    ) {
      op = elements[elements.length - 1] as Op;
      op.position.push(...node.parens);
      op.parens.push(...node.parens);
      for (let i = 0; i < elements.length - 1; i++) {
        let item = elements[i];
        if ('opcode' in item && item.infixOp) {
          err = true;
          op.error = 'invalid infix expression';
          break;
        }
      }
      if (!err) op.parameters = elements.slice(0, -1);
      op.position.push(closeParenPosition);
      op.parens.push(closeParenPosition);
    }

    // if infix-infix
    else {
      let params: Node[] = [elements[0]];
      if ('opcode' in elements[1] && elements[1].infixOp) {
        op = elements[1];
        op.position.push(...node.parens);
        op.parens.push(...node.parens);
        for (let i = 2; i < elements.length; i++) {
          if (i % 2 === 0) params.push(elements[i]);
          else {
            let item = elements[i];
            if ('opcode' in item && item.infixOp && op.opcode.name === item.opcode.name) {
              op.opcode.position.push(...item.opcode.position);
            } 
            else {
              if ('opcode' in item) {
                op.error = `invalid opcode format at position ${item.opcode.position}`;
              }
              else {
                op.error = `expected opcode but got value at position ${item.position}`;
              }
              err = true;
              break;
            }
          }
        }
        if (!err) op.parameters = params;
        op.position.push(closeParenPosition);
        op.parens.push(closeParenPosition);
      } 
      else {
        op = {
          error: 'invalid infix expression',
          position: [
            (tmp[tmp.length - 2][tmp[tmp.length - 2].length - 1] as Op)
              .parens[0],
            closeParenPosition,
          ],
        };
        err = true;
      }
    }
    if (!err) op = this.resolveOp(op as Op);
    if (isParameter) {
      let item = this.getTreeElement(this.state.depthLevel - 1) as Op;
      item.parameters = [op];
      op = item;
    }
    else {
      this.state.track.parens.open.pop();
      this.state.track.parens.close.pop();
    }
    this.updateTree(op, true);
  }

  /**
   * Method to resolve multi output nodes at current state of parsing
   */
  public static resolveMultiOutput = (totalCount: number, depthLevel: number) => {
    let count = 0;
    let tmp: Node[][] = [];
    const isOutput = (element: Node): boolean => {
      return ("value" in element && element.value === this.placeholder);
    }
    tmp.push(this.state.parse.tree);
    for (let i = 0; i < depthLevel; i++) {
      tmp.push(
        (tmp[tmp.length - 1][tmp[tmp.length - 1].length - 1] as Op)
          .parameters
      );
    }
    while (tmp.length > 1) {
      if (count !== totalCount) {
        for (let i = tmp[tmp.length - 1].length - 2; i > -1; i--) {
          if (count !== totalCount) {
            if (!isOutput(tmp[tmp.length - 1][i])) {
              (tmp[tmp.length - 2][tmp[tmp.length - 2].length - 1] as Op).error = 
                `illigal placement of outputs, parameter ${i - 1} cannot be accessed by this opcode`;
              break;
            }
            else {
              count++;
              tmp[tmp.length - 1][i] = this.state.parse.moCache[
                this.state.parse.moCache.length - 1
              ].pop()!;
            }
          }
          else break;
        }
      }
      let resolvedOutputs = tmp.pop()!;
      (tmp[tmp.length - 1][tmp[tmp.length - 1].length - 1] as Op).parameters = resolvedOutputs;
    }
    if (count !== totalCount) {
      let item = tmp[0].pop()!;
      tmp[0].push(...this.state.parse.moCache[this.state.parse.moCache.length - 1]);
      this.state.parse.moCache.pop();
      tmp[0].push(item);
    }
  }

  /**
   * Method that resolves the opcode Node once its respective closing paren has consumed
   */
  private static resolveOp = (opNode: Op): Op => {
    let op = this.names.indexOf(opNode.opcode.name);
    if (
      op === AllStandardOps.STACK ||
      op === AllStandardOps.CONTEXT ||
      op === AllStandardOps.STORAGE
    ) {
      opNode.operand = NaN;
      if (
        opNode.parameters.length === 1 &&
        'value' in opNode.parameters[0] &&
        Number(opNode.parameters[0].value) < 256
      ) {
        let operand = Number(opNode.parameters[0].value);
        opNode.parameters = [];
        opNode.operand = operand;
        opNode.output = 1;
      } 
      else if (opNode.parameters.length !== 1) {
        opNode.parameters = [
          {
            error: `invalid number of parameters, expected 1 parameter but got ${opNode.parameters.length}`,
            position: [
              opNode.parameters[0].position[0],
              opNode.parameters[opNode.parameters.length - 1].position[1],
            ],
          },
        ];
      } 
      else if (
        'value' in opNode.parameters[0] &&
        Number(opNode.parameters[0].value) > 255
      ) {
        opNode.parameters[0] = {
          error: `${opNode.opcode.name} operand must be of range 0 - 255`,
          position: opNode.parameters[0].position,
        }; 
      } 
      else {}
    } 
    else if (op === AllStandardOps.ZIPMAP) {
      opNode.operand = NaN;
      opNode.output = NaN;
      if (opNode.parameters.length > 2 && opNode.parameters.length < 11) {
        if (
          'value' in opNode.parameters[0] &&
          'value' in opNode.parameters[1]
        ) {
          opNode.output = 2 ** Number(opNode.parameters[1].value);
          if (
            Number(opNode.parameters[0].value) < 8 &&
            Number(opNode.parameters[1].value) < 4
          ) {
            opNode.operand = callSize(
              Number(opNode.parameters[0].value),
              Number(opNode.parameters[1].value),
              opNode.parameters.length - 2
            );
            this.state.parse.moCache.push([]);
            for (let i = 0; i < opNode.output - 1; i++) {
              this.state.parse.moCache[this.state.parse.moCache.length - 1].push({
                value: `${opNode.opcode.name} output ${i + 1} placeholder`,
                position: [],
              });
            }
            opNode.parameters.shift();
            opNode.parameters.shift();
          } 
          else {
            if (Number(opNode.parameters[0].value) > 7) {
              opNode.parameters[0] = {
                error: 'invalid value for ZIPMAP SourceIndex parameter',
                position: opNode.parameters[0].position,
              };
            } 
            if (Number(opNode.parameters[1].value) > 3) {
              opNode.parameters[1] = {
                error: 'invalid value for ZIPMAP LoopSize parameter',
                position: opNode.parameters[1].position,
              };
              opNode.output = NaN;
            } 
          }
        } 
        else {}
      } 
      else {
        opNode.parameters = [
          {
            error: `invalid parameters: expected at least 3 and at most 10 parameters, but got ${opNode.parameters.length}`,
            position: [
              opNode.parameters[0].position[0],
              opNode.parameters[opNode.parameters.length - 1].position[1],
            ],
          },
        ];
      }
    } 
    else if (op === AllStandardOps.ITIERV2_REPORT) {
      opNode.operand = NaN;
      if (
        opNode.parameters.length === 2 ||
        opNode.parameters.length === 3 ||
        opNode.parameters.length === 10
      ) {
        opNode.operand = opNode.parameters.length - 2;
      } 
      else {
        opNode.parameters = [
          {
            error: `invalid parameters: expected either 2 or 3 or 10 parameters, but got ${opNode.parameters.length}`,
            position: [
              opNode.parameters[0].position[0],
              opNode.parameters[opNode.parameters.length - 1].position[1],
            ],
          },
        ];
      }
    } 
    else if (op === AllStandardOps.ITIERV2_REPORT_TIME_FOR_TIER) {
      opNode.operand = NaN;
      if (
        opNode.parameters.length === 3 ||
        opNode.parameters.length === 4 ||
        opNode.parameters.length === 11
      ) {
        opNode.operand = opNode.parameters.length - 3;
        if (
          !(
            'value' in opNode.parameters[2] &&
            Number(opNode.parameters[2].value) > -1 &&
            Number(opNode.parameters[2].value) < 9
          )
        ) {
          opNode.operand = opNode.parameters.length - 3;
          opNode.parameters[2] = {
            error: 'invalid tier level',
            position: opNode.parameters[2].position,
          };
        }
      } 
      else {
        opNode.parameters = [
          {
            error: `invalid parameters: expected either 3 or 4 or 11 parameters, but got ${opNode.parameters.length}`,
            position: [
              opNode.parameters[0].position[0],
              opNode.parameters[opNode.parameters.length - 1].position[1],
            ],
          },
        ];
      }
    } 
    else if (op === AllStandardOps.SELECT_LTE) {
      opNode.operand = NaN;
      if (opNode.parameters.length > 4 && opNode.parameters.length < 35) {
        if (
          'value' in opNode.parameters[0] &&
          'value' in opNode.parameters[1]
        ) {
          if (
            Number(opNode.parameters[0].value) < 2 &&
            Number(opNode.parameters[1].value) < 3
          ) {
            opNode.operand = selectLte(
              Number(opNode.parameters[0].value),
              Number(opNode.parameters[0].value),
              opNode.parameters.length - 2
            );
            opNode.parameters.shift();
            opNode.parameters.shift();
          }
          else {
            if (Number(opNode.parameters[0].value) > 1) {
              opNode.parameters[0] = {
                error: 'invalid value for SELECT_LTE logic, must be between 0 - 1',
                position: opNode.parameters[0].position,
              };
            }
            if (Number(opNode.parameters[1].value) > 2) {
              opNode.parameters[1] = {
                error: 'invalid value for SELECT_LTE mode, must be between 0 - 2',
                position: opNode.parameters[1].position,
              };
            }
          }
        }
        else {}
      }
      else {
        opNode.parameters = [
          {
            error: `invalid parameters: expected at least 4 and at most 34 parameters in total, but got ${opNode.parameters.length}`,
            position: [
              opNode.parameters[0].position[0],
              opNode.parameters[opNode.parameters.length - 1].position[1],
            ],
          },
        ];
      }
    }
    else if (op === AllStandardOps.UPDATE_TIMES_FOR_TIER_RANGE) {
      opNode.operand = NaN;
      if (opNode.parameters.length === 4) {
        if (
          'value' in opNode.parameters[0] &&
          'value' in opNode.parameters[1]
        ) {
          if (
            Number(opNode.parameters[0].value) < 9 &&
            Number(opNode.parameters[1].value) < 9
          ) {
            opNode.operand = tierRange(
              Number(opNode.parameters[0].value),
              Number(opNode.parameters[1].value)
            );
            opNode.parameters.shift();
            opNode.parameters.shift();
          } 
          else {
            if (Number(opNode.parameters[0].value) > 8) {
              opNode.parameters[0] = {
                error: 'invalid value for start tier',
                position: opNode.parameters[0].position,
              };
            }
            if (Number(opNode.parameters[1].value) > 8) {
              opNode.parameters[1] = {
                error: 'invalid value for end tier',
                position: opNode.parameters[1].position,
              };
            }
          }
        } 
        else {} 
      }
      else {
        opNode.parameters = [
          {
            error: `invalid parameters: expected at least 4 parameters in total, but got ${opNode.parameters.length}`,
            position: [
              opNode.parameters[0].position[0],
              opNode.parameters[opNode.parameters.length - 1].position[1],
            ],
          },
        ];
      }
    }
    else if (op === AllStandardOps.IERC1155_BALANCE_OF_BATCH) {
      opNode.operand = NaN;
      opNode.output = NaN;
      if (
        opNode.parameters.length > 2 &&
        opNode.parameters.length % 2 === 1
      ) {
        opNode.operand = (opNode.parameters.length - 1) / 2;
        opNode.output = (opNode.parameters.length - 1) / 2;
        this.state.parse.moCache.push([]);
        for (let i = 0; i < opNode.output - 1; i++) {
          this.state.parse.moCache[this.state.parse.moCache.length - 1].push({
            value: `${opNode.opcode.name} output ${i + 1} placeholder`,
            position: [],
          });
        }
      } 
      else {
        opNode.parameters = [{
          error: `invalid number of parameters`,
          position: [
            opNode.parameters[0].position[0],
            opNode.parameters[opNode.parameters.length - 1].position[1],
          ],
        }];
      }
    }
    else if (this.pops[op].name !== 'oprnd') {
      if (this.pops[op](0, 0) === opNode.parameters.length) {
        opNode.operand = this.pops[op](0, 0);
        if (this.zeroOperandOps[op]) {
          opNode.operand = 0;
        } 
      }
      else {
        opNode.operand = NaN;
        opNode.parameters = [{
          error: `invalid number of parameters`,
          position: [
            opNode.parameters[0].position[0],
            opNode.parameters[opNode.parameters.length - 1].position[1],
          ],
        }];
      }
    }
    else if (this.pops[op].name === 'oprnd') {
      opNode.operand = opNode.parameters.length;
      if (this.zeroOperandOps[op]) {
        opNode.operand = 0;
      }
    }
    return opNode;
  };

  /**
   * Method that consumes the words from the expression and updates the parse tree with their Node type
   */
  private static consume(entry: number): void {
    if (this.exp.length > 0) {
      let check_ = true;
      let index_ =
        this.findIndex(this.exp) < 0
          ? this.exp.length
          : this.findIndex(this.exp) === 0
          ? 1
          : this.findIndex(this.exp);

      let str_ = this.exp.slice(0, index_);
      let consumee_ = str_;
      str_ = this.trim(str_)[0];
      let startPosition = entry + consumee_.indexOf(str_);

      if (str_.includes(',')) {
        this.state.parse.tree.push({
          error: `invalid comma: ${str_}`,
          position: [startPosition, startPosition + str_.length - 1],
        });
        this.exp = this.exp.replace(consumee_, "");
      }
      else {
        for (let i = 0; i < this.aliases.length; i++) {
          if (this.aliases[i] && this.aliases[i].includes(str_)) {
            this.exp = this.exp.replace(consumee_, "");
            let op: Op = {
              opcode: {
                name: this.names[i],
                position: [startPosition, startPosition + str_.length - 1],
              },
              operand: this.zeroOperandOps[i] ? 0 : NaN,
              output: this.pushes[i].name === 'zero' || 'one' || 'two' || 'three'
                ? this.pushes[i](0, 0)
                : NaN,
              position: [startPosition],
              parens: [],
              parameters: [],
              data: this.data[i],
            };
            if (this.exp.startsWith('(')) {
              this.state.track.notation.push(
                this.state.depthLevel,
                Notations.prefix
              );
              if (consumee_.endsWith(str_)) {
                op.error = this.state.ambiguity
                  ? 'ambiguous expression/opcode'
                  : 'no closing parenthesis';
                this.updateTree(op);
                if (this.state.ambiguity) this.state.ambiguity = false;
              } 
              else {
                op.error = this.state.ambiguity
                  ? 'ambiguous expression/opcode'
                  : 'illigal characters between opcode and parenthesis';
                this.updateTree(op);
                if (this.state.ambiguity) this.state.ambiguity = false;
              }
            } 
            else {
              if (this.pops[i].name !== 'zero' && !this.isInfix()) {
                this.state.track.notation.push(
                  this.state.depthLevel,
                  Notations.infix
                );
              }
              op.position = [];
              op.error = this.state.ambiguity
                ? 'ambiguous expression/opcode'
                : undefined;
              op.infixOp = this.pops[i].name !== 'zero' ? true : undefined;
              this.updateTree(op);
              if (this.state.ambiguity) this.state.ambiguity = false;
            }
            check_ = false;
            break;
          }
        }
        if (check_) {
          if (this.names.includes(str_)) {
            this.state.track.notation.push(
              this.state.depthLevel,
              Notations.prefix
            );
            this.exp = this.exp.replace(consumee_, "");
            let enum_ = this.names.indexOf(str_);
            let op: Op = {
              opcode: {
                name: str_,
                position: [startPosition, startPosition + str_.length - 1],
              },
              operand: this.zeroOperandOps[this.names.indexOf(str_)] ? 0 : NaN,
              output: this.pushes[enum_].name === 'zero' || 'one' || 'two' || 'three'
                ? this.pushes[this.names.indexOf(str_)](0, 0)
                : NaN,
              position: [startPosition],
              parens: [],
              parameters: [],
              data: this.data[this.names.indexOf(str_)],
            };
            if (this.exp.startsWith('(')) {
              if (consumee_.endsWith(str_)) {
                op.error = this.state.ambiguity
                  ? 'ambiguous expression/opcode'
                  : 'no closing parenthesis';
                this.updateTree(op);
                if (this.state.ambiguity) this.state.ambiguity = false;
              } 
              else {
                op.error = this.state.ambiguity
                  ? 'ambiguous expression/opcode'
                  : 'illigal characters between opcode and parenthesis';
                this.updateTree(op);
                if (this.state.ambiguity) this.state.ambiguity = false;
              }
            } 
            else {
              if (this.pops[enum_].name !== 'zero' && !this.isInfix()) {
                this.state.track.notation.push(
                  this.state.depthLevel,
                  Notations.infix
                );
              }
              op.position = [];
              op.error = this.state.ambiguity
                ? 'ambiguous expression/opcode'
                : undefined;
              op.infixOp = this.pops[enum_].name !== 'zero'
                ? true
                : undefined;
              this.updateTree(op);
              if (this.state.ambiguity) this.state.ambiguity = false;
            }
          } 
          else if (str_ === 'arg') {
            this.exp = this.exp.replace(consumee_, "");
            let i_ = this.exp.indexOf(')') + 1;
            str_ = str_ + this.exp.slice(0, i_);
            this.exp = this.exp.slice(i_, this.exp.length);
            this.updateTree({
              value: str_,
              position: [startPosition, startPosition + str_.length - 1],
            });
          } 
          else if (str_ === this.placeholder) {
            this.updateTree({
              value: this.placeholder,
              position: [startPosition, startPosition + str_.length - 1],
            });
            this.exp = this.exp.replace(consumee_, "");
          } 
          else if (isBigNumberish(str_)) {
            this.updateTree({
              value: str_,
              position: [startPosition, startPosition + str_.length - 1],
            });
            this.exp = this.exp.replace(consumee_, "");
          }
          else if (str_ === "MaxUint256" || str_ === "maxUint256") {
            this.updateTree({
              value: "MaxUint256",
              position: [startPosition, startPosition + str_.length - 1],
            });
            this.exp = this.exp.replace(consumee_, "");
          }
          else {
            this.exp = this.exp.replace(consumee_, "");
            if (this.exp.startsWith('(')) {
              this.updateTree({
                opcode: {
                  name: 'unknown opcode',
                  position: [startPosition, startPosition + str_.length],
                },
                operand: NaN,
                output: NaN,
                position: [startPosition],
                parens: [],
                parameters: [],
                error: this.state.ambiguity
                  ? 'ambiguous expression/opcode'
                  : 'unknown opcode',
              });
              if (this.state.ambiguity) this.state.ambiguity = false;
            } 
            else {
              this.updateTree({
                error: `unknown word: ${str_}`,
                position: [startPosition, startPosition + str_.length - 1],
              });
            }
          }
        }
      }
    }
  }

  /**
   * Method to check for errors in parse tree once an expression is fully parsed
   */
  private static errorCheck(element: Node): boolean {
    if ("opcode" in element) {
      if (element.error !== undefined) return false;
      else {
        for (let i = 0; i < element.parameters.length; i++) {
          if (!this.errorCheck(element.parameters[i])) return false;
        }
        return true;
      }
    }
    else if ("error" in element) return false;
    else return true;
  }

  /**
   * Method to update the arguments of zipmaps after full bytes build (if any present)
   */
  public static updateArgs(config: StateConfig): StateConfig {
    for (let i = 0; i < config.sources.length; i++) {
      for (let j = 0; j < config.sources[i].length; j++) {
        if (config.sources[i][j] === this.names.length) {
          (config.sources[i] as Uint8Array)[j] = 0;
          (config.sources[i] as Uint8Array)[j + 1] += config.constants.length;
        }
      }
    }
    return config;
  }

  /**
   * Method to count all arguments of all zipmaps (if any present)
   */
  private static countArgs(tree: Record<number, Node[]>): number[] {
    let count = 0;
    let argCache: number[] = [];
    let elements = Object.values(tree);
    const counter = (element: Node): number[] => {
      let c_: number[] = [];
      if ("opcode" in element) {
        if (element.opcode.name === "ZIPMAP") {
          c_.push(element.parameters.length);
        }
        for (let i = 0; i < element.parameters.length; i++) {
          c_.push(...counter(element.parameters[i]));
        }
      }
      return c_;
    }
    for (let i = 0; i < elements.length; i++) {
      for (let j = 0; j < elements[i].length; j++) {
        argCache.push(...counter(elements[i][j]));
      }
    }
    for (let i = 0; i < argCache.length; i++) {
      count += argCache[i];
    }
    argCache.unshift(0, 0);
    argCache.unshift(count);
    return argCache;
  }
}

