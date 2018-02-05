import mongoose from "mongoose";


let schema = mongoose.Schema({

	exchange: {
		type: String,
		index: true,
	},

	market: {
		type: String,
		index: true,
	},
	
	day: {
		type: Number,
		index: true,
	},
	data: [],
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

// Define compound indexes for faster lookup
schema.index({exchange: 1, market: 1, day: 1}, {unique: true});

// Tmp storage for bulk operation
schema.statics.bulking = {
	currentOperation: null,
	writes: 0,
};

// Add metrics to bulk list
schema.statics.addMetrics = function(exchange, market, date, metrics)
{
	var day = (((date.getFullYear() * 100) + date.getMonth() + 1) * 100) + date.getDate();
	schema.statics.addBulkMetrics(exchange, market, day, date, metrics);
};

schema.statics._metricalCache = {};
// Bulk write metrics
schema.statics.addBulkMetrics = function(exchange, market, day, time, metrics)
{
	if(!schema.statics._metricalCache[exchange])
	{
		schema.statics._metricalCache[exchange] = {};
	}

	if(!schema.statics._metricalCache[exchange][market])
	{
		schema.statics._metricalCache[exchange][market] = {};
	}

	if(!schema.statics._metricalCache[exchange][market][day])
	{
		schema.statics._metricalCache[exchange][market][day] = [];
	}

	schema.statics._metricalCache[exchange][market][day].push({
		time: time,
		metrics: metrics,
	});

	++schema.statics.bulking.writes;
	if(schema.statics.bulking.writes >= 1000)
	{
		schema.statics.executeBulkMetrics();
		
	}
};

schema.statics.executeBulkMetrics = function(cb=()=>{})
{
	// nothing to do
	if(!schema.statics.bulking.writes)
	{
		return;
	}
	schema.statics.bulking.writes = 0;

	let bulk = MarketData.collection.initializeUnorderedBulkOp();
	let realWrites = 0;
	for(let exchange in schema.statics._metricalCache)
	{
		for(let market in schema.statics._metricalCache[exchange])
		{
			for(let day in schema.statics._metricalCache[exchange][market])
			{
				// bulk.insert({
				// 	exchange: exchange,
				// 	market: market,
				// 	day: day,
				// 	data: schema.statics._metricalCache[exchange][market][day],
				// });

				bulk.find({
					exchange: exchange,
					market: market,
					day: parseInt(day),
				}).upsert().updateOne({
					$push: {
						data: {
							$each: schema.statics._metricalCache[exchange][market][day],
						}
					}
				});

				++realWrites;
			}
		}
	}

	// Clean Up
	schema.statics._metricalCache = {};
	
	// Nothing to do
	if(!realWrites)	
	{
		return;
	}

	

	var stat = new Date();
	bulk.execute((err, result) => {
		let statTime = Date.now() - stat.getTime();
		
		console.log("[MarketData] Bulk Op:", statTime, "ms", result.isOk(), "I:", result.nInserted, "U:", result.nUpserted, "M:", result.nModified, "F:", result.nMatched, "R:", result.nRemoved);
		if(err || !result)
		{
			console.log("Error:", err);
		}
	});
}

// Aggregate metrics
schema.statics.getMetrics = function(exchange, market, start, end, Interval, metrics={}, projects={})
{
	var projectQuery = Object.assign({
		_id: 0,
		timestamp: {
			$multiply: [Interval, "$_id.timestamp"]
		},
	}, projects);

	var groupQuery = {
		_id: {
			timestamp: {
				$subtract: [
				{
					$divide: [ '$timestamp', Interval]
				},
				{
					$mod: [
					{
						$divide: ['$timestamp', Interval]
					}, 1]
				}]
			}
		},
	};


	
	for(var key of Object.keys(metrics))
	{
		groupQuery[key] = {};
		groupQuery[key][metrics[key]] = "$metrics." + key;
		projectQuery[key] = "$" + key;
	}
	
	// Get Start & Ending days
	var sday = (((start.getFullYear() * 100) + start.getMonth() + 1) * 100) + start.getDate();
	var eday = (((end.getFullYear() * 100) + end.getMonth() + 1) * 100) + end.getDate();
	

	return MarketData.aggregate([
		// Get documents matching by day range
		{
			$match: {
				exchange: exchange,
				market: market,
				day: {
					$gte: sday,
					$lte: eday,
				},
			}
		},
		{
			$sort: { "day": 1 }
		},
		// Extract sub-documents
		{
			$unwind: {
				path: "$data",
				//includeArrayIndex: "dataI",
				//preserveNullAndEmptyArrays: true,
			}
		},
		{
			$project: {
				//_id: false,
				timestamp: {
					 $subtract: [ "$data.time", new Date("1970-01-01") ]
				},
				date: "$data.time",
				//data: true,
				//price: { $type : "$data.0.metrics.Price"},
				metrics: "$data.metrics",
			}
		},
		{
			$match: {
				timestamp: {
					$gt: start.getTime(),
					$lte: end.getTime(),
				},
			}
		},
		// Group the metrical data
		{
			$group: groupQuery,
		},
		// Sort the goruped results by time
		{
			$sort: { "_id.timestamp": 1 }
		},
		{
			$project: projectQuery,
		}
		// // // Sort the goruped results by time
		// {
		// 	$sort: { "_id.timestamp": 1 }
		// },
		// {
		// 	$project: {
		// 		date: "$_id.date",
		// 		Price: "$Price",
		// 	}
		// }
		// Project the output to proper time format
		// {
		// 	$project: projectQuery
		// }
	]);
};

// Get changes in metrics
schema.statics.getMetricsChange = function(matches = {}, start, end, interval, metric, sortDirection=-1)
{
	var sday = (((start.getFullYear() * 100) + start.getMonth() + 1) * 100) + start.getDate();
	var eday = (((end.getFullYear() * 100) + end.getMonth() + 1) * 100) + end.getDate();

	return MarketData.aggregate([
		// Get documents matching by day range
		{
			$match: Object.assign({
				day: {
					$gte: sday,
					$lte: eday,
					
				},
			}, matches),
		},
		{
			$sort: { "day": 1 }
		},
		// Extract sub-documents
		{
			$unwind: {
				path: "$data",
			}
		},
		{
			$project: {
					timestamp: {
					$subtract: [ "$data.time", new Date("1970-01-01") ]
				},
				date: "$data.time",
				market: "$market",
				metrics: "$data.metrics",
			}
		},
		{
			$match: {
				timestamp: {
					$gt: start.getTime(),
					$lte: end.getTime(),
				},
			}
		},
		{
			$group: {
				_id: {
					market: "$market",
				},
				first: { $first: "$metrics." + metric },
				last: { $last: "$metrics." + metric },
				volume: { $avg: "$metrics.Volume"},
				price: { $avg: "$metrics.Price"},
			},
		},
		{
			$project: {
				_id: 0,
				market: "$_id.market",
				change: {
					$subtract: ["$last", "$first"]
				},
				volume: "$volume",
				price: "$price",
				percent: {
					$multiply: [{
						$divide: [{
							$subtract: ["$last", "$first"]
						}, "$last"]
					}, 100]
				},
				first: "$first",
				last: "$last",
			}
		},
		{
			$sort: { "percent": sortDirection }
		},
	]);
};


// Aggregate metrics
schema.statics.getMetricsAvgTotals = function(matches = {}, start, end, interval, metric, sortDirection=-1)
{
	var sday = (((start.getFullYear() * 100) + start.getMonth() + 1) * 100) + start.getDate();
	var eday = (((end.getFullYear() * 100) + end.getMonth() + 1) * 100) + end.getDate();

	return MarketData.aggregate([
		// Get documents matching by day range
		{
			$match: Object.assign({
				day: {
					$gte: sday,
					$lte: eday,
					
				},
			}, matches),
		},
		// Extract sub-documents
		{
			$unwind: {
				path: "$data",
			}
		},
		{
			$project: {
					timestamp: {
					$subtract: [ "$data.time", new Date("1970-01-01") ]
				},
				date: "$data.time",
				market: "$market",
				metrics: "$data.metrics",
			}
		},
		{
			$match: {
				timestamp: {
					$gt: start.getTime(),
					$lte: end.getTime(),
				},
			}
		},
		{
			$group: {
				_id: {
					market: "$market",
					timestamp: {
						$subtract: [
						{
							$divide: [ '$timestamp', interval]
						},
						{
							$mod: [
							{
								$divide: ['$timestamp', interval]
							}, 1]
						}]
					}
				},
				avgData: { $avg: "$metrics." + metric },
				//metrics: "$metrics",
			}
		},
			{
			$sort: { "_id.timestamp": 1 }
		},
		{
			$group: {
				_id: {
					market: "$_id.market",
				},
				total: { $sum: "$avgData" },
				first: { $first: "$avgData" },
				last: { $last: "$avgData" },
			},
		},
		{
			$project: {
				_id: 0,
				market: "$_id.market",
				change: {
					$subtract: ["$last", "$first"]
				},
				total: "$total",
				percent: {
					$multiply: [{
						$divide: [{
							$subtract: ["$last", "$first"]
						}, "$last"]
					}, 100]
				},
				first: "$first",
				last: "$last",
			}
		},
		{
			$sort: { "total": sortDirection }
		},
	]);
};

schema.connection = "markets";

export default schema;