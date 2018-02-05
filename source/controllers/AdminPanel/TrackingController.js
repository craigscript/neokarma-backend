@Controller("/admin/tracking")
class TrackingController
{
	// Return the current trackings for the current user
	@GET("/list/:type")
	list(req, res)
	{
		let type = req.params.type;

		TrackingSites.find({type: type, user: req.user._id}).then( result => {
			res.json({success: true, trackings: result});
		}).catch( error => {
			res.serverError(error);
		});
	}

	// Adds a new tracking entry to the user
	@POST("/create")
	createTracking(req, res)
	{
		let tracking = req.body.tracking;
		TrackingSites.create({type: tracking.type, user: req.user._id, target: tracking.target}).then( result => {
			res.json({success: true, tracking: result});
		}).catch( error => {
			res.serverError(error);
		});
	}

	@GET("/destroy/:trackingId")
	destroyTracking(req, res)
	{
		let trackingId = req.params.trackingId;
		TrackingSites.remove({
			_id: trackingId,
			user: req.user._id,
		}).then( () => {
			res.json({success: true});
		}).catch( error => {
			res.serverError(error);
		});
	}


	// Return the history of the trackings for the current user
	@GET("/history/:trackerType")
	history(req, res)
	{
		let trackerType = req.params.trackerType;
		if(trackerType == "reddit")
		{
			RedditPosts.find().sort({date: -1}).limit(50).then( result => {
				res.json({success: true, history: result});		
			});
		}
	}

};