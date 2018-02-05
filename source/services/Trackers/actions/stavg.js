// Standard Average 
export default function( TimeSeries, Params = {} )
{
	let window = Params.window || 1;
	for (var i = 0; i < TimeSeries.length - window; ++i)
	{
		let total = 0;
		for(var w = 0; w < window; ++w)
		{
			total += TimeSeries[i + w].value;
		}
		TimeSeries[i].value = total / window;
	}
	return TimeSeries;
}
