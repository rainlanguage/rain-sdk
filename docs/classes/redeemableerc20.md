
# Class RedeemableERC20

A class for calling methods on a RedeemableERC20.

This is the ERC20 token that is minted and distributed.

During `Phase.ZERO` the token can be traded and so compatible with the Balancer pool mechanics. During `Phase.ONE` the token is frozen and no longer able to be traded on any AMM or transferred directly.

The token can be redeemed during `Phase.ONE` which burns the token in exchange for pro-rata erc20 tokens held by the `RedeemableERC20` contract itself.

The token balances can be used indirectly for other claims, promotions and events as a proof of participation in the original distribution by token holders.

The token can optionally be restricted by the `ITier` contract to only allow receipients with a specified membership status.

This class provides an easy way to interact with RedeemableERC20's.

<b>Signature:</b>

```typescript
class RedeemableERC20 extends FactoryContract 
```

## Example


```typescript
import { RedeemableERC20 } from 'rain-sdk';

// To get a instance of an already deployed redeemable, pass the contract address and an ethers.js Signer
const redeemable = new RedeemableERC20(address, signer);

// Check if an address is child from the factory deployed in the current chain.
await RedeemableERC20.isChild(signer, maybeChildAddress);

```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [deploy](./redeemableerc20.md#deploy-property-static) | `(signer: Signer, args: RedeemableERC20DeployArgs, overrides?: TxOverrides) => Promise<RedeemableERC20>` | Deploys a new RedeemableERC20. |
|  [getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static) | `(chainId: number) => Addresses` | Obtain all the addresses deployed in a specific network with a chain ID.<br></br><br></br>*Inherited from [AddressBook.getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static)* |
|  [getChainId](./raincontract.md#getChainId-property-static) | `(signerOrProvider: Signer \| Provider) => Promise<number>` | Get the chain ID from a valid ethers provider.<br></br><br></br>Request to the provider stored in the signer which is the chain ID.<br></br><br></br>*Inherited from [RainContract.getChainId](./raincontract.md#getChainId-property-static)* |
|  [getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static) | `(chainId: number) => string` | Obtain the latest subgraph endpoint related to the version that use the SDK.<br></br><br></br>*Inherited from [AddressBook.getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static)* |
|  [isChild](./redeemableerc20.md#isChild-property-static) | `(signer: Signer, maybeChild: string) => Promise<boolean>` | Checks if address is registered as a child contract of this RedeemableERC20Factory on a specific network |
|  [nameBookReference](./redeemableerc20.md#nameBookReference-property-static) | `` | Name reference to find the address of the contract in the book address.<br></br><br></br>*Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)* |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [address](./raincontract.md#address-property) | `string` | *Inherited from [RainContract.address](./raincontract.md#address-property)* |
|  [allowance](./redeemableerc20.md#allowance-property) | `(owner: string, spender: string, overrides?: ReadTxOverrides) => Promise<BigNumber>` | Returns the remaining number of tokens that `spender` will be allowed to spend on behalf of `owner` through `transferFrom()`<!-- -->. This is zero by default.<br></br><br></br>This value changes when `approve()` or `transferFrom()` are called. |
|  [approve](./redeemableerc20.md#approve-property) | `(spender: string, amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Sets `amount` as the allowance of `spender` over the caller's tokens. |
|  [balanceOf](./redeemableerc20.md#balanceOf-property) | `(account: string, overrides?: ReadTxOverrides) => Promise<BigNumber>` | Returns the amount of tokens owned by `account`<!-- -->. |
|  [blockNumberForPhase](./redeemableerc20.md#blockNumberForPhase-property) | `(phaseBlocks: BigNumberish[], phase: BigNumberish, overrides?: ReadTxOverrides) => Promise<BigNumber>` | Pure function to reduce an array of phase blocks and phase to a specific block number. `Phase.ZERO` will always return block `0`<!-- -->. Every other phase will map to a block number in `phaseBlocks`<!-- -->. |
|  [burn](./redeemableerc20.md#burn-property) | `(amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Destroys `amount` tokens from the caller, reducing the total supply. Emits a `Transfer` event with `to` set to the zero address.<br></br><br></br>Requirements: - Caller MUST have at least `amount` tokens. |
|  [burnFrom](./redeemableerc20.md#burnFrom-property) | `(account: string, amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Destroys `amount` tokens from `account`<!-- -->, deducting from the caller's allowance.<br></br><br></br>Requirements: - The caller must have allowance for `accounts`<!-- -->'s tokens of at least `amount`<!-- -->. |
|  [connect](./redeemableerc20.md#connect-property) | `(signer: Signer) => RedeemableERC20` | Connect the current instance to a new signer<br></br><br></br>*Overrides [RainContract.connect](./raincontract.md#connect-property)* |
|  [currentPhase](./redeemableerc20.md#currentPhase-property) | `(overrides?: ReadTxOverrides) => Promise<BigNumber>` | Impure read-only function to return the "current" phase from internal contract state. Simply wraps `phaseAtBlockNumber` for current values of `phaseBlocks` and `block.number`<!-- -->. |
|  [decimals](./redeemableerc20.md#decimals-property) | `(overrides?: ReadTxOverrides) => Promise<number>` | Returns the number of decimals used to get its user representation. |
|  [decreaseAllowance](./redeemableerc20.md#decreaseAllowance-property) | `(spender: string, subtractedValue: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Atomically decreases the allowance granted to `spender` by the caller.<br></br><br></br>This is an alternative to `approve()` that can be used as a mitigation for problems described in https://github.com/ethereum/EIPs/issues/20\#issuecomment-263524729. |
|  [endDistribution](./redeemableerc20.md#endDistribution-property) | `(distributor: string, overrides?: TxOverrides) => Promise<ContractTransaction>` | The admin can forward or burn all tokens of a single address to end `PHASE_DISTRIBUTING`<!-- -->.<br></br><br></br>The intent is that during `PHASE_DISTRIBUTING` there is some contract responsible for distributing the tokens.<br></br><br></br>The admin specifies the distributor to end `PHASE_DISTRIBUTING` and the forwarding address set during initialization is used. If the forwarding address is `0` the rTKN will be burned, otherwise the entire balance of the distributor is forwarded to the nominated address. In practical terms the forwarding allows for escrow depositors to receive a prorata claim on unsold rTKN if they forward it to themselves, otherwise raise participants will receive a greater share of the final escrowed tokens due to the burn reducing the total supply.<br></br><br></br>The distributor is NOT set during the constructor because it may not exist at that point. For example, Balancer needs the paired erc20 tokens to exist before the trading pool can be built. |
|  [grantReceiver](./redeemableerc20.md#grantReceiver-property) | `(newReceiver: string, overrides?: TxOverrides) => Promise<ContractTransaction>` | Admin can grant an address receiver rights.<br></br><br></br>Requirements: - Caller have to be the admin |
|  [grantSender](./redeemableerc20.md#grantSender-property) | `(newSender: string, overrides?: TxOverrides) => Promise<ContractTransaction>` | Admin can grant an addres sender rights.<br></br><br></br>Requirements: - Caller have to be the admin |
|  [increaseAllowance](./redeemableerc20.md#increaseAllowance-property) | `(spender: string, addedValue: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Atomically increases the allowance granted to `spender` by the caller.<br></br><br></br>This is an alternative to `approve()` that can be used as a mitigation for problems described in https://github.com/ethereum/EIPs/issues/20\#issuecomment-263524729. |
|  [isReceiver](./redeemableerc20.md#isReceiver-property) | `(maybeReceiver: string, overrides?: ReadTxOverrides) => Promise<boolean>` | Check that an address is a receiver. A sender is also a receiver. |
|  [isSender](./redeemableerc20.md#isSender-property) | `(maybeSender: string, overrides?: ReadTxOverrides) => Promise<boolean>` | Check that an address is a sender. |
|  [minimumTier](./redeemableerc20.md#minimumTier-property) | `(overrides?: ReadTxOverrides) => Promise<BigNumber>` | The minimum status that a user must hold to receive transfers during `Phase.ZERO`<!-- -->. |
|  [name](./redeemableerc20.md#name-property) | `(overrides?: ReadTxOverrides) => Promise<string>` | Returns the name of the token. |
|  [newTreasuryAsset](./redeemableerc20.md#newTreasuryAsset-property) | `(newTreasuryAsset: string, overrides?: TxOverrides) => Promise<ContractTransaction>` | Anon can emit a `TreasuryAsset` event to notify token holders that an asset could be redeemed by burning `RedeemableERC20` tokens.<br></br><br></br>As this is callable by anon the events should be filtered by the indexer to those from trusted entities only. |
|  [phaseAtBlockNumber](./redeemableerc20.md#phaseAtBlockNumber-property) | `(phaseBlocks: BigNumberish[], blockNumber: BigNumberish, overrides?: ReadTxOverrides) => Promise<BigNumber>` | Pure function to reduce an array of phase blocks and block number to a specific `Phase`<!-- -->.<br></br><br></br>The phase will be the highest attained even if several phases have the same block number.<br></br><br></br>If every phase block is after the block number then `0` is returned.<br></br><br></br>If every phase block is before the block number then `MAX_PHASE` is returned. |
|  [phaseBlocks](./redeemableerc20.md#phaseBlocks-property) | `(index: BigNumberish, overrides?: ReadTxOverrides) => Promise<number>` | Get a phaseBlock |
|  [redeem](./redeemableerc20.md#redeem-property) | `(treasuryAssets: string[], redeemAmount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Burn tokens for a prorata share of the current treasury. The assets to be redeemed for must be specified as an array. This keeps the redeem functionality:<br></br><br></br>- Gas efficient as we avoid tracking assets in storage - Decentralised as any user can deposit any asset to be redeemed - Error resistant as any individual asset reverting can be avoided by redeeming againt sans the problematic asset.<br></br><br></br>It is also a super sharp edge if someone burns their tokens prematurely or with an incorrect asset list. Implementing contracts are strongly encouraged to implement additional safety rails to prevent high value mistakes.<br></br><br></br>Only "vanilla" erc20 token balances are supported as treasury assets. I.e. if the balance is changing such as due to a rebasing token or other mechanism then the WRONG token amounts will be redeemed. The redemption calculation is very simple and naive in that it takes the current balance of this contract of the assets being claimed via redemption to calculate the "prorata" entitlement. If the contract's balance of the claimed token is changing between redemptions (other than due to the redemption itself) then each redemption will send incorrect amounts. |
|  [signer](./raincontract.md#signer-property) | `Signer` | *Inherited from [RainContract.signer](./raincontract.md#signer-property)* |
|  [symbol](./redeemableerc20.md#symbol-property) | `(overrides?: ReadTxOverrides) => Promise<string>` | Returns the symbol of the token, usually a shorter version of the name. |
|  [tier](./redeemableerc20.md#tier-property) | `(overrides?: ReadTxOverrides) => Promise<string>` | Tier contract that produces the report that `minimumTier` is checked against. |
|  [totalSupply](./redeemableerc20.md#totalSupply-property) | `(overrides?: ReadTxOverrides) => Promise<BigNumber>` | Returns the amount of tokens in existence. |
|  [transfer](./redeemableerc20.md#transfer-property) | `(to: string, amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Moves `amount` tokens from the caller's account to `to`<!-- -->.<br></br><br></br>Requirements:<br></br><br></br>- `to` cannot be the zero address. - the caller must have a balance of at least `amount`<!-- -->. |
|  [transferFrom](./redeemableerc20.md#transferFrom-property) | `(from: string, to: string, amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Moves `amount` tokens from `from` to `to` using the allowance mechanism. `amount` is then deducted from the caller's allowance.<br></br><br></br>NOTE: Does not update the allowance if the current allowance is the maximum `uint256`<!-- -->.<br></br><br></br>Requirements:<br></br><br></br>- `from` and `to` cannot be the zero address. - `from` must have a balance of at least `amount`<!-- -->. - the caller must have allowance for `from`<!-- -->'s tokens of at least `amount`<!-- -->. |

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

## Static Property Details

<a id="deploy-property-static"></a>

### deploy

Deploys a new RedeemableERC20.

<b>Signature:</b>

```typescript
static deploy: (signer: Signer, args: RedeemableERC20DeployArgs, overrides?: TxOverrides) => Promise<RedeemableERC20>;
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
protected static readonly nameBookReference = "redeemableERC20Factory";
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

<a id="blockNumberForPhase-property"></a>

### blockNumberForPhase

Pure function to reduce an array of phase blocks and phase to a specific block number. `Phase.ZERO` will always return block `0`<!-- -->. Every other phase will map to a block number in `phaseBlocks`<!-- -->.

<b>Signature:</b>

```typescript
readonly blockNumberForPhase: (phaseBlocks: BigNumberish[], phase: BigNumberish, overrides?: ReadTxOverrides) => Promise<BigNumber>;
```

<a id="burn-property"></a>

### burn

Destroys `amount` tokens from the caller, reducing the total supply. Emits a `Transfer` event with `to` set to the zero address.

Requirements: - Caller MUST have at least `amount` tokens.

<b>Signature:</b>

```typescript
readonly burn: (amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="burnFrom-property"></a>

### burnFrom

Destroys `amount` tokens from `account`<!-- -->, deducting from the caller's allowance.

Requirements: - The caller must have allowance for `accounts`<!-- -->'s tokens of at least `amount`<!-- -->.

<b>Signature:</b>

```typescript
readonly burnFrom: (account: string, amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="connect-property"></a>

### connect

Connect the current instance to a new signer

*Overrides [RainContract.connect](./raincontract.md#connect-property)*

<b>Signature:</b>

```typescript
readonly connect: (signer: Signer) => RedeemableERC20;
```

<a id="currentPhase-property"></a>

### currentPhase

Impure read-only function to return the "current" phase from internal contract state. Simply wraps `phaseAtBlockNumber` for current values of `phaseBlocks` and `block.number`<!-- -->.

<b>Signature:</b>

```typescript
readonly currentPhase: (overrides?: ReadTxOverrides) => Promise<BigNumber>;
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

<a id="endDistribution-property"></a>

### endDistribution

The admin can forward or burn all tokens of a single address to end `PHASE_DISTRIBUTING`<!-- -->.

The intent is that during `PHASE_DISTRIBUTING` there is some contract responsible for distributing the tokens.

The admin specifies the distributor to end `PHASE_DISTRIBUTING` and the forwarding address set during initialization is used. If the forwarding address is `0` the rTKN will be burned, otherwise the entire balance of the distributor is forwarded to the nominated address. In practical terms the forwarding allows for escrow depositors to receive a prorata claim on unsold rTKN if they forward it to themselves, otherwise raise participants will receive a greater share of the final escrowed tokens due to the burn reducing the total supply.

The distributor is NOT set during the constructor because it may not exist at that point. For example, Balancer needs the paired erc20 tokens to exist before the trading pool can be built.

<b>Signature:</b>

```typescript
readonly endDistribution: (distributor: string, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="grantReceiver-property"></a>

### grantReceiver

Admin can grant an address receiver rights.

Requirements: - Caller have to be the admin

<b>Signature:</b>

```typescript
readonly grantReceiver: (newReceiver: string, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="grantSender-property"></a>

### grantSender

Admin can grant an addres sender rights.

Requirements: - Caller have to be the admin

<b>Signature:</b>

```typescript
readonly grantSender: (newSender: string, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="increaseAllowance-property"></a>

### increaseAllowance

Atomically increases the allowance granted to `spender` by the caller.

This is an alternative to `approve()` that can be used as a mitigation for problems described in https://github.com/ethereum/EIPs/issues/20\#issuecomment-263524729.

<b>Signature:</b>

```typescript
readonly increaseAllowance: (spender: string, addedValue: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="isReceiver-property"></a>

### isReceiver

Check that an address is a receiver. A sender is also a receiver.

<b>Signature:</b>

```typescript
readonly isReceiver: (maybeReceiver: string, overrides?: ReadTxOverrides) => Promise<boolean>;
```

<a id="isSender-property"></a>

### isSender

Check that an address is a sender.

<b>Signature:</b>

```typescript
readonly isSender: (maybeSender: string, overrides?: ReadTxOverrides) => Promise<boolean>;
```

<a id="minimumTier-property"></a>

### minimumTier

The minimum status that a user must hold to receive transfers during `Phase.ZERO`<!-- -->.

<b>Signature:</b>

```typescript
readonly minimumTier: (overrides?: ReadTxOverrides) => Promise<BigNumber>;
```

<a id="name-property"></a>

### name

Returns the name of the token.

<b>Signature:</b>

```typescript
readonly name: (overrides?: ReadTxOverrides) => Promise<string>;
```

<a id="newTreasuryAsset-property"></a>

### newTreasuryAsset

Anon can emit a `TreasuryAsset` event to notify token holders that an asset could be redeemed by burning `RedeemableERC20` tokens.

As this is callable by anon the events should be filtered by the indexer to those from trusted entities only.

<b>Signature:</b>

```typescript
readonly newTreasuryAsset: (newTreasuryAsset: string, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="phaseAtBlockNumber-property"></a>

### phaseAtBlockNumber

Pure function to reduce an array of phase blocks and block number to a specific `Phase`<!-- -->.

The phase will be the highest attained even if several phases have the same block number.

If every phase block is after the block number then `0` is returned.

If every phase block is before the block number then `MAX_PHASE` is returned.

<b>Signature:</b>

```typescript
readonly phaseAtBlockNumber: (phaseBlocks: BigNumberish[], blockNumber: BigNumberish, overrides?: ReadTxOverrides) => Promise<BigNumber>;
```

<a id="phaseBlocks-property"></a>

### phaseBlocks

Get a phaseBlock

<b>Signature:</b>

```typescript
readonly phaseBlocks: (index: BigNumberish, overrides?: ReadTxOverrides) => Promise<number>;
```

<a id="redeem-property"></a>

### redeem

Burn tokens for a prorata share of the current treasury. The assets to be redeemed for must be specified as an array. This keeps the redeem functionality:

- Gas efficient as we avoid tracking assets in storage - Decentralised as any user can deposit any asset to be redeemed - Error resistant as any individual asset reverting can be avoided by redeeming againt sans the problematic asset.

It is also a super sharp edge if someone burns their tokens prematurely or with an incorrect asset list. Implementing contracts are strongly encouraged to implement additional safety rails to prevent high value mistakes.

Only "vanilla" erc20 token balances are supported as treasury assets. I.e. if the balance is changing such as due to a rebasing token or other mechanism then the WRONG token amounts will be redeemed. The redemption calculation is very simple and naive in that it takes the current balance of this contract of the assets being claimed via redemption to calculate the "prorata" entitlement. If the contract's balance of the claimed token is changing between redemptions (other than due to the redemption itself) then each redemption will send incorrect amounts.

<b>Signature:</b>

```typescript
readonly redeem: (treasuryAssets: string[], redeemAmount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="symbol-property"></a>

### symbol

Returns the symbol of the token, usually a shorter version of the name.

<b>Signature:</b>

```typescript
readonly symbol: (overrides?: ReadTxOverrides) => Promise<string>;
```

<a id="tier-property"></a>

### tier

Tier contract that produces the report that `minimumTier` is checked against.

<b>Signature:</b>

```typescript
readonly tier: (overrides?: ReadTxOverrides) => Promise<string>;
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
