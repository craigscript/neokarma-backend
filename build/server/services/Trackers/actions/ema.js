'use strict';

exports.__esModule = true;

exports.default = function (TimeSeries) {
	var Params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	var window = Params.window || 12;

	var t = new timeseries.main(timeseries.adapter.fromDB(TimeSeries, {
		date: 'date', // Name of the property containing the Date (must be compatible with new Date(date) )
		value: 'value' // Name of the property containign the value. here we'll use the "close" price.
	}));

	var data = t.ema({
		window: window
	}).output();

	for (var i = 0; i < TimeSeries.length; ++i) {
		TimeSeries[i].value = data[i][1];
	}
	return TimeSeries;
};

var timeseries = require("timeseries-analysis");

// Find the supports and resistances.