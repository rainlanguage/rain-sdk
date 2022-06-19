/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { CombineTier, CombineTierInterface } from "../CombineTier";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "vmStateBuilder_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
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
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "combinedTiersLength",
            type: "uint256",
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
            name: "sourceConfig",
            type: "tuple",
          },
        ],
        indexed: false,
        internalType: "struct CombineTierConfig",
        name: "config",
        type: "tuple",
      },
    ],
    name: "Initialize",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    inputs: [],
    name: "fnPtrs",
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
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "combinedTiersLength",
            type: "uint256",
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
            name: "sourceConfig",
            type: "tuple",
          },
        ],
        internalType: "struct CombineTierConfig",
        name: "config_",
        type: "tuple",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account_",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "context_",
        type: "uint256[]",
      },
    ],
    name: "report",
    outputs: [
      {
        internalType: "uint256",
        name: "report_",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tier_",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "context_",
        type: "uint256[]",
      },
    ],
    name: "reportTimeForTier",
    outputs: [
      {
        internalType: "uint256",
        name: "time_",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "storageOpcodesRange",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "pointer",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "length",
            type: "uint256",
          },
        ],
        internalType: "struct StorageOpcodesRange",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId_",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60c06040523480156200001157600080fd5b5060405162003c2c38038062003c2c83398101604081905262000034916200004a565b306080526001600160a01b031660a0526200007c565b6000602082840312156200005d57600080fd5b81516001600160a01b03811681146200007557600080fd5b9392505050565b60805160a051613b8a620000a260003960006105cb015260006106070152613b8a6000f3fe608060405234801561001057600080fd5b50600436106100725760003560e01c8063caa0eb3b11610050578063caa0eb3b146100d5578063e0419ae3146100e8578063f2cd6c081461012057600080fd5b806301ffc9a71461007757806388d686041461009f578063a225543b146100c0575b600080fd5b61008a610085366004612ca8565b6102cc565b60405190151581526020015b60405180910390f35b6100b26100ad366004612dae565b610365565b604051908152602001610096565b6100d36100ce366004612e59565b610459565b005b6100b26100e3366004612e94565b610898565b604080518082018252600080825260209182018190528251808401845281815282018181528351918252519181019190915201610096565b604080516105e081018252600060208201819052818301819052606082018190526080820181905260a0820181905260c082015261161d60e0820181905261171161010083015261179d6101208301526118be610140830152610160820152611967610180820152611a6f6101a0820152611b436101c0820152611d406101e0820152611d4b610200820152611d56610220820152611d61610240820152611d6c610260820152611da0610280820152611e066102a0820152611e6c6102c0820152611ea06102e0820152611ed4610300820152611f09610320820152611f64610340820152611fba610360820152611fe361038082015261203a6103a08201526120676103c08201526120be6103e08201526121296104008201526121866104208201526121c46104408201526121fd6104608201526122316104808201526122636104a08201526122956104c08201526122c76104e08201526122fb61050082015261234d6105208201526123866105408201526124386105608201526125656105808201526125c16105a082015261267b6105c080830191909152815290516100969190612f9a565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167f42766d3f00000000000000000000000000000000000000000000000000000000148061035f57507f01ffc9a7000000000000000000000000000000000000000000000000000000007fffffffff000000000000000000000000000000000000000000000000000000008316145b92915050565b60008061039b610396600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff16610990565b6109be565b905060008473ffffffffffffffffffffffffffffffffffffffff1660001b846040516020016103ca9190612fad565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0818403018152908290526104069291602001612fe3565b604051602081830303815290604052905061042381836000610b2a565b506020820151825161043790600190613038565b815181106104475761044761304f565b60200260200101519250505092915050565b60006104656001610e00565b9050801561049a57600080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff166101001790555b6104da6040518060e00160405280600081526020016000815260200160008152602001600081526020016000815260200160008152602001600081525090565b6000808252600160208084018290526040805160e08101825280820185905260608082018690526080820186905260a0820186905260c0820186905284825281840194909452815160028082529481019092529392909182015b6105746040518060e00160405280600081526020016000815260200160008152602001600081526020016000815260200160008152602001600081525090565b815260200190600190039081610534579050509050828160008151811061059d5761059d61304f565b602002602001018190525081816001815181106105bc576105bc61304f565b602002602001018190525060007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166317376ae07f0000000000000000000000000000000000000000000000000000000000000000888060200190610636919061307e565b856040518463ffffffff1660e01b8152600401610655939291906132c1565b6000604051808303816000875af1158015610674573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01682016040526106ba9190810190613372565b90506106c581610f86565b6000805473ffffffffffffffffffffffffffffffffffffffff9290921662010000027fffffffffffffffffffff0000000000000000000000000000000000000000ffff9092169190911781555b86358110156107f35761077661072b602089018961307e565b61073990602081019061341b565b838181106107495761074961304f565b905060200201357f42766d3f00000000000000000000000000000000000000000000000000000000611011565b6107e1576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600d60248201527f4552433136355f5449455256320000000000000000000000000000000000000060448201526064015b60405180910390fd5b806107eb81613483565b915050610712565b507fcfb36af30e54f3c13af77a901f063607ad4decc594f6cda15e90c752343c514833876040516108259291906134bc565b60405180910390a150505050801561089457600080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b5050565b6000806108c9610396600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff16610990565b905060008673ffffffffffffffffffffffffffffffffffffffff1660001b8660001b86866040516020016108fe929190613539565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529082905261093b93929160200161357e565b604051602081830303815290604052905061095881836001610b2a565b506020820151825161096c90600190613038565b8151811061097c5761097c61304f565b602002602001015192505050949350505050565b606061035f8260017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff61102d565b6109f06040518060a0016040528060008152602001606081526020016060815260200160608152602001600081525090565b610a226040518060a0016040528060008152602001606081526020016060815260200160608152602001600081525090565b60208301805160ff8082168352606084019290925290600882901c1667ffffffffffffffff811115610a5657610a56612d0c565b604051908082528060200260200182016040528015610a7f578160200160208202803683370190505b50602083015260ff601082901c81166080840152601882901c16606060008267ffffffffffffffff811115610ab657610ab6612d0c565b604051908082528060200260200182016040528015610adf578160200160208202803683370190505b5090506020870151602002604001870160005b84811015610b19578160208202602001840152815160200182019150600181019050610af2565b505060408501525091949350505050565b60208281015183516040850151848402018301518051606087015160a088015160009687968796879695948301938284019391820290920101906002015b84891015610de6576003890198508886015180601f1a975061ffff8160081c169850506006881015610d5e5787610bad57866020028401518252602082019150610d71565b6001881415610bca57602087028301518252602082019150610d71565b6002881415610c57578c518760200210610c40576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600e60248201527f434f4e544558545f4c454e47544800000000000000000000000000000000000060448201526064016107d8565b866020026020018d01518252602082019150610d71565b6003881415610c9f576000610c8d6040805180820182526000808252602091820181905282518084019093528083529082015290565b51880154835250602090910190610d71565b6004881415610cbb57610cb48d8d848a611115565b9150610d71565b606087610ce9578c604051602001610cd391906135e6565b6040516020818303038152906040529050610d48565b6001881415610d0257610cfb8d611282565b9050610d48565b6002881415610d1e576020808e0151604051610cd39201612fad565b6003881415610d48578c516040805160208101929092520160405160208183030381529060405290505b805115610d5857610d58816113bf565b50610d71565b87610d6d888463ffffffff8416565b9250505b60208c0151518c511115610de1576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600e60248201527f535441434b5f4f564552464c4f5700000000000000000000000000000000000060448201526064016107d8565b610b68565b6020838303048c52509750505050505050505b9392505050565b60008054610100900460ff1615610eb7578160ff166001148015610e235750303b155b610eaf576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a656400000000000000000000000000000000000060648201526084016107d8565b506000919050565b60005460ff808416911610610f4e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a656400000000000000000000000000000000000060648201526084016107d8565b50600080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001660ff92909216919091179055600190565b600080610fb183604051602001610f9d91906136eb565b604051602081830303815290604052611451565b90508051602082016000f0915073ffffffffffffffffffffffffffffffffffffffff821661100b576040517f08d4abb600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b50919050565b600061101c8361147d565b8015610df95750610df983836114e1565b6060833b8061104c575050604080516020810190915260008152610df9565b8084111561106a575050604080516020810190915260008152610df9565b838310156110b5576040517f2c4a89fa0000000000000000000000000000000000000000000000000000000081526004810182905260248101859052604481018490526064016107d8565b83830384820360008282106110ca57826110cc565b815b60408051603f83017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0168101909152818152955090508087602087018a3c505050509392505050565b600060078216600383811c1682808261115457507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff905061010061119f565b826001141561117857506fffffffffffffffffffffffffffffffff9050608061119f565b8260021415611194575067ffffffffffffffff9050604061119f565b5063ffffffff905060205b6001600587901c0160008167ffffffffffffffff8111156111c2576111c2612d0c565b6040519080825280602002602001820160405280156111eb578160200160208202803683370190505b50905060208082019083028a03815b8b8210156112125781518152602091820191016111fa565b505060608b015160808c015160209081029091010160005b6101008110156112705760208502830182845b82811015611259578051841c8a1682526020918201910161123d565b5050506112678e8e8b610b2a565b9b50850161122a565b50999c9b505050505050505050505050565b606060008260600151905060006018846040015151901b60108560800151901b6008866020015151901b866060015151171717905060008160001b836040516020016112ce9190612fad565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529082905261130a9291602001612fe3565b604051602081830303815290604052905060005b8560400151518110156113b65781866040015182815181106113425761134261304f565b60200260200101515160001b876040015183815181106113645761136461304f565b602002602001015160405160200161137e93929190613711565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0818403018152919052915060010161131e565b50949350505050565b61144e816040516024016113d39190612f9a565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f0be77f56000000000000000000000000000000000000000000000000000000001790526126f7565b50565b6060815182604051602001611467929190613748565b6040516020818303038152906040529050919050565b60006114a9827f01ffc9a7000000000000000000000000000000000000000000000000000000006114e1565b801561035f57506114da827fffffffff000000000000000000000000000000000000000000000000000000006114e1565b1592915050565b604080517fffffffff00000000000000000000000000000000000000000000000000000000831660248083019190915282518083039091018152604490910182526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f01ffc9a7000000000000000000000000000000000000000000000000000000001790529051600091908290819073ffffffffffffffffffffffffffffffffffffffff8716906175309061159b9086906137df565b6000604051808303818686fa925050503d80600081146115d7576040519150601f19603f3d011682016040523d82523d6000602084013e6115dc565b606091505b50915091506020815110156115f7576000935050505061035f565b81801561161357508080602001905181019061161391906137f1565b9695505050505050565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc0810180517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe090920180516040517f70a0823100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff808316600483015292946000949390929185918416906370a08231906024015b602060405180830381865afa1580156116e0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117049190613813565b9093525092949350505050565b60008060006020840391508151905060008173ffffffffffffffffffffffffffffffffffffffff166318160ddd6040518163ffffffff1660e01b8152600401602060405180830381865afa15801561176d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117919190613813565b90925250919392505050565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0810180517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc0830180517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0909401516040517f4ee2cd7e00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff808716600483015260248201839052929560009594939092918691851690634ee2cd7e906044015b602060405180830381865afa15801561188c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906118b09190613813565b909452509395945050505050565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc0810180517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe090920180516040517f981b24d000000000000000000000000000000000000000000000000000000000815260048101829052919360009392909190849073ffffffffffffffffffffffffffffffffffffffff84169063981b24d0906024016116c3565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc0810180517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe090920180516040517f6352211e00000000000000000000000000000000000000000000000000000000815260048101829052919360009392909190849073ffffffffffffffffffffffffffffffffffffffff841690636352211e90602401602060405180830381865afa158015611a28573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611a4c919061382c565b73ffffffffffffffffffffffffffffffffffffffff169093525092949350505050565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0810180517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc0830180517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0909401516040517efdd58e00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff80871660048301526024820183905292956000959493909291869185169062fdd58e9060440161186f565b60008060008467ffffffffffffffff811115611b6157611b61612d0c565b604051908082528060200260200182016040528015611b8a578160200160208202803683370190505b50905060008567ffffffffffffffff811115611ba857611ba8612d0c565b604051908082528060200260200182016040528015611bd1578160200160208202803683370190505b506040870286037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe081018051909550919250602080890282019085015b81831015611c26578251815260209283019201611c0e565b5050602088028101602084015b81831015611c4b578251815260209283019201611c33565b50506040517f4e1273f40000000000000000000000000000000000000000000000000000000081526000915073ffffffffffffffffffffffffffffffffffffffff831690634e1273f490611ca59087908790600401613849565b600060405180830381865afa158015611cc2573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0168201604052611d0891908101906138ac565b9050846020820160208a0281015b80821015611d31578151835260209283019290910190611d16565b50909998505050505050505050565b438152602001919050565b338152602001919050565b308152602001919050565b428152602001919050565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08101805160009190826117918287612718565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc0810180517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe090920180519092600092918361170482611e00858a612718565b90612799565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc0810180517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe090920180519092600092918361170482611e66858a612718565b906127b8565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe081018051600091908261179182876127cd565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08101805160009190826117918287612818565b6000602083028203805b83811015611efe5780518015611ef5578252611efe565b50602001611ede565b506020019392505050565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0810180511560200282017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc090810151909152018092915050565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0810180517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc09092018051909214909152919050565b6000602083028203805b83811015611efe578051611fdb5760008252611efe565b602001611fc4565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0810180517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc0909201805192909211909152919050565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe081018051159052919050565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0810180517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc0909201805192909210909152919050565b6020828102820380516000928201835b85821080156120fc57507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff83105b1561211b575080516020909101906121148382612876565b92506120ce565b505081526020019392505050565b6020828102820380516000928201835b858210801561216757507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff83105b1561211b5750805160209091019061217f83826128b2565b9250612139565b6020828102820380516000928201835b85821080156121a55750826000105b1561211b575080516020909101906121bd83826128e1565b9250612196565b600060208302820380516000602083015b8581101561211b57805183019150828210156121f057600080fd5b90915081906020016121d5565b600060208302820380516000602083015b8581101561211b57805191508161222457600080fd5b918190049160200161220e565b6020828102820380516000928201835b8582101561211b5750805160209091019061225c8184613a5d565b9250612241565b6020828102820380516000928201835b8582101561211b575080518281111561228a578092505b602082019150612273565b6020828102820380516000928201835b8582101561211b57508051828110156122bc578092505b6020820191506122a5565b600060208302820380516000602083015b8581101561211b5780519150816122ee57600080fd5b91819006916020016122d8565b60006020830282038051600080602084015b8681101561233e57831561233657805192508284029150828483041461233257600080fd5b8193505b60200161230d565b50505081526020019392505050565b600060208302820380516000602083015b8581101561211b578051830391508282111561237957600080fd5b909150819060200161235e565b8190037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc0810180517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe090920180518482526040517f88d686040000000000000000000000000000000000000000000000000000000081529193600093929091908590859073ffffffffffffffffffffffffffffffffffffffff8516906388d686049061186f9086908690600401613a69565b8190037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0810180517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc08301517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe090930180518582526040517fcaa0eb3b000000000000000000000000000000000000000000000000000000008152919460009493929091908690869073ffffffffffffffffffffffffffffffffffffffff86169063caa0eb3b9061251190879087908790600401613a98565b602060405180830381865afa15801561252e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906125529190613813565b8652505060209093019695505050505050565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc0810180517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe090920180519092600092918361170483836128f7565b6000600783901c6003600585901c16601f851683808267ffffffffffffffff8111156125ef576125ef612d0c565b604051908082528060200260200182016040528015612618578160200160208202803683370190505b509050600060206001850102880392506020840283018360005b8282101561265457815181602001860152602082019150602081019050612632565b5050519050600061266783838989612956565b845250506020909101979650505050505050565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc0810180517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe09092018051909260009291600f80871691600488901c90911690856126e885858585612aa6565b90955250949695505050505050565b80516a636f6e736f6c652e6c6f67602083016000808483855afa5050505050565b600080826012141561272d578391505061035f565b82601211156127595750601282900361274781600a613a5d565b6127519085613acd565b91505061035f565b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffee820161278881600a613a5d565b6127519085613b0a565b5092915050565b6000816127ae670de0b6b3a764000085613acd565b610df99190613b0a565b6000670de0b6b3a76400006127ae8385613acd565b600081810b6127dd57508161035f565b60008260000b1315612805576127f482600a613b45565b6127fe9084613acd565b905061035f565b60ff60008390031661278881600a613a5d565b600080601283141561282d578391505061035f565b82601211156128475750601282900361278881600a613a5d565b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffee820161274781600a613a5d565b600082820183811061288857806128aa565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff5b949350505050565b6000826128c15750600061035f565b828202828482816128d4576128d46136bc565b04141561288857806128aa565b60008183116128f1576000610df9565b50900390565b60008060015b6008811161294e5760006129118683612b4c565b9050600061291f8684612b4c565b9050600061292d83836128e1565b905061293d856001860383612bf9565b945050600190920191506128fd9050565b509392505050565b835160009081908190819060015b60088111612a985760009250828761299d57507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6129a1565b5060005b60005b83811015612a56576129cf8c82815181106129c1576129c161304f565b602002602001015184612b4c565b95508a8611612a2157886129ee576129e78683612c82565b9150612a18565b6001891415612a01576129e78683612c98565b600289148015612a0f575084155b15612a18578591505b60019450612a4e565b89612a4e577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9150612a56565b6001016129a4565b5083612a7f57507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff5b612a8d866001840383612bf9565b955050600101612964565b509298975050505050505050565b6000826008811115612b14576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600860248201527f4d41585f5449455200000000000000000000000000000000000000000000000060448201526064016107d8565b6000855b85811015612b405763ffffffff6020820290811b199890981685891b17979150600101612b18565b50959695505050505050565b6000816008811115612bba576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600860248201527f4d41585f5449455200000000000000000000000000000000000000000000000060448201526064016107d8565b82612bc85760009150612792565b50507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff016020021c63ffffffff1690565b6000826008811115612c67576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600860248201527f4d41585f5449455200000000000000000000000000000000000000000000000060448201526064016107d8565b505063ffffffff602090920291821b199290921691901b1790565b6000818310612c915781610df9565b5090919050565b600081831015612c915781610df9565b600060208284031215612cba57600080fd5b81357fffffffff0000000000000000000000000000000000000000000000000000000081168114610df957600080fd5b73ffffffffffffffffffffffffffffffffffffffff8116811461144e57600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016810167ffffffffffffffff81118282101715612d8257612d82612d0c565b604052919050565b600067ffffffffffffffff821115612da457612da4612d0c565b5060051b60200190565b60008060408385031215612dc157600080fd5b8235612dcc81612cea565b915060208381013567ffffffffffffffff811115612de957600080fd5b8401601f81018613612dfa57600080fd5b8035612e0d612e0882612d8a565b612d3b565b81815260059190911b82018301908381019088831115612e2c57600080fd5b928401925b82841015612e4a57833582529284019290840190612e31565b80955050505050509250929050565b600060208284031215612e6b57600080fd5b813567ffffffffffffffff811115612e8257600080fd5b820160408185031215610df957600080fd5b60008060008060608587031215612eaa57600080fd5b8435612eb581612cea565b935060208501359250604085013567ffffffffffffffff80821115612ed957600080fd5b818701915087601f830112612eed57600080fd5b813581811115612efc57600080fd5b8860208260051b8501011115612f1157600080fd5b95989497505060200194505050565b60005b83811015612f3b578181015183820152602001612f23565b83811115612f4a576000848401525b50505050565b60008151808452612f68816020860160208601612f20565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b602081526000610df96020830184612f50565b815160009082906020808601845b83811015612fd757815185529382019390820190600101612fbb565b50929695505050505050565b82815260008251612ffb816020850160208701612f20565b919091016020019392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60008282101561304a5761304a613009565b500390565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600082357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc18336030181126130b257600080fd5b9190910192915050565b60008083357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe18436030181126130f157600080fd5b830160208101925035905067ffffffffffffffff81111561311157600080fd5b8060051b360383131561312357600080fd5b9250929050565b8183528181602085013750600060208284010152600060207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f840116840101905092915050565b81835260007f07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8311156131a557600080fd5b8260051b8083602087013760009401602001938452509192915050565b6000604083016131d283846130bc565b604086528281845260608701905060608260051b88010193508260005b8381101561329c577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa089870301835281357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe186360301811261325057600080fd5b85018035602067ffffffffffffffff82111561326b57600080fd5b81360388131561327a57600080fd5b613287898383860161312a565b985094850194939093019250506001016131ef565b50505050506132ae60208401846130bc565b8583036020870152611613838284613173565b6000606073ffffffffffffffffffffffffffffffffffffffff86168352602081818501526132f1828501876131c2565b84810360408681019190915286518083528388019284019060005b81811015613362578451805184528681015187850152848101518585015287810151888501526080808201519085015260a0808201519085015260c090810151908401529385019360e09092019160010161330c565b50909a9950505050505050505050565b60006020828403121561338457600080fd5b815167ffffffffffffffff8082111561339c57600080fd5b818401915084601f8301126133b057600080fd5b8151818111156133c2576133c2612d0c565b6133f360207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f84011601612d3b565b915080825285602082850101111561340a57600080fd5b6113b6816020840160208601612f20565b60008083357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe184360301811261345057600080fd5b83018035915067ffffffffffffffff82111561346b57600080fd5b6020019150600581901b360382131561312357600080fd5b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8214156134b5576134b5613009565b5060010190565b73ffffffffffffffffffffffffffffffffffffffff831681526040602082015281356040820152600060208301357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc184360301811261351a57600080fd5b60406060840152613530608084018583016131c2565b95945050505050565b60007f07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff83111561356857600080fd5b8260051b80858437600092019182525092915050565b8381528260208201526000825161359c816040850160208701612f20565b91909101604001949350505050565b600081518084526020808501945080840160005b838110156135db578151875295820195908201906001016135bf565b509495945050505050565b600060208083528351818401528084015160a0604085015261360b60c08501826135ab565b905060408501517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0808684030160608701528282518085528585019150858160051b860101868501945060005b828110156136845784878303018452613672828751612f50565b95880195938801939150600101613658565b5060608a01519650838982030160808a01526136a081886135ab565b9650505050505050608084015160a08401528091505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b6000815260008251613704816001850160208701612f20565b9190910160010192915050565b60008451613723818460208901612f20565b8201848152835161373b816020808501908801612f20565b0160200195945050505050565b7f630000000000000000000000000000000000000000000000000000000000000081527fffffffff000000000000000000000000000000000000000000000000000000008360e01b1660018201527f80600e6000396000f300000000000000000000000000000000000000000000006005820152600082516137d181600e850160208701612f20565b91909101600e019392505050565b600082516130b2818460208701612f20565b60006020828403121561380357600080fd5b81518015158114610df957600080fd5b60006020828403121561382557600080fd5b5051919050565b60006020828403121561383e57600080fd5b8151610df981612cea565b604080825283519082018190526000906020906060840190828701845b8281101561389857815173ffffffffffffffffffffffffffffffffffffffff1684529284019290840190600101613866565b5050508381038285015261161381866135ab565b600060208083850312156138bf57600080fd5b825167ffffffffffffffff8111156138d657600080fd5b8301601f810185136138e757600080fd5b80516138f5612e0882612d8a565b81815260059190911b8201830190838101908783111561391457600080fd5b928401925b8284101561393257835182529284019290840190613919565b979650505050505050565b600181815b8085111561399657817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0482111561397c5761397c613009565b8085161561398957918102915b93841c9390800290613942565b509250929050565b6000826139ad5750600161035f565b816139ba5750600061035f565b81600181146139d057600281146139da576139f6565b600191505061035f565b60ff8411156139eb576139eb613009565b50506001821b61035f565b5060208310610133831016604e8410600b8410161715613a19575081810a61035f565b613a23838361393d565b807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04821115613a5557613a55613009565b029392505050565b6000610df9838361399e565b73ffffffffffffffffffffffffffffffffffffffff831681526040602082015260006128aa60408301846135ab565b73ffffffffffffffffffffffffffffffffffffffff8416815282602082015260606040820152600061353060608301846135ab565b6000817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615613b0557613b05613009565b500290565b600082613b40577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b500490565b6000610df960ff84168361399e56fea2646970667358221220a37f2cb5d78269361959ff85181f07b524e2e4ebabc0768aad4edd04082b53e364736f6c634300080a0033";

type CombineTierConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CombineTierConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class CombineTier__factory extends ContractFactory {
  constructor(...args: CombineTierConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    vmStateBuilder_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<CombineTier> {
    return super.deploy(
      vmStateBuilder_,
      overrides || {}
    ) as Promise<CombineTier>;
  }
  getDeployTransaction(
    vmStateBuilder_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(vmStateBuilder_, overrides || {});
  }
  attach(address: string): CombineTier {
    return super.attach(address) as CombineTier;
  }
  connect(signer: Signer): CombineTier__factory {
    return super.connect(signer) as CombineTier__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CombineTierInterface {
    return new utils.Interface(_abi) as CombineTierInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CombineTier {
    return new Contract(address, _abi, signerOrProvider) as CombineTier;
  }
}
