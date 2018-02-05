var timeseries = require("timeseries-analysis");
import standardize from "./standardize";

// Finds the outliers
export default function( TimeSeries, Params = {} )
{
	let threshold = Params.threshold || 0.5;

	TimeSeries = standardize(TimeSeries);

	for(var i = 0; i < TimeSeries.length; ++i)
	{
		if(Math.abs(TimeSeries[i].value) < threshold)
		{
			TimeSeries[i].value = 0;
		}
	}

	TimeSeries = standardize(TimeSeries);

	return TimeSeries;
}
