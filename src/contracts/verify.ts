import { Verify__factory, VerifyFactory__factory } from '../typechain';
import { TxOverrides, ReadTxOverrides } from '../classes/rainContract';
import { FactoryContract } from '../classes/factoryContract';
import {
  Signer,
  BytesLike,
  BigNumber,
  BigNumberish,
  ContractTransaction,
  constants,
} from 'ethers';

/**
 * @public
 * Summary statuses derived from a `State` by comparing the `Since` times
 * against a specific block number.
 */
export enum VerifyStatus {
  /**
   * Account has not interacted with the system yet or was removed.
   */
  NIL,
  /**
   * Account has added evidence for themselves.
   */
  ADDED,
  /**
   * Approver has reviewed added/approve evidence and approved the account.
   */
  APPROVED,
  /**
   * Banner has reviewed a request to ban an account and banned it.
   */
  BANNED,
}

/**
 * @public
 * A class for deploying and calling methods on a Verify.
 *
 * @remarks
 * This class provides an easy way to deploy Verifies using Rain's canonical factories, and methods for interacting
 * with an already deployed Verify.
 *
 * Trust-minimised contract to record the state of some verification process. When some off-chain
 * identity is to be reified on chain there is inherently some multi-party, multi-faceted trust
 * relationship. For example, the DID (Decentralized Identifiers) specification from W3C outlines
 * that the controller and the subject of an identity are two different entities.
 *
 * @example
 * ```typescript
 * import { Verify } from 'rain-sdk'
 *
 * // To deploy a new Verify, pass an ethers.js Signer, the chainId and the config for the Verify.
 * const newVerify = await Verify.deploy(signer, chainId, VerifyConfigArgs)
 *
 * // To connect to an existing Verify just pass the address and an ethers.js Signer.
 * const existingVerify = new Verify(address, signer)
 *
 * // Once you have a Verify, you can call the smart contract methods:
 * ```
 *
 */

export class Verify extends FactoryContract {
  protected static readonly nameBookReference: string = 'verifyFactory';

  /** {@inheritDoc VerifyStatus} */
  public static status = VerifyStatus;

  /** {@inheritDoc VerifyStatus} */
  public status = VerifyStatus;

  /**
   * Constructs a new Verify from a known address.
   *
   * @param address - The address of the Verify contract
   * @param signer - An ethers.js Signer
   * @returns A new Verify instance
   *
   */
  constructor(address: string, signer: Signer) {
    Verify.checkAddress(address);

    super(address, signer);
    const _verify = Verify__factory.connect(address, signer);

    this.callback = _verify.callback;
    this.add = _verify.add;
    this.approve = _verify.approve;
    this.ban = _verify.ban;
    this.remove = _verify.remove;
    this.requestApprove = _verify.requestApprove;
    this.requestBan = _verify.requestBan;
    this.requestRemove = _verify.requestRemove;
    this.state = _verify.state;
    this.statusAtTime = _verify.statusAtTime;

    this.hasRole = _verify.hasRole;
    this.getRoleAdmin = _verify.getRoleAdmin;
    this.grantRole = _verify.grantRole;
    this.revokeRole = _verify.revokeRole;
    this.renounceRole = _verify.renounceRole;
    this.supportsInterface = _verify.supportsInterface;

    this.DEFAULT_ADMIN_ROLE = _verify.DEFAULT_ADMIN_ROLE;
    this.APPROVER_ADMIN = _verify.APPROVER_ADMIN;
    this.REMOVER_ADMIN = _verify.REMOVER_ADMIN;
    this.BANNER_ADMIN = _verify.BANNER_ADMIN;
    this.APPROVER = _verify.APPROVER;
    this.REMOVER = _verify.REMOVER;
    this.BANNER = _verify.BANNER;
  }

  /**
   * Deploys a new Verify.
   *
   * @param signer - An ethers.js Signer
   * @param args - Arguments for deploying a Verify @see VerifyDeployArgs
   * @param overrides - Specific transaction values to send it (e.g gasLimit, nonce or gasPrice)
   * @returns A new Verify instance
   *
   */
  public static deploy = async (
    signer: Signer,
    args: VerifyDeployArgs,
    overrides: TxOverrides = {}
  ): Promise<Verify> => {
    const verifyFactory = VerifyFactory__factory.connect(
      this.getBookAddress(await this.getChainId(signer)),
      signer
    );

    let { admin, callback } = args;
    if (!callback) {
      callback = constants.AddressZero;
    }

    const tx = await verifyFactory.createChildTyped(
      { admin, callback },
      overrides
    );
    const receipt = await tx.wait();
    const address = this.getNewChildFromReceipt(receipt, verifyFactory);
    return new Verify(address, signer);
  };

  /**
   * @public
   * Conncect to this Verify contract with another signer
   * 
   * @param signer - the signer to get connected to the Verify instance
   * @returns the Verify instance with the new signer
   */
  public readonly connect = (signer: Signer): Verify => {
    return new Verify(this.address, signer);
  };

  /**
   * Checks if address is registered as a child contract of this VerifyFactory on a specific network
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
   * By default, the admin role for all roles is `DEFAULT_ADMIN_ROLE`, which means
   * that only accounts with this role will be able to grant or revoke other
   * roles.
   *
   * WARNING: The `DEFAULT_ADMIN_ROLE` is also its own admin: it has permission to
   * grant and revoke this role. Extra precautions should be taken to secure
   * accounts that have been granted it.
   *
   * @param overrides - @see ReadTxOverrides
   * @returns Default admin role as an hexadecimal value
   */
  public readonly DEFAULT_ADMIN_ROLE: (
    overrides?: ReadTxOverrides
  ) => Promise<string>;

  /**
   * Admin role for `APPROVER`
   *
   * @param overrides - @see ReadTxOverrides
   * @returns Approver admin role as an hexadecimal value
   */
  public readonly APPROVER_ADMIN: (
    overrides?: ReadTxOverrides
  ) => Promise<string>;

  /**
   * Admin role for `REMOVER`
   *
   * @param overrides - @see ReadTxOverrides
   * @returns Remover admin role as an hexadecimal value
   */
  public readonly REMOVER_ADMIN: (
    overrides?: ReadTxOverrides
  ) => Promise<string>;

  /**
   * Admin role for `BANNER`
   *
   * @param overrides - @see ReadTxOverrides
   * @returns Banner admin role as an hexadecimal value
   */
  public readonly BANNER_ADMIN: (
    overrides?: ReadTxOverrides
  ) => Promise<string>;

  /**
   * Role for `APPROVER`
   *
   * @param overrides - @see ReadTxOverrides
   * @returns Approve role as an hexadecimal value
   */
  public readonly APPROVER: (overrides?: ReadTxOverrides) => Promise<string>;

  /**
   * Role for `REMOVER`
   *
   * @param overrides - @see ReadTxOverrides
   * @returns Remover role as an hexadecimal value
   */
  public readonly REMOVER: (overrides?: ReadTxOverrides) => Promise<string>;

  /**
   * Role for `BANNER`
   *
   * @param overrides - @see ReadTxOverrides
   * @returns Banner role as an hexadecimal value
   */
  public readonly BANNER: (overrides?: ReadTxOverrides) => Promise<string>;

  /**
   * @param overrides - @see ReadTxOverrides
   * @returns VerifyCallback contract address. MAY be address 0.
   */
  public readonly callback: (overrides?: ReadTxOverrides) => Promise<string>;

  /**
   * An account adds their own verification evidence. Internally `msg.sender` is used; delegated
   * `add` is not supported.
   *
   * @param data - The evidence to support approving the `msg.sender`.
   * @param overrides - @see TxOverrides
   */
  public readonly add: (
    data: BytesLike,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * An `APPROVER` can review added evidence and approve accounts.
   *
   * @remarks
   * Typically many approvals would  be submitted in a single call which is more convenient and gas
   * efficient than sending individual transactions for every approval. However, as there are many
   * individual agents acting concurrently and independently this requires that the approval process
   * be infallible so that no individual approval can rollback the entire batch due to the actions
   * of some other approver/banner. It is possible to approve an already approved or banned account.
   * The `Approve` event will always emit but the approved block will only be set if it was previously
   * uninitialized. A banned account will always be seen as banned when calling `statusAtBlock`
   * regardless of the approval block, even if the approval is more recent than the ban. The only way
   * to reset a ban is to remove and reapprove the account.
   *
   * @param evidences - All evidence for all approvals. @see Evidence
   * @param overrides - @see TxOverrides
   */
  public readonly approve: (
    evidences: Evidence[],
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * A `BANNER` can ban an added OR approved account.
   *
   * @param evidences - All evidence appropriate for all bans.. @see Evidence
   * @param overrides - @see TxOverrides
   */
  public readonly ban: (
    evidences: Evidence[],
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * A `REMOVER` can scrub state mapping from an account. A malicious account MUST be banned rather
   * than removed. Removal is useful to reset the whole process in case of some mistake.
   *
   * @param evidences - All evidence to suppor the removal. @see Evidence
   * @param overrides - @see TxOverrides
   */
  public readonly remove: (
    evidences: Evidence[],
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Any approved address can request some other address be approved. Frivolous requestors SHOULD
   * expect to find themselves banned.
   *
   * @param evidences - Array of evidences to request approvals for. @see Evidence
   * @param overrides - @see TxOverrides
   */
  public readonly requestApprove: (
    evidences: Evidence[],
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Any approved address can request some other address be banned. Frivolous requestors SHOULD expect
   * to find themselves banned.
   *
   * @param evidences - Array of evidences to request banning for. @see Evidence
   * @param overrides - @see TxOverrides
   */
  public readonly requestBan: (
    evidences: Evidence[],
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Any approved address can request some other address be removed. Frivolous requestors SHOULD expect
   * to find themselves banned.
   *
   * @param evidences - Array of evidences to request removal of. @see Evidence
   * @param overrides - @see TxOverrides
   */
  public readonly requestRemove: (
    evidences: Evidence[],
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Typed accessor into states.
   *
   * @param account - The account to return the current `State` for.
   * @param overrides - @see ReadTxOverrides
   * @returns - the state from the account. @see State
   */
  public readonly state: (
    account: string,
    overrides?: ReadTxOverrides
  ) => Promise<VerifyState>;

  /**
   * Derives a single `Status` from a `State` and a reference timestamp.
   * @param state_ - The raw `State` to reduce into a `Status`.
   * @param timestamp_ - The timestamp to compare `State` against.
   * @returns status_ The status in `State` given `timestamp_`.
   */
  public readonly statusAtTime: (
    state_: VerifyState,
    timestamp_: BigNumberish,
    overrides?: ReadTxOverrides
  ) => Promise<BigNumber>;
  /**
   * Check if an `account` have a determined `role` in the Verify Contract.
   *
   * @param role - The role that will check if `account` have.
   * @param account - The account that will checked.
   * @param overrides - @see ReadTxOverrides
   * @returns A boolean with `true` if `account` has been granted `role`.
   */
  public readonly hasRole: (
    role: BytesLike,
    account: string,
    overrides?: ReadTxOverrides
  ) => Promise<boolean>;

  /**
   * Get the admin role that controls `role`
   *
   * @param role - Role for which the RoleAdmin is obtained
   * @param overrides - @see ReadTxOverrides
   * @returns The admin role
   */
  public readonly getRoleAdmin: (
    role: BytesLike,
    overrides?: ReadTxOverrides
  ) => Promise<string>;

  /**
   * Grants `role` to `account`.
   *
   * If `account` had not been already granted `role`, emits a RoleGranted event.
   *
   * Require that caller have admin role of `role`.
   *
   * @param role - Role that will be granted
   * @param account - Account that will get the role
   * @param overrides - @see TxOverrides
   */
  public readonly grantRole: (
    role: BytesLike,
    account: string,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Revokes `role` from `account`.
   *
   * If `account` had been granted `role`, emits a RoleRevoked event.
   *
   * Require that caller have admin role of `role`.
   *
   * @param role - Role that will be revoked
   * @param account - Account that will lost the role
   * @param overrides - @see TxOverrides
   */
  public readonly revokeRole: (
    role: BytesLike,
    account: string,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Revokes `role` from the calling account.
   *
   * Roles are often managed via grantRole and revokeRole: this function's purpose is to provide
   * a mechanism for accounts to lose their privileges if they are compromised (such as when a
   * trusted device is misplaced).
   *
   * If the calling account had been granted `role`, emits a RoleRevoked
   * event.
   *
   * Requires the caller to be the `account`.
   *
   * @param role - Role that will be revoked
   * @param account - Account that will lost the role
   * @param overrides - @see TxOverrides
   */
  public readonly renounceRole: (
    role: BytesLike,
    account: string,
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;

  /**
   * Returns true if this contract implements the interface defined by
   * `interfaceId`. See the corresponding
   * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
   * to learn more about how these ids are created.
   *
   * @param interfaceId - The interfaceId that will be checked if it is supported
   * @param overrides - @see TxOverrides
   */
  public readonly supportsInterface: (
    interfaceId: BytesLike,
    overrides?: ReadTxOverrides
  ) => Promise<boolean>;
}

/**
 * @public
 * Config to initialize a Verify contract with.
 */
export interface VerifyDeployArgs {
  /**
   * The address to ASSIGN ALL ADMIN ROLES to initially. This address is
   * free and encouraged to delegate fine grained permissions to many other
   * sub-admin addresses, then revoke it's own "root" access.
   */
  admin: string;
  /**
   * The address of the `IVerifyCallback` contract if it exists. MAY be
   * `address(0)` to signify that callbacks should NOT run.
   */
  callback?: string;
}

/**
 * @public
 * Structure of arbitrary evidence to support any action taken. Priviledged roles are expected to
 * provide evidence just as applicants as an audit trail will be preserved permanently in the logs.
 */
export interface Evidence {
  /**
   * The account this evidence is relevant to.
   */
  account: string;
  /**
   * Arbitrary bytes representing evidence. MAY be e.g. a reference to a sufficiently decentralised
   * external system such as an IPFS hash.
   */
  data: BytesLike;
}

/**
 * @public
 * Records the block a verify session reaches each status. If a status is not reached it is left as
 * UNINITIALIZED, i.e. 0xFFFFFFFF. Most accounts will never be banned so most accounts will never
 * reach every status, which is a good thing.
 */
export interface VerifyState {
  /**
   * Block the address was added else 0xFFFFFFFF.
   */
  addedSince: BigNumberish;
  /**
   * Block the address was approved else 0xFFFFFFFF.
   */
  approvedSince: BigNumberish;
  /**
   * Block the address was banned else 0xFFFFFFFF.
   */
  bannedSince: BigNumberish;
}
