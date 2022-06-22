# SDK

## Classes

|  Class | Description |
|  --- | --- |
|  [AddressBook](./classes/addressbook.md) | Class related to handle and obtain all the addresses and tools (like Subgraph) deployed by chain and stored in the SDK. |
|  [BuildReport](./classes/buildreport.md) | A class for creating a report-like script which inherits from CombineTierGenerator |
|  [BuyCap](./classes/buycap.md) | The fisrt piece of script in a sale's amount/price pair script which determines the amoount or cap that can be bought. |
|  [CombineTier](./classes/combinetier.md) | Class for deploying and calling methods on a CombineTier contract, providin easy way to interact with deployed CombineTiers. |
|  [CombineTierGenerator](./classes/combinetiergenerator.md) | The script generator for generating CombineTier scripts although it is worth mentioning that the usecases would not be only limited to CombineTier contract and can be used for any script. |
|  [CombineTierJS](./classes/combinetierjs.md) | - The javascript version of CombineTierVM which inherits RainJS with local CombineTier opcodes. |
|  [EmissionsERC20](./classes/emissionserc20.md) | A class for calling methods on a EmissionsERC20. |
|  [EmissionsERC20JS](./classes/emissionserc20js.md) | - The javascript version of EmissionsERC20JS which inherits RainJS with local EmissionsERC20JS opcodes. |
|  [ERC1155](./classes/erc1155.md) | A generic ERC1155 interface to get connected to any ERC1155 address and make transactions. |
|  [ERC20](./classes/erc20.md) | A generic ERC20 interface to get connected to any ERC20 address and make transactions. |
|  [ERC20BalanceTier](./classes/erc20balancetier.md) | class to create a the vmStateConfig for CombineTier as BalanceTier. this will perform similar to ERC20BalancTier in RainVM version 1.0 |
|  [ERC721](./classes/erc721.md) | A generic ERC721 interface to get connected to any ERC721 address and make transactions. |
|  [ERC721BalanceTier](./classes/erc721balancetier.md) | class to create a the vmStateConfig for CombineTier as BalanceTier. this will perform similar to ERC721BalancTier in RainVM version 1.0 |
|  [FactoryContract](./classes/factorycontract.md) | All contract factory should use this instead of directly Rain contract to take advantage of specific method to factories |
|  [FixedPrice](./classes/fixedprice.md) | - A sub-class of PriceCurve for creating a Fixed Price sale type. The price is a constant value over the span of the sale. |
|  [HumanFriendlySource](./classes/humanfriendlysource.md) | The generator of friendly human readable source. |
|  [IncreasingPrice](./classes/increasingprice.md) | - A sub-class of PriceCurve for creating an linear Increasing sale type. |
|  [ITierV2](./classes/itierv2.md) | Class to interact with ITierV2 contracts |
|  [LinearEmissions](./classes/linearemissions.md) | A linear minting emissions over a period of time. holding more before claiming would result in a more reward. |
|  [NoticeBoard](./classes/noticeboard.md) | A class for calling method on a NoticeBoard. |
|  [OrderBook](./classes/orderbook.md) | A class for calling method on a OrderBook. |
|  [PriceCurve](./classes/pricecurve.md) | - PriceCurve is an class that all the other sale types (sub-classes) will inherit from. |
|  [RainContract](./classes/raincontract.md) | //TODO: Add doc |
|  [RainJS](./classes/rainjs.md) | - The javascript version of the RainVM, basically does the same job RainVM does but off-chain. |
|  [RedeemableERC20](./classes/redeemableerc20.md) | A class for calling methods on a RedeemableERC20. |
|  [RedeemableERC20ClaimEscrow](./classes/redeemableerc20claimescrow.md) | A class for calling methods on a RedeemableERC20ClaimEscrow. |
|  [Sale](./classes/sale.md) | A class for deploying and calling methods on a Sale. |
|  [SaleDurationInBlocks](./classes/saledurationinblocks.md) | - A class used for creating a VM state for Sale's canLive StateConfig based on block number. |
|  [SaleDurationInTimestamp](./classes/saledurationintimestamp.md) | - A class used for creating a VM state for Sale's canLive StateConfig based on timestamp. |
|  [SaleJS](./classes/salejs.md) | - The javascript version of SaleVM which inherits RainJS with local Sale opcodes. |
|  [SaleScriptFrom](./classes/salescriptfrom.md) | Builds a sale compatible StateConfig out of 2 individual StateConfigs (canLive and calculateBuy) |
|  [SequentialEmissions](./classes/sequentialemissions.md) | A sequential minting emission, minting can only be done once in every period of time, also can set a max reward with increment over the span of several periods. |
|  [Stake](./classes/stake.md) | A class for calling methods on a Stake. |
|  [TierContract](./classes/tiercontract.md) | Combine the static methods that are present in factories with the ITier instance methods. Should be use to the TierFactories. |
|  [Verify](./classes/verify.md) | A class for deploying and calling methods on a Verify. |
|  [VerifyTier](./classes/verifytier.md) | A class for deploying and calling methods on a VerifyTier.<br></br>A contract that is `VerifyTier` expects to derive tiers from the time the account was approved by the underlying `Verify` contract. The approval block numbers defer to `State.since` returned from `Verify.state`<!-- -->. |
|  [vLBP](./classes/vlbp.md) | - A sub-class of PriceCurve for creating an vLBP i.e virtual LBP sale type. |
|  [VM](./classes/vm.md) | //TODO: Add doc |

## Enumerations

|  Enumeration | Description |
|  --- | --- |
|  [AllStandardOps](./enums/allstandardops.md) | All the standard Op Codes |
|  [BuyCapMode](./enums/buycapmode.md) | Standard cap per wallet modes |
|  [CombineTierContext](./enums/combinetiercontext.md) | Enum for operand of the combineTier's CONTEXT opcode |
|  [CombineTierStorage](./enums/combinetierstorage.md) | Enum for operand of the CombineTier's STORAGE opcode |
|  [Debug](./enums/debug.md) | Enum for DEBUG opcode operands |
|  [EmissionsERC20Context](./enums/emissionserc20context.md) | Enum for operand of the emissionsERC20's CONTEXT opcode |
|  [EmissionsERC20Storage](./enums/emissionserc20storage.md) | Enum for operand of the EmissionsERC20's STORAGE opcode |
|  [OrderbookContext](./enums/orderbookcontext.md) | Enum for operand of the Orderbook's CONTEXT opcode |
|  [OrderbookStroage](./enums/orderbookstroage.md) | Enum for operand of the Orderbook's STORAGE opcode |
|  [SaleContext](./enums/salecontext.md) | Enum for operand of the sale's CONTEXT opcode |
|  [SaleStorage](./enums/salestorage.md) | Enum for operand of the sale's Storage Opcodes |
|  [Tier](./enums/tier.md) | All the contract tier levels availables in all ITier contracts. |
|  [VerifyStatus](./enums/verifystatus.md) | Summary statuses derived from a `State` by comparing the `Since` times against a specific block number. |

## Interfaces

|  Interface | Description |
|  --- | --- |
|  [ApplyOpFn](./interfaces/applyopfn.md) | An interface for creating a key/value pair of custom opcodes functions to override. |
|  [BuyConfig](./interfaces/buyconfig.md) | The configuration that is need it to buy in the sale |
|  [EmissionsERC20DeployArgs](./interfaces/emissionserc20deployargs.md) | Everything required by the `EmissionsERC20` constructor. |
|  [ERC20Config](./interfaces/erc20config.md) | Constructor config for standard Open Zeppelin ERC20. |
|  [Evidence](./interfaces/evidence.md) | Structure of arbitrary evidence to support any action taken. Priviledged roles are expected to provide evidence just as applicants as an audit trail will be preserved permanently in the logs. |
|  [NoticeStruct](./interfaces/noticestruct.md) |  |
|  [ReadTxOverrides](./interfaces/readtxoverrides.md) | More read about `ReadTxOverrides` that comes from CallOverrides of ethers |
|  [Receipt](./interfaces/receipt.md) | The receipt that contain the information of the buy |
|  [RedeemableERC20DeployArgs](./interfaces/redeemableerc20deployargs.md) | Everything required by the `RedeemableERC20` constructor. |
|  [SaleConfig](./interfaces/saleconfig.md) | The configuration of the sale |
|  [SaleDeployArguments](./interfaces/saledeployarguments.md) | Arguments to deploy/create a new Sale |
|  [SaleRedeemableERC20Config](./interfaces/saleredeemableerc20config.md) | Configuration that will have the Redeemable of the Sale |
|  [StateConfig](./interfaces/stateconfig.md) | Config required to build a new `State`<!-- -->. |
|  [StateJS](./interfaces/statejs.md) | - An interface, StateJS is basically javascript version of 'State' struct in RainVM, although it doesn't need stackLength and argumentsLength to operate. It receives a regular RainVM in the constructor and initiates the stack for it and all opcodes do their operations to the stack. |
|  [StorageOpcodesRange](./interfaces/storageopcodesrange.md) | Interface for accessible by vm storage's slots range available for a contract to be used as local opcodes. |
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
|  [BountyConfig](./types/bountyconfig.md) |  |
|  [CombineTierDeployArgs](./types/combinetierdeployargs.md) | The argument of the CombineTier. The StateConfig will be deployed as a pointer under VM State Pointer. |
|  [DepositConfig](./types/depositconfig.md) |  |
|  [EmissionsConfig](./types/emissionsconfig.md) | A type for newing Emissions script |
|  [OpcodeFN](./types/opcodefn.md) | A type for functions to override the default opcodes functions with it. |
|  [OPerand](./types/operand.md) | Parameter that will use to converted to the source.<br></br>Use an opcode and operand (optional) |
|  [Order](./types/order.md) | Order |
|  [OrderBookOpcodes](./types/orderbookopcodes.md) | Type for the opcodes availables in a OrderBook instance. |
|  [OrderConfig](./types/orderconfig.md) |  |
|  [StakeDeployArgs](./types/stakedeployargs.md) |  |
|  [SubgraphBook](./types/subgraphbook.md) | Type for index sugbraph endpoints by chain ID. |
|  [WithdrawConfig](./types/withdrawconfig.md) |  |

