/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface LibIdempotentFlagTestInterface extends utils.Interface {
  functions: {
    "get(uint256,uint256)": FunctionFragment;
    "set(uint256,uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "get",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "set",
    values: [BigNumberish, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "get", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "set", data: BytesLike): Result;

  events: {};
}

export interface LibIdempotentFlagTest extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: LibIdempotentFlagTestInterface;

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
    get(
      flag_: BigNumberish,
      index_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    set(
      flag_: BigNumberish,
      index_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
  };

  get(
    flag_: BigNumberish,
    index_: BigNumberish,
    overrides?: CallOverrides
  ): Promise<boolean>;

  set(
    flag_: BigNumberish,
    index_: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    get(
      flag_: BigNumberish,
      index_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    set(
      flag_: BigNumberish,
      index_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    get(
      flag_: BigNumberish,
      index_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    set(
      flag_: BigNumberish,
      index_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    get(
      flag_: BigNumberish,
      index_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    set(
      flag_: BigNumberish,
      index_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}