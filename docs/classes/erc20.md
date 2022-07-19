
# Class ERC20

A generic ERC20 interface to get connected to any ERC20 address and make transactions.

The interface only have and provide generic and common methods calls. Remember that any specific method implemented in the contract will NOT be available in this interface. Can get connected to ERC20Snapshot as well.

<b>Signature:</b>

```typescript
class ERC20 
```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [isERC20](./erc20.md#isERC20-property-static) | `(address: string, signer: Signer) => Promise<boolean>` | Check if the address is an IERC20. |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [address](./erc20.md#address-property) | `string` |  |
|  [allowance](./erc20.md#allowance-property) | `(owner: string, spender: string, overrides?: ReadTxOverrides) => Promise<BigNumber>` | Returns the remaining number of tokens that `spender` will be allowed to spend on behalf of `owner` through `transferFrom()`<!-- -->. This is zero by default.<br></br>This value changes when `approve()` or `transferFrom()` are called. |
|  [approve](./erc20.md#approve-property) | `(spender: string, amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Approve spend limit `amount` as the allowance for a `spender` over this tokens. |
|  [attach](./erc20.md#attach-property) | `(address: string) => ERC20` | Create new instance with same signer but different contract address |
|  [balanceOf](./erc20.md#balanceOf-property) | `(account: string, overrides?: ReadTxOverrides) => Promise<BigNumber>` | Returns the amount of tokens owned by `account`<!-- -->. |
|  [balanceOfAt](./erc20.md#balanceOfAt-property) | `(account: string, snapshotId: BigNumberish, overrides?: TxOverrides) => Promise<BigNumber>` | Get the balanceOf the account at the snapshotId |
|  [burn](./erc20.md#burn-property) | `(amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Destroys `amount` tokens from the caller. |
|  [burnFrom](./erc20.md#burnFrom-property) | `(account: string, amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Destroys `amount` tokens from `account`<!-- -->, deducting from the caller's allowance. Requirements:<br></br>- the caller must have allowance for `accounts`<!-- -->'s tokens of at least `amount`<!-- -->. |
|  [connect](./erc20.md#connect-property) | `(signer: Signer) => ERC20` | Connect the current instance of the ERC20 to a new signer |
|  [decimals](./erc20.md#decimals-property) | `(overrides?: ReadTxOverrides) => Promise<number>` | Returns the number of decimals used to get its user representation. |
|  [decreaseAllowance](./erc20.md#decreaseAllowance-property) | `(spender: string, subtractedValue: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Automatically decreases the allowance granted to `spender` for this token.<br></br>This is an alternative to `approve()` that can be used as a mitigation for problems described in https://github.com/ethereum/EIPs/issues/20\#issuecomment-263524729. |
|  [increaseAllowance](./erc20.md#increaseAllowance-property) | `(spender: string, addedValue: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Automically increases the allowance granted to `spender` for this token.<br></br>This is an alternative to `approve()` that can be used as a mitigation for problems described in https://github.com/ethereum/EIPs/issues/20\#issuecomment-263524729. |
|  [name](./erc20.md#name-property) | `(overrides?: ReadTxOverrides) => Promise<string>` | Returns the name of the token. |
|  [signer](./erc20.md#signer-property) | `Signer` |  |
|  [symbol](./erc20.md#symbol-property) | `(overrides?: ReadTxOverrides) => Promise<string>` | Returns the symbol of the token, usually a shorter version of the name. |
|  [totalSupply](./erc20.md#totalSupply-property) | `(overrides?: ReadTxOverrides) => Promise<BigNumber>` | Returns the amount of tokens in existence. |
|  [totalSupplyAt](./erc20.md#totalSupplyAt-property) | `(snapshotId: BigNumberish, overrides?: TxOverrides) => Promise<BigNumber>` | Get the totalSupply at the snapshotId |
|  [transfer](./erc20.md#transfer-property) | `(to: string, amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Moves `amount` of tokens from the caller's account to `to`<!-- -->.<br></br>Requirements:<br></br>- `to` cannot be the zero address. - the caller must have a balance of at least `amount`<!-- -->. |
|  [transferFrom](./erc20.md#transferFrom-property) | `(from: string, to: string, amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Moves `amount` of tokens from `from` to `to` using the allowance mechanism. `amount` is then deducted from the caller's allowance.<br></br>NOTE: Does not update the allowance if the current allowance is the maximum `uint256`<!-- -->.<br></br>Requirements:<br></br>- `from` and `to` cannot be the zero address. - `from` must have a balance of at least `amount`<!-- -->. - the caller must have allowance for `from`<!-- -->'s tokens of at least `amount`<!-- -->. |

## Static Property Details

<a id="isERC20-property-static"></a>

### isERC20

Check if the address is an IERC20.

A valid IERC20 are those contracts that have generics methods in their interface with same signature.

<b>Signature:</b>

```typescript
static isERC20: (address: string, signer: Signer) => Promise<boolean>;
```

## Property Details

<a id="address-property"></a>

### address

<b>Signature:</b>

```typescript
readonly address: string;
```

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

<a id="attach-property"></a>

### attach

Create new instance with same signer but different contract address

<b>Signature:</b>

```typescript
readonly attach: (address: string) => ERC20;
```

<a id="balanceOf-property"></a>

### balanceOf

Returns the amount of tokens owned by `account`<!-- -->.

<b>Signature:</b>

```typescript
readonly balanceOf: (account: string, overrides?: ReadTxOverrides) => Promise<BigNumber>;
```

<a id="balanceOfAt-property"></a>

### balanceOfAt

Get the balanceOf the account at the snapshotId

<b>Signature:</b>

```typescript
readonly balanceOfAt?: (account: string, snapshotId: BigNumberish, overrides?: TxOverrides) => Promise<BigNumber>;
```

<a id="burn-property"></a>

### burn

Destroys `amount` tokens from the caller.

<b>Signature:</b>

```typescript
readonly burn?: (amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="burnFrom-property"></a>

### burnFrom

Destroys `amount` tokens from `account`<!-- -->, deducting from the caller's allowance. Requirements:

- the caller must have allowance for `accounts`<!-- -->'s tokens of at least `amount`<!-- -->.

<b>Signature:</b>

```typescript
readonly burnFrom?: (account: string, amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="connect-property"></a>

### connect

Connect the current instance of the ERC20 to a new signer

<b>Signature:</b>

```typescript
readonly connect: (signer: Signer) => ERC20;
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

Automatically decreases the allowance granted to `spender` for this token.

This is an alternative to `approve()` that can be used as a mitigation for problems described in https://github.com/ethereum/EIPs/issues/20\#issuecomment-263524729.

<b>Signature:</b>

```typescript
readonly decreaseAllowance: (spender: string, subtractedValue: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>;
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

<a id="signer-property"></a>

### signer

<b>Signature:</b>

```typescript
readonly signer: Signer;
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

<a id="totalSupplyAt-property"></a>

### totalSupplyAt

Get the totalSupply at the snapshotId

<b>Signature:</b>

```typescript
readonly totalSupplyAt?: (snapshotId: BigNumberish, overrides?: TxOverrides) => Promise<BigNumber>;
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
