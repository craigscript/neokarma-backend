@Controller("/trackers")
class TrackersController
{
	@GET("/getTrackers")
	getTrackers(req, res)
	{
		Trackers.find({user: req.user._id}).populate("sources").then( trackers => {
			res.json({success: true, trackers: trackers});
		});
	}

	@GET("/getGlobalTrackers")
	getGlobalTrackers(req, res)
	{
		Trackers.find({global: true}).populate("sources").then( trackers => {
			res.json({success: true, trackers: trackers});
		});
	}

	@GET("/getTracker/:trackerId")
	getTracker(req, res)
	{
		Trackers.findOne({_id: req.params.trackerId, user: req.user._id}).populate("sources").then( tracker => {
			if(!tracker)
			{
				res.json({success: false, message: "Tracker not found"});
				return;
			}
			res.json({success: true, tracker: tracker});
		});
	}

	@POST("/updateTracker/:trackerId")
	updateTracker(req, res)
	{
		var trackerId = req.params.trackerId;
		var name = req.body.name;
		Trackers.update({
			_id: trackerId,
			user: req.user._id,
		},
		{
			name: name
		}).then( result => {
			res.json({success: true});
		}).catch( error => {
			res.serverError(error);
		});
	}

	@POST("/updateTrackerData/:trackerId")
	updateTrackerData(req, res)
	{
		var trackerId = req.params.trackerId;
		var exporters = req.body.exporters;
		Trackers.update({
			_id: trackerId,
			user: req.user._id,
		},
		{
			exporters: exporters
		}).then( result => {
			res.json({success: true});
		}).catch( error => {
			res.serverError(error);
		});
	}

	@POST("/createTracker")
	createTracker(req, res)
	{
		var name = req.body.name;
		// var sources = req.body.sources;
		// var filters = req.body.filters;
		// var status = req.body.status;
		
		Trackers.create({
			name: name,
			user: req.user,
		}).then( result => {
			res.json({success: true, tracker: result});
		}).catch( error => {
			res.serverError(error);
		});
	}

	@GET("/deleteTracker/:trackerId")
	deleteTracker(req, res)
	{
		var trackerId = req.params.trackerId;
		Trackers.remove({
			_id: trackerId,
			user: req.user._id,
		}).then( () => {
			res.json({ success: true });
		});
	}

	@GET("/getSource/:trackerId/:sourceId")
	getSource(req, res)
	{
		let sourceId = req.params.sourceId;
		TrackerSources.findOne({_id: sourceId, user: req.user._id}).then( source => {
			res.json({success: true, source: source});
		});
	}
	
	@POST("/createSource/:trackerId")
	createSource(req, res)
	{
		let trackerId = req.params.trackerId;
		var name = req.body.name;
		var type = req.body.type;
		var target = req.body.target;
		var options = req.body.options;

		Trackers.findOne({_id: trackerId, user: req.user._id}).then( tracker => {
			
			if(!tracker)
				return res.json({ success: false, message: "No such tracker" });
			

			TrackerSources.create({
				user: req.user._id,
				name: name,
				type: type,
				target: target,
				options: options,
			}).then(source => {

				tracker.sources.push(source._id);
				tracker.save();
				
				if(tracker.type == 'reddit' || tracker.type == 'website')
				{
					TrackingSites.create({
						type: type,
						user: req.user._id,
						target: target,
						options: options,
					}).then( trackingSite => {
						source.trackingSite = trackingSite._id;
						source.save();
					});
				}
				

				res.json({success: true, source: source});
			}).catch( error => {
				res.serverError(error);
			});
		});
	}

	@POST("/updateSource/:trackerId/:sourceId")
	updateSource(req, res)
	{
		let trackerId = req.params.trackerId;
		let sourceId = req.params.sourceId;
		var name = req.body.name;
		var target = req.body.target;
		var options = req.body.options;

		TrackerSources.findOne({
			_id: sourceId,
			user: req.user._id,
		}).then( source => {
				
			source.name = name;
			source.target = target;
			source.options = options;
			source.save();
			
			if(source.trackingSite)
			{
				TrackingSites.update({
					_id: source.trackingSite,
				},{
					target: target,
					options: options,
				}).exec();
			}
			res.json({success: true});
		}).catch( error => {
			res.serverError(error);
		});
	}

	@POST("/updateSourceData/:sourceId")
	updateSourceData(req, res)
	{
		let sourceId = req.params.sourceId;
		var filters = req.body.filters || [];
		var actions = req.body.actions || [];

		TrackerSources.update({
			_id: sourceId,
			user: req.user._id,
		},
		{
			filters: filters,
			actions: actions,
		}).then(result => {
			res.json({success: true});
		}).catch( error => {
			res.serverError(error);
		});
	}

	@GET("/deleteSource/:trackerId/:sourceId")
	deleteSource(req, res)
	{
		let trackerId = req.params.trackerId;
		let sourceId = req.params.sourceId;

		Trackers.findOne({_id: trackerId, user: req.user._id}).then( tracker => {

			if(!tracker)
				return res.json({ success: false, message: "No such tracker" });
			
			TrackerSources.findOne({
				_id: sourceId,
				user: req.user._id,
			}).then( source => {

				if(!source)
					return res.json({ success: false, message: "No such source." });

		

				TrackerSources.remove({
					_id: sourceId,
					user: req.user._id,
				}).then(result => {

					if(source.trackingSite)
					{
						TrackingSites.remove({
							_id: source.trackingSite,
						}).exec();
					}
					
					tracker.sources.pull(sourceId);
					tracker.save();
					res.json({success: true});
				}).catch( error => {
					res.serverError(error);
				});
			})
			
		});
	}

	@GET("/getTrackerData/:trackerId/:Interval/:StartTime/:EndTime")
	getTrackerData(req, res)
	{
		var trackerId = req.params.trackerId;
		var Interval = parseInt(req.params.Interval);
		var StartTime = parseInt(req.params.StartTime);
		var EndTime = parseInt(req.params.EndTime);

		if(ChartifyService.GetNumPoints(StartTime, EndTime, Interval) > MAX_GRAPH_POINTS)
			return res.error("Date Range too large, please specify a smaller range!");
			

		Trackers.findOne({_id: trackerId, $or: [ {user: req.user._id}, {global: true}]}).populate("sources").then( tracker => {
			if(!tracker)
			{
				return res.json({ success: false, message: "Tracker not found." });
			}

			let extractor = new TrackerService.TrackerExtractor(tracker);
			extractor.getDataInRange(Interval, StartTime, EndTime).then( result => {
				res.json({ success: true, data: result });
			}).catch( error => {
				res.json({ success: false, message: error });
			});
		}).catch( error => {
			res.serverError(error);
		});
		
	}

	@GET("/getSourceData/:trackerId/:sourceId/:Interval/:StartTime/:EndTime")
	getSourceData(req, res)
	{
		var trackerId = req.params.trackerId;
		var sourceId = req.params.sourceId;
		var Interval = parseInt(req.params.Interval);
		var StartTime = parseInt(req.params.StartTime);
		var EndTime = parseInt(req.params.EndTime);

		if(ChartifyService.GetNumPoints(StartTime, EndTime, Interval) > MAX_GRAPH_POINTS)
			return res.error("Date Range too large, please specify a smaller range!");

		Trackers.findOne({_id: trackerId, $or: [ {user: req.user._id}, {global: true}]}).then( tracker => {

			if(!tracker)
			{
				return res.json({ success: false, message: "Tracker not found." });
			}

			TrackerSources.findOne({_id: sourceId}).then( source => {
				if(!source)
				{
					return res.json({ success: false, message: "Source not found." });
				}

				let extractor = new TrackerService.SourceExtractor(source);
				extractor.extractInRange(Interval, StartTime, EndTime).then( result => {
					res.json({ success: true, data: result });
				}).catch( error => {
					res.json({ success: false, message: error });
				});
			}).catch( error => {
				res.serverError(error);
			});
		}).catch( error => {
			res.serverError(error);
		});
	}
};