"use strict";

exports.__esModule = true;

exports.default = function () {
	var TimeSeries = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	var Params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	var values = TimeSeries.map(function (item) {
		return item.value;
	});
	var max = Math.max.apply(Math, values);

	for (var i = 0; i < TimeSeries.length; ++i) {
		TimeSeries[i].value = TimeSeries[i].value - max;
	}

	return TimeSeries;
};