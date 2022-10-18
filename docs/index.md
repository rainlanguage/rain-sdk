# SDK

## Classes

|  Class | Description |
|  --- | --- |
|  [AddressBook](./classes/addressbook.md) | Class related to handle and obtain all the addresses and tools (like Subgraph) deployed by chain and stored in the SDK. |
|  [BuildReport](./classes/buildreport.md) | A class for creating a report-like script which inherits from CombineTierGenerator |
|  [CombineTier](./classes/combinetier.md) | Class for deploying and calling methods on a CombineTier contract, providin easy way to interact with deployed CombineTiers. |
|  [CombineTierGenerator](./classes/combinetiergenerator.md) | The script generator for generating CombineTier scripts although it is worth mentioning that the usecases would not be only limited to CombineTier contract and can be used for any script. |
|  [CombineTierJS](./classes/combinetierjs.md) | - The javascript version of CombineTierVM which inherits RainJS with local CombineTier opcodes. |
|  [CreateERC20](./classes/createerc20.md) | A class to creat a an ERC20 token with ability to be a faucet. owner can mint extar token if i=the token is not fixed supply. It can be claimed x number of tokens once every number of blocks passed which is defined by the faucet at the time of deployment. |
|  [EmissionsERC20](./classes/emissionserc20.md) | A class for calling methods on a EmissionsERC20. |
|  [EmissionsERC20JS](./classes/emissionserc20js.md) | - The javascript version of EmissionsERC20JS which inherits RainJS with local EmissionsERC20JS opcodes. |
|  [ERC1155](./classes/erc1155.md) | A generic ERC1155 interface to get connected to any ERC1155 address and make transactions. |
|  [ERC20](./classes/erc20.md) | A generic ERC20 interface to get connected to any ERC20 address and make transactions. |
|  [ERC20BalanceTier](./classes/erc20balancetier.md) | A class for deploying and calling methods on a ERC20BalanceTier. |
|  [ERC20TransferTier](./classes/erc20transfertier.md) | A class for deploying and calling methods on a ERC20TransferTier. |
|  [ERC721](./classes/erc721.md) | A generic ERC721 interface to get connected to any ERC721 address and make transactions. |
|  [ERC721BalanceTier](./classes/erc721balancetier.md) | A class for deploying and calling methods on a ERC721BalanceTier. The `ERC721BalanceTier` simply checks the current balance of an erc721 against tier values. As the current balance is always read from the erc721contract directly there is no historical block data. |
|  [FactoryContract](./classes/factorycontract.md) | All contract factory should use this instead of directly Rain contract to take advantage of specific method to factories |
|  [FixedPrice](./classes/fixedprice.md) | - A sub-class of PriceCurve for creating a Fixed Price sale type. The price is a constant value over the span of the sale. |
|  [GatedNFT](./classes/gatednft.md) | A class for calling methods on a GatedNFT. |
|  [HumanFriendlySource](./classes/humanfriendlysource.md) | The generator of human friendly readable source. |
|  [IncreasingPrice](./classes/increasingprice.md) | - A sub-class of PriceCurve for creating an linear Increasing sale type. |
|  [ITier](./classes/itier.md) | Class to interact with ITier contracts |
|  [LinearEmissions](./classes/linearemissions.md) | A linear minting emissions over a period of time. holding more before claiming would result in a more reward. |
|  [NoticeBoard](./classes/noticeboard.md) | A class for calling method on a NoticeBoard. |
|  [PriceCurve](./classes/pricecurve.md) | - PriceCurve is an class that all the other sale types (sub-classes) will inherit from. |
|  [RainContract](./classes/raincontract.md) | Abstract class that contain all the general methods that are requirement for all the Rain contracts to be able to interact correctly. |
|  [RainJS](./classes/rainjs.md) | - The javascript version of the RainVM, basically does the same job RainVM does but off-chain. |
|  [RedeemableERC20](./classes/redeemableerc20.md) | A class for calling methods on a RedeemableERC20. |
|  [RedeemableERC20ClaimEscrow](./classes/redeemableerc20claimescrow.md) | A class for calling methods on a RedeemableERC20ClaimEscrow. |
|  [Sale](./classes/sale.md) | A class for deploying and calling methods on a Sale. |
|  [SaleDurationInBlocks](./classes/saledurationinblocks.md) | - A class used for creating a VM state for Sale's canEnd/StartStateConfig based on block number. |
|  [SaleDurationInTimestamp](./classes/saledurationintimestamp.md) | - A class used for creating a VM state for Sale's canEnd/StartStateConfig based on timestamp. |
|  [SaleJS](./classes/salejs.md) | - The javascript version of SaleVM which inherits RainJS with local Sale opcodes. |
|  [SequentialEmissions](./classes/sequentialemissions.md) | A sequential minting emission, minting can only be done once in every period of time, also can set a max reward with increment over the span of several periods. |
|  [TierContract](./classes/tiercontract.md) | Combine the static methods that are present in factories with the ITier instance methods. Should be use to the TierFactories. |
|  [Verify](./classes/verify.md) | A class for deploying and calling methods on a Verify. |
|  [VerifyTier](./classes/verifytier.md) | A class for deploying and calling methods on a VerifyTier.<br></br>A contract that is `VerifyTier` expects to derive tiers from the time the account was approved by the underlying `Verify` contract. The approval block numbers defer to `State.since` returned from `Verify.state`<!-- -->. |
|  [vLBP](./classes/vlbp.md) | - A sub-class of PriceCurve for creating an vLBP i.e virtual LBP sale type. |
|  [VM](./classes/vm.md) | Class related to hold the some of the common patterns around the Rain VM that are required to interact with it. |

## Enumerations

|  Enumeration | Description |
|  --- | --- |
|  [AllStandardOps](./enums/allstandardops.md) | All the standard Op Codes |
|  [Tier](./enums/tier.md) | All the contract tier levels availables in all ITier contracts. |
|  [Transferrable](./enums/transferrable.md) | Determine the status about how the GatedNFT contract will handle the transfers |
|  [VerifyStatus](./enums/verifystatus.md) | Summary statuses derived from a `State` by comparing the `Since` times against a specific block number. |
|  [WalletCapMode](./enums/walletcapmode.md) | Standard cap per wallet modes |

## Interfaces

|  Interface | Description |
|  --- | --- |
|  [ApplyOpFn](./interfaces/applyopfn.md) | An interface for creating a key/value pair of custom opcodes functions to override. |
|  [BuyConfig](./interfaces/buyconfig.md) | The configuration that is need it to buy in the sale |
|  [EmissionsERC20DeployArgs](./interfaces/emissionserc20deployargs.md) | Everything required by the `EmissionsERC20` constructor. |
|  [ERC20BalanceTierDeployArgs](./interfaces/erc20balancetierdeployargs.md) | Constructor config for ERC20BalanceTier |
|  [ERC20Config](./interfaces/erc20config.md) | Constructor config for standard Open Zeppelin ERC20. |
|  [ERC20TransferTierDeployArgs](./interfaces/erc20transfertierdeployargs.md) | Constructor config for ERC20TransferTier |
|  [ERC721BalanceTierDeployArgs](./interfaces/erc721balancetierdeployargs.md) | Constructor config for ERC721BalanceTier |
|  [Evidence](./interfaces/evidence.md) | Structure of arbitrary evidence to support any action taken. Priviledged roles are expected to provide evidence just as applicants as an audit trail will be preserved permanently in the logs. |
|  [GatedConfig](./interfaces/gatedconfig.md) | Configuration of the basic information that will be added to the ERC721 NFT |
|  [GatedNFTDeployArguments](./interfaces/gatednftdeployarguments.md) |  |
|  [IOpMeta](./interfaces/iopmeta.md) |  |
|  [NoticeStruct](./interfaces/noticestruct.md) |  |
|  [ReadTxOverrides](./interfaces/readtxoverrides.md) | Interface that show the entire values that can be overrides on trasanctions that are read only. |
|  [Receipt](./interfaces/receipt.md) | The receipt that contain the information of the buy |
|  [RedeemableERC20DeployArgs](./interfaces/redeemableerc20deployargs.md) | Everything required by the `RedeemableERC20` constructor. |
|  [RoyaltyInfo](./interfaces/royaltyinfo.md) |  |
|  [SaleConfig](./interfaces/saleconfig.md) | The configuration of the sale |
|  [SaleDeployArguments](./interfaces/saledeployarguments.md) | Arguments to deploy/create a new Sale |
|  [SaleRedeemableERC20Config](./interfaces/saleredeemableerc20config.md) | Configuration that will have the Redeemable of the Sale |
|  [State](./interfaces/state.md) | Everything required to evaluate and track the state of a rain script. As this is a struct it will be in memory when passed to `RainVM` and so will be modified by reference internally. This is important for gas efficiency; the stack, arguments and stackIndex will likely be mutated by the running script. |
|  [StateConfig](./interfaces/stateconfig.md) | Config required to build a new `State`<!-- -->. |
|  [StateJS](./interfaces/statejs.md) | - An interface, StateJS is basically javascript version of 'State' struct in RainVM, although it doesn't need stackLength and argumentsLength to operate. It receives a regular RainVM in the constructor and initiates the stack for it and all opcodes do their operations to the stack. |
|  [TxOverrides](./interfaces/txoverrides.md) | Interface that show the entire values that can be overrides on trasanctions that are change state in chain (write transaction). |
|  [VerifyDeployArgs](./interfaces/verifydeployargs.md) | Config to initialize a Verify contract with. |
|  [VerifyState](./interfaces/verifystate.md) | Records the block a verify session reaches each status. If a status is not reached it is left as UNINITIALIZED, i.e. 0xFFFFFFFF. Most accounts will never be banned so most accounts will never reach every status, which is a good thing. |

## Namespaces

|  Namespace | Description |
|  --- | --- |
|  [utils](./namespaces/utils.md) |  |

## Variables

|  Variable | Description |
|  --- | --- |
|  [CombineTierOpmeta](./variables/combinetieropmeta.md) | CombineTier opmeta |
|  [EmissionERC20Opmeta](./variables/emissionerc20opmeta.md) | EmissoinsERC20 OpMeta |
|  [OpMeta](./variables/opmeta.md) |  |
|  [pnp](./variables/pnp.md) | Class for Opcodes number of stack pushes and pops |
|  [SaleOpmeta](./variables/saleopmeta.md) | Sale opmeta |

## Type Aliases

|  Type Alias | Description |
|  --- | --- |
|  [Addresses](./types/addresses.md) | Type for all the addresses stored in the Book. |
|  [CombineTierDeployArgs](./types/combinetierdeployargs.md) | The argument of the CombineTier. The StateConfig will be deployed as a pointer under VM State Pointer. |
|  [CombineTierOpcodes](./types/combinetieropcodes.md) | Type for the opcodes availables in a CombineTier instance. |
|  [Config](./types/config.md) | Specific the configuration of the generation method |
|  [EmissionsConfig](./types/emissionsconfig.md) | A type for newing Emissions script |
|  [EmissionsERC20Opcodes](./types/emissionserc20opcodes.md) | Type for the opcodes availables in a EmissionsERC20 instance. |
|  [OpcodeFN](./types/opcodefn.md) | A type for functions to override the default opcodes functions with it. |
|  [OPerand](./types/operand.md) | Parameter that will use to converted to the source.<br></br>Use an opcode and operand (optional) |
|  [PrettifyConfig](./types/prettifyconfig.md) | Specifies the configuration of the Prettify method. |
|  [SaleOpcodes](./types/saleopcodes.md) | Type for the opcodes availables in a CombineTier instance. |
|  [SubgraphBook](./types/subgraphbook.md) | Type for index sugbraph endpoints by chain ID. |

