var request = require("request");
var fs = require("fs");

var coinmarketcap_tickers = require("./coinmarketcap_json.json");
var converts = ["USD", "BTC"];
var exchangename = "Coinmarketcap";
var exchange = "coinmarketcap";
var querytags = ["getPrice", "getMarketCap", "getSupply", "getRank", "getChangeH", "getChangeD"];
var querynames = ["Price", "Marketcap", "Supply", "Rank", "Change Hourly", "Change Daily"];
var queries = {};
var markets = {};
var i=0;
for(var query of querytags)
{
	queries[query] = querynames[i];
	++i;
}

for(var convert of converts)
{
	var limit = 200;
	var count = 0;

	
	if(!markets[convert])
	{
		markets[convert] = {
			name: convert,
			currencies: {},
		};
	}

	for(var cmpmarket of coinmarketcap_tickers)
	{
		if(convert == cmpmarket.symbol)
			continue;

		if(!markets[convert].currencies[cmpmarket.symbol])
		{	
			markets[convert].currencies[cmpmarket.symbol] = {
				name: convert + " / " + cmpmarket.symbol,
				icon: cmpmarket.symbol,
			};
		}

		++count;
		if(count > limit)
			break;
	}

}
var output = {
	name: exchangename,
	markets: markets,
	queries: queries,
};
//console.log(bittrex_json)
//request.get("https://bittrex.com/api/v2.0/pub/Markets/GetMarketSummaries?_=1506247165926").pipe(fs.createWriteStream('./bittrex_json.json'));

fs.writeFile("./coinmarketcap.json", JSON.stringify(output, null, 4));