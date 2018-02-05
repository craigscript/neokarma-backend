"use strict";

exports.__esModule = true;

exports.default = function (TimeSeries) {
	var Params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	var smoothing = Params.smoothing || 1.0;

	var value = TimeSeries[0].value; // start with the first input
	for (var i = 1; i < TimeSeries.length; ++i) {
		var currentValue = TimeSeries[i].value;
		value += (currentValue - value) * smoothing;
		TimeSeries[i].value = value;
	}
	return TimeSeries;
};