'use strict';

exports.__esModule = true;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = _mongoose2.default.Schema({

	name: {
		type: String,
		required: true
	},

	type: {
		type: String,
		required: true
	},

	target: {
		type: Object,
		required: true
	},

	options: {
		type: Object

	},

	// Sources of the tracker to compare
	trackingSite: {
		type: _mongoose2.default.Schema.Types.ObjectId,
		ref: 'TrackingSites'
	},

	// Source of the tracking to compare
	user: {
		type: _mongoose2.default.Schema.Types.ObjectId,
		ref: 'User'
	},

	filters: [{
		// Source to compare with
		name: {
			type: Object,
			required: true
		},
		// Target to compare with
		data: {
			type: Object
		}
	}],

	actions: [{
		// Source to compare with
		name: {
			type: Object,
			required: true
		},
		// Target to compare with
		data: {
			type: Object
		}
	}]
}, {
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

exports.default = schema;