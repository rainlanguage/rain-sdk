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
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export type StateConfigStruct = {
  sources: BytesLike[];
  constants: BigNumberish[];
};

export type StateConfigStructOutput = [string[], BigNumber[]] & {
  sources: string[];
  constants: BigNumber[];
};

export type StorageOpcodesRangeStruct = {
  pointer: BigNumberish;
  length: BigNumberish;
};

export type StorageOpcodesRangeStructOutput = [BigNumber, BigNumber] & {
  pointer: BigNumber;
  length: BigNumber;
};

export interface FnPtrsTestInterface extends utils.Interface {
  functions: {
    "fnPtrs()": FunctionFragment;
    "initialize((bytes[],uint256[]))": FunctionFragment;
    "storageOpcodesRange()": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "fnPtrs", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [StateConfigStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "storageOpcodesRange",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "fnPtrs", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "storageOpcodesRange",
    data: BytesLike
  ): Result;

  events: {};
}

export interface FnPtrsTest extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: FnPtrsTestInterface;

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
    fnPtrs(overrides?: CallOverrides): Promise<[string]>;

    initialize(
      stateConfig_: StateConfigStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    storageOpcodesRange(
      overrides?: CallOverrides
    ): Promise<[StorageOpcodesRangeStructOutput]>;
  };

  fnPtrs(overrides?: CallOverrides): Promise<string>;

  initialize(
    stateConfig_: StateConfigStruct,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  storageOpcodesRange(
    overrides?: CallOverrides
  ): Promise<StorageOpcodesRangeStructOutput>;

  callStatic: {
    fnPtrs(overrides?: CallOverrides): Promise<string>;

    initialize(
      stateConfig_: StateConfigStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    storageOpcodesRange(
      overrides?: CallOverrides
    ): Promise<StorageOpcodesRangeStructOutput>;
  };

  filters: {};

  estimateGas: {
    fnPtrs(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      stateConfig_: StateConfigStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    storageOpcodesRange(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    fnPtrs(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initialize(
      stateConfig_: StateConfigStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    storageOpcodesRange(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
