'use strict';

exports.__esModule = true;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = _mongoose2.default.Schema({

	// Users requiring the mention tracking
	user: {
		type: _mongoose2.default.Schema.Types.ObjectId,
		ref: 'User'
	},

	// Tracking name
	name: {
		type: String,
		required: true
	},

	// Tracking information
	tracking: {
		required: [{
			type: String
		}],
		optional: [{
			type: String
		}],
		ignored: [{
			type: String
		}]
	},

	// Tracking Method
	sources: [{
		type: _mongoose2.default.Schema.Types.ObjectId,
		ref: 'TrackingSites'
	}],

	status: {
		type: String,
		enum: ["Enabled", "Disabled"],
		default: "Enabled"
	},

	inQueue: {
		type: Boolean,
		default: true
	},

	inProgress: {
		type: Boolean,
		default: false
	},

	resetTracker: {
		type: Boolean,
		default: true
	},

	// UNIX timestamp to schedule updating of the mention trackings
	lastUpdated: {
		type: Number,
		default: 0
	},

	// Cursor used to keep up the tracking
	cursor: {
		type: Date,
		default: 0
	},

	keywords: []
}, {
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});
exports.default = schema;