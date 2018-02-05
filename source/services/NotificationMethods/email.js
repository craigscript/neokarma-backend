export default class EmailNotification
{
	constructor(options)
	{
		
	}

	send(tracker)
	{
		console.log("[Tracker Notify] Email Notification Sent:", tracker.name);
	}
};