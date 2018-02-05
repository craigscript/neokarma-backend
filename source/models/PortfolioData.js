import mongoose from "mongoose";


let schema = mongoose.Schema({

	// portfolio Id
	portfolio: {
		type: mongoose.Schema.Types.ObjectId,
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
schema.index({portfolio: 1, day: -1}, {unique: true});

// Tmp storage for bulk operation
schema.statics.bulking = {
	currentOperation: null,
	writes: 0,
};

// Add metrics to bulk list
schema.statics.addMetrics = function(portfolio, date, metrics)
{
	var day = (((date.getFullYear() * 100) + date.getMonth() + 1) * 100) + date.getDate();
	schema.statics.addBulkMetrics(portfolio, day, date, metrics);
};

// Bulk write metrics
schema.statics.addBulkMetrics = function(portfolio, day, time, metrics)
{
	if(!schema.statics.bulking.currentOperation)
	{
		schema.statics.bulking.currentOperation = PortfolioData.collection.initializeUnorderedBulkOp();
	}
	var bulk = schema.statics.bulking.currentOperation;

	// bulk.insert({
	// 	portfolio: portfolio,
	// 	day: day,
	// 	data: [{
	// 		time: time,
	// 		metrics: metrics,
	// 	}],
	// });

	bulk.find({
		portfolio: portfolio,
		day: day,
	}).upsert().updateOne({
		$push: {
			data: {
				time: time,
				metrics: metrics,
			}
		}
	});
	++schema.statics.bulking.writes;
	if(schema.statics.bulking.writes >= 100)
	{
		schema.statics.executeBulkMetrics();
		
	}
};

var opCount = 0;
var opFinishCount = 0;
schema.statics.executeBulkMetrics = function(cb=()=>{})
{
	var expected = schema.statics.bulking.writes;
	
	if(schema.statics.bulking.currentOperation)
	{
		++opCount;
		schema.statics.bulking.writes = 0;
		var op = schema.statics.bulking.currentOperation;
		schema.statics.bulking.currentOperation.execute(cb);
		schema.statics.bulking.currentOperation = null;
	}
}

// Aggregate metrics
schema.statics.getMetrics = function(portfolio, start, end, Interval, metrics={})
{
	var projectQuery = {
		_id: 0,
		timestamp: {
			$multiply: [Interval, "$_id.timestamp"]
		},
	};

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

	return PortfolioData.aggregate([
		// Get documents matching by day range
		{
			$match: {
				portfolio: portfolio,
				day: {
					$gte: sday,
					$lte: eday,
					
				},
			}
		},
		// Extract sub-documents
		{
			$unwind: {
				path: "$data",
				includeArrayIndex: "dataI",
				preserveNullAndEmptyArrays: true,
			}
		},
		// Debug shit
		// {
		// 	$project: {
		// 		_id: 1,
		// 		Fuckers: { $type : "$data.metrics.Price" },
		// 		data: true,
		// 	}
		// }
		
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
		// {
		// 	$project:{ {
		// 		groupTime: {
		// 			$subtract: [
		// 			{
		// 				$divide: [ '$timestamp', Interval]
		// 			},
		// 			{
		// 				$mod: [
		// 				{
		// 					$divide: ['$timestamp', Interval]
		// 				}, 1]
		// 			}]
		// 		},}
		// 	//	timestamp: "$timestamp",
		// 		metrics: "$metrics",
		// 		//metrics: "$metrics",
		// 	//	price: { $type : "$data.metrics.Price"},
		// 	}
		// },
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

schema.connection = "markets";
export default schema;