import * as Markets from "glob:./Markets/*.js";

@Service
class MarketService
{
	static SMarkets = {};
	static create(marketName)
	{
		if(!Markets[marketName])
			return null;

		if(!MarketService.SMarkets[marketName])
		{
			MarketService.SMarkets[marketName] = new Markets[marketName]();
		}
		return MarketService.SMarkets[marketName];
	}

};
