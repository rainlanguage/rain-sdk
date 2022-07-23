
# Class AutoApprove

A class for calling method on a Rain AutoApprove contract.

This class provides an easy way to interact with the AutoApprove contract.

<b>Signature:</b>

```typescript
class AutoApprove extends FactoryContract 
```

## Example


```typescript
import { AutoApprove } from 'rain-sdk'

// To deploy a new AutoApprove, pass an ethers.js Signer and the config for the AutoApprove.
const newAutoApprove = await AutoApprove.deploy(signer, stateConfig)

// To connect to an existing AutoApprove just pass the address and an ethers.js Signer.
const existingAutoApprove = new AutoApprove(address, signer)

```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [deploy](./autoapprove.md#deploy-property-static) | `(signer: Signer, autoApproveConfig: StateConfig, overrides?: TxOverrides) => Promise<AutoApprove>` | Deploys a new AutoApprove. |
|  [getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static) | `(chainId: number) => Addresses` | Obtain all the addresses deployed in a specific network with a chain ID.<br></br>*Inherited from [AddressBook.getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static)* |
|  [getChainId](./raincontract.md#getChainId-property-static) | `(signerOrProvider: Signer \| Provider) => Promise<number>` | Get the chain ID from a valid ethers provider.<br></br>Request to the provider stored in the signer which is the chain ID.<br></br>*Inherited from [RainContract.getChainId](./raincontract.md#getChainId-property-static)* |
|  [getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static) | `(chainId: number) => string` | Obtain the latest subgraph endpoint related to the version that use the SDK.<br></br>*Inherited from [AddressBook.getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static)* |
|  [isChild](./autoapprove.md#isChild-property-static) | `(signer: Signer, maybeChild: string) => Promise<boolean>` | Checks if address is registered as a child contract of this AutoApproveFactory on a specific network |
|  [nameBookReference](./autoapprove.md#nameBookReference-property-static) | `string` | Name reference to find the address of the contract in the book address.<br></br>*Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)* |
|  [Opcodes](./autoapprove.md#Opcodes-property-static) | [AutoApproveOps](../types/autoapproveops.md) | All the opcodes avaialbles in the AutoApprove contract. |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [address](./raincontract.md#address-property) | `string` | The contract address of the instance.<br></br>*Inherited from [RainContract.address](./raincontract.md#address-property)* |
|  [afterAdd](./autoapprove.md#afterAdd-property) | <pre>(arg0: string, evidences_: EvidenceConfig[], overrides?: TxOverrides & {&#010;    from?: string \| Promise<string>;&#010;}) => Promise<ContractTransaction></pre> |  |
|  [afterApprove](./autoapprove.md#afterApprove-property) | <pre>(approver_: string, evidences_: EvidenceConfig[], overrides?: TxOverrides & {&#010;    from?: string \| Promise<string>;&#010;}) => Promise<ContractTransaction></pre> |  |
|  [afterBan](./autoapprove.md#afterBan-property) | <pre>(banner_: string, evidences_: EvidenceConfig[], overrides?: TxOverrides & {&#010;    from?: string \| Promise<string>;&#010;}) => Promise<ContractTransaction></pre> |  |
|  [afterRemove](./autoapprove.md#afterRemove-property) | <pre>(remover_: string, evidences_: EvidenceConfig[], overrides?: TxOverrides & {&#010;    from?: string \| Promise<string>;&#010;}) => Promise<ContractTransaction></pre> |  |
|  [connect](./autoapprove.md#connect-property) | `(signer: Signer) => AutoApprove` | Connect to this AutoApprove instance with a new signer<br></br>*Overrides [RainContract.connect](./raincontract.md#connect-property)* |
|  [owner](./autoapprove.md#owner-property) | `(overrides?: ReadTxOverrides) => Promise<string>` |  |
|  [packedFunctionPointers](./autoapprove.md#packedFunctionPointers-property) | `(overrides?: ReadTxOverrides) => Promise<string>` | Pointers to opcode functions, necessary for being able to read the packedBytes |
|  [renounceOwnership](./autoapprove.md#renounceOwnership-property) | <pre>(overrides?: TxOverrides & {&#010;    from?: string \| Promise<string>;&#010;}) => Promise<ContractTransaction></pre> |  |
|  [signer](./raincontract.md#signer-property) | `Signer` | The ethers signer that is connected to the instance.<br></br>*Inherited from [RainContract.signer](./raincontract.md#signer-property)* |
|  [storageOpcodesRange](./autoapprove.md#storageOpcodesRange-property) | `(overrides?: ReadTxOverrides) => Promise<StorageOpcodesRange>` | Returns the pointer and length for AutoApprove's storage opcodes |
|  [transferOwnership](./autoapprove.md#transferOwnership-property) | <pre>(newOwner: string, overrides?: TxOverrides & {&#010;    from?: string \| Promise<string>;&#010;}) => Promise<ContractTransaction></pre> |  |

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

## Static Property Details

<a id="deploy-property-static"></a>

### deploy

Deploys a new AutoApprove.

<b>Signature:</b>

```typescript
static deploy: (signer: Signer, autoApproveConfig: StateConfig, overrides?: TxOverrides) => Promise<AutoApprove>;
```

<a id="isChild-property-static"></a>

### isChild

Checks if address is registered as a child contract of this AutoApproveFactory on a specific network

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

<a id="Opcodes-property-static"></a>

### Opcodes

All the opcodes avaialbles in the AutoApprove contract.

This expose all the standard opcodes along with the specific local AutoApprove opcodes.

<b>Signature:</b>

```typescript
static Opcodes: AutoApproveOps;
```

## Property Details

<a id="afterAdd-property"></a>

### afterAdd


<b>Signature:</b>

```typescript
readonly afterAdd: (arg0: string, evidences_: EvidenceConfig[], overrides?: TxOverrides & {
        from?: string | Promise<string>;
    }) => Promise<ContractTransaction>;
```

<a id="afterApprove-property"></a>

### afterApprove


<b>Signature:</b>

```typescript
readonly afterApprove: (approver_: string, evidences_: EvidenceConfig[], overrides?: TxOverrides & {
        from?: string | Promise<string>;
    }) => Promise<ContractTransaction>;
```

<a id="afterBan-property"></a>

### afterBan


<b>Signature:</b>

```typescript
readonly afterBan: (banner_: string, evidences_: EvidenceConfig[], overrides?: TxOverrides & {
        from?: string | Promise<string>;
    }) => Promise<ContractTransaction>;
```

<a id="afterRemove-property"></a>

### afterRemove


<b>Signature:</b>

```typescript
readonly afterRemove: (remover_: string, evidences_: EvidenceConfig[], overrides?: TxOverrides & {
        from?: string | Promise<string>;
    }) => Promise<ContractTransaction>;
```

<a id="connect-property"></a>

### connect

Connect to this AutoApprove instance with a new signer

*Overrides [RainContract.connect](./raincontract.md#connect-property)*

<b>Signature:</b>

```typescript
readonly connect: (signer: Signer) => AutoApprove;
```

<a id="owner-property"></a>

### owner


<b>Signature:</b>

```typescript
readonly owner: (overrides?: ReadTxOverrides) => Promise<string>;
```

<a id="packedFunctionPointers-property"></a>

### packedFunctionPointers

Pointers to opcode functions, necessary for being able to read the packedBytes

<b>Signature:</b>

```typescript
readonly packedFunctionPointers: (overrides?: ReadTxOverrides) => Promise<string>;
```

<a id="renounceOwnership-property"></a>

### renounceOwnership


<b>Signature:</b>

```typescript
readonly renounceOwnership: (overrides?: TxOverrides & {
        from?: string | Promise<string>;
    }) => Promise<ContractTransaction>;
```

<a id="storageOpcodesRange-property"></a>

### storageOpcodesRange

Returns the pointer and length for AutoApprove's storage opcodes

<b>Signature:</b>

```typescript
readonly storageOpcodesRange: (overrides?: ReadTxOverrides) => Promise<StorageOpcodesRange>;
```

<a id="transferOwnership-property"></a>

### transferOwnership


<b>Signature:</b>

```typescript
readonly transferOwnership: (newOwner: string, overrides?: TxOverrides & {
        from?: string | Promise<string>;
    }) => Promise<ContractTransaction>;
```
