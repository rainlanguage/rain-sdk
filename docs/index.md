# SDK

## Classes

|  Class | Description |
|  --- | --- |
|  [AddressBook](./classes/addressbook.md) | Class related to handle and obtain all the addresses and tools (like Subgraph) deployed by chain and stored in the SDK. |
|  [CombineTier](./classes/combinetier.md) | Class for deploying and calling methods on a CombineTier contract, providin easy way to interact with deployed CombineTiers. |
|  [EmissionsERC20](./classes/emissionserc20.md) | A class for calling methods on a EmissionsERC20. |
|  [ERC1155](./classes/erc1155.md) | A generic ERC1155 interface to get connected to any ERC1155 address and make transactions. |
|  [ERC20](./classes/erc20.md) | A generic ERC20 interface to get connected to any ERC20 address and make transactions. |
|  [ERC20BalanceTier](./classes/erc20balancetier.md) | A class for deploying and calling methods on a ERC20BalanceTier. |
|  [ERC20TransferTier](./classes/erc20transfertier.md) | A class for deploying and calling methods on a ERC20TransferTier. |
|  [ERC721](./classes/erc721.md) | A generic ERC721 interface to get connected to any ERC721 address and make transactions. |
|  [ERC721BalanceTier](./classes/erc721balancetier.md) | A class for deploying and calling methods on a ERC721BalanceTier. The `ERC721BalanceTier` simply checks the current balance of an erc721 against tier values. As the current balance is always read from the erc721contract directly there is no historical block data. |
|  [FactoryContract](./classes/factorycontract.md) | All contract factory should use this instead of directly Rain contract to take advantage of specific method to factories |
|  [GatedNFT](./classes/gatednft.md) | //TODO: Add doc |
|  [NoticeBoard](./classes/noticeboard.md) | A class for calling method on a NoticeBoard. |
|  [RainContract](./classes/raincontract.md) | //TODO: Add doc |
|  [RedeemableERC20](./classes/redeemableerc20.md) | A class for calling methods on a RedeemableERC20. |
|  [RedeemableERC20ClaimEscrow](./classes/redeemableerc20claimescrow.md) | A class for calling methods on a RedeemableERC20ClaimEscrow. |
|  [Sale](./classes/sale.md) | A class for deploying and calling methods on a Sale. |
|  [TierContract](./classes/tiercontract.md) | Combine the static methods that are present in factories with the ITier instance methods. Should be use to the TierFactories. |
|  [Verify](./classes/verify.md) | A class for deploying and calling methods on a Verify. |
|  [VerifyTier](./classes/verifytier.md) | A class for deploying and calling methods on a VerifyTier.<br></br><br></br>A contract that is `VerifyTier` expects to derive tiers from the time the account was approved by the underlying `Verify` contract. The approval block numbers defer to `State.since` returned from `Verify.state`<!-- -->. |
|  [VM](./classes/vm.md) | //TODO: Add doc |

## Enumerations

|  Enumeration | Description |
|  --- | --- |
|  [AllStandardOps](./enums/allstandardops.md) | All the standard Op Codes |
|  [Tier](./enums/tier.md) | All the contract tier levels availables in all ITier contracts. |
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
|  [OPerand](./types/operand.md) | Parameter that will use to converted to the source.<br></br><br></br>Use an opcode and operand (optional) |
|  [SaleParams](./types/saleparams.md) | The parameters necessaries to use the sale script generator |
|  [SubgraphBook](./types/subgraphbook.md) | Type for index sugbraph endpoints by chain ID. |

