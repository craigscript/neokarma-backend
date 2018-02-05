var timeseries = require("timeseries-analysis");

// NoiseRemoval
export default function( TimeSeries, Params = {} )
{
	let window = Params.window || 1;	

	var t = new timeseries.main(timeseries.adapter.fromDB(TimeSeries, {
		date:   'date',     // Name of the property containing the Date (must be compatible with new Date(date) )
		value:  'value'     // Name of the property containign the value. here we'll use the "close" price.
	}));

	let data = t.smoother({
		period: window
	}).output();
	for (var i = 0; i < TimeSeries.length; ++i)
	{
		TimeSeries[i].value = data[i][1];
	}
	return TimeSeries;
}
