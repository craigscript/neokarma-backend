@Controller("/notifications")
class NotificationsController
{
	// Returns all the notifications settings for the current users
	@GET("/")
	index(req, res)
	{
		Notifications.find({
			user: req.user._id,
		}).sort({updatedAt: -1}).limit(50).then( notifications => {
			return res.json({success: true, notifications: notifications});
		}).catch( error => {
			res.serverError(error);
		});
		
	}

	@GET("/disable/:notificationId")
	disableNotification(req, res)
	{
		var notificationId = req.params.notificationId;
		Notifications.update({
			_id: notificationId,
			user: req.user._id,
		}, {
			status: "Disabled",
		}).then(() => {
			res.json({success: true});
		}).catch( error => {
			res.serverError(error);
		});
	}

	@GET("/dismiss/:notificationId")
	dissmissNotification(req, res)
	{
		var notificationId = req.params.notificationId;
		Notifications.update({
			_id: notificationId,
			user: req.user._id,
		}, {
			status: "Dismissed",
		}).then(() => {
			res.json({success: true});
		}).catch( error => {
			res.serverError(error);
		});
	}

	// @SOCK("/subscribe")
	// subscribe(client, body)
	// {
	// 	if(!client.subscriptions)
	// 		client.subscriptions = [];

	// 	client.subscriptions.push(body.subject);
	// 	client.emit("notification.status", {success: true, subscriptions: client.subscriptions});
	// }

	// @SOCK("/unsubscribe")
	// unsubscribe(client, body)
	// {
	// 	if(!client.subscriptions)
	// 	{
	// 		client.subscriptions=[];
	// 	}else{
	// 		client.subscriptions.splice(client.subscriptions.indexOf(body.subject));
	// 	}
	
	// 	client.emit("notification.status", {success: true, subscriptions: client.subscriptions});
	// }

	// @SOCK("/list")
	// getStatus(client, body)
	// {
	// 	client.emit("notification.status", {success: true, subscriptions: client.subscriptions});
	// }


};