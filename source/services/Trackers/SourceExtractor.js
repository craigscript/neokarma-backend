import * as Extractors from "glob:./sources/*.js";
import * as Actions from "glob:./actions/*.js";

//var LPF = require("lpf");


export default class SourceExtractor
{
	extractor = null;
	actions = [];
	constructor(source)
	{
		if(Extractors[source.type])
		{
			this.actions = source.actions;
			console.log("Creating source extractor:", source.type, Extractors);
			this.source = new Extractors[source.type](source.target, source.options);
			this.source.applyFilters(source.filters);
		}
	}

	extractInRange(Interval, StartTime, EndTime)
	{
		if(!this.source)
		{
			return Promise.reject("Invalid source defined.");
		}
		
		return this.source.extractInRange(Interval, StartTime, EndTime).then( data => {
			return this.performActions(data);
		});
	}
	
	performActions(data = [])
	{
		for(var action of this.actions)
		{
			if(!Actions[action.name])
				continue;

			data = Actions[action.name](data, action.data)
		}
		return data;
	}
};