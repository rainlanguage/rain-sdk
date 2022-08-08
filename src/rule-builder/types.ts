import { BigNumber } from 'ethers';
import { Tier } from '../classes/iTierV2';
import { StateConfig } from '../classes/vm';


/**
 * @public
 * Type to get an always true condition
 */
export type Always = 'always';

/**
 * @public
 * Type to get an always false condition
 */
export type Never = 'never';

/**
 * @public
 * Valid Modifier types
 */
export type ModifierType = 'discount' | 'multiplier';

/**
 * @public
 * All the valid logical operators used for comparison of Struct and/or StateConfig objects
 */
export type Operator =
  | 'true'
  | 'not'
  | 'and'
  | 'or'
  | 'nand'
  | 'nor'
  | 'xor' // should not be used unless it is really necessary as it is gas intensive cause it doubles the scripts passed to it
  | 'xnor' // should not be used unless it is really necessary as it is gas intensive cause it doubles the scripts passed to it
  | 'min'
  | 'max'
  | 'eq'
  | 'gt'
  | 'lt'
  | 'gte'
  | 'lte';

/**
 * @public
 * Type for conditions which is a comparison between structs which results in a boolean StateConfig
 */
export type Condition = {
  struct: Struct;
  operator: Extract<
    Operator,
    'true' | 'not' | 'eq' | 'gt' | 'lt' | 'gte' | 'lte'
  >;
  struct2?: Struct;
} | Always | Never | StateConfig;

/**
 * @public
 * Type for a single or multiple conditions which are combined together with the
 * valid logical operators which results in a a boolean StateConfig
 */
export type ConditionGroup = {
  conditions: (Condition | ConditionGroup)[];
  operator: Exclude<
    Operator,
    'min' | 'max' | 'eq' | 'gt' | 'lt' | 'lte' | 'gte'
  >;
} | Always | Never | StateConfig;

/**
 * @public
 * A single Rule block, i.e. an if/then block that contains conditions of 
 * prices and quantities and its actions which are price and quantity
 * 
 * @remarks
 * If the price and quantity conditions are the same just put the same object
 * in both of 'quantityConditions' and 'priceConditions
 */
export type Rule = {
  quantityConditions: ConditionGroup;
  priceConditions: ConditionGroup;
  quantity: Quantity;
  price: Price;
};

/**
 * @public
 * The default block, i.e. default quantity and price
 */
export type Default = {
  quantity: Quantity;
  price: Price;
};

/**
 * @public
 * Type of a single currency, the main parameter used in RuleBuilder to build the StateConfig
 */
export type Currency = {
  rules: Rule[];
  default: Default;
  quantityGlobalModifier?: Modifier;
  priceGlobalModifier?: Modifier;
  pick: {
    quantities: Extract<Operator, 'min' | 'max'>;
    prices: Extract<Operator, 'min' | 'max'>;
  };
};

/**
 * @public
 * Type for price/quantity modifier based on a tier report or a Rule
 */
export type Modifier = {
  /**
   * Determines the modifier's type
   */
  type: ModifierType;
  /**
   * the rule of the modifier
   */
  condition: ConditionGroup;
  /**
   * The modifing value(s)
   */
  values: number;
};

/**
 * @public
 * Quantity type
 */
 export type Quantity = {
  struct: 
    | StateConfig
    | Filter<'input'>['input']
    | Filter<'constant'>['constant']
    | Filter<'increasing-by-time'>['increasing-by-time']
    | Filter<'decreasing-by-time'>['decreasing-by-time']
    | Filter<'increasing-by-block'>['increasing-by-block']
    | Filter<'decreasing-by-block'>['decreasing-by-block']
    | Filter<'increasing-by-time-period'>['increasing-by-time-period']
    | Filter<'decreasing-by-time-period'>['decreasing-by-time-period']
    | Filter<'increasing-by-block-period'>['increasing-by-block-period']
    | Filter<'decreasing-by-block-period'>['decreasing-by-block-period']
  modifier?: Modifier;
};

/**
 * @public
 * Price type
 */
export type Price = {
  struct: 
    | StateConfig
    | Filter<'input'>['input']
    | Filter<'constant'>['constant']
    | Filter<'increasing-by-time'>['increasing-by-time']
    | Filter<'decreasing-by-time'>['decreasing-by-time']
    | Filter<'increasing-by-block'>['increasing-by-block']
    | Filter<'decreasing-by-block'>['decreasing-by-block']
    | Filter<'increasing-by-time-period'>['increasing-by-time-period']
    | Filter<'decreasing-by-time-period'>['decreasing-by-time-period']
    | Filter<'increasing-by-block-period'>['increasing-by-block-period']
    | Filter<'decreasing-by-block-period'>['decreasing-by-block-period'];
  modifier?: Modifier;
};

/**
 * @public
 * A key/type pair for all the valid Struct types
 */
 export type StructTypeLib = {
  /**
   * Type for getting the passed value to contract method at call time.
   * This is completely depended on the contract's method signature
   */
  'input' : {
    /**
     * the index of value in the passed context array used as CONTEXT opcode operand
     */
    index: number  
  },
  /**
   * Type to to check if current time is before a specific time
   */
  'before-time': {
    /**
     * The specific timestamp to check if current time is before that
     */
    timestamp: number,
    /**
     * Pass true to include the exact timestamp in check i.e. 'lte'
     */
    exactTime?: boolean
  },
  /**
   * Type to to check if current time is after a specific time
   */
  'after-time': {
    /**
     * The specific timestamp to check if current time is after that
     */
    timestamp: number,
    /**
     * Pass true to include the exact timestamp in check i.e. 'gte'
     */
    exactTime?: boolean
  },
  /**
   * Type to check if current time is between 2 specific times
   */
  'between-times': {
    /**
     * The first timestamp to check, must be less than the second timestamp
     */
    startTimestamp: number,
    /**
     * the seconf timestamp must be greater than the first timestamp
     */
    endTimestamp: number
  },
  /**
   * Type to to check if current block number is before a specific block number
   */
  'before-block': {
    /**
     * The specific block number to check if current block number is before that
     */
    block: number,
    /**
     * Pass true to include the exact block number when checking i.e. 'lte'
     */
    exactBlock?: boolean
  },
  /**
   * Type to to check if current block number is after a specific block number
   */
  'after-block': {
    /**
     * The specific block number to check if current block number is after that
     */
    block: number,
    /**
     * Pass true to include the exact block number when checking i.e. 'gte'
     */
    exactBlock?: boolean
  },
  /**
   * Type to check if current block number is between 2 specific block numbers
   */
  'between-blocks': {
    /**
     * The first block number to check, must be less than the second block number
     */
    startBlock: number,
    /**
     * the seconf block number must be greater than the first block number
     */
    endBlock: number
  },
  /**
   * Type to check if an address has a minimum tier status
   */
  'has-min-tier': {
    /**
     * The tier contract address
     */
    tierAddress: string,
    /**
     * The minimum tier status to check
     */
    minTier: Tier,
    /**
     * The tier context
     */
    tierContext?: BigNumber[]
  },
  /**
   * Type to check if an address has any tier status
   */
  'has-any-tier': {
    /**
     * The tier contract address
     */
    tierAddress: string,
    /**
     * The tier context
     */
    tierContext?: BigNumber[]
  },
  /**
   * Type to get an address's erc20 token balance
   */
  'user-erc20-balance': {
    /**
     * The erc20 token address
     */
    tokenAddress: string
  },
  /**
   * Type to get an erc20 token total supply
   */
  'erc20-total-supply': {
    /**
     * The erc20 token address
     */
    tokenAddress: string
  },
  /**
   * Type to get an address's erc721 token balance
   */
  'user-erc721-balance': {
    /**
     * The erc721 token address
     */
    tokenAddress: string
  },
  /**
   * Type to get an erc721 token owner's address
   */
  'erc721-owner': {
    /**
     * The erc721 token address
     */
    tokenAddress: string,
    /**
     * The erc721 token ID
     */
    id: BigNumber
  },
  /**
   * Type to get an address's erc1155 token balance
   */
  'user-erc1155-balance': {
    /**
     * The erc1155 token address
     */
    tokenAddress: string,
    /**
     * The erc1155 token ID
     */
    id: BigNumber
  },
  /**
   * Type to get an address's erc20 snapshot token balance at snapshot ID
   */
  'user-erc20-snapshot-balance': {
    /**
     * The erc20 token address
     */
    tokenAddress: string,
    /**
     * The snapshot ID
     */
    id: BigNumber
  },
  /**
   * Type to get an erc20 snapshot token total supply at snapshot ID
   */
  'erc20-snapshot-total-supply': {
    /**
     * The erc20 token address
     */
    tokenAddress: string,
    /**
     * The snapshot ID
     */
    id: BigNumber
  },
  /**
   * Type to get a constant value
   */
  'constant': {
    /**
     * The value in BigNumber format
     */
    value: BigNumber
  },
  /**
   * Type to get a simple linear increasing value between 2 times
   */
  'increasing-by-time': {
    /**
     * The starting value
     */
    startValue: BigNumber,
    /**
     * The ending value
     */
    endValue: BigNumber,
    /**
     * The start timestamp
     */
    startTimestamp: number,
    /**
     * The end timestamp
     */
    endTimestamp: number
  },
  /**
   * Type to get a simple linear decreasing value between 2 times
   */
  'decreasing-by-time': {
    /**
     * The starting value
     */
     startValue: BigNumber,
     /**
      * The ending value
      */
     endValue: BigNumber,
     /**
      * The start timestamp
      */
     startTimestamp: number,
     /**
      * The end timestamp
      */
     endTimestamp: number
  },
  /**
   * Type to get a simple linear increasing value between 2 block numbers
   */
  'increasing-by-block': {
    /**
     * The starting value
     */
     startValue: BigNumber,
     /**
      * The ending value
      */
     endValue: BigNumber,
     /**
      * The start timestamp
      */
     startBlock: number,
     /**
      * The end timestamp
      */
     endBlock: number
  },
  /**
   * Type to get a simple linear decreasing value between 2 block numbers
   */
  'decreasing-by-block': {
    /**
     * The starting value
     */
     startValue: BigNumber,
     /**
      * The ending value
      */
     endValue: BigNumber,
     /**
      * The start timestamp
      */
     startBlock: number,
     /**
      * The end timestamp
      */
     endBlock: number
  },
  /**
   * Type to get a simple linear increasing value by a margin at each period of time
   */
  'increasing-by-time-period': {
    /**
     * The starting value
     */
    startValue: BigNumber,
    /**
     * The starting timestamp
     */
    startTimestamp: number,
    /**
     * The margin(value) to increase at each period
     */
    margin: BigNumber,
    /**
     * The period of time length
     */
    periodLength: number,
    /**
     * (optional) The end value to not increase above that
     */
    endValue?: number
  },
  /**
   * Type to get a simple linear decreasing value by a margin at each period of time
   */
  'decreasing-by-time-period': {
    /**
     * The starting value
     */
     startValue: BigNumber,
     /**
      * The starting timestamp
      */
     startTimestamp: number,
     /**
      * The margin(value) to decrease at each period
      */
     margin: BigNumber,
     /**
      * The period of time length
      */
     periodLength: number,
     /**
      * (optional) The end value to not decrease above that
      */
     endValue?: number
  },
  /**
   * Type to get a simple linear increasing value by a margin at each number of blocks passing
   */
  'increasing-by-block-period': {
    /**
     * The starting value
     */
     startValue: BigNumber,
     /**
      * The starting block number
      */
     startBlock: number,
     /**
      * The margin(value) to increase at each period
      */
     margin: BigNumber,
     /**
      * The period of time length in block number
      */
     periodLength: number,
     /**
      * (optional) The end value to not increase above that
      */
     endValue?: number
  },
  /**
   * Type to get a simple linear decreasing value by a margin at each number of blocks passing
   */
  'decreasing-by-block-period': {
    /**
     * The starting value
     */
     startValue: BigNumber,
     /**
      * The starting block number
      */
     startBlock: number,
     /**
      * The margin(value) to decrease at each period
      */
     margin: BigNumber,
     /**
      * The period of time length in block number
      */
     periodLength: number,
     /**
      * (optional) The end value to not decrease above that
      */
     endValue?: number
  }
}

/**
 * @public
 * A filtering utility type for StructTypeLib
 */
 export type Filter<T extends keyof StructTypeLib> = {
  [Prop in keyof StructTypeLib]: { 
    /**
     * The type of this struct which determines the valid properties (args) and build the StageConfig out of them
     * @see {@link StructTypeLib} 
     */
    subject: T, 
    /**
     * The valid properties of this Struct object
     * @see {@link StructTypeLib} 
     */
    args: StructTypeLib[T] }
}

/**
 * @public
 * The smallest building block of RuleBuilder that contains the type and its valid arguments or a StateConfig
 */
export type Struct = 
  | StateConfig
  | Filter<'input'>['input']
  | Filter<'before-time'>['before-time']
  | Filter<'after-time'>['after-time']
  | Filter<'between-times'>['between-times']
  | Filter<'before-block'>['before-block']
  | Filter<'after-block'>['after-block']
  | Filter<'between-blocks'>['between-blocks']
  | Filter<'has-min-tier'>['has-min-tier']
  | Filter<'has-any-tier'>['has-any-tier']
  | Filter<'user-erc20-balance'>['user-erc20-balance']
  | Filter<'erc20-total-supply'>['erc20-total-supply']
  | Filter<'user-erc721-balance'>['user-erc721-balance']
  | Filter<'erc721-owner'>['erc721-owner']
  | Filter<'user-erc1155-balance'>['user-erc1155-balance']
  | Filter<'user-erc20-snapshot-balance'>['user-erc20-snapshot-balance']
  | Filter<'erc20-snapshot-total-supply'>['erc20-snapshot-total-supply']
  | Filter<'constant'>['constant']
  | Filter<'increasing-by-time'>['increasing-by-time']
  | Filter<'decreasing-by-time'>['decreasing-by-time']
  | Filter<'increasing-by-block'>['increasing-by-block']
  | Filter<'decreasing-by-block'>['decreasing-by-block']
  | Filter<'increasing-by-time-period'>['increasing-by-time-period']
  | Filter<'decreasing-by-time-period'>['decreasing-by-time-period']
  | Filter<'increasing-by-block-period'>['increasing-by-block-period']
  | Filter<'decreasing-by-block-period'>['decreasing-by-block-period'];
