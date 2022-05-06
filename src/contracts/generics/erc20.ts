import { ERC20Burnable__factory } from '../../typechain';
import { BigNumberish, BigNumber, Signer, ContractTransaction } from 'ethers';
import { TxOverrides, ReadTxOverrides } from '../../classes/rainContract';

/**
 * @public
 *
 * Generic ERC20 interface to get connected to any ERC20 address and make transactions.
 *
 * Take in mind that only have generics function calls.
 */
export class ERC20 {
  public readonly signer: Signer;
  public readonly address: string;

  /**
   * Constructs a new ERC20 from a known address.
   *
   * @param address - The address of the ERC20 contract
   * @param signer - An ethers.js Signer
   * @returns A new ERC20 instance
   *
   */
  constructor(address: string, signer: Signer) {
    this.address = address;
    this.signer = signer;
    const _erc20 = ERC20Burnable__factory.connect(address, signer);

    this.allowance = _erc20.allowance;
    this.approve = _erc20.approve;
    this.balanceOf = _erc20.balanceOf;
    this.burn = _erc20.burn;
    this.burnFrom = _erc20.burnFrom;
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
   * Connect the current instance to a new signer
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
   * Destroys `amount` tokens from the caller.
   *
   * @param amount -  Amount of tokens to burn
   * @param overrides - @see TxOverrides
   */
  public readonly burn: (
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
  public readonly burnFrom: (
    account: string,
    amount: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Returns the number of decimals used to get its user representation.
   *
   * @param overrides - @see ReadTxOverrides
   * @returns The decimals of the Redeemable contract
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
   * @returns The name of the Redeemable
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
}
