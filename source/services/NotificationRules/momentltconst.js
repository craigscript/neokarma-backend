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
					let extractor = new TrackerService.TrackerExtractor();
					console.log("Moment:", moment);
					//reject("Yolo");
					resolve(5000);
					// extractor.getMoment(Date.now() - moment.time, moment.range).then( result => {
					// 	resolve(result);
					// }).catch( error=> {
					// 	reject(error);
					// });
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
					if(data < this.options.greaterThan)
						return resolve(true);
					reject(false);
				});
			}
		});
		
	}

};