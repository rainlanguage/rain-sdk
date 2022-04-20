import { Signer, BigNumberish, utils, ContractTransaction } from 'ethers';
import { RainContract, TxOverrides } from '../classes/rainContract';
import { RedeemableERC20ClaimEscrow__factory } from '../typechain';

/**
 * @public
 * A class for calling methods on a RedeemableERC20ClaimEscrow.
 *
 * Escrow contract for ERC20 tokens to be deposited and withdrawn against
 * redeemableERC20 tokens from a specific `Sale`.
 *
 * When some token is deposited the running total of that token against the
 * trust is incremented by the deposited amount. When some `redeemableERC20`
 * token holder calls `withdraw` they are sent the full balance they have not
 * previously claimed, multiplied by their fraction of the redeemable token
 * supply that they currently hold. As redeemable tokens are frozen after
 * distribution there are no issues with holders manipulating withdrawals by
 * transferring tokens to claim multiple times.
 *
 * @remarks
 *  This class provides an easy way to interact with the Escrow Rain
 *
 * @example
 * ```typescript
 * import { RedeemableERC20ClaimEscrow } from 'rain-sdk'
 *
 * // If the escrow address is unkwon or want to simplify the process, use get() to create the instance.
 * // This use the provider inside the signer to get the chainId and search the correct address.
 * const escrow = RedeemableERC20ClaimEscrow(saleAddress, tokenAddress, ethersSigner);
 *
 * const tx = escrow.deposit(amount);
 * ```
 */

export class RedeemableERC20ClaimEscrow extends RainContract {
  protected static readonly nameBookReference = 'redeemableERC20ClaimEscrow';

  /**
   * The `ISale` contract address that is used to interact with the Escrow contract.
   *
   * Get a new instance with different ISale use:
   * ```typescript
   * const newInstance = escrowInstance.changeSale(newSaleAddress);
   * // Using same IERC20 token but different Sale
   * const tx = await newInstance.deposit(amount);
   * ```
   *
   */
  public readonly sale: string;

  /**
   * The `IERC20` token being deposited and that will be use to interact with the Escrow contract
   *
   * Get a new instance with different ISale use:
   * ```typescript
   * const newInstance = escrowInstance.changeToken(newAddress);
   * // Using same Sale token but different IERC20
   * const tx = await newInstance.deposit(amount);
   * ```
   */
  public readonly token: string;

  /**
   * Constructs a new RedeemableERC20ClaimEscrow from a known address.
   *
   * @param address - The address of the NoticeBoard contract
   * @param signer - An ethers.js Signer
   * @returns A new NoticeBoard instance
   *
   */
  constructor(
    address: string,
    saleAddress: string,
    tokenAddress: string,
    signer: Signer
  ) {
    super(address, signer);
    const _claimEsrow = RedeemableERC20ClaimEscrow__factory.connect(
      address,
      signer
    );

    if (!utils.isAddress(saleAddress)) {
      throw new Error('SALE: NOT A VALID FORMAT ADDRESS');
    }
    if (!utils.isAddress(tokenAddress)) {
      throw new Error('TOKEN: NOT A VALID FORMAT ADDRESS');
    }
    this.sale = saleAddress;
    this.token = tokenAddress;

    this._deposit = _claimEsrow.deposit;
    this._depositPending = _claimEsrow.depositPending;
    this._sweepPending = _claimEsrow.sweepPending;
    this._undeposit = _claimEsrow.undeposit;
    this._withdraw = _claimEsrow.withdraw;
  }

  /**
   * Create the RedeemableERC20ClaimEscrow instance.
   *
   * The function ask to the provider inside of the ethers signer what is the chain
   * identifier to get the address in this chain.
   *
   * @param saleAddress
   * @param tokenAddress
   * @param signer
   */
  public static get = async (
    saleAddress: string,
    tokenAddress: string,
    signer: Signer
  ): Promise<RedeemableERC20ClaimEscrow> => {
    return new RedeemableERC20ClaimEscrow(
      this.getBookAddress(await this.getChainId(signer)),
      saleAddress,
      tokenAddress,
      signer
    );
  };

  /**
   * Get a new instance with a different Sale to interact with the Escrow contract
   * @param newSale A new ISale address
   * @returns A new RedeemableERC20ClaimEscrow instance
   */
  public readonly changeSale = (
    newSale: string
  ): RedeemableERC20ClaimEscrow => {
    if (!utils.isAddress(newSale)) {
      throw new Error('SALE: NOT A VALID FORMAT ADDRESS');
    }

    return new RedeemableERC20ClaimEscrow(
      this.address,
      newSale,
      this.token,
      this.signer
    );
  };

  /**
   * Get a new instance with a different ERC20 to interact with the Escrow contract
   * @param newToken A new IERC20 address
   * @returns A new RedeemableERC20ClaimEscrow instance
   */
  public readonly changeToken = (
    newToken: string
  ): RedeemableERC20ClaimEscrow => {
    if (!utils.isAddress(newToken)) {
      throw new Error('TOKEN: NOT A VALID FORMAT ADDRESS');
    }

    return new RedeemableERC20ClaimEscrow(
      this.address,
      this.sale,
      newToken,
      this.signer
    );
  };

  /* Any address can deposit any amount of the token`IERC20` under the `Sale`.
   * The `Sale` MUST be a child of the trusted factory.
   *
   * The deposit will be accounted for under both the depositor individually
   * and the trust in aggregate. The aggregate value is used by `withdraw`
   * and the individual value by `undeposit`.
   *
   * The depositor is responsible for approving the token for this contract.
   * `deposit` is still enabled after the distribution ends; `undeposit` is
   * always allowed in case of a fail and disabled on success. Multiple
   * `deposit` calls before and after a success result are supported. If a
   * depositor deposits when a raise has failed they will need to undeposit
   * it again manually.
   *
   * Delegated `deposit` is not supported. Every depositor is directly
   * responsible for every `deposit`.
   *
   * WARNING: As `undeposit` can only be called when the `Sale` reports
   * failure, `deposit` should only be called when the caller is sure the
   * `Sale` will reach a clear success/fail status. For example, when a
   * `Sale` has not yet been seeded it may never even start the raise so
   * depositing at this point is dangerous. If the `Sale` never starts the
   * raise it will never fail the raise either.
   *
   * @param sale The `Sale` to assign this deposit to.
   * @param token The `IERC20` token to deposit to the escrow.
   * @param amount The amount of token to deposit. Requires depositor has
   * approved at least this amount to succeed.
   * @param overrides - @see TxOverrides
   */
  public readonly deposit = async (
    amount: BigNumberish,
    overrides?: TxOverrides
  ): Promise<ContractTransaction> => {
    const tx = await this._deposit(this.sale, this.token, amount, overrides);
    return tx;
  };

  public readonly depositPending = async (
    amount: BigNumberish,
    overrides?: TxOverrides
  ): Promise<ContractTransaction> => {
    const tx = await this._depositPending(
      this.sale,
      this.token,
      amount,
      overrides
    );
    return tx;
  };

  public readonly sweepPending = async (
    depositor: string,
    overrides?: TxOverrides
  ): Promise<ContractTransaction> => {
    const tx = await this._sweepPending(
      this.sale,
      this.token,
      depositor,
      overrides
    );
    return tx;
  };

  public readonly undeposit = async (
    supply: BigNumberish,
    amount: BigNumberish,
    overrides?: TxOverrides
  ): Promise<ContractTransaction> => {
    const tx = await this._undeposit(
      this.sale,
      this.token,
      supply,
      amount,
      overrides
    );
    return tx;
  };

  public readonly withdraw = async (
    supply: BigNumberish,
    overrides?: TxOverrides
  ): Promise<ContractTransaction> => {
    const tx = await this._withdraw(this.sale, this.token, supply, overrides);
    return tx;
  };

  /**
   * Any address can deposit any amount of its own `IERC20` under a `Sale`.
   * The `Sale` MUST be a child of the trusted factory.
   *
   * The deposit will be accounted for under both the depositor individually
   * and the trust in aggregate. The aggregate value is used by `withdraw`
   * and the individual value by `undeposit`.
   *
   * The depositor is responsible for approving the token for this contract.
   * `deposit` is still enabled after the distribution ends; `undeposit` is
   * always allowed in case of a fail and disabled on success. Multiple
   * `deposit` calls before and after a success result are supported. If a
   * depositor deposits when a raise has failed they will need to undeposit
   * it again manually.
   *
   * Delegated `deposit` is not supported. Every depositor is directly
   * responsible for every `deposit`.
   *
   * WARNING: As `undeposit` can only be called when the `Sale` reports
   * failure, `deposit` should only be called when the caller is sure the
   * `Sale` will reach a clear success/fail status. For example, when a
   * `Sale` has not yet been seeded it may never even start the raise so
   * depositing at this point is dangerous. If the `Sale` never starts the
   * raise it will never fail the raise either.
   *
   * @param sale The `Sale` to assign this deposit to.
   * @param token The `IERC20` token to deposit to the escrow.
   * @param amount The amount of token to deposit. Requires depositor has
   * approved at least this amount to succeed.
   * @param overrides - @see TxOverrides
   */
  private readonly _deposit: (
    sale: string,
    token: string,
    amount: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Depositor can set aside tokens during pending raise status to be swept
   * into a real deposit later.
   *
   * The problem with doing a normal deposit while the raise is still active
   * is that the `Sale` will burn all unsold tokens when the raise ends. If
   * we captured the token supply mid-raise then many deposited TKN would
   * be allocated to unsold rTKN. Instead we set aside TKN so that raise
   * participants can be sure that they will be claimable upon raise success
   * but they remain unbound to any rTKN supply until `sweepPending` is
   * called.
   *
   * `depositPending` is a one-way function, there is no way to `undeposit`
   * until after the raise fails. Strongly recommended that depositors do
   * NOT call `depositPending` until raise starts, so they know it will also
   * end.
   *
   * @param sale The `Sale` to assign this deposit to.
   * @param token The `IERC20` token to deposit to the escrow.
   * @param amount The amount of token to despoit. Requires depositor has
   * approved at least this amount to succeed.
   * @param overrides - @see TxOverrides
   */
  private readonly _depositPending: (
    sale: string,
    token: string,
    amount: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Anon can convert any existing pending deposit to a deposit with known
   * rTKN supply once the escrow has moved out of pending status.
   *
   * As `sweepPending` is anon callable, raise participants know that the
   * depositor cannot later prevent a sweep, and depositor knows that raise
   * participants cannot prevent a sweep. As per normal deposits, the output
   * of swept tokens depends on success/fail state allowing `undeposit` or
   * `withdraw` to be called subsequently.
   *
   * Partial sweeps are NOT supported, to avoid griefers splitting a deposit
   * across many different `supply_` values.
   *
   * @param sale The sale to sweep all pending deposits for.
   * @param token The token to sweep into registered deposits.
   * @param depositor The depositor to sweep registered deposits under.
   * @param overrides - @see TxOverrides
   */
  private readonly _sweepPending: (
    sale: string,
    token: string,
    depositor: string,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * The inverse of `deposit`.
   *
   * In the case of a failed distribution the depositors can claim back any
   * tokens they deposited in the escrow.
   *
   * Ideally the distribution is a success and this does not need to be
   * called but it is important that we can walk back deposits and try again
   * for some future raise if needed.
   *
   * Delegated `undeposit` is not supported, only the depositor can wind
   * back their original deposit.
   *
   * `amount` must be non-zero.
   *
   * If several tokens have been deposited against a given trust for the
   * depositor then each token must be individually undeposited. There is
   * no onchain tracking or bulk processing for the depositor, they are
   * expected to know what they have previously deposited and if/when to
   * process an `undeposit`.
   *
   * @param sale The `Sale` to undeposit from.
   * @param token The token to undeposit.
   * @param supply The total supply of the sale token associated with the
   * deposit being undeposited.
   * @param amount The amount to undeposit.
   * @param overrides - @see TxOverrides
   */
  private readonly _undeposit: (
    sale: string,
    token: string,
    supply: BigNumberish,
    amount: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * The successful handover of a `deposit` to a recipient.
   *
   * When a redeemable token distribution is successful the redeemable token
   * holders are automatically and immediately eligible to `withdraw` any
   * and all tokens previously deposited against the relevant `Sale`.
   * The `withdraw` can only happen if/when the relevant `Sale` reaches the
   * success distribution status.
   *
   * Delegated `withdraw` is NOT supported. Every redeemable token holder is
   * directly responsible for being aware of and calling `withdraw`.
   * If a redeemable token holder calls `redeem` they also burn their claim
   * on any tokens held in escrow so they MUST first call `withdraw` THEN
   * `redeem`.
   *
   * It is expected that the redeemable token holder knows about the tokens
   * that they will be withdrawing. This information is NOT tracked onchain
   * or exposed for bulk processing.
   *
   * Partial `withdraw` is not supported, all tokens allocated to the caller
   * are withdrawn`. 0 amount withdrawal is an error, if the prorata share
   * of the token being claimed is small enough to round down to 0 then the
   * withdraw will revert.
   *
   * Multiple withdrawals across multiple deposits is supported and is
   * equivalent to a single withdraw after all relevant deposits.
   *
   * @param sale The trust to `withdraw` against.
   * @param token The token to `withdraw`.
   * @param supply The total supply of the sale token at time of deposit
   * to process this withdrawal against.
   * @param overrides - @see TxOverrides
   */
  private readonly _withdraw: (
    sale: string,
    token: string,
    supply: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;
}
