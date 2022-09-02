import { Signer, ContractTransaction } from 'ethers';
import { FactoryContract } from '../classes/factoryContract';
import { AutoApproveFactory__factory, AutoApprove__factory } from '../typechain';
import {
  ReadTxOverrides,
  TxOverrides,
} from '../classes/rainContract';
import {
  StateConfig,
  StorageOpcodesRange,
  AllStandardOps,
} from '../classes/vm';


/**
 * @public
 * Type for the opcodes availables in a AutoApprove instance.
 */
export type AutoApproveOps = typeof AllStandardOps & {
  EVIDENCE_DATA_APPROVED: number;
};

/**
 * @public
 * A class for calling method on a Rain AutoApprove contract. 
 *
 * @remarks
 * This class provides an easy way to interact with the AutoApprove contract.
 *
 * @example
 * ```typescript
 * import { AutoApprove } from 'rain-sdk'
 * 
 * // To deploy a new AutoApprove, pass an ethers.js Signer and the config for the AutoApprove.
 * const newAutoApprove = await AutoApprove.deploy(signer, stateConfig)
 *
 * // To connect to an existing AutoApprove just pass the address and an ethers.js Signer.
 * const existingAutoApprove = new AutoApprove(address, signer)
 * ```
 */
export class AutoApprove extends FactoryContract {
  protected static readonly nameBookReference: string = 'autoApproveFactory';

  /**
   * Constructs a new AutoApprove from a known address.
   *
   * @param address - The address of the AutoApprove contract
   * @param signer - An ethers.js Signer
   * @returns A new AutoApprove instance
   *
   */
   constructor(address: string, signer: Signer) {
    super(address, signer);
    const _autoApprove = AutoApprove__factory.connect(address, signer);

    this.afterAdd = _autoApprove.afterAdd;
    this.afterApprove = _autoApprove.afterApprove;
    this.afterBan = _autoApprove.afterBan
    this.afterRemove = _autoApprove.afterRemove;
    this.owner = _autoApprove.owner;
    this.renounceOwnership = _autoApprove.renounceOwnership;
    this.transferOwnership = _autoApprove.transferOwnership;
    this.packedFunctionPointers = _autoApprove.packedFunctionPointers;
    this.storageOpcodesRange = _autoApprove.storageOpcodesRange;

  }

  /**
   * Deploys a new AutoApprove.
   *
   * @param signer - An ethers.js Signer
   * @param autoApproveConfig - AutoApprove's @see StateConfig
   * @param overrides - @see TxOverrides
   * @returns A new AutoApprove instance
   *
   */
  public static deploy = async (
    signer: Signer,
    autoApproveConfig: StateConfig,
    overrides: TxOverrides = {}
  ): Promise<AutoApprove> => {
    const autoApproveFactory = AutoApproveFactory__factory.connect(
      this.getBookAddress(await this.getChainId(signer)),
      signer
    );

    const tx = await autoApproveFactory.createChildTyped(
      autoApproveConfig,
      overrides
    );
    const receipt = await tx.wait();
    const address = this.getNewChildFromReceipt(receipt, autoApproveFactory);
    return new AutoApprove(address, signer);
  };


  /**
   * All the opcodes avaialbles in the AutoApprove contract.
   *
   * @remarks
   * This expose all the standard opcodes along with the specific local AutoApprove opcodes.
   */
  public static Opcodes: AutoApproveOps = {
    ...AllStandardOps,
    EVIDENCE_DATA_APPROVED: 0 + AllStandardOps.length,
  };

  /**
   * Connect to this AutoApprove instance with a new signer
   *
   * @param signer - The new signer which will be connected
   * @returns The AutoApprove Contract instance with a new signer 
   */
  public readonly connect = (signer: Signer): AutoApprove => {
    return new AutoApprove(this.address, signer);
  };

  /**
   * Checks if address is registered as a child contract of this AutoApproveFactory on a specific network
   *
   * @param signer - An ethers.js Signer
   * @param maybeChild - Address to check registration for.
   * @returns `true` if address was deployed by this contract factory, otherwise `false`
   */
  public static isChild = async (
    signer: Signer,
    maybeChild: string
  ): Promise<boolean> => {
    return await this._isChild(signer, maybeChild);
  };

  /**
   * @public
   */
  public readonly afterAdd: (
    arg0: string,
    evidences_: EvidenceConfig[],
    overrides?: TxOverrides & { from?: string | Promise<string> }
  ) => Promise<ContractTransaction>;

  /**
   * @public
   */
  public readonly afterApprove :(
    approver_: string,
    evidences_: EvidenceConfig[],
    overrides?: TxOverrides & { from?: string | Promise<string> }
  ) => Promise<ContractTransaction>;

  /**
   * @public
   */
  public readonly afterBan: (
    banner_: string,
    evidences_: EvidenceConfig[],
    overrides?: TxOverrides & { from?: string | Promise<string> }
  ) => Promise<ContractTransaction>;

  /**
   * @public
   */
  public readonly afterRemove: (
    remover_: string,
    evidences_: EvidenceConfig[],
    overrides?: TxOverrides & { from?: string | Promise<string> }
  ) => Promise<ContractTransaction>;

  /**
   * @public
   */
  public readonly owner: (overrides?: ReadTxOverrides) => Promise<string>;

  /**
   * @public
   */
  public readonly renounceOwnership: (
    overrides?: TxOverrides & { from?: string | Promise<string> }
  ) => Promise<ContractTransaction>;

  /**
   * @public
   */
  public readonly transferOwnership: (
    newOwner: string,
    overrides?: TxOverrides & { from?: string | Promise<string> }
  ) => Promise<ContractTransaction>;

  /**
   * Returns the pointer and length for AutoApprove's storage opcodes
   * 
   * @param overrides - @see ReadTxOverrides
   * @returns a StorageOpcodesRange
   */
  public readonly storageOpcodesRange: (
    overrides?: ReadTxOverrides
  ) => Promise<StorageOpcodesRange>;

   /**
   * Pointers to opcode functions, necessary for being able to read the packedBytes
   * 
   * @param overrides - @see ReadTxOverrides
   * @returns the opcode functions pointers
   */
   public readonly packedFunctionPointers: (overrides?: ReadTxOverrides) => Promise<string>;
}

/**
 * @public
 */
export type EvidenceConfig = {
  account: string;
  data: string;
};

/**
 * @public
 * Enum for operand of the AutoApprove's CONTEXT opcode
 */
export enum AutoApproveContext {
  /**
   * 0 or the index of the context array for AutoApprove CONTEXT opcode
   * stacks the caller Account address
   */
  Account,
  /**
   * 1 or the index of the context array in the AutoApprove CONTEXT opcode
   * stacks data
   */
  Data,
  /**
   * length of AutoApprove's valid context opcodes operands
   */
  length,
}

/**
 * @public
 * Enum for operand of the AutoApprove's STORAGE opcode
 */
export enum AutoApproveStorage {
  /**
   * length of AutoApprove's valid storage opcodes operands
   */
  length,
}