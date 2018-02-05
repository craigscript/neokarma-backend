

@Controller("/currencies/alerts", ["Auth"])
class CurrencyAlertsController
{
	// Returns the user alerts set
	@GET("/")
	index(req, res)
	{
		MarketAlerts.find({ userId: req.user._id }).lean().then( alerts => {
			res.json({success: true, alerts: alerts});
		});
	}

	@GET("/getAlerts/:currency")
	getAlerts(req, res)
	{
		let currency = req.params.currency;
		MarketAlerts.find({ userId: req.user._id, exchange: "nkr", market: currency }).lean().then( alerts => {
			res.json({success: true, alerts: alerts});
		});
	}

	@POST("/createAlert")
	createAlert(req, res)
	{
		var alertName = req.body.name;
		var currency = req.body.currency;
		var alarmStrategy = req.body.alarmStrategy;
		var alarmOptions = req.body.alarmOptions;

		MarketAlerts.create({
			userId: req.user._id,
			name: alertName,
			exchange: "nkr",
			market: currency,
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
