import { TierContract } from '../classes/tierContract';
import { StateConfig, StorageOpcodesRange } from '../classes/vm';
import {
  EmissionsERC20__factory,
  EmissionsERC20Factory__factory,
} from '../typechain';
import {
  ERC20Config,
  TxOverrides,
  ReadTxOverrides,
} from '../classes/rainContract';
import {
  Signer,
  BigNumber,
  BytesLike,
  BigNumberish,
  ContractTransaction,
} from 'ethers';

/**
 * @public
 * Enum for operand of the emissionsERC20's CONTEXT opcode
 */
export enum EmissionsERC20Context {
  /**
   * 0 or the index of the context array in the emissionsERC20
   * contract used as the operand for CONTEXT opcode.
   * operand for CONTEXT opcode to stack the claimant account that report is being call for.
   */
  ClaimantAccount,
  /**
   * 1 or the index of the context array in the emissioinsERC20
   * contract used as the operand for CONTEXT opcode.
   * operand for CONTEXT opcode to stack the tier that reportTimeForTier is being call for.
   * The tier (between 1 to 8) used for tierTimeForTier and it has no use for "ITIERV2_REPORT" opcode
   */
  Tier,
  /**
   * length of EmissionsERC20's valid context opcodes - 2
   */
  length,
}

/**
 * @public
 * Enum for operand of the EmissionsERC20's STORAGE opcode
 */
export enum EmissionsERC20Storage {
  /**
   * length of EmissionsERC20's valid storage opcodes - 0
   */
  length,
}

/**
 * @public
 * A class for calling methods on a EmissionsERC20.
 *
 * @remarks
 *   This class provides an easy way to deploy and interact with EmissionsERC20's.
 *
 * @example
 * ```typescript
 * import { EmissionsERC20 } from 'rain-sdk';
 *
 * // To deploy a new EmissionsERC20, pass an ethers.js Signer and the config for the EmissionsERC20.
 * const newEmission = EmissionsERC20.deploy(signer, args);
 *
 * // Check if an address is child from the factory deployed in the current chain.
 * await EmissionsERC20.isChild(signer, newEmission.address);
 *```
 */

export class EmissionsERC20 extends TierContract {
  protected static readonly nameBookReference: string = 'emissionsERC20Factory';

  /**
   * Constructs a new EmissionsERC20 from a known address.
   *
   * @param address - The address of the EmissionsERC20 contract
   * @param signer - An ethers.js Signer
   * @returns A new EmissionsERC20 instance
   *
   */
  constructor(address: string, signer: Signer) {
    EmissionsERC20.checkAddress(address);

    super(address, signer);
    const _emission = EmissionsERC20__factory.connect(address, signer);

    this.allowDelegatedClaims = _emission.allowDelegatedClaims;
    this.allowance = _emission.allowance;
    this.approve = _emission.approve;
    this.balanceOf = _emission.balanceOf;
    this.calculateClaim = _emission.calculateClaim;
    this.claim = _emission.claim;
    this.decimals = _emission.decimals;
    this.decreaseAllowance = _emission.decreaseAllowance;
    this.increaseAllowance = _emission.increaseAllowance;
    this.name = _emission.name;
    this.symbol = _emission.symbol;
    this.totalSupply = _emission.totalSupply;
    this.transfer = _emission.transfer;
    this.transferFrom = _emission.transferFrom;
    this.fnPtrs = _emission.fnPtrs;
    this.storageOpcodesRange = _emission.storageOpcodesRange;
  }

  /**
   * Deploys a new EmissionsERC20.
   *
   * @param signer - An ethers.js Signer
   * @param args - Arguments for deploying a EmissionsERC20 @see EmissionsERC20DeployArgs
   * @param overrides - @see TxOverrides
   * @returns A new EmissionsERC20 instance
   *
   */
  public static deploy = async (
    signer: Signer,
    args: EmissionsERC20DeployArgs,
    overrides: TxOverrides = {}
  ): Promise<EmissionsERC20> => {
    const emissionsERC20Factory = EmissionsERC20Factory__factory.connect(
      this.getBookAddress(await this.getChainId(signer)),
      signer
    );

    const tx = await emissionsERC20Factory.createChildTyped(args, overrides);
    const receipt = await tx.wait();
    const address = this.getNewChildFromReceipt(receipt, emissionsERC20Factory);
    return new EmissionsERC20(address, signer);
  };

  public readonly connect = (signer: Signer): EmissionsERC20 => {
    return new EmissionsERC20(this.address, signer);
  };

  /**
   * Checks if address is registered as a child contract of this RedeemableERC20Factory on a specific network
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
   * It is NOT implemented in Emissions. Always will throw an error
   */
  public readonly setTier = async (
    account: string,
    endTier: BigNumberish,
    data: BytesLike,
    overrides?: TxOverrides
  ) => {
    throw new Error('SET TIER: NOT IMPLEMENTED');
  };

  /**
   * Whether the claimant must be the caller of `claim`. If `false` then
   * accounts other than claimant can claim. This may or may not be
   * desirable depending on the emissions schedule. For example, a linear
   * schedule will produce the same end result for the claimant regardless
   * of who calls `claim` or when but an exponential schedule is more
   * profitable if the claimant waits longer between claims. In the
   * non-linear case delegated claims would be inappropriate as third
   * party accounts could grief claimants by claiming "early", thus forcing
   * opportunity cost on claimants who would have preferred to wait.
   *
   * @param overrides - @see ReadTxOverrides
   * @returns A boolean as true if deledated claims is allowed
   */
  public readonly allowDelegatedClaims: (
    overrides?: ReadTxOverrides
  ) => Promise<boolean>;

  /**
   * Returns the remaining number of tokens that `spender` will be
   * allowed to spend on behalf of `owner` through `transferFrom()`. This is
   * zero by default.
   *
   * This value changes when `approve()` or `transferFrom()` are called.
   *
   * @param owner - The owner of the tokens
   * @param spender - The address to check how much amount have allow to use
   * @param overrides - @see ReadTxOverrides
   * @returns Amount of tokens allow to expend
   */
  public readonly allowance: (
    owner: string,
    spender: string,
    overrides?: ReadTxOverrides
  ) => Promise<BigNumber>;

  /**
   * Sets `amount` as the allowance of `spender` over the caller's tokens.
   *
   *
   * @param spender - The addess that will get approved
   * @param amount - The amount that `spender` is allowed to spend
   * @param overrides - @see TxOverrides
   */
  public readonly approve: (
    spender: string,
    amount: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Returns the amount of tokens owned by `account`.
   *
   * @param account - Account address to get the balance
   * @param overrides - @see ReadTxOverrides
   * @returns Amount of tokens that the owner have
   */
  public readonly balanceOf: (
    account: string,
    overrides?: ReadTxOverrides
  ) => Promise<BigNumber>;

  /**
   * Calculates the claim without processing it.
   * Read only method that may be useful downstream both onchain and
   * offchain if a claimant wants to check the claim amount before deciding
   * whether to process it.
   * As this is read only there are no checks against delegated claims. It
   * is possible to return a value from `calculateClaim` and to not be able
   * to process the claim with `claim` if `msg.sender` is not the
   * `claimant`.
   *
   * @param claimant - - Address to calculate current claim for.
   * @param overrides - - @see ReadTxOverrides
   * @returns the claim calculated
   */
  public readonly calculateClaim: (
    claimant: string,
    overrides?: ReadTxOverrides
  ) => Promise<BigNumber>;

  /**
   * Processes the claim for `claimant_`.
   * - Enforces `allowDelegatedClaims` if it is `true` so that `msg.sender`
   * must also be `claimant_`.
   * - Takes the return from `calculateClaim` and mints for `claimant_`.
   * - Records the current block as the claim-tier for this contract.
   * - emits a `Claim` event as per `IClaim`.
   *
   * @param claimant - address receiving minted tokens. MUST be `msg.sender`
   * if `allowDelegatedClaims` is `false`.
   * @param data - NOT used onchain. Forwarded to `Claim` event for potential
   * additional offchain processing.
   * @param overrides - @see TxOverrides
   */
  public readonly claim: (
    claimant: string,
    data: BytesLike,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Returns the number of decimals used to get its user representation.
   *
   * @param overrides - @see ReadTxOverrides
   * @returns The decimals of the Emissions contract
   */
  public readonly decimals: (overrides?: ReadTxOverrides) => Promise<number>;

  /**
   * Atomically decreases the allowance granted to `spender` by the caller.
   *
   * This is an alternative to `approve()` that can be used as a mitigation for
   * problems described in https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729.
   *
   * @param spender - address to decrease the allowance
   * @param subtractedValue - amount to decrease
   * @param overrides - @see TxOverrides
   */
  public readonly decreaseAllowance: (
    spender: string,
    subtractedValue: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Atomically increases the allowance granted to `spender` by the caller.
   *
   * This is an alternative to `approve()` that can be used as a mitigation for
   * problems described in https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729.
   *
   * @param spender - address to increase the allowance
   * @param addedValue - amount to increase
   * @param overrides - @see TxOverrides
   */
  public readonly increaseAllowance: (
    spender: string,
    addedValue: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   *  Returns the name of the token.
   *
   * @param overrides - @see ReadTxOverrides
   * @returns The name of the Emissions contract
   */
  public readonly name: (overrides?: ReadTxOverrides) => Promise<string>;

  /**
   * Returns the symbol of the token, usually a shorter version of the name.
   *
   * @param overrides - @see ReadTxOverrides
   * @returns The symbol of the Emissions contract
   */
  public readonly symbol: (overrides?: ReadTxOverrides) => Promise<string>;

  /**
   * Returns the amount of tokens in existence.
   *
   * @param overrides - @see ReadTxOverrides
   * @returns The total supply that have the Emissions
   */
  public readonly totalSupply: (
    overrides?: ReadTxOverrides
  ) => Promise<BigNumber>;

  /**
   * Moves `amount` tokens from the caller's account to `to`.
   *
   * Requirements:
   *
   * - `to` cannot be the zero address.
   * - the caller must have a balance of at least `amount`.
   *
   * @param to - address that will receive the tokens
   * @param amount - token amount to transfer
   * @param overrides -  @see TxOverrides
   */
  public readonly transfer: (
    to: string,
    amount: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Moves `amount` tokens from `from` to `to` using the allowance mechanism. `amount` is
   * then deducted from the caller's allowance.
   *
   * NOTE: Does not update the allowance if the current allowance is the maximum `uint256`.
   *
   * Requirements:
   *
   * - `from` and `to` cannot be the zero address.
   * - `from` must have a balance of at least `amount`.
   * - the caller must have allowance for `from`'s tokens of at least `amount`.
   *
   * @param from - address that have the tokens to transfer
   * @param to - address that will receive the tokens
   * @param amount - token amount to transfer
   * @param overrides - @see TxOverrides
   */
  public readonly transferFrom: (
    from: string,
    to: string,
    amount: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Pointers to opcode functions, necessary for being able to read the packedBytes
   *
   * @param override - @see ReadTxOverrides
   * @returns the opcode functions pointers
   */
  public readonly fnPtrs: (overrides?: ReadTxOverrides) => Promise<string>;

  /**
   * Returns the pointer and length for emissionERC20's storage opcodes
   *
   * @param override - @see ReadTxOverrides
   * @returns a StorageOpcodesRange
   */
  public readonly storageOpcodesRange: (
    overrides?: ReadTxOverrides
  ) => Promise<StorageOpcodesRange>;
}

/**
 * @public
 * Everything required by the `EmissionsERC20` constructor.
 */
export interface EmissionsERC20DeployArgs {
  allowDelegatedClaims: boolean;
  erc20Config: ERC20Config;
  vmStateConfig: StateConfig;
}
