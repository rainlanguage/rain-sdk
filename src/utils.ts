import type { BytesLike, Signer } from 'ethers';
import { isBytes, isHexString } from 'ethers/lib/utils';
import { BigNumber, BigNumberish, ethers, utils } from 'ethers';
import { StateConfig } from './classes/vm';
import { ITierV2 } from './classes/iTierV2';


export const {
	/**
	 * @public ethers concat
	 * @see ethers.concat
	 */
	concat,
	/**
	 * @public ethers hexlify
	 * @see ethers.hexlify
	 */
	hexlify,
	/**
	 * @public ethers zeroPad
	 * @see ethers.zeroPad
	 */
	zeroPad,
	/**
	 * @public ethers hexZeroPad
	 * @see ethers.hexZeroPad
	 */
	hexZeroPad,
	/**
	 * @public ethers arrayify
	 * @see ethers.arrayify
	 */
	arrayify,
	/**
	 * @public ethers parseUnits
	 * @see ethers.parseUnits
	 */
	parseUnits,

} = utils;

/**
 * @public a native type for ethers Hexable
 */
export type Hexable = utils.Hexable;

/**
 * @public An enum for selectLte logic
 */
export enum selectLteLogic {
  	every,
  	any,
}

/**
 * @public An enum for selectLte mode
 */
export enum selectLteMode {
  	min,
  	max,
  	first,
}

/**
 * @public
 * Converts an opcode and operand to bytes, and returns their concatenation.
 *
 * @param code - the opcode
 * @param erand - the operand, currently limited to 1 byte (defaults to 0)
 */
export const op = (
  	code: number,
  	erand: number | BytesLike | utils.Hexable = 0
): Uint8Array => {

  	return concat([bytify(code), bytify(erand)]);
};

/**
 * @public
 * Converts a value to raw bytes representation. Assumes `value` is less than or equal to 1 byte,
 * unless a desired `bytesLength` is specified.
 *
 * @param value - value to convert to raw bytes format
 * @param bytesLength - (defaults to 1) number of bytes to left pad if `value` doesn't completely
 * fill the desired amount of memory. Will throw `InvalidArgument` error if value already exceeds
 * bytes length.
 * @returns raw bytes representation as Uint8Array
 */
export const bytify = (
  	value: number | BytesLike | utils.Hexable,
  	bytesLength = 1
): BytesLike => {

  	return zeroPad(hexlify(value), bytesLength);
};

/**
 * @public
 * Utility function that transforms a BigNumberish from the output of the ITierV2 contract report
 *
 * @param report - report as bignumberish from the ITierV2 contract
 * @returns hexadecimal string of the report already padded (64 char hexString)
 */
export const paddedUInt256 = (report: BigNumberish): string => {
  	if (BigNumber.from(report).gt(ethers.constants.MaxUint256)) {
    	throw new Error(`${report} exceeds max uint256`);
  	}
  	return "0x" + BigNumber.from(report).toHexString().substring(2).padStart(64, "0");
};

/**
 * @public Utility function to produce 32 bits size hexString
 *
 * @param number - the value to convert into a 32bit size hexString
 *
 * @returns a 8 char hexString (without 0x prefix)
 */
export const paddedUInt32 = (number: BigNumberish): string => {
  	if (BigNumber.from(number).gt('0xffffffff')) {
    	throw new Error(`${number} exceeds max uint32`);
  	}
  	return BigNumber.from(number).toHexString().substring(2).padStart(8, "0");
};

/**
 * @public function to pack start/end tier range into a byte size number for the UPDATE_BLOCKS_FOR_TIER_RANGE opcode
 *
 * @param startTier - the start tier of the updating which ranges between 0 to 8 (exclusive)
 * @param endTier - the end tier of the updating which ranges between 0 to 8 (inclusive)
 *
 * @returns a byte size number
 */
export function tierRange(startTier: number, endTier: number): number {
  	//   op_.val & 0x0f, //     00001111
  	//   op_.val & 0xf0, //     11110000

  	if (startTier < 0 || startTier > 8) {
    	throw new Error(`Invalid startTier ${startTier}`);
  	} else if (endTier < 0 || endTier > 8) {
    	throw new Error(`Invalid endTier ${endTier}`);
 	}
  	let range = endTier;
  	range <<= 4;
  	range += startTier;
  	return range;
}

/**
 * @public
 * Constructs the operand for RainVM's `zipmap` opcode by packing 3 numbers into a single byte.
 * All parameters use zero-based counting i.e. an `fnSize` of 0 means to allocate one element (32 bytes)
 * on the stack to define your functions, while an `fnSize` of 3 means to allocate all four elements
 * (4 * 32 bytes) on the stack.
 *
 * @param sourceIndex - index of function source in `immutableSourceConfig.sources`
 * @param loopSize - number of times to subdivide vals, reduces uint size but allows for more vals (range 0-7)
 * @param valSize - number of vals in outer stack (range 0-7)
 */
export function callSize(
  	sourceIndex: number,
  	loopSize: number,
  	valSize: number
): number {
  	// CallSize(
  	//   op_.val & 0x07,      // 00000111
  	//   op_.val >> 3 & 0x03, // 00011000
  	//   op_.val >> 5 & 0x07  // 11100000
  	// )

  	if (sourceIndex < 0 || sourceIndex > 7) {
    	throw new Error('Invalid fnIndex');
  	} else if (loopSize < 0 || loopSize > 3) {
    	throw new Error('Invalid loopSize');
  	} else if (valSize < 0 || valSize > 7) {
    	throw new Error('Invalid valSize');
  	}
  	let callSize = valSize;
  	callSize <<= 2;
  	callSize += loopSize;
  	callSize <<= 3;
  	callSize += sourceIndex;

  	return callSize;
}

/**
 * @public function to set up the operand for a SELECT_LTE opcode
 *
 * @param logic - 0 = every, 1 = any, acts like a logical and/or for the check against BLOCK_NUMBER
 * @param mode - 0 = min, 1 = max, 2 = first, the way to select the reports that pass the check against BLOCK_NUMBER
 * @param length - the number of reports to stack for SELECT_LTE opcode
 *
 * @returns a byte size number
 */
export function selectLte(logic: number, mode: number, length: number): number {
  	let lte = logic;
  	lte <<= 2;
  	lte += mode;
  	lte <<= 5;
  	lte += length;

  	return lte;
}

/**
 * @public
 * Replace a value in a BytesLike. Set `replacement` in the `index` on the `original` BytesLike value
 *
 * @param original - Value that will be changed
 * @param index - index/position where the new value will be set
 * @param replacement - the new value to replace
 * @returns BytesLike with the value replaced
 */
export const replaceAt = (
  	original: BytesLike,
  	index: number,
  	replacement: string | number
): BytesLike => {

  	const originalParsed = arrayify(original, { allowMissingPrefix: true });
  	originalParsed[index] = parseInt(replacement.toString());

  	return originalParsed;
};

/**
 * @public Utility function to produce 64 bits size hexString
 *
 * @param number - the value to convert into a 64bit size hexString
 *
 * @returns a 16 character hexString (without 0x prefix)
 */
export const paddedUInt64 = (number: BigNumberish): string => {
  	if (BigNumber.from(number).gt('0xffffffffffffffff')) {
    	throw new Error(`${number} exceeds max uint64`);
  	}
  	return BigNumber.from(number).toHexString().substring(2).padStart(16, "0");
};

/**
 * @public Utility function to produce 128 bits size hexString
 *
 * @param number - the value to convert into a 128bit size hexString
 *
 * @returns a 32 character hexString (without 0x prefix)
 */
export const paddedUInt128 = (number: BigNumberish): string => {
  	if (BigNumber.from(number).gt('0xffffffffffffffffffffffffffffffff')) {
    	throw new Error(`${number} exceeds max uint128`);
  	}
  	return BigNumber.from(number).toHexString().substring(2).padStart(32, "0");
};

/**
 * @public
 * Utility function that transforms a BigNumberish to an ether address (40 char length hexString)
 *
 * @param report - value as bignumberish
 * @returns hexadecimal string as an ether address (40 char length hexString)
 */
export const paddedUInt160 = (address: BigNumberish): string => {
  	if (
    	BigNumber.from(address).gt('0xffffffffffffffffffffffffffffffffffffffff')
  	) {
    	throw new Error(`${address} exceeds max uint160`);
  	}
  	return "0x" + BigNumber.from(address).toHexString().substring(2).padStart(40, "0");
};

/**
 * @public
 * Convert an array of 8 BigNumberish values to 8 32bit values packed in a HexString uint256 i.e. Report
 * 
 * @param array - The array to make report from
 * @returns a 64char length HexString (uint256)
 */
export const arrToReport = (array: BigNumberish[]): string => {
	for (let i = 0; i < 8; i++) {
		if (array[i] === undefined) {
			array[i] = 0;
		}
	}
	return paddedUInt256(
		"0x" +
		paddedUInt32(array[7]) +
		paddedUInt32(array[6]) +
		paddedUInt32(array[5]) +
		paddedUInt32(array[4]) +
		paddedUInt32(array[3]) +
		paddedUInt32(array[2]) +
		paddedUInt32(array[1]) +
		paddedUInt32(array[0]) 
	)
}

/**
 * @public
 * function to check if the a value is of type BigNumberish
 * 
 * @param value - the value to check
 * @returns boolean
 */
export function isBigNumberish(value: any): boolean {

  	return (value != null) && (
      	BigNumber.isBigNumber(value) ||
      	(typeof(value) === "number" && (value % 1) === 0) ||
      	(typeof(value) === "string" && !!value.match(/^-?[0-9]+$/)) ||
      	isHexString(value) ||
      	(typeof(value) === "bigint") ||
      	isBytes(value)
  	);
}

/**
 * @public
 * Extract some of the properites from a Map as a new Map with same keys. 
 * 
 * @param map - the map to extract from
 * @param properties - name of the properties in second item of the map elements
 * @returns a new Map
 */
export function extractFromMap(map: Map<any, any>, properties: string[]): Map<any, any> {

	if (properties.length > 0) {

		let _arr = Array.from(map.entries())
		for(const item of _arr) {
			let _newArr = {}
			for(const key of Object.keys(item[1])) {
				if(properties.includes(key)) {
					_newArr = {
						..._newArr,
						[key]: item[1][key]
					}
				}
			}
			item[1] = _newArr;
		}
		return new Map(_arr)
	}
	else return map;
}

/**
 * @public
 * Extract some of the properties from a Record as new Record with same keys.
 * 
 * @param record - the record to extract from.
 * @param properties - name of the properties in value item of the key/va;ue pair of a Record object
 * @returns a new Record i.e. a new key/value pair object
 */
export function extractFromRecord<T extends string | number | symbol>(
	record: Record<T, any>,
	properties: string | string[]
): Record<T, any> {
	
	if (typeof properties === "string") {
		for (const key in record) {
			for (const value in record[key]) {
				if (properties.includes(value)) {
					record[key] = record[key][value]
				}
			}
		}
		return record as Record<T, any>
	}
	else if (properties.length > 0) {
		for (const key in record) {
			for (const value in record[key]) {
				if (!properties.includes(value)) {
					delete(record[key][value])
				}
			}
		}
		return record as Record<T, any>
	}
	else return record;
}

/**
 * @public
 * Conver a Map to a equivelant Record (a key/value pair object). Map keys must be of type acceptable by Record constructor,
 * which are string, number or symbol.
 * 
 * @param map - The Map to conver to Record
 * @param properties - (optional) properties to pick from the second item of the Map's elements.
 * @returns a new Record (a key/value pait object)
 */
export function mapToRecord<K extends string | number | symbol, T>(
	map: Map<K, any>,
	properties?: string[]
): Record<K, T> {

	let _ret: Record<any, any> = {};
	const Properties = properties ? properties : [];

	if (Properties.length === 1) {
		for (const [key, value] of map) {
			_ret[key] = value[Properties[0]]
		}

		return _ret as Record<K, T>;
	}
	else {
		for (const [key, value] of extractFromMap(map, Properties)) {
			_ret[key] = value;
		}

		return _ret as Record<K, T>;
	}
}

/**
 * @public
 * Conver a Record (a key/value pair object) to a equivelant Map. Map keys will be of type acceptable by Record constructor,
 * which are string, number or symbol.
 * 
 * @param record - The Record to convert to a Map
 * @param properties - (optional) properties to pick from the values of key/value pair items of the Record object.
 * @returns 
 */
export function recordToMap<K extends string | number | symbol>(
	record: Record<K, any>,
	properties?: string | string[]
): Map<K, any> {

	const Properties = properties ? properties : [];

	return new Map(Object.entries(extractFromRecord(record, Properties))) as Map<K, any>
}

/**
 * @public
 * Checks 2 StateConfig objects to see if they are equal or not
 * 
 * @param config1 - first StateConfig
 * @param config2 - second StateConfig
 * @returns boolean
 */
export const areEqualConfigs = (config1: StateConfig, config2: StateConfig): boolean => {

	if (config1.constants.length !== config2.constants.length) return false;
	if (config1.sources.length !== config2.sources.length) return false;

	let aConstants: BigNumber[] = [];
	let bConstants: BigNumber[] = [];
	for (const item of config1.constants) {
		aConstants.push(BigNumber.from(item))
	}
	for (const item of config2.constants) {
		bConstants.push(BigNumber.from(item))
	}

	for (let i = 0; i < aConstants.length; i++) {
		if (!aConstants[i].eq(bConstants[i])) return false;
	}

	let aSources: string[] = [];
	let bSources: string[] = [];
	for (const item of config1.sources) {
		aSources.push(hexlify(item, {allowMissingPrefix: true}));
	}
	for (const item of config2.sources) {
		bSources.push(hexlify(item, {allowMissingPrefix: true}));
	}

	for (let i = 0; i < aSources.length; i++) {
		if (aSources[i] !== bSources[i]) return false;
	}

  return true;
}

/**
 * @public
 * Check if a contract is a valid ITierV2 contract or not
 * 
 * @param tierAddress - The contract address 
 * @param signer - An ethers signer
 * @returns boolean
 */
export const isTier = async(tierAddress: string, signer: Signer) => {
  if (ethers.utils.isAddress(tierAddress)) {
    try{
			const iTier = new ITierV2(tierAddress, signer)
			await iTier.report(await signer.getAddress(), []);
			return true;
    }
    catch(err){
      return false;
    }
  }
  else {
    return false;
	}
}