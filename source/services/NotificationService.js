import * as NotificationMethods from "glob:./NotificationMethods/*.js";
import * as NotificationRules from "glob:./NotificationRules/*.js";

const TrackerInterval = 1;

@Service
class NotificationService
{
	_ticker = null;
	
	start()
	{
		this._ticker = setInterval(() => {
			this.updateTrackers();
			//this.test();
		}, 100);
		
	//	this.updateTrackers();
	}

	stop()
	{
		clearInterval(this._ticker);
	}

	updateTrackers()
	{
		NotificationTrackers.findOneAndUpdate({
			lastUpdated: { $lt: Date.now() - (5 * 1000) }
		},
		{
			lastUpdated: Date.now()
		}).then( tracker => {
			if(tracker)
			{
			//	console.log("[NotificationTracker] Found tracker:", tracker.name);
				this.executeTracker(tracker);
			}
			
			
		});
	}

	executeTracker(tracker)
	{
		if(tracker.triggerScheduled)
		{
			return this.trigger(tracker);
		}

		this.validateRules(tracker).then( (result) => 
		{
			if(!result)
				return;
				
			console.log("Validation success, scheduling for trigger:", result);
			// Schedule the tracker for trigger
			NotificationTrackers.update({
				_id: tracker._id,
			},
			{
				triggerScheduled: true,
			}).exec();
			this.trigger(tracker);
		}).catch(error => {
			console.log("error:", error);
		});
	}

	async validateRules(tracker)
	{
	//	console.log("validateRules to do :(.");
		return false;
		if(!tracker.rules.length)
			return false;
		
		for(let rule of tracker.rules)
		{
			let ruleMethod = new NotificationRules[rule.method](rule.options);
			let result = await ruleMethod.validate(tracker);
			if(!result)
			{
				console.log("Validation check failed:", result)
				return false;
			}
		}
		return true;
	}

	extractTracker(tracker, Interval, StartTime, EndTime)
	{
		let extractor = new TrackerService.TrackerExtractor(tracker);
		return extractor.getDataInRange(Interval, StartTime, EndTime, req.user);
	}

	extractSource(source, Interval, StartTime, EndTime)
	{
		let extractor = new TrackerService.SourceExtractor(source);
		return extractor.extractInRange(Interval, StartTime, EndTime, req.user);
	}

	trigger(tracker)
	{
		let timeOptions = tracker.triggerOptions;

		let now = new Date(Date.now() - (timeOptions.timezone * 60 * 60 * 1000));
		//console.log("Date:", now.getDate(), "Day num:", now.getDay(), "Hour num:", now.getHours(), "Now:", now.getTime(), "Time:", now.toString());
		
		// Min 5 minute notifications!
		let FiveMinTime = 60*5*1000;
		if(tracker.lastTriggered + FiveMinTime > now.getTime())
		{
			//console.log("[5 Mins] Seconds left:", new Date((tracker.lastTriggered + FiveMinTime) - now.getTime()).getTime() / 1000);
			//console.log("We gotta send this Hourly.");
			return;
		}

		let hourlyTime = (60*60*1000);
		// Check if daily notification is done?
		if(timeOptions.interval == "Hourly" && tracker.lastTriggered + hourlyTime > now.getTime())
		{
			//console.log("[Hourly] Seconds left:", new Date((tracker.lastTriggered + hourlyTime) - now.getTime()).getTime() / 1000);
			//console.log("We gotta send this Hourly.");
			return;
		}

		let dailyTime = (hourlyTime*24);
		// Check if daily notification is done?
		if(timeOptions.interval == "Daily" && tracker.lastTriggered + dailyTime > now.getTime())
		{
			//console.log("[Daily] Seconds left:", new Date((tracker.lastTriggered + dailyTime) - now.getTime()).getTime() / 1000);
			//console.log("We gotta send this Daily.");
			return;
		}
		let weeklyTime = (dailyTime*7);
		// Check if weekly notificaiton is done
		if(timeOptions.interval == "Weekly" && tracker.lastTriggered + weeklyTime > now.getTime())
		{
			//console.log("[Weekly] Seconds left:", new Date((tracker.lastTriggered + weeklyTime) - now.getTime()).getTime() / 1000);
			//console.log("We gotta send this Weekly.");
			return;
		}

		// Check if today is okay
		if(timeOptions.days && timeOptions.days.length && timeOptions.days.indexOf(now.getDay()) < 0)
		{
			//console.log("Today is not okay.");
			return;
		}

		// Check if the current hour is okay
		if(timeOptions.hours && timeOptions.hours.length && timeOptions.hours.indexOf(now.getHours()) < 0)
		{
			//console.log("This hour is not okay.", timeOptions.hours.indexOf(now.getHours()), timeOptions.hours);
			return;
		}

		//console.log("Sending notify for tracker:", tracker.name);

		for(let target of tracker.targets)
		{
			let notification = new NotificationMethods[target.type](target.options);
			notification.send(tracker);
		}

		NotificationTrackers.update({
			_id: tracker._id,
		},
		{
			triggerScheduled: false,
			//lastTriggered: now.getTime(),
		}).exec();
	}

};
// setTimeout(() => {
// 	let tracker = new NotificationService();
// 	tracker.start(TrackerInterval);
// }, 1000);

