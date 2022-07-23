
# Class SeedDance

A class for calling method on a Rain SeedDance contract.

This class provides an easy way to interact with the SeedDance contract.

<b>Signature:</b>

```typescript
class SeedDance extends RainContract 
```

## Example


```typescript
import { SeedDance } from 'rain-sdk'

const seedDance = await SeedDance.get(signer);
or
const seedDance = new SeedDance(address, signer);

const tx = await seedDance.canRevealUntil(requiredArgs);

```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static) | `(chainId: number) => Addresses` | Obtain all the addresses deployed in a specific network with a chain ID.<br></br>*Inherited from [AddressBook.getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static)* |
|  [getChainId](./raincontract.md#getChainId-property-static) | `(signerOrProvider: Signer \| Provider) => Promise<number>` | Get the chain ID from a valid ethers provider.<br></br>Request to the provider stored in the signer which is the chain ID.<br></br>*Inherited from [RainContract.getChainId](./raincontract.md#getChainId-property-static)* |
|  [getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static) | `(chainId: number) => string` | Obtain the latest subgraph endpoint related to the version that use the SDK.<br></br>*Inherited from [AddressBook.getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static)* |
|  [nameBookReference](./seeddance.md#nameBookReference-property-static) | `string` | Name reference to find the address of the contract in the book address.<br></br>*Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)* |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [address](./raincontract.md#address-property) | `string` | The contract address of the instance.<br></br>*Inherited from [RainContract.address](./raincontract.md#address-property)* |
|  [canRevealUntil](./seeddance.md#canRevealUntil-property) | `(seed_: BigNumberish, start_: BigNumberish, timeBound_: TimeBoundConfig, owner_: string, overrides?: ReadTxOverrides) => Promise<BigNumber>` |  |
|  [connect](./seeddance.md#connect-property) | `(signer: Signer) => SeedDance` | Connect to this SeedDance instance with a new signer<br></br>*Overrides [RainContract.connect](./raincontract.md#connect-property)* |
|  [signer](./raincontract.md#signer-property) | `Signer` | The ethers signer that is connected to the instance.<br></br>*Inherited from [RainContract.signer](./raincontract.md#signer-property)* |

## Static Methods

|  Method | Description |
|  --- | --- |
|  [getBookAddress(chainId)](./raincontract.md#getBookAddress-method-static-1) | Get the address stored in the book for a determined chain if it is available.<br></br>*Inherited from [RainContract.getBookAddress()](./raincontract.md#getBookAddress-method-static-1)* |

## Methods

|  Method | Description |
|  --- | --- |
|  [checkAddress(address, message)](./raincontract.md#checkAddress-method-1) | Check if an address is correctly formatted and throw an error if it is not an valid address<br></br>*Inherited from [RainContract.checkAddress()](./raincontract.md#checkAddress-method-1)* |

## Static Property Details

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

<a id="canRevealUntil-property"></a>

### canRevealUntil


<b>Signature:</b>

```typescript
readonly canRevealUntil: (seed_: BigNumberish, start_: BigNumberish, timeBound_: TimeBoundConfig, owner_: string, overrides?: ReadTxOverrides) => Promise<BigNumber>;
```

<a id="connect-property"></a>

### connect

Connect to this SeedDance instance with a new signer

*Overrides [RainContract.connect](./raincontract.md#connect-property)*

<b>Signature:</b>

```typescript
readonly connect: (signer: Signer) => SeedDance;
```
