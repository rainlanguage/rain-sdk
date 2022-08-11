import { ethers } from 'ethers';
import { Filter } from './types';
import { StateConfig, VM } from '../classes/vm';
import { BetweenTimestamps } from '../contracts/script-generators/saleScriptGenerator';
import { CombineTierGenerator } from '../contracts/script-generators/combineTierScriptGenerator';


/**
 * @public
 * Key/value paired library to get the corresponding StateConfigs from RuleBuilder types by Rulebuilder class methods
 */
export const lib: Record<string, (...args: any) => StateConfig> = {
    
    'always': () => {
        return VM.constant(ethers.constants.One)
    },

    'never': () => {
        return VM.constant(ethers.constants.Zero)
    },

    'input': ({ index }: Filter<'input'>['input']['args']) => {
        return VM.input(index);
    },

    'before-time': ({
        timestamp,
        exactTime,
    }: Filter<'before-time'>['before-time']['args']) => {
        const operator = exactTime ? 'lte' : 'lt';
        return VM.beforeAfterTime(timestamp, operator);
    },

    'after-time': ({
        timestamp,
        exactTime,
    }: Filter<'before-time'>['before-time']['args']) => {
        const operator = exactTime ? 'gte' : 'gt';
        return VM.beforeAfterTime(timestamp, operator);
    },

    'between-times': ({
        startTimestamp,
        endTimestamp,
    }: Filter<'between-times'>['between-times']['args']) => {
        return new BetweenTimestamps(startTimestamp, endTimestamp);
    },

    'before-block': ({
        block,
        exactBlock,
    }: Filter<'before-block'>['before-block']['args']) => {
        const operator = exactBlock ? 'lte' : 'lt';
        return VM.beforeAfterTime(block, operator);
    },

    'after-block': ({
        block,
        exactBlock,
    }: Filter<'after-block'>['after-block']['args']) => {
        const operator = exactBlock ? 'gte' : 'gt';
        return VM.beforeAfterTime(block, operator);
    },

    'between-blocks': ({
        startBlock,
        endBlock,
    }: Filter<'between-blocks'>['between-blocks']['args']) => {
        return new BetweenTimestamps(startBlock, endBlock);
    },

    'has-min-tier': ({
        tierAddress,
        tierContext,
        minTier,
    }: Filter<'has-min-tier'>['has-min-tier']['args']) => {
        return VM.hasMinTier(
            new CombineTierGenerator(tierAddress, {
                staticTierContext: tierContext,
                delegatedReport: true,
            }),
            minTier,
            false
        );
    },

    'has-any-tier': ({
        tierAddress,
        tierContext,
    }: Filter<'has-any-tier'>['has-any-tier']['args']) => {
        return VM.hasAnyTier(
            new CombineTierGenerator(tierAddress, {
                staticTierContext: tierContext,
                delegatedReport: true,
            }),
            false
        );
    },

    'user-erc20-balance': ({
        tokenAddress,
    }: Filter<'user-erc20-balance'>['user-erc20-balance']['args']) => {
        return VM.getAsset('erc20-balance-of', [tokenAddress], undefined, true);
    },

    'erc20-total-supply': ({
        tokenAddress,
    }: Filter<'erc20-total-supply'>['erc20-total-supply']['args']) => {
        return VM.getAsset('erc20-total-supply', [tokenAddress]);
    },

    'user-erc721-balance': ({
        tokenAddress,
    }: Filter<'user-erc721-balance'>['user-erc721-balance']['args']) => {
        return VM.getAsset('erc721-balance-of', [tokenAddress], undefined, true);
    },

    'erc721-owner': ({
        tokenAddress,
        id,
    }: Filter<'erc721-owner'>['erc721-owner']['args']) => {
        return VM.getAsset('erc721-owner-of', [tokenAddress], [id], true);
    },

    'user-erc1155-balance': ({
        tokenAddress,
        id,
    }: Filter<'user-erc1155-balance'>['user-erc1155-balance']['args']) => {
        return VM.getAsset('erc1155-balance-of', [tokenAddress], [id], true);
    },

    'user-erc20-snapshot-balance': ({
        tokenAddress,
        id,
    }: Filter<
        'user-erc20-snapshot-balance'
    >['user-erc20-snapshot-balance']['args']) => {
        return VM.getAsset('snapshot-balance-of', [tokenAddress], [id], true);
    },

    'erc20-snapshot-total-supply': ({
        tokenAddress,
        id,
    }: Filter<
        'erc20-snapshot-total-supply'
    >['erc20-snapshot-total-supply']['args']) => {
        return VM.getAsset('snapshot-total-supply', [tokenAddress], [id], true);
    },

    constant: ({ value }: Filter<'constant'>['constant']['args']) => {
        return VM.constant(value);
    },

    'increasing-by-time': ({
        startValue,
        endValue,
        startTimestamp,
        endTimestamp,
    }: Filter<'increasing-by-time'>['increasing-by-time']['args']) => {
        return VM.inc(startValue, endValue, startTimestamp, endTimestamp);
    },

    'decreasing-by-time': ({
        startValue,
        endValue,
        startTimestamp,
        endTimestamp,
    }: Filter<'decreasing-by-time'>['decreasing-by-time']['args']) => {
        return VM.dec(startValue, endValue, startTimestamp, endTimestamp);
    },

    'increasing-by-block': ({
        startValue,
        endValue,
        startBlock,
        endBlock,
    }: Filter<'increasing-by-block'>['increasing-by-block']['args']) => {
        return VM.inc(startValue, endValue, startBlock, endBlock, true);
    },

    'decreasing-by-block': ({
        startValue,
        endValue,
        startBlock,
        endBlock,
    }: Filter<'decreasing-by-block'>['decreasing-by-block']['args']) => {
        return VM.dec(startValue, endValue, startBlock, endBlock, true);
    },

    'increasing-by-time-period': ({
        startValue,
        startTimestamp,
        margin,
        periodLength,
        endValue
    }: Filter<'increasing-by-time-period'>['increasing-by-time-period']['args']) => {
        return VM.incBy(startValue, startTimestamp, margin, periodLength, endValue)
    },

    'decreasing-by-time-period': ({
        startValue,
        startTimestamp,
        margin,
        periodLength,
        endValue
    }: Filter<'decreasing-by-time-period'>['decreasing-by-time-period']['args']) => {
        return VM.decBy(startValue, startTimestamp, margin, periodLength, endValue)
    },

    'increasing-by-block-period': ({
        startValue,
        startBlock,
        margin,
        periodLength,
        endValue
    }: Filter<'increasing-by-block-period'>['increasing-by-block-period']['args']) => {
        return VM.incBy(startValue, startBlock, margin, periodLength, endValue, true)
    },

    'decreasing-by-block-period': ({
        startValue,
        startBlock,
        margin,
        periodLength,
        endValue
    }: Filter<'decreasing-by-block-period'>['decreasing-by-block-period']['args']) => {
        return VM.decBy(startValue, startBlock, margin, periodLength, endValue, true)
    },

} as const;
