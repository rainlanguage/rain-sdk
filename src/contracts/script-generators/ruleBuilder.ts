import { BigNumber } from "ethers";
import { concat } from "ethers/lib/utils";
import { StateConfig, VM } from "../../classes/vm";
import { areEqualConfigs, op } from "../../utils";


/**
 * @public
 * Type for price/quantity scripts modifier based on a tier report
 */
export interface modifier {
  /**
   * Determines the modifier's mode
   */
  mode: "tier-discounts" | "tier-multipliers" | "discount" | "multiplier",
  /**
   * the condition of the modifier, either a tier contract address for tier modifier or a boolean StateConfig for none tier modifier
   */
  condition: string | StateConfig,
  /**
   * The modifing value(s)
   */
  values: number[],
  /**
   * Optional properties for specific modifier's mode
   */
  options?: {
    /** 
     * context for tier report of tier based modifiers
     */
    tierContext?: BigNumber[],
    /**
     * Used in tier modifiers to determins if the delegated reported is available or not, i.e use SENDER if false and CONTEXT[0] if true
     */
    delegatedReport?: boolean
  }
}

/**
 * @public
 * Type for a currency scripts used in RuleBuilder class
 */
export interface vmCurrency {
  /**
   * Default quantity StateConfig of this currency
   */
  defaultQuantity: StateConfig,
  /**
   * Default price StateConfig of this currency
   */
  defaultPrice: StateConfig,
  /**
   * Array of conditions for conditional quantities
   */
  quantityConditions: StateConfig[],
  /**
   * Array of conditional quantities
   */
  quantities: StateConfig[],
  /**
   * Array of conditions for conditional prices
   */
  priceConditions: StateConfig[],
  /**
   * Array of conditional prices
   */
  prices: StateConfig[],
  /**
   * Quantities modifiers, modifier on a single sub-quantity StateConfig
   */
  quantityModifiers: {
    [index: number]: modifier,
  },
  /**
   * Prices modifiers, modifier on a single sub-price StateConfig
   */
  priceModifiers: {
    [index: number]: modifier,
  },
  /**
   * Top quantity modifier, modifier on all sub-quantities
   */
  quantityTopModifier?: modifier,
  /**
   * Top price modifier, modifier on all sub-prices
   */
  priceTopModifier?: modifier,
}

/**
 * @public
 * Class with methods to generate a rule-based StateConfig
 */
export class RuleBuilder {

  /**
   * @public
   * Method to generate a multi currency rule-based StateConfig
   * 
   * @param currencies - An array of vmCurrency objects
   * @returns A StateConfig
   */
  public static multiCurrency(currencies: vmCurrency[]): StateConfig {

    let rules_: StateConfig = {constants: [], sources: []};
    let currencies_: StateConfig[] = [];
    let count = 0; 

    for (let i = 0; i < currencies.length; i++) {
      let quantities_: StateConfig = {constants: [], sources: [concat([])]};
      let prices_: StateConfig= {constants: [], sources: [concat([])]};

      if (
        currencies[i].quantities.length === currencies[i].prices.length &&
        currencies[i].quantityConditions.length === currencies[i].priceConditions.length &&
        currencies[i].prices.length === currencies[i].priceConditions.length
      ) {
        for (let j = 0; j < currencies[i].quantityConditions.length; j++) {
          rules_ = VM.pair(
            rules_,
            areEqualConfigs(currencies[i].quantityConditions[j], currencies[i].priceConditions[j],)
            ? VM.pair(
              currencies[i].quantityConditions[j],
              VM.stack(count * 2),
              false
            )
            : VM.pair(
              currencies[i].quantityConditions[j], 
              currencies[i].priceConditions[j],
              false
            ),
            false
          );

          quantities_ = VM.pair(
            quantities_,
            currencies[i].quantityModifiers[j] 
            ? RuleBuilder.applyModifier(
                VM.mulTogether([
                  VM.stack(count * 2),
                  currencies[i].quantities[j],
                ],
                false
              ),
              currencies[i].quantityModifiers[j]
            )
            : VM.mulTogether([
                VM.stack(count * 2),
                currencies[i].quantities[j],
              ],
              false
            ),
            false
          );

          prices_ = VM.pair(
            prices_,
            currencies[i].priceModifiers[j] 
            ? RuleBuilder.applyModifier(
                VM.mulTogether([
                  VM.stack((count * 2) + 1),
                  currencies[i].prices[j],
                ],
                false
              ),
              currencies[i].priceModifiers[j]
            )
            : VM.mulTogether([
                VM.stack((count * 2) + 1),
                currencies[i].prices[j],
              ],
              false
            ),
            false
          );

          if (j + 1 === currencies[i].quantities.length) {
            quantities_ = VM.pair(quantities_, currencies[i].defaultQuantity, false);
            prices_ = VM.pair(prices_, currencies[i].defaultPrice, false);

            quantities_.sources[0] = concat([
              quantities_.sources[0],
              op(VM.Opcodes.MAX, currencies[i].quantities.length + 1)
            ])
            prices_.sources[0] = concat([
              prices_.sources[0],
              op(VM.Opcodes.MIN, currencies[i].quantities.length + 1)
            ])
          }
          count++;
        }
        if (currencies[i].quantityTopModifier !== undefined) {
          quantities_ = RuleBuilder.applyModifier(
            quantities_,
            currencies[i].quantityTopModifier!
          )
        }
        if (currencies[i].priceTopModifier !== undefined) {
          prices_ = RuleBuilder.applyModifier(
            prices_,
            currencies[i].priceTopModifier!
          )
        }
        currencies_.push(VM.pair(quantities_, prices_, false));
      }
    }
      
    return VM.multi([rules_, ...currencies_], false);
  }

  /**
   * @public
   * Method to generate a single currency rule-based StateConfig
   * 
   * @param currency - A vmCurrency object
   * @returns A StateConfig
   */
  public static singleCurrency(currency: vmCurrency): StateConfig {
    return this.multiCurrency([currency]);
  }

  /**
   * Method to apply modifier to price/quantity scripts for the RuleBuilder main methods 
   */
  private static applyModifier(config: StateConfig, modifier: modifier): StateConfig {

    if (
      modifier.mode === "tier-multipliers" && 
      typeof modifier.condition === "string" && 
      modifier.values.length === 8
    ) return VM.setDiscountForTiers(
      config,
      modifier.condition,
      modifier.values,
      { 
        tierContext: modifier.options?.tierContext,
        delegatedReport: modifier.options?.delegatedReport
      }
    )

    else if (
      modifier.mode === "tier-discounts" && 
      typeof modifier.condition === "string" && 
      modifier.values.length === 8
    ) return VM.setDiscountForTiers(
      config,
      modifier.condition,
      modifier.values,
      { 
        tierContext: modifier.options?.tierContext,
        delegatedReport: modifier.options?.delegatedReport
      }
    )

    else if (
      modifier.mode === "discount" && 
      typeof modifier.condition !== "string" && 
      modifier.values.length !== 0
    ) return VM.setDisccount(
      config,
      modifier.condition,
      modifier.values[0]
    )

    else if (
      modifier.mode === "multiplier" && 
      typeof modifier.condition !== "string" && 
      modifier.values.length !== 0
    ) return VM.setMultiplier(
      config,
      modifier.condition,
      modifier.values[0]
    )

    else throw new Error("Invalid Arguments");
  }
}