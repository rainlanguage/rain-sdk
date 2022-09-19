import { OpMeta } from './OpMeta';
import { BigNumberish, BytesLike } from 'ethers';
import { AllStandardOps, StateConfig } from '../classes/vm';
import { callSize, concat, isBigNumberish, mapToRecord, op, selectLte, tierRange } from '../utils';

/**
 * @public
 */
export type Error = {
  error: string,
  position: number[]
}

/**
 * @public
 */
export type ParseTree = Error | {
  opcode: {
    name: string,
    position: number[]
  },
  operand: number,
  output: number,
  parameters: (
    ParseTree |
    { value: BigNumberish, position: number[] }
  )[],
  position: number[],
  data?: any,
};

/**
 * @public
 */
export type ParseStack =
  | "("
  | Error
  | ParseTree
  | { op: string, position: number[] }
  | { value: BigNumberish, position: number[] };

/**
 * @public
 */
export type State = {
  parse: {
    stack: ParseStack[],
    tree: ParseTree[]
  }
  srcCache: Uint8Array[],
  arguments: {
    has: boolean,
    offset: number,
    count: number,
    cache: number[]
  },
  zipmaps: number,
  multiOutputCache: (
    Exclude<ParseTree, Error> |
    { value: BigNumberish, position: number[] }
  )[]
}

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
 * // to get only parse tree object
 * let parseTree = Parser.getParseTree(textScript, customOpMeta, customMultiOutputPlaceholderChar);
 * 
 * // to get only StateConfig
 * let stateConfig = Parser.getStateConfig(textScript, customOpMeta, customMultiOutputPlaceholderChar);
 * ```
 */
export class Parser {
  // StateConfig Properties of this class
  public static constants: BigNumberish[] = [];
  public static sources: BytesLike[] = [];
  public static parseTree:
    Record<number, { tree: ParseTree[], position: number[] }> = {};

  private static exp: string;
  private static input: string;
  private static state: State = {
    parse: {
      stack: [],
      tree: []
    },
    srcCache: [],
    arguments: {
      has: false,
      offset: 0,
      count: 0,
      cache: []
    },
    zipmaps: 0,
    multiOutputCache: []
  }
  private static placeholder: string = "_"
  private static hasError: boolean = false;
  private static data: any[] = Object.values(mapToRecord(OpMeta, ["data"]))
  private static names: string[] = Object.values(mapToRecord(OpMeta, ["name"]));
  private static aliases: string[] = Object.values(mapToRecord(OpMeta, ["aliases"]));
  private static pops: ((opcode: number, operand: number) => number)[] =
    Object.values(mapToRecord(OpMeta, ["pops"]));
  private static zeroOperandOps: string[] = Object.values(mapToRecord(OpMeta, ["isZeroOperand"]));

  /**
   * @public
   * Method to get parse tree object and StateConfig
   * 
   * @param script - the text script
   * @param opmeta - (optional) custom opmeta
   * @param placeholderChar - (optional) custom multi output placeholder character, default is "_" 
   * @returns Array of parse tree object and StateConfig
   */
  public static get(script: string, opmeta?: typeof OpMeta, placeholderChar?: string): [
    Record<number, { tree: ParseTree[], position: number[] }>,
    StateConfig
  ] {
    this.parse(script, opmeta, placeholderChar);
    return [
      this.parseTree,
      {
        constants: this.constants,
        sources: this.sources
      }
    ]
  }

  /**
   * @public
   * Method to get the StateConfig
   * 
   * @param script - the text script
   * @param opmeta - (optional) custom opmeta
   * @param placeholderChar - (optional) custom multi output placeholder character, default is "_"
   * @returns A StateConfig
   */
  public static getStateConfig(script: string, opmeta?: typeof OpMeta, placeholderChar?: string): StateConfig {
    this.parse(script, opmeta, placeholderChar);
    return {
      constants: this.constants,
      sources: this.sources
    } as StateConfig
  }

  /**
   * @public
   * Method to get the parse tree object
   * 
   * @param script - the text script
   * @param opmeta - (optional) custom opmeta
   * @param placeholderChar - (optional) custom multi output placeholder character, default is "_"
   * @returns A parse tree object
   */
  public static getParseTree(script: string, opmeta?: typeof OpMeta, placeholderChar?: string): Record<
    number,
    { tree: ParseTree[], position: number[] }
  > {
    this.parse(script, opmeta, placeholderChar);
    return this.parseTree;
  }

  private static parse(script: string, opmeta?: typeof OpMeta, placeholderChar?: string) {
    this.reset();
    this.parseTree = {};
    this.constants = [];
    this.sources = [];
    this.state.zipmaps = 0;
    this.state.arguments.has = false;
    this.state.arguments.count = 0;
    this.state.arguments.offset = 0;
    this.state.arguments.cache = [];
    opmeta ? this.set(opmeta) : this.set(OpMeta);
    this.placeholder = placeholderChar ? placeholderChar : "_";

    let script_ = script;
    let offset = 0;
    [script, , offset] = this.trim(script);
    let expressions: string[] = [];
    let positions = [[0, script_.length - 1]];

    if (script.startsWith("{") && script.indexOf("}") > -1) {
      positions = [[
        script_.indexOf("{"),
        script_.indexOf("}")
      ]]
      while (script.startsWith("{") && script.indexOf("}") > -1) {
        let tmp = script.slice(0, script.indexOf("}") + 1);
        let length = tmp.length - script.length;

        if (length === 0) length = script.length;

        script = script.slice(length);
        script = this.trim(script)[0];
        expressions.push(tmp.slice(1, tmp.length - 1));

        if (script.startsWith("{") && script.indexOf("}") > -1) {
          positions.push([
            script_.length - script.length - offset,
            script_.length - script.length - offset + script.indexOf("}")
          ])
        }
      }
    }
    else expressions.push(script);

    for (let i = 0; i < expressions.length; i++) {
      this.reset();
      this.input = expressions[i];
      this.exp = expressions[i];
      this.exp = this.trim(this.exp)[0];

      while (this.exp.length > 0) {
        this.exp = this.trim(this.exp)[0];

        if (this.exp.startsWith(",")) {
          this.exp = this.exp.replace(",", "");
        }
        else if (this.exp.startsWith("(")) {
          this.exp = this.exp.replace("(", "");
          this.state.parse.stack.push("(");
        }
        else if (this.exp.startsWith(")")) {
          this.exp = this.exp.replace(")", "");
          this.resolveParens(positions[i][0] + 1);
          if (!this.hasError) {
            try {
              this.buildStateConfig(
                this.state.parse.stack[
                this.state.parse.stack.length - 1
                ] as ParseTree
              )
            } catch (err) {
              console.log(err)
            }
          }
        }
        else this.consume(positions[i][0] + 1);

        if (
          !this.hasError && !this.state.parse.stack.includes("(") &&
          this.state.parse.stack.length === 1 &&
          "value" in (this.state.parse.stack[0] as Exclude<ParseStack, "(">)
        ) {
          try {
            this.buildStateConfig(
              this.state.parse.stack[
              this.state.parse.stack.length - 1
              ] as ParseTree
            )
          } catch (err) {
            console.log(err)
          }
        }
        if (this.hasError) {
          this.state.srcCache = [];
          this.constants = [];
        }
        if (
          !this.state.parse.stack.includes("(") &&
          !("op" in (this.state.parse.stack[0] as Exclude<ParseStack, "(">))
        ) {
          if (this.state.multiOutputCache.length > 0) {
            this.state.parse.stack.unshift(
              ...this.state.multiOutputCache.splice(
                -this.state.multiOutputCache.length
              ) as ParseStack[]
            )
          }
          this.state.parse.tree.push(
            ...this.state.parse.stack.splice(
              -this.state.parse.stack.length
            ) as ParseTree[]
          )
        }
      }
      this.sources.push(concat(this.state.srcCache))
      this.state.srcCache = [];
      this.parseTree[i] = {
        tree: this.state.parse.tree.splice(-this.state.parse.tree.length),
        position: positions[i],
      }
    }
    this.updateArgs();
  }

  private static set(opmeta_: typeof OpMeta) {
    this.data = Object.values(mapToRecord(opmeta_, ["data"]));
    this.names = Object.values(mapToRecord(opmeta_, ["name"]));
    this.aliases = Object.values(mapToRecord(opmeta_, ["aliases"]));
    this.pops = Object.values(mapToRecord(opmeta_, ["pops"]));
    this.zeroOperandOps = Object.values(mapToRecord(opmeta_, ["isZeroOperand"]));
  }

  private static reset = () => {
    this.state.parse.tree = [];
    this.state.parse.stack = [];
  }

  private static findIndex = (str: string): number => {
    let indexes = [];
    indexes[0] = str.indexOf("(");
    indexes[1] = str.indexOf(")");
    indexes[2] = str.indexOf(" ");
    if (indexes[0] === -1 && indexes[1] === -1 && indexes[2] === -1) {
      return -1;
    }
    else {
      let ret = indexes.filter((v) => v !== -1)
      return ret.reduce((a, b) => a <= b ? a : b)
    }
  }

  private static rmComma = (str_: string): string => {
    while (str_.startsWith(",")) str_ = str_.replace(",", "");
    while (str_.endsWith(",")) str_ = str_.slice(0, -1);
    return str_;
  }

  private static trim = (str: string): [string, number, number] => {
    let leadingOffset = 0;
    let trailingOffset = 0;
    while (str.startsWith(" ") || str.startsWith(",")) {
      str = str.slice(1, str.length);
      leadingOffset++;
    }
    while (str.endsWith(" ") || str.endsWith(",")) {
      str = str.slice(0, -1);
      trailingOffset++;
    }
    return [str, leadingOffset, trailingOffset];
  }

  private static buildStateConfig = (expBlock: Exclude<ParseStack, "(" | { op: string, position: number[] }>) => {
    let count = 0;
    if (!("error" in expBlock)) {
      let check = true;
      let tmpStack: Uint8Array[] = [];
      if ("parameters" in expBlock) {
        for (let item of expBlock.parameters) {
          if ("error" in item) {
            check = false;
            break;
          }
          else if ("opcode" in item) count++;
        }
        if (check) {
          let element:
            | Exclude<ParseTree, { error: string, position: number[] }>
            | { value: BigNumberish, position: number[] }

          let bytesArr_ = count !== 0 ? this.state.srcCache.splice(-count) : [];
          if (bytesArr_.length !== count) throw new Error("invalid script: cannot build the StateConfig")
          for (let i = 0; i < expBlock.parameters.length; i++) {
            element = expBlock.parameters[i] as typeof element;
            if ("opcode" in element) {
              let src_ = bytesArr_.shift();
              if (src_) {
                tmpStack.push(src_)
              }
              else throw new Error("invalid script: cannot build the StateConfig")
            }
            if ("value" in element) {
              if (isBigNumberish(element.value)) {
                if (this.constants.includes(element.value)) {
                  tmpStack.push(
                    op(AllStandardOps.CONSTANT, this.constants.indexOf(element.value))
                  );
                }
                else {
                  tmpStack.push(
                    op(AllStandardOps.CONSTANT, this.constants.length)
                  );
                  this.constants.push(element.value);
                }
              }
              else if ((element.value as string).includes("arg")) {
                let index = Number(
                  (element.value as string).replace("arg(", "").slice(0, -1)
                );
                if (!this.state.arguments.cache.includes(index)) {
                  this.state.arguments.cache.push(index)
                }
                tmpStack.push(
                  op(this.names.length, this.state.arguments.offset + index)
                );
              }
            }
          }
          tmpStack.push(op(this.names.indexOf(expBlock.opcode.name), expBlock.operand))
        }
      }
      else if ("value" in expBlock) {
        if (isBigNumberish(expBlock.value)) {
          if (this.constants.includes(expBlock.value)) {
            tmpStack.push(
              op(AllStandardOps.CONSTANT, this.constants.indexOf(expBlock.value))
            );
          }
          else {
            tmpStack.push(
              op(AllStandardOps.CONSTANT, this.constants.length)
            );
            this.constants.push(expBlock.value);
          }
        }
        else if ((expBlock.value as string).includes("arg")) {
          let index = Number(
            (expBlock.value as string).replace("arg(", "").slice(0, -1)
          );
          if (!this.state.arguments.cache.includes(index)) {
            this.state.arguments.cache.push(index)
          }
          tmpStack.push(
            op(this.names.length, this.state.arguments.offset + index)
          );
        }
      }
      this.state.srcCache.push(concat(tmpStack));
    }
  }

  private static updateArgs = () => {
    if (this.state.arguments.has) {
      for (let i = 0; i < this.sources.length; i++) {
        for (let j = 0; j < this.sources[i].length; j++) {
          if (this.sources[i][j] === this.names.length) {
            (this.sources[i][j] as number) = 0;
            (this.sources[i][j + 1] as number) += this.constants.length;
          }
        }
      }
    }
  }

  private static resolveOp = (expBlock: ParseTree): ParseTree => {
    if ("error" in expBlock) return expBlock;
    else {
      let op = this.names.indexOf(expBlock.opcode.name);
      if (op > -1) {
        if (
          op === AllStandardOps.STACK ||
          op === AllStandardOps.CONTEXT ||
          op === AllStandardOps.STORAGE
        ) {
          if (
            expBlock.parameters.length === 1 &&
            "value" in expBlock.parameters[0] &&
            Number(expBlock.parameters[0].value) < 256
          ) {
            let operand = Number(expBlock.parameters[0].value);
            expBlock.parameters = [];
            expBlock.operand = operand;
            expBlock.output = 1;
          }
          else if (expBlock.parameters.length !== 1) {
            expBlock.operand = NaN;
            expBlock.parameters = [{
              error: `invalid number of parameters, expected 1 parameter but got ${expBlock.parameters.length}`,
              position: [expBlock.parameters[0].position[0], expBlock.parameters[expBlock.parameters.length - 1].position[1]]
            }];
            if (!this.hasError) this.hasError = true;
          }
          else if ("value" in expBlock.parameters[0] && Number(expBlock.parameters[0].value) > 255) {
            expBlock.operand = NaN;
            expBlock.parameters[0] = {
              error: `${expBlock.opcode.name} parameter (i.e. operand) cannot be bigger than 255`,
              position: expBlock.parameters[0].position
            }
            if (!this.hasError) this.hasError = true;
          }
          else {
            expBlock.operand = NaN;
            if (!this.hasError) this.hasError = true;
          }
        }
        else if (op === AllStandardOps.ZIPMAP) {
          if (expBlock.parameters.length > 2 && expBlock.parameters.length < 11) {
            if ("value" in expBlock.parameters[0] && "value" in expBlock.parameters[1]) {
              if (Number(expBlock.parameters[0].value) < 8 && Number(expBlock.parameters[1].value) < 4) {
                expBlock.operand = callSize(
                  Number(expBlock.parameters[0].value),
                  Number(expBlock.parameters[1].value),
                  expBlock.parameters.length - 3
                )
                expBlock.output = 2 ** Number(expBlock.parameters[1].value);
                for (let i = 0; i < expBlock.output - 1; i++) {
                  this.state.multiOutputCache.push({
                    value: `${expBlock.opcode.name} output ${i + 1} placeholder`,
                    position: [],
                  })
                };
                this.state.multiOutputCache.push(expBlock);
                if (!this.state.arguments.has) this.state.arguments.has = true;
                this.state.arguments.offset = this.state.arguments.count;
                this.state.arguments.count += expBlock.parameters.length - 2
                expBlock.parameters.shift();
                expBlock.parameters.shift();
              }
              else {
                if (!this.hasError) this.hasError = true;
                expBlock.operand = NaN;
                if (Number(expBlock.parameters[0].value) > 7) {
                  expBlock.parameters[0] = {
                    error: "invalid value for ZIPMAP SourceIndex parameter",
                    position: expBlock.parameters[0].position
                  }
                }
                else if (Number(expBlock.parameters[1].value) > 3) {
                  expBlock.parameters[1] = {
                    error: "invalid value for ZIPMAP LoopSize parameter",
                    position: expBlock.parameters[1].position
                  }
                }
                else {
                  expBlock.parameters[0] = {
                    error: "invalid value for ZIPMAP SourceIndex parameter",
                    position: expBlock.parameters[0].position
                  }
                  expBlock.parameters[1] = {
                    error: "invalid value for ZIPMAP LoopSize parameter",
                    position: expBlock.parameters[1].position
                  }
                }
              }
            }
            else {
              expBlock.operand = NaN;
              if (!this.hasError) this.hasError = true;
            }
          }
          else {
            expBlock.operand = NaN;
            expBlock.parameters = [{
              error: `invalid parameters: expected at least 3 and at most 10 parameters, but got ${expBlock.parameters.length}`,
              position: [expBlock.parameters[0].position[0], expBlock.parameters[expBlock.parameters.length - 1].position[1]]
            }];
            if (!this.hasError) this.hasError = true;
          }
        }
        else if (op === AllStandardOps.ITIERV2_REPORT) {
          if (
            expBlock.parameters.length === 2 ||
            expBlock.parameters.length === 3 ||
            expBlock.parameters.length === 10
          ) {
            expBlock.operand = expBlock.parameters.length - 2;
            expBlock.output = 1;
          }
          else {
            expBlock.operand = NaN;
            expBlock.parameters = [{
              error: `invalid parameters: expected either 2 or 3 or 10 parameters, but got ${expBlock.parameters.length}`,
              position: [expBlock.parameters[0].position[0], expBlock.parameters[expBlock.parameters.length - 1].position[1]]
            }];
            if (!this.hasError) this.hasError = true;
          }
        }
        else if (op === AllStandardOps.ITIERV2_REPORT_TIME_FOR_TIER) {
          if (
            expBlock.parameters.length === 3 ||
            expBlock.parameters.length === 4 ||
            expBlock.parameters.length === 11
          ) {
            expBlock.operand = expBlock.parameters.length - 2;
            if (!("value" in expBlock.parameters[2] && Number(expBlock.parameters[2].value) > -1 && Number(expBlock.parameters[2].value) < 9)) {
              expBlock.operand = NaN;
              expBlock.output = 1;
              expBlock.parameters[2] = {
                error: "invalid tier level",
                position: expBlock.parameters[2].position
              };
              if (!this.hasError) this.hasError = true;
            }
          }
          else {
            expBlock.operand = NaN;
            expBlock.parameters = [{
              error: `invalid parameters: expected either 3 or 4 or 11 parameters, but got ${expBlock.parameters.length}`,
              position: [expBlock.parameters[0].position[0], expBlock.parameters[expBlock.parameters.length - 1].position[1]]
            }];
            if (!this.hasError) this.hasError = true;
          }
        }
        else if (op === AllStandardOps.SELECT_LTE) {
          if (expBlock.parameters.length > 4 && expBlock.parameters.length < 35) {
            if ("value" in expBlock.parameters[0] && "value" in expBlock.parameters[1]) {
              if (Number(expBlock.parameters[0].value) < 2 && Number(expBlock.parameters[1].value) < 3) {
                expBlock.operand = selectLte(
                  Number(expBlock.parameters[0].value),
                  Number(expBlock.parameters[0].value),
                  expBlock.parameters.length - 2
                );
                expBlock.output = 1;
                expBlock.parameters.shift();
                expBlock.parameters.shift();
              }
              else {
                expBlock.operand = NaN;
                if (!this.hasError) this.hasError = true;
                if (Number(expBlock.parameters[0].value) > 1) {
                  expBlock.parameters[0] = {
                    error: "invalid value for SELECT_LTE logic",
                    position: expBlock.parameters[0].position
                  }
                }
                else if (Number(expBlock.parameters[1].value) > 2) {
                  expBlock.parameters[1] = {
                    error: "invalid value for SELECT_LTE mode",
                    position: expBlock.parameters[1].position
                  }
                }
                else {
                  expBlock.parameters[0] = {
                    error: "invalid value for SELECT_LTE logic",
                    position: expBlock.parameters[0].position
                  }
                  expBlock.parameters[1] = {
                    error: "invalid value for SELECT_LTE mode",
                    position: expBlock.parameters[1].position
                  }
                }
              }
            }
            else {
              expBlock.operand = NaN;
              if (!this.hasError) this.hasError = true;
            }
          }
          else {
            expBlock.operand = NaN;
            expBlock.parameters = [{
              error: `invalid parameters: expected at least 4 and at most 34 parameters in total, but got ${expBlock.parameters.length}`,
              position: [expBlock.parameters[0].position[0], expBlock.parameters[expBlock.parameters.length - 1].position[1]]
            }];
            if (!this.hasError) this.hasError = true;
          }
        }
        else if (op === AllStandardOps.UPDATE_TIMES_FOR_TIER_RANGE) {
          if (expBlock.parameters.length === 4) {
            if ("value" in expBlock.parameters[0] && "value" in expBlock.parameters[1]) {
              if (Number(expBlock.parameters[0].value) < 9 && Number(expBlock.parameters[1].value) < 9) {
                expBlock.operand = tierRange(
                  Number(expBlock.parameters[0].value),
                  Number(expBlock.parameters[1].value)
                );
                expBlock.output = 1;
                expBlock.parameters.shift();
                expBlock.parameters.shift();
              }
              else {
                expBlock.operand = NaN;
                if (!this.hasError) this.hasError = true;
                if (Number(expBlock.parameters[0].value) > 8) {
                  expBlock.parameters[0] = {
                    error: "invalid value for start tier",
                    position: expBlock.parameters[0].position
                  }
                }
                else if (Number(expBlock.parameters[1].value) > 8) {
                  expBlock.parameters[1] = {
                    error: "invalid value for end tier",
                    position: expBlock.parameters[1].position
                  }
                }
                else {
                  expBlock.parameters[0] = {
                    error: "invalid value for start tier",
                    position: expBlock.parameters[0].position
                  }
                  expBlock.parameters[1] = {
                    error: "invalid value for end tier",
                    position: expBlock.parameters[1].position
                  }
                }
              }
            }
            else {
              expBlock.operand = NaN;
              if (!this.hasError) this.hasError = true;
            }
          }
          else {
            expBlock.operand = NaN;
            expBlock.parameters = [{
              error: `invalid parameters: expected at least 4 parameters in total, but got ${expBlock.parameters.length}`,
              position: [expBlock.parameters[0].position[0], expBlock.parameters[expBlock.parameters.length - 1].position[1]]
            }];
            if (!this.hasError) this.hasError = true;
          }
        }
        else if (op === AllStandardOps.IERC1155_BALANCE_OF_BATCH) {
          if (expBlock.parameters.length > 2 && expBlock.parameters.length % 2 === 1) {
            expBlock.operand = (expBlock.parameters.length - 1) / 2;
            expBlock.output = (expBlock.parameters.length - 1) / 2;
            for (let i = 0; i < expBlock.output - 1; i++) {
              this.state.multiOutputCache.push({
                value: `${expBlock.opcode.name} output ${i + 1} placeholder`,
                position: [],
              })
            }
            this.state.multiOutputCache.push(expBlock)
          }
          else {
            expBlock.operand = NaN;
            expBlock.parameters = [{
              error: `invalid number of parameters`,
              position: [expBlock.parameters[0].position[0], expBlock.parameters[expBlock.parameters.length - 1].position[1]]
            }];
            if (!this.hasError) this.hasError = true;
          }
        }
        else if (this.pops[op].name !== "oprnd") {
          if (this.pops[op](op, 0) === expBlock.parameters.length) {
            expBlock.operand = expBlock.parameters.length;
            if (this.zeroOperandOps[op]) {
              expBlock.operand = 0;
            }
            expBlock.output = 1;
          }
          else {
            expBlock.operand = NaN;
            expBlock.parameters = [{
              error: `invalid number of parameters`,
              position: [expBlock.parameters[0].position[0], expBlock.parameters[expBlock.parameters.length - 1].position[1]]
            }];
            if (!this.hasError) this.hasError = true;
          }
        }
        else if (this.pops[op].name === "oprnd") {
          if (this.zeroOperandOps[op]) {
            expBlock.operand = 0;
          }
          expBlock.output = 1;
        }
        else {
          expBlock.operand = NaN;
          expBlock.parameters = [{
            error: `unknown`,
            position: [expBlock.parameters[0].position[0], expBlock.parameters[expBlock.parameters.length - 1].position[1]]
          }];
          if (!this.hasError) this.hasError = true;
        }
        return expBlock;
      }
      if (!this.hasError) this.hasError = true;
      return {
        error: "unknown opcode",
        position: expBlock.opcode.position
      }
    }
  }

  private static trailingOp(str: string): boolean | string {
    if (str.length > 0) {
      if (str.startsWith("(") || str.startsWith(")")) return false;

      if (!str.startsWith(" ")) {
        let str_ = str.slice(0, this.findIndex(str));
        str_ = this.rmComma(str_);

        if (isBigNumberish(str_)) return false;
        if (this.names.includes(str_)) return true
        for (let i = 0; i < this.aliases.length; i++) {
          if (this.aliases[i] && this.aliases[i].includes(str_)) return true;
        }
      }
      else {
        str = this.trim(str)[0];
        if (str.startsWith("(") || str.startsWith(")")) return false;
        let index1_ = this.findIndex(str) < 0
          ? str.length
          : this.findIndex(str) === 0
            ? 1
            : this.findIndex(str);

        let str1_ = str.slice(0, index1_);
        let consumee1_ = str1_;
        let isOp1_ = false;
        str1_ = this.rmComma(str1_);

        if (str.startsWith("(") || str.startsWith(")")) return false;
        if (isBigNumberish(str1_)) return false;
        if (this.names.includes(str1_)) isOp1_ = true
        for (let i = 0; i < this.aliases.length; i++) {
          if (this.aliases[i] && this.aliases[i].includes(str1_)) {
            isOp1_ = true;
            break;
          }
        }
        str = str.replace(consumee1_, "");
        str = this.trim(str)[0];
        if (isOp1_ && (str.startsWith("(") || str.startsWith(")"))) {
          return "ambiguous expresion";
        }
        let index2_ = this.findIndex(str) < 0
          ? str.length
          : this.findIndex(str) === 0
            ? 1
            : this.findIndex(str);

        let str2_ = str.slice(0, index2_);
        str2_ = this.rmComma(str2_);

        if (isOp1_ && (str.startsWith("(") || str.startsWith(")"))) {
          return "ambiguous expresion";
        }

        if (isOp1_ && isBigNumberish(str2_)) return true;
        if (isOp1_ && this.names.includes(str2_)) return true
        for (let i = 0; i < this.aliases.length; i++) {
          if (
            isOp1_ && this.aliases[i] &&
            this.aliases[i].includes(str2_)
          ) return true;
        }
        return false;
      }
      return false;
    }
    else return false;
  }

  private static resolveInfix(
    stack: Exclude<ParseStack, "(">[],
    position: number[]
  ): ParseTree {
    let infixExp: ParseTree;
    let tmp_ = stack[1] as
      { op: string, position: number[] } |
      { error: string, position: number[] };

    if ("op" in tmp_) {
      infixExp = {
        opcode: {
          name: tmp_.op,
          position: tmp_.position,
        },
        operand: 2,
        parameters: [
          (stack[0] as Exclude<
            ParseStack,
            { op: string, position: number[] } | "("
          >),
          (stack[2] as Exclude<
            ParseStack,
            { op: string, position: number[] } | "("
          >)
        ],
        output: NaN,
        position: position,
        data: this.data[this.names.indexOf(tmp_.op)]
          ? this.data[this.names.indexOf(tmp_.op)]
          : undefined
      }
      if (stack.length > 3) {
        for (let i = 3; i < stack.length; i += 2) {
          let item = stack[i] as Extract<
            ParseStack,
            { op: BigNumberish, position: number[] } |
            { error: BigNumberish, position: number[] }
          >;
          if ("op" in item) {
            if (item.op === tmp_.op) {
              infixExp.parameters.push(
                (stack[i + 1] as Exclude<
                  ParseStack,
                  { op: string, position: number[] } | "("
                >),
              );
              infixExp.opcode.position.push(...item.position);
              infixExp.operand++;
            }
            else {
              infixExp = {
                error: "invalid indetation",
                position: tmp_.position
              }
              if (!this.hasError) this.hasError = true;
              break;
            }
          }
          else {
            infixExp = {
              error: item.error!,
              position: tmp_.position
            };
            if (!this.hasError) this.hasError = true;
            break;
          }
        }
      }
    }
    else {
      infixExp = {
        error: tmp_.error,
        position: tmp_.position
      };
      if (!this.hasError) this.hasError = true;
    }
    return infixExp;
  }

  private static resolveMutliOutputs = (
    items: Exclude<ParseStack, "(">[],
    itemsPositions: number[],
    positions: { pos: number, count: number, type: number }[]
  ): Exclude<ParseStack, "(">[] => {
    if (positions.length > 0) {
      for (let i = 0; i < positions.length; i++) {
        if (positions[i].type === 1) {
          let item_ = items[positions[i].pos] as Exclude<ParseTree, Error>;
          if (item_.output !== positions[i].count) {
            if (positions[i].pos - positions[i].count + 1 !== 0) {
              return [{
                error: "illigal positioning of parameters",
                position: itemsPositions
              }]
            }
            else {
              let output_ = this.state.multiOutputCache.pop();
              if (output_ && "opcode" in output_) {
                for (let j = positions[i].pos - 1; j >= 0; j--) {
                  let tmp = this.state.multiOutputCache.pop();
                  if (tmp) items[j] = tmp;
                  else return [{
                    error: `illigal reach to undefined ${item_.opcode.name} outputs`,
                    position: itemsPositions
                  }]
                }
              }
              else return [{
                error: `invalid consumption of previous multioutput opcodes`,
                position: itemsPositions
              }]
            }
          }
          else {
            let output_ = this.state.multiOutputCache.pop();
            if (output_ && "op" in output_) {
              for (let j = positions[i].pos - 1; j >= 0; j--) {
                let tmp = this.state.multiOutputCache.pop();
                if (tmp) items[j] = tmp;
                else return [{
                  error: `illigal reach to undefined ${item_.opcode.name} outputs`,
                  position: itemsPositions
                }]
              }
            }
            else return [{
              error: `invalid consumption of previous multioutput opcodes`,
              position: itemsPositions
            }]
          }
        }
        else {
          if (positions[i].pos - positions[i].count + 1 !== 0) {
            return [{
              error: "illigal positioning of parameters",
              position: itemsPositions
            }]
          }
          else {
            let output_ = this.state.multiOutputCache.pop();
            if (output_ && "opcode" in output_) {
              return [{
                error: `invalid consumption of previous multioutput opcodes`,
                position: itemsPositions
              }]
            }
            else {
              for (let j = positions[i].pos - 1; j >= 0; j--) {
                let tmp = this.state.multiOutputCache.pop();
                if (tmp) items[j] = tmp;
                else return [{
                  error: `illigal reach to undefined opcode outputs`,
                  position: itemsPositions
                }]
              }
            }
          }
        }
      }
      return items;
    }
    else {
      return [{
        error: "invalid expression",
        position: itemsPositions
      }]
    }
  }

  private static resolveParens(entry: number) {
    let isInfix = false;
    let isPrefix = false;
    let isPostfix = false;
    let index_ = this.state.parse.stack.lastIndexOf("(");
    let endIndex_ = this.input.length + entry - this.exp.length - 1;
    let startIndex_ =
      entry + this.input.slice(0, -this.exp.length).lastIndexOf("(");

    if (index_ >= 0) {
      let parens_ = this.state.parse.stack.splice(
        -(this.state.parse.stack.length - index_)
      ) as Exclude<ParseStack, "(">[];
      parens_.shift();

      for (let i = 0; i < parens_.length; i++) {
        let tmp = parens_[i];
        if ("op" in tmp) {
          if (i !== 0 && i !== parens_.length - 1) isInfix = true;
          if (i === 0) isPrefix = true;
          if (i === parens_.length - 1) isPostfix = true;
        }
      }

      let multiOuputOpsPos: {
        pos: number,
        count: number,
        type: number
      }[] = [];
      let reset = false;
      for (let i = parens_.length - 1; i >= 0; i--) {
        let tmp = parens_[i];
        if (("output" in tmp && tmp.output > 1)) {
          multiOuputOpsPos.push({ pos: i, count: 1, type: 1 });
          reset = true;
        }
        else if (("value" in tmp && tmp.value === this.placeholder)) {
          if (reset) {
            multiOuputOpsPos[multiOuputOpsPos.length - 1].count++;
          }
          else {
            multiOuputOpsPos.push({ pos: i, count: 1, type: 0 })
            reset = true;
          }
        }
        else reset = false;
      }

      if (multiOuputOpsPos.length > 0) {
        parens_ = this.resolveMutliOutputs(parens_, [startIndex_, endIndex_], multiOuputOpsPos);
        if ("error" in parens_[0]) this.hasError = true;
      }

      if (isPrefix && isPostfix) {
        this.state.parse.stack.push({
          error: "invalid notation",
          position: [startIndex_, endIndex_]
        });
        if (!this.hasError) this.hasError = true;
      }
      if (isInfix && (isPrefix || isPostfix)) {
        this.state.parse.stack.push({
          error: "invalid notation",
          position: [startIndex_, endIndex_]
        });
        if (!this.hasError) this.hasError = true;
      }

      let tmp = this.state.parse.stack[this.state.parse.stack.length - 1];
      if (!isPrefix && !isPostfix && tmp && tmp !== "(" && "op" in tmp) {
        this.state.parse.stack.pop();
        this.state.parse.stack.push(
          this.resolveOp({
            opcode: {
              name: tmp.op,
              position: tmp.position
            },
            position: [tmp.position[0], endIndex_],
            operand: isInfix ? Math.floor(parens_.length / 2) + 1 : parens_.length,
            output: NaN,
            parameters: isInfix
              ? [this.resolveInfix(
                parens_ as Exclude<ParseStack, "(">[],
                [tmp.position[0], endIndex_]
              )]
              : parens_ as ParseTree[],
            data: this.data[this.names.indexOf(tmp.op)]
          })
        )
      }
      else if (!isPrefix && !isPostfix && this.trailingOp(this.exp)) {
        let err = this.trailingOp(this.exp);
        this.consume(entry);
        let tmp_ = this.state.parse.stack.pop() as { op: string, position: number[] };

        if (typeof err === "string") {
          this.state.parse.stack.push({
            error: err,
            position: [startIndex_, tmp_.position[1]],
          });
          if (!this.hasError) this.hasError = true;
        }
        else {
          this.state.parse.stack.push(
            this.resolveOp({
              opcode: {
                name: tmp_.op,
                position: tmp_.position
              },
              position: [startIndex_, tmp_.position[1]],
              operand: isInfix ? Math.floor(parens_.length / 2) + 1 : parens_.length,
              output: NaN,
              parameters: isInfix
                ? [this.resolveInfix(
                  parens_ as Exclude<ParseStack, "(">[],
                  [startIndex_, tmp_.position[1]]
                )]
                : parens_ as ParseTree[],
              data: this.data[this.names.indexOf(tmp_.op)]
            })
          );
        }
      }
      else if (isPrefix) {
        let tmp_ = (parens_.shift() as {
          opcode: {
            name: string,
            position: number[]
          }
        }).opcode;
        this.state.parse.stack.push(
          this.resolveOp({
            opcode: tmp_,
            position: [startIndex_, endIndex_],
            operand: parens_.length,
            output: NaN,
            parameters: parens_ as ParseTree[],
            data: this.data[this.names.indexOf(tmp_.name)]
          })
        );
      }
      else if (isPostfix) {
        let tmp_ = (parens_.shift() as {
          opcode: {
            name: string,
            position: number[]
          }
        }).opcode
        this.state.parse.stack.push(
          this.resolveOp({
            opcode: (parens_.pop() as {
              opcode: {
                name: string, position: number[]
              }
            }).opcode,
            position: [startIndex_, endIndex_],
            operand: parens_.length,
            output: NaN,
            parameters: parens_ as ParseTree[],
            data: this.data[this.names.indexOf(tmp_.name)]
          })
        );
      }
      else if (isInfix) {
        if (parens_.length % 2 === 0) {
          this.state.parse.stack.push({
            error: "invalid expression: odd number of operators or parameters",
            position: [startIndex_, endIndex_]
          });
          if (!this.hasError) this.hasError = true;
        }
        this.state.parse.stack.push(
          this.resolveOp(
            this.resolveInfix(
              parens_ as Exclude<ParseStack, "(">[],
              [startIndex_, endIndex_]
            )
          )
        );
      }
      else {
        this.state.parse.stack.push({
          error: "invalid notation",
          position: [startIndex_, endIndex_]
        });
        if (!this.hasError) this.hasError = true;
      }
    }
    else {
      this.state.parse.stack.push({
        error: "cannot find the beginning/ending of this expression block",
        position: [startIndex_, endIndex_]
      });
      if (!this.hasError) this.hasError = true;
    }
  }

  private static consume(entry: number): void {
    this.exp = this.trim(this.exp)[0];
    if (this.exp.length > 0) {
      let check_ = true;
      let index_ = this.findIndex(this.exp) < 0
        ? this.exp.length
        : this.findIndex(this.exp) === 0
          ? 1
          : this.findIndex(this.exp);

      let str_ = this.exp.slice(0, index_);
      let consumee_ = str_;
      let startPosition =
        this.input.length - this.exp.length + entry + consumee_.indexOf(str_);
      str_ = this.rmComma(str_);

      if (str_.includes(",")) {
        this.state.parse.stack.push(
          {
            error: `invalid comma: ${str_}`,
            position: [startPosition, startPosition + str_.length - 1]
          }
        );
        this.exp = this.exp.replace(consumee_, "");
        if (!this.hasError) this.hasError = true;
      }
      else {
        for (let i = 0; i < this.aliases.length; i++) {
          if (this.aliases[i] && this.aliases[i].includes(str_)) {
            this.state.parse.stack.push(
              {
                op: this.names[i],
                position: [startPosition, startPosition + this.names[i].length - 1]
              }
            );
            this.exp = this.exp.replace(consumee_, "");
            check_ = false;
            break;
          }
        }
        if (check_ && this.names.includes(str_)) {
          this.state.parse.stack.push(
            {
              op: str_,
              position: [startPosition, startPosition + str_.length - 1]
            }
          );
          this.exp = this.exp.replace(consumee_, "");
        }
        else if (str_ === "arg") {
          this.exp = this.exp.replace(consumee_, "");
          let i_ = this.exp.indexOf(")") + 1;
          str_ = str_ + this.exp.slice(0, i_);
          this.exp = this.exp.slice(i_, this.exp.length);
          this.state.parse.stack.push(
            {
              value: str_,
              position: [startPosition, startPosition + str_.length - 1]
            }
          );
        }
        else if (str_ === this.placeholder) {
          this.state.parse.stack.push({
            value: this.placeholder,
            position: [startPosition, startPosition + str_.length - 1]
          });
          this.exp = this.exp.replace(consumee_, "");
        }
        else {
          if (str_.includes(".")) {
            this.state.parse.stack.push(
              {
                error: `invalid number: float ${str_}`,
                position: [startPosition, startPosition + str_.length - 1]
              }
            );
            this.exp = this.exp.replace(consumee_, "");
            if (!this.hasError) this.hasError = true;
          }
          else if (isBigNumberish(str_)) {
            this.state.parse.stack.push(
              {
                value: str_,
                position: [startPosition, startPosition + str_.length - 1]
              }
            );
            this.exp = this.exp.replace(consumee_, "");
          }
          else {
            this.state.parse.stack.push(
              {
                error: `unknown: ${str_}`,
                position: [startPosition, startPosition + str_.length - 1]
              }
            );
            this.exp = this.exp.replace(consumee_, "");
            if (!this.hasError) this.hasError = true;
          };
        }
      }
    }
  }
}
