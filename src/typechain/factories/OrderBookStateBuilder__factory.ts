/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  OrderBookStateBuilder,
  OrderBookStateBuilderInterface,
} from "../OrderBookStateBuilder";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_size",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_start",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_end",
        type: "uint256",
      },
    ],
    name: "InvalidCodeAtRange",
    type: "error",
  },
  {
    inputs: [],
    name: "WriteError",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "vm_",
        type: "address",
      },
      {
        components: [
          {
            internalType: "bytes[]",
            name: "sources",
            type: "bytes[]",
          },
          {
            internalType: "uint256[]",
            name: "constants",
            type: "uint256[]",
          },
        ],
        internalType: "struct StateConfig",
        name: "config_",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "entrypoint",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minFinalStackIndex",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stackIndex",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stackLength",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "argumentsLength",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "storageLength",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "opcodesLength",
            type: "uint256",
          },
        ],
        internalType: "struct Bounds[]",
        name: "boundss_",
        type: "tuple[]",
      },
    ],
    name: "buildState",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes[]",
            name: "sources",
            type: "bytes[]",
          },
          {
            internalType: "uint256[]",
            name: "constants",
            type: "uint256[]",
          },
        ],
        internalType: "struct StateConfig",
        name: "stateConfig_",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "entrypoint",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minFinalStackIndex",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stackIndex",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stackLength",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "argumentsLength",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "storageLength",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "opcodesLength",
            type: "uint256",
          },
        ],
        internalType: "struct Bounds",
        name: "bounds_",
        type: "tuple",
      },
    ],
    name: "ensureIntegrity",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "packedFnPtrs_",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "source_",
        type: "bytes",
      },
    ],
    name: "ptrSource",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "stackPopsFnPtrs",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "stackPushesFnPtrs",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x60c06040523480156200001157600080fd5b5062000031620000206200005d565b620000db60201b62000c7a1760201c565b6001600160a01b03166080526200004b6200002062000150565b6001600160a01b031660a0526200070d565b6060620000746200019e60201b62000d051760201c565b620000b4604080516060810182526001600160401b036200055d602090811b620010461782168184015262000557901b6200104017168183015290815290565b604051602001620000c792919062000692565b604051602081830303815290604052905090565b6000806200011583604051602001620000f59190620006b3565b6040516020818303038152906040526200038d60201b62000e931760201c565b90508051602082016000f091506001600160a01b0382166200014a5760405163046a55db60e11b815260040160405180910390fd5b50919050565b606062000167620003bb60201b62000ebf1760201c565b604080516060810182526001600160401b036200055d602090811b62001046179190911690820181905281830152908152620000b4565b604080516105e08101825260006020808301829052928201819052606082018190526080820181905260a0820181905260c08201526001600160401b0362000557831b6200104017811660e083018190526200055d841b62001046178216610100840181905262000563851b6200104c17831661012085018190526101408501839052610160850183905261018085018390526101a0850181905262000569861b620010521784166101c0860152620005b6861b620010c71784166101e0860181905261020086018190526102208601819052610240860152610260850182905261028085018390526102a085018390526102c085018290526102e08501829052620005bc861b620010cd17841661030086018190526103208601919091526103408501839052610360850181905261038085018390526103a08501919091526103c084018290526103e08401819052610400840181905261042084018190526104408401819052610460840181905261048084018190526104a084018190526104c084018190526104e084018190526105008401819052610520840152620005ff841b6200113c17821661054084015262000605841b6200114217821661056084015261058083018190526200060b90931b6200114817166105a08201526105c08082019290925290815290565b6060815182604051602001620003a5929190620006cf565b6040516020818303038152906040529050919050565b604080516105e08101825260006020808301829052928201819052606082018190526080820181905260a0820181905260c08201526001600160401b036200055d831b6200104617811660e08301819052610100830181905261012083018190526101408301819052610160830181905261018083018190526101a08301819052620005bc90931b620010cd17166101c08201526101e08101829052610200810182905261022081018290526102408101829052610260810182905261028081018290526102a081018290526102c081018290526102e08101829052610300810182905261032081018290526103408101829052610360810182905261038081018290526103a081018290526103c081018290526103e08101829052610400810182905261042081018290526104408101829052610460810182905261048081018290526104a081018290526104c081018290526104e08101829052610500810182905261052081018290526105408101829052610560810182905261058081018290526105a081018290526105c08082019290925290815290565b50600290565b50600190565b50600390565b6000808211620005ac5760405162461bcd60e51b81526020600482015260096024820152680c17d3d4115490539160ba1b60448201526064015b60405180910390fd5b5060020260010190565b50600090565b6000808211620005fb5760405162461bcd60e51b81526020600482015260096024820152680c17d3d4115490539160ba1b6044820152606401620005a3565b5090565b60020190565b60030190565b6000601f8216806200064e5760405162461bcd60e51b815260206004820152600b60248201526a10905117d3d4115490539160aa1b6044820152606401620005a3565b92915050565b6000815160005b818110156200067757602081850181015186830152016200065b565b8181111562000687576000828601525b509290920192915050565b6000620006ab620006a4838662000654565b8462000654565b949350505050565b600081526000620006c8600183018462000654565b9392505050565b606360f81b815260e083901b6001600160e01b03191660018201526880600e6000396000f360b81b60058201526000620006ab600e83018462000654565b60805160a051611f72620007336000396000610723015260006106f60152611f726000f3fe608060405234801561001057600080fd5b50600436106100675760003560e01c80634fc976e9116100505780634fc976e91461009d5780639b0bc349146100b2578063a46c2a31146100c557600080fd5b806317376ae01461006c5780634127338614610095575b600080fd5b61007f61007a366004611a47565b6100cd565b60405161008c9190611b65565b60405180910390f35b61007f6104c8565b6100b06100ab366004611bb6565b610682565b005b61007f6100c0366004611c06565b610986565b61007f610ad7565b606060006100da856111bb565b905060008573ffffffffffffffffffffffffffffffffffffffff1663e0419ae36040518163ffffffff1660e01b81526004016040805180830381865afa158015610128573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061014c9190611c6a565b60200151905060008060005b86518110156102f0578387828151811061017457610174611cb9565b602002602001015160a0018181525050600285518161019557610195611ce8565b048782815181106101a8576101a8611cb9565b602002602001015160c00181815250506101db888883815181106101ce576101ce611cb9565b6020026020010151610682565b61020b8782815181106101f0576101f0611cb9565b602002602001015160800151846112f990919063ffffffff16565b925061023d87828151811061022257610222611cb9565b602002602001015160600151836112f990919063ffffffff16565b915086818151811061025157610251611cb9565b60200260200101516020015187828151811061026f5761026f611cb9565b60200260200101516040015110156102e8576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601160248201527f46494e414c5f535441434b5f494e44455800000000000000000000000000000060448201526064015b60405180910390fd5b600101610158565b506000828860200151510167ffffffffffffffff81111561031357610313611716565b60405190808252806020026020018201604052801561033c578160200160208202803683370190505b50905060005b886020015151811015610392578860200151818151811061036557610365611cb9565b602002602001015182828151811061037f5761037f611cb9565b6020908102919091010152600101610342565b5087515160009067ffffffffffffffff8111156103b1576103b1611716565b6040519080825280602002602001820160405280156103e457816020015b60608152602001906001900390816103cf5790505b50905060005b8951518110156104405761041b878b60000151838151811061040e5761040e611cb9565b6020026020010151610986565b82828151811061042d5761042d611cb9565b60209081029190910101526001016103ea565b506104b86040518060a00160405280600081526020018567ffffffffffffffff81111561046f5761046f611716565b604051908082528060200260200182016040528015610498578160200160208202803683370190505b5081526020018381526020018481526020018b6020015151815250611310565b96505050505050505b9392505050565b604080516105e0810182526000602080830182905282840182905260608084018390526080840183905260a0840183905260c084019290925261104660e08401819052610100840181905261012084018190526101408401819052610160840181905261018084018190526101a084018190526110cd6101c08501526101e08401819052610200840181905261022084018190526102408401819052610260840181905261028084018190526102a084018190526102c084018190526102e08401819052610300840181905261032084018190526103408401819052610360840181905261038084018190526103a084018190526103c084018190526103e08401819052610400840181905261042084018190526104408401819052610460840181905261048084018190526104a084018190526104c084018190526104e08401819052610500840181905261052084018190526105408401819052610560840181905261058084018190526105a084018190526105c080850182905284528451808401865291820181905281850152928352915b60405160200161066e929190611d17565b604051602081830303815290604052905090565b805182515181106106ef576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600b60248201527f4d494e5f534f555243455300000000000000000000000000000000000000000060448201526064016102df565b600061071a7f000000000000000000000000000000000000000000000000000000000000000061144d565b905060006107477f000000000000000000000000000000000000000000000000000000000000000061144d565b905060008080600080602088026020018a5101519050805193505b8385101561090b576002850194508481015180601e1a935080601f1a925050600683101561082657826107b65789602001515189608001510182106107a657600080fd5b604089018051600101905261080d565b60018314156107cf57886040015182106107a657600080fd5b60028314156107e857604089018051600101905261080d565b600383141561080d578860a00151821061080157600080fd5b60408901805160010190525b6004831415610821576108218a8a8461147b565b6108ee565b8860c001518310610893576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600a60248201527f4d41585f4f50434f44450000000000000000000000000000000000000000000060448201526064016102df565b6020838102888101820151908801909101516108b28463ffffffff8416565b60408c018051919091039081905260608c01516108ce916112f9565b60608c01526108e08463ffffffff8316565b60408c018051909101905250505b604089015160608a0151610901916112f9565b60608a0152610762565b606089015160ff101561097a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600960248201527f4d41585f535441434b000000000000000000000000000000000000000000000060448201526064016102df565b50505050505050505050565b805160609060028106156109f6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601160248201527f4f44445f534f555243455f4c454e47544800000000000000000000000000000060448201526064016102df565b60006002600383020467ffffffffffffffff811115610a1757610a17611716565b6040519080825280601f01601f191660200182016040528015610a41576020820181803683370190505b509050600660018381018160005b82821015610ac95781890151601f1a6002830615610aab5785811015610a7d57600182019181908801602101535b858110610aab57600281026002018b015180601e1a83602001890153600183019260ff821690890160210153505b60028306610abc5780826020018801535b5060019182019101610a4f565b509398975050505050505050565b604080516105e0810182526000602080830182905282840182905260608084018390526080840183905260a0840183905260c084019290925261104060e08401819052611046610100850181905261104c61012086018190526101408601839052610160860183905261018086018390526101a086018190526110526101c08701526110c76101e0870181905261020087018190526102208701819052610240870152610260860182905261028086018390526102a086018390526102c086018290526102e086018290526110cd61030087018190526103208701919091526103408601839052610360860181905261038086018390526103a086018290526103c086018390526103e08601819052610400860181905261042086018190526104408601819052610460860181905261048086018190526104a086018190526104c086018190526104e08601819052610500860181905261052086015261113c61054086015261114261056086015261058085018290526111486105a08601526105c080860183905285528551808501875292830152818501529283529161065d565b600080610ca583604051602001610c919190611d46565b604051602081830303815290604052610e93565b90508051602082016000f0915073ffffffffffffffffffffffffffffffffffffffff8216610cff576040517f08d4abb600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b50919050565b604080516105e081018252600060208201819052918101829052606081018290526080810182905260a0810182905260c081019190915261104060e08201819052611046610100830181905261104c61012084018190526101408401839052610160840183905261018084018390526101a084018190526110526101c08501526110c76101e0850181905261020085018190526102208501819052610240850152610260840182905261028084018390526102a084018390526102c084018290526102e084018290526110cd61030085018190526103208501919091526103408401839052610360840181905261038084018390526103a08401919091526103c083018290526103e08301819052610400830181905261042083018190526104408301819052610460830181905261048083018190526104a083018190526104c083018190526104e08301819052610500830181905261052083015261113c61054083015261114261056083015261058082018190526111486105a08301526105c082810191909152815290565b6060815182604051602001610ea9929190611d6c565b6040516020818303038152906040529050919050565b604080516105e081018252600060208201819052918101829052606081018290526080810182905260a0810182905260c081019190915261104660e08201819052610100820181905261012082018190526101408201819052610160820181905261018082018190526101a082018190526110cd6101c08301526101e08201819052610200820181905261022082018190526102408201819052610260820181905261028082018190526102a082018190526102c082018190526102e08201819052610300820181905261032082018190526103408201819052610360820181905261038082018190526103a082018190526103c082018190526103e08201819052610400820181905261042082018190526104408201819052610460820181905261048082018190526104a082018190526104c082018190526104e08201819052610500820181905261052082018190526105408201819052610560820181905261058082018190526105a082018190526105c082810191909152815290565b50600290565b50600190565b50600390565b60008082116110bd576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600960248201527f305f4f504552414e44000000000000000000000000000000000000000000000060448201526064016102df565b5060020260010190565b50600090565b6000808211611138576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600960248201527f305f4f504552414e44000000000000000000000000000000000000000000000060448201526064016102df565b5090565b60020190565b60030190565b6000601f8216806111b5576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600b60248201527f4241445f4f504552414e4400000000000000000000000000000000000000000060448201526064016102df565b92915050565b73ffffffffffffffffffffffffffffffffffffffff8082166000908152602081905260408120546060926111ef911661144d565b90508051600014156111b55761129c6112978473ffffffffffffffffffffffffffffffffffffffff1663f2cd6c086040518163ffffffff1660e01b8152600401600060405180830381865afa15801561124c573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01682016040526112929190810190611e03565b61151a565b610c7a565b73ffffffffffffffffffffffffffffffffffffffff848116600090815260208190526040902080547fffffffffffffffffffffffff000000000000000000000000000000000000000016929091169190911790556104c1836111bb565b60008183101561130957816104c1565b5090919050565b606060008260600151905060006018846040015151901b60108560800151901b6008866020015151901b866060015151171717905060008160001b8360405160200161135c9190611e7a565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0818403018152908290526113989291602001611eb0565b604051602081830303815290604052905060005b8560400151518110156114445781866040015182815181106113d0576113d0611cb9565b60200260200101515160001b876040015183815181106113f2576113f2611cb9565b602002602001015160405160200161140c93929190611ed6565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe081840301815291905291506001016113ac565b50949350505050565b60606111b58260017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff611624565b6040820180517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600584901c91829003019182905260608401516001909101916114c591906112f9565b606084015260808301516114d990826112f9565b60808401528251600783168085526001600385811c161b919060005b8381101561150f576115078888610682565b6001016114f5565b505090935250505050565b6060602082518161152d5761152d611ce8565b0615611595576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f4241445f464e5f505452535f4c454e475448000000000000000000000000000060448201526064016102df565b600060108351816115a8576115a8611ce8565b0467ffffffffffffffff8111156115c1576115c1611716565b6040519080825280601f01601f1916602001820160405280156115eb576020820181803683370190505b509050600060025b845182101561161b5780830180516020848801810151909117909152909101906002016115f3565b50909392505050565b6060833b806116435750506040805160208101909152600081526104c1565b808411156116615750506040805160208101909152600081526104c1565b838310156116ac576040517f2c4a89fa0000000000000000000000000000000000000000000000000000000081526004810182905260248101859052604481018490526064016102df565b83830384820360008282106116c157826116c3565b815b60408051603f83017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0168101909152818152955090508087602087018a3c505050509392505050565b611714611f0d565b565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040805190810167ffffffffffffffff8111828210171561176857611768611716565b60405290565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016810167ffffffffffffffff811182821017156117b5576117b5611716565b604052919050565b600067ffffffffffffffff8211156117d7576117d7611716565b5060051b60200190565b600067ffffffffffffffff8211156117fb576117fb611716565b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01660200190565b600082601f83011261183857600080fd5b813561184b611846826117e1565b61176e565b81815284602083860101111561186057600080fd5b816020850160208301376000918101602001919091529392505050565b600082601f83011261188e57600080fd5b8135602061189e611846836117bd565b82815260059290921b840181019181810190868411156118bd57600080fd5b8286015b848110156118d857803583529183019183016118c1565b509695505050505050565b6000604082840312156118f557600080fd5b6118fd611745565b9050813567ffffffffffffffff8082111561191757600080fd5b818401915084601f83011261192b57600080fd5b8135602061193b611846836117bd565b82815260059290921b8401810191818101908884111561195a57600080fd5b8286015b84811015611992578035868111156119765760008081fd5b6119848b86838b0101611827565b84525091830191830161195e565b50865250858101359350828411156119a957600080fd5b6119b58785880161187d565b818601525050505092915050565b600060e082840312156119d557600080fd5b60405160e0810181811067ffffffffffffffff821117156119f8576119f8611716565b8060405250809150823581526020830135602082015260408301356040820152606083013560608201526080830135608082015260a083013560a082015260c083013560c08201525092915050565b600080600060608486031215611a5c57600080fd5b833573ffffffffffffffffffffffffffffffffffffffff81168114611a8057600080fd5b925060208481013567ffffffffffffffff80821115611a9e57600080fd5b611aaa888389016118e3565b94506040870135915080821115611ac057600080fd5b508501601f81018713611ad257600080fd5b8035611ae0611846826117bd565b81815260e0918202830184019184820191908a841115611aff57600080fd5b938501935b83851015611b2557611b168b866119c3565b83529384019391850191611b04565b5080955050505050509250925092565b60005b83811015611b50578181015183820152602001611b38565b83811115611b5f576000848401525b50505050565b6020815260008251806020840152611b84816040850160208701611b35565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169190910160400192915050565b6000806101008385031215611bca57600080fd5b823567ffffffffffffffff811115611be157600080fd5b611bed858286016118e3565b925050611bfd84602085016119c3565b90509250929050565b60008060408385031215611c1957600080fd5b823567ffffffffffffffff80821115611c3157600080fd5b611c3d86838701611827565b93506020850135915080821115611c5357600080fd5b50611c6085828601611827565b9150509250929050565b600060408284031215611c7c57600080fd5b6040516040810181811067ffffffffffffffff82111715611c9f57611c9f611716565b604052825181526020928301519281019290925250919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b60008351611d29818460208801611b35565b835190830190611d3d818360208801611b35565b01949350505050565b6000815260008251611d5f816001850160208701611b35565b9190910160010192915050565b7f630000000000000000000000000000000000000000000000000000000000000081527fffffffff000000000000000000000000000000000000000000000000000000008360e01b1660018201527f80600e6000396000f30000000000000000000000000000000000000000000000600582015260008251611df581600e850160208701611b35565b91909101600e019392505050565b600060208284031215611e1557600080fd5b815167ffffffffffffffff811115611e2c57600080fd5b8201601f81018413611e3d57600080fd5b8051611e4b611846826117e1565b818152856020838501011115611e6057600080fd5b611e71826020830160208601611b35565b95945050505050565b815160009082906020808601845b83811015611ea457815185529382019390820190600101611e88565b50929695505050505050565b82815260008251611ec8816020850160208701611b35565b919091016020019392505050565b60008451611ee8818460208901611b35565b82018481528351611f00816020808501908801611b35565b0160200195945050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052605160045260246000fdfea2646970667358221220cb961504815b449788a0b158592231794a46cfeba7d8afbf57aa34a436f23aa864736f6c634300080a0033";

type OrderBookStateBuilderConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: OrderBookStateBuilderConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class OrderBookStateBuilder__factory extends ContractFactory {
  constructor(...args: OrderBookStateBuilderConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<OrderBookStateBuilder> {
    return super.deploy(overrides || {}) as Promise<OrderBookStateBuilder>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): OrderBookStateBuilder {
    return super.attach(address) as OrderBookStateBuilder;
  }
  connect(signer: Signer): OrderBookStateBuilder__factory {
    return super.connect(signer) as OrderBookStateBuilder__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): OrderBookStateBuilderInterface {
    return new utils.Interface(_abi) as OrderBookStateBuilderInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): OrderBookStateBuilder {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as OrderBookStateBuilder;
  }
}
