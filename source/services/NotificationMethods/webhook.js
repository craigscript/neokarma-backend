var request = require("request");
export default class WebhookNotification
{
	WebhookURL = null;
	requestMethod = "GET";
	methods = {
		GET: request.get,
		POST: request.post,
		PUT: request.put,
		DELETE: request.delete,
	}
	constructor(options)
	{
		this.WebhookURL = options.url;
		this.requestMethod = options.method;
	}

	send(tracker)
	{
		if(!this.WebhookURL)
		{
			return Promise.reject("No webhook defined.");
		}
		return new Promise((resolve, reject) => {
			this.methods[this.requestMethod](this.WebhookURL, (error, response, body) => {
				if(error)
				{
					return reject(error);
				}
				resolve();
			});
			console.log("[Tracker Notify] Webhook sent:", this.WebhookURL);
		});
		
	}
};