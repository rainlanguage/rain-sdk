/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  RedeemableERC20ClaimEscrowWrapper,
  RedeemableERC20ClaimEscrowWrapperInterface,
} from "../RedeemableERC20ClaimEscrowWrapper";

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
        name: "trust_",
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
      {
        internalType: "uint256",
        name: "supply_",
        type: "uint256",
      },
    ],
    name: "getDeposits",
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
        name: "trust_",
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
    name: "getPendingDeposits",
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
        name: "trust_",
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
    name: "getTotalDeposits",
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
        name: "trust_",
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
        internalType: "address",
        name: "withdrawer_",
        type: "address",
      },
    ],
    name: "getWithdrawals",
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
  "0x608060405234801561001057600080fd5b50611966806100206000396000f3fe608060405234801561001057600080fd5b50600436106100a35760003560e01c80637e56cda8116100765780639bfeb1191161005b5780639bfeb11914610175578063d9caed12146101c5578063fa5839ab146101d857600080fd5b80637e56cda81461014f5780638340f5491461016257600080fd5b8063248a8572146100a85780634facc0b4146100bd5780635fc85b7d146100e257806370a9eeee146100f5575b600080fd5b6100bb6100b63660046115a3565b610231565b005b6100d06100cb3660046115e9565b6104c0565b60405190815260200160405180910390f35b6100bb6100f036600461162a565b610503565b6100d0610103366004611675565b73ffffffffffffffffffffffffffffffffffffffff9384166000908152600560209081526040808320958716835294815284822093909516815291845282822090825290925290205490565b6100bb61015d3660046115e9565b6105cd565b6100bb6101703660046115e9565b6107a2565b6100d061018336600461162a565b73ffffffffffffffffffffffffffffffffffffffff92831660009081526004602090815260408083209486168352938152838220929094168152925290205490565b6100bb6101d33660046115e9565b6107d5565b6100d06101e63660046116c6565b73ffffffffffffffffffffffffffffffffffffffff93841660009081526003602090815260408083209587168352948152848220938252928352838120919094168452905290205490565b600161023c85610ad1565b600281111561024d5761024d611719565b146102b9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600860248201527f4e4f545f4641494c00000000000000000000000000000000000000000000000060448201526064015b60405180910390fd5b60008111610323576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600b60248201527f5a45524f5f414d4f554e5400000000000000000000000000000000000000000060448201526064016102b0565b73ffffffffffffffffffffffffffffffffffffffff80851660009081526005602090815260408083209387168352928152828220338352815282822085835290529081208054839290610377908490611777565b909155505073ffffffffffffffffffffffffffffffffffffffff80851660009081526006602090815260408083209387168352928152828220858352905290812080548392906103c8908490611777565b909155505073ffffffffffffffffffffffffffffffffffffffff8085166000908152600760209081526040808320938716835292815282822085835290529081208054839290610419908490611777565b909155507f6b7ec092a62c7445c02d988d0c1c01a2da7d8778d62a625accdf18de5efca3b69050338561044b81610c75565b6040805173ffffffffffffffffffffffffffffffffffffffff948516815292841660208401529083169082015290851660608201526080810184905260a0810183905260c00160405180910390a16104ba73ffffffffffffffffffffffffffffffffffffffff84163383610df0565b50505050565b73ffffffffffffffffffffffffffffffffffffffff80841660009081526006602090815260408083209386168352928152828220848352905220545b9392505050565b73ffffffffffffffffffffffffffffffffffffffff838116600090815260046020908152604080832086851684528252808320938516835292905290812080549190557ff1c3618947be77b086aba11baa9d1e07d2df15de2c0e620f295ffd4ddd550e1f33838661057381610c75565b6040805173ffffffffffffffffffffffffffffffffffffffff958616815293851660208501529184168383015283166060830152918616608082015260a0810184905290519081900360c00190a16104ba84848484610ec4565b60008111610637576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600c60248201527f5a45524f5f4445504f534954000000000000000000000000000000000000000060448201526064016102b0565b600061064284610ad1565b600281111561065357610653611719565b146106ba576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600b60248201527f4e4f545f50454e44494e4700000000000000000000000000000000000000000060448201526064016102b0565b73ffffffffffffffffffffffffffffffffffffffff808416600090815260046020908152604080832093861683529281528282203383529052908120805483929061070690849061178e565b909155506000905061071784610c75565b6040805133815273ffffffffffffffffffffffffffffffffffffffff878116602083015283811682840152861660608201526080810185905290519192507feabec77378d088e5df884cdb5fb2b55858355c2f6284148d4a30177eb54b52e6919081900360a00190a16104ba73ffffffffffffffffffffffffffffffffffffffff8416333085611214565b6107ae83833384610ec4565b6107d073ffffffffffffffffffffffffffffffffffffffff8316333084611214565b505050565b60026107e084610ad1565b60028111156107f1576107f1611719565b14610858576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600b60248201527f4e4f545f5355434345535300000000000000000000000000000000000000000060448201526064016102b0565b73ffffffffffffffffffffffffffffffffffffffff8381166000818152600660209081526040808320948716808452948252808320868452825280832054938352600382528083209483529381528382208583528152838220338352905291822080549082905590916108ca86610c75565b6040517f70a08231000000000000000000000000000000000000000000000000000000008152336004820152909150600090859073ffffffffffffffffffffffffffffffffffffffff8416906370a0823190602401602060405180830381865afa15801561093c573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061096091906117a6565b61096a8587611777565b61097491906117bf565b61097e91906117fc565b73ffffffffffffffffffffffffffffffffffffffff8089166000908152600760209081526040808320938b1683529281528282208983529052908120805492935083929091906109cf908490611777565b909155505080610a3b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600d60248201527f5a45524f5f57495448445241570000000000000000000000000000000000000060448201526064016102b0565b6040805133815273ffffffffffffffffffffffffffffffffffffffff898116602083015284811682840152881660608201526080810187905260a0810183905290517f16976c9767f5174e5289de7594402a1e174ebd2a9622aa3ebafd14e5af4e2ab99181900360c00190a1610ac873ffffffffffffffffffffffffffffffffffffffff87163383610df0565b50505050505050565b73ffffffffffffffffffffffffffffffffffffffff811660009081526002602052604081205460ff1681816002811115610b0d57610b0d611719565b1115610b195792915050565b60008373ffffffffffffffffffffffffffffffffffffffff1663f9020e336040518163ffffffff1660e01b8152600401602060405180830381865afa158015610b66573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b8a9190611837565b90506002816003811115610ba057610ba0611719565b1415610bfb5750505073ffffffffffffffffffffffffffffffffffffffff16600090815260026020819052604090912080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00168217905590565b6003816003811115610c0f57610c0f611719565b1415610c6b5750505073ffffffffffffffffffffffffffffffffffffffff16600090815260026020526040902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016600190811790915590565b5060009392505050565b73ffffffffffffffffffffffffffffffffffffffff80821660009081526001602052604081205490911680610dea5760008373ffffffffffffffffffffffffffffffffffffffff1663fc0c546a6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610cf1573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d159190611858565b905073ffffffffffffffffffffffffffffffffffffffff8116610d94576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600760248201527f305f544f4b454e0000000000000000000000000000000000000000000000000060448201526064016102b0565b73ffffffffffffffffffffffffffffffffffffffff848116600090815260016020526040902080547fffffffffffffffffffffffff00000000000000000000000000000000000000001691831691909117905590505b92915050565b60405173ffffffffffffffffffffffffffffffffffffffff83166024820152604481018290526107d09084907fa9059cbb00000000000000000000000000000000000000000000000000000000906064015b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff0000000000000000000000000000000000000000000000000000000090931692909217909152611272565b6000610ecf85610ad1565b6002811115610ee057610ee0611719565b11610f47576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600760248201527f50454e44494e470000000000000000000000000000000000000000000000000060448201526064016102b0565b60008111610fb1576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600c60248201527f5a45524f5f4445504f534954000000000000000000000000000000000000000060448201526064016102b0565b6000610fbc85610c75565b905060008173ffffffffffffffffffffffffffffffffffffffff166318160ddd6040518163ffffffff1660e01b8152600401602060405180830381865afa15801561100b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061102f91906117a6565b90506000811161109b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600b60248201527f5a45524f5f535550504c5900000000000000000000000000000000000000000060448201526064016102b0565b73ffffffffffffffffffffffffffffffffffffffff8087166000908152600560209081526040808320898516845282528083209388168352928152828220848352905290812080548592906110f190849061178e565b909155505073ffffffffffffffffffffffffffffffffffffffff808716600090815260066020908152604080832093891683529281528282208483529052908120805485929061114290849061178e565b909155505073ffffffffffffffffffffffffffffffffffffffff808716600090815260076020908152604080832093891683529281528282208483529052908120805485929061119390849061178e565b90915550506040805133815273ffffffffffffffffffffffffffffffffffffffff86811660208301528881168284015284811660608301528716608082015260a0810183905260c0810185905290517f53591a88ac47bfe3130a7de575c6a6a8c22f7604cbba61b8390fbff773ed40499181900360e00190a1505050505050565b60405173ffffffffffffffffffffffffffffffffffffffff808516602483015283166044820152606481018290526104ba9085907f23b872dd0000000000000000000000000000000000000000000000000000000090608401610e42565b60006112d4826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c65648152508573ffffffffffffffffffffffffffffffffffffffff1661137e9092919063ffffffff16565b8051909150156107d057808060200190518101906112f29190611875565b6107d0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60448201527f6f7420737563636565640000000000000000000000000000000000000000000060648201526084016102b0565b606061138d8484600085611395565b949350505050565b606082471015611427576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f60448201527f722063616c6c000000000000000000000000000000000000000000000000000060648201526084016102b0565b73ffffffffffffffffffffffffffffffffffffffff85163b6114a5576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016102b0565b6000808673ffffffffffffffffffffffffffffffffffffffff1685876040516114ce91906118c3565b60006040518083038185875af1925050503d806000811461150b576040519150601f19603f3d011682016040523d82523d6000602084013e611510565b606091505b509150915061152082828661152b565b979650505050505050565b6060831561153a5750816104fc565b82511561154a5782518084602001fd5b816040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102b091906118df565b73ffffffffffffffffffffffffffffffffffffffff811681146115a057600080fd5b50565b600080600080608085870312156115b957600080fd5b84356115c48161157e565b935060208501356115d48161157e565b93969395505050506040820135916060013590565b6000806000606084860312156115fe57600080fd5b83356116098161157e565b925060208401356116198161157e565b929592945050506040919091013590565b60008060006060848603121561163f57600080fd5b833561164a8161157e565b9250602084013561165a8161157e565b9150604084013561166a8161157e565b809150509250925092565b6000806000806080858703121561168b57600080fd5b84356116968161157e565b935060208501356116a68161157e565b925060408501356116b68161157e565b9396929550929360600135925050565b600080600080608085870312156116dc57600080fd5b84356116e78161157e565b935060208501356116f78161157e565b925060408501359150606085013561170e8161157e565b939692955090935050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60008282101561178957611789611748565b500390565b600082198211156117a1576117a1611748565b500190565b6000602082840312156117b857600080fd5b5051919050565b6000817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04831182151516156117f7576117f7611748565b500290565b600082611832577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b500490565b60006020828403121561184957600080fd5b8151600481106104fc57600080fd5b60006020828403121561186a57600080fd5b81516104fc8161157e565b60006020828403121561188757600080fd5b815180151581146104fc57600080fd5b60005b838110156118b257818101518382015260200161189a565b838111156104ba5750506000910152565b600082516118d5818460208701611897565b9190910192915050565b60208152600082518060208401526118fe816040850160208701611897565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016919091016040019291505056fea2646970667358221220f31f34597b211bd7285b6bd31dd1526ee4142fcd5bf8a891c1cf8690726573de64736f6c634300080a0033";

type RedeemableERC20ClaimEscrowWrapperConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: RedeemableERC20ClaimEscrowWrapperConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class RedeemableERC20ClaimEscrowWrapper__factory extends ContractFactory {
  constructor(...args: RedeemableERC20ClaimEscrowWrapperConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<RedeemableERC20ClaimEscrowWrapper> {
    return super.deploy(
      overrides || {}
    ) as Promise<RedeemableERC20ClaimEscrowWrapper>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): RedeemableERC20ClaimEscrowWrapper {
    return super.attach(address) as RedeemableERC20ClaimEscrowWrapper;
  }
  connect(signer: Signer): RedeemableERC20ClaimEscrowWrapper__factory {
    return super.connect(signer) as RedeemableERC20ClaimEscrowWrapper__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RedeemableERC20ClaimEscrowWrapperInterface {
    return new utils.Interface(
      _abi
    ) as RedeemableERC20ClaimEscrowWrapperInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): RedeemableERC20ClaimEscrowWrapper {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as RedeemableERC20ClaimEscrowWrapper;
  }
}
