[Home](../index.md) &gt; [RainContract](./raincontract.md)

# Class RainContract


<b>Signature:</b>

```typescript
abstract class RainContract 
```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [getChainId](./raincontract.md#getChainId-property-static) | `(signerOrProvider: Signer \| Provider) => Promise<number>` | Get the chain ID from a valid ethers provider.<br><br>Request to the provider stored in the signer which is the chain ID. |
|  [nameBookReference](./raincontract.md#nameBookReference-property-static) | `string` | Reference to find the address in the book address. Should be implemented and assign it to each subclass |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [address](./raincontract.md#address-property) | `string` |  |
|  [connect](./raincontract.md#connect-property) | `(signer: Signer) => RainContract` | Connect the current instance to a new signer |
|  [signer](./raincontract.md#signer-property) | `Signer` |  |

## Static Methods

|  Method | Description |
|  --- | --- |
|  [checkAddress(address, message)](./raincontract.md#checkAddress-method-static-1) | Check if an address is correctly formatted and throw an error if it is not an valid address |
|  [getBookAddress(chainId)](./raincontract.md#getBookAddress-method-static-1) | Get the address stored in the book to this chain |

## Methods

|  Method | Description |
|  --- | --- |
|  [checkAddress(address, message)](./raincontract.md#checkAddress-method-1) | Check if an address is correctly formatted and throw an error if it is not an valid address |

## Static Property Details

<a id="getChainId-property-static"></a>

### getChainId

Get the chain ID from a valid ethers provider.

Request to the provider stored in the signer which is the chain ID.

<b>Signature:</b>

```typescript
static getChainId: (signerOrProvider: Signer | Provider) => Promise<number>;
```

<a id="nameBookReference-property-static"></a>

### nameBookReference

Reference to find the address in the book address. Should be implemented and assign it to each subclass

<b>Signature:</b>

```typescript
protected static readonly nameBookReference: string;
```

## Property Details

<a id="address-property"></a>

### address

<b>Signature:</b>

```typescript
readonly address: string;
```

<a id="connect-property"></a>

### connect

Connect the current instance to a new signer

<b>Signature:</b>

```typescript
abstract readonly connect: (signer: Signer) => RainContract;
```

<a id="signer-property"></a>

### signer

<b>Signature:</b>

```typescript
readonly signer: Signer;
```

## Static Method Details

<a id="checkAddress-method-static-1"></a>

### checkAddress(address, message)

Check if an address is correctly formatted and throw an error if it is not an valid address

<b>Signature:</b>

```typescript
static checkAddress(address: string, message?: string): void;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  address | `string` | address to be evaluated |
|  message | `string` | optional message to throw in case if it's not |

<b>Returns:</b>

`void`

<a id="getBookAddress-method-static-1"></a>

### getBookAddress(chainId)

Get the address stored in the book to this chain

<b>Signature:</b>

```typescript
static getBookAddress(chainId: number): string;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  chainId | `number` | The chain ID where is deployed the contract |

<b>Returns:</b>

`string`

The address for this contract

## Method Details

<a id="checkAddress-method-1"></a>

### checkAddress(address, message)

Check if an address is correctly formatted and throw an error if it is not an valid address

<b>Signature:</b>

```typescript
checkAddress(address: string, message?: string): void;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  address | `string` | address to be evaluated |
|  message | `string` | optional message to throw in case if it's not |

<b>Returns:</b>

`void`

