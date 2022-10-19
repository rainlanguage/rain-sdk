/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { ReserveNFT, ReserveNFTInterface } from "../ReserveNFT";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account_",
        type: "address",
      },
    ],
    name: "addFreezable",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
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
        name: "",
        type: "address",
      },
    ],
    name: "freezables",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
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
  {
    inputs: [],
    name: "maxSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
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
        name: "_address",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
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
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
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
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060408051808201825260128152712727a710232aa723a4a12622902a27a5a2a760711b60208083019182528351808501909452600384526213919560ea1b90840152815191929162000067916000916200008c565b5080516200007d9060019060208401906200008c565b5050612710600855506200016f565b8280546200009a9062000132565b90600052602060002090601f016020900481019282620000be576000855562000109565b82601f10620000d957805160ff191683800117855562000109565b8280016001018555821562000109579182015b8281111562000109578251825591602001919060010190620000ec565b50620001179291506200011b565b5090565b5b808211156200011757600081556001016200011c565b600181811c908216806200014757607f821691505b602082108114156200016957634e487b7160e01b600052602260045260246000fd5b50919050565b611982806200017f6000396000f3fe608060405234801561001057600080fd5b50600436106101365760003560e01c80635bb9058b116100b2578063a22cb46511610081578063c87b56dd11610066578063c87b56dd146102e9578063d5abeb011461032f578063e985e9c51461033857600080fd5b8063a22cb465146102c3578063b88d4fde146102d657600080fd5b80635bb9058b146102385780636352211e1461029557806370a08231146102a857806395d89b41146102bb57600080fd5b806318160ddd1161010957806340c10f19116100ee57806340c10f19146101ef57806342842e0e1461020257806348422faa1461021557600080fd5b806318160ddd146101c557806323b872dd146101dc57600080fd5b806301ffc9a71461013b57806306fdde0314610163578063081812fc14610178578063095ea7b3146101b0575b600080fd5b61014e6101493660046114fe565b610381565b60405190151581526020015b60405180910390f35b61016b610466565b60405161015a919061158d565b61018b6101863660046115a0565b6104f8565b60405173ffffffffffffffffffffffffffffffffffffffff909116815260200161015a565b6101c36101be3660046115e2565b61052c565b005b6101ce60075481565b60405190815260200161015a565b6101c36101ea36600461160c565b6106be565b6101c36101fd3660046115e2565b61075f565b6101c361021036600461160c565b610816565b61014e610223366004611648565b60066020526000908152604090205460ff1681565b6101c3610246366004611648565b73ffffffffffffffffffffffffffffffffffffffff16600090815260066020526040902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00166001179055565b61018b6102a33660046115a0565b610831565b6101ce6102b6366004611648565b6108bd565b61016b61098b565b6101c36102d1366004611663565b61099a565b6101c36102e43660046116ce565b6109a9565b61016b6102f73660046115a0565b5060408051808201909152600381527f5552490000000000000000000000000000000000000000000000000000000000602082015290565b6101ce60085481565b61014e6103463660046117c8565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260056020908152604080832093909416825291909152205460ff1690565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167f80ac58cd00000000000000000000000000000000000000000000000000000000148061041457507fffffffff0000000000000000000000000000000000000000000000000000000082167f5b5e139f00000000000000000000000000000000000000000000000000000000145b8061046057507f01ffc9a7000000000000000000000000000000000000000000000000000000007fffffffff000000000000000000000000000000000000000000000000000000008316145b92915050565b606060008054610475906117fb565b80601f01602080910402602001604051908101604052809291908181526020018280546104a1906117fb565b80156104ee5780601f106104c3576101008083540402835291602001916104ee565b820191906000526020600020905b8154815290600101906020018083116104d157829003601f168201915b5050505050905090565b600061050382610a51565b5060009081526004602052604090205473ffffffffffffffffffffffffffffffffffffffff1690565b600061053782610831565b90508073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156105fa576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e6560448201527f720000000000000000000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff8216148061062357506106238133610346565b6106af576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603e60248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60448201527f6b656e206f776e6572206e6f7220617070726f76656420666f7220616c6c000060648201526084016105f1565b6106b98383610adf565b505050565b6106c83382610b7f565b610754576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602e60248201527f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560448201527f72206e6f7220617070726f76656400000000000000000000000000000000000060648201526084016105f1565b6106b9838383610c3f565b60085481600754610770919061187e565b11156107d8576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f4d6178206c696d697420726561636865642e000000000000000000000000000060448201526064016105f1565b60005b818110156106b957600780549060006107f383611896565b919050555061080483600754610eb1565b61080f81600161187e565b90506107db565b6106b9838383604051806020016040528060008152506109a9565b60008181526002602052604081205473ffffffffffffffffffffffffffffffffffffffff1680610460576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f4552433732313a20696e76616c696420746f6b656e204944000000000000000060448201526064016105f1565b600073ffffffffffffffffffffffffffffffffffffffff8216610962576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602960248201527f4552433732313a2061646472657373207a65726f206973206e6f74206120766160448201527f6c6964206f776e6572000000000000000000000000000000000000000000000060648201526084016105f1565b5073ffffffffffffffffffffffffffffffffffffffff1660009081526003602052604090205490565b606060018054610475906117fb565b6109a533838361107f565b5050565b6109b33383610b7f565b610a3f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602e60248201527f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560448201527f72206e6f7220617070726f76656400000000000000000000000000000000000060648201526084016105f1565b610a4b848484846111ad565b50505050565b60008181526002602052604090205473ffffffffffffffffffffffffffffffffffffffff16610adc576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f4552433732313a20696e76616c696420746f6b656e204944000000000000000060448201526064016105f1565b50565b600081815260046020526040902080547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff84169081179091558190610b3982610831565b73ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b600080610b8b83610831565b90508073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161480610bf9575073ffffffffffffffffffffffffffffffffffffffff80821660009081526005602090815260408083209388168352929052205460ff165b80610c3757508373ffffffffffffffffffffffffffffffffffffffff16610c1f846104f8565b73ffffffffffffffffffffffffffffffffffffffff16145b949350505050565b8273ffffffffffffffffffffffffffffffffffffffff16610c5f82610831565b73ffffffffffffffffffffffffffffffffffffffff1614610d02576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f4552433732313a207472616e736665722066726f6d20696e636f72726563742060448201527f6f776e657200000000000000000000000000000000000000000000000000000060648201526084016105f1565b73ffffffffffffffffffffffffffffffffffffffff8216610da4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f2061646460448201527f726573730000000000000000000000000000000000000000000000000000000060648201526084016105f1565b610daf838383611250565b610dba600082610adf565b73ffffffffffffffffffffffffffffffffffffffff83166000908152600360205260408120805460019290610df09084906118cf565b909155505073ffffffffffffffffffffffffffffffffffffffff82166000908152600360205260408120805460019290610e2b90849061187e565b909155505060008181526002602052604080822080547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff86811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b73ffffffffffffffffffffffffffffffffffffffff8216610f2e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f206164647265737360448201526064016105f1565b60008181526002602052604090205473ffffffffffffffffffffffffffffffffffffffff1615610fba576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e7465640000000060448201526064016105f1565b610fc660008383611250565b73ffffffffffffffffffffffffffffffffffffffff82166000908152600360205260408120805460019290610ffc90849061187e565b909155505060008181526002602052604080822080547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415611115576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c65720000000000000060448201526064016105f1565b73ffffffffffffffffffffffffffffffffffffffff83811660008181526005602090815260408083209487168084529482529182902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b6111b8848484610c3f565b6111c4848484846112e0565b610a4b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603260248201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560448201527f63656976657220696d706c656d656e746572000000000000000000000000000060648201526084016105f1565b73ffffffffffffffffffffffffffffffffffffffff821660009081526006602052604090205460ff16156106b9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600660248201527f46524f5a454e000000000000000000000000000000000000000000000000000060448201526064016105f1565b600073ffffffffffffffffffffffffffffffffffffffff84163b156114c5576040517f150b7a0200000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff85169063150b7a02906113579033908990889088906004016118e6565b6020604051808303816000875af19250505080156113b0575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01682019092526113ad9181019061192f565b60015b61147a573d8080156113de576040519150601f19603f3d011682016040523d82523d6000602084013e6113e3565b606091505b508051611472576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603260248201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560448201527f63656976657220696d706c656d656e746572000000000000000000000000000060648201526084016105f1565b805181602001fd5b7fffffffff00000000000000000000000000000000000000000000000000000000167f150b7a0200000000000000000000000000000000000000000000000000000000149050610c37565b506001949350505050565b7fffffffff0000000000000000000000000000000000000000000000000000000081168114610adc57600080fd5b60006020828403121561151057600080fd5b813561151b816114d0565b9392505050565b6000815180845260005b818110156115485760208185018101518683018201520161152c565b8181111561155a576000602083870101525b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b60208152600061151b6020830184611522565b6000602082840312156115b257600080fd5b5035919050565b803573ffffffffffffffffffffffffffffffffffffffff811681146115dd57600080fd5b919050565b600080604083850312156115f557600080fd5b6115fe836115b9565b946020939093013593505050565b60008060006060848603121561162157600080fd5b61162a846115b9565b9250611638602085016115b9565b9150604084013590509250925092565b60006020828403121561165a57600080fd5b61151b826115b9565b6000806040838503121561167657600080fd5b61167f836115b9565b91506020830135801515811461169457600080fd5b809150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080600080608085870312156116e457600080fd5b6116ed856115b9565b93506116fb602086016115b9565b925060408501359150606085013567ffffffffffffffff8082111561171f57600080fd5b818701915087601f83011261173357600080fd5b8135818111156117455761174561169f565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f0116810190838211818310171561178b5761178b61169f565b816040528281528a60208487010111156117a457600080fd5b82602086016020830137600060208483010152809550505050505092959194509250565b600080604083850312156117db57600080fd5b6117e4836115b9565b91506117f2602084016115b9565b90509250929050565b600181811c9082168061180f57607f821691505b60208210811415611849577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600082198211156118915761189161184f565b500190565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8214156118c8576118c861184f565b5060010190565b6000828210156118e1576118e161184f565b500390565b600073ffffffffffffffffffffffffffffffffffffffff8087168352808616602084015250836040830152608060608301526119256080830184611522565b9695505050505050565b60006020828403121561194157600080fd5b815161151b816114d056fea2646970667358221220067a2cddf2fe8251005b821085fa6d7acbb4e391e62e58c529ba9de4682e1a3764736f6c634300080a0033";

type ReserveNFTConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ReserveNFTConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ReserveNFT__factory extends ContractFactory {
  constructor(...args: ReserveNFTConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ReserveNFT> {
    return super.deploy(overrides || {}) as Promise<ReserveNFT>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): ReserveNFT {
    return super.attach(address) as ReserveNFT;
  }
  connect(signer: Signer): ReserveNFT__factory {
    return super.connect(signer) as ReserveNFT__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ReserveNFTInterface {
    return new utils.Interface(_abi) as ReserveNFTInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ReserveNFT {
    return new Contract(address, _abi, signerOrProvider) as ReserveNFT;
  }
}