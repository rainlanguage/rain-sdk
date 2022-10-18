import { AllStandardOps } from "./classes/vm";

/**
 * @public
 * Class for Opcodes number of stack pushes and pops
 */
 export const pnp: Record<string, (opcode: number, operand: number) => number> = {
    /**
     * @public
     */
    zero: (opcode: number, operand: number) => 0,

    /**
     * @public
     */
    one: (opcode: number, operand: number) => 1,

    /**
     * @public
     */
    two: (opcode: number, operand: number) => 2,

    /**
     * @public
     */
    three: (opcode: number, operand: number) => 3,

    /**
     * @public
     */
    oprnd: (opcode: number, operand: number) => operand,

    /**
     * @public
     */
    derived: (opcode: number, operand: number) => {
        if (opcode === AllStandardOps.ZIPMAP) {
            return (operand >> 5) + 1 ;
        }
        if (opcode === AllStandardOps.SELECT_LTE) {
            return (operand & 31) + 1;
        }
        if (opcode === AllStandardOps.IERC1155_BALANCE_OF_BATCH) {
            return (operand * 2) + 1;
        }
        return NaN
    },

    /**
     * @public
     */
    zpush: (opcode: number, operand: number) => {
        return 2 ** ((operand >> 3) & 3);
    }
};

/**
 * @public
 */
export interface IOpMeta extends Record<string, any> {
    enum: number;
    name: string;  
    pushes: (opcode: number, operand: number) => number;
    pops: (opcode: number, operand: number) => number;
    description?: string;
    aliases?: string[];
    data?: any
}

/**
 * @public
 */
export const OpMeta: Map<number, IOpMeta> = new Map([
      [
        0, 
        {
            enum: AllStandardOps.SKIP, 
            name: 'SKIP',
            description: 'Deprecated',      
            pushes: pnp.zero, 
            pops: pnp.zer
        }
    ],
    [
        1, 
        {
            enum: AllStandardOps.VAL, 
            name: 'VAL',
            description: 'Takes an item from constants array and insert it into the stack',      
            pushes: pnp.one, 
            pops: pnp.zer
        }
    ],
    [
        2,
        {
            enum: AllStandardOps.DUP,
            name: 'DUP',
            description: 'Copies an item from a position in the current stack state to the top of the stack',      
            pushes: pnp.one,
            pops: pnp.zero
        }
    ],
        [
        3,
        {
            enum: AllStandardOps.ZIPMAP,
            name: 'ZIPMAP',
            description: 'Takes some items from the stack and splits them into loopSize sub-values and loops over them by executing script in another sources item',      
            pushes: pnp.zpush,
            pops: pnp.derived
        }
    ],
    [
        4,
        {
            enum: AllStandardOps.DEBUG,
            name: 'DEBUG',
            description: 'ABI encodes the entire stack and logs it to the hardhat console.',      
            pushes: pnp.zero,
            pops: pnp.zero
        }
    ],
    [
        5,
        {
            enum: AllStandardOps.BLOCK_NUMBER,
            name: 'BLOCK_NUMBER',
            description: 'Inserts the current block number into the stack',      
            pushes: pnp.one,
            pops: pnp.zero
        }
    ],
    [
        6,
        {
            enum: AllStandardOps.BLOCK_TIMESTAMP,
            name: 'BLOCK_TIMESTAMP',
            description: 'Insert the current block timestamp into the stack',      
            pushes: pnp.one,
            pops: pnp.zero
        }
    ],
    [
        7,
        {
            enum: AllStandardOps.SENDER,
            name: 'SENDER',
            description: 'Inserts the msg.sender address into the stack',      
            pushes: pnp.one,
            pops: pnp.zero
        }
    ],
    [
        8,
        {
            enum: AllStandardOps.THIS_ADDRESS,
            name: 'THIS_ADDRESS',
            description: 'Inserts this contract address into the stack',      
            pushes: pnp.one,
            pops: pnp.zero
        }
    ],
    [
        9,
        {
            enum: AllStandardOps.SCALE18_MUL,
            name: 'SCALE18_MUL',
            description: 'Inserts the result of multiplying the 2 items of the stack by keeping the 18 fixed point decimals into the stack',      
            pushes: pnp.one,
            pops: pnp.two
        }
    ],
    [
        10,
        {
            enum: AllStandardOps.SCALE18_DIV,
            name: 'SCALE18_DIV',
            description: 'Inserts the result of dividing the 2 items of the stack by keeping the 18 fixed point decimals into the stack',
            pushes: pnp.one,
            pops: pnp.two
        }
    ],
    [
        11,
        {
            enum: AllStandardOps.SCALE18,
            name: 'SCALE18',
            description: 'Rescale some fixed point number to 18 OOMs in situ.',      
            pushes: pnp.one,
            pops: pnp.one
        }
    ],
    [
        12,
        {
            enum: AllStandardOps.SCALEN,
            name: 'SCALEN',
            description: 'Rescale an 18 OOMs fixed point number to scale N.',      
            pushes: pnp.one,
            pops: pnp.one
        }
    ],
    [
        13,
        {
            enum: AllStandardOps.SCALE_BY,
            name: 'SCALE_BY',
            description: 'Scale a fixed point up or down by opernad.',      
            pushes: pnp.one,
            pops: pnp.on
        }
    ],
    [
        14,
        {
            enum: AllStandardOps.SCALE18_ONE,
            name: 'SCALE18_ONE',
            description: 'Inserts fixed 18 point decimals one into the stack',
            pushes: pnp.one,
            pops: pnp.zero
        }
    ],
    [
        15,
        {
            enum: AllStandardOps.SCALE18_DECIMALS,
            name: 'SCALE18_DECIMALS',
            description: 'Insert 18 fixed point decimal into the stack',      
            pushes: pnp.one,
            pops: pnp.zero
        }
    ],
    [
        16,
        {
            enum: AllStandardOps.ADD,
            name: 'ADD',
            description: 'Inserts the result of sum of N values taken from the stack into the stack',      
            pushes: pnp.one,
            pops: pnp.oprnd
        }
    ],
    [
        17,
        {
            enum: AllStandardOps.SATURATING_ADD,
            name: 'SATURATING_ADD',
            description: 'Inserts sum of the specified items from the stack and if prevernts reverts if the result goes above max 256 bit size',      
            pushes: pnp.one,
            pops: pnp.oprnd
        }
    ],
    [
        18,
        {   
            enum: AllStandardOps.SUB,
            name: 'SUB',
            description: 'Inserts the subtraction of N values taken from the stack into the stack',      
            pushes: pnp.one,
            pops: pnp.oprn
        }
    ],
    [
        19,
        {
            enum: AllStandardOps.SATURATING_SUB,
            name: 'SATURATING_SUB',
            description: 'Inserts subtraction of the specified items from the stack and if prevernts reverts if the result goes blow zero',
            pushes: pnp.one,
            pops: pnp.oprnd
        }
    ],
    [
        20,
        {
            enum: AllStandardOps.MUL,
            name: 'MUL',
            description: 'Inserts the multiplication of N values taken from the stack into the stack',      
            pushes: pnp.one,
            pops: pnp.oprnd
        }
    ],
    [
        21,
        {
            enum: AllStandardOps.SATURATING_MUL,
            name: 'SATURATING_MUL',
            description: 'Inserts multiplied result of the specified items from the stack and if prevernts reverts if the result goes above max 256 bit size',      
            pushes: pnp.one,
            pops: pnp.oprnd
        }
    ],
    [
        22,
        {
            enum: AllStandardOps.DIV,
            name: 'DIV',
            description: 'Inserts the result of divide of N values taken from the stack into the stack',      
            pushes: pnp.one,
            pops: pnp.oprnd
        }
    ],
    [
        23,
        {
            enum: AllStandardOps.MOD,
            name: 'MOD',
            description: 'Inserts the mod of N values taken from the stack into the stack',      
            pushes: pnp.one,
            pops: pnp.oprnd
        }
    ],
    [
        24,
        {
            enum: AllStandardOps.EXP,
            name: 'EXP',
            description: 'Inserts the result of exponention of N values taken from the stack into the stack',      
            pushes: pnp.one,
            pops: pnp.oprnd
        }
    ],
    [
        25,
        {
            enum: AllStandardOps.MIN,
            name: 'MIN',
            description: 'Inserts the minimum of N values taken from the stack into the stack',      
            pushes: pnp.one,
            pops: pnp.oprnd
        }
    ],
    [
        26,
        {
            enum: AllStandardOps.MAX,
            name: 'MAX',
            description: 'Inserts the maximum of N values taken from the stack into the stack',      
            pushes: pnp.one,
            pops: pnp.oprnd
        }
    ],
    [
        27,
        {
            enum: AllStandardOps.ISZERO,
            name: 'ISZERO',
            description: 'Checks if the value is zero and inserts true/1 into the stack if it is, else inserts false/0',
            pushes: pnp.one,
            pops: pnp.one
        }
    ],
    [
        28,
        {
            enum: AllStandardOps.EAGER_IF,
            name: 'EAGER_IF',
            description: 'Takes 3 items from the stack and check if the first item is non-zero the inserts the second item into the stack, else inserts the 3rd item',      
            pushes: pnp.one,
            pops: pnp.three
        }
    ],
    [
        29,
        {
            enum: AllStandardOps.EQUAL_TO,
            name: 'EQUAL_TO',
            description: 'Comapres the last 2 items of the stack together and inserts true/1 into stack if they are euqal, else inserts false/0',      
            pushes: pnp.one,
            pops: pnp.two
        }
    ],
    [
        30,
        {
            enum: AllStandardOps.LESS_THAN,
            name: 'LESS_THAN',
            description: 'Takes last 2 values from stack and puts true/1 into the stack if the first value is less than the second value and false/0 if not.',      
            pushes: pnp.one,
            pops: pnp.two
        }
    ],
    [
        31,
        {
            enum: AllStandardOps.GREATER_THAN,
            name: 'GREATER_THAN',
            description: 'Takes last 2 values from stack and puts true/1 into the stack if the first value is greater than the second value and false/0 if not.',      
            pushes: pnp.one,
            pops: pnp.two
        }
    ],
    [
        32,
        {
            enum: AllStandardOps.EVERY,
            name: 'EVERY',
            description: 'Inserts the first value of all the values it checks if all of them are non-zero, else inserts zero into the stack.',      
            pushes: pnp.one,
            pops: pnp.oprnd
        }
    ],
    [
        33,
        {
            enum: AllStandardOps.ANY,
            name: 'ANY',
            description: 'Inserts the first non-zero value of all the values it checks if there exists one, else inserts zero into the stack.',
            pushes: pnp.one,
            pops: pnp.oprnd
        }
    ],
    [
        34,
        {
            enum: AllStandardOps.REPORT,
            name: 'REPORT',
            description: 'Inserts the report of an account of a tier contract which are taken from the stack into the stack',      
            pushes: pnp.one,
            pops: pnp.tw
        }
    ],
    [
        35,
        {
            enum: AllStandardOps.NEVER,
            name: 'NEVER',
            description: 'Inserts max uint 256 into the stack',      
            pushes: pnp.one,
            pops: pnp.zer
        }
    ],
    [
        36,
        {
            enum: AllStandardOps.ALWAYS,
            name: 'ALWAYS',
            description: 'Inserts zero into the stack',      
            pushes: pnp.one,
            pops: pnp.zer
        }
    ],
    [
        37,
        {
            enum: AllStandardOps.SATURATING_DIFF,
            name: 'SATURATING_DIFF',
            description: 'Inserts the saturating difference of 2 reports taken from the stack into the stack and prevents reverts if the result below zero',      
            pushes: pnp.one,
            pops: pnp.two
        }
    ],
    [
        38,
        {
            enum: AllStandardOps.UPDATE_BLOCKS_FOR_TIER_RANGE,
            name: 'UPDATE_BLOCKS_FOR_TIER_RANGE',
            description: 'Inserts the result of updating the range of tiers of a report taken from stack by a value taken from the stack into the stack',      
            pushes: pnp.one,
            pops: pnp.two
        }
    ],
    [
        39,
        {
            enum: AllStandardOps.SELECT_LTE,
            name: 'SELECT_LTE',
            description: 'Inserts the result of selecting the less than equal to specified value taken from stack among number of reports by a logic and mode into the stack',
            pushes: pnp.one,
            pops: pnp.derived
        }
    ],
    [
        40,
        {
            enum: AllStandardOps.IERC20_BALANCE_OF,
            name: 'IERC20_BALANCE_OF',
            description: 'Get the balance of an ERC20 token for an account by taking the contract and account address from stack',      
            pushes: pnp.one,
            pops: pnp.two
        }
    ],
    [
        41,
        {
            enum: AllStandardOps.IERC20_TOTAL_SUPPLY,
            name: 'IERC20_TOTAL_SUPPLY',
            description: 'Get the supply of an ERC20 token by taking the contract address from stack',      
            pushes: pnp.one,
            pops: pnp.one
        }
    ],
    [
        42,
        {
            enum: AllStandardOps.IERC721_BALANCE_OF,
            name: 'IERC721_BALANCE_OF',
            description: 'Get the balance of an ERC721 token for an account by taking the contract and account address from stack',      
            pushes: pnp.one,
            pops: pnp.two
        }
    ],
    [
        43,
        {
            enum: AllStandardOps.IERC721_OWNER_OF,
            name: 'IERC721_OWNER_OF',
            description: 'Get the owner of an ERC20 token for an account by taking the contract address and token id from stack',      
            pushes: pnp.one,
            pops: pnp.two
        }
    ],
    [
        44,
        {
            enum: AllStandardOps.IERC1155_BALANCE_OF,
            name: 'IERC1155_BALANCE_OF',
            description: 'Get the balance of an ERC1155 token for an account by taking the contract and account address and token id from stack',      
            pushes: pnp.one,
            pops: pnp.three
        }
    ],
    [
        45,
        {
            enum: AllStandardOps.IERC1155_BALANCE_OF_BATCH,
            name: 'IERC1155_BALANCE_OF_BATCH',
            description: 'Get the batch balances of an ERC1155 token for an account by taking the contract address and array of account addresses and token ids from stack',      
            pushes: pnp.oprnd,
            pops: pnp.derived
        }
    ],
]);
