// Performs a low pass filter on the Time Series array
export default function( TimeSeries, Params = {} )
{
	let smoothing = Params.smoothing || 1.0;

	var value = TimeSeries[0].value; // start with the first input
	for (var i=1; i < TimeSeries.length; ++i)
	{
		var currentValue = TimeSeries[i].value;
		value += (currentValue - value) * smoothing;
		TimeSeries[i].value = value;
	}
	return TimeSeries;
}
