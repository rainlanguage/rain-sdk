import { BigNumber } from "ethers";


/**
 * @public
 * calculate the minimum among array of BigNumbers
 * 
 * @param values - array of BigNumbers to calculate the min value out of them
 * @returns the min of values in BigNumber type
 */
export const min = (values: BigNumber[]): BigNumber => {

  return values.reduce((e, m) => (e.lt(m) ? e : m))
}

/**
 * @public
 * calculate the maximum among array of BigNumbers
 * 
 * @param values - array of BigNumbers to calculate the max value out of them
 * @returns the max of values in BigNumber type
 */
export const max = (values: BigNumber[]): BigNumber => {
  
  return values.reduce((e, m) => (e.gt(m) ? e : m))
}