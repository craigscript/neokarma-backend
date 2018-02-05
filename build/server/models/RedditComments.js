'use strict';

exports.__esModule = true;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = _mongoose2.default.Schema({
	id: {
		type: String,
		unique: true,
		index: true
	},

	post: {
		type: String
	},

	sentiment: Object,
	subreddit: String,
	ups: Number,
	downs: Number,
	score: Number,
	score_change: Number,
	title: String,
	user: String,

	content: String,

	url: String,

	date: Number,

	processed: Boolean
}, {
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});
schema.connection = "reddit";
exports.default = schema;