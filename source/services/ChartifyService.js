// Polyfill data with the missing ranges for charts
@Service
class ChartifyService
{
	static Chartify(start, end, stepSize, data, datemul=1)
	{
		var output = [];
		var i = 0;
		for(var date = start;date <= end; date += stepSize)
		{
			var timestamp = ((date / stepSize) - ((date  / stepSize) % 1)) * stepSize;
			if(!data[i] || data[i].timestamp != timestamp)
			{
				output.push({
					date: new Date(timestamp * datemul),
					timestamp: timestamp * datemul,
					value: 0,
				});
				continue;
			}
			output.push(data[i]);
			++i;
		}
		return output;
	}

	static GetNumPoints(Start, End, StepSize)
	{
		return Math.abs((End - Start) / StepSize);
	}
};
