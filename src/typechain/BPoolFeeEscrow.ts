/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface BPoolFeeEscrowInterface extends utils.Interface {
  functions: {
    "buyToken(address,address,uint256,uint256,uint256,uint256)": FunctionFragment;
    "claimFees(address,address)": FunctionFragment;
    "refundFees(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "buyToken",
    values: [
      string,
      string,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "claimFees",
    values: [string, string]
  ): string;
  encodeFunctionData(functionFragment: "refundFees", values: [string]): string;

  decodeFunctionResult(functionFragment: "buyToken", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "claimFees", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "refundFees", data: BytesLike): Result;

  events: {
    "ClaimFees(address,address,address,address,uint256)": EventFragment;
    "Fee(address,address,address,address,address,uint256)": EventFragment;
    "RefundFees(address,address,address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ClaimFees"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Fee"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RefundFees"): EventFragment;
}

export type ClaimFeesEvent = TypedEvent<
  [string, string, string, string, BigNumber],
  {
    sender: string;
    recipient: string;
    trust: string;
    reserve: string;
    claimedFees: BigNumber;
  }
>;

export type ClaimFeesEventFilter = TypedEventFilter<ClaimFeesEvent>;

export type FeeEvent = TypedEvent<
  [string, string, string, string, string, BigNumber],
  {
    sender: string;
    recipient: string;
    trust: string;
    reserve: string;
    redeemable: string;
    fee: BigNumber;
  }
>;

export type FeeEventFilter = TypedEventFilter<FeeEvent>;

export type RefundFeesEvent = TypedEvent<
  [string, string, string, string, BigNumber],
  {
    sender: string;
    trust: string;
    reserve: string;
    redeemable: string;
    refundedFees: BigNumber;
  }
>;

export type RefundFeesEventFilter = TypedEventFilter<RefundFeesEvent>;

export interface BPoolFeeEscrow extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: BPoolFeeEscrowInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    buyToken(
      feeRecipient_: string,
      trust_: string,
      fee_: BigNumberish,
      reserveAmountIn_: BigNumberish,
      minTokenAmountOut_: BigNumberish,
      maxPrice_: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    claimFees(
      recipient_: string,
      trust_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    refundFees(
      trust_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  buyToken(
    feeRecipient_: string,
    trust_: string,
    fee_: BigNumberish,
    reserveAmountIn_: BigNumberish,
    minTokenAmountOut_: BigNumberish,
    maxPrice_: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  claimFees(
    recipient_: string,
    trust_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  refundFees(
    trust_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    buyToken(
      feeRecipient_: string,
      trust_: string,
      fee_: BigNumberish,
      reserveAmountIn_: BigNumberish,
      minTokenAmountOut_: BigNumberish,
      maxPrice_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & {
        tokenAmountOut: BigNumber;
        spotPriceAfter: BigNumber;
      }
    >;

    claimFees(
      recipient_: string,
      trust_: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    refundFees(trust_: string, overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {
    "ClaimFees(address,address,address,address,uint256)"(
      sender?: null,
      recipient?: null,
      trust?: null,
      reserve?: null,
      claimedFees?: null
    ): ClaimFeesEventFilter;
    ClaimFees(
      sender?: null,
      recipient?: null,
      trust?: null,
      reserve?: null,
      claimedFees?: null
    ): ClaimFeesEventFilter;

    "Fee(address,address,address,address,address,uint256)"(
      sender?: null,
      recipient?: null,
      trust?: null,
      reserve?: null,
      redeemable?: null,
      fee?: null
    ): FeeEventFilter;
    Fee(
      sender?: null,
      recipient?: null,
      trust?: null,
      reserve?: null,
      redeemable?: null,
      fee?: null
    ): FeeEventFilter;

    "RefundFees(address,address,address,address,uint256)"(
      sender?: null,
      trust?: null,
      reserve?: null,
      redeemable?: null,
      refundedFees?: null
    ): RefundFeesEventFilter;
    RefundFees(
      sender?: null,
      trust?: null,
      reserve?: null,
      redeemable?: null,
      refundedFees?: null
    ): RefundFeesEventFilter;
  };

  estimateGas: {
    buyToken(
      feeRecipient_: string,
      trust_: string,
      fee_: BigNumberish,
      reserveAmountIn_: BigNumberish,
      minTokenAmountOut_: BigNumberish,
      maxPrice_: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    claimFees(
      recipient_: string,
      trust_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    refundFees(
      trust_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    buyToken(
      feeRecipient_: string,
      trust_: string,
      fee_: BigNumberish,
      reserveAmountIn_: BigNumberish,
      minTokenAmountOut_: BigNumberish,
      maxPrice_: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    claimFees(
      recipient_: string,
      trust_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    refundFees(
      trust_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
