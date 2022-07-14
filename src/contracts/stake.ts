import { TierContract } from '../classes/tierContract';
import { Stake__factory, StakeFactory__factory } from '../typechain';
import { TxOverrides, ReadTxOverrides } from '../classes/rainContract';
import {
  Signer,
  BigNumber,
  BigNumberish,
  BytesLike,
  ContractTransaction,
} from 'ethers';

/**
 * @public
 * A class for calling methods on a Stake.
 *
 * @remarks
 * This class provides an easy way to interact with Stake contracts.
 *
 * @example
 * ```typescript
 * import { Stake } from 'rain-sdk';
 *
 * // To get a instance of an already deployed stake contract, pass the contract address and an ethers.js Signer
 * const stake = new Stake(address, signer);
 *
 * // Check if an address is child from the factory deployed in the current chain.
 * await Stake.isChild(signer, maybeChildAddress);
 *```
 */
export class Stake extends TierContract {
  protected static readonly nameBookReference: string = 'stakeFactory';

  /**
   * Constructs a new Stake from a known address.
   *
   * @param address - The address of the Stake contract
   * @param signer - An ethers.js Signer
   * @returns A new Stake instance
   */
  constructor(address: string, signer: Signer) {
    Stake.checkAddress(address);

    const _stake = Stake__factory.connect(address, signer);
    super(address, signer, _stake);
    
    this.allowance = _stake.allowance;
    this.approve = _stake.approve;
    this.balanceOf = _stake.balanceOf;
    this.decimals = _stake.decimals;
    this.decreaseAllowance = _stake.decreaseAllowance;
    this.deposit = _stake.deposit;
    this.increaseAllowance = _stake.increaseAllowance;
    this.name = _stake.name;
    this.supportsInterface = _stake.supportsInterface;
    this.symbol = _stake.symbol;
    this.totalSupply = _stake.totalSupply;
    this.transfer = _stake.transfer;
    this.transferFrom = _stake.transferFrom;
    this.withdraw = _stake.withdraw;
  }

  /**
   * Deploys a new Stake.
   *
   * @param signer - An ethers.js Signer
   * @param stakeConfig - Configuration for deploying a Stake @see StakeDeployArgs
   * @param overrides - @see TxOverrides
   * @returns A new Stake instance
   *
   */
  public static deploy = async (
    signer: Signer,
    stakeConfig: StakeDeployArgs,
    overrides: TxOverrides = {}
  ): Promise<Stake> => {
    const stakeFactory = StakeFactory__factory.connect(
      this.getBookAddress(await this.getChainId(signer)),
      signer
    );

    const tx = await stakeFactory.createChildTyped(stakeConfig, overrides);
    const receipt = await tx.wait();
    const address = this.getNewChildFromReceipt(receipt, stakeFactory);
    return new Stake(address, signer);
  };

  /**
   * @public
   * Conncect to this Stake contract with another signer
   * 
   * @param signer - the signer to get connected to the Stake instance
   * @returns the Stake instance with the new signer
   */
  public readonly connect = (signer: Signer): Stake => {
    return new Stake(this.address, signer);
  };

  /**
   * Checks if address is registered as a child contract of this StakeFactory on a specific network
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
   * Method to deposit some 'amount_' of token (assets) by the signer into the Stake contract which then will result
   * in minting of the stake token (shares) at the current Stake contract ratio and be transfered to the signer's wallet.
   * 
   * @param amount_ - amount of tokens (assets) to be deposited into the Stake contract
   * @param overrides - @see TxOverrides
   * @returns
   */
  public readonly deposit: (
    amount_: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * @public
   * Method to Withdraw some amount of already staked token (assets) by the signer from the Stake contract which then will result
   * in burning of 'amount_' of stake tokens (shares) and will result in a transfer of asset at the current Stake contract ratio to the signer's wallet.
   * 
   * 
   * @param amount_ - amount of stake token (shares) to be burned and result in the withdraw of the equivalent prorata of asset
   * @param overrides - @see TxOverrides
   * @returns
   */
  public readonly withdraw: (
    amount_: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

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
   * Approve spend limit `amount` as the allowance for a `spender` over this tokens.
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
   * @returns Amount of tokens that the owner has
   */
  public readonly balanceOf: (
    account: string,
    overrides?: ReadTxOverrides
  ) => Promise<BigNumber>;

  /**
   * Returns the amount of tokens in existence.
   *
   * @param overrides - @see ReadTxOverrides
   * @returns The current total supply of this token
   */
  public readonly totalSupply: (
    overrides?: ReadTxOverrides
  ) => Promise<BigNumber>;

  /**
   * Returns the name of the token.
   *
   * @param overrides - @see ReadTxOverrides
   * @returns The name of this Stake token
   */
  public readonly name: (overrides?: ReadTxOverrides) => Promise<string>;

  /**
   * Returns the symbol of the token, usually a shorter version of the name.
   *
   * @param overrides - @see ReadTxOverrides
   * @returns The symbol of this Stake token
   */
  public readonly symbol: (overrides?: ReadTxOverrides) => Promise<string>;

  /**
   * Returns the number of decimals used to get its user representation. (It is always 18 for this contract type)
   *
   * @param overrides - @see ReadTxOverrides
   * @returns The decimals of the Redeemable contract
   */
  public readonly decimals: (overrides?: ReadTxOverrides) => Promise<number>;

  /**
   * Automically increases the allowance granted to `spender` for this token.
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
   * Automatically decreases the allowance granted to `spender` for this token.
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
   * Returns true if this contract implements the interface defined by
   * `interfaceId`. See the corresponding
   * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
   * to learn more about how these ids are created.
   *
   * This function call must use less than 30 000 gas.
   * 
   * @param interfaceId_ - 
   * @param overrides - @see TxOverrides
   * @returns A boolean
   */
  public readonly supportsInterface: (
    interfaceId_: BytesLike,
    overrides?: ReadTxOverrides
  ) => Promise<boolean>;

  /**
   * Moves `amount` of tokens from the caller's account to `to`.
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
   * Moves `amount` of tokens from `from` to `to` using the allowance mechanism. `amount` is
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

}

/**
 * @public
 * A type for deploying a new stake contract which contains everything required for deployment.
 * 
 * 'token' is the main token addtess.
 * 'initialRatio' is the initial conversion ratio between the stake token and main token.
 * 'name' of the stake token.
 * 'symbol' of the stake token
 */
export type StakeDeployArgs = {
  token: string;
  initialRatio: BigNumberish;
  name: string;
  symbol: string;
};
