'use strict';

exports.__esModule = true;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = _mongoose2.default.Schema({

	topics: {
		type: [String],
		index: true
	},

	tweetId: {
		type: String,
		unique: true
	},

	user: {
		type: String,
		required: true
	},

	origin: {
		type: Object
	},

	sentiment: {
		type: Object,
		required: true
	},

	tweet: {
		type: String,
		required: true
	},

	url: {
		type: String,
		required: true
	},

	date: {
		type: Number,
		required: true
	}
}, {
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

schema.connection = "twitter";
exports.default = schema;