[Home](./index.md)

# rain-sdk

## Classes

|  Class | Description |
|  --- | --- |
|  [AddressBook](./classes/addressbook.md) | Class related to handle and obtain all the addresses and tools (like Subgraph) deployed by chain and stored in the SDK. |
|  [CombineTier](./classes/combinetier.md) | Class for deploying and calling methods on a CombineTier contract, providin easy way to interact with deployed CombineTiers. |
|  [EmissionsERC20](./classes/emissionserc20.md) | A class for calling methods on a EmissionsERC20. |
|  [ERC1155](./classes/erc1155.md) | Generic ERC1155 interface to get connected to any ERC1155 address and make transactions.<br></br>Take in mind that only have generics function calls. |
|  [ERC20](./classes/erc20.md) | Generic ERC20 interface to get connected to any ERC20 address and make transactions.<br></br>Take in mind that only have generics function calls. |
|  [ERC20BalanceTier](./classes/erc20balancetier.md) | A class for deploying and calling methods on a ERC20BalanceTier.<br></br>The `ERC20BalanceTier` simply checks the current balance of an erc20 against tier values. As the current balance is always read from the erc20 contract directly there is no historical block data. |
|  [ERC20TransferTier](./classes/erc20transfertier.md) | A class for deploying and calling methods on a ERC20TransferTier.<br></br>The `ERC20TransferTier` takes ownership of an erc20 balance by transferring erc20 token to itself. The `msg.sender` must pay the difference on upgrade; the tiered address receives refunds on downgrade. This allows users to "gift" tiers to each other. As the transfer is a state changing event we can track historical block times.<br></br>As the tiered address moves up/down tiers it sends/receives the value difference between its current tier only.The user is required to preapprove enough erc20 to cover the tier change or they will fail and lose gas.<br></br>In addition to the standard accounting it requires that users transfer erc20 tokens to achieve a tier. Data is ignored, the only requirement is that the user has approved sufficient balance to gain the next tier. The 8 values for gainable tiers and erc20 contract must be set upon construction and are immutable.<br></br>`⚠️ WARNING:` If a user sends erc20 tokens directly to the contract without calling `setTier` the FUNDS ARE LOST. ⚠️ |
|  [ERC721](./classes/erc721.md) | Generic ERC721 interface to get connected to any ERC721 address and make transactions.<br></br>Take in mind that only have generics function calls. |
|  [ERC721BalanceTier](./classes/erc721balancetier.md) | A class for deploying and calling methods on a ERC721BalanceTier. The `ERC721BalanceTier` simply checks the current balance of an erc721 against tier values. As the current balance is always read from the erc721contract directly there is no historical block data. |
|  [FactoryContract](./classes/factorycontract.md) | All contract factory should use this instead of directly Rain contract to take advantage of specific method to factories |
|  [GatedNFT](./classes/gatednft.md) |  |
|  [NoticeBoard](./classes/noticeboard.md) | A class for calling method on a NoticeBoard. |
|  [RainContract](./classes/raincontract.md) |  |
|  [RedeemableERC20](./classes/redeemableerc20.md) | A class for calling methods on a RedeemableERC20.<br></br>This is the ERC20 token that is minted and distributed.<br></br>During `Phase.ZERO` the token can be traded and so compatible with the Balancer pool mechanics. During `Phase.ONE` the token is frozen and no longer able to be traded on any AMM or transferred directly.<br></br>The token can be redeemed during `Phase.ONE` which burns the token in exchange for pro-rata erc20 tokens held by the `RedeemableERC20` contract itself.<br></br>The token balances can be used indirectly for other claims, promotions and events as a proof of participation in the original distribution by token holders.<br></br>The token can optionally be restricted by the `ITier` contract to only allow receipients with a specified membership status. |
|  [RedeemableERC20ClaimEscrow](./classes/redeemableerc20claimescrow.md) | A class for calling methods on a RedeemableERC20ClaimEscrow.<br></br>Escrow contract for ERC20 tokens to be deposited and withdrawn against redeemableERC20 tokens from a specific `Sale`<!-- -->.<br></br>When some token is deposited the running total of that token against the trust is incremented by the deposited amount. When some `redeemableERC20` token holder calls `withdraw` they are sent the full balance they have not previously claimed, multiplied by their fraction of the redeemable token supply that they currently hold. As redeemable tokens are frozen after distribution there are no issues with holders manipulating withdrawals by transferring tokens to claim multiple times. |
|  [Sale](./classes/sale.md) | A class for deploying and calling methods on a Sale. |
|  [TierContract](./classes/tiercontract.md) | Combine the static methods that are present in factories with the ITier instance methods. Should be use to the TierFactories. |
|  [Verify](./classes/verify.md) | A class for deploying and calling methods on a Verify.<br></br>Trust-minimised contract to record the state of some verification process. When some off-chain identity is to be reified on chain there is inherently some multi-party, multi-faceted trust relationship. For example, the DID (Decentralized Identifiers) specification from W3C outlines that the controller and the subject of an identity are two different entities. |
|  [VerifyTier](./classes/verifytier.md) | A class for deploying and calling methods on a VerifyTier.<br></br>A contract that is `VerifyTier` expects to derive tiers from the time the account was approved by the underlying `Verify` contract. The approval block numbers defer to `State.since` returned from `Verify.state`<!-- -->. |
|  [VM](./classes/vm.md) |  |

## Enumerations

|  Enumeration | Description |
|  --- | --- |
|  [AllStandardOps](./enums/allstandardops.md) | All the standard Op Codes |
|  [Tier](./enums/tier.md) | All the contract tier levels. |
|  [Transferrable](./enums/transferrable.md) | Determine the status about how the GatedNFT contract will handle the transfers |

## Interfaces

|  Interface | Description |
|  --- | --- |
|  [BuyConfig](./interfaces/buyconfig.md) | The configuration that is need it to buy in the sale |
|  [EmissionsERC20DeployArgs](./interfaces/emissionserc20deployargs.md) | Everything required by the `EmissionsERC20` constructor. |
|  [ERC20BalanceTierDeployArgs](./interfaces/erc20balancetierdeployargs.md) | Constructor config for ERC20BalanceTier |
|  [ERC20Config](./interfaces/erc20config.md) | Constructor config for standard Open Zeppelin ERC20. |
|  [ERC20TransferTierDeployArgs](./interfaces/erc20transfertierdeployargs.md) | Constructor config for ERC20TransferTier |
|  [ERC721BalanceTierDeployArgs](./interfaces/erc721balancetierdeployargs.md) | Constructor config for ERC721BalanceTier |
|  [Evidence](./interfaces/evidence.md) | Structure of arbitrary evidence to support any action taken. Priviledged roles are expected to provide evidence just as applicants as an audit trail will be preserved permanently in the logs. |
|  [GatedConfig](./interfaces/gatedconfig.md) | Configuration of the basic information that will be added to the ERC721 NFT |
|  [GatedNFTDeployArguments](./interfaces/gatednftdeployarguments.md) |  |
|  [NoticeStruct](./interfaces/noticestruct.md) |  |
|  [ReadTxOverrides](./interfaces/readtxoverrides.md) | More read about `ReadTxOverrides` that comes from CallOverrides of ethers |
|  [Receipt](./interfaces/receipt.md) | The receipt that contain the information of the buy |
|  [RedeemableERC20DeployArgs](./interfaces/redeemableerc20deployargs.md) | Everything required by the `RedeemableERC20` constructor. |
|  [RoyaltyInfo](./interfaces/royaltyinfo.md) |  |
|  [SaleConfig](./interfaces/saleconfig.md) | The configuration of the sale |
|  [SaleDeployArguments](./interfaces/saledeployarguments.md) | Arguments to deploy/create a new Sale |
|  [SaleRedeemableERC20Config](./interfaces/saleredeemableerc20config.md) | Configuration that will have the Redeemable of the Sale |
|  [State](./interfaces/state.md) | Everything required to evaluate and track the state of a rain script. As this is a struct it will be in memory when passed to `RainVM` and so will be modified by reference internally. This is important for gas efficiency; the stack, arguments and stackIndex will likely be mutated by the running script. |
|  [StateConfig](./interfaces/stateconfig.md) | Config required to build a new `State`<!-- -->. |
|  [TxOverrides](./interfaces/txoverrides.md) | More read about `TxOverrides` that comes from Overrides of ethers |
|  [VerifyDeployArgs](./interfaces/verifydeployargs.md) | Config to initialize a Verify contract with. |
|  [VerifyState](./interfaces/verifystate.md) | Records the block a verify session reaches each status. If a status is not reached it is left as UNINITIALIZED, i.e. 0xFFFFFFFF. Most accounts will never be banned so most accounts will never reach every status, which is a good thing. |

## Namespaces

|  Namespace | Description |
|  --- | --- |
|  [utils](./namespaces/utils.md) |  |

## Type Aliases

|  Type Alias | Description |
|  --- | --- |
|  [Addresses](./types/addresses.md) | Type for all the addresses stored in the Book. |
|  [CombineTierDeployArgs](./types/combinetierdeployargs.md) | The argument of the CombineTier. The StateConfig will be deployed as a pointer under VM State Pointer. |
|  [CombineTierOpcodes](./types/combinetieropcodes.md) | Type for the opcodes availables in a CombineTier instance. |
|  [OPerand](./types/operand.md) | 2 Parameter that will use to converted to the source.<br></br>Use an opcode and operand (optional) |
|  [SaleParams](./types/saleparams.md) |  |
|  [SubgraphBook](./types/subgraphbook.md) | Type for index sugbraph endpoints by chain ID. |

