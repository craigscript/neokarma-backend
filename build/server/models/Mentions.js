'use strict';

exports.__esModule = true;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = _mongoose2.default.Schema({

	// User who received this mention
	user: {
		type: _mongoose2.default.Schema.Types.ObjectId,
		ref: 'User'
	},

	tracker: {
		type: _mongoose2.default.Schema.Types.ObjectId,
		ref: 'MentionTrackings'
	},

	// Name of the tracking
	name: String,

	// The keyword this mention was about
	keywords: [String],

	// Page Title # Source Name
	title: String,

	// Sentiment analysis on mention
	sentiment: Object,

	// Context of the mention
	content: [String],

	// href url for the mention
	url: String,

	// Recording date
	date: Number,

	type: {
		type: String,
		required: true
	},
	categories: [String]
}, {
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});
schema.index({ date: -1 });
exports.default = schema;