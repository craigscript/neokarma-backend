'use strict';

exports.__esModule = true;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = _mongoose2.default.Schema({

	enabled: {
		type: Boolean,
		default: true
	},

	// Target URL, search String etc..
	topic: {
		type: String,
		lowercase: true,
		required: true
	}
}, {
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});
schema.connection = "twitter";
exports.default = schema;