// Calculates percentage increase between 2 points
export default function( TimeSeries, Params = {} )
{
	let values = TimeSeries.map((item)=> {
		return item.value;
	});
	let ratio = Math.max.apply(Math, values) / 1;
	for(var i = 0; i < TimeSeries.length; ++i)
	{
		TimeSeries[i].value = TimeSeries[i].value / ratio;
	}
	
	return TimeSeries;
}
