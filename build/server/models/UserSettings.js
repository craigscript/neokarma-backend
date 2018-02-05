'use strict';

exports.__esModule = true;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = _mongoose2.default.Schema({

	userId: {
		type: _mongoose2.default.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},

	key: {
		type: String,
		required: true,
		index: true
	},

	value: {
		type: Object,
		required: true
	}
}, {
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});

schema.index({ userId: 1, key: 1 }, { unique: true });

exports.default = schema;