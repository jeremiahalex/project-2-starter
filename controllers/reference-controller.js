const directory = require('../data/directory');
const api = require('../data/yijing-yilin');
const parallel = require('../data/parallel-text');
const reference = {
	url: {
		api: 'https://api.ctext.org/gettext?urn=ctp:',
		parallel: 'http://ctext.org/dictionary.pl?if=en&id='
	},
	urn: {
		yijing: 'book-of-changes',
		yilin: 'jiaoshi-yilin'
	},
	invalidRequest: {
		'Error': { 'Invalid request' : 'Check that your query has 6 digits ranging from 6 to 9 only.' }
	},
	isQueryValid: function(query) {
		return query.match(/[6-9]{6}/g);
	},
	convertQueryToArray: function(query) {
		let queryArray = query.split('');
		return queryArray;
	},
	mapOriginalHexagramToBinary: function(query, isQueryValid, queryArray) {
		if (isQueryValid == null) {
			return null;
		} else if (isQueryValid.length == 1) {
			let binaryArray = queryArray.map(function(line) {
				switch(line) {
					case '6':
					case '8':
						return 2;
					case '7':
					case '9':
						return 1;
				}
			});
			let binaryNumber = Number(binaryArray.join(''));

			return binaryNumber;
		}
	},
	mapResultantHexagramToBinary: function(query, isQueryValid, queryArray) {
		if (isQueryValid == null) {
			return null;
		} else if (isQueryValid.length == 1) {
			binaryArray = queryArray.map(function(line) {
				switch(line) {
					case '6':
						return 1;
					case '7':
						return 1;
					case '8':
						return 2;
					case '9':
						return 2;
				}
			});
			let binaryNumber = Number(binaryArray.join(''));

			return binaryNumber;
		}
	},
	checkNumberOfChangingLines: function(query) {
		return query.match(/[6|9]/g);
	},
	indexOfOneChangingLine: function(query) {
		let indexString;
		query.forEach(function(item, index) {
			if (item === '6' || item === '9') {
				indexString = String(index + 1);
			}
		});
		return indexString;
	},
	indexForYilin: function(originalHexagramNumber, resultantHexagramNumber) {
		let yilinIndex;
		if (resultantHexagramNumber == originalHexagramNumber) {
			yilinIndex = 0;
		} else if (resultantHexagramNumber > originalHexagramNumber) {
		  yilinIndex = resultantHexagramNumber - 1;
		  console.log('Position in Yilin array:');
		  console.log(yilinIndex);
  	} else {
		  yilinIndex = resultantHexagramNumber;
  	}

		return yilinIndex;
	}
}

exports.result = (req, res) => {
	let query = req.params.query;
	let queryValidity = reference.isQueryValid(query);
	let queryArray = reference.convertQueryToArray(query);
	let originalHexagramBinaryString = reference.mapOriginalHexagramToBinary(query, queryValidity, queryArray);
	let resultantHexagramBinaryString = reference.mapResultantHexagramToBinary(query, queryValidity, queryArray);
	let changingLinesArray = reference.checkNumberOfChangingLines(query);
	let originalHexagramNumber = directory[originalHexagramBinaryString].number;
	let resultantHexagramNumber = directory[resultantHexagramBinaryString].number;
	let yilinIndex = reference.indexForYilin(originalHexagramNumber, resultantHexagramNumber);

	console.log('query');
	console.log(query);
	console.log('queryValidity');
	console.log(queryValidity);
	console.log('queryArray');
	console.log(queryArray);
	console.log('originalHexagramBinaryString');
	console.log(originalHexagramBinaryString);
	console.log('resultantHexagramBinaryString');
	console.log(resultantHexagramBinaryString);
	console.log('changingLinesArray');
	console.log(changingLinesArray)

	let result;

	if (changingLinesArray == null) {
		result = {
			hexagram: {
				original: {
					number: originalHexagramNumber,
					name: directory[originalHexagramBinaryString].name
				},
				resultant: null
			},
			text: {
				yijing: {
					url: reference.url.api,
					urn: reference.urn.yijing,
					entry: {
						classic: api[originalHexagramBinaryString].yijing.classic,
						judgment: api[originalHexagramBinaryString].yijing.judgment,
						image: api[originalHexagramBinaryString].yijing.image
					},
					index: 0,
				},
				yilin: {
					url: reference.url.api,
					urn: reference.urn.yilin,
					entry: {
						chapter: api[originalHexagramBinaryString].yilin.chapter
					},
					index: yilinIndex
				}
			},
			parallel: {
				url: reference.url.parallel,
				entry: {
					classic: parallel[originalHexagramBinaryString]['guaci'],
					judgment: parallel[originalHexagramBinaryString]['tuan'],
					image: parallel[originalHexagramBinaryString]['daxiang']
				}
			}
		}
	} else if (changingLinesArray.length == 1) {
		let lineNumber = reference.indexOfOneChangingLine(queryArray);

		result = {
			hexagram: {
				original: {
					number: originalHexagramNumber,
					name: directory[originalHexagramBinaryString].name
				},
				resultant: {
					number: resultantHexagramNumber,
					name: directory[resultantHexagramBinaryString].name
				}
			},
			text: {
				yijing: {
					url: reference.url.api,
					urn: reference.urn.yijing,
					entry: {
						classic: api[originalHexagramBinaryString].yijing.classic,
						image: api[originalHexagramBinaryString].yijing.image
					},
					index: Number(lineNumber),
				},
				yilin: {
					url: reference.url.api,
					urn: reference.urn.yilin,
					entry: {
						chapter: api[originalHexagramBinaryString].yilin.chapter
					},
					index: yilinIndex
				}
			},
			parallel: {
				url: reference.url.parallel,
				entry: {
					classic: parallel[originalHexagramBinaryString]['yaoci-'+ lineNumber],
					image: parallel[originalHexagramBinaryString]['xiaoxiang-'+ lineNumber]
				}
			},
		}
	} else if (changingLinesArray.length > 1) {
		result = {
			hexagram: {
				original: {
					number: originalHexagramNumber,
					name: directory[originalHexagramBinaryString].name
				},
				resultant: {
					number: resultantHexagramNumber,
					name: directory[resultantHexagramBinaryString].name
				}
			},
			text: {
				yijing: null,
				yilin: {
					url: reference.url.api,
					urn: reference.urn.yilin,
					entry: {
						chapter: api[originalHexagramBinaryString].yilin.chapter
					},
					index: yilinIndex
				}
			},
			parallel: null
		}
	}

	res.json(result);
}

exports.original = (req, res) => {
	let query = req.params.query;
	let queryValidity = reference.isQueryValid(query);
	let queryArray = reference.convertQueryToArray(query);
	let originalHexagramBinaryString = reference.mapOriginalHexagramToBinary(query, queryValidity, queryArray);

	if (queryValidity == null ) {
		res.json(reference.invalidRequest);
	} else {
		for (let key in directory) {
			if (key == originalHexagramBinaryString) {
				res.json(directory[originalHexagramBinaryString]);
			}
		}
	}
}

exports.resultant = (req, res) => {
	let query = req.params.query;
	let queryValidity = reference.isQueryValid(query);
	let queryArray = reference.convertQueryToArray(query);
	let resultantHexagramBinaryString = reference.mapResultantHexagramToBinary(query, queryValidity, queryArray);

	if (queryValidity == null ) {
		res.json(reference.invalidRequest);
	} else {
		for (let key in directory) {
			if (key == resultantHexagramBinaryString) {
				res.json(directory[resultantHexagramBinaryString]);
			}
		}
	}
}
