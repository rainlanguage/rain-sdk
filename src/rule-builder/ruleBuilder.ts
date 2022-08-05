import { lib } from './lib';
import { BigNumberish, BytesLike } from 'ethers';
import { StateConfig, VM } from '../classes/vm';
import { areEqualConfigs } from '../utils';
import {
  Condition,
  ConditionGroup,
  Currency,
  Modifier,
  Price,
  Quantity,
} from './types';


/**
 * @public
 * Class with methods to generate a multi-currency rule-based StateConfig
 *
 * @example
 * ```typescript
 * // to import:
 * import { RuleBuilder } from "rain-sdk"
 *
 * // to build the multi-currency rule-based StateConfig:
 * const vmStateConfig = new RuleBuilder([currency1, currency2, ...])
 *
 * // to build a single condition's StateConfig of a single Rule:
 * const conditions = RuleBuilder.getConditionConfig(condition)
 *
 * // to build a ConditionGroup StateConfig:
 * const rule = RuleBuilder.getConditionGroup(conditionGroup)
 *
 * //to build a single price or quantity StateConfig:
 * const quantity = RuleBuilder.getQPConfig(quantity)
 * const price = RuleBuilder.getQPConfig(price)
 * ```
 */
export class RuleBuilder {
  // StateConfig Properties of this class
  public constants: BigNumberish[];
  public sources: BytesLike[];

  /**
   * Constructor of RuleBuilder class
   *
   * @param currencies - Array of Currency
   */
  constructor(public readonly currencies: Currency[]) {
    const vm_ = RuleBuilder.build(currencies);
    this.constants = vm_.constants;
    this.sources = vm_.sources;
  }

  /**
   * @public
   * Method to generate a multi currency rule-based StateConfig
   *
   * @param currencies - An array of Currency objects
   * @returns StateConfig
   */
  public static build(currencies: Currency[]): StateConfig {
    let rules_: StateConfig[] = [];
    let thens_: StateConfig[] = [];
    let count = 0;

    for (let i = 0; i < currencies.length; i++) {
      let qs_: StateConfig[] = [];
      let ps_: StateConfig[] = [];
      let q_: StateConfig;
      let p_: StateConfig;

      for (let rule of currencies[i].rules) {
        if (
          areEqualConfigs(
            this.getConditionGroupConfig(rule.quantityConditions),
            this.getConditionGroupConfig(rule.priceConditions)
          )
        ) {
          rules_.push(this.getConditionGroupConfig(rule.quantityConditions));
          rules_.push(VM.stack(count * 2))
        }
        else {
          rules_.push(this.getConditionGroupConfig(rule.quantityConditions));
          rules_.push(this.getConditionGroupConfig(rule.priceConditions));
        }

        qs_.push(
          VM.mulTogether(
            [VM.stack(count * 2), this.getQPConfig(rule.quantity)],
            false
          )
        );
        ps_.push(
          VM.mulTogether(
            [VM.stack(count * 2 + 1), this.getQPConfig(rule.price)],
            false
          )
        );
        count++;
      }
      
      qs_.push(this.getQPConfig(currencies[i].default.quantity));
      ps_.push(this.getQPConfig(currencies[i].default.price));

      q_ = (VM[currencies[i].pick.quantities](qs_, false));
      p_ = (VM[currencies[i].pick.prices](ps_, false));

      let qMod = currencies[i].quantityGlobalModifier;
      let pMod = currencies[i].priceGlobalModifier;
      if (qMod !== undefined) {
        thens_.push(this.applyModifier(q_, qMod));
      } 
      else {
        thens_.push(q_);
      }
      if (pMod !== undefined) {
        thens_.push(this.applyModifier(p_, pMod));
      } 
      else {
        thens_.push(p_);
      }
    }

    return VM.multi([...rules_, ...thens_], false);
  }

  /**
   * @public
   * Method to generate a single currency rule-based StateConfig
   *
   * @param currency - A Currency object
   * @returns StateConfig
   */
  public static singleBuild(currency: Currency): StateConfig {
    return this.build([currency]);
  }

  /**
   * Method to get the conditions' StateConfig of a ConditionGroup seperately
   *
   * @param conditionGroup - The ConditionGroup object
   * @returns Array of StateConfig
   */
  public static getConditionConfig(condition: Condition): StateConfig {
    let condition_: StateConfig;

    if ('subject' in condition.struct) {
      if (condition.operator === 'true') {
        condition_ = lib[condition.struct.subject](condition.struct.args);
      } 
      else if (condition.operator === 'not') {
        condition_ = VM[condition.operator](
          lib[condition.struct.subject](condition.struct.args)
        );
      } 
      else {
        if ('subject' in condition.struct2!) {
          condition_ = VM[condition.operator](
            lib[condition.struct.subject](condition.struct.args),
            lib[condition.struct2!.subject](condition.struct2.args),
            false
          );
        } 
        else {
          condition_ = VM[condition.operator](
            lib[condition.struct.subject](condition.struct.args),
            condition.struct2!,
            false
          );
        }
      }
    } 
    else {
      if (condition.operator === 'true') {
        condition_ = condition.struct;
      } 
      else if (condition.operator === 'not') {
        condition_ = VM[condition.operator](condition.struct);
      } 
      else {
        if ('subject' in condition.struct2!) {
          condition_ = VM[condition.operator](
            condition.struct,
            lib[condition.struct2!.subject](condition.struct2.args),
            false
          );
        } 
        else {
          condition_ = VM[condition.operator](
            condition.struct,
            condition.struct2!,
            false
          );
        }
      }
    }
    return condition_;
  }

  /**
   * Method to get the a ConditionGroup StateConfig
   *
   * @param conditionGroup - The ConditionGroup object
   * @returns StateConfig
   */
  public static getConditionGroupConfig(
    conditionGroup: ConditionGroup
  ): StateConfig {
    let group_: StateConfig[] = [];
    for (const item of conditionGroup.conditions) {
      if ('conditions' in item) {
        group_.push(this.getConditionGroupConfig(item));
      } 
      else {
        group_.push(this.getConditionConfig(item));
      }
    }

    if (conditionGroup.operator === 'true') {
      return group_[0];
    } 
    else if (conditionGroup.operator === 'not') {
      return VM[conditionGroup.operator](group_[0]);
    } 
    else {
      return VM[conditionGroup.operator](group_, false);
    }
  }

  /**
   * Method to get the price or quantity StateConfig
   *
   * @param pq - The price or quantity
   * @returns StateConfig
   */
  public static getQPConfig(qp: Price | Quantity): StateConfig {
    if ('subject' && 'args' in qp.struct) {
      if (qp.modifier !== undefined) {
        return this.applyModifier(
          lib[qp.struct.subject](qp.struct.args),
          qp.modifier
        );
      } 
      else {
        return lib[qp.struct.subject](qp.struct.args);
      }
    } 
    else if ('consstants' && 'sources' in qp.struct) {
      if (qp.modifier !== undefined) {
        return this.applyModifier(qp.struct, qp.modifier);
      } 
      else {
        return qp.struct;
      }
    } 
    else throw new Error('Invalid argument');
  }

  /**
   * @public
   * Method to generate a single currency rule-based StateConfig
   *
   * @param config - The config to apply modifier on
   * @param modifier - The object of type Modifier
   * @returns StateConfig
   */
  public static applyModifier(
    config: StateConfig,
    modifier: Modifier
  ): StateConfig {
    if (modifier.type === 'discount') {
      return VM.setDisccount(
        config,
        this.getConditionGroupConfig(modifier.condition),
        modifier.values
      );
    } 
    else if (modifier.type === 'multiplier') {
      return VM.setMultiplier(
        config,
        this.getConditionGroupConfig(modifier.condition),
        modifier.values
      );
    } 
    else throw new Error('Invalid Arguments');
  }
}
