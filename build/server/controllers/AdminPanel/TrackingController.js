"use strict";

var _getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _dec, _dec2, _dec3, _dec4, _dec5, _class, _desc, _value, _class2;

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

var TrackingController = (_dec = Controller("/admin/tracking"), _dec2 = GET("/list/:type"), _dec3 = POST("/create"), _dec4 = GET("/destroy/:trackingId"), _dec5 = GET("/history/:trackerType"), _dec(_class = (_class2 = function () {
	function TrackingController() {
		(0, _classCallCheck3.default)(this, TrackingController);
	}

	TrackingController.prototype.list = function list(req, res) {
		var type = req.params.type;

		TrackingSites.find({ type: type, user: req.user._id }).then(function (result) {
			res.json({ success: true, trackings: result });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	// Adds a new tracking entry to the user


	TrackingController.prototype.createTracking = function createTracking(req, res) {
		var tracking = req.body.tracking;
		TrackingSites.create({ type: tracking.type, user: req.user._id, target: tracking.target }).then(function (result) {
			res.json({ success: true, tracking: result });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	TrackingController.prototype.destroyTracking = function destroyTracking(req, res) {
		var trackingId = req.params.trackingId;
		TrackingSites.remove({
			_id: trackingId,
			user: req.user._id
		}).then(function () {
			res.json({ success: true });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	// Return the history of the trackings for the current user


	TrackingController.prototype.history = function history(req, res) {
		var trackerType = req.params.trackerType;
		if (trackerType == "reddit") {
			RedditPosts.find().sort({ date: -1 }).limit(50).then(function (result) {
				res.json({ success: true, history: result });
			});
		}
	};

	return TrackingController;
}(), (_applyDecoratedDescriptor(_class2.prototype, "list", [_dec2], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "list"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "createTracking", [_dec3], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "createTracking"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "destroyTracking", [_dec4], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "destroyTracking"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "history", [_dec5], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "history"), _class2.prototype)), _class2)) || _class);
;