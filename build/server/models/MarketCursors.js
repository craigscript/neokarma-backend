'use strict';

exports.__esModule = true;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = _mongoose2.default.Schema({

	// List of sources this market is getting information from
	source: {
		type: String,
		required: true
	},

	market: {
		type: String,
		required: true
	},

	// Current tracking position of the market
	cursor: {
		type: Date
	}

}, {
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});

schema.statics.updateCursor = function (source, market) {
	var cursor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Date();

	MarketCursors.update({
		source: source,
		market: market
	}, {
		cursor: cursor
	}, { upsert: true }).exec();
};

schema.statics.clearCursor = function (source, market) {
	MarketCursors.update({
		source: source,
		market: market
	}, {
		cursor: new Date(0)
	}, { upsert: true }).exec();
};

schema.statics.getCursor = function (source, market) {
	return MarketCursors.findOne({
		source: source,
		market: market
	});
};

schema.statics.getCursors = function (source) {
	return MarketCursors.find({
		source: source
	});
};

schema.statics.getOutDated = function (source) {
	var interval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;

	return MarketCursors.find({
		source: source,
		cursor: {
			$lt: new Date(Date.now() - interval * 60 * 1000)
		}
	});
};

schema.connection = "markets";

exports.default = schema;