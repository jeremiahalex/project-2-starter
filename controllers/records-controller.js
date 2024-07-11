const Divination = require('../models/divination');
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

exports.records = (req, res) => {
	res.render('records/records');
}

exports.result = (req, res) => {
	console.log('User: ')
	console.log(req.user);
	console.log('Divination data:')
	console.log(req.body);
	console.log('Query');
	console.log('req.body.query');
	let queryDate = new Date();
	let hexagramString = String(req.body['Line-1'] + req.body['Line-2'] + req.body['Line-3'] + req.body['Line-4'] + req.body['Line-5'] +req.body['Line-6']);
	Divination.create({
		user: req.user.id,
		query: req.body.query,
		date: queryDate,
		data: {
			raw: {
				line1: {
					split1: {
						left: req.body['L1-S1-L'],
						right: req.body['L1-S1-R']
					},
					split2: {
						left: req.body['L1-S2-L'],
						right: req.body['L1-S2-R']
					},
					split3: {
						left: req.body['L1-S3-L'],
						right: req.body['L1-S3-R']
					}
				},
				line2: {
					split1: {
						left: req.body['L2-S1-L'],
						right: req.body['L2-S1-R']
					},
					split2: {
						left: req.body['L2-S2-L'],
						right: req.body['L2-S2-R']
					},
					split3: {
						left: req.body['L2-S3-L'],
						right: req.body['L2-S3-R']
					}
				},
				line3: {
					split1: {
						left: req.body['L3-S1-L'],
						right: req.body['L3-S1-R']
					},
					split2: {
						left: req.body['L3-S2-L'],
						right: req.body['L3-S2-R']
					},
					split3: {
						left: req.body['L3-S3-L'],
						right: req.body['L3-S3-R']
					}
				},
				line4: {
					split1: {
						left: req.body['L4-S1-L'],
						right: req.body['L4-S1-R']
					},
					split2: {
						left: req.body['L4-S2-L'],
						right: req.body['L4-S2-R']
					},
					split3: {
						left: req.body['L4-S3-L'],
						right: req.body['L4-S3-R']
					}
				},
				line5: {
					split1: {
						left: req.body['L5-S1-L'],
						right: req.body['L5-S1-R']
					},
					split2: {
						left: req.body['L5-S2-L'],
						right: req.body['L5-S2-R']
					},
					split3: {
						left: req.body['L5-S3-L'],
						right: req.body['L5-S3-R']
					}
				},
				line6: {
					split1: {
						left: req.body['L6-S1-L'],
						right: req.body['L6-S1-R']
					},
					split2: {
						left: req.body['L6-S2-L'],
						right: req.body['L6-S2-R']
					},
					split3: {
						left: req.body['L6-S3-L'],
						right: req.body['L6-S3-R']
					}
				},
			},
			hexagram: {
				array: [
					Number(req.body['Line-1']),
					Number(req.body['Line-2']),
					Number(req.body['Line-3']),
					Number(req.body['Line-4']),
					Number(req.body['Line-5']),
					Number(req.body['Line-6'])
				],
				string: hexagramString,
				object: {
					line1: req.body['Line-1'],
					line2: req.body['Line-2'],
					line3: req.body['Line-3'],
					line4: req.body['Line-4'],
					line5: req.body['Line-5'],
					line6: req.body['Line-6']
				}
			}
		}
	}, (err, addedDivination) => {
		if (err) {
			console.log('Error inserting divination record to collection…');
			console.log(err);
			req.flash('error', 'Unable to save divination');
			res.render('oracle/consult');
		} else {
			console.log(addedDivination);
		}
	});

	// START: Retreive ingredients to make API calls and pass it to the page rendered
	let query = hexagramString;
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

	console.log(result);
	// END: Retreive ingredients to make API calls and pass it to the page rendered

	res.render('result/result', { output: { json: result, string: hexagramString, query: req.body.query, date: queryDate } });
}
