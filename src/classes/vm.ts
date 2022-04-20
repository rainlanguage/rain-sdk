import { BytesLike, BigNumberish } from 'ethers';

/**
 * @public
 */
export interface State {
  sources: BytesLike[];
  constants: BigNumberish[];
  stackLength: BigNumberish;
  argumentsLength: BigNumberish;
}

/**
 * @public
 */
export class VM {}
