var request = require("request");
var fs = require("fs");

var bittrexmarkets = require("./bittrex_json.json").result;
var markets = [];
var exchange = "bittrex";
var queries = ["getVolume", "getQuoteVolume", "getAverage", "getHigh", "getLow"];
var names = ["Volume", "Quote Volume", "Price", "High", "Low"];
for(var item of bittrexmarkets)
{
	var btmarket = item.Market;
	console.log(btmarket);
	let market = markets.find( item => {
		if(item.name == btmarket.BaseCurrency)
			return true;
	});

	if(!market)
	{
		market = {
			name: btmarket.BaseCurrency,
			currencies: [],
		};
		markets.push(market);
	}

	let currency = market.currencies.find( item => {
		if(item.icon == btmarket.MarketCurrency)
			return true;
	});

	if(!currency)
	{	
		currency = {
			name: market.name + " / " + btmarket.MarketCurrency,
			icon: btmarket.MarketCurrency,
			queries: [],
		};
	}else{
		continue;
	}
	
	var i=0;
	for(var query of queries)
	{
		currency.queries.push({
			
			name: market.name + " / " + btmarket.MarketCurrency + names[i],
			market: exchange,
			data: query,
			CurrencyA: market.name,
			CurrencyB: btmarket.BaseCurrency
		});
		++i;
	}

	market.currencies.push(currency);
	
}
var bittrexOutput = {
	name: "Bittrex",
	markets: markets,
};
//console.log(bittrex_json)
//request.get("https://bittrex.com/api/v2.0/pub/Markets/GetMarketSummaries?_=1506247165926").pipe(fs.createWriteStream('./bittrex_json.json'));

fs.writeFile("./bittrex.json", JSON.stringify(bittrexOutput, null, 4));