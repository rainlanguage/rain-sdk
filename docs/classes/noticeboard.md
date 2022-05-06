[Home](../index.md) &gt; [NoticeBoard](./noticeboard.md)

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
|  [get](./noticeboard.md#get-property-static) | `(signer: Signer) => Promise<NoticeBoard>` | Create the NoticeBoard instance.<br><br>The function ask to the provider inside of the ethers signer what is the chain identifier to get the address in this chain. |
|  [getChainId](./raincontract.md#getChainId-property-static) | `(signerOrProvider: Signer \| Provider) => Promise<number>` | Get the chain ID from a valid ethers provider.<br><br>Request to the provider stored in the signer which is the chain ID.<br><br><i>Inherited from [RainContract.getChainId](./raincontract.md#getChainId-property-static)</i> |
|  [nameBookReference](./noticeboard.md#nameBookReference-property-static) | `` | Reference to find the address in the book address. Should be implemented and assign it to each subclass<br><br><i>Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)</i> |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [address](./raincontract.md#address-property) | `string` | <i>Inherited from [RainContract.address](./raincontract.md#address-property)</i> |
|  [connect](./noticeboard.md#connect-property) | `(signer: Signer) => NoticeBoard` | Connect the current instance to a new signer<br><br><i>Overrides [RainContract.connect](./raincontract.md#connect-property)</i> |
|  [createNotices](./noticeboard.md#createNotices-property) | `(notices: NoticeStruct[], overrides?: TxOverrides) => Promise<ContractTransaction>` | Anyone can create notices about some subject. The notice is opaque bytes. The indexer/GUI is expected to understand the context to decode/interpret it. The indexer/GUI is strongly recommended to filter out untrusted content. |
|  [signer](./raincontract.md#signer-property) | `Signer` | <i>Inherited from [RainContract.signer](./raincontract.md#signer-property)</i> |

## Static Methods

|  Method | Description |
|  --- | --- |
|  [getBookAddress(chainId)](./raincontract.md#getBookAddress-method-static-1) | Get the address stored in the book to this chain<br><br><i>Inherited from [RainContract.getBookAddress()](./raincontract.md#getBookAddress-method-static-1)</i> |

## Methods

|  Method | Description |
|  --- | --- |
|  [checkAddress(address, message)](./raincontract.md#checkAddress-method-1) | Check if an address is correctly formatted and throw an error if it is not an valid address<br><br><i>Inherited from [RainContract.checkAddress()](./raincontract.md#checkAddress-method-1)</i> |

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

Reference to find the address in the book address. Should be implemented and assign it to each subclass

<i>Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)</i>

<b>Signature:</b>

```typescript
protected static readonly nameBookReference = "noticeBoard";
```

## Property Details

<a id="connect-property"></a>

### connect

Connect the current instance to a new signer

<i>Overrides [RainContract.connect](./raincontract.md#connect-property)</i>

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
