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
            aliases: ['Constant', 'constant', 'const', 'Const']
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
            },
            aliases: ['stack', 'Stack']
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
            },
            aliases: ['context', 'Context']
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
            aliases: ['storage', 'Storage']
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
            },
            aliases: ['zipmap', 'Zipamp']
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
            aliases: ['debug', 'Debug']
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
            aliases: ['ierc20_balance_of', 'erc20_balance_of', 'ERC20_BALANCE_OF']
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
            aliases: ['ierc20_total_supply', 'erc20_total_supply', 'ERC20_TOTAL_SUPPLY']
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
            aliases: ['ierc20_snapshot_balance_of', 'erc20_snapshot_balance_of', 'ERC20_SNAPSHOT_BALANCE_OF']
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
            aliases: ['ierc20_snapshot_total_supply', 'erc20_snapshot_total_supply', 'ERC20_SNAPSHOT_TOTAL_SUPPLY']
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
            aliases: ['ierc721_balance_of', 'erc721_balance_of', 'ERC721_BALANCE_OF']
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
            aliases: ['ierc721_owner_of', 'erc721_owner_of', 'ERC721_OWNER_OF']
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
            aliases: ['ierc1155_balance_of', 'erc1155_balance_of', 'ERC1155_BALANCE_OF']
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
            aliases: ['ierc1155_balance_of_batch', 'erc1155_balance_of_batch', 'ERC1155_BALANCE_OF_BATCH']
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
            aliases: ['CURRENT_BLOCK', 'current_block', 'Current_Block', 'currentBlock', 'block_number', 'blockNumber', 'BlockNumber'],
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
            aliases: ['MSG_SENDER', 'msg_sender', 'Msg_Sender', 'msgSender', 'MsgSender', 'Sender', 'sender']
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
            aliases: ['THIS_ADDRESS', 'this_address', 'This_Adress', 'ThisAddress', 'thisAddress']
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
            aliases: ['CURRENT_TIMESTAMP', 'Current_Timestamp', 'current_timestamp', 'currentTimestamp', 'block_timestamp', 'Block_Timestamp', 'blockTimestamp', 'BlockTimestamp']
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
            aliases: ['Scale18', 'scale18']
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
            aliases: ['Scale18_Div', 'scale18_div', 'scale18Div', 'Scale18Div', 'scale18div']
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
            aliases: ['Scale18_Mul', 'scale18_mul', 'scale18Mul', 'Scale18Mul', 'scale18mul']
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
            aliases: ['Scale_By', 'scale_by', 'scaleBy', 'ScaleBy']
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
            aliases: ['ScaleN', 'scaleN', 'scalen', 'scale_n', 'Scale_N', 'scale_n']
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
            aliases: ['Any', 'any', 'or']
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
            aliases: ['eager_if', 'Eager_If', 'Eager_if', 'if', 'If', 'IF']
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
            aliases: ['Equal_To', 'equal_to', 'EqualTo', 'equalTo', 'eq', 'Eq', 'EQ']
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
            aliases: ['Every', 'every', 'and', 'And', 'and', 'AND'] 
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
            aliases: ['Greater_Than', 'greater_than', 'greaterThan', 'GreaterThan', 'gt', 'GT', 'Gt']
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
            aliases: ['IsZero', 'isZero', 'iszero', 'Is_Zero', 'is_zero', 'IS_ZERO']
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
            aliases: ['Less_Than', 'less_than', 'lessThan', 'LessThan', 'lt', 'LT', 'Lt']
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
            aliases: ['Saturating_Add', 'saturating_add', 'saturatingAdd', 'satAdd', 'sat_add', 'Sat_Add', 'Saturating_Sum', 'saturating_sum', 'saturatingSum', 'satSum', 'sat_sum', 'Sat_Sum']
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
            aliases: ['Saturating_Mul', 'saturating_mul', 'saturatingMul', 'satMul', 'sat_mul', 'Sat_Mul']
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
            aliases: ['Saturating_Sub', 'saturating_sub', 'saturatingSub', 'satSub', 'sat_sub', 'Sat_Sub', 'Saturating_Minus', 'saturating_minus', 'saturatingMinus', 'satMinus', 'sat_minus', 'Sat_Minus']
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
            aliases: ['Add', 'add', '+', 'Sum', 'sum', 'SUM']
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
            aliases: ['Div', 'div', '/']
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
            aliases: ['Exp', 'exp', '^', 'POW', 'Pow', 'pow']
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
            aliases: ['Max', 'max', 'maximum', 'MAXIMUM', 'Maximum']
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
            aliases: ['Min', 'min', 'MINIMUM', 'Minimum', 'minimum']
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
            aliases: ['Mod', 'mod', '%']
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
            aliases: ['Mul', 'mul', '*', 'x', 'X']
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
            aliases: ['Sub', 'sub', '-', 'minus', 'Minus', 'MINUS']
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
            aliases: ['itierv2_report', 'Itierv2_Report', 'itierv2Report', 'report', 'Report', 'REPORT']
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
            aliases: ['itierv2_report_time_for_tier', 'Itierv2_Report_Time_For_Tier', 'Itierv2ReportTimeForTier', 'itierv2ReportTimeForTier', 'singleReport', 'SingleReport', 'Single_Report', 'single_report']
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
            aliases: ['Saturating_Diff', 'saturating_diff', 'saturatingDiff', 'satDiff', 'SatDiff', 'sat_diff', 'Sat_Diff', 'SAT_DIFF']
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
            aliases: ['Select_Lte', 'select_lte', 'selectLte', 'SelectLte']
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
            aliases: ['update_times_for_tier_range', 'Update_Times_For_Tier_Range', 'UpdateTimesForTierRange', 'updateTimesForTierRange']
        }
    ]
]);
