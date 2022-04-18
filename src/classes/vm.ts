import { BytesLike, BigNumberish } from 'ethers';

export interface State {
  sources: BytesLike[];
  constants: BigNumberish[];
  stackLength: BigNumberish;
  argumentsLength: BigNumberish;
}

class VM {}
