
# Interface GatedNFTDeployArguments


<b>Signature:</b>

```typescript
interface GatedNFTDeployArguments 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [config](./gatednftdeployarguments.md#config-property) | [GatedConfig](./gatedconfig.md) | Configuration of the basic information that will be added to the ERC721 NFT |
|  [maxMintable](./gatednftdeployarguments.md#maxMintable-property) | `BigNumberish` | Maximun of tokens that will be mint in the contract |
|  [maxPerAddress](./gatednftdeployarguments.md#maxPerAddress-property) | `BigNumberish` | Maximun of mint that is allowed per address |
|  [minimumStatus](./gatednftdeployarguments.md#minimumStatus-property) | `BigNumberish` | Minimum tier required for mints and transfers. Can be '0'. |
|  [royaltyBPS](./gatednftdeployarguments.md#royaltyBPS-property) | `BigNumberish` | The royalty BPS |
|  [royaltyRecipient](./gatednftdeployarguments.md#royaltyRecipient-property) | `string` | The royalty recipient |
|  [tier](./gatednftdeployarguments.md#tier-property) | `string` | Tier contract to compare statuses against on any transaction. |
|  [transferrable](./gatednftdeployarguments.md#transferrable-property) | [Transferrable](../enums/transferrable.md) | Determine the status about how the GatedNFT contract will handle the transfers |

## Property Details

<a id="config-property"></a>

### config

Configuration of the basic information that will be added to the ERC721 NFT

<b>Signature:</b>

```typescript
config: GatedConfig;
```

<a id="maxMintable-property"></a>

### maxMintable

Maximun of tokens that will be mint in the contract

<b>Signature:</b>

```typescript
maxMintable: BigNumberish;
```

<a id="maxPerAddress-property"></a>

### maxPerAddress

Maximun of mint that is allowed per address

<b>Signature:</b>

```typescript
maxPerAddress: BigNumberish;
```

<a id="minimumStatus-property"></a>

### minimumStatus

Minimum tier required for mints and transfers. Can be '0'.

<b>Signature:</b>

```typescript
minimumStatus: BigNumberish;
```

<a id="royaltyBPS-property"></a>

### royaltyBPS

The royalty BPS

<b>Signature:</b>

```typescript
royaltyBPS: BigNumberish;
```

<a id="royaltyRecipient-property"></a>

### royaltyRecipient

The royalty recipient

<b>Signature:</b>

```typescript
royaltyRecipient: string;
```

<a id="tier-property"></a>

### tier

Tier contract to compare statuses against on any transaction.

<b>Signature:</b>

```typescript
tier: string;
```

<a id="transferrable-property"></a>

### transferrable

Determine the status about how the GatedNFT contract will handle the transfers

<b>Signature:</b>

```typescript
transferrable: Transferrable;
```
