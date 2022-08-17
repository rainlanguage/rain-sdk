import { vmbook } from './vmbook';
import { IOpMeta } from '../vm/OpMeta';
import { StateConfig, VM } from '../classes/vm';
import { areEqualConfigs, concat } from '../utils';
import { FnPtrsJSVM, RainJSVM } from '../jsvm/RainJSVM';
import { 
    Signer,
    Contract,
    BigNumber,
    BytesLike,
    BigNumberish
} from 'ethers';
import {
    AllStandardArgs,
    Condition,
    ConditionGroup,
    Currency,
    eConditionGroup,
    eCurrency,
    eRule,
    Modifier,
    Price,
    Quantity
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
 * // to get the multi-currency rule-based StateConfig:
 * const vmStateConfig = new RuleBuilder([currency1, currency2, ...])
 *
 * // to get a single condition's StateConfig of a single Rule:
 * const conditions = RuleBuilder.getConditionConfig(condition)
 *
 * // to get a ConditionGroup StateConfig:
 * const rule = RuleBuilder.getConditionGroup(conditionGroup)
 *
 * //to get a single price or quantity StateConfig:
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
        const vm_ = RuleBuilder.from(currencies);
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
    public static from(currencies: Currency[]): StateConfig {
        let rules_: StateConfig[] = [];
        let thens_: StateConfig[] = [];
        let defaults_: StateConfig[] = [];
        let count = 0;
        let totalCount = 0;

        for (const currency of currencies) {
            totalCount += currency.rules.length * 2;
        }

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
                    VM.ifelse(
                        VM.stack(count * 2),
                        this.getQPConfig(rule.quantity),
                        VM.stack(totalCount + (i * 2)),
                        false
                    )
                );
                ps_.push(
                    VM.ifelse(
                        VM.stack((count * 2) + 1),
                        this.getQPConfig(rule.price),
                        VM.stack(totalCount + ((i * 2) + 1)),
                        false
                    )
                );
                count++;
            }

            if (currencies[i].rules.length > 0) {
                defaults_.push(this.getQPConfig(currencies[i].default.quantity));
                defaults_.push(this.getQPConfig(currencies[i].default.price));

                qs_.push(VM.stack(totalCount + (i * 2)));
                ps_.push(VM.stack(totalCount + ((i * 2) + 1)));
        
                q_ = (VM[currencies[i].pick.quantities](qs_, false));
                p_ = (VM[currencies[i].pick.prices](ps_, false));
            }
            else {
                rules_.push({ constants: [], sources: [concat([])] });
                defaults_.push({ constants: [], sources: [concat([])] })
                defaults_.push({ constants: [], sources: [concat([])] });

                p_ = this.getQPConfig(currencies[i].default.price);
                q_ = this.getQPConfig(currencies[i].default.quantity);
            }

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

        return VM.multi([...rules_, ...defaults_, ...thens_], false);
    }

    /**
     * Method to get the conditions' StateConfig of a ConditionGroup seperately
     *
     * @param conditionGroup - The ConditionGroup object
     * @returns Array of StateConfig
     */
    public static getConditionConfig(condition: Condition): StateConfig {

        if (condition === 'always' || condition === 'never') {
            return vmbook[condition]({});
        }
        else if ('constants' && 'sources' in condition) {
            return condition;
        }
        else if ('struct' in condition) {
            if ('subject' in condition.struct) {
                if (condition.operator === 'true') {
                    return vmbook[condition.struct.subject](condition.struct.args as AllStandardArgs);
                } 
                else if (condition.operator === 'not') {
                    return VM[condition.operator](
                        vmbook[condition.struct.subject](condition.struct.args as AllStandardArgs)
                    );
                } 
                else {
                    if ('subject' in condition.struct2!) {
                        return VM[condition.operator](
                            vmbook[condition.struct.subject](condition.struct.args as AllStandardArgs),
                            vmbook[condition.struct2!.subject](condition.struct2.args as AllStandardArgs),
                            false
                        );
                    } 
                    else {
                        return VM[condition.operator](
                            vmbook[condition.struct.subject](condition.struct.args as AllStandardArgs),
                            condition.struct2!,
                            false
                        );
                    }
                }
            }
            else {
                if (condition.operator === 'true') {
                    return condition.struct;
                } 
                else if (condition.operator === 'not') {
                    return VM[condition.operator](condition.struct);
                } 
                else {
                    if ('subject' in condition.struct2!) {
                        return VM[condition.operator](
                        condition.struct,
                        vmbook[condition.struct2!.subject](condition.struct2.args as AllStandardArgs),
                        false
                        );
                    } 
                    else {
                        return VM[condition.operator](
                            condition.struct,
                            condition.struct2!,
                            false
                        );
                    }
                }
            } 
        }
        else throw new Error('Invalid argument');
    }

    /**
     * Method to get the a ConditionGroup StateConfig
     *
     * @param conditionGroup - The ConditionGroup object
     * @returns StateConfig
     */
    public static getConditionGroupConfig(conditionGroup: ConditionGroup): StateConfig {
        let group_: StateConfig[] = [];

        if (conditionGroup === 'always' || conditionGroup === 'never') {
            return vmbook[conditionGroup]({});
        }
        else if ('constants' && 'sources' in conditionGroup) {
            return conditionGroup;
        }
        else if ('conditions' in conditionGroup) {
            for (const item of conditionGroup.conditions) {
                if (item === 'always' || item === 'never') {
                    group_.push(vmbook[item]({}));
                }
                else if ('constants' && 'sources' in item) {
                    group_.push(item);
                }
                else if ('conditions' in item) {
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
        else throw new Error('Invalid argument');
    }

    /**
     * Method to get the price or quantity StateConfig
     *
     * @param qp - The price or quantity
     * @returns StateConfig
     */
    public static getQPConfig(qp: Price | Quantity): StateConfig {
        if ('subject' && 'args' in qp.struct) {
            if (qp.modifier !== undefined) {
                return this.applyModifier(
                    vmbook[qp.struct.subject](qp.struct.args as  AllStandardArgs),
                    qp.modifier
                );
            } 
            else {
                return vmbook[qp.struct.subject](qp.struct.args as  AllStandardArgs);
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

    /**
     * @public
     * Method to execute and evaluate the generated StateConfig by Rain JSVM from Currency object(s) and return an eCurrency 
     * object(s) which is basically the same Currency object with result fields for each individual
     * part of the StateConfig i.e. Quantities, Prices, Conditions etc.
     * 
     * @param currencies - An array of Currency object(s)
     * @param signer - A valid ethers signer
     * @param options - (optional) Additional arguments to be passed to the JSVM
     * @returns An eCurrency object
     */
    public static async eval(
        currencies: Currency[],
        signer: Signer,
        options?: {
            /**
             * This assets contract or its address
             */
            contract?: Contract | string,
            /**
             * Necessary context such as account, buy units, ... for JSVM to be able to run properly
             */
            context?: string[],
            /**
             * Any other potential data that needs to be provided for JSVM at runtime
             */
            data?: any,
            /**
             * The OpMeta Map object that contains all the opcodes' functions and enums and can be used 
             * for expanding and/or providing custom/local opcodes for JSVM
             */
            opMeta?:  Map<number, IOpMeta>
            /**
             * key/value pair of custom STORAGE opcodes' functions
             */
            storageOpFn?: FnPtrsJSVM,
        }
    ): Promise<eCurrency[]> {

        /**
         * A function to get the eConditionGroup object from a ConditionGroup
         */
        const evalConditionGroup = async (
            conditionGroup: ConditionGroup,
            signer: Signer,
            contract?: Contract | string,
            context?: string[],
            data?: any,
            storageOpFn?: FnPtrsJSVM,
            opMeta?:  Map<number, IOpMeta>
        ): Promise<eConditionGroup> => {
            let group_: StateConfig[] = [];
            let obj: any = conditionGroup;

            if (conditionGroup === 'always' || conditionGroup === 'never') {
                obj = conditionGroup;
            }
            else if ('constants' && 'sources' in conditionGroup) {
                const result_ = await (
                    new RainJSVM(conditionGroup, {
                        signer,
                        contract,
                        storageOpFn,
                        opMeta
                    })
                )
                .run({ context, ...data })

                obj.result = result_[result_.length - 1].isZero() 
                    ? false 
                    : true
            }
            else if ('conditions' in conditionGroup) {
                for (let i = 0; i < conditionGroup.conditions.length; i++) {
                    const condition = conditionGroup.conditions[i];

                    if (condition === 'always' || condition === 'never') {
                        group_.push(vmbook[condition]({}))
                    }
                    else if ('constants' && 'sources' in condition) {
                        group_.push(condition);
                        const result_ = await (
                            new RainJSVM(condition, {
                                signer,
                                contract,
                                storageOpFn,
                                opMeta
                            })
                        )
                        .run({ context, ...data })

                        obj.conditions[i].results = result_[result_.length - 1].isZero() 
                            ? false 
                            : true;
                    }
                    else if ('conditions' in condition) {
                        const config_ = this.getConditionGroupConfig(condition);
                        group_.push(config_);

                        obj.conditions[i] = await evalConditionGroup(
                            condition,
                            signer,
                            contract,
                            context,
                            data,
                            storageOpFn,
                            opMeta
                        )
                    }
                    else {
                        const config_ = this.getConditionConfig(condition);
                        group_.push(config_);

                        const result_ = await (
                            new RainJSVM(config_, {
                                signer,
                                contract,
                                storageOpFn,
                                opMeta
                            })
                        )
                        .run({ context, ...data })

                        obj.conditions[i].result = result_[result_.length - 1].isZero() 
                            ? false 
                            : true;
                    }
                }
                if (conditionGroup.operator === 'true') {
                    const result_ = await (
                        new RainJSVM(group_[0], {
                            signer,
                            contract,
                            storageOpFn,
                            opMeta
                        })
                    )
                    .run({ context, ...data })

                    obj.result = result_[result_.length - 1].isZero() 
                        ? false 
                        : true;
                }
                else if (conditionGroup.operator === 'not') {
                    const result_ = await (
                        new RainJSVM(
                            VM[conditionGroup.operator](group_[0]), {
                                signer,
                                contract,
                                storageOpFn,
                                opMeta
                            }
                        )
                    )
                    .run({ context, ...data })

                    obj.result = result_[result_.length - 1].isZero() 
                        ? false 
                        : true;
                }
                else {
                    const result_ = await (
                        new RainJSVM(
                            VM[conditionGroup.operator](group_, false), {
                                signer,
                                contract,
                                storageOpFn,
                                opMeta
                            }
                        )
                    )
                    .run({ context, ...data })

                    obj.result = result_[result_.length - 1].isZero() 
                        ? false 
                        : true;
                }
            }
            return obj as eConditionGroup
        }

        let eCurrencyObj: eCurrency[] = [];
        let q_: BigNumber[] = [];
        let p_: BigNumber[] = [];

        for (let i = 0; i < currencies.length; i++) {
            let eRules: eRule[] = [];
            let temp: BigNumber[];

            temp = await (
                new RainJSVM(
                    this.getQPConfig(currencies[i].default.quantity), {
                        signer,
                        contract: options?.contract,
                        opMeta: options?.opMeta,
                        storageOpFn: options?.storageOpFn
                    }
                )
            )
            .run({
                context: options?.context,
                ...options?.data
            });
            const qDefault_ = temp[temp.length - 1];
            q_.push(qDefault_);

            temp = await (
                new RainJSVM(
                    this.getQPConfig(currencies[i].default.price), {
                        signer,
                        contract: options?.contract,
                        opMeta: options?.opMeta,
                        storageOpFn: options?.storageOpFn
                    }
                )
            )
            .run({
                context: options?.context,
                ...options?.data
            });
            const pDefault_ = temp[temp.length - 1];
            p_.push(pDefault_);

            for (let j = 0; j < currencies[i].rules.length; j++) {
                const rule = currencies[i].rules[j];

                temp = await (
                    new RainJSVM(
                        this.getQPConfig(rule.quantity), { 
                            signer,
                            contract: options?.contract,
                            opMeta: options?.opMeta,
                            storageOpFn: options?.storageOpFn
                        }
                    )
                )
                .run({
                    context: options?.context,
                    ...options?.data
                });
                const qResult_ = temp[temp.length - 1];
                let qm_;
                if (rule.quantity.modifier !== undefined) {
                    qm_ = {
                        type: rule.quantity.modifier.type,
                        values: rule.quantity.modifier.values,
                        condition: await evalConditionGroup(
                            rule.quantity.modifier.condition,
                            signer,
                            options?.contract,
                            options?.context,
                            options?.data,
                            options?.storageOpFn,
                            options?.opMeta
                        )
                    }
                }

                temp = await (
                    new RainJSVM(
                        this.getQPConfig(rule.price), { 
                            signer,
                            contract: options?.contract,
                            opMeta: options?.opMeta,
                            storageOpFn: options?.storageOpFn
                        }
                    )
                )
                .run({
                    context: options?.context,
                    ...options?.data
                });
                const pResult_ = temp[temp.length - 1];
                let pm_;
                if (rule.price.modifier !== undefined) {
                    pm_ = {
                        type: rule.price.modifier.type,
                        values: rule.price.modifier.values,
                        condition: await evalConditionGroup(
                            rule.price.modifier.condition,
                            signer,
                            options?.contract,
                            options?.context,
                            options?.data,
                            options?.storageOpFn,
                            options?.opMeta
                        )
                    }
                }

                const quantityConditions = await evalConditionGroup(
                    rule.quantityConditions,
                    signer,
                    options?.contract,
                    options?.context,
                    options?.data,
                    options?.storageOpFn,
                    options?.opMeta
                );
                const priceConditions = await evalConditionGroup(
                    rule.priceConditions,
                    signer,
                    options?.contract,
                    options?.context,
                    options?.data,
                    options?.storageOpFn,
                    options?.opMeta
                );

                eRules.push({
                    quantityConditions,
                    priceConditions,
                    quantity: {
                        struct: rule.quantity.struct,
                        modifier: qm_
                    },
                    price: {
                        struct: rule.price.struct,
                        modifier: pm_
                    },
                    result: {
                        quantity: quantityConditions === 'always'
                            ? qResult_
                            : quantityConditions === 'never'
                            ? qDefault_
                            : quantityConditions.result
                            ? qResult_
                            : qDefault_,

                        price: priceConditions === 'always'
                            ? pResult_
                            : priceConditions === 'never'
                            ? pDefault_
                            : priceConditions.result
                            ? pResult_
                            : pDefault_,
                    }
                })

                q_.push(eRules[j].result.quantity);
                p_.push(eRules[j].result.price);
            }

            eCurrencyObj[i] = {
                rules: eRules,
                default: currencies[i].default,
                pick: currencies[i].pick,
                result: {
                    quantity: q_.reduce(
                        (a, b) => currencies[i].pick.quantities === 'max' 
                            ? a.gte(b) ? a : b 
                            : a.lte(b) ? a : b
                    ),
                    price: p_.reduce(
                        (a, b) => currencies[i].pick.prices === 'max' 
                            ? a.gte(b) ? a : b 
                            : a.lte(b) ? a : b
                    )
                }
            }

            const qModifier = currencies[i].quantityGlobalModifier;
            const pModifier = currencies[i].priceGlobalModifier;

            if (qModifier) {
                eCurrencyObj[i].quantityGlobalModifier = {
                    type: qModifier.type,
                    values: qModifier.values,
                    condition: await evalConditionGroup(
                        qModifier.condition,
                        signer,
                        options?.contract,
                        options?.context,
                        options?.data,
                        options?.storageOpFn,
                        options?.opMeta
                    )
                };
                if (qModifier.condition === 'always') {
                    if (qModifier.type === 'multiplier') {
                        eCurrencyObj[i].result.quantity = eCurrencyObj[i].result.quantity
                            .mul(Math.floor(qModifier.values * 100))
                            .div(100)
                    }
                    else {
                        eCurrencyObj[i].result.quantity = eCurrencyObj[i].result.quantity
                            .mul(Math.floor(qModifier.values * 10000))
                            .div(10000)
                    }
                }
                if (qModifier.condition !== 'never') {
                    if (
                        (eCurrencyObj[i].quantityGlobalModifier!.condition as Exclude<
                            eConditionGroup, 'always' | 'never'
                        >).result
                    ) {
                        if (qModifier.type === 'multiplier') {
                            eCurrencyObj[i].result.quantity = eCurrencyObj[i].result.quantity
                                .mul(Math.floor(qModifier.values * 100))
                                .div(100)
                        }
                        else {
                            eCurrencyObj[i].result.quantity = eCurrencyObj[i].result.quantity
                                .mul(Math.floor(qModifier.values * 10000))
                                .div(10000)
                        }
                    }
                }
            }
            if (pModifier) {
                eCurrencyObj[i].priceGlobalModifier = {
                    type: pModifier.type,
                    values: pModifier.values,
                    condition: await evalConditionGroup(
                        pModifier.condition,
                        signer,
                        options?.contract,
                        options?.context,
                        options?.data,
                        options?.storageOpFn,
                        options?.opMeta
                    )
                };
                if (pModifier.condition === 'always') {
                    if (pModifier.type === 'multiplier') {
                        eCurrencyObj[i].result.price = eCurrencyObj[i].result.price
                            .mul(Math.floor(pModifier.values * 100))
                            .div(100)
                    }
                    else {
                        eCurrencyObj[i].result.price = eCurrencyObj[i].result.price
                            .mul(Math.floor(pModifier.values * 10000))
                            .div(10000)
                    }
                }
                if (pModifier.condition !== 'never') {
                    if (
                        (eCurrencyObj[i].priceGlobalModifier!.condition as Exclude<
                            eConditionGroup, 'always' | 'never'
                        >).result
                    ) {
                        if (pModifier.type === 'multiplier') {
                            eCurrencyObj[i].result.price = eCurrencyObj[i].result.price
                                .mul(Math.floor(pModifier.values * 100))
                                .div(100)
                        }
                        else {
                            eCurrencyObj[i].result.price = eCurrencyObj[i].result.price
                                .mul(Math.floor(pModifier.values * 10000))
                                .div(10000)
                        }
                    }
                }
            }
        }
        return eCurrencyObj;
    }
}

