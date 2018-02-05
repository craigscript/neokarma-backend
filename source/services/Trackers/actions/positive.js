// Calculates absolute values if any value is below 0
export default function( TimeSeries = [], Params = {} )
{
	let values = TimeSeries.map((item)=> {
		return item.value;
	});
	let min = Math.min.apply(Math, values);


	if(min < 0)
	{
		min = Math.abs(min);
		for(var i = 0; i < TimeSeries.length; ++i)
		{
			TimeSeries[i].value = TimeSeries[i].value + min;
		}	
	}

	return TimeSeries;
}
