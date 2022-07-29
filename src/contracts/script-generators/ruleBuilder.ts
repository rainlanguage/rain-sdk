import { BigNumber } from "ethers";
import { concat } from "ethers/lib/utils";
import { StateConfig, VM } from "../../classes/vm";
import { areEqualConfigs, op } from "../../utils";


/**
 * @public
 * Type for price/quantity scripts modifier based on a tier report
 */
export interface modifier {
  mode: "discounter" | "multiplier",
  tierAddress: string,
  tierModifierValues: number[],
  tierActivation?: (string | number)[],
  tierContext?: BigNumber[]
}

/**
 * @public
 * Type for a currency scripts used in Rulebuilder class
 */
export interface vmCurrency {
  qRules: StateConfig[],
  quantities: StateConfig[],
  pRules: StateConfig[],
  prices: StateConfig[],
  pModifiers: {
    [index: number]: modifier,
  },
  qModifiers: {
    [index: number]: modifier,
  },
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
    let quantities_: StateConfig[] = [];
    let prices_: StateConfig[] = [];
    let count = 0; 

    for (let i = 0; i < currencies.length; i++) {
      if (
        currencies[i].quantities.length === currencies[i].prices.length &&
        currencies[i].qRules.length === currencies[i].pRules.length &&
        currencies[i].prices.length === currencies[i].pRules.length
      ) {
        for (let j = 0; j < currencies[i].qRules.length; j++) {
          rules_ = VM.pair(
            rules_,
            areEqualConfigs(currencies[i].qRules[j], currencies[i].pRules[j],)
            ? VM.pair(
              currencies[i].qRules[j],
              VM.stack(count * 2)
            )
            : VM.pair(
              currencies[i].qRules[j], 
              currencies[i].pRules[j],
              false
            ),
            false
          );

          quantities_[i] = VM.pair(
            quantities_[i],
            currencies[i].qModifiers[j] 
            ? RuleBuilder.applyModifier(
                VM.mulTogether([
                  VM.stack(count * 2),
                  currencies[i].quantities[j],
                ],
                false
              ),
              currencies[i].qModifiers[j]
            )
            : VM.mulTogether([
                VM.stack(count * 2),
                currencies[i].quantities[j],
              ],
              false
            ),
            false
          );

          prices_[i] = VM.pair(
            prices_[i],
            currencies[i].pModifiers[j] 
            ? RuleBuilder.applyModifier(
                VM.mulTogether([
                  VM.stack((count * 2) + 1),
                  currencies[i].prices[j],
                ],
                false
              ),
              currencies[i].pModifiers[j]
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
            quantities_[i].sources[0] = concat([
              quantities_[i].sources[0],
              op(VM.Opcodes.MAX, currencies[i].quantities.length)
            ])
            prices_[i].sources[0] = concat([
              prices_[i].sources[0],
              (op(VM.Opcodes.MIN, currencies[i].quantities.length))
            ]) 
          }

          if (currencies[i].qModifiers[currencies[i].quantities.length]) {
            quantities_[i] = RuleBuilder.applyModifier(
              quantities_[i],
              currencies[i].qModifiers[currencies[i].quantities.length]
            )
          }
          if (currencies[i].pModifiers[currencies[i].prices.length]) {
            prices_[i] = RuleBuilder.applyModifier(
              prices_[i],
              currencies[i].pModifiers[currencies[i].prices.length]
            )
          }
          count++;
        }
      }
    }
      
    return VM.multi([
        rules_,
        VM.multi(quantities_, false),
        VM.multi(prices_, false)
      ],
      false
    );
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
    if (modifier.mode === "multiplier") return VM.setDiscountForTiers(
      config,
      modifier.tierAddress,
      modifier.tierModifierValues,
      {
        tierActivation: modifier.tierActivation,
        tierContext: modifier.tierContext
      }
    )
    else if (modifier.mode === "discounter") return VM.setDiscountForTiers(
      config,
      modifier.tierAddress,
      modifier.tierModifierValues,
      {
        tierActivation: modifier.tierActivation,
        tierContext: modifier.tierContext
      }
    )
    else throw new Error("Invalid Arguments");
  }

}


