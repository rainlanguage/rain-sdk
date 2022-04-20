/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  RedeemableERC20ClaimEscrow,
  RedeemableERC20ClaimEscrowInterface,
} from "../RedeemableERC20ClaimEscrow";

const _abi = [
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
        indexed: false,
        internalType: "address",
        name: "depositor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "sale",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "redeemable",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "supply",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
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
        indexed: false,
        internalType: "address",
        name: "sale",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "redeemable",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "PendingDeposit",
    type: "event",
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
        indexed: false,
        internalType: "address",
        name: "depositor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "sale",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "redeemable",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Sweep",
    type: "event",
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
        indexed: false,
        internalType: "address",
        name: "sale",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "redeemable",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "supply",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Undeposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "withdrawer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "sale",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "redeemable",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "supply",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sale_",
        type: "address",
      },
      {
        internalType: "address",
        name: "token_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount_",
        type: "uint256",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sale_",
        type: "address",
      },
      {
        internalType: "address",
        name: "token_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount_",
        type: "uint256",
      },
    ],
    name: "depositPending",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sale_",
        type: "address",
      },
      {
        internalType: "address",
        name: "token_",
        type: "address",
      },
      {
        internalType: "address",
        name: "depositor_",
        type: "address",
      },
    ],
    name: "sweepPending",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sale_",
        type: "address",
      },
      {
        internalType: "address",
        name: "token_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "supply_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount_",
        type: "uint256",
      },
    ],
    name: "undeposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sale_",
        type: "address",
      },
      {
        internalType: "address",
        name: "token_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "supply_",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506116e1806100206000396000f3fe608060405234801561001057600080fd5b50600436106100675760003560e01c80637e56cda8116100505780637e56cda8146100945780638340f549146100a7578063d9caed12146100ba57600080fd5b8063248a85721461006c5780635fc85b7d14610081575b600080fd5b61007f61007a3660046113c2565b6100cd565b005b61007f61008f366004611408565b61035c565b61007f6100a2366004611453565b610426565b61007f6100b5366004611453565b6105fb565b61007f6100c8366004611453565b61062e565b60016100d885610955565b60028111156100e9576100e9611494565b14610155576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600860248201527f4e4f545f4641494c00000000000000000000000000000000000000000000000060448201526064015b60405180910390fd5b600081116101bf576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600b60248201527f5a45524f5f414d4f554e54000000000000000000000000000000000000000000604482015260640161014c565b73ffffffffffffffffffffffffffffffffffffffff808516600090815260056020908152604080832093871683529281528282203383528152828220858352905290812080548392906102139084906114f2565b909155505073ffffffffffffffffffffffffffffffffffffffff80851660009081526006602090815260408083209387168352928152828220858352905290812080548392906102649084906114f2565b909155505073ffffffffffffffffffffffffffffffffffffffff80851660009081526007602090815260408083209387168352928152828220858352905290812080548392906102b59084906114f2565b909155507f6b7ec092a62c7445c02d988d0c1c01a2da7d8778d62a625accdf18de5efca3b6905033856102e781610af9565b6040805173ffffffffffffffffffffffffffffffffffffffff948516815292841660208401529083169082015290851660608201526080810184905260a0810183905260c00160405180910390a161035673ffffffffffffffffffffffffffffffffffffffff84163383610c74565b50505050565b73ffffffffffffffffffffffffffffffffffffffff838116600090815260046020908152604080832086851684528252808320938516835292905290812080549190557ff1c3618947be77b086aba11baa9d1e07d2df15de2c0e620f295ffd4ddd550e1f3383866103cc81610af9565b6040805173ffffffffffffffffffffffffffffffffffffffff958616815293851660208501529184168383015283166060830152918616608082015260a0810184905290519081900360c00190a161035684848484610d48565b60008111610490576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600c60248201527f5a45524f5f4445504f5349540000000000000000000000000000000000000000604482015260640161014c565b600061049b84610955565b60028111156104ac576104ac611494565b14610513576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600b60248201527f4e4f545f50454e44494e47000000000000000000000000000000000000000000604482015260640161014c565b73ffffffffffffffffffffffffffffffffffffffff808416600090815260046020908152604080832093861683529281528282203383529052908120805483929061055f908490611509565b909155506000905061057084610af9565b6040805133815273ffffffffffffffffffffffffffffffffffffffff878116602083015283811682840152861660608201526080810185905290519192507feabec77378d088e5df884cdb5fb2b55858355c2f6284148d4a30177eb54b52e6919081900360a00190a161035673ffffffffffffffffffffffffffffffffffffffff8416333085611031565b61060783833384610d48565b61062973ffffffffffffffffffffffffffffffffffffffff8316333084611031565b505050565b600261063984610955565b600281111561064a5761064a611494565b146106b1576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600b60248201527f4e4f545f53554343455353000000000000000000000000000000000000000000604482015260640161014c565b73ffffffffffffffffffffffffffffffffffffffff8084166000818152600660209081526040808320948716808452948252808320868452825280832054938352600382528083209483529381528382208583528152838220338352905291822054909161071e86610af9565b73ffffffffffffffffffffffffffffffffffffffff87811660009081526003602090815260408083208a8516845282528083208984528252808320338085529252808320889055517f70a0823100000000000000000000000000000000000000000000000000000000815260048101919091529293509186918416906370a0823190602401602060405180830381865afa1580156107c0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107e49190611521565b6107ee85876114f2565b6107f8919061153a565b6108029190611577565b73ffffffffffffffffffffffffffffffffffffffff8089166000908152600760209081526040808320938b1683529281528282208983529052908120805492935083929091906108539084906114f2565b9091555050806108bf576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600d60248201527f5a45524f5f574954484452415700000000000000000000000000000000000000604482015260640161014c565b6040805133815273ffffffffffffffffffffffffffffffffffffffff898116602083015284811682840152881660608201526080810187905260a0810183905290517f16976c9767f5174e5289de7594402a1e174ebd2a9622aa3ebafd14e5af4e2ab99181900360c00190a161094c73ffffffffffffffffffffffffffffffffffffffff87163383610c74565b50505050505050565b73ffffffffffffffffffffffffffffffffffffffff811660009081526002602052604081205460ff168181600281111561099157610991611494565b111561099d5792915050565b60008373ffffffffffffffffffffffffffffffffffffffff1663f9020e336040518163ffffffff1660e01b8152600401602060405180830381865afa1580156109ea573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a0e91906115b2565b90506002816003811115610a2457610a24611494565b1415610a7f5750505073ffffffffffffffffffffffffffffffffffffffff16600090815260026020819052604090912080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00168217905590565b6003816003811115610a9357610a93611494565b1415610aef5750505073ffffffffffffffffffffffffffffffffffffffff16600090815260026020526040902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016600190811790915590565b5060009392505050565b73ffffffffffffffffffffffffffffffffffffffff80821660009081526001602052604081205490911680610c6e5760008373ffffffffffffffffffffffffffffffffffffffff1663fc0c546a6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610b75573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b9991906115d3565b905073ffffffffffffffffffffffffffffffffffffffff8116610c18576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600760248201527f305f544f4b454e00000000000000000000000000000000000000000000000000604482015260640161014c565b73ffffffffffffffffffffffffffffffffffffffff848116600090815260016020526040902080547fffffffffffffffffffffffff00000000000000000000000000000000000000001691831691909117905590505b92915050565b60405173ffffffffffffffffffffffffffffffffffffffff83166024820152604481018290526106299084907fa9059cbb00000000000000000000000000000000000000000000000000000000906064015b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff000000000000000000000000000000000000000000000000000000009093169290921790915261108f565b6000610d5385610955565b6002811115610d6457610d64611494565b11610dcb576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600760248201527f50454e44494e4700000000000000000000000000000000000000000000000000604482015260640161014c565b60008111610e35576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600c60248201527f5a45524f5f4445504f5349540000000000000000000000000000000000000000604482015260640161014c565b6000610e4085610af9565b905060008173ffffffffffffffffffffffffffffffffffffffff166318160ddd6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610e8f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610eb39190611521565b73ffffffffffffffffffffffffffffffffffffffff80881660009081526005602090815260408083208a8516845282528083209389168352928152828220848352905290812080549293508592909190610f0e908490611509565b909155505073ffffffffffffffffffffffffffffffffffffffff8087166000908152600660209081526040808320938916835292815282822084835290529081208054859290610f5f908490611509565b909155505073ffffffffffffffffffffffffffffffffffffffff8087166000908152600760209081526040808320938916835292815282822084835290529081208054859290610fb0908490611509565b90915550506040805133815273ffffffffffffffffffffffffffffffffffffffff86811660208301528881168284015284811660608301528716608082015260a0810183905260c0810185905290517f53591a88ac47bfe3130a7de575c6a6a8c22f7604cbba61b8390fbff773ed40499181900360e00190a1505050505050565b60405173ffffffffffffffffffffffffffffffffffffffff808516602483015283166044820152606481018290526103569085907f23b872dd0000000000000000000000000000000000000000000000000000000090608401610cc6565b60006110f1826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c65648152508573ffffffffffffffffffffffffffffffffffffffff1661119b9092919063ffffffff16565b805190915015610629578080602001905181019061110f91906115f0565b610629576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60448201527f6f74207375636365656400000000000000000000000000000000000000000000606482015260840161014c565b60606111aa84846000856111b4565b90505b9392505050565b606082471015611246576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f60448201527f722063616c6c0000000000000000000000000000000000000000000000000000606482015260840161014c565b73ffffffffffffffffffffffffffffffffffffffff85163b6112c4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015260640161014c565b6000808673ffffffffffffffffffffffffffffffffffffffff1685876040516112ed919061163e565b60006040518083038185875af1925050503d806000811461132a576040519150601f19603f3d011682016040523d82523d6000602084013e61132f565b606091505b509150915061133f82828661134a565b979650505050505050565b606083156113595750816111ad565b8251156113695782518084602001fd5b816040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161014c919061165a565b73ffffffffffffffffffffffffffffffffffffffff811681146113bf57600080fd5b50565b600080600080608085870312156113d857600080fd5b84356113e38161139d565b935060208501356113f38161139d565b93969395505050506040820135916060013590565b60008060006060848603121561141d57600080fd5b83356114288161139d565b925060208401356114388161139d565b915060408401356114488161139d565b809150509250925092565b60008060006060848603121561146857600080fd5b83356114738161139d565b925060208401356114838161139d565b929592945050506040919091013590565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600082821015611504576115046114c3565b500390565b6000821982111561151c5761151c6114c3565b500190565b60006020828403121561153357600080fd5b5051919050565b6000817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615611572576115726114c3565b500290565b6000826115ad577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b500490565b6000602082840312156115c457600080fd5b8151600481106111ad57600080fd5b6000602082840312156115e557600080fd5b81516111ad8161139d565b60006020828403121561160257600080fd5b815180151581146111ad57600080fd5b60005b8381101561162d578181015183820152602001611615565b838111156103565750506000910152565b60008251611650818460208701611612565b9190910192915050565b6020815260008251806020840152611679816040850160208701611612565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016919091016040019291505056fea26469706673582212208a2f20f8840f0e30d99d04c4091b26e8c9fcb477f52076fc45b92ff66354035e64736f6c634300080a0033";

type RedeemableERC20ClaimEscrowConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: RedeemableERC20ClaimEscrowConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class RedeemableERC20ClaimEscrow__factory extends ContractFactory {
  constructor(...args: RedeemableERC20ClaimEscrowConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<RedeemableERC20ClaimEscrow> {
    return super.deploy(overrides || {}) as Promise<RedeemableERC20ClaimEscrow>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): RedeemableERC20ClaimEscrow {
    return super.attach(address) as RedeemableERC20ClaimEscrow;
  }
  connect(signer: Signer): RedeemableERC20ClaimEscrow__factory {
    return super.connect(signer) as RedeemableERC20ClaimEscrow__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RedeemableERC20ClaimEscrowInterface {
    return new utils.Interface(_abi) as RedeemableERC20ClaimEscrowInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): RedeemableERC20ClaimEscrow {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as RedeemableERC20ClaimEscrow;
  }
}