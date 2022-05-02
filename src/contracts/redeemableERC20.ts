import { Signer, BigNumber, BigNumberish, ContractTransaction } from 'ethers';
import {
  ERC20Config,
  TxOverrides,
  ReadTxOverrides,
} from '../classes/rainContract';
import { FactoryContract } from '../classes/factoryContract';

import {
  RedeemableERC20__factory,
  RedeemableERC20Factory__factory,
} from '../typechain';

/**
 * @public
 * A class for calling methods on a RedeemableERC20.
 *
 * This is the ERC20 token that is minted and distributed.
 *
 * During `Phase.ZERO` the token can be traded and so compatible with the Balancer pool mechanics.
 * During `Phase.ONE` the token is frozen and no longer able to be traded on any AMM or transferred
 * directly.
 *
 * The token can be redeemed during `Phase.ONE` which burns the token in exchange for pro-rata erc20
 * tokens held by the `RedeemableERC20` contract itself.
 *
 * The token balances can be used indirectly for other claims, promotions and events as a proof of
 * participation in the original distribution by token holders.
 *
 * The token can optionally be restricted by the `ITier` contract to only allow receipients with a
 * specified membership status.
 *
 * @remarks
 *   This class provides an easy way to interact with RedeemableERC20's.
 *
 * @example
 * ```typescript
 * import { RedeemableERC20 } from 'rain-sdk';
 *
 * // To get a instance of an already deployed redeemable, pass the contract address and an ethers.js Signer
 * const redeemable = new RedeemableERC20(address, signer);
 *
 * // Check if an address is child from the factory deployed in the current chain.
 * await RedeemableERC20.isChild(signer, maybeChildAddress);
 *```
 */

export class RedeemableERC20 extends FactoryContract {
  protected static readonly nameBookReference = 'redeemableERC20Factory';

  /**
   * Constructs a new RedeemableERC20 from a known address.
   *
   * @param address - The address of the RedeemableERC20 contract
   * @param signer - An ethers.js Signer
   * @returns A new RedeemableERC20 instance
   *
   */
  constructor(address: string, signer: Signer) {
    super(address, signer);
    const _redeemable = RedeemableERC20__factory.connect(address, signer);

    this.allowance = _redeemable.allowance;
    this.approve = _redeemable.approve;
    this.balanceOf = _redeemable.balanceOf;
    this.blockNumberForPhase = _redeemable.blockNumberForPhase;
    this.burn = _redeemable.burn;
    this.burnFrom = _redeemable.burnFrom;
    this.currentPhase = _redeemable.currentPhase;
    this.decimals = _redeemable.decimals;
    this.decreaseAllowance = _redeemable.decreaseAllowance;
    this.endDistribution = _redeemable.endDistribution;
    this.grantReceiver = _redeemable.grantReceiver;
    this.grantSender = _redeemable.grantSender;
    this.increaseAllowance = _redeemable.increaseAllowance;
    this.isReceiver = _redeemable.isReceiver;
    this.isSender = _redeemable.isSender;
    this.name = _redeemable.name;
    this.minimumTier = _redeemable.minimumTier;
    this.newTreasuryAsset = _redeemable.newTreasuryAsset;
    this.phaseAtBlockNumber = _redeemable.phaseAtBlockNumber;
    this.phaseBlocks = _redeemable.phaseBlocks;
    this.redeem = _redeemable.redeem;
    this.symbol = _redeemable.symbol;
    this.tier = _redeemable.tier;
    this.totalSupply = _redeemable.totalSupply;
    this.transfer = _redeemable.transfer;
    this.transferFrom = _redeemable.transferFrom;
  }

  /**
   * Deploys a new RedeemableERC20.
   *
   * @param signer - An ethers.js Signer
   * @param args - Arguments for deploying a RedeemableERC20 @see RedeemableERC20DeployArgs
   * @param overrides - @see TxOverrides
   * @returns A new RedeemableERC20 instance
   *
   */
  public static deploy = async (
    signer: Signer,
    args: RedeemableERC20DeployArgs,
    overrides: TxOverrides = {}
  ): Promise<RedeemableERC20> => {
    const redeemableFactory = RedeemableERC20Factory__factory.connect(
      this.getBookAddress(await this.getChainId(signer)),
      signer
    );

    const tx = await redeemableFactory.createChildTyped(args, overrides);
    const receipt = await tx.wait();
    const address = this.getNewChildFromReceipt(receipt, redeemableFactory);
    return new RedeemableERC20(address, signer);
  };

  public readonly connect = (signer: Signer): RedeemableERC20 => {
    return new RedeemableERC20(this.address, signer);
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
   * Pure function to reduce an array of phase blocks and phase to a specific block number.
   * `Phase.ZERO` will always return block `0`.
   * Every other phase will map to a block number in `phaseBlocks`.
   *
   * @param phaseBlocks - Fixed array of phase blocks to compare against.
   * @param phase - Determine the relevant block number for this phase.
   * @param overrides - @see ReadTxOverrides
   * @returns The block number for the phase according to `phaseBlocks_`.
   */
  public readonly blockNumberForPhase: (
    phaseBlocks: BigNumberish[],
    phase: BigNumberish,
    overrides?: ReadTxOverrides
  ) => Promise<BigNumber>;

  /**
   * Destroys `amount` tokens from the caller, reducing the total supply.
   * Emits a `Transfer` event with `to` set to the zero address.
   *
   * Requirements:
   * - Caller MUST have at least `amount` tokens.
   *
   * @param amount - The amount of token to burn
   * @param overrides - @see TxOverrides
   */
  public readonly burn: (
    amount: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Destroys `amount` tokens from `account`, deducting from the caller's allowance.
   *
   * Requirements:
   * - The caller must have allowance for `accounts`'s tokens of at least
   * `amount`.
   *
   * @param account - The account that hold the tokens which will be burned
   * @param amount - The amount of token to burn
   * @param overrides - @see TxOverrides
   */
  public readonly burnFrom: (
    account: string,
    amount: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Impure read-only function to return the "current" phase from internal contract state.
   * Simply wraps `phaseAtBlockNumber` for current values of `phaseBlocks` and `block.number`.
   *
   * @param overrides - @see ReadTxOverrides
   * @returns The current phase in the Redeemable
   */
  public readonly currentPhase: (
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
   * The admin can forward or burn all tokens of a single address to end
   * `PHASE_DISTRIBUTING`.
   *
   * The intent is that during `PHASE_DISTRIBUTING` there is some contract
   * responsible for distributing the tokens.
   *
   * The admin specifies the distributor to end `PHASE_DISTRIBUTING` and the
   * forwarding address set during initialization is used. If the forwarding
   * address is `0` the rTKN will be burned, otherwise the entire balance of
   * the distributor is forwarded to the nominated address. In practical
   * terms the forwarding allows for escrow depositors to receive a prorata
   * claim on unsold rTKN if they forward it to themselves, otherwise raise
   * participants will receive a greater share of the final escrowed tokens
   * due to the burn reducing the total supply.
   *
   * The distributor is NOT set during the constructor because it may not
   * exist at that point. For example, Balancer needs the paired erc20
   * tokens to exist before the trading pool can be built.
   *
   * @param distributor - The distributor according to the admin. BURN the tokens
   * if `address(0)`.
   * @param overrides - @see TxOverrides
   */
  public readonly endDistribution: (
    distributor: string,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Admin can grant an address receiver rights.
   *
   * Requirements:
   * - Caller have to be the admin
   *
   * @param newReceiver - The account to grand receiver.
   * @param overrides - @see TxOverrides
   */
  public readonly grantReceiver: (
    newReceiver: string,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Admin can grant an addres sender rights.
   *
   * Requirements:
   * - Caller have to be the admin
   *
   * @param newSender - The account to grant sender.
   * @param overrides - @see TxOverrides
   */
  public readonly grantSender: (
    newSender: string,
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
   * Check that an address is a receiver. A sender is also a receiver.
   *
   * @param maybeReceiver - account to check.
   * @param overrides - @see ReadTxOverrides
   * @returns true if account is a receiver.
   */
  public readonly isReceiver: (
    maybeReceiver: string,
    overrides?: ReadTxOverrides
  ) => Promise<boolean>;

  /**
   * Check that an address is a sender.
   *
   * @param maybeSender - account to check.
   * @param overrides - @see ReadTxOverrides
   * @returns true if account is a sender.
   */
  public readonly isSender: (
    maybeSender: string,
    overrides?: ReadTxOverrides
  ) => Promise<boolean>;

  /**
   * The minimum status that a user must hold to receive transfers during `Phase.ZERO`.
   *
   * @param overrides - @see ReadTxOverrides
   * @returns The minimum tier status in the required in the Redeemable
   */
  public readonly minimumTier: (
    overrides?: ReadTxOverrides
  ) => Promise<BigNumber>;

  /**
   *  Returns the name of the token.
   *
   * @param overrides - @see ReadTxOverrides
   * @returns The name of the Redeemable
   */
  public readonly name: (overrides?: ReadTxOverrides) => Promise<string>;

  /**
   * Anon can emit a `TreasuryAsset` event to notify token holders that an asset could
   * be redeemed by burning `RedeemableERC20` tokens.
   *
   * As this is callable by anon the events should be filtered by the indexer to those
   * from trusted entities only.
   * @param newTreasuryAsset - The asset to log.
   * @param overrides - @see TxOverrides
   */
  public readonly newTreasuryAsset: (
    newTreasuryAsset: string,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Pure function to reduce an array of phase blocks and block number to a specific `Phase`.
   *
   * The phase will be the highest attained even if several phases have the same block number.
   *
   * If every phase block is after the block number then `0` is returned.
   *
   * If every phase block is before the block number then `MAX_PHASE` is returned.
   *
   * @param phaseBlocks - Fixed array of phase blocks to compare against.
   * @param blockNumber - Determine the relevant phase relative to this block number.
   * @param overrides - @see ReadTxOverrides
   * @returns the phase relative to the block number and phase blocks list.
   */
  public readonly phaseAtBlockNumber: (
    phaseBlocks: BigNumberish[],
    blockNumber: BigNumberish,
    overrides?: ReadTxOverrides
  ) => Promise<BigNumber>;

  /**
   * Get a phaseBlock
   *
   * @param index - The index to get the phaseBlock. There are 8 phases. The index
   * should be between 0 and 7.
   * @param overrides - @see ReadTxOverrides
   * @returns the phase block
   */
  public readonly phaseBlocks: (
    index: BigNumberish,
    overrides?: ReadTxOverrides
  ) => Promise<number>;

  /**
   * Burn tokens for a prorata share of the current treasury.
   * The assets to be redeemed for must be specified as an array. This keeps the redeem functionality:
   *
   * - Gas efficient as we avoid tracking assets in storage
   * - Decentralised as any user can deposit any asset to be redeemed
   * - Error resistant as any individual asset reverting can be avoided by redeeming againt sans the problematic asset.
   *
   * It is also a super sharp edge if someone burns their tokens prematurely or with an incorrect
   * asset list. Implementing contracts are strongly encouraged to implement additional safety
   * rails to prevent high value mistakes.
   *
   * Only "vanilla" erc20 token balances are supported as treasury assets. I.e. if the balance is
   * changing such as due to a rebasing token or other mechanism then the WRONG token amounts will
   * be redeemed. The redemption calculation is very simple and naive in that it takes the current
   * balance of this contract of the assets being claimed via redemption to calculate the "prorata"
   * entitlement. If the contract's balance of the claimed token is changing between redemptions (other
   * than due to the redemption itself) then each redemption will send incorrect amounts.
   *
   * @param treasuryAssets - The list of assets to redeem for. If this is empty or incomplete then tokens
   * will be permanently burned for no reason by the caller and the remaining funds will be effectively
   * redistributed to everyone else.
   * @param redeemAmount - The amount of redeemable token to burn.
   * @param overrides - @see TxOverrides
   */
  public readonly redeem: (
    treasuryAssets: string[],
    redeemAmount: BigNumberish,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Returns the symbol of the token, usually a shorter version of the name.
   *
   * @param overrides - @see ReadTxOverrides
   * @returns The symbol of the Emissions contract
   */
  public readonly symbol: (overrides?: ReadTxOverrides) => Promise<string>;

  /**
   * Tier contract that produces the report that `minimumTier` is checked against.
   *
   * @param overrides - @see ReadTxOverrides
   * @returns The tier contract address
   */
  public readonly tier: (overrides?: ReadTxOverrides) => Promise<string>;

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

/**
 * @public
 * Everything required by the `RedeemableERC20` constructor.
 */
export interface RedeemableERC20DeployArgs {
  /**
   * Reserve token that the associated `Trust` or equivalent raise contract will be forwarding
   * to the `RedeemableERC20` contract.
   */
  reserve: string;
  /**
   * ERC20 config forwarded to the ERC20 constructor.
   */
  erc20Config: ERC20Config;
  /**
   * Tier contract to compare statuses against on transfer.
   */
  tier: string;
  /**
   * Minimum tier required for transfers in `Phase.ZERO`. Can be `0`.
   */
  minimumTier: BigNumberish;
  /**
   * Optional address to send rTKN to at the end of the distribution phase. If `0` address then
   * all undistributed rTKN will burn itself at the end of the distribution.
   */
  distributionEndForwardingAddress: string;
}
