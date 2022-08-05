import { BigNumber } from 'ethers';
import { Tier } from '../classes/iTierV2';
import { StateConfig } from '../classes/vm';


/**
 * @public
 * Type for current user buy units i.e. user input
 */
export type BuyUnits = 'buy-units';

/**
 * @public
 * Type for times based rules
 */
export type Time = 'before-time' | 'after-time' | 'between-times';

/**
 * @public
 * Type for block number based rules
 */
export type Block = 'before-block' | 'after-block' | 'between-blocks';

/**
 * @public
 * Type for Rain tier contractsreport check
 */
export type Tiers = 'has-min-tier' | 'has-any-tier';

/**
 * @public
 * Type for mathematical folmulas or constant values
 */
export type Math =
  | 'constant'
  | 'increasing-by-time'
  | 'decreasing-by-time'
  | 'increasing-by-block'
  | 'decreasing-by-block';

/**
 * @public
 * Type for getting specific evm tokens or user wallet token balances
 */
export type Asset =
  | 'user-erc20-balance'
  | 'erc20-total-supply'
  | 'user-erc721-balance'
  | 'erc721-owner'
  | 'user-erc1155-balance'
  | 'user-erc20-snapshot-balance'
  | 'erc20-snapshot-totaly-supply';

/**
 * @public
 * Valid Modifier types
 */
export type ModifierType = 'discount' | 'multiplier';

/**
 * @public
 * All the valid logical operators used for comparison of previous types
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
 * A key/type pair for all the valid Struct types
 */
export type StructTypeLib = {
  'buy-units' : {
    index: number  
  },
  'before-time': {
    timestamp: number,
    exactTime?: boolean
  },
  'after-time': {
    timestamp: number,
    exactTime?: boolean
  },
  'between-times': {
    startTimestamp: number,
    endTimestamp: number
  },
  'before-block': {
    block: number,
    exactBlock?: boolean
  },
  'after-block': {
    block: number,
    exactBlock?: boolean
  },
  'between-blocks': {
    startBlock: number,
    endBlock: number
  },
  'has-min-tier': {
    tierAddress: string,
    minTier: Tier,
    tierContext?: BigNumber[]
  },
  'has-any-tier': {
    tierAddress: string,
    tierContext?: BigNumber[]
  },
  'user-erc20-balance': {
    tokenAddress: string
  },
  'erc20-total-supply': {
    tokenAddress: string
  },
  'user-erc721-balance': {
    tokenAddress: string
  },
  'erc721-owner': {
    tokenAddress: string,
    id: BigNumber
  },
  'user-erc1155-balance': {
    tokenAddress: string,
    id: BigNumber
  },
  'user-erc20-snapshot-balance': {
    tokenAddress: string,
    id: BigNumber
  },
  'erc20-snapshot-total-supply': {
    tokenAddress: string,
    id: BigNumber
  },
  'constant': {
    value: BigNumber
  },
  'increasing-by-time': {
    startValue: BigNumber,
    endValue: BigNumber,
    startTimestamp: number,
    endTimestamp: number
  },
  'decreasing-by-time': {
    startValue: BigNumber,
    endValue: BigNumber,
    startTimestamp: number,
    endTimestamp: number
  },
  'increasing-by-block': {
    startValue: BigNumber,
    endValue: BigNumber,
    startBlock: number,
    endBlock: number
  },
  'decreasing-by-block': {
    startValue: BigNumber,
    endValue: BigNumber,
    startBlock: number,
    endBlock: number
  },
}

/**
 * @public
 * A filtering utility type for StructTypeLib
 */
 export type Filter<T extends keyof StructTypeLib> = {
  [Prop in keyof StructTypeLib]: { subject: T, args: StructTypeLib[T] }
}

/**
 * @public
 * The smallest building block of RuleBuilder that contains the type and its valid arguments or a StateConfig
 */
export type Struct = 
  | StateConfig
  | Filter<'buy-units'>['buy-units']
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
  | Filter<'decreasing-by-block'>['decreasing-by-block'];

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
};

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
};

/**
 * @public
 * Quantity type
 */
export type Quantity = {
  struct: 
    | StateConfig
    | Filter<'buy-units'>['buy-units']
    | Filter<'constant'>['constant']
    | Filter<'increasing-by-time'>['increasing-by-time']
    | Filter<'decreasing-by-time'>['decreasing-by-time']
    | Filter<'increasing-by-block'>['increasing-by-block']
    | Filter<'decreasing-by-block'>['decreasing-by-block']
  modifier?: Modifier;
};

/**
 * @public
 * Price type
 */
export type Price = {
  struct: 
    | StateConfig
    | Filter<'buy-units'>['buy-units']
    | Filter<'constant'>['constant']
    | Filter<'increasing-by-time'>['increasing-by-time']
    | Filter<'decreasing-by-time'>['decreasing-by-time']
    | Filter<'increasing-by-block'>['increasing-by-block']
    | Filter<'decreasing-by-block'>['decreasing-by-block']
  modifier?: Modifier;
};

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
