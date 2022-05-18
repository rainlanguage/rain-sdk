
# Class Verify

A class for deploying and calling methods on a Verify.

This class provides an easy way to deploy Verifies using Rain's canonical factories, and methods for interacting with an already deployed Verify.

Trust-minimised contract to record the state of some verification process. When some off-chain identity is to be reified on chain there is inherently some multi-party, multi-faceted trust relationship. For example, the DID (Decentralized Identifiers) specification from W3C outlines that the controller and the subject of an identity are two different entities.

<b>Signature:</b>

```typescript
class Verify extends FactoryContract 
```

## Example


```typescript
import { Verify } from 'rain-sdk'

// To deploy a new Verify, pass an ethers.js Signer, the chainId and the config for the Verify.
const newVerify = await Verify.deploy(signer, chainId, VerifyConfigArgs)

// To connect to an existing Verify just pass the address and an ethers.js Signer.
const existingVerify = new Verify(address, signer)

// Once you have a Verify, you can call the smart contract methods:

```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [deploy](./verify.md#deploy-property-static) | `(signer: Signer, args: VerifyDeployArgs, overrides?: TxOverrides) => Promise<Verify>` | Deploys a new Verify. |
|  [getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static) | `(chainId: number) => Addresses` | Obtain all the addresses deployed in a specific network with a chain ID.<br></br><br></br>*Inherited from [AddressBook.getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static)* |
|  [getChainId](./raincontract.md#getChainId-property-static) | `(signerOrProvider: Signer \| Provider) => Promise<number>` | Get the chain ID from a valid ethers provider.<br></br><br></br>Request to the provider stored in the signer which is the chain ID.<br></br><br></br>*Inherited from [RainContract.getChainId](./raincontract.md#getChainId-property-static)* |
|  [getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static) | `(chainId: number) => string` | Obtain the latest subgraph endpoint related to the version that use the SDK.<br></br><br></br>*Inherited from [AddressBook.getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static)* |
|  [isChild](./verify.md#isChild-property-static) | `(signer: Signer, maybeChild: string) => Promise<boolean>` | Checks if address is registered as a child contract of this VerifyFactory on a specific network |
|  [nameBookReference](./verify.md#nameBookReference-property-static) | `string` | Name reference to find the address of the contract in the book address.<br></br><br></br>*Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)* |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [add](./verify.md#add-property) | `(data: BytesLike, overrides?: TxOverrides) => Promise<ContractTransaction>` | An account adds their own verification evidence. Internally `msg.sender` is used; delegated `add` is not supported. |
|  [address](./raincontract.md#address-property) | `string` | The contract address of the instance.<br></br><br></br>*Inherited from [RainContract.address](./raincontract.md#address-property)* |
|  [approve](./verify.md#approve-property) | `(evidences: Evidence[], overrides?: TxOverrides) => Promise<ContractTransaction>` | An `APPROVER` can review added evidence and approve accounts. Typically many approvals would be submitted in a single call which is more convenient and gas efficient than sending individual transactions for every approval. However, as there are many individual agents acting concurrently and independently this requires that the approval process be infallible so that no individual approval can rollback the entire batch due to the actions of some other approver/banner. It is possible to approve an already approved or banned account. The `Approve` event will always emit but the approved block will only be set if it was previously uninitialized. A banned account will always be seen as banned when calling `statusAtBlock` regardless of the approval block, even if the approval is more recent than the ban. The only way to reset a ban is to remove and reapprove the account. |
|  [APPROVER](./verify.md#APPROVER-property) | `(overrides?: ReadTxOverrides) => Promise<string>` | Role for `APPROVER` |
|  [APPROVER\_ADMIN](./verify.md#APPROVER_ADMIN-property) | `(overrides?: ReadTxOverrides) => Promise<string>` | Admin role for `APPROVER` |
|  [ban](./verify.md#ban-property) | `(evidences: Evidence[], overrides?: TxOverrides) => Promise<ContractTransaction>` | A `BANNER` can ban an added OR approved account. |
|  [BANNER](./verify.md#BANNER-property) | `(overrides?: ReadTxOverrides) => Promise<string>` | Role for `BANNER` |
|  [BANNER\_ADMIN](./verify.md#BANNER_ADMIN-property) | `(overrides?: ReadTxOverrides) => Promise<string>` | Admin role for `BANNER` |
|  [callback](./verify.md#callback-property) | `(overrides?: ReadTxOverrides) => Promise<string>` |  |
|  [connect](./verify.md#connect-property) | `(signer: Signer) => Verify` | Connect the current contract instance to a new ethers signer.<br></br><br></br>*Overrides [RainContract.connect](./raincontract.md#connect-property)* |
|  [DEFAULT\_ADMIN\_ROLE](./verify.md#DEFAULT_ADMIN_ROLE-property) | `(overrides?: ReadTxOverrides) => Promise<string>` | By default, the admin role for all roles is `DEFAULT_ADMIN_ROLE`<!-- -->, which means that only accounts with this role will be able to grant or revoke other roles.<br></br><br></br>WARNING: The `DEFAULT_ADMIN_ROLE` is also its own admin: it has permission to grant and revoke this role. Extra precautions should be taken to secure accounts that have been granted it. |
|  [getRoleAdmin](./verify.md#getRoleAdmin-property) | `(role: BytesLike, overrides?: ReadTxOverrides) => Promise<string>` | Get the admin role that controls `role` |
|  [grantRole](./verify.md#grantRole-property) | `(role: BytesLike, account: string, overrides?: TxOverrides) => Promise<ContractTransaction>` | Grants `role` to `account`<!-- -->.<br></br><br></br>If `account` had not been already granted `role`<!-- -->, emits a RoleGranted event.<br></br><br></br>Require that caller have admin role of `role`<!-- -->. |
|  [hasRole](./verify.md#hasRole-property) | `(role: BytesLike, account: string, overrides?: ReadTxOverrides) => Promise<boolean>` | Check if an `account` have a determined `role` in the Verify Contract. |
|  [remove](./verify.md#remove-property) | `(evidences: Evidence[], overrides?: TxOverrides) => Promise<ContractTransaction>` | A `REMOVER` can scrub state mapping from an account. A malicious account MUST be banned rather than removed. Removal is useful to reset the whole process in case of some mistake. |
|  [REMOVER](./verify.md#REMOVER-property) | `(overrides?: ReadTxOverrides) => Promise<string>` | Role for `REMOVER` |
|  [REMOVER\_ADMIN](./verify.md#REMOVER_ADMIN-property) | `(overrides?: ReadTxOverrides) => Promise<string>` | Admin role for `REMOVER` |
|  [renounceRole](./verify.md#renounceRole-property) | `(role: BytesLike, account: string, overrides?: TxOverrides) => Promise<ContractTransaction>` | Revokes `role` from the calling account.<br></br><br></br>Roles are often managed via grantRole and revokeRole: this function's purpose is to provide a mechanism for accounts to lose their privileges if they are compromised (such as when a trusted device is misplaced).<br></br><br></br>If the calling account had been granted `role`<!-- -->, emits a RoleRevoked event.<br></br><br></br>Requires the caller to be the `account`<!-- -->. |
|  [requestApprove](./verify.md#requestApprove-property) | `(evidences: Evidence[], overrides?: TxOverrides) => Promise<ContractTransaction>` | Any approved address can request some other address be approved. Frivolous requestors SHOULD expect to find themselves banned. |
|  [requestBan](./verify.md#requestBan-property) | `(evidences: Evidence[], overrides?: TxOverrides) => Promise<ContractTransaction>` | Any approved address can request some other address be banned. Frivolous requestors SHOULD expect to find themselves banned. |
|  [requestRemove](./verify.md#requestRemove-property) | `(evidences: Evidence[], overrides?: TxOverrides) => Promise<ContractTransaction>` | Any approved address can request some other address be removed. Frivolous requestors SHOULD expect to find themselves banned. |
|  [revokeRole](./verify.md#revokeRole-property) | `(role: BytesLike, account: string, overrides?: TxOverrides) => Promise<ContractTransaction>` | Revokes `role` from `account`<!-- -->.<br></br><br></br>If `account` had been granted `role`<!-- -->, emits a RoleRevoked event.<br></br><br></br>Require that caller have admin role of `role`<!-- -->. |
|  [signer](./raincontract.md#signer-property) | `Signer` | The ethers signer that is connected to the instance.<br></br><br></br>*Inherited from [RainContract.signer](./raincontract.md#signer-property)* |
|  [state](./verify.md#state-property) | `(account: string, overrides?: ReadTxOverrides) => Promise<VerifyState>` | Typed accessor into states. |
|  [statusAtBlock](./verify.md#statusAtBlock-property) | `(state: VerifyState, blockNumber: BigNumberish, overrides?: ReadTxOverrides) => Promise<BigNumber>` | Derives a single `Status` from a `State` and a reference block number. |
|  [supportsInterface](./verify.md#supportsInterface-property) | `(interfaceId: BytesLike, overrides?: ReadTxOverrides) => Promise<boolean>` | Returns true if this contract implements the interface defined by `interfaceId`<!-- -->. See the corresponding https://eips.ethereum.org/EIPS/eip-165\#how-interfaces-are-identified\[EIP section\] to learn more about how these ids are created. |

## Static Methods

|  Method | Description |
|  --- | --- |
|  [\_isChild(signer, maybeChild)](./factorycontract.md#_isChild-method-static-1) | Checks if address is registered as a child contract of the factory in the chain.<br></br><br></br>*Inherited from [FactoryContract.\_isChild()](./factorycontract.md#_isChild-method-static-1)* |
|  [getBookAddress(chainId)](./raincontract.md#getBookAddress-method-static-1) | Get the address stored in the book for a determined chain if it is available.<br></br><br></br>*Inherited from [RainContract.getBookAddress()](./raincontract.md#getBookAddress-method-static-1)* |
|  [getNewChildFromReceipt(receipt, parentContract)](./factorycontract.md#getNewChildFromReceipt-method-static-1) | Get the child from a receipt obtain from a Factory transaction<br></br><br></br>*Inherited from [FactoryContract.getNewChildFromReceipt()](./factorycontract.md#getNewChildFromReceipt-method-static-1)* |

## Methods

|  Method | Description |
|  --- | --- |
|  [checkAddress(address, message)](./raincontract.md#checkAddress-method-1) | Check if an address is correctly formatted and throw an error if it is not an valid address<br></br><br></br>*Inherited from [RainContract.checkAddress()](./raincontract.md#checkAddress-method-1)* |

## Static Property Details

<a id="deploy-property-static"></a>

### deploy

Deploys a new Verify.

<b>Signature:</b>

```typescript
static deploy: (signer: Signer, args: VerifyDeployArgs, overrides?: TxOverrides) => Promise<Verify>;
```

<a id="isChild-property-static"></a>

### isChild

Checks if address is registered as a child contract of this VerifyFactory on a specific network

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

<a id="add-property"></a>

### add

An account adds their own verification evidence. Internally `msg.sender` is used; delegated `add` is not supported.

<b>Signature:</b>

```typescript
readonly add: (data: BytesLike, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="approve-property"></a>

### approve

An `APPROVER` can review added evidence and approve accounts. Typically many approvals would be submitted in a single call which is more convenient and gas efficient than sending individual transactions for every approval. However, as there are many individual agents acting concurrently and independently this requires that the approval process be infallible so that no individual approval can rollback the entire batch due to the actions of some other approver/banner. It is possible to approve an already approved or banned account. The `Approve` event will always emit but the approved block will only be set if it was previously uninitialized. A banned account will always be seen as banned when calling `statusAtBlock` regardless of the approval block, even if the approval is more recent than the ban. The only way to reset a ban is to remove and reapprove the account.

<b>Signature:</b>

```typescript
readonly approve: (evidences: Evidence[], overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="APPROVER-property"></a>

### APPROVER

Role for `APPROVER`

<b>Signature:</b>

```typescript
readonly APPROVER: (overrides?: ReadTxOverrides) => Promise<string>;
```

<a id="APPROVER_ADMIN-property"></a>

### APPROVER\_ADMIN

Admin role for `APPROVER`

<b>Signature:</b>

```typescript
readonly APPROVER_ADMIN: (overrides?: ReadTxOverrides) => Promise<string>;
```

<a id="ban-property"></a>

### ban

A `BANNER` can ban an added OR approved account.

<b>Signature:</b>

```typescript
readonly ban: (evidences: Evidence[], overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="BANNER-property"></a>

### BANNER

Role for `BANNER`

<b>Signature:</b>

```typescript
readonly BANNER: (overrides?: ReadTxOverrides) => Promise<string>;
```

<a id="BANNER_ADMIN-property"></a>

### BANNER\_ADMIN

Admin role for `BANNER`

<b>Signature:</b>

```typescript
readonly BANNER_ADMIN: (overrides?: ReadTxOverrides) => Promise<string>;
```

<a id="callback-property"></a>

### callback

<b>Signature:</b>

```typescript
readonly callback: (overrides?: ReadTxOverrides) => Promise<string>;
```

<a id="connect-property"></a>

### connect

Connect the current contract instance to a new ethers signer.

*Overrides [RainContract.connect](./raincontract.md#connect-property)*

<b>Signature:</b>

```typescript
readonly connect: (signer: Signer) => Verify;
```

<a id="DEFAULT_ADMIN_ROLE-property"></a>

### DEFAULT\_ADMIN\_ROLE

By default, the admin role for all roles is `DEFAULT_ADMIN_ROLE`<!-- -->, which means that only accounts with this role will be able to grant or revoke other roles.

WARNING: The `DEFAULT_ADMIN_ROLE` is also its own admin: it has permission to grant and revoke this role. Extra precautions should be taken to secure accounts that have been granted it.

<b>Signature:</b>

```typescript
readonly DEFAULT_ADMIN_ROLE: (overrides?: ReadTxOverrides) => Promise<string>;
```

<a id="getRoleAdmin-property"></a>

### getRoleAdmin

Get the admin role that controls `role`

<b>Signature:</b>

```typescript
readonly getRoleAdmin: (role: BytesLike, overrides?: ReadTxOverrides) => Promise<string>;
```

<a id="grantRole-property"></a>

### grantRole

Grants `role` to `account`<!-- -->.

If `account` had not been already granted `role`<!-- -->, emits a RoleGranted event.

Require that caller have admin role of `role`<!-- -->.

<b>Signature:</b>

```typescript
readonly grantRole: (role: BytesLike, account: string, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="hasRole-property"></a>

### hasRole

Check if an `account` have a determined `role` in the Verify Contract.

<b>Signature:</b>

```typescript
readonly hasRole: (role: BytesLike, account: string, overrides?: ReadTxOverrides) => Promise<boolean>;
```

<a id="remove-property"></a>

### remove

A `REMOVER` can scrub state mapping from an account. A malicious account MUST be banned rather than removed. Removal is useful to reset the whole process in case of some mistake.

<b>Signature:</b>

```typescript
readonly remove: (evidences: Evidence[], overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="REMOVER-property"></a>

### REMOVER

Role for `REMOVER`

<b>Signature:</b>

```typescript
readonly REMOVER: (overrides?: ReadTxOverrides) => Promise<string>;
```

<a id="REMOVER_ADMIN-property"></a>

### REMOVER\_ADMIN

Admin role for `REMOVER`

<b>Signature:</b>

```typescript
readonly REMOVER_ADMIN: (overrides?: ReadTxOverrides) => Promise<string>;
```

<a id="renounceRole-property"></a>

### renounceRole

Revokes `role` from the calling account.

Roles are often managed via grantRole and revokeRole: this function's purpose is to provide a mechanism for accounts to lose their privileges if they are compromised (such as when a trusted device is misplaced).

If the calling account had been granted `role`<!-- -->, emits a RoleRevoked event.

Requires the caller to be the `account`<!-- -->.

<b>Signature:</b>

```typescript
readonly renounceRole: (role: BytesLike, account: string, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="requestApprove-property"></a>

### requestApprove

Any approved address can request some other address be approved. Frivolous requestors SHOULD expect to find themselves banned.

<b>Signature:</b>

```typescript
readonly requestApprove: (evidences: Evidence[], overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="requestBan-property"></a>

### requestBan

Any approved address can request some other address be banned. Frivolous requestors SHOULD expect to find themselves banned.

<b>Signature:</b>

```typescript
readonly requestBan: (evidences: Evidence[], overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="requestRemove-property"></a>

### requestRemove

Any approved address can request some other address be removed. Frivolous requestors SHOULD expect to find themselves banned.

<b>Signature:</b>

```typescript
readonly requestRemove: (evidences: Evidence[], overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="revokeRole-property"></a>

### revokeRole

Revokes `role` from `account`<!-- -->.

If `account` had been granted `role`<!-- -->, emits a RoleRevoked event.

Require that caller have admin role of `role`<!-- -->.

<b>Signature:</b>

```typescript
readonly revokeRole: (role: BytesLike, account: string, overrides?: TxOverrides) => Promise<ContractTransaction>;
```

<a id="state-property"></a>

### state

Typed accessor into states.

<b>Signature:</b>

```typescript
readonly state: (account: string, overrides?: ReadTxOverrides) => Promise<VerifyState>;
```

<a id="statusAtBlock-property"></a>

### statusAtBlock

Derives a single `Status` from a `State` and a reference block number.

<b>Signature:</b>

```typescript
readonly statusAtBlock: (state: VerifyState, blockNumber: BigNumberish, overrides?: ReadTxOverrides) => Promise<BigNumber>;
```

<a id="supportsInterface-property"></a>

### supportsInterface

Returns true if this contract implements the interface defined by `interfaceId`<!-- -->. See the corresponding https://eips.ethereum.org/EIPS/eip-165\#how-interfaces-are-identified\[EIP section\] to learn more about how these ids are created.

<b>Signature:</b>

```typescript
readonly supportsInterface: (interfaceId: BytesLike, overrides?: ReadTxOverrides) => Promise<boolean>;
```
