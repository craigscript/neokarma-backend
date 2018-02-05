"use strict";

exports.__esModule = true;

exports.default = function (TimeSeries) {
	var Params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	var threshold = Params.threshold || 0.5;

	TimeSeries = (0, _standardize2.default)(TimeSeries);

	for (var i = 0; i < TimeSeries.length; ++i) {
		if (Math.abs(TimeSeries[i].value) < threshold) {
			TimeSeries[i].value = 0;
		}
	}

	TimeSeries = (0, _standardize2.default)(TimeSeries);

	return TimeSeries;
};

var _standardize = require("./standardize");

var _standardize2 = _interopRequireDefault(_standardize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var timeseries = require("timeseries-analysis");

// Finds the outliers