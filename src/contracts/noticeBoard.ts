import { Signer, BytesLike, ContractTransaction } from 'ethers';
import { RainContract, TxOverrides } from '../classes/rainContract';
import { NoticeBoard__factory } from '../typechain';

/**
 * @public
 * A class for calling method on a NoticeBoard.
 *
 * @remarks
 * Anyone can emit a `Notice`.
 *
 * This is open ended content related to the subject.
 * Some examples:
 * - Raise descriptions/promises
 * - Reviews/comments from token holders
 * - Simple onchain voting/signalling
 *
 * GUIs/tooling/indexers reading this data are expected to know how to
 * interpret it in context because the `NoticeBoard` contract does not.
 *
 * @example
 * ```typescript
 * import { NoticeBoard } from 'rain-sdk'
 *
 * const notice = new NoticeBoard(address, signer);
 *
 * const noticeArg = {
 *   subject: signer.address; // Subject can be any address
 *   data: "0x00"; // Can be any data
 * }
 *
 * const tx = await notice.createNotices([noticeArg]);
 * ```
 *
 */

export class NoticeBoard extends RainContract {
  protected static readonly nameBookReference = 'noticeBoard';

  /**
   * Constructs a new NoticeBoard from a known address.
   *
   * @param address - The address of the NoticeBoard contract
   * @param signer - An ethers.js Signer
   * @returns A new NoticeBoard instance
   *
   */
  constructor(address: string, signer: Signer) {
    super(address, signer);
    const _noticeBoard = NoticeBoard__factory.connect(address, signer);
    this.createNotices = _noticeBoard.createNotices;
  }

  /**
   * Anyone can create notices about some subject.
   * The notice is opaque bytes. The indexer/GUI is expected to understand
   * the context to decode/interpret it. The indexer/GUI is strongly
   * recommended to filter out untrusted content.
   *
   * @param notices - All the notices to emit.
   * @param overrides - @see TxOverrides
   */
  public readonly createNotices: (
    notices: NoticeStruct[],
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;
}

/**
 * @public
 */
export interface NoticeStruct {
  subject: string;
  data: BytesLike;
}
