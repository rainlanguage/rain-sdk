import { ERC20Burnable__factory, ERC20Snapshot__factory } from '../../typechain';
import { BigNumberish, BigNumber, Signer, ContractTransaction } from 'ethers';
import { TxOverrides, ReadTxOverrides, RainContract } from '../../classes/rainContract';

/**
 * @public
 * A generic ERC20 interface to get connected to any ERC20 address and make transactions.
 *
 * @remarks
 * The interface only have and provide generic and common methods calls. Remember that any specific
 * method implemented in the contract will NOT be available in this interface.
 * Can get connected to ERC20Snapshot as well.
 * 
 */
export class ERC20 {
  public readonly signer: Signer;
  public readonly address: string;

  /**
   * Constructs a new ERC20 from a known address.
   *
   * @param address - The address of the ERC20 contract
   * @param signer - An ethers.js Signer
   * @param isSnapshot - (optional) True if the token is ERC20Snapshot
   * @returns A new ERC20 instance
   */
  constructor(address: string, signer: Signer, isSnapshot?: boolean) {
    let _erc20;
    this.address = address;
    this.signer = signer;
    RainContract.checkAddress(address);

    if (isSnapshot) {
      _erc20 = ERC20Snapshot__factory.connect(address, signer);
      this.balanceOfAt = _erc20.balanceOfAt;
      this.totalSupplyAt = _erc20.totalSupplyAt;
    }
    else {
      _erc20 = ERC20Burnable__factory.connect(address, signer);
      this.burn = _erc20.burn;
      this.burnFrom = _erc20.burnFrom;
    }

    this.allowance = _erc20.allowance;
    this.approve = _erc20.approve;
    this.balanceOf = _erc20.balanceOf;
    this.decimals = _erc20.decimals;
    this.decreaseAllowance = _erc20.decreaseAllowance;
    this.increaseAllowance = _erc20.increaseAllowance;
    this.name = _erc20.name;
    this.symbol = _erc20.symbol;
    this.totalSupply = _erc20.totalSupply;
    this.transfer = _erc20.transfer;
    this.transferFrom = _erc20.transferFrom;
  }

  /**
   * Check if the address is an IERC20.
   *
   * @remarks
   * A valid IERC20 are those contracts that have generics methods in their interface with same signature.
   *
   * @param address - Address to check if is the IERC20
   * @param signer - Signer necessary to valid the IERC20
   * @returns True if the address is a valid IERC20
   */
  public static isERC20 = async (
    address: string,
    signer: Signer
  ): Promise<boolean> => {
    let erc20 = new ERC20(address, signer);

    try {
      await erc20.name();
      await erc20.symbol();
      await erc20.decimals();
      const balance = await erc20.balanceOf(await signer.getAddress());

      if (!balance) {
        return Promise.resolve(false);
      }
      // It's a ERC20
      return Promise.resolve(true);
    } catch (error) {
      return Promise.resolve(false);
    }
  };

  /**
   * Connect the current instance of the ERC20 to a new signer
   *
   * @param signer - The new signer which will be connected
   * @returns The instance with a new signer
   */
  public readonly connect = (signer: Signer): ERC20 => {
    return new ERC20(this.address, signer);
  };

  /**
   * Create new instance with same signer but different contract address
   *
   * @param address - The new address which will be attached the instance
   * @returns The instance with a new signer
   */
  public readonly attach = (address: string): ERC20 => {
    return new ERC20(address, this.signer);
  };

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
   * Returns the number of decimals used to get its user representation.
   *
   * @param overrides - @see ReadTxOverrides
   * @returns The decimals of the Redeemable contract
   */
  public readonly decimals: (overrides?: ReadTxOverrides) => Promise<number>;

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
   *  Returns the name of the token.
   *
   * @param overrides - @see ReadTxOverrides
   * @returns The name of this token
   */
  public readonly name: (overrides?: ReadTxOverrides) => Promise<string>;

  /**
   * Returns the symbol of the token, usually a shorter version of the name.
   *
   * @param overrides - @see ReadTxOverrides
   * @returns The symbol of this token
   */
  public readonly symbol: (overrides?: ReadTxOverrides) => Promise<string>;

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

  /**
   * Destroys `amount` tokens from the caller.
   *
   * @param amount -  Amount of tokens to burn
   * @param overrides - @see TxOverrides
   */
  public readonly burn?: (
    amount: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Destroys `amount` tokens from `account`, deducting from the caller's
   * allowance.
   * Requirements:
   *
   * - the caller must have allowance for `accounts`'s tokens of at least
   * `amount`.
   *
   * @param account - Account address to get the balance
   * @param amount -  Amount of tokens to burn
   */
  public readonly burnFrom?: (
    account: string,
    amount: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Get the totalSupply at the snapshotId
   *
   * @param snapshotId -  snapshotId of tokens to get the totalSupply at
   * @param overrides - @see TxOverrides
   */
  public readonly totalSupplyAt?: (
    snapshotId: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<BigNumber>;

  /**
   * Get the balanceOf the account at the snapshotId
   *
   * @param account - Account address to get the balance of at
   * @param snapshotId -  snapshotId 
   */
  public readonly balanceOfAt?: (
    account: string,
    snapshotId: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<BigNumber>;
}
