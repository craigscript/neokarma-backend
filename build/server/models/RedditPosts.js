'use strict';

exports.__esModule = true;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = _mongoose2.default.Schema({
	id: {
		type: String,
		unique: true
	},

	subreddit: {
		type: String,
		lowercase: true,
		index: true
	},

	sentiment: Object,
	user: {
		type: String,
		lowercase: true
	},
	title: {
		type: String
	},
	content: {
		type: String
	},
	url: {
		type: String
	},
	date: {
		type: Number,
		index: true
	},
	ups: {
		type: Number
	},
	downs: {
		type: Number
	},
	score: {
		type: Number
	},
	score_change: {
		type: Number
	},
	num_comments: {
		type: Number
	}

}, {
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

schema.connection = "reddit";
exports.default = schema;