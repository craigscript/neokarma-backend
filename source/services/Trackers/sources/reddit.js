import * as Filters  from "glob:./reddit/*.js";
export default class RedditSource
{
	target = "";
	options = {};
	queryStream = [];
	filterQueries = [];

	Extractors =  {
		posts: "extractPosts",
		comments: "extractComments",
		submissions: "extractSubmissions",
		users: "extractUsers",
		upvotes: "extractUpvotes",
		downvotes: "extractDownvotes",
		votes: "extractVotes",
		score: "extractScore",
		sentiment: "extractSentiment",
	};

	constructor(target, options)
	{
		this.target = target;
		this.options = options;

		console.log("Reddit Extractor ready:", target, options);
		
		// Apply sub reddit filter
		this.applyFilter([{
			$match: {
				subreddit: target.toLowerCase(),
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

	queryRange(Interval, StartTime, EndTime)
	{
		console.log("Aggregating reddit data:", this.options);
		

		return this[this.Extractors[this.options.extract]](Interval, StartTime, EndTime).then(( results ) => {
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

		for(var filter of this.filterQueries)
		{
			queries.push(filter);	
		}

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

	extractPosts(Interval, StartTime, EndTime)
	{
		let queries = this.buildQuery(Interval, StartTime, EndTime, { $sum: 1 });
		console.log("Post extractor", queries);
		return RedditPosts.aggregate(queries);
	}
	
	extractComments(Interval, StartTime, EndTime)
	{
		//let queries = this.buildQuery(Interval, StartTime, EndTime, { $sum: "$num_comments" });
		let queries = this.buildQuery(Interval, StartTime, EndTime, { $sum: 1 });
		console.log("Comment extractor", queries);
		return RedditComments.aggregate(queries);
	}


	extractSubmissions(Interval, StartTime, EndTime)
	{
		//let queries = this.buildQuery(Interval, StartTime, EndTime, { $sum: "$num_comments" });
		let queries = this.buildQuery(Interval, StartTime, EndTime, { $sum: 1 });
		console.log("Submission extractor?");
		return RedditPosts.aggregate(queries).then( async (posts) => {
			let comments = await RedditComments.aggregate(queries);
			for(let i=0;i<posts.length;++i)
			{
				if(comments[i])
				{
					posts[i].value += comments[i].value;
				}						
			}
			return posts;
		});
	}

	exctractUsers(Interval, StartTime, EndTime)
	{
		let queries = this.buildQuery(Interval, StartTime, EndTime, { $sum: 1 }, { user: "$user" });
		console.log("User extractor", queries);
		return RedditPosts.aggregate(queries);
	}

	extractUpvotes(Interval, StartTime, EndTime)
	{
		let queries = this.buildQuery(Interval, StartTime, EndTime, { $sum: "$ups" });
		console.log("Upvote extractor", queries);
		return RedditPosts.aggregate(queries);
	}

	extractDownvotes(Interval, StartTime, EndTime)
	{
		let queries = this.buildQuery(Interval, StartTime, EndTime, { $sum: "$downs" });
		console.log("Upvote extractor", queries);
		return RedditPosts.aggregate(queries);
	}

	extractVotes(Interval, StartTime, EndTime)
	{
		let queries = this.buildQuery(Interval, StartTime, EndTime, { $sum: { $add: ["$ups", "$downs"] } });
		console.log("Votes extractor", queries);
		return RedditPosts.aggregate(queries);
	}

	extractScore(Interval, StartTime, EndTime)
	{
		let queries = this.buildQuery(Interval, StartTime, EndTime, { $sum: "$score" });
		console.log("Score extractor", queries);
		return RedditPosts.aggregate(queries);
	}

	extractSentiment(Interval, StartTime, EndTime)
	{
		let queries = this.buildQuery(Interval, StartTime, EndTime, { $sum: "$sentiment.score" });
		console.log("Sentiment extractor", queries);
		return RedditPosts.aggregate(queries);
	}
};