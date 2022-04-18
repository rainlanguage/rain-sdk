import { Signer, BytesLike, ContractTransaction } from 'ethers';
import { RainContract, TxOverrides } from '../classes/rainContract';
import { NoticeBoard__factory } from '../typechain';

/**
 * A class for Calling methods on a NoticeBoard.
 *
 * that the controller and the subject of an identity are two different entities.
 *
 * @remarks
 *
 * @example
 * ```typescript
 * import { NoticeBoard } from 'rain-sdk'
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
   * @param notices All the notices to emit.
   * @param overrides @see TxOverrides
   */
  public readonly createNotices: (
    notices: NoticeStruct[],
    overrides?: TxOverrides
  ) => Promise<ContractTransaction>;
}

export interface NoticeStruct {
  subject: string;
  data: BytesLike;
}
