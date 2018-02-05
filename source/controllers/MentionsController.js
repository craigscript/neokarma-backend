@Controller("/mentions")
export default class MentionsController
{
	// Return the latest mentions for a specific filter
	@POST("/feed/:lastDate")
	feed(req, res)
	{
		let lastDate = req.params.lastDate;

		
		if(lastDate == 0)
		{
			lastDate = Date.now() + (3600*24000);
		}
		console.log("Params:", req.params);
		console.log("Body:", req.body);
		let filters = req.body.filters;
		if(!filters)
		{
			return res.error("No filters specified");
		}

		let aggregators = [
			{
				$match: {
					user: req.user._id,
				},
			},
		];

		// Filter by date
		if(filters.date && filters.date.start && filters.date.end)
		{
			console.log("Aggregating in range:", filters.date);
			aggregators.push({
				$match: {
					date: {
						$gte: filters.date.start || lastDate,
						$lt: filters.date.end || lastDate
					}
				}
			});
		}

		// Filter by category
		if(filters.category)
		{
			console.log("Aggregating in range:", filters.date);
			aggregators.push({
				$match: {
					categories: { $in: [filters.category] },
				},
			});
		}

		// Reduce search & cursor by date
		aggregators.push({
			$match: {
				date: {
					$lt: lastDate,
				}
			}
		});

		// Sort by date
		aggregators.push({
			$sort: {
				date: -1,
			}
		})

		// filter by tracker
		if(filters.tracker)
		{
			aggregators.push({
				$match: {
					tracker: ObjectId(filters.tracker),
				}
			});
		}

		console.log("filters title:", filters.title);
		// Filter by title
		if(filters.title && filters.title.length > 0)
		{
			console.log("filters title:", filters.title);
			if(filters.title.startsWith("!"))
			{
				aggregators.push({
					$match: {
						title: {
							$not: new RegExp("/" + filters.title.substr(1) + "/"),
							$options: 'i'
						}
					}
				});
			}else{
				aggregators.push({
					$match: {
						title: {
							$regex: filters.title,
							$options: 'i'
						}
					}
				});	
			}
		}

		if(filters.sentiment && filters.sentiment.start && filters.sentiment.end)
		{
			console.log("Sentiment filter:", filters.sentiment);
			aggregators.push({ 
				$match: {
					"sentiment.score": { 
						$gte: filters.sentiment.start,
						$lte: filters.sentiment.end
					}
				}
			});
		}

		if(filters.source)
		{
			console.log("Source filter:", filters.source);
			aggregators.push({ 
				$match: {
					type: filters.source
				}
			});
		}

		// Limit search results
		aggregators.push({
			$limit: 50,
		});

		console.log("Aggregating:", aggregators);
		Mentions.aggregate(aggregators).then( mentions => {
			console.log("Found:", mentions.length);
			res.json({success: true, mentions: mentions});
		}).catch( error => {
			res.serverError(error);
		});
	}
	

	// Lists all tracking entries
	@GET("/getTrackers")
	getTrackingEntries(req, res)
	{

		MentionTrackings.find({ user: req.user._id }).populate("sources").then( trackers => {
			res.json({success: true, trackers: trackers});
		}).catch( error => {
			res.serverError(error);
		});
	}

	@GET("/getTracker/:trackerId")
	getTrackingEntry(req, res)
	{
		let trackerId = req.params.trackerId;
		MentionTrackings.findOne({_id: trackerId, user: req.user._id}).then( tracking => {
			if(!tracking)
			{
				res.json({success: false, message: "Mention not found"});
				return;
			}
			res.json({success: true, tracker: tracking});
		});
	}

	// Adds a new tracking entry to the user
	@POST("/createTracker")
	createTrackingEntry(req, res)
	{
		let name = req.body.name;
		let tracking = req.body.tracking;

		// if(!UserQuota.validate(req.user, "mentions.trackers", 1))
		// {
		// 	return res.json({success: false, message: "Mention Tracker quota reached."});
		// }

		if(!tracking.required || !tracking.optional || !tracking.ignored)
			return res.json({success: false, message: "Invalid request, missing tracking data"});

		if(tracking.required.length <= 0 && tracking.optional.length <= 0)
		{
			res.json({success: false, message: "Please specify at least one required or optional word!"});
			return;
		}

		MentionTrackings.create({
			name: name,
			user: req.user._id,
			tracking: tracking,
			lastUpdated: 0,
			resetTracker: true,
			inQueue: true,
		}).then( result => {
			UserQuota.update(req.user, "mentions.trackers", 1);
			res.json({success: true, tracker: result});
		}).catch( error => {
			res.serverError(error);
		});
	}

	// Adds a new tracking entry to the user
	@POST("/updateTracker/:trackerId")
	updateTrackingEntry(req, res)
	{
		let trackerId = req.params.trackerId;
		let name = req.body.name;
		let tracking = req.body.tracking;

		if(!tracking.required || !tracking.optional || !tracking.ignored)
			return res.json({success: false, message: "Invalid request, missing tracking data"});

		if(tracking.required.length <= 0 && tracking.optional.length <= 0)
		{
			return res.json({success: false, message: "Please specify at least one required or optional word!"});
		}


		MentionTrackings.update({
			_id: trackerId,
			user: req.user._id
		},
		{
			name: name,
			tracking: tracking,
			resetTracker: true,
			inQueue: true,
		}).then( result => {
			res.json({success: true});
		}).catch( error => {
			res.serverError(error);
		});
	}


	@GET("/deleteTracker/:trackerId")
	removeTrackingEntry(req, res)
	{
		let trackerId = req.params.trackerId;
		
		MentionTrackings.findOne({_id: trackerId, user: req.user._id}).then( MentionTracking => {
			if(!MentionTracking)
			{
				res.json({success: false, message: "Mention not found"});
				return;
			}
			Mentions.remove({tracker: MentionTracking._id});
			TrackingSites.remove({ _id: { $in: MentionTracking.sources }, user: req.user._id }).then( response => {
				UserQuota.update(req.user, "mentions.trackers", -1);
				MentionTracking.remove();
				res.json({success: true});
			});
		});
	}

	@GET("/getSources/:trackerId")
	getSources(req, res)
	{
		let trackerId = req.params.trackerId;
		
		MentionTrackings.findOne({_id: trackerId, user: req.user._id}).then( MentionTracking => {
			if(!MentionTracking)
			{
				res.json({success: false, message: "Mention not found"});
				return;
			}
			TrackingSites.find({ _id: { $in: MentionTracking.sources }}).then( response => {
				res.json({success: true, sources: response});
			});
		});
	}

	@POST("/createSource/:trackerId")
	createSource(req, res)
	{
		let source = req.body.source;
		let type = req.body.type;
		let trackerId = req.params.trackerId;
		
		MentionTrackings.findOne({_id: trackerId, user: req.user._id}).then( MentionTracking => {
			if(!MentionTracking)
			{
				res.json({success: false, message: "Mention not found"});
				return;
			}

			// if(!UserQuota.validateCustom(req.user, "mentions.sources", MentionTracking.sources.length + 1))
			// {
			// 	return res.json({success: false, message: "Mention Source quota reached."});
			// }

			TrackingSites.create({
				user: req.user._id,
				type: type,
				target: source.target,
				options: source.options,
			}).then(result => {
				MentionTracking.inQueue = true;
				MentionTracking.resetTracker = true;
				MentionTracking.sources.push(result._id);
				MentionTracking.save();
				res.json({success: true, source: result});
			}).catch( error => {
				res.serverError(error);
			});
		})
	}

	@POST("/updateSource/:sourceId")
	updateSource(req, res)
	{
		let sourceId = req.params.sourceId;
		let source = req.body.source;

		TrackingSites.update(
		{
			_id: sourceId,
			user: req.user._id
		}, 
		{
			target: source.target,
			options: source.options,
		}).then(result => {
			res.json({success: true});
		}).catch( error => {
			res.serverError(error);
		});
	
	}

	@GET("/deleteSource/:trackerId/:sourceId")
	removeSource(req, res)
	{
		let trackerId = req.params.trackerId;
		let sourceId = req.params.sourceId;
		MentionTrackings.findOne({_id: trackerId, user: req.user._id}).then( MentionTracking => {
			if(!MentionTracking)
			{
				res.json({success: false, message: "Mention not found"});
				return;
			}
			

			TrackingSites.remove(
			{
				_id: sourceId,
				user: req.user._id
			}).then(() => {

				MentionTracking.sources.pull(sourceId);
				MentionTracking.save();
				res.json({success: true});
			}).catch( error => {
				res.serverError(error);
			});
		});
	
	
	}

	@POST("/getMentions/:trackerId/:EntryTime/:Interval")
	getMentions(req, res)
	{
		let scoring = [];
		res.json({success: true, mentions: []});
	}

	@GET("/getTrackerData/:trackerId/:stepSize/:start/:end")
	getTrackerData(req, res)
	{
		var trackerId = req.params.trackerId;
		var stepSize = Math.max(req.params.stepSize, 1) * 1000;
		var start = req.params.start * 1000;
		var end = req.params.end * 1000;
		
		if(ChartifyService.GetNumPoints(start, end, IntestepSizerval) > MAX_GRAPH_POINTS)
			return res.error("Date Range too large, please specify a smaller range!");

		let aggregators = [
		// Filter query by date & user
		{
			$match: {
				user: req.user._id,
				tracker: ObjectId(trackerId),
				date: {
					$gte: start,
					$lt: end
				}
			},
		}];
		
		
		aggregators.push(
			// Group by StepSize (Zoom Level)
			{
				$group: {
					_id: {
						date: {
							$subtract: [
							{
								$divide: [ '$date', stepSize ]
							},
							{
								$mod: [
								{
									$divide: ['$date', stepSize ]
								}, 1]
							}]
						},
					},
					count: {
						$sum: 1
					}
				}
			},
			// Format date & timestamp
			{
				$project: {
					timestamp: {
						$multiply: [stepSize, "$_id.date"]
					},
					count: "$count",
					date: {
						$add: [new Date(0), {
							$multiply: [stepSize, "$_id.date"],
						}],
					}
				}
			},
			// Sort by date
			{
				$sort: { "_id.date": 1 }
			},
			{
				$project: {
					_id: 0,
					date: "$date",
					value: "$count",
					timestamp: "$timestamp",
				},
			},
		);
		Mentions.aggregate(
			aggregators
		).then( results => {
			console.log("results:", results);
			res.json({success: true, data: ChartifyService.Chartify(start, end, stepSize, results)});			
			
		}).catch( error => {
			res.serverError(error);
		});
	}


	@GET("/getMoment/:trackerId/:Moment/:Interval")
	getMoment(req, res)
	{
		let trackerId = req.params.trackerId;
		let Moment = req.params.Moment;
		let Interval = req.params.Interval / 2;
		console.log("Aggregating queries:", trackerId, Moment, Interval);
		
		Mentions.aggregate(
			[
				// Filter query by date & user
				{
					$match: {
						user: req.user._id,
						tracker: ObjectId(trackerId),
						date: {
							$gt: (Moment - Interval) * 1000,
							$lt: (Moment + Interval) * 1000
						}
					},
				},
				
				// Sort by date
				{
					$sort: { "_id.date": 1 }
				},
				{
					$limit : 50,
				}
				// {
				// 	$project: {
				// 		_id: 0,
				// 		date: "$date",
				// 		value: "$count",
				// 		timestamp: "$timestamp",
				// 	},
				// },
			
			]
		).then( results => {
			res.json({success: true, mentions: results});			
			
		}).catch( error => {
			res.serverError(error);
		});
		
		//return res.error("not implemented");
	}

	// Return the history of the trackings for the current user
	@GET("/history/:trackerType")
	history(req, res)
	{
		let trackerType = req.params.trackerType;
		if(trackerType == "Reddit")
		{
			RedditPosts.find().sort({date: -1}).limit(50).then( result => {
				res.json({success: true, history: result});		
			});
		}
	}


};