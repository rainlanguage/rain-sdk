
# Class NoticeBoard

A class for calling method on a NoticeBoard.

Anyone can emit a `Notice`<!-- -->.

This is open ended content related to the subject. Some examples: - Raise descriptions/promises - Reviews/comments from token holders - Simple onchain voting/signalling

GUIs/tooling/indexers reading this data are expected to know how to interpret it in context because the `NoticeBoard` contract does not.

<b>Signature:</b>

```typescript
class NoticeBoard extends RainContract 
```

## Example


```typescript
import { NoticeBoard } from 'rain-sdk'

const notice = new NoticeBoard(address, signer);

const noticeArg = {
  subject: signer.address; // Subject can be any address
  data: "0x00"; // Can be any data
}

const tx = await notice.createNotices([noticeArg]);

```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [get](./noticeboard.md#get-property-static) | `(signer: Signer) => Promise<NoticeBoard>` | Create the NoticeBoard instance.<br></br><br></br>The function ask to the provider inside of the ethers signer what is the chain identifier to get the address in this chain. |
|  [getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static) | `(chainId: number) => Addresses` | Obtain all the addresses deployed in a specific network with a chain ID.<br></br><br></br>*Inherited from [AddressBook.getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static)* |
|  [getChainId](./raincontract.md#getChainId-property-static) | `(signerOrProvider: Signer \| Provider) => Promise<number>` | Get the chain ID from a valid ethers provider.<br></br><br></br>Request to the provider stored in the signer which is the chain ID.<br></br><br></br>*Inherited from [RainContract.getChainId](./raincontract.md#getChainId-property-static)* |
|  [getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static) | `(chainId: number) => string` | Obtain the latest subgraph endpoint related to the version that use the SDK.<br></br><br></br>*Inherited from [AddressBook.getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static)* |
|  [nameBookReference](./noticeboard.md#nameBookReference-property-static) | `string` | Name reference to find the address of the contract in the book address.<br></br><br></br>*Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)* |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [address](./raincontract.md#address-property) | `string` | The contract address of the instance.<br></br><br></br>*Inherited from [RainContract.address](./raincontract.md#address-property)* |
|  [connect](./noticeboard.md#connect-property) | `(signer: Signer) => NoticeBoard` | Connect the current contract instance to a new ethers signer.<br></br><br></br>*Overrides [RainContract.connect](./raincontract.md#connect-property)* |
|  [createNotices](./noticeboard.md#createNotices-property) | `(notices: NoticeStruct[], overrides?: TxOverrides) => Promise<ContractTransaction>` | Anyone can create notices about some subject. The notice is opaque bytes. The indexer/GUI is expected to understand the context to decode/interpret it. The indexer/GUI is strongly recommended to filter out untrusted content. |
|  [signer](./raincontract.md#signer-property) | `Signer` | The ethers signer that is connected to the instance.<br></br><br></br>*Inherited from [RainContract.signer](./raincontract.md#signer-property)* |

## Static Methods

|  Method | Description |
|  --- | --- |
|  [getBookAddress(chainId)](./raincontract.md#getBookAddress-method-static-1) | Get the address stored in the book for a determined chain if it is available.<br></br><br></br>*Inherited from [RainContract.getBookAddress()](./raincontract.md#getBookAddress-method-static-1)* |

## Methods

|  Method | Description |
|  --- | --- |
|  [checkAddress(address, message)](./raincontract.md#checkAddress-method-1) | Check if an address is correctly formatted and throw an error if it is not an valid address<br></br><br></br>*Inherited from [RainContract.checkAddress()](./raincontract.md#checkAddress-method-1)* |

## Static Property Details

<a id="get-property-static"></a>

### get

Create the NoticeBoard instance.

The function ask to the provider inside of the ethers signer what is the chain identifier to get the address in this chain.

<b>Signature:</b>

```typescript
static get: (signer: Signer) => Promise<NoticeBoard>;
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

<a id="connect-property"></a>

### connect

Connect the current contract instance to a new ethers signer.

*Overrides [RainContract.connect](./raincontract.md#connect-property)*

<b>Signature:</b>

```typescript
readonly connect: (signer: Signer) => NoticeBoard;
```

<a id="createNotices-property"></a>

### createNotices

Anyone can create notices about some subject. The notice is opaque bytes. The indexer/GUI is expected to understand the context to decode/interpret it. The indexer/GUI is strongly recommended to filter out untrusted content.

<b>Signature:</b>

```typescript
readonly createNotices: (notices: NoticeStruct[], overrides?: TxOverrides) => Promise<ContractTransaction>;
```
