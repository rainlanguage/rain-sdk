import { BigNumber, ethers } from "ethers"

/**
 * @public 
 */
export const saturatingAdd = (value1: BigNumber, value2: BigNumber) : BigNumber => {
  value1 = value1.add(value2);
  value1 = value1.gt(ethers.constants.MaxUint256)
    ? ethers.constants.MaxUint256
    : value1;
  
  return value1;
}

/**
 * @public
 * 
 */
export const saturatingMul = (value1: BigNumber, value2: BigNumber) : BigNumber => {
  value1 = value1.mul(value2);
  value1 = value1.gt(ethers.constants.MaxUint256)
    ? ethers.constants.MaxUint256
    : value1;

  return value1;
}

/**
 * @public
 */
export const saturatingSub = (value1: BigNumber, value2: BigNumber) : BigNumber => {
  value1 = value1?.sub(value2);
  value1 = value1.gt(0)
    ? value1
    : ethers.constants.Zero;

  return value1;
}
