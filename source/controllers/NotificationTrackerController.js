@Controller("/notificationtrackers")
class NotificationsController
{
	// Lists notification trackers
	@GET("/getTrackers")
	getTrackers(req, res)
	{
		NotificationTrackers.find({
			user: req.user._id
		}).then( trackers => {
			res.json({success: true, trackers: trackers});
		}).catch( error => {
			res.serverError(error);
		});
	}

	// Returns a single notification tracker
	@GET("/getTracker/:trackerId")
	getTracker(req, res)
	{
		let trackerId = req.params.trackerId;
		NotificationTrackers.findOne({
			_id: trackerId,
			user: req.user._id,
		}).then( tracker => {
			if(!tracker)
				return res.error("Tracker not found");

			res.json({success: true, tracker: tracker});
		}).catch( error => {
			res.serverError(error);
		});
	}

	@POST("/createTracker")
	createTracker(req, res)
	{
		let tracker = req.body;
		if(!tracker.name)
			return res.error("Missing 'name' field");

		NotificationTrackers.create({
			name: tracker.name,
			user: req.user._id,
			rules: [],
			targets: [],
			status: 'Active',
			lastUpdated: Date.now(),
		}).then( tracker => {
			res.json({success: true, tracker: tracker});
		}).catch( error => {
			res.serverError(error);
		});
	}

	@POST("/updateTracker/:trackerId")
	updateTracker(req, res)
	{
		let trackerId = req.params.trackerId;
		let tracker = req.body;

		// if(!tracker.name)
		// 	return res.error("Missing 'name' field");

		NotificationTrackers.update({
			_id: trackerId,
			user: req.user._id
		}, tracker).then( result => {
			
			if(!result)
				return res.error("Tracker not found.");
				
			res.json({success: true});
		}).catch( error => {
			res.serverError(error);
		});
	}

	@GET("/deleteTracker/:trackerId")
	deleteTracker(req, res)
	{
		let trackerId = req.params.trackerId;

		NotificationTrackers.remove({
			_id: trackerId,
			user: req.user._id
		}).then( result => {
			res.json({success: true});
		}).catch( error => {
			res.serverError(error);
		});
	}

	@GET("/testTarget/:trackerId/:targetId")
	testTarget(req, res)
	{
		let trackerId = req.params.trackerId;
		let targetId = req.params.targetId;

		NotificationTrackers.find({
			_id: trackerId,
			user: req.user._id
		}).then( tracker => {

			if(!tracker)
				return res.error("Tracker not found");
			
			if(!tracker.targets[targetId])
				return res.error("Target not found");
			
			// TODO: Call NotificationTracker Service and trigger a testing method

			res.json({success: true});

		}).catch( error => {
			res.serverError(error);
		});
	}

	// Lists available sources for tracking
	@GET("/getUserSources")
	getUserSources(req, res)
	{
		Trackers.find({
			user: req.user._id
		}).then( trackers => {
			res.json({success: true, trackers: trackers});
		}).catch( error => {
			res.serverError(error);
		});
	}

	@GET("/getGlobalSources")
	getGlobalSources(req, res)
	{
		Trackers.find({
			global: true
		}).then( trackers => {
			res.json({success: true, trackers: trackers});
		}).catch( error => {
			res.serverError(error);
		});
		//return res.error("Not implemented");
		// Trackers.find({
		// 	user: req.user._id
		// }).then()
	}

	@GET("/getMarketSources")
	getMarketSources(req, res)
	{
		return res.error("Not implemented");
		// Trackers.find({
		// 	user: req.user._id
		// }).then()
	}
};