"use strict";

var _getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _class, _desc, _value, _class2;

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

var NotificationsController = (_dec = Controller("/notificationtrackers"), _dec2 = GET("/getTrackers"), _dec3 = GET("/getTracker/:trackerId"), _dec4 = POST("/createTracker"), _dec5 = POST("/updateTracker/:trackerId"), _dec6 = GET("/deleteTracker/:trackerId"), _dec7 = GET("/testTarget/:trackerId/:targetId"), _dec8 = GET("/getUserSources"), _dec9 = GET("/getGlobalSources"), _dec10 = GET("/getMarketSources"), _dec(_class = (_class2 = function () {
	function NotificationsController() {
		(0, _classCallCheck3.default)(this, NotificationsController);
	}

	NotificationsController.prototype.getTrackers = function getTrackers(req, res) {
		NotificationTrackers.find({
			user: req.user._id
		}).then(function (trackers) {
			res.json({ success: true, trackers: trackers });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	// Returns a single notification tracker


	NotificationsController.prototype.getTracker = function getTracker(req, res) {
		var trackerId = req.params.trackerId;
		NotificationTrackers.findOne({
			_id: trackerId,
			user: req.user._id
		}).then(function (tracker) {
			if (!tracker) return res.error("Tracker not found");

			res.json({ success: true, tracker: tracker });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	NotificationsController.prototype.createTracker = function createTracker(req, res) {
		var tracker = req.body;
		if (!tracker.name) return res.error("Missing 'name' field");

		NotificationTrackers.create({
			name: tracker.name,
			user: req.user._id,
			rules: [],
			targets: [],
			status: 'Active',
			lastUpdated: Date.now()
		}).then(function (tracker) {
			res.json({ success: true, tracker: tracker });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	NotificationsController.prototype.updateTracker = function updateTracker(req, res) {
		var trackerId = req.params.trackerId;
		var tracker = req.body;

		// if(!tracker.name)
		// 	return res.error("Missing 'name' field");

		NotificationTrackers.update({
			_id: trackerId,
			user: req.user._id
		}, tracker).then(function (result) {

			if (!result) return res.error("Tracker not found.");

			res.json({ success: true });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	NotificationsController.prototype.deleteTracker = function deleteTracker(req, res) {
		var trackerId = req.params.trackerId;

		NotificationTrackers.remove({
			_id: trackerId,
			user: req.user._id
		}).then(function (result) {
			res.json({ success: true });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	NotificationsController.prototype.testTarget = function testTarget(req, res) {
		var trackerId = req.params.trackerId;
		var targetId = req.params.targetId;

		NotificationTrackers.find({
			_id: trackerId,
			user: req.user._id
		}).then(function (tracker) {

			if (!tracker) return res.error("Tracker not found");

			if (!tracker.targets[targetId]) return res.error("Target not found");

			// TODO: Call NotificationTracker Service and trigger a testing method

			res.json({ success: true });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	// Lists available sources for tracking


	NotificationsController.prototype.getUserSources = function getUserSources(req, res) {
		Trackers.find({
			user: req.user._id
		}).then(function (trackers) {
			res.json({ success: true, trackers: trackers });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	NotificationsController.prototype.getGlobalSources = function getGlobalSources(req, res) {
		Trackers.find({
			global: true
		}).then(function (trackers) {
			res.json({ success: true, trackers: trackers });
		}).catch(function (error) {
			res.serverError(error);
		});
		//return res.error("Not implemented");
		// Trackers.find({
		// 	user: req.user._id
		// }).then()
	};

	NotificationsController.prototype.getMarketSources = function getMarketSources(req, res) {
		return res.error("Not implemented");
		// Trackers.find({
		// 	user: req.user._id
		// }).then()
	};

	return NotificationsController;
}(), (_applyDecoratedDescriptor(_class2.prototype, "getTrackers", [_dec2], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getTrackers"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getTracker", [_dec3], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getTracker"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "createTracker", [_dec4], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "createTracker"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "updateTracker", [_dec5], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "updateTracker"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "deleteTracker", [_dec6], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "deleteTracker"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "testTarget", [_dec7], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "testTarget"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getUserSources", [_dec8], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getUserSources"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getGlobalSources", [_dec9], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getGlobalSources"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getMarketSources", [_dec10], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getMarketSources"), _class2.prototype)), _class2)) || _class);
;