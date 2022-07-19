import { BigNumber } from "ethers";
import { paddedUInt256, paddedUInt32 } from "../../utils";


/**
 * @public 
 */
export const saturatingDiff = (report1: BigNumber, report2: BigNumber) : BigNumber => {
	const report1_ = paddedUInt256(report1).substring(2);
	const report2_ = paddedUInt256(report2).substring(2);
	let _startIndex = 0;
	let _endIndex = 8;
	let _result = '';
	let _tierRep1;
	let _tierRep2;

	for (let i = 0; i < 8; i++) {
		_tierRep1 = BigNumber.from(
			'0x' + report1_.slice(_startIndex, _endIndex)
		);
		_tierRep2 = BigNumber.from(
			'0x' + report2_.slice(_startIndex, _endIndex)
		);
		_result += _tierRep1.gt(_tierRep2)
			? paddedUInt32(_tierRep1.sub(_tierRep2))
			: '00000000';
		_startIndex += 8;
		_endIndex += 8;
	}

	return BigNumber.from('0x' + _result);
}

/**
 * @public
 */
export const selectLte = (
	reports: BigNumber[],
	timestamp: BigNumber,
	logic: number,
	mode: number,
	length: number
) : BigNumber => {

	let _report;
	// array of raw reports
	let _reports: string[] = [];
	// array of array of each tier's lte report
	let _reportsAtTier: string[][] = [[], [], [], [], [], [], [], []];
	let _result = '';

	//building an array of each tier's report against blockNumber_
	//tiers greater than blockNumber_ will get "ffffffff"
	  const blockNumber_ = paddedUInt32(timestamp);
	  for (let i = 0; i < length; i++) {
		let _startIndex = 0;
		let _endIndex = 8;
		_report = reports[reports.length - 1 - i];
		  _reports[i] = paddedUInt256(_report).substring(2);
		  for (let j = 0; j < 8; j++) {
			_reportsAtTier[j].push(
			  blockNumber_ < _reports[i].slice(_startIndex, _endIndex)
				? 'ffffffff'
				: _reports[i].slice(_startIndex, _endIndex)
			);
			_startIndex += 8;
			_endIndex += 8;
		  }
		} 

	// logic and mode selections
	if (logic) {
	  for (let i = 0; i < 8; i++) {
		if (mode === 0) {
		  _reportsAtTier[i] = [
			_reportsAtTier[i].reduce((e, m) => (e < m ? e : m)),
		  ];
		} 
		else if (mode === 1) {
		  //filter out "ffffffff"
		  _reportsAtTier[i] = _reportsAtTier[i].filter(
			(e) => e !== 'ffffffff'
		  );
		  _reportsAtTier[i] =
			_reportsAtTier[i].length > 0
			  ? [_reportsAtTier[i].reduce((e, m) => (e > m ? e : m))]
			  : ['ffffffff'];
		} 
		else if (mode === 2) {
		  //filter out "ffffffff"
		  _reportsAtTier[i] = _reportsAtTier[i].filter(
			(e) => e !== 'ffffffff'
		  );
		  _reportsAtTier[i] =
			_reportsAtTier[i].length > 0
			  ? [_reportsAtTier[i][_reportsAtTier[i].length - 1]]
			  : ['ffffffff'];
		}
	  }
	} 
	else {
	  for (let i = 0; i < 8; i++) {
		if (mode === 0) {
		  //check if "ffffffff" exists within the tier's array
		  _reportsAtTier[i] = _reportsAtTier[i].includes('ffffffff')
			? ['ffffffff']
			: [_reportsAtTier[i].reduce((e, m) => (e < m ? e : m))];
		} 
		else if (mode === 1) {
		  //check if "ffffffff" exists within the tier's array
		  _reportsAtTier[i] = _reportsAtTier[i].includes('ffffffff')
			? ['ffffffff']
			: [_reportsAtTier[i].reduce((e, m) => (e > m ? e : m))];
		} 
		else if (mode === 2) {
		  //check if "ffffffff" exists within the tier's array
		  _reportsAtTier[i] = _reportsAtTier[i].includes('ffffffff')
			? ['ffffffff']
			: [_reportsAtTier[i][_reportsAtTier[i].length - 1]];
		}
	  }
	}
	//building the final report
	for (let i = 0; i < 8; i++) {
	  _result += _reportsAtTier[i][0];
	}
	return BigNumber.from('0x' + _result);
}