"use strict";

exports.__esModule = true;

exports.default = function (TimeSeries) {
	var Params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	var window = Params.window || 1;
	for (var i = 0; i < TimeSeries.length - window; ++i) {
		var total = 0;
		for (var w = 0; w < window; ++w) {
			total += TimeSeries[i + w].value;
		}
		TimeSeries[i].value = total / window;
	}
	return TimeSeries;
};