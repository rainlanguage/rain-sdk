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
  protected static readonly nameBookReference: string = 'noticeBoard';

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
   * Create the NoticeBoard instance.
   *
   * The function ask to the provider inside of the ethers signer what is the chain
   * identifier to get the address in this chain.
   *
   * @param signer - ethers signer connected to the instance
   * @returns A NoticeBoard instance
   */
  public static get = async (signer: Signer): Promise<NoticeBoard> => {
    return new NoticeBoard(
      this.getBookAddress(await this.getChainId(signer)),
      signer
    );
  };

  /**
   * @public
   * Conncect to this Noticeboard contract with another signer
   * 
   * @param signer - the signer to get connected to the noticeboard instance
   * @returns the Noticeboard instance with the new signer
   */
  public readonly connect = (signer: Signer): NoticeBoard => {
    return new NoticeBoard(this.address, signer);
  };

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
