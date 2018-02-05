import SourceExtractor from "./SourceExtractor.js";

export default class TrackerExtractor
{
	tracker = null;

	constructor(Tracker)
	{
		this.tracker = Tracker;
	}

	getDataInRange(Interval, StartTime, EndTime)
	{
		// Extract sources with filters applied
		var sources = [];
		let resolvers = [];
		for(var trackerSource of this.tracker.sources)
		{
			let extractor = new SourceExtractor(trackerSource);
			var resolver = extractor.extractInRange(Interval, StartTime, EndTime).then( timeSeries => {
				sources.push(timeSeries);
			});
			resolvers.push(resolver);
		}

		// Process actions when all sources are resolved
		return Promise.all(resolvers).then( () => {
			// return this.performActions(sources).then( result => {
			// 	console.log("Performed actions:");
			// });
			var output = [];
			for(var i=0;i<sources.length;++i)
			{
				for(var s=0;s<sources[i].length;++s)
				{
					if(!output[s])
					{
						output[s] = sources[i][s];
						continue;
					}
					output[s].value += sources[i][s].value;
				}
			}
			return output;
		});
	}

	performActions(sources)
	{
		for(var action of tracker.actions)
		{
			
		}
		return [];
	}

};