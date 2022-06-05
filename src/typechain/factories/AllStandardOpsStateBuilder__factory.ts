/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  AllStandardOpsStateBuilder,
  AllStandardOpsStateBuilderInterface,
} from "../AllStandardOpsStateBuilder";

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
  "0x60c06040523480156200001157600080fd5b5062000031620000206200005d565b6200007960201b62000bf11760201c565b6001600160a01b03166080526200004b62000020620000ee565b6001600160a01b031660a0526200060e565b6060620000746200010560201b62000c7c1760201c565b905090565b600080620000b383604051602001620000939190620005ac565b604051602081830303815290604052620002ca60201b62000df31760201c565b90508051602082016000f091506001600160a01b038216620000e85760405163046a55db60e11b815260040160405180910390fd5b50919050565b606062000074620002f860201b62000e1f1760201c565b604080516105808101825260006020808301829052928201819052606082018190526080820181905260a0820181905260c08201526001600160401b036200047d831b62000f8817811660e083018190526101008301819052610120830181905261014083015262000483831b62000f8e1781166101608301819052610180830181905262000489841b62000f941782166101a084018190526101c084018190526101e084018190526200048f851b62000f9a178316610200850181905261022085018190526102408501819052610260850181905261028085018190526102a085018190526102c085018190526102e085018190526103008501819052610320850181905261034085018190526103608501829052620004d6861b6200100917841661038086018190526103a086018490526103c086018490526103e086018490526104008601829052610420860191909152610440850183905261046085018390526104808501839052620004dc861b6200100f1784166104a08601526104c085018390526104e085019190915261050084018290526105208401919091526105408301526200052590921b620010821790911661056080830191909152815290565b6060815182604051602001620002e2929190620005c8565b6040516020818303038152906040529050919050565b604080516105808101825260006020808301829052928201819052606082018190526080820181905260a0820181905260c08201526001600160401b0362000489831b62000f9417811660e08301819052610100830181905261012083018190526101408301819052610160830181905261018083018190526101a083018190526101c083018190526101e08301819052610200830181905261022083018190526102408301819052610260830181905261028083018190526102a083018190526102c083018190526102e08301819052610300830181905261032083018190526103408301819052610360830181905261038083018190526103a083018190526103c083018190526103e08301819052610400830181905261042083018190526104408301819052610460830181905261048083018190526104a083018190526104c083018190526104e08301819052610500830181905261052083018190526105408301526200048f90921b62000f9a1790911661056080830191909152815290565b50600090565b50600290565b50600190565b6000808211620004d25760405162461bcd60e51b81526020600482015260096024820152680c17d3d4115490539160ba1b60448201526064015b60405180910390fd5b5090565b50600390565b6000601f8216806200051f5760405162461bcd60e51b815260206004820152600b60248201526a10905117d3d4115490539160aa1b6044820152606401620004c9565b92915050565b6000808211620005645760405162461bcd60e51b81526020600482015260096024820152680c17d3d4115490539160ba1b6044820152606401620004c9565b5060020260010190565b6000815160005b8181101562000591576020818501810151868301520162000575565b81811115620005a1576000828601525b509290920192915050565b600081526000620005c160018301846200056e565b9392505050565b606360f81b815260e083901b6001600160e01b03191660018201526880600e6000396000f360b81b6005820152600062000606600e8301846200056e565b949350505050565b60805160a051611e7f62000634600039600061083d015260006108100152611e7f6000f3fe608060405234801561001057600080fd5b50600436106100675760003560e01c80634fc976e9116100505780634fc976e9146102005780639b0bc34914610215578063a46c2a311461022857600080fd5b806317376ae01461006c5780634127338614610095575b600080fd5b61007f61007a366004611983565b6103a1565b60405161008c9190611aa1565b60405180910390f35b6040805161058081018252600060208201819052918101829052606081018290526080810182905260a0810182905260c0810191909152610f9460e08201819052610100820181905261012082018190526101408201819052610160820181905261018082018190526101a082018190526101c082018190526101e08201819052610200820181905261022082018190526102408201819052610260820181905261028082018190526102a082018190526102c082018190526102e08201819052610300820181905261032082018190526103408201819052610360820181905261038082018190526103a082018190526103c082018190526103e08201819052610400820181905261042082018190526104408201819052610460820181905261048082018190526104a082018190526104c082018190526104e0820181905261050082018190526105208201819052610540820152610f9a61056080830191909152815261007f565b61021361020e366004611af2565b61079c565b005b61007f610223366004611b42565b610aa0565b6040805161058081018252600060208201819052918101829052606081018290526080810182905260a0810182905260c0810191909152610f8860e0820181905261010082018190526101208201819052610140820152610f8e61016082018190526101808201819052610f946101a083018190526101c083018190526101e08301819052610f9a610200840181905261022084018190526102408401819052610260840181905261028084018190526102a084018190526102c084018190526102e08401819052610300840181905261032084018190526103408401819052610360840182905261100961038085018190526103a085018490526103c085018490526103e08501849052610400850182905261042085019190915261044084018390526104608401839052610480840183905261100f6104a08501526104c084018390526104e0840191909152610500830182905261052083019190915261054082015261108261056080830191909152815261007f565b606060006103ae856110f7565b905060008573ffffffffffffffffffffffffffffffffffffffff1663e0419ae36040518163ffffffff1660e01b81526004016040805180830381865afa1580156103fc573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104209190611ba6565b60200151905060008060005b86518110156105c4578387828151811061044857610448611bf5565b602002602001015160a0018181525050600285518161046957610469611c24565b0487828151811061047c5761047c611bf5565b602002602001015160c00181815250506104af888883815181106104a2576104a2611bf5565b602002602001015161079c565b6104df8782815181106104c4576104c4611bf5565b6020026020010151608001518461123590919063ffffffff16565b92506105118782815181106104f6576104f6611bf5565b6020026020010151606001518361123590919063ffffffff16565b915086818151811061052557610525611bf5565b60200260200101516020015187828151811061054357610543611bf5565b60200260200101516040015110156105bc576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601160248201527f46494e414c5f535441434b5f494e44455800000000000000000000000000000060448201526064015b60405180910390fd5b60010161042c565b506000828860200151510167ffffffffffffffff8111156105e7576105e7611652565b604051908082528060200260200182016040528015610610578160200160208202803683370190505b50905060005b886020015151811015610666578860200151818151811061063957610639611bf5565b602002602001015182828151811061065357610653611bf5565b6020908102919091010152600101610616565b5087515160009067ffffffffffffffff81111561068557610685611652565b6040519080825280602002602001820160405280156106b857816020015b60608152602001906001900390816106a35790505b50905060005b895151811015610714576106ef878b6000015183815181106106e2576106e2611bf5565b6020026020010151610aa0565b82828151811061070157610701611bf5565b60209081029190910101526001016106be565b5061078c6040518060a00160405280600081526020018567ffffffffffffffff81111561074357610743611652565b60405190808252806020026020018201604052801561076c578160200160208202803683370190505b5081526020018381526020018481526020018b602001515181525061124c565b96505050505050505b9392505050565b80518251518110610809576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600b60248201527f4d494e5f534f555243455300000000000000000000000000000000000000000060448201526064016105b3565b60006108347f0000000000000000000000000000000000000000000000000000000000000000611389565b905060006108617f0000000000000000000000000000000000000000000000000000000000000000611389565b905060008080600080602088026020018a5101519050805193505b83851015610a25576002850194508481015180601e1a935080601f1a925050600683101561094057826108d05789602001515189608001510182106108c057600080fd5b6040890180516001019052610927565b60018314156108e957886040015182106108c057600080fd5b6002831415610902576040890180516001019052610927565b6003831415610927578860a00151821061091b57600080fd5b60408901805160010190525b600483141561093b5761093b8a8a846113b7565b610a08565b8860c0015183106109ad576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600a60248201527f4d41585f4f50434f44450000000000000000000000000000000000000000000060448201526064016105b3565b6020838102888101820151908801909101516109cc8463ffffffff8416565b60408c018051919091039081905260608c01516109e891611235565b60608c01526109fa8463ffffffff8316565b60408c018051909101905250505b604089015160608a0151610a1b91611235565b60608a015261087c565b606089015160ff1015610a94576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600960248201527f4d41585f535441434b000000000000000000000000000000000000000000000060448201526064016105b3565b50505050505050505050565b80516060906002810615610b10576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601160248201527f4f44445f534f555243455f4c454e47544800000000000000000000000000000060448201526064016105b3565b60006002600383020467ffffffffffffffff811115610b3157610b31611652565b6040519080825280601f01601f191660200182016040528015610b5b576020820181803683370190505b509050600660018381018160005b82821015610be35781890151601f1a6002830615610bc55785811015610b9757600182019181908801602101535b858110610bc557600281026002018b015180601e1a83602001890153600183019260ff821690890160210153505b60028306610bd65780826020018801535b5060019182019101610b69565b509398975050505050505050565b600080610c1c83604051602001610c089190611c53565b604051602081830303815290604052610df3565b90508051602082016000f0915073ffffffffffffffffffffffffffffffffffffffff8216610c76576040517f08d4abb600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b50919050565b6040805161058081018252600060208201819052918101829052606081018290526080810182905260a0810182905260c0810191909152610f8860e0820181905261010082018190526101208201819052610140820152610f8e61016082018190526101808201819052610f946101a083018190526101c083018190526101e08301819052610f9a610200840181905261022084018190526102408401819052610260840181905261028084018190526102a084018190526102c084018190526102e08401819052610300840181905261032084018190526103408401819052610360840182905261100961038085018190526103a085018490526103c085018490526103e08501849052610400850182905261042085019190915261044084018390526104608401839052610480840183905261100f6104a08501526104c084018390526104e0840191909152610500830182905261052083019190915261054082015261108261056082810191909152815290565b6060815182604051602001610e09929190611c79565b6040516020818303038152906040529050919050565b6040805161058081018252600060208201819052918101829052606081018290526080810182905260a0810182905260c0810191909152610f9460e08201819052610100820181905261012082018190526101408201819052610160820181905261018082018190526101a082018190526101c082018190526101e08201819052610200820181905261022082018190526102408201819052610260820181905261028082018190526102a082018190526102c082018190526102e08201819052610300820181905261032082018190526103408201819052610360820181905261038082018190526103a082018190526103c082018190526103e08201819052610400820181905261042082018190526104408201819052610460820181905261048082018190526104a082018190526104c082018190526104e0820181905261050082018190526105208201819052610540820152610f9a61056082810191909152815290565b50600090565b50600290565b50600190565b6000808211611005576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600960248201527f305f4f504552414e44000000000000000000000000000000000000000000000060448201526064016105b3565b5090565b50600390565b6000601f82168061107c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600b60248201527f4241445f4f504552414e4400000000000000000000000000000000000000000060448201526064016105b3565b92915050565b60008082116110ed576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600960248201527f305f4f504552414e44000000000000000000000000000000000000000000000060448201526064016105b3565b5060020260010190565b73ffffffffffffffffffffffffffffffffffffffff80821660009081526020819052604081205460609261112b9116611389565b905080516000141561107c576111d86111d38473ffffffffffffffffffffffffffffffffffffffff1663f2cd6c086040518163ffffffff1660e01b8152600401600060405180830381865afa158015611188573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01682016040526111ce9190810190611d10565b611456565b610bf1565b73ffffffffffffffffffffffffffffffffffffffff848116600090815260208190526040902080547fffffffffffffffffffffffff00000000000000000000000000000000000000001692909116919091179055610795836110f7565b6000818310156112455781610795565b5090919050565b606060008260600151905060006018846040015151901b60108560800151901b6008866020015151901b866060015151171717905060008160001b836040516020016112989190611d87565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0818403018152908290526112d49291602001611dbd565b604051602081830303815290604052905060005b85604001515181101561138057818660400151828151811061130c5761130c611bf5565b60200260200101515160001b8760400151838151811061132e5761132e611bf5565b602002602001015160405160200161134893929190611de3565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe081840301815291905291506001016112e8565b50949350505050565b606061107c8260017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff611560565b6040820180517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600584901c91829003019182905260608401516001909101916114019190611235565b606084015260808301516114159082611235565b60808401528251600783168085526001600385811c161b919060005b8381101561144b57611443888861079c565b600101611431565b505090935250505050565b6060602082518161146957611469611c24565b06156114d1576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f4241445f464e5f505452535f4c454e475448000000000000000000000000000060448201526064016105b3565b600060108351816114e4576114e4611c24565b0467ffffffffffffffff8111156114fd576114fd611652565b6040519080825280601f01601f191660200182016040528015611527576020820181803683370190505b509050600060025b845182101561155757808301805160208488018101519091179091529091019060020161152f565b50909392505050565b6060833b8061157f575050604080516020810190915260008152610795565b8084111561159d575050604080516020810190915260008152610795565b838310156115e8576040517f2c4a89fa0000000000000000000000000000000000000000000000000000000081526004810182905260248101859052604481018490526064016105b3565b83830384820360008282106115fd57826115ff565b815b60408051603f83017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0168101909152818152955090508087602087018a3c505050509392505050565b611650611e1a565b565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040805190810167ffffffffffffffff811182821017156116a4576116a4611652565b60405290565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016810167ffffffffffffffff811182821017156116f1576116f1611652565b604052919050565b600067ffffffffffffffff82111561171357611713611652565b5060051b60200190565b600067ffffffffffffffff82111561173757611737611652565b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01660200190565b600082601f83011261177457600080fd5b81356117876117828261171d565b6116aa565b81815284602083860101111561179c57600080fd5b816020850160208301376000918101602001919091529392505050565b600082601f8301126117ca57600080fd5b813560206117da611782836116f9565b82815260059290921b840181019181810190868411156117f957600080fd5b8286015b8481101561181457803583529183019183016117fd565b509695505050505050565b60006040828403121561183157600080fd5b611839611681565b9050813567ffffffffffffffff8082111561185357600080fd5b818401915084601f83011261186757600080fd5b81356020611877611782836116f9565b82815260059290921b8401810191818101908884111561189657600080fd5b8286015b848110156118ce578035868111156118b25760008081fd5b6118c08b86838b0101611763565b84525091830191830161189a565b50865250858101359350828411156118e557600080fd5b6118f1878588016117b9565b818601525050505092915050565b600060e0828403121561191157600080fd5b60405160e0810181811067ffffffffffffffff8211171561193457611934611652565b8060405250809150823581526020830135602082015260408301356040820152606083013560608201526080830135608082015260a083013560a082015260c083013560c08201525092915050565b60008060006060848603121561199857600080fd5b833573ffffffffffffffffffffffffffffffffffffffff811681146119bc57600080fd5b925060208481013567ffffffffffffffff808211156119da57600080fd5b6119e68883890161181f565b945060408701359150808211156119fc57600080fd5b508501601f81018713611a0e57600080fd5b8035611a1c611782826116f9565b81815260e0918202830184019184820191908a841115611a3b57600080fd5b938501935b83851015611a6157611a528b866118ff565b83529384019391850191611a40565b5080955050505050509250925092565b60005b83811015611a8c578181015183820152602001611a74565b83811115611a9b576000848401525b50505050565b6020815260008251806020840152611ac0816040850160208701611a71565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169190910160400192915050565b6000806101008385031215611b0657600080fd5b823567ffffffffffffffff811115611b1d57600080fd5b611b298582860161181f565b925050611b3984602085016118ff565b90509250929050565b60008060408385031215611b5557600080fd5b823567ffffffffffffffff80821115611b6d57600080fd5b611b7986838701611763565b93506020850135915080821115611b8f57600080fd5b50611b9c85828601611763565b9150509250929050565b600060408284031215611bb857600080fd5b6040516040810181811067ffffffffffffffff82111715611bdb57611bdb611652565b604052825181526020928301519281019290925250919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b6000815260008251611c6c816001850160208701611a71565b9190910160010192915050565b7f630000000000000000000000000000000000000000000000000000000000000081527fffffffff000000000000000000000000000000000000000000000000000000008360e01b1660018201527f80600e6000396000f30000000000000000000000000000000000000000000000600582015260008251611d0281600e850160208701611a71565b91909101600e019392505050565b600060208284031215611d2257600080fd5b815167ffffffffffffffff811115611d3957600080fd5b8201601f81018413611d4a57600080fd5b8051611d586117828261171d565b818152856020838501011115611d6d57600080fd5b611d7e826020830160208601611a71565b95945050505050565b815160009082906020808601845b83811015611db157815185529382019390820190600101611d95565b50929695505050505050565b82815260008251611dd5816020850160208701611a71565b919091016020019392505050565b60008451611df5818460208901611a71565b82018481528351611e0d816020808501908801611a71565b0160200195945050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052605160045260246000fdfea26469706673582212200b846496cb432f503e4f2d2392004a6c60c8cb72c7fa88e23b4b40c8c989a31364736f6c634300080a0033";

type AllStandardOpsStateBuilderConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AllStandardOpsStateBuilderConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class AllStandardOpsStateBuilder__factory extends ContractFactory {
  constructor(...args: AllStandardOpsStateBuilderConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<AllStandardOpsStateBuilder> {
    return super.deploy(overrides || {}) as Promise<AllStandardOpsStateBuilder>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): AllStandardOpsStateBuilder {
    return super.attach(address) as AllStandardOpsStateBuilder;
  }
  connect(signer: Signer): AllStandardOpsStateBuilder__factory {
    return super.connect(signer) as AllStandardOpsStateBuilder__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AllStandardOpsStateBuilderInterface {
    return new utils.Interface(_abi) as AllStandardOpsStateBuilderInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): AllStandardOpsStateBuilder {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as AllStandardOpsStateBuilder;
  }
}
