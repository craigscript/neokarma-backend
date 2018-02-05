"use strict";

exports.__esModule = true;

exports.default = function (TimeSeries) {
	var Params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	var values = TimeSeries.map(function (item) {
		return item.value;
	});
	var ratio = Math.max.apply(Math, values) / 1;
	for (var i = 0; i < TimeSeries.length; ++i) {
		TimeSeries[i].value = TimeSeries[i].value / ratio;
	}

	return TimeSeries;
};