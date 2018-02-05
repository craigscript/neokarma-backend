
@Controller("/stats")
class StatsController
{
	// Returns the information for the current user.
	@GET("/")
	index(req, res)
	{
		res.json({success: true});
	}

	@GET("/getTrackings")
	getTrackings(req, res)
	{
		TrackingStats.find().sort({target: -1, updatedAt: -1}).then( trackings => {
			res.json({success: true, trackings: trackings});
		}).catch( error => {
			res.serverError(error);
		});
	}

	
};