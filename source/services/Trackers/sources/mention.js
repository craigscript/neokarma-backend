import * as Filters  from "glob:./mention/*.js";
export default class MentionSource
{
	target = "";
	options = {};
	queryStream = [];


	constructor(target, options)
	{
		this.target = target;
		this.options = options;
		// Apply sub reddit filter
		// this.applyFilter([{
		// 	$match: {
		// 		subreddit: target,
		// 	},
		// }]);
	}

	extractInRange(Interval, StartTime, EndTime)
	{
		console.log("Aggeragating in range Interval:", Interval, StartTime, EndTime);
		return this.queryRange(Interval, StartTime, EndTime, this.options.user).then( data => {
			return data;
		});
	}
	
	applyFilters(filters = [])
	{

	}
	
	applyFilter(filters=[])
	{
		for(var filter of filters)
		{
			this.queryStream.push(filter);	
		}
		
	}

	queryRange(Interval, StartTime, EndTime, UserId)
	{
		console.log("Aggregating mention data");
		var queries = this.queryStream;
		queries.unshift({
			$match: {
				user: UserId,
				tracker: this.target,
				date: {
					$gte: StartTime * 1000,
					$lt: EndTime * 1000
				}
			}
		});

		// Group by StepSize (Zoom Level)
		queries.push({
			$group: {
				_id: {
					timestamp: {
						$subtract: [
						{
							$divide: [ '$date', Interval * 1000 ]
						},
						{
							$mod: [
							{
								$divide: ['$date', Interval * 1000 ]
							}, 1]
						}]
					},
				},
				value: {
					$sum: 1
				}
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

		return Mentions.aggregate(queries).then(( results ) => {
			return ChartifyService.Chartify(StartTime * 1000, EndTime * 1000, Interval * 1000, results);
		});
	}
	
};