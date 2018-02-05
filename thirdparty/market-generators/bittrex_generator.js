var request = require("request");
var fs = require("fs");

var bittrexmarkets = require("./bittrex_json.json").result;

var exchangename = "Bittrex";
var exchange = "bittrex";
var querytags = ["getVolume", "getQuoteVolume", "getAverage", "getHigh", "getLow"];
var querynames = ["Volume", "Quote Volume", "Price", "High", "Low"];
var markets = {};
var queries = {};

var i=0;
for(var query of querytags)
{
	queries[query] = querynames[i];
	++i;
}

for(var item of bittrexmarkets)
{
	var btmarket = item.Market;
	console.log(btmarket);

	if(!markets[btmarket.BaseCurrency])
	{
		markets[btmarket.BaseCurrency] = {
			name: btmarket.BaseCurrency,
			currencies: {},
		};
	}

	if(!markets[btmarket.BaseCurrency].currencies[btmarket.MarketCurrency])
	{	
		markets[btmarket.BaseCurrency].currencies[btmarket.MarketCurrency] = {
			name: btmarket.BaseCurrency + " / " + btmarket.MarketCurrency,
			icon: btmarket.MarketCurrency,
		};
	}
	
	

	
	
}
var output = {
	name: exchangename,
	markets: markets,
	queries: queries,
};
//console.log(bittrex_json)
//request.get("https://bittrex.com/api/v2.0/pub/Markets/GetMarketSummaries?_=1506247165926").pipe(fs.createWriteStream('./bittrex_json.json'));

fs.writeFile("./bittrex.json", JSON.stringify(output, null, 4));