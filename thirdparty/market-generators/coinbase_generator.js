var request = require("request");
var fs = require("fs");

var coinbaseproducts = require("./coinbase_json.json");

var exchangename = "Coinbase (GDAX)";
var exchange = "coinbase";
var querytags = ["getVolume", "getVolumeDaily", "getAverage", "getHigh", "getLow", "getOpen", "geClose", "getChange"];
var querynames = ["Volume", "Daily Volume", "Price", "High", "Low", "Open", "Close", "Change"];
var queries = {};
var markets = {};
var i=0;
for(var query of querytags)
{
	queries[query] = querynames[i];
	++i;
}

for(var cbmarket of coinbaseproducts)
{
	if(!markets[cbmarket.base_currency])
	{
		markets[cbmarket.base_currency] = {
			name: cbmarket.base_currency,
			currencies: {},
		};
	}


	if(!markets[cbmarket.base_currency].currencies[cbmarket.quote_currency])
	{	
		markets[cbmarket.base_currency].currencies[cbmarket.quote_currency] = {
			name: cbmarket.base_currency + " / " + cbmarket.quote_currency,
			icon: cbmarket.quote_currency,
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

fs.writeFile("./coinbase.json", JSON.stringify(output, null, 4));