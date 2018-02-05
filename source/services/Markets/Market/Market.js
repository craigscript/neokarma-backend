export default class Market
{
	hasData(dataType)
	{
		if(['getChartData', 'getVolume', 'getQuoteVolume', 'getOpen', 'getClose', 'getHigh', 'getLow', 'getAverage'].indexOf(dataType) >= 0)
			return true;
		return false;
	}

	getChartData(CurrencyA, CurrencyB, StartTime, EndTime, Interval = 300)
	{
		return Promise.reject("Not implemented");
	}

	getVolume(CurrencyA, CurrencyB, StartTime, EndTime, Interval = 300)
	{
		return Promise.reject("Not implemented");
	}

	getQuoteVolume(CurrencyA, CurrencyB, StartTime, EndTime, Interval = 300)
	{
		return Promise.reject("Not implemented");
	}

	getOpen(CurrencyA, CurrencyB, StartTime, EndTime, Interval = 300)
	{
		return Promise.reject("Not implemented");
	}

	getClose(CurrencyA, CurrencyB, StartTime, EndTime, Interval = 300)
	{
		return Promise.reject("Not implemented");
	}

	getHigh(CurrencyA, CurrencyB, StartTime, EndTime, Interval = 300)
	{
		return Promise.reject("Not implemented");
	}

	getLow(CurrencyA, CurrencyB, StartTime, EndTime, Interval = 300)
	{
		return Promise.reject("Not implemented");
	}

	getAverage(CurrencyA, CurrencyB, StartTime, EndTime, Interval = 300)
	{
		return Promise.reject("Not implemented");
	}
};