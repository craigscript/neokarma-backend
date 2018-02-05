export default class NTMethodGT
{
	options = {};
	constructor(options)
	{
		this.options = options;
	}

	extractMoment(moment)
	{
		return new Promise((resolve, reject) => {

			let moment = this.options.moment;
			if(moment.tracker)
			{
				Trackers.findOne({_id: moment.tracker}).populate("sources").then( tracker => {
					let extractor = new TrackerService.TrackerExtractor(tracker);
					console.log("Tracker:", tracker);
				
					extractor.getDataInRange(moment.range *1000, Date.now() - (moment.time*1000), Date.now()).then( result => {
						console.log("result:", result);
						if(!result.length)
						{
							return resolve(0);
						}

						result = result.map( (item) => {
							return item.value;
						});
						let total = result.reduce((a, b) => {
							return a + b;
						});
						
						resolve(total / result.length);
					}).catch( error=> {
						console.log("extractor error:", error);
					 	reject(error);
					 });
				}).catch( error=> {
					reject(error);
				});
			}
		});
	}

	validate(tracker)
	{
		
		
		return new Promise((resolve, reject) => {

			let moment = this.options.moment;
			let data = null;
			if(moment.tracker)
			{
				this.extractMoment(moment).then( data => {
					if(data > this.options.greaterThan)
						return resolve(true);
					reject(false);
				});
			}
		});
		
	}

};