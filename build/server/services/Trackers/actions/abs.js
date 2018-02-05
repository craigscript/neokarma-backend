"use strict";

exports.__esModule = true;

exports.default = function () {
	var TimeSeries = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	var Params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	for (var i = 0; i < TimeSeries.length; ++i) {
		TimeSeries[i].value = Math.abs(TimeSeries[i].value);
	}
	return TimeSeries;
};