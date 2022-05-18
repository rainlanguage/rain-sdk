
# Class AddressBook

Class related to handle and obtain all the addresses and tools (like Subgraph) deployed by chain and stored in the SDK.

It will get all the addresses deployed and added at the time of the current version. If the class and methods are used directly, the chain ID should be provided directly too.

<b>Signature:</b>

```typescript
class AddressBook 
```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static) | `(chainId: number) => Addresses` | Obtain all the addresses deployed in a specific network with a chain ID. |
|  [getSubgraphEndpoint](./addressbook.md#getSubgraphEndpoint-property-static) | `(chainId: number) => string` | Obtain the latest subgraph endpoint related to the version that use the SDK. |

## Static Property Details

<a id="getAddressesForChainId-property-static"></a>

### getAddressesForChainId

Obtain all the addresses deployed in a specific network with a chain ID.

<b>Signature:</b>

```typescript
static getAddressesForChainId: (chainId: number) => Addresses;
```

<a id="getSubgraphEndpoint-property-static"></a>

### getSubgraphEndpoint

Obtain the latest subgraph endpoint related to the version that use the SDK.

The reason of get just one endpoint by version is correctly match with the contract addresses provided by the SDK.

You can search all the rain protocol subgraphs deployed using the search bar in https://thegraph.com/hosted-service/. Remember to look by subgraph deployed by beehive-innovation or trusted deployers.

<b>Signature:</b>

```typescript
static getSubgraphEndpoint: (chainId: number) => string;
```
