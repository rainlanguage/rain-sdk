[Home](../index.md) &gt; [RedeemableERC20ClaimEscrow](./redeemableerc20claimescrow.md)

# Class RedeemableERC20ClaimEscrow

A class for calling methods on a RedeemableERC20ClaimEscrow.

Escrow contract for ERC20 tokens to be deposited and withdrawn against redeemableERC20 tokens from a specific `Sale`<!-- -->.

When some token is deposited the running total of that token against the trust is incremented by the deposited amount. When some `redeemableERC20` token holder calls `withdraw` they are sent the full balance they have not previously claimed, multiplied by their fraction of the redeemable token supply that they currently hold. As redeemable tokens are frozen after distribution there are no issues with holders manipulating withdrawals by transferring tokens to claim multiple times.

This class provides an easy way to interact with the Escrow Rain

<b>Signature:</b>

```typescript
class RedeemableERC20ClaimEscrow extends RainContract 
```

## Example


```typescript
import { RedeemableERC20ClaimEscrow } from 'rain-sdk'

// If the escrow address is unkwon or want to simplify the process, use get() to create the instance.
// This use the provider inside the signer to get the chainId and search the correct address.
const escrow = RedeemableERC20ClaimEscrow(saleAddress, tokenAddress, ethersSigner);

const tx = escrow.deposit(amount);

```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [get](./redeemableerc20claimescrow.md#get-property-static) | `(saleAddress: string, tokenAddress: string, signer: Signer) => Promise<RedeemableERC20ClaimEscrow>` | Create the RedeemableERC20ClaimEscrow instance.<br></br>The function ask to the provider inside of the ethers signer what is the chain identifier to get the address in this chain. |
|  [getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static) | `(chainId: number) => Addresses` | Obtain all the addresses deployed in a specific network with a chain ID.<br></br><i>Inherited from [AddressBook.getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static)</i> |
|  [getChainId](./raincontract.md#getChainId-property-static) | `(signerOrProvider: Signer \| Provider) => Promise<number>` | Get the chain ID from a valid ethers provider.<br></br>Request to the provider stored in the signer which is the chain ID.<br></br><i>Inherited from [RainContract.getChainId](./raincontract.md#getChainId-property-static)</i> |
|  [getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static) | `(chainId: number) => string` | Obtain the latest subgraph endpoint related to the version that use the SDK.<br></br><i>Inherited from [AddressBook.getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static)</i> |
|  [nameBookReference](./redeemableerc20claimescrow.md#nameBookReference-property-static) | `` | Name reference to find the address of the contract in the book address.<br></br><i>Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)</i> |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [address](./raincontract.md#address-property) | `string` | <i>Inherited from [RainContract.address](./raincontract.md#address-property)</i> |
|  [changeSale](./redeemableerc20claimescrow.md#changeSale-property) | `(newSale: string) => RedeemableERC20ClaimEscrow` | Get a new instance with a different Sale to interact with the Escrow contract |
|  [changeToken](./redeemableerc20claimescrow.md#changeToken-property) | `(newToken: string) => RedeemableERC20ClaimEscrow` | Get a new instance with a different ERC20 to interact with the Escrow contract |
|  [connect](./redeemableerc20claimescrow.md#connect-property) | `(signer: Signer) => RedeemableERC20ClaimEscrow` | Connect the current instance to a new signer<br></br><i>Overrides [RainContract.connect](./raincontract.md#connect-property)</i> |
|  [deposit](./redeemableerc20claimescrow.md#deposit-property) | `(amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Any address can deposit any amount of the token`IERC20` under the `Sale`<!-- -->. The `Sale` MUST be a child of the trusted factory.<br></br>The deposit will be accounted for under both the depositor individually and the trust in aggregate. The aggregate value is used by `withdraw` and the individual value by `undeposit`<!-- -->.<br></br>The depositor is responsible for approving the token for this contract. `deposit` is still enabled after the distribution ends; `undeposit` is always allowed in case of a fail and disabled on success. Multiple `deposit` calls before and after a success result are supported. If a depositor deposits when a raise has failed they will need to undeposit it again manually.<br></br>Delegated `deposit` is not supported. Every depositor is directly responsible for every `deposit`<!-- -->.<br></br>WARNING: As `undeposit` can only be called when the `Sale` reports failure, `deposit` should only be called when the caller is sure the `Sale` will reach a clear success/fail status. For example, when a `Sale` has not yet been seeded it may never even start the raise so depositing at this point is dangerous. If the `Sale` never starts the raise it will never fail the raise either. |
|  [depositPending](./redeemableerc20claimescrow.md#depositPending-property) | `(amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | Depositor can set aside tokens during pending raise status to be swept into a real deposit later.<br></br>The problem with doing a normal deposit while the raise is still active is that the `Sale` will burn all unsold tokens when the raise ends. If we captured the token supply mid-raise then many deposited TKN would be allocated to unsold rTKN. Instead we set aside TKN so that raise participants can be sure that they will be claimable upon raise success but they remain unbound to any rTKN supply until `sweepPending` is called.<br></br>`depositPending` is a one-way function, there is no way to `undeposit` until after the raise fails. Strongly recommended that depositors do NOT call `depositPending` until raise starts, so they know it will also end. |
|  [sale](./redeemableerc20claimescrow.md#sale-property) | `string` | The `ISale` contract address that is used to interact with the Escrow contract. |
|  [signer](./raincontract.md#signer-property) | `Signer` | <i>Inherited from [RainContract.signer](./raincontract.md#signer-property)</i> |
|  [sweepPending](./redeemableerc20claimescrow.md#sweepPending-property) | `(depositor: string, overrides?: TxOverrides) => Promise<ContractTransaction>` | Anon can convert any existing pending deposit to a deposit with known rTKN supply once the escrow has moved out of pending status.<br></br>As `sweepPending` is anon callable, raise participants know that the depositor cannot later prevent a sweep, and depositor knows that raise participants cannot prevent a sweep. As per normal deposits, the output of swept tokens depends on success/fail state allowing `undeposit` or `withdraw` to be called subsequently.<br></br>Partial sweeps are NOT supported, to avoid griefers splitting a deposit across many different `supply_` values. |
|  [token](./redeemableerc20claimescrow.md#token-property) | `string` | The `IERC20` token being deposited and that will be use to interact with the Escrow contract |
|  [undeposit](./redeemableerc20claimescrow.md#undeposit-property) | `(supply: BigNumberish, amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | The inverse of `deposit`<!-- -->.<br></br>In the case of a failed distribution the depositors can claim back any tokens they deposited in the escrow.<br></br>Ideally the distribution is a success and this does not need to be called but it is important that we can walk back deposits and try again for some future raise if needed.<br></br>Delegated `undeposit` is not supported, only the depositor can wind back their original deposit.<br></br>`amount` must be non-zero.<br></br>If several tokens have been deposited against a given trust for the depositor then each token must be individually undeposited. There is no onchain tracking or bulk processing for the depositor, they are expected to know what they have previously deposited and if/when to process an `undeposit`<!-- -->. |
|  [withdraw](./redeemableerc20claimescrow.md#withdraw-property) | `(supply: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>` | The successful handover of a `deposit` to a recipient.<br></br>When a redeemable token distribution is successful the redeemable token holders are automatically and immediately eligible to `withdraw` any and all tokens previously deposited against the relevant `Sale`<!-- -->. The `withdraw` can only happen if/when the relevant `Sale` reaches the success distribution status.<br></br>Delegated `withdraw` is NOT supported. Every redeemable token holder is directly responsible for being aware of and calling `withdraw`<!-- -->. If a redeemable token holder calls `redeem` they also burn their claim on any tokens held in escrow so they MUST first call `withdraw` THEN `redeem`<!-- -->.<br></br>It is expected that the redeemable token holder knows about the tokens that they will be withdrawing. This information is NOT tracked onchain or exposed for bulk processing.<br></br>Partial `withdraw` is not supported, all tokens allocated to the caller are withdrawn. 0 amount withdrawal is an error, if the prorata share of the token being claimed is small enough to round down to 0 then the withdraw will revert.<br></br>Multiple withdrawals across multiple deposits is supported and is equivalent to a single withdraw after all relevant deposits. |

## Static Methods

|  Method | Description |
|  --- | --- |
|  [getBookAddress(chainId)](./raincontract.md#getBookAddress-method-static-1) | Get the address stored in the book to this chain<br></br><i>Inherited from [RainContract.getBookAddress()](./raincontract.md#getBookAddress-method-static-1)</i> |

## Methods

|  Method | Description |
|  --- | --- |
|  [checkAddress(address, message)](./raincontract.md#checkAddress-method-1) | Check if an address is correctly formatted and throw an error if it is not an valid address<br></br><i>Inherited from [RainContract.checkAddress()](./raincontract.md#checkAddress-method-1)</i> |

## Static Property Details

<a id="get-property-static"></a>

### get

Create the RedeemableERC20ClaimEscrow instance.

The function ask to the provider inside of the ethers signer what is the chain identifier to get the address in this chain.

<b>Signature:</b>

```typescript
static get: (saleAddress: string, tokenAddress: string, signer: Signer) => Promise<RedeemableERC20ClaimEscrow>;
```

<a id="nameBookReference-property-static"></a>

### nameBookReference

Name reference to find the address of the contract in the book address.

<i>Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)</i>

Should be implemented in each class to find the factory or main address in the book.

<b>Signature:</b>

```typescript
protected static readonly nameBookReference = "redeemableERC20ClaimEscrow";
```

## Property Details

<a id="changeSale-property"></a>

### changeSale

Get a new instance with a different Sale to interact with the Escrow contract

<b>Signature:</b>

```typescript
readonly changeSale: (newSale: string) => RedeemableERC20ClaimEscrow;
```

<a id="changeToken-property"></a>

### changeToken

Get a new instance with a different ERC20 to interact with the Escrow contract

<b>Signature:</b>

```typescript
readonly changeToken: (newToken: string) => RedeemableERC20ClaimEscrow;
```

<a id="connect-property"></a>

### connect

Connect the current instance to a new signer

<i>Overrides [RainContract.connect](./raincontract.md#connect-property)</i>

<b>Signature:</b>

```typescript
readonly connect: (signer: Signer) => RedeemableERC20ClaimEscrow;
```

<a id="deposit-property"></a>

### deposit

Any address can deposit any amount of the token`IERC20` under the `Sale`<!-- -->. The `Sale` MUST be a child of the trusted factory.

The deposit will be accounted for under both the depositor individually and the trust in aggregate. The aggregate value is used by `withdraw` and the individual value by `undeposit`<!-- -->.

The depositor is responsible for approving the token for this contract. `deposit` is still enabled after the distribution ends; `undeposit` is always allowed in case of a fail and disabled on success. Multiple `deposit` calls before and after a success result are supported. If a depositor deposits when a raise has failed they will need to undeposit it again manually.

Delegated `deposit` is not supported. Every depositor is directly responsible for every `deposit`<!-- -->.

WARNING: As `undeposit` can only be called when the `Sale` reports failure, `deposit` should only be called when the caller is sure the `Sale` will reach a clear success/fail status. For example, when a `Sale` has not yet been seeded it may never even start the raise so depositing at this point is dangerous. If the `Sale` never starts the raise it will never fail the raise either.

<b>Signature:</b>

```typescript
readonly deposit: (amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="depositPending-property"></a>

### depositPending

Depositor can set aside tokens during pending raise status to be swept into a real deposit later.

The problem with doing a normal deposit while the raise is still active is that the `Sale` will burn all unsold tokens when the raise ends. If we captured the token supply mid-raise then many deposited TKN would be allocated to unsold rTKN. Instead we set aside TKN so that raise participants can be sure that they will be claimable upon raise success but they remain unbound to any rTKN supply until `sweepPending` is called.

`depositPending` is a one-way function, there is no way to `undeposit` until after the raise fails. Strongly recommended that depositors do NOT call `depositPending` until raise starts, so they know it will also end.

<b>Signature:</b>

```typescript
readonly depositPending: (amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="sale-property"></a>

### sale

The `ISale` contract address that is used to interact with the Escrow contract.

<b>Signature:</b>

```typescript
readonly sale: string;
```

<a id="sweepPending-property"></a>

### sweepPending

Anon can convert any existing pending deposit to a deposit with known rTKN supply once the escrow has moved out of pending status.

As `sweepPending` is anon callable, raise participants know that the depositor cannot later prevent a sweep, and depositor knows that raise participants cannot prevent a sweep. As per normal deposits, the output of swept tokens depends on success/fail state allowing `undeposit` or `withdraw` to be called subsequently.

Partial sweeps are NOT supported, to avoid griefers splitting a deposit across many different `supply_` values.

<b>Signature:</b>

```typescript
readonly sweepPending: (depositor: string, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="token-property"></a>

### token

The `IERC20` token being deposited and that will be use to interact with the Escrow contract

<b>Signature:</b>

```typescript
readonly token: string;
```

<a id="undeposit-property"></a>

### undeposit

The inverse of `deposit`<!-- -->.

In the case of a failed distribution the depositors can claim back any tokens they deposited in the escrow.

Ideally the distribution is a success and this does not need to be called but it is important that we can walk back deposits and try again for some future raise if needed.

Delegated `undeposit` is not supported, only the depositor can wind back their original deposit.

`amount` must be non-zero.

If several tokens have been deposited against a given trust for the depositor then each token must be individually undeposited. There is no onchain tracking or bulk processing for the depositor, they are expected to know what they have previously deposited and if/when to process an `undeposit`<!-- -->.

<b>Signature:</b>

```typescript
readonly undeposit: (supply: BigNumberish, amount: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="withdraw-property"></a>

### withdraw

The successful handover of a `deposit` to a recipient.

When a redeemable token distribution is successful the redeemable token holders are automatically and immediately eligible to `withdraw` any and all tokens previously deposited against the relevant `Sale`<!-- -->. The `withdraw` can only happen if/when the relevant `Sale` reaches the success distribution status.

Delegated `withdraw` is NOT supported. Every redeemable token holder is directly responsible for being aware of and calling `withdraw`<!-- -->. If a redeemable token holder calls `redeem` they also burn their claim on any tokens held in escrow so they MUST first call `withdraw` THEN `redeem`<!-- -->.

It is expected that the redeemable token holder knows about the tokens that they will be withdrawing. This information is NOT tracked onchain or exposed for bulk processing.

Partial `withdraw` is not supported, all tokens allocated to the caller are withdrawn. 0 amount withdrawal is an error, if the prorata share of the token being claimed is small enough to round down to 0 then the withdraw will revert.

Multiple withdrawals across multiple deposits is supported and is equivalent to a single withdraw after all relevant deposits.

<b>Signature:</b>

```typescript
readonly withdraw: (supply: BigNumberish, overrides?: TxOverrides) => Promise<ContractTransaction>;
```
