
# Class CombineTier

Class for deploying and calling methods on a CombineTier contract, providin easy way to interact with deployed CombineTiers.

Since provide an easy way to deploy CombineTiers using Rain's canonical factories and methods for interacting with an already deployed CombineTier, will reduce the code use to instanciate contract.

The combine tiers implements the `ReadOnlyTier` over RainVM. Allows combining the reports from any other `ITier` contracts referenced in the `ImmutableSource` set at construction. value at the top of the stack after executing the rain script will be used as the return of `report`<!-- -->.

<b>Signature:</b>

```typescript
class CombineTier extends ITierV2 
```

## Example


```typescript
import { CombineTier } from 'rain-sdk'

// Deploy a new CombineTier using the existing factory. Require an ethers signer and the config desired for the CombineTier.
const newCombineTier = await CombineTier.deploy(signer, CombineTierConfigArgs);

// Connect to an existing CombineTier. Required the address and an ethers signer.
const existingCombineTier  = new CombineTier(address, signer)

// With a CombineTier instance, you can call the smart contract methods:
const report = await existingTier.report(address)

// Access to static methods in CombineTier
const accountOP = CombineTier.Opcodes.ACCOUNT;

// Obtaian default AlwaysTier instance with an ethers signer
const alwaysTier = await CombineTier.getAlwaysTier(signer);

```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [deploy](./combinetier.md#deploy-property-static) | `(signer: Signer, args: CombineTierDeployArgs, overrides?: TxOverrides) => Promise<CombineTier>` | Deploy a new CombineTier contract from the factory. |
|  [deployBalanceTier](./combinetier.md#deployBalanceTier-property-static) | `(address: string, type: "erc20" \| "erc721" \| "erc1155", levels: (number \| string)[], signer: Signer, erc20Decimals?: number, tokenId?: BigNumber) => Promise<CombineTier>` | Method to deploy similar to Rain v1 BalanceTier contracts using CombineTier and CombineTier script generator for either of ERC20, ERC721, or ERC1155 tokens |
|  [getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static) | `(chainId: number) => Addresses` | Obtain all the addresses deployed in a specific network with a chain ID.<br></br>*Inherited from [AddressBook.getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static)* |
|  [getAlwaysTier](./combinetier.md#getAlwaysTier-property-static) | `(signer: Signer) => Promise<CombineTier>` | Get an instance of a CombineTier contract that represent an AlwaysTier contract. |
|  [getChainId](./raincontract.md#getChainId-property-static) | `(signerOrProvider: Signer \| Provider) => Promise<number>` | Get the chain ID from a valid ethers provider.<br></br>Request to the provider stored in the signer which is the chain ID.<br></br>*Inherited from [RainContract.getChainId](./raincontract.md#getChainId-property-static)* |
|  [getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static) | `(chainId: number) => string` | Obtain the latest subgraph endpoint related to the version that use the SDK.<br></br>*Inherited from [AddressBook.getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static)* |
|  [isChild](./combinetier.md#isChild-property-static) | `(signer: Signer, maybeChild: string) => Promise<boolean>` | Checks if address is registered as a child contract of this contract in a specific network. |
|  [nameBookReference](./combinetier.md#nameBookReference-property-static) | `string` | Name reference to find the address of the contract in the book address.<br></br>*Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)* |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [address](./raincontract.md#address-property) | `string` | The contract address of the instance.<br></br>*Inherited from [RainContract.address](./raincontract.md#address-property)* |
|  [connect](./combinetier.md#connect-property) | `(signer: Signer) => CombineTier` | Conncect to this CombineTier contract with another signer<br></br>*Overrides [ITierV2.connect](./itierv2.md#connect-property)* |
|  [levels](./itierv2.md#levels-property) | `typeof Tier` | All the contract tier levels availables in all ITier contracts.<br></br>*Inherited from [ITierV2.levels](./itierv2.md#levels-property)* |
|  [packedFunctionPointers](./combinetier.md#packedFunctionPointers-property) | `(overrides?: ReadTxOverrides) => Promise<string>` | Pointers to opcode functions, necessary for being able to read the packedBytes |
|  [report](./itierv2.md#report-property) | `(account: string, context: BigNumberish[], overrides?: ReadTxOverrides) => Promise<BigNumber>` | A tier report is a `uint256` that contains each of the block numbers each tier has been held continously since as a `uint32`<!-- -->.<br></br>*Inherited from [ITierV2.report](./itierv2.md#report-property)* |
|  [reportTimeForTier](./itierv2.md#reportTimeForTier-property) | `(account: string, tier: BigNumberish, context: BigNumberish[], overrides?: ReadTxOverrides) => Promise<BigNumber>` | Same as report but only returns the time for a single tier. Often the implementing contract can calculate a single tier more efficiently than all 8 tiers. If the consumer only needs one or a few tiers it MAY be much cheaper to request only those tiers individually.<br></br>*Inherited from [ITierV2.reportTimeForTier](./itierv2.md#reportTimeForTier-property)* |
|  [signer](./raincontract.md#signer-property) | `Signer` | The ethers signer that is connected to the instance.<br></br>*Inherited from [RainContract.signer](./raincontract.md#signer-property)* |
|  [storageOpcodesRange](./combinetier.md#storageOpcodesRange-property) | `(overrides?: ReadTxOverrides) => Promise<StorageOpcodesRange>` | Returns the pointer and length for combineTier's storage opcodes |
|  [supportsInterface](./combinetier.md#supportsInterface-property) | `(interfaceId_: BytesLike, overrides?: ReadTxOverrides) => Promise<boolean>` |  |

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
|  [currentTier(account, timestamp)](./itierv2.md#currentTier-method-1) | Get the current tier of an `account` in the Tier as an expression between `[0 - 8]`<!-- -->. Tier 0 is that a address has never interact with the Tier Contract.<br></br>*Inherited from [ITierV2.currentTier()](./itierv2.md#currentTier-method-1)* |

## Static Property Details

<a id="deploy-property-static"></a>

### deploy

Deploy a new CombineTier contract from the factory.

Use the factory stored in the book addresses and use the provided signer as deployer. Also obtain the child after creation as a new instance connected to the deployer.

<b>Signature:</b>

```typescript
static deploy: (signer: Signer, args: CombineTierDeployArgs, overrides?: TxOverrides) => Promise<CombineTier>;
```

<a id="deployBalanceTier-property-static"></a>

### deployBalanceTier

Method to deploy similar to Rain v1 BalanceTier contracts using CombineTier and CombineTier script generator for either of ERC20, ERC721, or ERC1155 tokens

A BalanceTier checks a wallet address balance of the token and reports the results as an ALWAYS/NEVER tier.

<b>Signature:</b>

```typescript
static deployBalanceTier: (address: string, type: "erc20" | "erc721" | "erc1155", levels: (number | string)[], signer: Signer, erc20Decimals?: number, tokenId?: BigNumber) => Promise<CombineTier>;
```

#### Example


```typescript
Deploy a new BalanceTier contract using CombineTier class and script generators
const newBalanceTier = CombineTier.deployBalanceTier(address, type, levels, signer)

```

<a id="getAlwaysTier-property-static"></a>

### getAlwaysTier

Get an instance of a CombineTier contract that represent an AlwaysTier contract.

An AlwaysTier is a ITier contract made with a script that set any address with a level tier eight. The ethers signer provided will be connected to the instance and will be used to get the chain ID and search the AlwaysTier deployed in that chain in the book address.

<b>Signature:</b>

```typescript
static getAlwaysTier: (signer: Signer) => Promise<CombineTier>;
```

<a id="isChild-property-static"></a>

### isChild

Checks if address is registered as a child contract of this contract in a specific network.

The methods require a signer that will be used to call to the Factory Contract and ask if the address provided is a child. Also it is necessary to get the current Chain ID using the provider in the signer.

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

<a id="connect-property"></a>

### connect

Conncect to this CombineTier contract with another signer

*Overrides [ITierV2.connect](./itierv2.md#connect-property)*

<b>Signature:</b>

```typescript
readonly connect: (signer: Signer) => CombineTier;
```

<a id="packedFunctionPointers-property"></a>

### packedFunctionPointers

Pointers to opcode functions, necessary for being able to read the packedBytes

<b>Signature:</b>

```typescript
readonly packedFunctionPointers: (overrides?: ReadTxOverrides) => Promise<string>;
```

<a id="storageOpcodesRange-property"></a>

### storageOpcodesRange

Returns the pointer and length for combineTier's storage opcodes

<b>Signature:</b>

```typescript
readonly storageOpcodesRange: (overrides?: ReadTxOverrides) => Promise<StorageOpcodesRange>;
```

<a id="supportsInterface-property"></a>

### supportsInterface


<b>Signature:</b>

```typescript
readonly supportsInterface: (interfaceId_: BytesLike, overrides?: ReadTxOverrides) => Promise<boolean>;
```
