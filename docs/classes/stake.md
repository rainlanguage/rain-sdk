
# Class Stake

A class for calling methods on a Stake.

This class provides an easy way to interact with Stake contracts.

<b>Signature:</b>

```typescript
class Stake extends ITierV2 
```

## Example


```typescript
import { Stake } from 'rain-sdk';

// To get a instance of an already deployed stake contract, pass the contract address and an ethers.js Signer
const stake = new Stake(address, signer);

// Check if an address is child from the factory deployed in the current chain.
await Stake.isChild(signer, maybeChildAddress);

```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [deploy](./stake.md#deploy-property-static) | `(signer: Signer, stakeConfig: StakeDeployArgs, overrides?: TxOverrides) => Promise<Stake>` | Deploys a new Stake. |
|  [getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static) | `(chainId: number) => Addresses` | Obtain all the addresses deployed in a specific network with a chain ID.<br></br>*Inherited from [AddressBook.getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static)* |
|  [getChainId](./raincontract.md#getChainId-property-static) | `(signerOrProvider: Signer \| Provider) => Promise<number>` | Get the chain ID from a valid ethers provider.<br></br>Request to the provider stored in the signer which is the chain ID.<br></br>*Inherited from [RainContract.getChainId](./raincontract.md#getChainId-property-static)* |
|  [getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static) | `(chainId: number) => string` | Obtain the latest subgraph endpoint related to the version that use the SDK.<br></br>*Inherited from [AddressBook.getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static)* |
|  [isChild](./stake.md#isChild-property-static) | `(signer: Signer, maybeChild: string) => Promise<boolean>` | Checks if address is registered as a child contract of this StakeFactory on a specific network |
|  [nameBookReference](./stake.md#nameBookReference-property-static) | `string` | Name reference to find the address of the contract in the book address.<br></br>*Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)* |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [address](./raincontract.md#address-property) | `string` | The contract address of the instance.<br></br>*Inherited from [RainContract.address](./raincontract.md#address-property)* |
|  [allowance](./stake.md#allowance-property) | `(owner: string, spender: string, overrides?: ReadTxOverrides) => Promise<BigNumber>` | Returns the remaining number of tokens that `spender` will be allowed to spend on behalf of `owner` through `transferFrom()`<!-- -->. This is zero by default.<br></br>This value changes when `approve()` or `transferFrom()` are called. |
|  [approve](./stake.md#approve-property) | `(spender: string, amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Approve spend limit `amount` as the allowance for a `spender` over this tokens. |
|  [balanceOf](./stake.md#balanceOf-property) | `(account: string, overrides?: ReadTxOverrides) => Promise<BigNumber>` | Returns the amount of tokens owned by `account`<!-- -->. |
|  [connect](./stake.md#connect-property) | `(signer: Signer) => Stake` | Conncect to this Stake contract with another signer<br></br>*Overrides [ITierV2.connect](./itierv2.md#connect-property)* |
|  [decimals](./stake.md#decimals-property) | `(overrides?: ReadTxOverrides) => Promise<number>` | Returns the number of decimals used to get its user representation. (It is always 18 for this contract type) |
|  [decreaseAllowance](./stake.md#decreaseAllowance-property) | `(spender: string, subtractedValue: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Automatically decreases the allowance granted to `spender` for this token.<br></br>This is an alternative to `approve()` that can be used as a mitigation for problems described in https://github.com/ethereum/EIPs/issues/20\#issuecomment-263524729. |
|  [deposit](./stake.md#deposit-property) | `(amount_: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Method to deposit some 'amount\_' of token (assets) by the signer into the Stake contract which then will result in minting of the stake token (shares) at the current Stake contract ratio and be transfered to the signer's wallet. |
|  [increaseAllowance](./stake.md#increaseAllowance-property) | `(spender: string, addedValue: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Automically increases the allowance granted to `spender` for this token.<br></br>This is an alternative to `approve()` that can be used as a mitigation for problems described in https://github.com/ethereum/EIPs/issues/20\#issuecomment-263524729. |
|  [levels](./itierv2.md#levels-property) | `typeof Tier` | All the contract tier levels availables in all ITier contracts.<br></br>*Inherited from [ITierV2.levels](./itierv2.md#levels-property)* |
|  [name](./stake.md#name-property) | `(overrides?: ReadTxOverrides) => Promise<string>` | Returns the name of the token. |
|  [report](./itierv2.md#report-property) | `(account: string, context: BigNumberish[], overrides?: ReadTxOverrides) => Promise<BigNumber>` | A tier report is a `uint256` that contains each of the block numbers each tier has been held continously since as a `uint32`<!-- -->.<br></br>*Inherited from [ITierV2.report](./itierv2.md#report-property)* |
|  [reportTimeForTier](./itierv2.md#reportTimeForTier-property) | `(account: string, tier: BigNumberish, context: BigNumberish[], overrides?: ReadTxOverrides) => Promise<BigNumber>` | Same as report but only returns the time for a single tier. Often the implementing contract can calculate a single tier more efficiently than all 8 tiers. If the consumer only needs one or a few tiers it MAY be much cheaper to request only those tiers individually.<br></br>*Inherited from [ITierV2.reportTimeForTier](./itierv2.md#reportTimeForTier-property)* |
|  [signer](./raincontract.md#signer-property) | `Signer` | The ethers signer that is connected to the instance.<br></br>*Inherited from [RainContract.signer](./raincontract.md#signer-property)* |
|  [supportsInterface](./stake.md#supportsInterface-property) | `(interfaceId_: BytesLike, overrides?: ReadTxOverrides) => Promise<boolean>` | Returns true if this contract implements the interface defined by `interfaceId`<!-- -->. See the corresponding https://eips.ethereum.org/EIPS/eip-165\#how-interfaces-are-identified\[EIP section\] to learn more about how these ids are created.<br></br>This function call must use less than 30 000 gas. |
|  [symbol](./stake.md#symbol-property) | `(overrides?: ReadTxOverrides) => Promise<string>` | Returns the symbol of the token, usually a shorter version of the name. |
|  [totalSupply](./stake.md#totalSupply-property) | `(overrides?: ReadTxOverrides) => Promise<BigNumber>` | Returns the amount of tokens in existence. |
|  [transfer](./stake.md#transfer-property) | `(to: string, amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Moves `amount` of tokens from the caller's account to `to`<!-- -->.<br></br>Requirements:<br></br>- `to` cannot be the zero address. - the caller must have a balance of at least `amount`<!-- -->. |
|  [transferFrom](./stake.md#transferFrom-property) | `(from: string, to: string, amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Moves `amount` of tokens from `from` to `to` using the allowance mechanism. `amount` is then deducted from the caller's allowance.<br></br>NOTE: Does not update the allowance if the current allowance is the maximum `uint256`<!-- -->.<br></br>Requirements:<br></br>- `from` and `to` cannot be the zero address. - `from` must have a balance of at least `amount`<!-- -->. - the caller must have allowance for `from`<!-- -->'s tokens of at least `amount`<!-- -->. |
|  [withdraw](./stake.md#withdraw-property) | `(amount_: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Method to Withdraw some amount of already staked token (assets) by the signer from the Stake contract which then will result in burning of 'amount\_' of stake tokens (shares) and will result in a transfer of asset at the current Stake contract ratio to the signer's wallet. |

## Static Methods

|  Method | Description |
|  --- | --- |
|  [\_isChild(signer, maybeChild)](./factorycontract.md#_isChild-method-static-1) | Checks if address is registered as a child contract of the factory in the chain.<br></br>*Inherited from [FactoryContract.\_isChild()](./factorycontract.md#_isChild-method-static-1)* |
|  [getBookAddress(chainId)](./raincontract.md#getBookAddress-method-static-1) | Get the address stored in the book for a determined chain if it is available.<br></br>*Inherited from [RainContract.getBookAddress()](./raincontract.md#getBookAddress-method-static-1)* |
|  [getNewChildFromReceipt(receipt, parentContract)](./factorycontract.md#getNewChildFromReceipt-method-static-1) | Get the child from a receipt obtain from a Factory transaction<br></br>*Inherited from [FactoryContract.getNewChildFromReceipt()](./factorycontract.md#getNewChildFromReceipt-method-static-1)* |

## Methods

|  Method | Description |
|  --- | --- |
|  [checkAddress(address, message)](./raincontract.md#checkAddress-method-1) | Check if an address is correctly formatted and throw an error if it is not an valid address<br></br>*Inherited from [RainContract.checkAddress()](./raincontract.md#checkAddress-method-1)* |
|  [currentTier(account, timestamp)](./itierv2.md#currentTier-method-1) | Get the current tier of an `account` in the Tier as an expression between `[0 - 8]`<!-- -->. Tier 0 is that a address has never interact with the Tier Contract.<br></br>*Inherited from [ITierV2.currentTier()](./itierv2.md#currentTier-method-1)* |

## Static Property Details

<a id="deploy-property-static"></a>

### deploy

Deploys a new Stake.

<b>Signature:</b>

```typescript
static deploy: (signer: Signer, stakeConfig: StakeDeployArgs, overrides?: TxOverrides) => Promise<Stake>;
```

<a id="isChild-property-static"></a>

### isChild

Checks if address is registered as a child contract of this StakeFactory on a specific network

<b>Signature:</b>

```typescript
static isChild: (signer: Signer, maybeChild: string) => Promise<boolean>;
```

<a id="nameBookReference-property-static"></a>

### nameBookReference

Name reference to find the address of the contract in the book address.

*Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)*

Should be implemented in each class to find the factory or main address in the book.

<b>Signature:</b>

```typescript
protected static readonly nameBookReference: string;
```

## Property Details

<a id="allowance-property"></a>

### allowance

Returns the remaining number of tokens that `spender` will be allowed to spend on behalf of `owner` through `transferFrom()`<!-- -->. This is zero by default.

This value changes when `approve()` or `transferFrom()` are called.

<b>Signature:</b>

```typescript
readonly allowance: (owner: string, spender: string, overrides?: ReadTxOverrides) => Promise<BigNumber>;
```

<a id="approve-property"></a>

### approve

Approve spend limit `amount` as the allowance for a `spender` over this tokens.

<b>Signature:</b>

```typescript
readonly approve: (spender: string, amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="balanceOf-property"></a>

### balanceOf

Returns the amount of tokens owned by `account`<!-- -->.

<b>Signature:</b>

```typescript
readonly balanceOf: (account: string, overrides?: ReadTxOverrides) => Promise<BigNumber>;
```

<a id="connect-property"></a>

### connect

Conncect to this Stake contract with another signer

*Overrides [ITierV2.connect](./itierv2.md#connect-property)*

<b>Signature:</b>

```typescript
readonly connect: (signer: Signer) => Stake;
```

<a id="decimals-property"></a>

### decimals

Returns the number of decimals used to get its user representation. (It is always 18 for this contract type)

<b>Signature:</b>

```typescript
readonly decimals: (overrides?: ReadTxOverrides) => Promise<number>;
```

<a id="decreaseAllowance-property"></a>

### decreaseAllowance

Automatically decreases the allowance granted to `spender` for this token.

This is an alternative to `approve()` that can be used as a mitigation for problems described in https://github.com/ethereum/EIPs/issues/20\#issuecomment-263524729.

<b>Signature:</b>

```typescript
readonly decreaseAllowance: (spender: string, subtractedValue: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="deposit-property"></a>

### deposit

Method to deposit some 'amount\_' of token (assets) by the signer into the Stake contract which then will result in minting of the stake token (shares) at the current Stake contract ratio and be transfered to the signer's wallet.

<b>Signature:</b>

```typescript
readonly deposit: (amount_: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="increaseAllowance-property"></a>

### increaseAllowance

Automically increases the allowance granted to `spender` for this token.

This is an alternative to `approve()` that can be used as a mitigation for problems described in https://github.com/ethereum/EIPs/issues/20\#issuecomment-263524729.

<b>Signature:</b>

```typescript
readonly increaseAllowance: (spender: string, addedValue: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="name-property"></a>

### name

Returns the name of the token.

<b>Signature:</b>

```typescript
readonly name: (overrides?: ReadTxOverrides) => Promise<string>;
```

<a id="supportsInterface-property"></a>

### supportsInterface

Returns true if this contract implements the interface defined by `interfaceId`<!-- -->. See the corresponding https://eips.ethereum.org/EIPS/eip-165\#how-interfaces-are-identified\[EIP section\] to learn more about how these ids are created.

This function call must use less than 30 000 gas.

<b>Signature:</b>

```typescript
readonly supportsInterface: (interfaceId_: BytesLike, overrides?: ReadTxOverrides) => Promise<boolean>;
```

<a id="symbol-property"></a>

### symbol

Returns the symbol of the token, usually a shorter version of the name.

<b>Signature:</b>

```typescript
readonly symbol: (overrides?: ReadTxOverrides) => Promise<string>;
```

<a id="totalSupply-property"></a>

### totalSupply

Returns the amount of tokens in existence.

<b>Signature:</b>

```typescript
readonly totalSupply: (overrides?: ReadTxOverrides) => Promise<BigNumber>;
```

<a id="transfer-property"></a>

### transfer

Moves `amount` of tokens from the caller's account to `to`<!-- -->.

Requirements:

- `to` cannot be the zero address. - the caller must have a balance of at least `amount`<!-- -->.

<b>Signature:</b>

```typescript
readonly transfer: (to: string, amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="transferFrom-property"></a>

### transferFrom

Moves `amount` of tokens from `from` to `to` using the allowance mechanism. `amount` is then deducted from the caller's allowance.

NOTE: Does not update the allowance if the current allowance is the maximum `uint256`<!-- -->.

Requirements:

- `from` and `to` cannot be the zero address. - `from` must have a balance of at least `amount`<!-- -->. - the caller must have allowance for `from`<!-- -->'s tokens of at least `amount`<!-- -->.

<b>Signature:</b>

```typescript
readonly transferFrom: (from: string, to: string, amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="withdraw-property"></a>

### withdraw

Method to Withdraw some amount of already staked token (assets) by the signer from the Stake contract which then will result in burning of 'amount\_' of stake tokens (shares) and will result in a transfer of asset at the current Stake contract ratio to the signer's wallet.

<b>Signature:</b>

```typescript
readonly withdraw: (amount_: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>;
```
