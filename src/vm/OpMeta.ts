// import { pnp } from "./VM";
import { OpAdd } from "../jsvm/ops/math/OpAdd";
import { OpDiv } from "../jsvm/ops/math/OpDiv";
import { OpExp } from "../jsvm/ops/math/OpExp";
import { OpMax } from "../jsvm/ops/math/OpMax";
import { OpMin } from "../jsvm/ops/math/OpMin";
import { OpMod } from "../jsvm/ops/math/OpMod";
import { OpMul } from "../jsvm/ops/math/OpMul";
import { OpSub } from "../jsvm/ops/math/OpSub";
import { AllStandardOps } from "../../src/classes/vm";
import { OpCaller } from "../jsvm/ops/evm/OpCaller";
import { OpAny } from "../jsvm/ops/math/logic/OpAny";
import { OpEvery } from "../jsvm/ops/math/logic/OpEvery";
import { OpTimestamp } from "../jsvm/ops/evm/OpTimestamp";
import { OpSelectLte } from "../jsvm/ops/tier/OpSelectLte";
import { OpIsZero } from "../jsvm/ops/math/logic/OpIsZero";
import { OpEagerIf } from "../jsvm/ops/math/logic/OpEagerIf";
import { OpEqualTo } from "../jsvm/ops/math/logic/OpEqualTo";
import { OpBlockNumber } from "../jsvm/ops/evm/OpBlockNumber";
import { OpThisAddress } from "../jsvm/ops/evm/OpThisAddress";
import { OpLessThan } from "../jsvm/ops/math/logic/OpLessThan";
import { RainJSVM, StateJSVM, OpJSVM } from "../jsvm/RainJSVM";
import { OpScaleN } from "../jsvm/ops/math/fixedPoint/OpScaleN";
import { OpScaleBy } from "../jsvm/ops/math/fixedPoint/OpScaleBy";
import { OpScale18 } from "../jsvm/ops/math/fixedPoint/OpScale18";
import { OpITierV2Report } from "../jsvm/ops/tier/OpITierV2Report";
import { OpGreaterThan } from "../jsvm/ops/math/logic/OpGreaterThan";
import { OpSaturatingDiff } from "../jsvm/ops/tier/OpSaturatingDiff";
import { OpERC721OwnerOf } from "../jsvm/ops/erc721/OpERC721OwnerOf";
import { OpERC20BalanceOf } from "../jsvm/ops/erc20/OpERC20BalanceOf";
import { OpScale18Div } from "../jsvm/ops/math/fixedPoint/OpScale18Div";
import { OpScale18Mul } from "../jsvm/ops/math/fixedPoint/OpScale18Mul";
import { OpERC721BalanceOf } from "../jsvm/ops/erc721/OpERC721BalanceOf";
import { OpERC20TotalSupply } from "../jsvm/ops/erc20/OpERC20TotalSupply";
import { OpERC1155BalanceOf } from "../jsvm/ops/erc1155/OpERC1155BalanceOf";
import { OpSaturatingAdd } from "../jsvm/ops/math/saturating/OpSaturatingAdd";
import { OpSaturatingMul } from "../jsvm/ops/math/saturating/OpSaturatingMul";
import { OpSaturatingSub } from "../jsvm/ops/math/saturating/OpSaturatingSub";
import { OpERC1155BalanceOfBatch } from "../jsvm/ops/erc1155/OpERC1155BalanceOfBatch";
import { OpUpdateTimesForTierRange } from "../jsvm/ops/tier/OpUpdateTimesForTierRange";
import { OpITierV2ReportTimesForTier } from "../jsvm/ops/tier/OpITierV2ReportTimesForTier";
import { OpERC20SnapshotBalanceOfAt } from "../jsvm/ops/erc20/snapshot/OpERC20SnapshotBalanceOfAt";
import { OpERC20SnapshotTotalSupplyAt } from "../jsvm/ops/erc20/snapshot/OpERC20SnapshotTotalSupplyAt";


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
        if (opcode === AllStandardOps.ITIERV2_REPORT) {
            return operand + 2;
        }
        if (opcode === AllStandardOps.ITIERV2_REPORT_TIME_FOR_TIER) {
            return operand + 3;
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
    jsvmfn: OpJSVM;
    isZeroOperand: boolean;
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
            enum: AllStandardOps.CONSTANT, 
            name: 'CONSTANT',
            description: '',      
            pushes: pnp.one, 
            pops: pnp.zero,
            isZeroOperand: false, 
            jsvmfn: function(
                this: RainJSVM,
                state: StateJSVM,
                operand: number,
                data?: any
            ): void {
                this.constant(operand, data)
            },
            aliases: ['CONST']
        }
    ],
    [
        1,
        {
            enum: AllStandardOps.STACK,
            name: 'STACK',
            description: '',      
            pushes: pnp.one,
            pops: pnp.zero, 
            isZeroOperand: false,
            jsvmfn: function(
                this: RainJSVM,
                state: StateJSVM,
                operand: number,
                data?: any
            ): void {
                this.stack(operand, data)
            }
        }
    ],
    [
        2,
        {
            enum: AllStandardOps.CONTEXT,
            name: 'CONTEXT',
            description: '',      
            pushes: pnp.one,
            pops: pnp.zero, 
            isZeroOperand: false,
            jsvmfn: function(
                this: RainJSVM,
                state: StateJSVM,
                operand: number,
                data?: any
            ): void {
                this.context(operand, data)
            }
        }
    ],
    [
        3,
        {
            enum: AllStandardOps.STORAGE,
            name: 'STORAGE',
            description: '',      
            pushes: pnp.one,
            pops: pnp.zero, 
            isZeroOperand: false,
            jsvmfn: async function(
                this: RainJSVM,
                state: StateJSVM,
                operand: number,
                data?: any
            ): Promise<void> {
                await this.storage(operand, data)
            },
            aliases: ['MEMORY']
        }
    ],
    [
        4,
        {
            enum: AllStandardOps.ZIPMAP,
            name: 'ZIPMAP',
            description: '',      
            pushes: pnp.zpush,
            pops: pnp.derived, 
            isZeroOperand: false,
            jsvmfn: async function(
                this: RainJSVM,
                state: StateJSVM,
                operand: number,
                data?: any
            ): Promise<void> {
                await this.zipmap(operand, data)
            }
        }
    ],
    [
        5,
        {
            enum: AllStandardOps.DEBUG,
            name: 'DEBUG',
            description: '',      
            pushes: pnp.zero,
            pops: pnp.zero, 
            isZeroOperand: false,
            jsvmfn: function(
                this: RainJSVM,
                state: StateJSVM,
                operand: number,
                data?: any
            ): void {
                this.debug(operand, data)
            },
            aliases: ['LOG', 'CONSOLE', 'CONSOLE_LOG']
        }
    ],
    [
        6,
        {
            enum: AllStandardOps.IERC20_BALANCE_OF,
            name: 'IERC20_BALANCE_OF',
            description: '',      
            pushes: pnp.one,
            pops: pnp.two, 
            isZeroOperand: true,
            jsvmfn: OpERC20BalanceOf,
            aliases: ['ERC20_BALANCE_OF', 'ERC20BALANCEOF', 'IERC20BALANCEOF']
        }
    ],
    [
        7,
        {
            enum: AllStandardOps.IERC20_TOTAL_SUPPLY,
            name: 'IERC20_TOTAL_SUPPLY',
            description: '',      
            pushes: pnp.one,
            pops: pnp.one, 
            isZeroOperand: true,
            jsvmfn: OpERC20TotalSupply,
            aliases: ['ERC20_TOTAL_SUPPLY', 'ERC20TOTALSUPPLY', 'IERC20TOTALSUPPLY']
        }
    ],
    [
        8,
        {
            enum: AllStandardOps.IERC20_SNAPSHOT_BALANCE_OF_AT,
            name: 'IERC20_SNAPSHOT_BALANCE_OF_AT',
            description: '',      
            pushes: pnp.one,
            pops: pnp.three, 
            isZeroOperand: true,
            jsvmfn: OpERC20SnapshotBalanceOfAt,
            aliases: ['ERC20_SNAPSHOT_BALANCE_OF_AT', 'ERC20SNAPSHOTBALANCEOFAT', 'IERC20SNAPSHOTBALANCEOFAT']
        }
    ],
    [
        9,
        {
            enum: AllStandardOps.IERC20_SNAPSHOT_TOTAL_SUPPLY_AT,
            name: 'IERC20_SNAPSHOT_TOTAL_SUPPLY_AT',
            description: '',      
            pushes: pnp.one,
            pops: pnp.two, 
            isZeroOperand: true,
            jsvmfn: OpERC20SnapshotTotalSupplyAt,
            aliases: ['ERC20_SNAPSHOT_TOTAL_SUPPLY_AT', 'ERC20SNAPSHOTTOTALSUPPLYAT', 'IERC20SNAPSHOTTOTALSUPPLYAT']
        }
    ],
    [
        10,
        {
            enum: AllStandardOps.IERC721_BALANCE_OF,
            name: 'IERC721_BALANCE_OF',
            description: '',      
            pushes: pnp.one,
            pops: pnp.two, 
            isZeroOperand: true,
            jsvmfn: OpERC721BalanceOf,
            aliases: ['ERC721_BALANCE_OF', 'ERC721BALANCEOF', 'IERC721BALANCEOF']
        }
    ],
    [
        11,
        {
            enum: AllStandardOps.IERC721_OWNER_OF,
            name: 'IERC721_OWNER_OF',
            description: '',      
            pushes: pnp.one,
            pops: pnp.two, 
            isZeroOperand: true,
            jsvmfn: OpERC721OwnerOf,
            aliases: ['ERC721_OWNER_OF', 'ERC721OWNEROF', 'IERC721OWNEROF']
        }
    ],
    [
        12,
        {
            enum: AllStandardOps.IERC1155_BALANCE_OF,
            name: 'IERC1155_BALANCE_OF',
            description: '',      
            pushes: pnp.one,
            pops: pnp.three, 
            isZeroOperand: true,
            jsvmfn: OpERC1155BalanceOf,
            aliases: ['ERC1155_BALANCE_OF', 'ERC1155BALANCEOF', 'IERC1155BALANCEOF']
        }
    ],
    [
        13,
        {
            enum: AllStandardOps.IERC1155_BALANCE_OF_BATCH,
            name: 'IERC1155_BALANCE_OF_BATCH',
            description: '',      
            pushes: pnp.oprnd,
            pops: pnp.derived, 
            isZeroOperand: false,
            jsvmfn: OpERC1155BalanceOfBatch,
            aliases: ['ERC1155_BALANCE_OF_BATCH', 'ERC1155BALANCEOFBATCH', 'IERC1155BALANCEOFBATCH']
        }
    ],
    [
        14,
        {
            enum: AllStandardOps.BLOCK_NUMBER,
            name: 'BLOCK_NUMBER',
            description: '',      
            pushes: pnp.one,
            pops: pnp.zero, 
            isZeroOperand: true,
            jsvmfn: OpBlockNumber,
            aliases: ['CURRENT_BLOCK', 'CURRENTBLOCK', 'BLOCKNUMBER'],
        }
    ],
    [
        15,
        {
            enum: AllStandardOps.SENDER,
            name: 'SENDER',
            description: '',      
            pushes: pnp.one,
            pops: pnp.zero, 
            isZeroOperand: true,
            jsvmfn: OpCaller,
            aliases: ['MSG_SENDER', 'MSGSENDER', 'SIGNER']
        }
    ],
    [
        16,
        {
            enum: AllStandardOps.THIS_ADDRESS,
            name: 'THIS_ADDRESS',
            description: '',      
            pushes: pnp.one,
            pops: pnp.zero, 
            isZeroOperand: true,
            jsvmfn: OpThisAddress,
            aliases: ['THISADDRESS']
        }
    ],
    [
        17,
        {
            enum: AllStandardOps.BLOCK_TIMESTAMP,
            name: 'BLOCK_TIMESTAMP',
            description: '',      
            pushes: pnp.one,
            pops: pnp.zero, 
            isZeroOperand: true,
            jsvmfn: OpTimestamp,
            aliases: ['CURRENT_TIMESTAMP', 'CURRENTTIMESTAMP', 'BLOCKTIMESTAMP', 'CURRENTTIME', 'CURRENT_TIME']
        }
    ],
    [
        18,
        {
            enum: AllStandardOps.SCALE18,
            name: 'SCALE18',
            description: '',      
            pushes: pnp.one,
            pops: pnp.one, 
            isZeroOperand: false,
            jsvmfn: OpScale18,
            aliases: ['SCALE_18']
        }
    ],
    [
        19,
        {
            enum: AllStandardOps.SCALE18_DIV,
            name: 'SCALE18_DIV',
            description: '',      
            pushes: pnp.one,
            pops: pnp.two, 
            isZeroOperand: false,
            jsvmfn: OpScale18Div,
            aliases: ['SCALE18DIV', 'SCALE_18_DIV']
        }
    ],
    [
        20,
        {
            enum: AllStandardOps.SCALE18_MUL,
            name: 'SCALE18_MUL',
            description: '',      
            pushes: pnp.one,
            pops: pnp.two, 
            isZeroOperand: false,
            jsvmfn: OpScale18Mul,
            aliases: ['SCALE18MUL', 'SCALE_18_MUL']
        }
    ],
    [
        21,
        {
            enum: AllStandardOps.SCALE_BY,
            name: 'SCALE_BY',
            description: '',      
            pushes: pnp.one,
            pops: pnp.one,
            isZeroOperand: false,
            jsvmfn: OpScaleBy,
            aliases: ['SCALEBY']
        }
    ],
    [
        22,
        {
            enum: AllStandardOps.SCALEN,
            name: 'SCALEN',
            description: '',      
            pushes: pnp.one,
            pops: pnp.one, 
            isZeroOperand: false,
            jsvmfn: OpScaleN,
            aliases: ['SCALE_N']
        }
    ],
    [
        23,
        {
            enum: AllStandardOps.ANY,
            name: 'ANY',
            description: '',      
            pushes: pnp.one,
            pops: pnp.oprnd, 
            isZeroOperand: false,
            jsvmfn: OpAny,
            aliases: ['OR', 'ANY_OF', 'ANYOF']
        }
    ],
    [
        24,
        {
            enum: AllStandardOps.EAGER_IF,
            name: 'EAGER_IF',
            description: '',      
            pushes: pnp.one,
            pops: pnp.three, 
            isZeroOperand: true,
            jsvmfn: OpEagerIf,
            aliases: ['EAGERIF', 'IF']
        }
    ],
    [
        25,
        {
            enum: AllStandardOps.EQUAL_TO,
            name: 'EQUAL_TO',
            description: '',      
            pushes: pnp.one,
            pops: pnp.two, 
            isZeroOperand: true,
            jsvmfn: OpEqualTo,
            aliases: ['EQ', 'EQUALTO', '=', '==', '===']
        }
    ],
    [
        26,
        {
            enum: AllStandardOps.EVERY,
            name: 'EVERY',
            description: '',      
            pushes: pnp.one,
            pops: pnp.oprnd, 
            isZeroOperand: false,
            jsvmfn: OpEvery,
            aliases: ['AND', 'ALL_OF', 'ALLOF'] 
        }
    ],
    [
        27,
        {
            enum: AllStandardOps.GREATER_THAN,
            name: 'GREATER_THAN',
            description: '',      
            pushes: pnp.one,
            pops: pnp.two, 
            isZeroOperand: true,
            jsvmfn: OpGreaterThan,
            aliases: ['GT', 'GREATERTHAN', 'BIGGERTHAN', 'BIGGER_THAN']
        }
    ],
    [
        28,
        {
            enum: AllStandardOps.ISZERO,
            name: 'ISZERO',
            description: '',      
            pushes: pnp.one,
            pops: pnp.one, 
            isZeroOperand: true,
            jsvmfn: OpIsZero,
            aliases: ['IS_ZERO', 'FALSE', 'IS_FALSE', 'ISFALSE']
        }
    ],
    [
        29,
        {
            enum: AllStandardOps.LESS_THAN,
            name: 'LESS_THAN',
            description: '',      
            pushes: pnp.one,
            pops: pnp.two, 
            isZeroOperand: true,
            jsvmfn: OpLessThan,
            aliases: ['LT', 'LESSTHAN', 'LITTLETHAN', 'LITTLE_THAN']
        }
    ],
    [
        30,
        {
            enum: AllStandardOps.SATURATING_ADD,
            name: 'SATURATING_ADD',
            description: '',      
            pushes: pnp.one,
            pops: pnp.oprnd, 
            isZeroOperand: false,
            jsvmfn: OpSaturatingAdd,
            aliases: ['SATURATINGADD', 'SAT_ADD', 'SATADD', 'SATURATING_SUM', 'SATURATINGSUM', 'SATSUM', 'SAT_SUM']
        }
    ],
    [
        31,
        {
            enum: AllStandardOps.SATURATING_MUL,
            name: 'SATURATING_MUL',
            description: '',      
            pushes: pnp.one,
            pops: pnp.oprnd, 
            isZeroOperand: false,
            jsvmfn: OpSaturatingMul,
            aliases: ['SATURATINGMUL', 'SAT_MUL', 'SATMUL']
        }
    ],
    [
        32,
        {
            enum: AllStandardOps.SATURATING_SUB,
            name: 'SATURATING_SUB',
            description: '',      
            pushes: pnp.one,
            pops: pnp.oprnd, 
            isZeroOperand: false,
            jsvmfn: OpSaturatingSub,
            aliases: ['SATURATINGSUB', 'SAT_SUB', 'SATSUB', 'SATURATING_MINUS', 'SATURATINGMINUS', 'SATMINUS', 'SAT_MINUS']
        }
    ],
    [
        33,
        {
            enum: AllStandardOps.ADD,
            name: 'ADD',
            description: '',      
            pushes: pnp.one,
            pops: pnp.oprnd, 
            isZeroOperand: false,
            jsvmfn: OpAdd,
            aliases: ['+', 'SUM']
        }
    ],
    [
        34,
        {
            enum: AllStandardOps.DIV,
            name: 'DIV',
            description: '',      
            pushes: pnp.one,
            pops: pnp.oprnd, 
            isZeroOperand: false,
            jsvmfn: OpDiv,
            aliases: ['/', '÷', 'DIVIDE']
        }
    ],
    [
    35,
    {
            enum: AllStandardOps.EXP,
            name: 'EXP',
            description: '',      
            pushes: pnp.one,
            pops: pnp.oprnd, 
            isZeroOperand: false,
            jsvmfn: OpExp,
            aliases: ['^', '**', 'POW', 'POWER', 'POWER_OF', 'POWEROF', 'EXPONENTION']
        }
    ],
    [
        36,
        {
            enum: AllStandardOps.MAX,
            name: 'MAX',
            description: '',      
            pushes: pnp.one,
            pops: pnp.oprnd, 
            isZeroOperand: false,
            jsvmfn: OpMax,
            aliases: ['MAXIMUM', 'MAXIMUM_OF', 'MAXIMUMOF', 'MAX_OF', 'MAXOF']
        }
    ],
    [
        37,
        {
            enum: AllStandardOps.MIN,
            name: 'MIN',
            description: '',      
            pushes: pnp.one,
            pops: pnp.oprnd, 
            isZeroOperand: false,
            jsvmfn: OpMin,
            aliases: ['MINIMUM', 'MINIMUM_OF', 'MINIMUMOF', 'MIN_OF', 'MINOF']
        }
    ],
    [
        38,
        {
            enum: AllStandardOps.MOD,
            name: 'MOD',
            description: '',      
            pushes: pnp.one,
            pops: pnp.oprnd, 
            isZeroOperand: false,
            jsvmfn: OpMod,
            aliases: ['%']
        }
    ],
    [
        39,
        {
            enum: AllStandardOps.MUL,
            name: 'MUL',
            description: '',      
            pushes: pnp.one,
            pops: pnp.oprnd, 
            isZeroOperand: false,
            jsvmfn: OpMul,
            aliases: ['*', 'X']
        }
    ],
    [
        40,
        {   
            enum: AllStandardOps.SUB,
            name: 'SUB',
            description: '',      
            pushes: pnp.one,
            pops: pnp.oprnd,
            isZeroOperand: false,
            jsvmfn: OpSub,
            aliases: ['-', 'MINUS']
        }
    ],
    [
        41,
        {
            enum: AllStandardOps.ITIERV2_REPORT,
            name: 'ITIERV2_REPORT',
            description: '',      
            pushes: pnp.one,
            pops: pnp.derived,
            isZeroOperand: false,
            jsvmfn: OpITierV2Report,
            aliases: ['REPORT', 'ITIERV2REPORT', 'TIERREPORT', 'TIER_REPORT', 'ITIERREPORT', 'ITIER_REPORT']
        }
    ],
    [
        42,
        {
            enum: AllStandardOps.ITIERV2_REPORT_TIME_FOR_TIER,
            name: 'ITIERV2_REPORT_TIME_FOR_TIER',
            description: '',      
            pushes: pnp.one,
            pops: pnp.derived, 
            isZeroOperand: false,
            jsvmfn: OpITierV2ReportTimesForTier,
            aliases: ['ITIERV2REPORTTIMEFORTIER', 'SINGLE_REPORT', 'SINGLEREPORT', 'SINGLE_TIER_REPORT', 'SINGLETIERREPORT']
        }
    ],
    [
        43,
        {
            enum: AllStandardOps.SATURATING_DIFF,
            name: 'SATURATING_DIFF',
            description: '',      
            pushes: pnp.one,
            pops: pnp.two, 
            isZeroOperand: true,
            jsvmfn: OpSaturatingDiff,
            aliases: ['SAT_DIFF', 'SATDIFF', 'SATURATINGDIFF']
        }
    ],
    [
        44,
        {
            enum: AllStandardOps.SELECT_LTE,
            name: 'SELECT_LTE',
            description: '',      
            pushes: pnp.one,
            pops: pnp.derived, 
            isZeroOperand: false,
            jsvmfn: OpSelectLte,
            aliases: ['SELECTLTE', 'SELECT']
        }
    ],
    [
        45,
        {
            enum: AllStandardOps.UPDATE_TIMES_FOR_TIER_RANGE,
            name: 'UPDATE_TIMES_FOR_TIER_RANGE',
            description: '',      
            pushes: pnp.one,
            pops: pnp.two, 
            isZeroOperand: false,
            jsvmfn: OpUpdateTimesForTierRange,
            aliases: ['UPDATETIMESFORTIERRANGE', 'UPDATE_TIER_RANGE', 'UPDATETIERRANGE', 'UPDATE_TIERS', 'UPDATETIERS', 'UPDATE_REPORT', 'UPDATEREPORT']
        }
    ]
]);
