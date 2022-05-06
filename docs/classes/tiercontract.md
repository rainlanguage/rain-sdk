[Home](../index.md) &gt; [TierContract](./tiercontract.md)

# Class TierContract

Combine the static methods that are present in factories with the ITier instance methods. Should be use to the TierFactories.

<b>Signature:</b>

```typescript
abstract class TierContract extends FactoryContract 
```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [getChainId](./raincontract.md#getChainId-property-static) | `(signerOrProvider: Signer \| Provider) => Promise<number>` | Get the chain ID from a valid ethers provider.<br><br>Request to the provider stored in the signer which is the chain ID.<br><br><i>Inherited from [RainContract.getChainId](./raincontract.md#getChainId-property-static)</i> |
|  [nameBookReference](./raincontract.md#nameBookReference-property-static) | `string` | Reference to find the address in the book address. Should be implemented and assign it to each subclass<br><br><i>Inherited from [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)</i> |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [address](./raincontract.md#address-property) | `string` | <i>Inherited from [RainContract.address](./raincontract.md#address-property)</i> |
|  [connect](./raincontract.md#connect-property) | `(signer: Signer) => RainContract` | Connect the current instance to a new signer<br><br><i>Inherited from [RainContract.connect](./raincontract.md#connect-property)</i> |
|  [levels](./tiercontract.md#levels-property) | `typeof Tier` | All the contract tier levels. |
|  [report](./tiercontract.md#report-property) | `(account: string, overrides?: ReadTxOverrides) => Promise<BigNumber>` | A tier report is a `uint256` that contains each of the block numbers each tier has been held continously since as a `uint32`<!-- -->. There are 9 possible tier, starting with tier 0 for `0` offset or "never held any tier" then working up through 8x 4 byte offsets to the full 256 bits. |
|  [setTier](./tiercontract.md#setTier-property) | `(account: string, endTier: BigNumberish, data: BytesLike, overrides?: TxOverrides) => Promise<ContractTransaction>` | Users can set their own tier by calling `setTier`<!-- -->. Updates the tier of an account. Transfers balances of erc20 from/to the tiered account according to the difference in values.<br><br>Any failure to transfer in/out will rollback the tier change. The tiered account must ensure sufficient approvals before attempting to set a new tier. This throw an error if the user attempts to return to the ZERO tier. |
|  [signer](./raincontract.md#signer-property) | `Signer` | <i>Inherited from [RainContract.signer](./raincontract.md#signer-property)</i> |

## Static Methods

|  Method | Description |
|  --- | --- |
|  [\_isChild(signer, maybeChild)](./factorycontract.md#_isChild-method-static-1) | Checks if address is registered as a child contract of the factory in the chain. Should be implemented in sub-classes that repreent factories to expose it.<br><br><i>Inherited from [FactoryContract.\_isChild()](./factorycontract.md#_isChild-method-static-1)</i> |
|  [getBookAddress(chainId)](./raincontract.md#getBookAddress-method-static-1) | Get the address stored in the book to this chain<br><br><i>Inherited from [RainContract.getBookAddress()](./raincontract.md#getBookAddress-method-static-1)</i> |
|  [getNewChildFromReceipt(receipt, parentContract)](./factorycontract.md#getNewChildFromReceipt-method-static-1) | Get the child from a receipt obtain from a Factory transaction<br><br><i>Inherited from [FactoryContract.getNewChildFromReceipt()](./factorycontract.md#getNewChildFromReceipt-method-static-1)</i> |

## Methods

|  Method | Description |
|  --- | --- |
|  [checkAddress(address, message)](./raincontract.md#checkAddress-method-1) | Check if an address is correctly formatted and throw an error if it is not an valid address<br><br><i>Inherited from [RainContract.checkAddress()](./raincontract.md#checkAddress-method-1)</i> |
|  [currentTier(account, block)](./tiercontract.md#currentTier-method-1) | Get the current tier of an `account` in the Tier as an expression between `[0 - 8]`<!-- -->. Tier 0 is that a address has never interact with the Tier Contract. |

## Property Details

<a id="levels-property"></a>

### levels

All the contract tier levels.

<b>Signature:</b>

```typescript
readonly levels: typeof Tier;
```

<a id="report-property"></a>

### report

A tier report is a `uint256` that contains each of the block numbers each tier has been held continously since as a `uint32`<!-- -->. There are 9 possible tier, starting with tier 0 for `0` offset or "never held any tier" then working up through 8x 4 byte offsets to the full 256 bits.

<b>Signature:</b>

```typescript
readonly report: (account: string, overrides?: ReadTxOverrides) => Promise<BigNumber>;
```

<a id="setTier-property"></a>

### setTier

Users can set their own tier by calling `setTier`<!-- -->. Updates the tier of an account. Transfers balances of erc20 from/to the tiered account according to the difference in values.

Any failure to transfer in/out will rollback the tier change. The tiered account must ensure sufficient approvals before attempting to set a new tier. This throw an error if the user attempts to return to the ZERO tier.

<b>Signature:</b>

```typescript
readonly setTier: (account: string, endTier: BigNumberish, data: BytesLike, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

## Method Details

<a id="currentTier-method-1"></a>

### currentTier(account, block)

Get the current tier of an `account` in the Tier as an expression between `[0 - 8]`<!-- -->. Tier 0 is that a address has never interact with the Tier Contract.

<b>Signature:</b>

```typescript
currentTier(account: string, block?: number): Promise<number>;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  account | `string` | address to check the current tier |
|  block | `number` | (optional) check the level tier of an account with respect to a specific block |

<b>Returns:</b>

`Promise<number>`

current tier level of the account

