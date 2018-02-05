import * as Filters  from "glob:./twitter/*.js";
export default class RedditSource
{
	target = "";
	options = {};
	queryStream = [];

	Extractors =  {
		tweets: "extractTweets",
		retweets: "extractRetweets",
		sentiment: "extractSentiment",
	};

	constructor(target, options)
	{
		this.target = target;
		this.options = options;

		console.log("Twitter Extractor ready:", target, options);
		
		// Apply sub twitter filter
		this.applyFilter([{
			$match: {
				topics: { $in: [this.target] },
			},
		}]);
	}

	extractInRange(Interval, StartTime, EndTime)
	{
		if(!this.Extractors[this.options.extract])
		{
			return Promise.resolve([]);
		}

		console.log("Aggeragating in range Interval:", Interval, StartTime, EndTime);
		return this.queryRange(Interval, StartTime, EndTime).then( data => {
			return data;
		});
	}
	
	applyFilters(filters = [])
	{
		console.log("Filters:", filters);
		for(let filter of filters)
		{
			if(!Filters[filter.name])
				continue;
			let queries = Filters[filter.name](filter.data);
			this.applyFilter(queries);
		}
	}
	
	applyFilter(filters=[])
	{
		for(var filter of filters)
		{
			this.filterQueries.push(filter);	
		}
		
	}
	
	applyFilter(filters=[])
	{
		for(var filter of filters)
		{
			this.queryStream.push(filter);	
		}
		
	}

	queryRange(Interval, StartTime, EndTime)
	{
		console.log("Aggregating twitter data:", this.options);
		
		return this[this.Extractors[this.options.extract]](Interval, StartTime, EndTime).then(( results ) => {
			console.log("Twitter:", results);
			return ChartifyService.Chartify(StartTime * 1000, EndTime * 1000, Interval * 1000, results);
		}).catch(error => {
			console.log("Error:", error);
			return error;
		});
	}

	buildQuery(Interval, StartTime, EndTime, SumMethod, GroupMethod = {})
	{
		var queries = this.queryStream;
		
		queries.unshift({
			$match: {
				date: {
					$gte: StartTime,
					$lt: EndTime
				}
			}
		});

		// Group by StepSize (Zoom Level)
		queries.push({
			$group: {
				_id: Object.assign({
					timestamp: {
						$subtract: [
						{
							$divide: [ '$date', Interval ]
						},
						{
							$mod: [
							{
								$divide: ['$date', Interval ]
							}, 1]
						}]
					}
				}, GroupMethod),
				value: SumMethod
			}
		});

		// Sort by date
		queries.push({
			$sort: { "_id.timestamp": 1 }
		});

		// Format date & timestamp
		queries.push({
			$project: {
				_id: 0,
				timestamp: {
					$multiply: [Interval * 1000, "$_id.timestamp"]
				},
				value: "$value",
				date: {
					$add: [new Date(0), {
						$multiply: [Interval * 1000, "$_id.timestamp"],
					}],
				}
			}
		});
		return queries;
	}

	extractTweets(Interval, StartTime, EndTime)
	{
		let queries = this.buildQuery(Interval, StartTime, EndTime, { $sum: 1 });
		console.log("Tweet extractor", queries);
		return TwitterTweets.aggregate(queries);
	}

	extractRetweets(Interval, StartTime, EndTime)
	{
		let queries = this.buildQuery(Interval, StartTime, EndTime, { $sum: "$origin.count" });
		console.log("Retweet extractor", queries);
		return TwitterTweets.aggregate(queries);
	}

	extractSentiment(Interval, StartTime, EndTime)
	{
		let queries = this.buildQuery(Interval, StartTime, EndTime, { $sum: "$sentiment.score" });
		console.log("Sentiment extractor", queries);
		return TwitterTweets.aggregate(queries);
	}

};