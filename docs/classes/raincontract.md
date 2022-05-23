
# Class RainContract

//TODO: Add doc

<b>Signature:</b>

```typescript
abstract class RainContract extends AddressBook 
```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static) | `(chainId: number) => Addresses` | Obtain all the addresses deployed in a specific network with a chain ID.<br></br>*Inherited from [AddressBook.getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static)* |
|  [getChainId](./raincontract.md#getChainId-property-static) | `(signerOrProvider: Signer \| Provider) => Promise<number>` | Get the chain ID from a valid ethers provider.<br></br>Request to the provider stored in the signer which is the chain ID. |
|  [getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static) | `(chainId: number) => string` | Obtain the latest subgraph endpoint related to the version that use the SDK.<br></br>*Inherited from [AddressBook.getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static)* |
|  [nameBookReference](./raincontract.md#nameBookReference-property-static) | `string` | Name reference to find the address of the contract in the book address. |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [address](./raincontract.md#address-property) | `string` | The contract address of the instance. |
|  [connect](./raincontract.md#connect-property) | `(signer: Signer) => RainContract` | Connect the current contract instance to a new ethers signer. |
|  [signer](./raincontract.md#signer-property) | `Signer` | The ethers signer that is connected to the instance. |

## Static Methods

|  Method | Description |
|  --- | --- |
|  [checkAddress(address, message)](./raincontract.md#checkAddress-method-static-1) | Check if an address is correctly formatted and throw an error if it is not an valid address |
|  [getBookAddress(chainId)](./raincontract.md#getBookAddress-method-static-1) | Get the address stored in the book for a determined chain if it is available. |

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

Name reference to find the address of the contract in the book address.

Should be implemented in each class to find the factory or main address in the book.

<b>Signature:</b>

```typescript
protected static readonly nameBookReference: string;
```

## Property Details

<a id="address-property"></a>

### address

The contract address of the instance.

<b>Signature:</b>

```typescript
readonly address: string;
```

<a id="connect-property"></a>

### connect

Connect the current contract instance to a new ethers signer.

<b>Signature:</b>

```typescript
abstract readonly connect: (signer: Signer) => RainContract;
```

<a id="signer-property"></a>

### signer

The ethers signer that is connected to the instance.

This signer will be used to call and sign the tranasctions.

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

Get the address stored in the book for a determined chain if it is available.

If any address is deployed to the determined chain, an error will be throwed with `No deployed contracts for this chain.`

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

