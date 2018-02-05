var request = require("request");
var fs = require("fs");

request("https://poloniex.com/public?command=returnTicker", function (error, response, body)
{


	var poloniextickers = JSON.parse(body);
	var exchange = "poloniex";
	var exchangename = "Poloniex";
	var querytags = ["getVolume", "getQuoteVolume", "getAverage", "getHigh", "getLow"];
	var querynames = ["Volume", "Quote Volume", "Price", "High", "Low"];
	var queries = {};
	var markets = {};
	var i=0;
	for(var query of querytags)
	{
		queries[query] = querynames[i];
		++i;
	}

	for(var name in poloniextickers)
	{
		var ticker = poloniextickers[name];
		var sp = name.split("_");
		var marketName = sp[0];
		var quoteName = sp[1];


		if(!markets[marketName])
		{
			markets[marketName] = {
				name: marketName,
				currencies: {},
			};
		}

		if(!markets[marketName].currencies[name])
		{	
			markets[marketName].currencies[quoteName] = {
				name: marketName + " / " + quoteName,
				icon: quoteName,
			};
		}
	}
	
	var output = {
		name: exchangename,
		markets: markets,
		queries: queries,
	};

	fs.writeFile("./poloniex.json", JSON.stringify(output, null, 4));

});