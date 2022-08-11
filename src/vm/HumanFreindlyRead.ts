import { BytesLike, BigNumber, ethers } from 'ethers';
import { AllStandardOps, StateConfig } from '../classes/vm';
import { arrayify, selectLteLogic, selectLteMode } from '../utils';
import { IOpMeta, OpMeta } from './OpMeta';


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
  /**
   * Providing the names for STORAGE opcodes
   */
  storageEnums?: string[];
  /**
   * Providing the names for CONTEXT opcodes
   */
  contextEnums?: string[];
  /**
   * Names/Aliases for each individual item on the final stack (in order)
   */
  aliases?: string[];
  /**
   * True if the result needs to be optimized for a RuleBuilder script generator
   */
  ruleBuilder?: boolean;
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

/**
 * @public
 * The generator of human friendly readable source.
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

  private static _pretty: boolean;
  private static opMeta: IOpMeta[] = Array.from(OpMeta.values());

  /**
   * 
   * @param opmeta 
   * @returns 
   */
  public static set(opmeta: typeof OpMeta): any {
    this.opMeta = Array.from(opmeta.values());
  }

  /**
   * Obtain the friendly output from an script.
   * @param _state - The state or script to generate the friendly version @see StateConfig
   * @param _config - The configuration that will run the generator. @see Config
   * @returns
   */
  public static get(
    _state: StateConfig,
    _config: Config = { 
      pretty: false,
      storageEnums: undefined,
      contextEnums: undefined,
      aliases: undefined,
      ruleBuilder: false
    }
  ): string {
    this._pretty = _config.pretty ? true : false;
    let _constants: string[] = [];
    let _result;

    for (const item of _state.constants) {
      _constants.push(BigNumber.from(item).toHexString())
    }

    _result = this._eval(
      _state.sources,
      _constants,
      _config.storageEnums,
      _config.contextEnums,
      _config.aliases,
      _config.ruleBuilder
    );

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

    // _text = _text.replace(/\s/g, '');
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
        _text[i] === '{' ||
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
      if (_text[i] === ')' || _text[i] === ']' || _text[i] === '}') {
        if (skip === 0) {
          if (_text[i + 3] === '=' && _text[i + 4] === '>') {
            counter--;
            _text =
              _text.slice(0, i) +
              '\n' +
              space.repeat(counter * n) +
              _text.slice(i);
            i = i + counter * n + 1;
          }
          else {
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
          }
        } else {
          skip--;
        }
      }
    }
    return _text;
  }

  /**
   * The main workhorse of the Human Friendly Readable script that builds the whole text
   * 
   * @param sources - The StateConfig sources
   * @param constants - The StateConfig constants all in hex string format
   * @param storageEnums - (optional) names/aliases for CONTEXT opcodes
   * @param contextEnums - (optional) names/aliases for STORAGE opcodes
   * @param aliases - (optional) names/aliases for individual items in final results (should be passed in order)
   * @param ruleBuilder - True if the result needs to be optimized for the RuleBuilder script generator
   * @returns The generated human friendly readable text
   */
  private static _eval = (
    sources: BytesLike[],
    constants: string[],
    storageEnums?: string[],
    contextEnums?: string[],
    aliases?: string[],
    ruleBuilder: boolean = false,
  ): string => {

    let _stack: string[] = [];
    let _finalStack: string[] = [];
    let _zipmapStack: { [key: number]: string } = {};
    let useableAliases = aliases;

    for (let i = 0; i < sources.length; i++) {
      let src = arrayify(sources[i], { allowMissingPrefix: true});

      for (let j = 0; j < src.length; j += 2) {

        if (src[j] === AllStandardOps.CONSTANT) {
          if (src[j + 1] < constants.length) {
            _stack.push(
              BigNumber.from(constants[src[j + 1]]).eq(ethers.constants.MaxUint256)
              ? 'MaxUint256'
              : constants[src[j + 1]]
            )
          }
          else {
            let _args: number[] = [];
            let _offset: number;
            for (let k = 0; k < src.length; k += 2) {
              if (src[k] === 0 && src[k + 1] >= constants.length) {
                _args.push(src[k + 1])
              }
            }
            _offset = _args.reduce((a, b) => a <= b ? a : b)
            _stack.push(`Argument[${src[j + 1] - _offset}]`)
          }
        }
        else if (src[j] === AllStandardOps.STACK) {
          if (ruleBuilder) {
            _stack.push(
              aliases && aliases[src[j + 1]] ? aliases[src[j + 1]] : `Item${src[j + 1]}`
            )
          }
          else {
            _stack.push(_stack[src[j + 1]])
          }
        }
        else if (src[j] === AllStandardOps.CONTEXT) {
          _stack.push(
            contextEnums && (contextEnums[src[j + 1]] !== undefined || '')
              ? contextEnums[src[j + 1]] 
              : this.opMeta[src[j]].name + `[${src[j + 1]}]`
          )
        }
        else if (src[j] === AllStandardOps.STORAGE) {
          _stack.push(
            storageEnums && (storageEnums[src[j + 1]] !== undefined || '')
              ? storageEnums[src[j + 1]] 
              : this.opMeta[src[j]].name + `[${src[j + 1]}]`
          )
        }
        else if (src[j] === AllStandardOps.ZIPMAP) {

          let index = src[j + 1] & 3;
          let loopSize = 2 ** ((src[j + 1] >> 3) & 3);

          _zipmapStack[index] = 'function '
            + this.opMeta[src[j]].name
            + `${index} = `
            + `(Loop Size: ${loopSize}, `
            + `Arguments: [${_stack.splice(-(this.opMeta[src[j]].pops(src[j], src[j + 1]))).join(', ')}]) `

          for (let k = 0; k < loopSize; k++) {
            _stack.push(`ZIPMAP${index} Result[${k + 1}]`)
          }
        }
        else if (src[j] === AllStandardOps.SELECT_LTE) {
          _stack.push(
            this.opMeta[src[j]].name +
            `(Logic: ${selectLteLogic[src[j + 1] >> 7]}, Mode: ${selectLteMode[(src[j + 1] >> 5) & 3]}, ` + 
            `Arguments: [${_stack.splice(-(this.opMeta[src[j]].pops(src[j], src[j + 1]))).join(', ')}])`
          )
        }
        else if (src[j] === AllStandardOps.UPDATE_TIMES_FOR_TIER_RANGE) {
          _stack.push(
            this.opMeta[src[j]].name +
            `(Start Tier: ${src[j + 1] & 15}, End Tier: ${src[j + 1] >> 4}, ` + 
            `Arguments: [${_stack.splice(-(this.opMeta[src[j]].pops(src[j], src[j + 1]))).join(', ')}])`
          )
        }
        else if (this.opMeta[src[j]].pops.name === 'zero' && this.opMeta[src[j]].pushes.name !== 'zero') {
          let _alias = this.opMeta[src[j]].alias
          _stack.push(_alias ? _alias : this.opMeta[src[j]].name)
        }
        else {
          let _alias = this.opMeta[src[j]].alias
          _stack.push(
            _alias 
            ? _alias + `(${_stack.splice(-(this.opMeta[src[j]].pops(src[j], src[j + 1]))).join(', ')})`
            : this.opMeta[src[j]].name + `(${_stack.splice(-(this.opMeta[src[j]].pops(src[j], src[j + 1]))).join(', ')})`
          )
        }

        if (_stack[_stack.length - 1].slice(0, 20) === 'ISZERO(GREATER_THAN(') {
          _stack[_stack.length - 1] = 
            'LESS_THAN_EQUAL(' + _stack[_stack.length - 1]
            .slice(20, _stack[_stack.length - 1].length - 1)
        }
        if (_stack[_stack.length - 1].slice(0, 17) === 'ISZERO(LESS_THAN(') {
          _stack[_stack.length - 1] = 
            'GREATER_THAN_EQUAL(' + _stack[_stack.length - 1]
            .slice(17, _stack[_stack.length - 1].length - 1)
        }
      }

      if (!Object.keys(_zipmapStack).includes(i.toString())) {
        for (let j = 0; j < _stack.length; j++) {
          let tempAlias = useableAliases?.shift()
          _stack[j] = tempAlias
            ? `${tempAlias}: {${_stack[j]}}` 
            : `Item${j}: {${_stack[j]}}`
        }
      }

      _finalStack.push(_stack.join(' '))
      _stack = [];
    }
    for (let j = 0; j < Object.keys(_zipmapStack).length; j++) {
      let index = Number(Object.keys(_zipmapStack)[j]);
      _finalStack[index] = `${_zipmapStack[index]} => { ${_finalStack[index]} }`
    }

    return _finalStack.join(' ');
  };

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
