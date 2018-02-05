import * as MarketList from "glob:./markets/*.json";
import fs from "fs";
export default class MarketSource
{
	getSourceOptions(req, res)
	{
		// var exchanges = [];
		// console.log(Object.keys(ExchangesData));
		// for(let exchangeName in ExchangesData)
		// {
		// 	exchanges.push(ExchangesData[exchangeName]);
		// }
		return res.json({success: true, exchanges: MarketList});
		
	}
}