

@Controller("/market/alerts")
class MarketAlertsController
{
	// Returns the user alerts set
	@AuthRequired({success: true, alerts: []})
	@GET("/")
	getAlerts(req, res)
	{
		MarketAlerts.find({ userId: req.user._id }).lean().then( alerts => {
			res.json({success: true, alerts: alerts});
		})
		
	}

	@AuthRequired({success: true, alerts: []})
	@GET("/market/:MarketName")
	getMarketAlerts(req, res)
	{
		let MarketName = req.params.MarketName;
		MarketAlerts.find({ userId: req.user._id, market: MarketName }).lean().then( alerts => {
			res.json({success: true, alerts: alerts});
		})
		
	}

	// Creates an alert
	@AuthRequired()
	@POST("/createAlert")
	createAlert(req, res)
	{
		var alertName = req.body.name;
		var market = req.body.market;
		var alarmStrategy = req.body.alarmStrategy;
		var alarmOptions = req.body.alarmOptions;

		MarketAlerts.create({
			userId: req.user._id,
			name: alertName,
			market: market,
			alarmStrategy: alarmStrategy,
			alarmOptions: alarmOptions,
			target: "email",
			targetOptions: {
				address: req.user.email,
			},
			canTrigger: true,
		}).then( alert => {
			res.json({success: true, alert: alert});
		}).catch( error => {
			res.serverError(error);
		})
	}

	// Creates an alert
	@AuthRequired()
	@POST("/updateAlert/:alertId")
	updateAlert(req, res)
	{
		var alertName = req.body.name;
		var market = req.body.market;
		var alarmStrategy = req.body.alarmStrategy;
		var alarmOptions = req.body.alarmOptions;

		MarketAlerts.update({
			_id: req.params.alertId
		},
		{
			userId: req.user._id,
			name: alertName,
			market: market,
			alarmStrategy: alarmStrategy,
			alarmOptions: alarmOptions,
			target: "email",
			targetOptions: {
				address: req.user.email,
			},
			canTrigger: true,
		}).then( alert => {
			res.json({success: true, alert: alert});
		}).catch( error => {
			res.serverError(error);
		})
	}

	@AuthRequired()
	@GET("/removeAlert/:alertId")
	removeAlert(req, res)
	{
		MarketAlerts.remove({
			userId: req.user._id,
			_id: req.params.alertId,
		}).then( () => {
			res.json({success: true});
		}).catch( error => {
			res.serverError(error);
		})
	}
};
