import * as Filters  from "glob:./market/*.js";
export default class MarketSource
{
	target = "";
	options = {};
	queryStream = [];


	constructor(target, options)
	{
		this.target = target;
		this.options = options;
		console.log("this.target:", this.target);
		console.log("this.options", this.options);
		// Apply sub reddit filter

	}

	extractInRange(Interval, StartTime, EndTime, User)
	{
		console.log("Aggeragating in range Interval:", Interval, StartTime, EndTime);
		return this.queryRange(Interval, StartTime, EndTime, User).then( data => {
			return data;
		});
	}
	
	applyFilters(filters = [])
	{

	}
	
	applyFilter(filters=[])
	{

		
	}

	queryRange(Interval, StartTime, EndTime, User)
	{
		let exchange = this.target;
		var dataType = this.options.query;
		var market = this.options.market;
		var currency = this.options.currency;
		
		console.log("MARKET QUERY: ", this.target, this.options)
		var marketInstance = MarketService.create(exchange);

		if(!marketInstance)
		{
			return Promise.reject("No such market");
		}

		if(!marketInstance.hasData(dataType))
		{
			return Promise.reject("No such market data");
		}

		return new Promise((resolve, reject) => {
			marketInstance[dataType](market, currency, StartTime, EndTime, Interval).then( marketVolume => {
				resolve(marketVolume);
			}).catch( error => {
				reject(error);
			});
		})
		
	}
	
};