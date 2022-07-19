import { BigNumber } from "ethers";
import { eighteenZeros } from "../types";

/**
 * @public 
 */
export const scale18 = (value: BigNumber, scale: number) : BigNumber => {
	return scale <= 18
		? value.mul((10 ** (18 - scale)).toString())
		: value.div((10 ** (scale - 18)).toString())
}

/**
 * @public 
 */
export const scaleBy = (value: BigNumber, scale: number) : BigNumber => {
	if (scale > 127) {
		scale = 256 - scale;
		return value.div((10 ** (scale)).toString());
	}
	else {
		return value.mul((10 ** (scale)).toString());
	}
}

/**
 * @public
 */
export const scaleN = (value: BigNumber, scale: number) : BigNumber => {
	return scale <= 18
		? value.div((10 ** (18 - scale)).toString())
		: value.mul((10 ** (scale - 18)).toString())
}

/**
 * @public 
 */
export const fixedPointDiv = (value1: BigNumber, value2: BigNumber, scale: number) : BigNumber => {
	return (scale <= 18
		? value1.mul((10 ** (18 - scale)).toString())
		: value1.div((10 ** (scale - 18)).toString())
	)
	.mul(eighteenZeros).div(value2)
}

/**
 * @public 
 */
export const fixedPointMul = (value1: BigNumber, value2: BigNumber, scale: number) : BigNumber => {
	return value2.mul(
		scale <= 18
		? value1.mul((10 ** (18 - scale)).toString())
		: value1.div((10 ** (scale - 18)).toString())
	)
	.div(eighteenZeros)
}