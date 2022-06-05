/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  RedeemableERC20Reentrant,
  RedeemableERC20ReentrantInterface,
} from "../RedeemableERC20Reentrant";

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
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
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
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "DECIMALS",
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
    inputs: [],
    name: "TOTAL_SUPPLY",
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
        internalType: "contract RedeemableERC20",
        name: "redeemableERC20_",
        type: "address",
      },
    ],
    name: "addReentrantTarget",
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
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
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
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
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
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
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
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
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
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604080518082018252600b81526a55534420436c617373696360a81b602080830191825283518085019094526005845264555344434360d81b908401528151919291620000629160039162000305565b5080516200007890600490602084019062000305565b505050620000a33360066009620000909190620003c1565b6200009d90600a620004db565b620000a9565b62000596565b6001600160a01b038216620001055760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064015b60405180910390fd5b6200011360008383620001a0565b8060026000828254620001279190620003c1565b90915550506001600160a01b0382166000908152602081905260408120805483929062000156908490620003c1565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b620001b88383836200029960201b620005c91760201c565b6001600160a01b03831615801590620001de57506006546001600160a01b038481169116145b1562000294576040805160018082528183019092526000916020808301908036833701905050905030816000815181106200021d576200021d620004f0565b6001600160a01b039283166020918202929092010152600654604051637b3bef4b60e11b815291169063f677de96906200025e908490869060040162000506565b600060405180830381600087803b1580156200027957600080fd5b505af11580156200028e573d6000803e3d6000fd5b50505050505b505050565b620002b18383836200029460201b620006591760201c565b6001600160a01b03821660009081526005602052604090205460ff1615620002945760405162461bcd60e51b8152602060048201526006602482015265232927ad22a760d11b6044820152606401620000fc565b828054620003139062000559565b90600052602060002090601f01602090048101928262000337576000855562000382565b82601f106200035257805160ff191683800117855562000382565b8280016001018555821562000382579182015b828111156200038257825182559160200191906001019062000365565b506200039092915062000394565b5090565b5b8082111562000390576000815560010162000395565b634e487b7160e01b600052601160045260246000fd5b60008219821115620003d757620003d7620003ab565b500190565b600181815b808511156200041d578160001904821115620004015762000401620003ab565b808516156200040f57918102915b93841c9390800290620003e1565b509250929050565b6000826200043657506001620004d5565b816200044557506000620004d5565b81600181146200045e5760028114620004695762000489565b6001915050620004d5565b60ff8411156200047d576200047d620003ab565b50506001821b620004d5565b5060208310610133831016604e8410600b8410161715620004ae575081810a620004d5565b620004ba8383620003dc565b8060001904821115620004d157620004d1620003ab565b0290505b92915050565b6000620004e9838362000425565b9392505050565b634e487b7160e01b600052603260045260246000fd5b604080825283519082018190526000906020906060840190828701845b828110156200054a5781516001600160a01b03168452928401929084019060010162000523565b50505092019290925292915050565b600181811c908216806200056e57607f821691505b602082108114156200059057634e487b7160e01b600052602260045260246000fd5b50919050565b6112da80620005a66000396000f3fe608060405234801561001057600080fd5b50600436106101365760003560e01c806348ea30da116100b2578063902d55a511610081578063a457c2d711610066578063a457c2d71461030e578063a9059cbb14610321578063dd62ed3e1461033457600080fd5b8063902d55a5146102fe57806395d89b411461030657600080fd5b806348ea30da146102035780635bb9058b1461025857806370a08231146102b557806379cc6790146102eb57600080fd5b80632e0f26251161010957806339509351116100ee57806339509351146101b857806342966c68146101cb57806348422faa146101e057600080fd5b80632e0f2625146101a1578063313ce567146101a957600080fd5b806306fdde031461013b578063095ea7b31461015957806318160ddd1461017c57806323b872dd1461018e575b600080fd5b61014361037a565b6040516101509190610ec1565b60405180910390f35b61016c610167366004610f56565b61040c565b6040519015158152602001610150565b6002545b604051908152602001610150565b61016c61019c366004610f82565b610426565b610180600681565b60405160068152602001610150565b61016c6101c6366004610f56565b61044a565b6101de6101d9366004610fc3565b610496565b005b61016c6101ee366004610fdc565b60056020526000908152604090205460ff1681565b6101de610211366004610fdc565b600680547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff92909216919091179055565b6101de610266366004610fdc565b73ffffffffffffffffffffffffffffffffffffffff16600090815260056020526040902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00166001179055565b6101806102c3366004610fdc565b73ffffffffffffffffffffffffffffffffffffffff1660009081526020819052604090205490565b6101de6102f9366004610f56565b6104a3565b6101806104bc565b6101436104d6565b61016c61031c366004610f56565b6104e5565b61016c61032f366004610f56565b6105bb565b610180610342366004611000565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260016020908152604080832093909416825291909152205490565b60606003805461038990611039565b80601f01602080910402602001604051908101604052809291908181526020018280546103b590611039565b80156104025780601f106103d757610100808354040283529160200191610402565b820191906000526020600020905b8154815290600101906020018083116103e557829003601f168201915b5050505050905090565b60003361041a81858561065e565b60019150505b92915050565b600033610434858285610811565b61043f8585856108e8565b506001949350505050565b33600081815260016020908152604080832073ffffffffffffffffffffffffffffffffffffffff8716845290915281205490919061041a90829086906104919087906110bc565b61065e565b6104a03382610ba6565b50565b6104ae823383610811565b6104b88282610ba6565b5050565b6104c8600660096110bc565b6104d390600a6111f4565b81565b60606004805461038990611039565b33600081815260016020908152604080832073ffffffffffffffffffffffffffffffffffffffff87168452909152812054909190838110156105ae576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760448201527f207a65726f00000000000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b61043f828686840361065e565b60003361041a8185856108e8565b73ffffffffffffffffffffffffffffffffffffffff821660009081526005602052604090205460ff1615610659576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600660248201527f46524f5a454e000000000000000000000000000000000000000000000000000060448201526064016105a5565b505050565b73ffffffffffffffffffffffffffffffffffffffff8316610700576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460448201527f726573730000000000000000000000000000000000000000000000000000000060648201526084016105a5565b73ffffffffffffffffffffffffffffffffffffffff82166107a3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f20616464726560448201527f737300000000000000000000000000000000000000000000000000000000000060648201526084016105a5565b73ffffffffffffffffffffffffffffffffffffffff83811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b73ffffffffffffffffffffffffffffffffffffffff8381166000908152600160209081526040808320938616835292905220547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81146108e257818110156108d5576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e636500000060448201526064016105a5565b6108e2848484840361065e565b50505050565b73ffffffffffffffffffffffffffffffffffffffff831661098b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f20616460448201527f647265737300000000000000000000000000000000000000000000000000000060648201526084016105a5565b73ffffffffffffffffffffffffffffffffffffffff8216610a2e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201527f657373000000000000000000000000000000000000000000000000000000000060648201526084016105a5565b610a39838383610d9f565b73ffffffffffffffffffffffffffffffffffffffff831660009081526020819052604090205481811015610aef576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206260448201527f616c616e6365000000000000000000000000000000000000000000000000000060648201526084016105a5565b73ffffffffffffffffffffffffffffffffffffffff808516600090815260208190526040808220858503905591851681529081208054849290610b339084906110bc565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610b9991815260200190565b60405180910390a36108e2565b73ffffffffffffffffffffffffffffffffffffffff8216610c49576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f2061646472657360448201527f730000000000000000000000000000000000000000000000000000000000000060648201526084016105a5565b610c5582600083610d9f565b73ffffffffffffffffffffffffffffffffffffffff821660009081526020819052604090205481811015610d0b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e60448201527f636500000000000000000000000000000000000000000000000000000000000060648201526084016105a5565b73ffffffffffffffffffffffffffffffffffffffff83166000908152602081905260408120838303905560028054849290610d47908490611200565b909155505060405182815260009073ffffffffffffffffffffffffffffffffffffffff8516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a3505050565b610daa8383836105c9565b73ffffffffffffffffffffffffffffffffffffffff831615801590610de9575060065473ffffffffffffffffffffffffffffffffffffffff8481169116145b1561065957604080516001808252818301909252600091602080830190803683370190505090503081600081518110610e2457610e24611217565b73ffffffffffffffffffffffffffffffffffffffff92831660209182029290920101526006546040517ff677de9600000000000000000000000000000000000000000000000000000000815291169063f677de9690610e899084908690600401611246565b600060405180830381600087803b158015610ea357600080fd5b505af1158015610eb7573d6000803e3d6000fd5b5050505050505050565b600060208083528351808285015260005b81811015610eee57858101830151858201604001528201610ed2565b81811115610f00576000604083870101525b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016929092016040019392505050565b73ffffffffffffffffffffffffffffffffffffffff811681146104a057600080fd5b60008060408385031215610f6957600080fd5b8235610f7481610f34565b946020939093013593505050565b600080600060608486031215610f9757600080fd5b8335610fa281610f34565b92506020840135610fb281610f34565b929592945050506040919091013590565b600060208284031215610fd557600080fd5b5035919050565b600060208284031215610fee57600080fd5b8135610ff981610f34565b9392505050565b6000806040838503121561101357600080fd5b823561101e81610f34565b9150602083013561102e81610f34565b809150509250929050565b600181811c9082168061104d57607f821691505b60208210811415611087577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600082198211156110cf576110cf61108d565b500190565b600181815b8085111561112d57817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff048211156111135761111361108d565b8085161561112057918102915b93841c93908002906110d9565b509250929050565b60008261114457506001610420565b8161115157506000610420565b816001811461116757600281146111715761118d565b6001915050610420565b60ff8411156111825761118261108d565b50506001821b610420565b5060208310610133831016604e8410600b84101617156111b0575081810a610420565b6111ba83836110d4565b807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff048211156111ec576111ec61108d565b029392505050565b6000610ff98383611135565b6000828210156112125761121261108d565b500390565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b604080825283519082018190526000906020906060840190828701845b8281101561129557815173ffffffffffffffffffffffffffffffffffffffff1684529284019290840190600101611263565b5050509201929092529291505056fea264697066735822122063e83af5ca4e1ecabaffb0362a319951fe91605b6ad8a659fc1ff08837596ac264736f6c634300080a0033";

type RedeemableERC20ReentrantConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: RedeemableERC20ReentrantConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class RedeemableERC20Reentrant__factory extends ContractFactory {
  constructor(...args: RedeemableERC20ReentrantConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<RedeemableERC20Reentrant> {
    return super.deploy(overrides || {}) as Promise<RedeemableERC20Reentrant>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): RedeemableERC20Reentrant {
    return super.attach(address) as RedeemableERC20Reentrant;
  }
  connect(signer: Signer): RedeemableERC20Reentrant__factory {
    return super.connect(signer) as RedeemableERC20Reentrant__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RedeemableERC20ReentrantInterface {
    return new utils.Interface(_abi) as RedeemableERC20ReentrantInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): RedeemableERC20Reentrant {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as RedeemableERC20Reentrant;
  }
}
