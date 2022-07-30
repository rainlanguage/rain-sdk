# SDK

## Classes

|  Class | Description |
|  --- | --- |
|  [AddressBook](./classes/addressbook.md) | Class related to handle and obtain all the addresses and tools (like Subgraph) deployed by chain and stored in the SDK. |
|  [AutoApprove](./classes/autoapprove.md) | A class for calling method on a Rain AutoApprove contract. |
|  [BetweenBlocks](./classes/betweenblocks.md) | - A class used for creating a VM state for Sale's canLive StateConfig based on block number. |
|  [BetweenTimestamps](./classes/betweentimestamps.md) | - A class used for creating a VM state for Sale's canLive StateConfig based on timestamp. |
|  [BuildReport](./classes/buildreport.md) | A class for creating a report-like script which inherits from CombineTierGenerator |
|  [BuyAmount](./classes/buyamount.md) | The fisrt piece of script in a sale's amount/price pair script which determines the amoount or cap that can be bought. |
|  [CombineTier](./classes/combinetier.md) | Class for deploying and calling methods on a CombineTier contract, providin easy way to interact with deployed CombineTiers. |
|  [CombineTierGenerator](./classes/combinetiergenerator.md) | The script generator for generating CombineTier scripts although it is worth mentioning that the usecases would not be only limited to CombineTier contract and can be used for any script. |
|  [CombineTierJSVM](./classes/combinetierjsvm.md) | - The javascript version of CombineTierVM which inherits RainJSVM with local CombineTier opcodes. |
|  [CombinetierSimulation](./classes/combinetiersimulation.md) | A class for creating a simulation environment for simulating a CombineTier contract off-chain using JSVM. |
|  [CreateERC20](./classes/createerc20.md) | A class to creat a an ERC20 token with ability to be a faucet. owner can mint extar token if i=the token is not fixed supply. It can be claimed x number of tokens once every number of blocks passed which is defined by the faucet at the time of deployment. |
|  [EmissionsERC20](./classes/emissionserc20.md) | A class for calling methods on a EmissionsERC20. |
|  [EmissionsERC20JSVM](./classes/emissionserc20jsvm.md) | - The javascript version of EmissionsERC20JSVM which inherits RainJSVM with local EmissionsERC20JSVM opcodes. |
|  [EmissionSmiulation](./classes/emissionsmiulation.md) | A class for creating a simulation environment for simulating a EmissionsERC20 contract off-chain using JSVM. |
|  [ERC1155](./classes/erc1155.md) | A generic ERC1155 interface to get connected to any ERC1155 address and make transactions. |
|  [ERC1155BalanceTier](./classes/erc1155balancetier.md) | class to create a the vmStateConfig for CombineTier as BalanceTier. this will perform similar to ERC1155BalancTier witha certain toke ID |
|  [ERC20](./classes/erc20.md) | A generic ERC20 interface to get connected to any ERC20 address and make transactions. |
|  [ERC20BalanceTier](./classes/erc20balancetier.md) | class to create a the vmStateConfig for CombineTier as BalanceTier. this will perform similar to ERC20BalancTier in RainVM version 1.0 |
|  [ERC721](./classes/erc721.md) | A generic ERC721 interface to get connected to any ERC721 address and make transactions. |
|  [ERC721BalanceTier](./classes/erc721balancetier.md) | class to create a the vmStateConfig for CombineTier as BalanceTier. this will perform similar to ERC721BalancTier in RainVM version 1.0 |
|  [FactoryContract](./classes/factorycontract.md) | All contract factory should use this instead of directly Rain contract to take advantage of specific method to factories |
|  [FixedPrice](./classes/fixedprice.md) | - A sub-class of PriceCurve for creating a Fixed Price sale type. The price is a constant value over the span of the sale. |
|  [HumanFriendlyRead](./classes/humanfriendlyread.md) | The generator of human friendly readable source. |
|  [IncDecPrice](./classes/incdecprice.md) | - A sub-class of PriceCurve for creating an linear Increasing or Decreasing sale type. |
|  [ITierV2](./classes/itierv2.md) | Class to interact with any Rain Tier contract i.e ITierV2 contracts |
|  [LinearEmissions](./classes/linearemissions.md) | A linear minting emissions over a period of time. holding more before claiming would result in a more reward. |
|  [MatchMaker](./classes/matchmaker.md) | A class for finding matches among orders off-chain in a simulated environment |
|  [NoticeBoard](./classes/noticeboard.md) | A class for calling method on a NoticeBoard. |
|  [OrderBook](./classes/orderbook.md) | A class for calling method on a Rain OrderBook contract. |
|  [OrderbookSimulation](./classes/orderbooksimulation.md) | A class for creating a simulation environment for simulating a Orderbook contract off-chain using JSVM. or to be used to perform off-chain matchmaking based on. |
|  [PriceCurve](./classes/pricecurve.md) | - PriceCurve is an class that all the other sale types (sub-classes) will inherit from. |
|  [RainContract](./classes/raincontract.md) | //TODO: Add doc |
|  [RainJSVM](./classes/rainjsvm.md) | - The javascript version of the RainVM, basically does the same job RainVM does but off-chain. |
|  [RedeemableERC20](./classes/redeemableerc20.md) | A class for calling methods on a RedeemableERC20. |
|  [RedeemableERC20ClaimEscrow](./classes/redeemableerc20claimescrow.md) | A class for calling methods on a RedeemableERC20ClaimEscrow. |
|  [RuleBuilder](./classes/rulebuilder.md) | Class with methods to generate a rule-based StateConfig |
|  [Sale](./classes/sale.md) | A class for deploying and calling methods on a Sale. |
|  [SaleJSVM](./classes/salejsvm.md) | - The javascript version of SaleVM which inherits RainJSVM with local Sale opcodes. |
|  [SaleSimulation](./classes/salesimulation.md) | A class for creating a simulation environment for simulating a Sale contract off-chain using JSVM. |
|  [SaleVmFrom](./classes/salevmfrom.md) | Builds a sale compatible StateConfig out of 2 individual StateConfigs (canLive and calculateBuy) |
|  [SeedDance](./classes/seeddance.md) | A class for calling method on a Rain SeedDance contract. |
|  [SequentialEmissions](./classes/sequentialemissions.md) | A sequential minting emission, minting can only be done once in every period of time, also can set a max reward with increment over the span of several periods. |
|  [Stake](./classes/stake.md) | A class for calling methods on a Stake. |
|  [Verify](./classes/verify.md) | A class for deploying and calling methods on a Verify. |
|  [VerifyTier](./classes/verifytier.md) | A class for deploying and calling methods on a VerifyTier.<br></br>A contract that is `VerifyTier` expects to derive tiers from the time the account was approved by the underlying `Verify` contract. The approval block numbers defer to `State.since` returned from `Verify.state`<!-- -->. |
|  [vLBP](./classes/vlbp.md) | - A sub-class of PriceCurve for creating an vLBP i.e virtual LBP sale type. |
|  [VM](./classes/vm.md) | //TODO: Add doc |
|  [vmSimulation](./classes/vmsimulation.md) | A class for creating a simulation environment for running pure RainVM off-chain using JSVM. |

## Enumerations

|  Enumeration | Description |
|  --- | --- |
|  [AllStandardOps](./enums/allstandardops.md) | All the standard Op Codes |
|  [AutoApproveContext](./enums/autoapprovecontext.md) | Enum for operand of the AutoApprove's CONTEXT opcode |
|  [AutoApproveStorage](./enums/autoapprovestorage.md) | Enum for operand of the AutoApprove's STORAGE opcode |
|  [BuyCapMode](./enums/buycapmode.md) | Standard cap per wallet modes |
|  [CombineTierContext](./enums/combinetiercontext.md) | Enum for operand of the combineTier's CONTEXT opcode |
|  [CombineTierStorage](./enums/combinetierstorage.md) | Enum for operand of the CombineTier's STORAGE opcode |
|  [Debug](./enums/debug.md) | Enum for DEBUG opcode operands |
|  [EmissionsERC20Context](./enums/emissionserc20context.md) | Enum for operand of the emissionsERC20's CONTEXT opcode |
|  [EmissionsERC20Storage](./enums/emissionserc20storage.md) | Enum for operand of the EmissionsERC20's STORAGE opcode |
|  [OrderbookContext](./enums/orderbookcontext.md) | Enum for operand of the Orderbook's CONTEXT opcode |
|  [OrderbookStorage](./enums/orderbookstorage.md) | Enum for operand of the Orderbook's STORAGE opcode |
|  [SaleContext](./enums/salecontext.md) | Enum for operand of the sale's CONTEXT opcode |
|  [SaleStorage](./enums/salestorage.md) | Enum for operand of the sale's Storage Opcodes |
|  [Tier](./enums/tier.md) | All the contract tier levels availables in all ITier contracts. |
|  [VerifyStatus](./enums/verifystatus.md) | Summary statuses derived from a `State` by comparing the `Since` times against a specific block number. |

## Functions

|  Function | Description |
|  --- | --- |
|  [OpAdd(this, state, operand, data)](./variables/opadd_1.md) |  |
|  [OpAny(this, state, operand, data)](./variables/opany_1.md) |  |
|  [OpBlockNumber(this, state, operand, data)](./variables/opblocknumber_1.md) |  |
|  [OpCaller(this, state, operand, data)](./variables/opcaller_1.md) |  |
|  [OpDiv(this, state, operand, data)](./variables/opdiv_1.md) |  |
|  [OpEagerIf(this, state, operand, data)](./variables/opeagerif_1.md) |  |
|  [OpEqualTo(this, state, operand, data)](./variables/opequalto_1.md) |  |
|  [OpERC1155BalanceOf(this, state, operand, data)](./variables/operc1155balanceof_1.md) |  |
|  [OpERC1155BalanceOfBatch(this, state, operand, data)](./variables/operc1155balanceofbatch_1.md) |  |
|  [OpERC20BalanceOf(this, state, operand, data)](./variables/operc20balanceof_1.md) |  |
|  [OpERC20SnapshotBalanceOfAt(this, state, operand, data)](./variables/operc20snapshotbalanceofat_1.md) |  |
|  [OpERC20SnapshotTotalSupplyAt(this, state, operand, data)](./variables/operc20snapshottotalsupplyat_1.md) |  |
|  [OpERC20TotalSupply(this, state, operand, data)](./variables/operc20totalsupply_1.md) |  |
|  [OpERC721BalanceOf(this, state, operand, data)](./variables/operc721balanceof_1.md) |  |
|  [OpERC721OwnerOf(this, state, operand, data)](./variables/operc721ownerof_1.md) |  |
|  [OpEvery(this, state, operand, data)](./variables/opevery_1.md) |  |
|  [OpExp(this, state, operand, data)](./variables/opexp_1.md) |  |
|  [OpGreaterThan(this, state, operand, data)](./variables/opgreaterthan_1.md) |  |
|  [OpIsZero(this, state, operand, data)](./variables/opiszero_1.md) |  |
|  [OpITierV2Report(this, state, operand, data)](./variables/opitierv2report_1.md) |  |
|  [OpITierV2ReportTimesForTier(this, state, operand, data)](./variables/opitierv2reporttimesfortier_1.md) |  |
|  [OpLessThan(this, state, operand, data)](./variables/oplessthan_1.md) |  |
|  [OpMax(this, state, operand, data)](./variables/opmax_1.md) |  |
|  [OpMin(this, state, operand, data)](./variables/opmin_1.md) |  |
|  [OpMod(this, state, operand, data)](./variables/opmod_1.md) |  |
|  [OpMul(this, state, operand, data)](./variables/opmul_1.md) |  |
|  [OpSaturatingAdd(this, state, operand, data)](./variables/opsaturatingadd_1.md) |  |
|  [OpSaturatingDiff(this, state, operand, data)](./variables/opsaturatingdiff_1.md) |  |
|  [OpSaturatingMul(this, state, operand, data)](./variables/opsaturatingmul_1.md) |  |
|  [OpSaturatingSub(this, state, operand, data)](./variables/opsaturatingsub_1.md) |  |
|  [OpScale18(this, state, operand, data)](./variables/opscale18_1.md) |  |
|  [OpScale18Div(this, state, operand, data)](./variables/opscale18div_1.md) |  |
|  [OpScale18Mul(this, state, operand, data)](./variables/opscale18mul_1.md) |  |
|  [OpScaleBy(this, state, operand, data)](./variables/opscaleby_1.md) |  |
|  [OpScaleN(this, state, operand, data)](./variables/opscalen_1.md) |  |
|  [OpSelectLte(this, state, operand, data)](./variables/opselectlte_1.md) |  |
|  [OpSub(this, state, operand, data)](./variables/opsub_1.md) |  |
|  [OpThisAddress(this, state, operand, data)](./variables/opthisaddress_1.md) |  |
|  [OpTimestamp(this, state, operand, data)](./variables/optimestamp_1.md) |  |
|  [OpUpdateTimesForTierRange(this, state, operand, data)](./variables/opupdatetimesfortierrange_1.md) |  |

## Interfaces

|  Interface | Description |
|  --- | --- |
|  [BuyConfig](./interfaces/buyconfig.md) | The configuration that is need it to buy in the sale |
|  [EmissionsERC20DeployArgs](./interfaces/emissionserc20deployargs.md) | Everything required by the `EmissionsERC20` constructor. |
|  [ERC20Config](./interfaces/erc20config.md) | Constructor config for standard Open Zeppelin ERC20. |
|  [Evidence](./interfaces/evidence.md) | Structure of arbitrary evidence to support any action taken. Priviledged roles are expected to provide evidence just as applicants as an audit trail will be preserved permanently in the logs. |
|  [FnPtrsJSVM](./interfaces/fnptrsjsvm.md) | An interface for creating a key/value pair of opcodes functions to override. |
|  [IOpMeta](./interfaces/iopmeta.md) |  |
|  [modifier](./interfaces/modifier.md) | Type for price/quantity scripts modifier based on a tier report |
|  [NoticeStruct](./interfaces/noticestruct.md) |  |
|  [OpJSVM](./interfaces/opjsvm.md) | An interface/type of JSVM opcodes' function's body |
|  [ReadTxOverrides](./interfaces/readtxoverrides.md) | More read about `ReadTxOverrides` that comes from CallOverrides of ethers |
|  [Receipt](./interfaces/receipt.md) | The receipt that contain the information of the buy |
|  [RedeemableERC20DeployArgs](./interfaces/redeemableerc20deployargs.md) | Everything required by the `RedeemableERC20` constructor. |
|  [ReserveBook](./interfaces/reservebook.md) | Interface for matchmaker forcasting a script |
|  [SaleConfig](./interfaces/saleconfig.md) | The configuration of the sale |
|  [SaleDeployArguments](./interfaces/saledeployarguments.md) | Arguments to deploy/create a new Sale |
|  [SaleRedeemableERC20Config](./interfaces/saleredeemableerc20config.md) | Configuration that will have the Redeemable of the Sale |
|  [SClearConfig](./interfaces/sclearconfig.md) | type for bounty config |
|  [SClearedCounterPartyFunds](./interfaces/sclearedcounterpartyfunds.md) | type for simulating and storing matched order counterparty cleared funds |
|  [SClearedFunds](./interfaces/sclearedfunds.md) | type for simulating and storing matched order cleared funds |
|  [SERC1155](./interfaces/serc1155.md) | type for simulating and storing ERC1155 contract data |
|  [SERC1155s](./interfaces/serc1155s.md) | type for simulating and storing multiple ERC1155 tokens |
|  [SERC20](./interfaces/serc20.md) | type for simulating and storing ERC20token contract data |
|  [SERC20s](./interfaces/serc20s.md) | type for simulating and storing multiple ERC20 tokens |
|  [SERC721](./interfaces/serc721.md) | type for simulating and storing ERC721 contract data |
|  [SERC721s](./interfaces/serc721s.md) | type for simulating and storing multiple ERC721 tokens |
|  [SITiers](./interfaces/sitiers.md) | type for simulating and storing ITier contract data |
|  [SOrder](./interfaces/sorder.md) | type for simulating and storing orderbook Order data |
|  [SOrders](./interfaces/sorders.md) | type for simulating and storing multiple orderbook Orders |
|  [SSnapshot](./interfaces/ssnapshot.md) | type for SimERC20 with snapshots |
|  [SStore](./interfaces/sstore.md) | A simple key/value pair object used as storage in simulation classes to store the required data |
|  [StateConfig](./interfaces/stateconfig.md) | Config required to build a new `State`<!-- -->. |
|  [StateJSVM](./interfaces/statejsvm.md) | - An interface, StateJS is basically javascript version of 'State' struct in RainVM, although it doesn't need stackLength and argumentsLength to operate. It receives a regular RainVM in the constructor and initiates the stack for it and all opcodes do their operations to the stack. |
|  [StorageOpcodesRange](./interfaces/storageopcodesrange.md) | Interface for accessible by vm storage's slots range available for a contract to be used as local opcodes. |
|  [SVaults](./interfaces/svaults.md) | type for simulating and storing orderbook Vaults data |
|  [TxOverrides](./interfaces/txoverrides.md) | More read about `TxOverrides` that comes from Overrides of ethers |
|  [VerifyDeployArgs](./interfaces/verifydeployargs.md) | Config to initialize a Verify contract with. |
|  [VerifyState](./interfaces/verifystate.md) | Records the block a verify session reaches each status. If a status is not reached it is left as UNINITIALIZED, i.e. 0xFFFFFFFF. Most accounts will never be banned so most accounts will never reach every status, which is a good thing. |
|  [vmCurrency](./interfaces/vmcurrency.md) | Type for a currency scripts used in RuleBuilder class |

## Namespaces

|  Namespace | Description |
|  --- | --- |
|  [utils](./namespaces/utils.md) |  |

## Variables

|  Variable | Description |
|  --- | --- |
|  [eighteenZeros](./variables/eighteenzeros.md) | 18 decimals or i.e "DECIMALS" - used for fixed point match |
|  [fixedPointDiv](./variables/fixedpointdiv.md) |  |
|  [fixedPointMul](./variables/fixedpointmul.md) |  |
|  [max](./variables/max.md) | calculate the maximum among array of BigNumbers |
|  [min](./variables/min.md) | calculate the minimum among array of BigNumbers |
|  [OpMeta](./variables/opmeta.md) |  |
|  [pnp](./variables/pnp.md) | Class for Opcodes number of stack pushes and pops |
|  [saturatingAdd](./variables/saturatingadd.md) |  |
|  [saturatingDiff](./variables/saturatingdiff.md) |  |
|  [saturatingMul](./variables/saturatingmul.md) |  |
|  [saturatingSub](./variables/saturatingsub.md) |  |
|  [scale18](./variables/scale18.md) |  |
|  [scaleBy](./variables/scaleby.md) |  |
|  [scaleN](./variables/scalen.md) |  |
|  [selectLte](./variables/selectlte.md) |  |
|  [updateTimesForTierRange](./variables/updatetimesfortierrange.md) |  |

## Type Aliases

|  Type Alias | Description |
|  --- | --- |
|  [Addresses](./types/addresses.md) | Type for all the addresses stored in the Book. |
|  [AutoApproveOps](./types/autoapproveops.md) | Type for the opcodes availables in a AutoApprove instance. |
|  [CallOptions](./types/calloptions.md) | Options for instantiating RainJSVM |
|  [ClearConfig](./types/clearconfig.md) | Type for clear vaultIds used when in |
|  [ClearStateChange](./types/clearstatechange.md) | Type for changes in state of an orderbook vaults after an successful clear |
|  [CombineTierDeployArgs](./types/combinetierdeployargs.md) | The argument of the CombineTier. The StateConfig will be deployed as a pointer under VM State Pointer. |
|  [Config](./types/config.md) | Specific the configuration of the generation method |
|  [DepositConfig](./types/depositconfig.md) | Type for depositing some token amount into a vault used in |
|  [EmissionsConfig](./types/emissionsconfig.md) | A type for newing Emissions script |
|  [EvidenceConfig](./types/evidenceconfig.md) |  |
|  [IOConfig](./types/ioconfig.md) | token the address of the desired token vaultId corresponding token vault id |
|  [OPerand](./types/operand.md) | Parameter that will use to converted to the source.<br></br>Use an opcode and operand (optional) |
|  [Order](./types/order.md) | Type for an order containing all that is required in an order. An Order is an |
|  [OrderBookOpcodes](./types/orderbookopcodes.md) | Type for the opcodes availables in a OrderBook instance. |
|  [OrderConfig](./types/orderconfig.md) | A type for an order configuration without any specific owner |
|  [PrettifyConfig](./types/prettifyconfig.md) | Specific the configuration of the Prettify method. |
|  [SIOConfig](./types/sioconfig.md) | token the address of the desired token vaultId corresponding token vault id |
|  [StakeDeployArgs](./types/stakedeployargs.md) | A type for deploying a new stake contract which contains everything required for deployment.<br></br>'token' is the main token addtess. 'initialRatio' is the initial conversion ratio between the stake token and main token. 'name' of the stake token. 'symbol' of the stake token |
|  [SubgraphBook](./types/subgraphbook.md) | Type for index sugbraph endpoints by chain ID. |
|  [TimeBoundConfig](./types/timeboundconfig.md) |  |
|  [WithdrawConfig](./types/withdrawconfig.md) | Type for withdrawing some token amount from a vault used in |

