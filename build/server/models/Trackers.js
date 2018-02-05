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

	user: {
		type: _mongoose2.default.Schema.Types.ObjectId,
		ref: 'User'
	},

	// Sources of the tracker to compare
	sources: [{
		type: _mongoose2.default.Schema.Types.ObjectId,
		ref: 'TrackerSources'
	}],

	exporters: [{
		// Source to compare with
		name: {
			type: Object,
			required: true
		},
		// Target to compare with
		params: {
			type: Object
		}
	}],

	global: {
		type: Boolean,
		default: false
	}
}, {
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

exports.default = schema;