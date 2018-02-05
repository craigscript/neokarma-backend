@Controller("/currencies")
class CurrenciesController
{
	// Returns all the currencies ordered by the rank
	@CACHE(15)
	@GET("/")
	@GET("/getCurrencies")
	index(req, res)
	{
		let paging = req.params.paging || 0;
		Currencies.find({ visible: true }, { _id: 0, exchanges: 0, indexes: 0 }).sort({rank: -1}).lean().then( currencies => {
			res.cjson({
				success: true,
				currencies: currencies,
			});
		}).catch( error => {
			res.serverError(error);
		});
	}
	
	// Returns currency ticker (Updated every second) => LATEST PRICE
	@CACHE(15)
	@GET("/getSorted/:sortKey/:order")
	getSorted(req, res)
	{
		let sortKey = req.params.sortKey;
		let order = req.params.order;

		let sortQuery = {};
		sortQuery["ticker." + sortKey] = order;
		Currencies.find({
			visible: true,
		}, { _id: 0, exchanges: 0, indexes: 0 }).sort(sortQuery).lean().limit(50).then( currencies => {
			res.cjson({
				success: true,
				currencies: currencies,
			});
		}).catch( error => {
			res.serverError(error);
		});
	}

	// Returns exchange rates
	@CACHE(15)
	@GET("/getRates")
	getRates(req, res)
	{
		let currencies = ["usd", "btc"];
		Currencies.findOne({ currency: "bitcoin"}).then( bitcoin => {
			return res.cjson({success: true, rates: {
				usd: 1,
				btc: bitcoin.ticker.Price,
			}});
		}).catch( error => {
			res.serverError(error);
		});
	}

	// Returns a single currency
	@CACHE(5)
	@GET("/getCurrency/:currency")
	getCurrency(req, res)
	{
		var currency = req.params.currency;
		Currencies.findOne({
			currency: currency,
			visible: true,
		}, { _id: 0, exchanges: 0, indexes: 0 }).lean().then( currency => {

			if(!currency)
				return res.error("No such currency");
			
			return res.cjson({success: true, currency: currency});
		}).catch( error => {
			res.serverError(error);
		});
	}
	

	// Returns currency ticker (Updated every second) => LATEST PRICE
	@CACHE(5)
	@GET("/getTickers")
	getTickers(req, res)
	{
		Currencies.find({
			visible: true,
		}, { _id: 0, exchanges: 0, indexes: 0 }).sort({rank: -1}).lean().then( currencies => {
			res.cjson({success: true, tickers: currencies.map( currency => Object.assign({ currency: currency.currency }, currency.ticker) ) });
		});
	}
	
	@CACHE(5)
	@GET("/getTicker/:currency")
	getTicker(req, res)
	{
		var currencyName = req.params.currency;
		Currencies.findOne({
			visible: true,
			currency: currencyName,
		}, { _id: 0, exchanges: 0, indexes: 0 }).sort({rank: -1}).lean().then( currency => {
			res.cjson({success: true, ticker: Object.assign({ currency: currency.currency }, currency.ticker)});
		}).catch( error => {
			res.serverError(error);
		});
	}

	// Searches for a currency
	@POST("/search")
	search(req, res)
	{
		let search = req.body.search;
		let searchQuery = {};
		if(search && search.length > 0)
		{
			var searchTags = search.split(" ");
			searchQuery = [];
			for(var tag of searchTags)
			{
				searchQuery.push(
					{
						symbol: {
							$regex: tag,
							$options: "i",
						}
					},
					{
						currencies: {
							$regex: tag,
							$options: "i",
						}
					},
					{
						name: {
							$regex: tag,
							$options: "i",
						}
					}
				);
			}
			Currencies.find({
				$or: searchQuery,
				visible: true
			},
			{
				_id: 0,
				exchanges: 0,
				indexes: 0,
				ticker: 0
			}).sort({rank: -1}).limit(25).lean().then( currencies => {
				res.json({success: true, currencies: currencies });
			}).catch( error => {
				res.serverError(error);
			});
		}else{
			res.json({success: true, currencies: [] });
		}
	}

	@CACHE(60)
	@GET("/history/:currency/:startTime/:endTime/:interval/:index")
	getHistory(req, res)
	{
		let currency = req.params.currency;
		var startTime = parseFloat(req.params.startTime);
		var endTime = parseFloat(req.params.endTime);
		var interval = parseFloat(req.params.interval);
		var index = req.params.index;
		if(endTime <= 0)
		{
			endTime = Date.now();
		}


		var stat = new Date();
		var startDate = new Date(startTime);
		var endDate = new Date(endTime);
		var Query = {};
		Query[index] = "$avg";
		MarketData.getMetrics("nkr", currency, startDate, endDate, interval, Query).then( documents => {	

			for(let doc of documents)
			{
				doc.date = new Date(doc.timestamp);
			}
			res.cjson({
				success: true, 
				dates: {
					startDate: startDate,
					endDate: endDate,
					interval: interval,
				},
				currency: currency,
				queryTime: ((Date.now() - stat.getTime()) / 1000),
				history: documents
			});
	
		}).catch( error => {
			res.serverError(error);
		});
	}

	@CACHE(5)
	@GET("/getChanges/:startTime/:endTime/:interval/:metric/:direction")
	getChanges(req, res)
	{
		var startTime = parseFloat(req.params.startTime);
		var endTime = parseFloat(req.params.endTime);
		var interval = parseFloat(req.params.interval);
		let metric = req.params.metric;
		let direction = parseInt(req.params.direction);
		if(endTime <= 0)
		{
			endTime = Date.now();
		}
		let startDate = new Date(startTime);
		let endDate = new Date(endTime);
		
		var stat = new Date();
		// Get Change
		MarketData.getMetricsChange({
			exchange: "nkr"
		}, startDate, endDate, interval, metric, direction).then( documents => {
			res.cjson({
				success: true, 
				metric: metric,
				dates: {
					startDate: startDate,
					endDate: endDate,
					interval: interval,
				},
				queryTime: ((Date.now() - stat.getTime()) / 1000),
				changes: documents
			});
		});
	}

	@CACHE(5)
	@GET("/getVolumeRankings/:startTime/:endTime/:interval/:metric/:direction")
	getVolumeRankings(req, res)
	{
		var startTime = parseFloat(req.params.startTime);
		var endTime = parseFloat(req.params.endTime);
		var interval = parseFloat(req.params.interval);
		var metric = req.params.metric;
		let direction = parseInt(req.params.direction);
		if(endTime <= 0)
		{
			endTime = Date.now();
		}
		let startDate = new Date(startTime);
		let endDate = new Date(endTime);
		
		var stat = new Date();
		// Get Change
		MarketData.getMetricsAvgTotals({
			exchange: "nkr"
		}, startDate, endDate, interval, "Volume", direction).then( documents => {
			res.cjson({
				success: true, 
				metric: metric,
				dates: {
					startDate: startDate,
					endDate: endDate,
					interval: interval,
				},
				queryTime: ((Date.now() - stat.getTime()) / 1000),
				rankings: documents
			});
		});
	}
};
