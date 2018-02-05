"use strict";

exports.__esModule = true;

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = _mongoose2.default.Schema({

	// Name of the list
	name: {
		type: String,
		required: true
	},

	// User Id
	user: {
		type: _mongoose2.default.Schema.Types.ObjectId,
		ref: 'User'
	},

	// List of the cards stored in order
	cards: [{

		// Type of the card
		cardType: {
			type: String,
			enum: ["currency", "market", 'wallet', 'winners', 'losers', 'rankings']
		},

		expanded: Boolean,

		// Custom input for the card
		data: Object
	}],

	// User holdings for each market in this list
	holdings: [{
		currency: String,
		amount: Number
	}],

	// Cached stats of the holdings for the wallet card calculation (How much this list worth etc..)
	wallet: {
		type: Object
	},

	// Make the list publicly available for other users?
	isPublic: {
		type: Boolean,
		default: true
	}
}, {
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});

exports.default = schema;