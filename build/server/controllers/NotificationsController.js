"use strict";

var _getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _dec, _dec2, _dec3, _dec4, _class, _desc, _value, _class2;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
	var desc = {};
	Object['ke' + 'ys'](descriptor).forEach(function (key) {
		desc[key] = descriptor[key];
	});
	desc.enumerable = !!desc.enumerable;
	desc.configurable = !!desc.configurable;

	if ('value' in desc || desc.initializer) {
		desc.writable = true;
	}

	desc = decorators.slice().reverse().reduce(function (desc, decorator) {
		return decorator(target, property, desc) || desc;
	}, desc);

	if (context && desc.initializer !== void 0) {
		desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
		desc.initializer = undefined;
	}

	if (desc.initializer === void 0) {
		Object['define' + 'Property'](target, property, desc);
		desc = null;
	}

	return desc;
}

var NotificationsController = (_dec = Controller("/notifications"), _dec2 = GET("/"), _dec3 = GET("/disable/:notificationId"), _dec4 = GET("/dismiss/:notificationId"), _dec(_class = (_class2 = function () {
	function NotificationsController() {
		(0, _classCallCheck3.default)(this, NotificationsController);
	}

	NotificationsController.prototype.index = function index(req, res) {
		Notifications.find({
			user: req.user._id
		}).sort({ updatedAt: -1 }).limit(50).then(function (notifications) {
			return res.json({ success: true, notifications: notifications });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	NotificationsController.prototype.disableNotification = function disableNotification(req, res) {
		var notificationId = req.params.notificationId;
		Notifications.update({
			_id: notificationId,
			user: req.user._id
		}, {
			status: "Disabled"
		}).then(function () {
			res.json({ success: true });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	NotificationsController.prototype.dissmissNotification = function dissmissNotification(req, res) {
		var notificationId = req.params.notificationId;
		Notifications.update({
			_id: notificationId,
			user: req.user._id
		}, {
			status: "Dismissed"
		}).then(function () {
			res.json({ success: true });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

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


	return NotificationsController;
}(), (_applyDecoratedDescriptor(_class2.prototype, "index", [_dec2], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "index"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "disableNotification", [_dec3], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "disableNotification"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "dissmissNotification", [_dec4], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "dissmissNotification"), _class2.prototype)), _class2)) || _class);
;