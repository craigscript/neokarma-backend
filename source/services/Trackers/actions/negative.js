// Calculates absolute values if any value is below 0
export default function( TimeSeries = [], Params = {} )
{
	let values = TimeSeries.map((item)=> {
		return item.value;
	});
	let max = Math.max.apply(Math, values);


	for(var i = 0; i < TimeSeries.length; ++i)
	{
		TimeSeries[i].value = TimeSeries[i].value - max;
	}	
	

	return TimeSeries;
}
