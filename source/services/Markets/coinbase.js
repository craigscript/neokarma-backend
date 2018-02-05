const util = require('util')

import Market from "./Market/Market";
export default class CoinbaseMarket extends Market
{
	constructor()
	{
		super();
	}
	
	// "getVolume": "Volume",
	// "getQuoteVolume": "Quote Volume",
	// "getAverage": "Price",
	// "getHigh": "High",
	// "getLow": "Low"

	buildQuery(Interval, StartTime, EndTime, Market, Currency, SumMethod, GroupMethod = {})
	{
		var queries = [];
		queries.push({
			$match: {
				date: {
					$gte: StartTime * 1000,
					$lt: EndTime * 1000
				},
				MarketName: [Market, Currency].join("_"),
			}
		});

		// Group by StepSize (Zoom Level)
		queries.push({
			$group: {
				_id: Object.assign({
					timestamp: {
						$subtract: [
						{
							$divide: [ '$date', Interval * 1000]
						},
						{
							$mod: [
							{
								$divide: ['$date', Interval * 1000]
							}, 1]
						}]
					}
				}, GroupMethod),
				value: SumMethod
			}
		});


		// Format date & timestamp
		queries.push({
			$project: {
				_id: 0,
				timestamp: {
					$multiply: [Interval * 1000, "$_id.timestamp"]
				},
				value: "$value",
				date: {
					$add: [new Date(0), {
						$multiply: [Interval * 1000, "$_id.timestamp"],
					}],
				}
			}
		});

		// Sort by date
		queries.push({
			$sort: { "_id.timestamp": 1 }
		});
		return queries;
	}

	getVolume(Market, Currency, StartTime, EndTime, Interval = 300)
	{
		let queries = this.buildQuery(Interval, StartTime, EndTime, Market, Currency, { $avg: "$Volume" });
		return CoinbaseCandles.aggregate(queries);
	}

	getVolumeDaily(Market, Currency, StartTime, EndTime, Interval = 300)
	{
		let queries = this.buildQuery(Interval, StartTime, EndTime, Market, Currency, { $avg: "$Volume30Day" });
		return CoinbaseCandles.aggregate(queries);
	}

	getAverage(Market, Currency, StartTime, EndTime, Interval = 300)
	{
		let queries = this.buildQuery(Interval, StartTime, EndTime, Market, Currency, { $avg: "$Price" });
		return CoinbaseCandles.aggregate(queries);
	}
	
	getHigh(Market, Currency, StartTime, EndTime, Interval = 300)
	{
		let queries = this.buildQuery(Interval, StartTime, EndTime, Market, Currency, { $avg: "$High" });
		return CoinbaseCandles.aggregate(queries);
	}

	getLow(Market, Currency, StartTime, EndTime, Interval = 300)
	{
		let queries = this.buildQuery(Interval, StartTime, EndTime, Market, Currency, { $avg: "$Low" });
		return CoinbaseCandles.aggregate(queries);
	}

	getOpen(Market, Currency, StartTime, EndTime, Interval = 300)
	{
		let queries = this.buildQuery(Interval, StartTime, EndTime, Market, Currency, { $avg: "$Open" });
		return CoinbaseCandles.aggregate(queries);
	}

	getClose(Market, Currency, StartTime, EndTime, Interval = 300)
	{
		let queries = this.buildQuery(Interval, StartTime, EndTime, Market, Currency, { $avg: "$Close" });
		return CoinbaseCandles.aggregate(queries);
	}

	getChange(Market, Currency, StartTime, EndTime, Interval = 300)
	{
		let queries = this.buildQuery(Interval, StartTime, EndTime, Market, Currency, { $avg: { $subtract: ["$Close", "$Open"]} });
		return CoinbaseCandles.aggregate(queries);
	}
};