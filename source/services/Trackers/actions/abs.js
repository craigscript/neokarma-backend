// Calculates absolute values if any value is below 0
export default function( TimeSeries = [], Params = {} )
{
	for(var i = 0; i < TimeSeries.length; ++i)
	{
		TimeSeries[i].value = Math.abs(TimeSeries[i].value);
	}	
	return TimeSeries;
}
