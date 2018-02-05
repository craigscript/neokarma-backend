"use strict";

exports.__esModule = true;

exports.default = function (TimeSeries) {
	var Params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	TimeSeries[0].value = 0;
	var TimeSeriesResult = [TimeSeries[0]];
	for (var i = TimeSeries.length - 1; i > 1; --i) {
		TimeSeries[i].value = TimeSeries[i].value - TimeSeries[i - 1].value;
	}

	return TimeSeries;
};