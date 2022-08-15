
# Type ArgsTypeBook

A key/type pair for all the valid Struct types

<b>Signature:</b>

```typescript
type ArgsTypeBook = {
    'always': {};
    'never': {};
    'input': {
        index: number;
    };
    'before-time': {
        timestamp: number;
        exactTime?: boolean;
    };
    'after-time': {
        timestamp: number;
        exactTime?: boolean;
    };
    'between-times': {
        startTimestamp: number;
        endTimestamp: number;
    };
    'before-block': {
        block: number;
        exactBlock?: boolean;
    };
    'after-block': {
        block: number;
        exactBlock?: boolean;
    };
    'between-blocks': {
        startBlock: number;
        endBlock: number;
    };
    'has-min-tier': {
        tierAddress: string;
        minTier: Tier;
        tierContext?: BigNumber[];
    };
    'has-any-tier': {
        tierAddress: string;
        tierContext?: BigNumber[];
    };
    'user-erc20-balance': {
        tokenAddress: string;
    };
    'erc20-total-supply': {
        tokenAddress: string;
    };
    'user-erc721-balance': {
        tokenAddress: string;
    };
    'erc721-owner': {
        tokenAddress: string;
        id: BigNumber;
    };
    'user-erc1155-balance': {
        tokenAddress: string;
        id: BigNumber;
    };
    'user-erc20-snapshot-balance': {
        tokenAddress: string;
        id: BigNumber;
    };
    'erc20-snapshot-total-supply': {
        tokenAddress: string;
        id: BigNumber;
    };
    'constant': {
        value: BigNumber;
    };
    'increasing-by-time': {
        startValue: BigNumber;
        endValue: BigNumber;
        startTimestamp: number;
        endTimestamp: number;
    };
    'decreasing-by-time': {
        startValue: BigNumber;
        endValue: BigNumber;
        startTimestamp: number;
        endTimestamp: number;
    };
    'increasing-by-block': {
        startValue: BigNumber;
        endValue: BigNumber;
        startBlock: number;
        endBlock: number;
    };
    'decreasing-by-block': {
        startValue: BigNumber;
        endValue: BigNumber;
        startBlock: number;
        endBlock: number;
    };
    'increasing-by-time-period': {
        startValue: BigNumber;
        startTimestamp: number;
        margin: BigNumber;
        periodLength: number;
        endValue?: number;
    };
    'decreasing-by-time-period': {
        startValue: BigNumber;
        startTimestamp: number;
        margin: BigNumber;
        periodLength: number;
        endValue?: number;
    };
    'increasing-by-block-period': {
        startValue: BigNumber;
        startBlock: number;
        margin: BigNumber;
        periodLength: number;
        endValue?: number;
    };
    'decreasing-by-block-period': {
        startValue: BigNumber;
        startBlock: number;
        margin: BigNumber;
        periodLength: number;
        endValue?: number;
    };
};
```
