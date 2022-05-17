
# Class EmissionsERC20

A class for calling methods on a EmissionsERC20.

This class provides an easy way to deploy and interact with EmissionsERC20's.

<b>Signature:</b>

```typescript
class EmissionsERC20 extends TierContract 
```

## Example


```typescript
import { EmissionsERC20 } from 'rain-sdk';

// To deploy a new EmissionsERC20, pass an ethers.js Signer and the config for the EmissionsERC20.
const newEmission = EmissionsERC20.deploy(signer, args);

// Check if an address is child from the factory deployed in the current chain.
await EmissionsERC20.isChild(signer, newEmission.address);

```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [deploy](./emissionserc20.md#deploy-property-static) | `(signer: Signer, args: EmissionsERC20DeployArgs, overrides?: TxOverrides) => Promise<EmissionsERC20>` | Deploys a new EmissionsERC20. |
|  [getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static) | `(chainId: number) => Addresses` | Obtain all the addresses deployed in a specific network with a chain ID.<br></br><br></br>*Inherited from [AddressBook.getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static)* |
|  [getChainId](./raincontract.md#getChainId-property-static) | `(signerOrProvider: Signer \| Provider) => Promise<number>` | Get the chain ID from a valid ethers provider.<br></br><br></br>Request to the provider stored in the signer which is the chain ID.<br></br><br></br>*Inherited from [RainContract.getChainId](./raincontract.md#getChainId-property-static)* |
|  [getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static) | `(chainId: number) => string` | Obtain the latest subgraph endpoint related to the version that use the SDK.<br></br><br></br>*Inherited from [AddressBook.getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static)* |
|  [isChild](./emissionserc20.md#isChild-property-static) | `(signer: Signer, maybeChild: string) => Promise<boolean>` | Checks if address is registered as a child contract of this RedeemableERC20Factory on a specific network |
|  [nameBookReference](./emissionserc20.md#nameBookReference-property-static) | `` | Name reference to find the address of the contract in the book address.<br></br><br></br>*Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)* |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [address](./raincontract.md#address-property) | `string` | *Inherited from [RainContract.address](./raincontract.md#address-property)* |
|  [allowance](./emissionserc20.md#allowance-property) | `(owner: string, spender: string, overrides?: ReadTxOverrides) => Promise<BigNumber>` | Returns the remaining number of tokens that `spender` will be allowed to spend on behalf of `owner` through `transferFrom()`<!-- -->. This is zero by default.<br></br><br></br>This value changes when `approve()` or `transferFrom()` are called. |
|  [allowDelegatedClaims](./emissionserc20.md#allowDelegatedClaims-property) | `(overrides?: ReadTxOverrides) => Promise<boolean>` | Whether the claimant must be the caller of `claim`<!-- -->. If `false` then accounts other than claimant can claim. This may or may not be desirable depending on the emissions schedule. For example, a linear schedule will produce the same end result for the claimant regardless of who calls `claim` or when but an exponential schedule is more profitable if the claimant waits longer between claims. In the non-linear case delegated claims would be inappropriate as third party accounts could grief claimants by claiming "early", thus forcing opportunity cost on claimants who would have preferred to wait. |
|  [approve](./emissionserc20.md#approve-property) | `(spender: string, amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Sets `amount` as the allowance of `spender` over the caller's tokens. |
|  [balanceOf](./emissionserc20.md#balanceOf-property) | `(account: string, overrides?: ReadTxOverrides) => Promise<BigNumber>` | Returns the amount of tokens owned by `account`<!-- -->. |
|  [calculateClaim](./emissionserc20.md#calculateClaim-property) | `(claimant: string, overrides?: ReadTxOverrides) => Promise<BigNumber>` | Calculates the claim without processing it. Read only method that may be useful downstream both onchain and offchain if a claimant wants to check the claim amount before deciding whether to process it. As this is read only there are no checks against delegated claims. It is possible to return a value from `calculateClaim` and to not be able to process the claim with `claim` if `msg.sender` is not the `claimant`<!-- -->. |
|  [claim](./emissionserc20.md#claim-property) | `(claimant: string, data: BytesLike, overrides?: TxOverrides) => Promise<ContractTransaction>` | Processes the claim for `claimant_`<!-- -->. - Enforces `allowDelegatedClaims` if it is `true` so that `msg.sender` must also be `claimant_`<!-- -->. - Takes the return from `calculateClaim` and mints for `claimant_`<!-- -->. - Records the current block as the claim-tier for this contract. - emits a `Claim` event as per `IClaim`<!-- -->. |
|  [connect](./emissionserc20.md#connect-property) | `(signer: Signer) => EmissionsERC20` | Connect the current instance to a new signer<br></br><br></br>*Overrides [RainContract.connect](./raincontract.md#connect-property)* |
|  [decimals](./emissionserc20.md#decimals-property) | `(overrides?: ReadTxOverrides) => Promise<number>` | Returns the number of decimals used to get its user representation. |
|  [decreaseAllowance](./emissionserc20.md#decreaseAllowance-property) | `(spender: string, subtractedValue: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Atomically decreases the allowance granted to `spender` by the caller.<br></br><br></br>This is an alternative to `approve()` that can be used as a mitigation for problems described in https://github.com/ethereum/EIPs/issues/20\#issuecomment-263524729. |
|  [increaseAllowance](./emissionserc20.md#increaseAllowance-property) | `(spender: string, addedValue: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Atomically increases the allowance granted to `spender` by the caller.<br></br><br></br>This is an alternative to `approve()` that can be used as a mitigation for problems described in https://github.com/ethereum/EIPs/issues/20\#issuecomment-263524729. |
|  [levels](./tiercontract.md#levels-property) | `typeof Tier` | All the contract tier levels.<br></br><br></br>*Inherited from [TierContract.levels](./tiercontract.md#levels-property)* |
|  [name](./emissionserc20.md#name-property) | `(overrides?: ReadTxOverrides) => Promise<string>` | Returns the name of the token. |
|  [report](./tiercontract.md#report-property) | `(account: string, overrides?: ReadTxOverrides) => Promise<BigNumber>` | A tier report is a `uint256` that contains each of the block numbers each tier has been held continously since as a `uint32`<!-- -->. There are 9 possible tier, starting with tier 0 for `0` offset or "never held any tier" then working up through 8x 4 byte offsets to the full 256 bits.<br></br><br></br>*Inherited from [TierContract.report](./tiercontract.md#report-property)* |
|  [setTier](./emissionserc20.md#setTier-property) | `(account: string, endTier: BigNumberish, data: BytesLike, overrides?: TxOverrides \| undefined) => Promise<never>` | It is NOT implemented in Emissions. Always will throw an error<br></br><br></br>*Overrides [TierContract.setTier](./tiercontract.md#setTier-property)* |
|  [signer](./raincontract.md#signer-property) | `Signer` | *Inherited from [RainContract.signer](./raincontract.md#signer-property)* |
|  [symbol](./emissionserc20.md#symbol-property) | `(overrides?: ReadTxOverrides) => Promise<string>` | Returns the symbol of the token, usually a shorter version of the name. |
|  [totalSupply](./emissionserc20.md#totalSupply-property) | `(overrides?: ReadTxOverrides) => Promise<BigNumber>` | Returns the amount of tokens in existence. |
|  [transfer](./emissionserc20.md#transfer-property) | `(to: string, amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Moves `amount` tokens from the caller's account to `to`<!-- -->.<br></br><br></br>Requirements:<br></br><br></br>- `to` cannot be the zero address. - the caller must have a balance of at least `amount`<!-- -->. |
|  [transferFrom](./emissionserc20.md#transferFrom-property) | `(from: string, to: string, amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Moves `amount` tokens from `from` to `to` using the allowance mechanism. `amount` is then deducted from the caller's allowance.<br></br><br></br>NOTE: Does not update the allowance if the current allowance is the maximum `uint256`<!-- -->.<br></br><br></br>Requirements:<br></br><br></br>- `from` and `to` cannot be the zero address. - `from` must have a balance of at least `amount`<!-- -->. - the caller must have allowance for `from`<!-- -->'s tokens of at least `amount`<!-- -->. |

## Static Methods

|  Method | Description |
|  --- | --- |
|  [\_isChild(signer, maybeChild)](./factorycontract.md#_isChild-method-static-1) | Checks if address is registered as a child contract of the factory in the chain.<br></br><br></br>*Inherited from [FactoryContract.\_isChild()](./factorycontract.md#_isChild-method-static-1)* |
|  [getBookAddress(chainId)](./raincontract.md#getBookAddress-method-static-1) | Get the address stored in the book to this chain<br></br><br></br>*Inherited from [RainContract.getBookAddress()](./raincontract.md#getBookAddress-method-static-1)* |
|  [getNewChildFromReceipt(receipt, parentContract)](./factorycontract.md#getNewChildFromReceipt-method-static-1) | Get the child from a receipt obtain from a Factory transaction<br></br><br></br>*Inherited from [FactoryContract.getNewChildFromReceipt()](./factorycontract.md#getNewChildFromReceipt-method-static-1)* |

## Methods

|  Method | Description |
|  --- | --- |
|  [checkAddress(address, message)](./raincontract.md#checkAddress-method-1) | Check if an address is correctly formatted and throw an error if it is not an valid address<br></br><br></br>*Inherited from [RainContract.checkAddress()](./raincontract.md#checkAddress-method-1)* |
|  [currentTier(account, block)](./tiercontract.md#currentTier-method-1) | Get the current tier of an `account` in the Tier as an expression between `[0 - 8]`<!-- -->. Tier 0 is that a address has never interact with the Tier Contract.<br></br><br></br>*Inherited from [TierContract.currentTier()](./tiercontract.md#currentTier-method-1)* |

## Static Property Details

<a id="deploy-property-static"></a>

### deploy

Deploys a new EmissionsERC20.

<b>Signature:</b>

```typescript
static deploy: (signer: Signer, args: EmissionsERC20DeployArgs, overrides?: TxOverrides) => Promise<EmissionsERC20>;
```

<a id="isChild-property-static"></a>

### isChild

Checks if address is registered as a child contract of this RedeemableERC20Factory on a specific network

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
protected static readonly nameBookReference = "emissionsERC20Factory";
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

<a id="allowDelegatedClaims-property"></a>

### allowDelegatedClaims

Whether the claimant must be the caller of `claim`<!-- -->. If `false` then accounts other than claimant can claim. This may or may not be desirable depending on the emissions schedule. For example, a linear schedule will produce the same end result for the claimant regardless of who calls `claim` or when but an exponential schedule is more profitable if the claimant waits longer between claims. In the non-linear case delegated claims would be inappropriate as third party accounts could grief claimants by claiming "early", thus forcing opportunity cost on claimants who would have preferred to wait.

<b>Signature:</b>

```typescript
readonly allowDelegatedClaims: (overrides?: ReadTxOverrides) => Promise<boolean>;
```

<a id="approve-property"></a>

### approve

Sets `amount` as the allowance of `spender` over the caller's tokens.

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

<a id="calculateClaim-property"></a>

### calculateClaim

Calculates the claim without processing it. Read only method that may be useful downstream both onchain and offchain if a claimant wants to check the claim amount before deciding whether to process it. As this is read only there are no checks against delegated claims. It is possible to return a value from `calculateClaim` and to not be able to process the claim with `claim` if `msg.sender` is not the `claimant`<!-- -->.

<b>Signature:</b>

```typescript
readonly calculateClaim: (claimant: string, overrides?: ReadTxOverrides) => Promise<BigNumber>;
```

<a id="claim-property"></a>

### claim

Processes the claim for `claimant_`<!-- -->. - Enforces `allowDelegatedClaims` if it is `true` so that `msg.sender` must also be `claimant_`<!-- -->. - Takes the return from `calculateClaim` and mints for `claimant_`<!-- -->. - Records the current block as the claim-tier for this contract. - emits a `Claim` event as per `IClaim`<!-- -->.

<b>Signature:</b>

```typescript
readonly claim: (claimant: string, data: BytesLike, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="connect-property"></a>

### connect

Connect the current instance to a new signer

*Overrides [RainContract.connect](./raincontract.md#connect-property)*

<b>Signature:</b>

```typescript
readonly connect: (signer: Signer) => EmissionsERC20;
```

<a id="decimals-property"></a>

### decimals

Returns the number of decimals used to get its user representation.

<b>Signature:</b>

```typescript
readonly decimals: (overrides?: ReadTxOverrides) => Promise<number>;
```

<a id="decreaseAllowance-property"></a>

### decreaseAllowance

Atomically decreases the allowance granted to `spender` by the caller.

This is an alternative to `approve()` that can be used as a mitigation for problems described in https://github.com/ethereum/EIPs/issues/20\#issuecomment-263524729.

<b>Signature:</b>

```typescript
readonly decreaseAllowance: (spender: string, subtractedValue: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="increaseAllowance-property"></a>

### increaseAllowance

Atomically increases the allowance granted to `spender` by the caller.

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

<a id="setTier-property"></a>

### setTier

It is NOT implemented in Emissions. Always will throw an error

*Overrides [TierContract.setTier](./tiercontract.md#setTier-property)*

<b>Signature:</b>

```typescript
readonly setTier: (account: string, endTier: BigNumberish, data: BytesLike, overrides?: TxOverrides | undefined) => Promise<never>;
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

Moves `amount` tokens from the caller's account to `to`<!-- -->.

Requirements:

- `to` cannot be the zero address. - the caller must have a balance of at least `amount`<!-- -->.

<b>Signature:</b>

```typescript
readonly transfer: (to: string, amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="transferFrom-property"></a>

### transferFrom

Moves `amount` tokens from `from` to `to` using the allowance mechanism. `amount` is then deducted from the caller's allowance.

NOTE: Does not update the allowance if the current allowance is the maximum `uint256`<!-- -->.

Requirements:

- `from` and `to` cannot be the zero address. - `from` must have a balance of at least `amount`<!-- -->. - the caller must have allowance for `from`<!-- -->'s tokens of at least `amount`<!-- -->.

<b>Signature:</b>

```typescript
readonly transferFrom: (from: string, to: string, amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>;
```
