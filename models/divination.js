const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const divinationSchema = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	query: { type: String, required: true },
	date: { type: Date, requred: true },
	data: {
		raw: {
			line1: {
				split1: {
					left: { type: Number, required: true },
					right: { type: Number, required: true }
				},
				split2: {
					left: { type: Number, required: true },
					right: { type: Number, required: true }
				},
				split3: {
					left: { type: Number, required: true },
					right: { type: Number, required: true }
				}
			},
			line2: {
				split1: {
					left: { type: Number, required: true },
					right: { type: Number, required: true }
				},
				split2: {
					left: { type: Number, required: true },
					right: { type: Number, required: true }
				},
				split3: {
					left: { type: Number, required: true },
					right: { type: Number, required: true }
				}
			},
			line3: {
				split1: {
					left: { type: Number, required: true },
					right: { type: Number, required: true }
				},
				split2: {
					left: { type: Number, required: true },
					right: { type: Number, required: true }
				},
				split3: {
					left: { type: Number, required: true },
					right: { type: Number, required: true }
				}
			},
			line4: {
				split1: {
					left: { type: Number, required: true },
					right: { type: Number, required: true }
				},
				split2: {
					left: { type: Number, required: true },
					right: { type: Number, required: true }
				},
				split3: {
					left: { type: Number, required: true },
					right: { type: Number, required: true }
				}
			},
			line5: {
				split1: {
					left: { type: Number, required: true },
					right: { type: Number, required: true }
				},
				split2: {
					left: { type: Number, required: true },
					right: { type: Number, required: true }
				},
				split3: {
					left: { type: Number, required: true },
					right: { type: Number, required: true }
				}
			},
			line6: {
				split1: {
					left: { type: Number, required: true },
					right: { type: Number, required: true }
				},
				split2: {
					left: { type: Number, required: true },
					right: { type: Number, required: true }
				},
				split3: {
					left: { type: Number, required: true },
					right: { type: Number, required: true }
				}
			}
		},
		hexagram: {
			// name: { type: String, required: true },
			// number: { type: Number, required: true },
			array: [Number],
			string: { type: String, required: true },
			object: {
				line1: { type: Number, required: true },
				line2: { type: Number, required: true },
				line3: { type: Number, required: true },
				line4: { type: Number, required: true },
				line5: { type: Number, required: true },
				line6: { type: Number, required: true }
			}
		}
	},
});

// divinationSchema.path('data.hexagram.array').validate(
// 	(array) => { array.length == 6 ? return true : return false; },
// 	'There must be six numbers in the hexagram array');

const Divination = mongoose.model('Divination', divinationSchema);

module.exports = Divination;
