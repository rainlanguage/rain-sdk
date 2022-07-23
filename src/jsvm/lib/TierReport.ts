import { BigNumber } from "ethers";
import { paddedUInt256, paddedUInt32 } from "../../utils";


/**
 * @public 
 */
export const updateTimesForTierRange = (report: BigNumber, timestamp: BigNumber, range: number) : BigNumber => {

  const endTier_ = range >> 4;
  const startTier_ = range & 15;
  const _timestamp = paddedUInt32(timestamp);
  const _report = paddedUInt256(report).substring(2);
  let _startIndex = (8 - endTier_) * 8;
  let _endIndex = _startIndex + 8;
  let _result = _report.slice(0, _startIndex);
  const resultLow_ = _report.slice(
    _startIndex + (endTier_ - startTier_) * 8
  );

  for (let i = 0; i < endTier_ - startTier_; i++) {
    _result +=
      _report.slice(_startIndex, _endIndex) > _timestamp
        ? _timestamp
        : _report.slice(_startIndex, _endIndex);
    _startIndex += 8;
    _endIndex += 8;
  }

  return BigNumber.from('0x' + _result + resultLow_);
}