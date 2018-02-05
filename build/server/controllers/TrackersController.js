"use strict";

var _getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _class, _desc, _value, _class2;

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

var TrackersController = (_dec = Controller("/trackers"), _dec2 = GET("/getTrackers"), _dec3 = GET("/getGlobalTrackers"), _dec4 = GET("/getTracker/:trackerId"), _dec5 = POST("/updateTracker/:trackerId"), _dec6 = POST("/updateTrackerData/:trackerId"), _dec7 = POST("/createTracker"), _dec8 = GET("/deleteTracker/:trackerId"), _dec9 = GET("/getSource/:trackerId/:sourceId"), _dec10 = POST("/createSource/:trackerId"), _dec11 = POST("/updateSource/:trackerId/:sourceId"), _dec12 = POST("/updateSourceData/:sourceId"), _dec13 = GET("/deleteSource/:trackerId/:sourceId"), _dec14 = GET("/getTrackerData/:trackerId/:Interval/:StartTime/:EndTime"), _dec15 = GET("/getSourceData/:trackerId/:sourceId/:Interval/:StartTime/:EndTime"), _dec(_class = (_class2 = function () {
	function TrackersController() {
		(0, _classCallCheck3.default)(this, TrackersController);
	}

	TrackersController.prototype.getTrackers = function getTrackers(req, res) {
		Trackers.find({ user: req.user._id }).populate("sources").then(function (trackers) {
			res.json({ success: true, trackers: trackers });
		});
	};

	TrackersController.prototype.getGlobalTrackers = function getGlobalTrackers(req, res) {
		Trackers.find({ global: true }).populate("sources").then(function (trackers) {
			res.json({ success: true, trackers: trackers });
		});
	};

	TrackersController.prototype.getTracker = function getTracker(req, res) {
		Trackers.findOne({ _id: req.params.trackerId, user: req.user._id }).populate("sources").then(function (tracker) {
			if (!tracker) {
				res.json({ success: false, message: "Tracker not found" });
				return;
			}
			res.json({ success: true, tracker: tracker });
		});
	};

	TrackersController.prototype.updateTracker = function updateTracker(req, res) {
		var trackerId = req.params.trackerId;
		var name = req.body.name;
		Trackers.update({
			_id: trackerId,
			user: req.user._id
		}, {
			name: name
		}).then(function (result) {
			res.json({ success: true });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	TrackersController.prototype.updateTrackerData = function updateTrackerData(req, res) {
		var trackerId = req.params.trackerId;
		var exporters = req.body.exporters;
		Trackers.update({
			_id: trackerId,
			user: req.user._id
		}, {
			exporters: exporters
		}).then(function (result) {
			res.json({ success: true });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	TrackersController.prototype.createTracker = function createTracker(req, res) {
		var name = req.body.name;
		// var sources = req.body.sources;
		// var filters = req.body.filters;
		// var status = req.body.status;

		Trackers.create({
			name: name,
			user: req.user
		}).then(function (result) {
			res.json({ success: true, tracker: result });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	TrackersController.prototype.deleteTracker = function deleteTracker(req, res) {
		var trackerId = req.params.trackerId;
		Trackers.remove({
			_id: trackerId,
			user: req.user._id
		}).then(function () {
			res.json({ success: true });
		});
	};

	TrackersController.prototype.getSource = function getSource(req, res) {
		var sourceId = req.params.sourceId;
		TrackerSources.findOne({ _id: sourceId, user: req.user._id }).then(function (source) {
			res.json({ success: true, source: source });
		});
	};

	TrackersController.prototype.createSource = function createSource(req, res) {
		var trackerId = req.params.trackerId;
		var name = req.body.name;
		var type = req.body.type;
		var target = req.body.target;
		var options = req.body.options;

		Trackers.findOne({ _id: trackerId, user: req.user._id }).then(function (tracker) {

			if (!tracker) return res.json({ success: false, message: "No such tracker" });

			TrackerSources.create({
				user: req.user._id,
				name: name,
				type: type,
				target: target,
				options: options
			}).then(function (source) {

				tracker.sources.push(source._id);
				tracker.save();

				if (tracker.type == 'reddit' || tracker.type == 'website') {
					TrackingSites.create({
						type: type,
						user: req.user._id,
						target: target,
						options: options
					}).then(function (trackingSite) {
						source.trackingSite = trackingSite._id;
						source.save();
					});
				}

				res.json({ success: true, source: source });
			}).catch(function (error) {
				res.serverError(error);
			});
		});
	};

	TrackersController.prototype.updateSource = function updateSource(req, res) {
		var trackerId = req.params.trackerId;
		var sourceId = req.params.sourceId;
		var name = req.body.name;
		var target = req.body.target;
		var options = req.body.options;

		TrackerSources.findOne({
			_id: sourceId,
			user: req.user._id
		}).then(function (source) {

			source.name = name;
			source.target = target;
			source.options = options;
			source.save();

			if (source.trackingSite) {
				TrackingSites.update({
					_id: source.trackingSite
				}, {
					target: target,
					options: options
				}).exec();
			}
			res.json({ success: true });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	TrackersController.prototype.updateSourceData = function updateSourceData(req, res) {
		var sourceId = req.params.sourceId;
		var filters = req.body.filters || [];
		var actions = req.body.actions || [];

		TrackerSources.update({
			_id: sourceId,
			user: req.user._id
		}, {
			filters: filters,
			actions: actions
		}).then(function (result) {
			res.json({ success: true });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	TrackersController.prototype.deleteSource = function deleteSource(req, res) {
		var trackerId = req.params.trackerId;
		var sourceId = req.params.sourceId;

		Trackers.findOne({ _id: trackerId, user: req.user._id }).then(function (tracker) {

			if (!tracker) return res.json({ success: false, message: "No such tracker" });

			TrackerSources.findOne({
				_id: sourceId,
				user: req.user._id
			}).then(function (source) {

				if (!source) return res.json({ success: false, message: "No such source." });

				TrackerSources.remove({
					_id: sourceId,
					user: req.user._id
				}).then(function (result) {

					if (source.trackingSite) {
						TrackingSites.remove({
							_id: source.trackingSite
						}).exec();
					}

					tracker.sources.pull(sourceId);
					tracker.save();
					res.json({ success: true });
				}).catch(function (error) {
					res.serverError(error);
				});
			});
		});
	};

	TrackersController.prototype.getTrackerData = function getTrackerData(req, res) {
		var trackerId = req.params.trackerId;
		var Interval = parseInt(req.params.Interval);
		var StartTime = parseInt(req.params.StartTime);
		var EndTime = parseInt(req.params.EndTime);

		if (ChartifyService.GetNumPoints(StartTime, EndTime, Interval) > MAX_GRAPH_POINTS) return res.error("Date Range too large, please specify a smaller range!");

		Trackers.findOne({ _id: trackerId, $or: [{ user: req.user._id }, { global: true }] }).populate("sources").then(function (tracker) {
			if (!tracker) {
				return res.json({ success: false, message: "Tracker not found." });
			}

			var extractor = new TrackerService.TrackerExtractor(tracker);
			extractor.getDataInRange(Interval, StartTime, EndTime).then(function (result) {
				res.json({ success: true, data: result });
			}).catch(function (error) {
				res.json({ success: false, message: error });
			});
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	TrackersController.prototype.getSourceData = function getSourceData(req, res) {
		var trackerId = req.params.trackerId;
		var sourceId = req.params.sourceId;
		var Interval = parseInt(req.params.Interval);
		var StartTime = parseInt(req.params.StartTime);
		var EndTime = parseInt(req.params.EndTime);

		if (ChartifyService.GetNumPoints(StartTime, EndTime, Interval) > MAX_GRAPH_POINTS) return res.error("Date Range too large, please specify a smaller range!");

		Trackers.findOne({ _id: trackerId, $or: [{ user: req.user._id }, { global: true }] }).then(function (tracker) {

			if (!tracker) {
				return res.json({ success: false, message: "Tracker not found." });
			}

			TrackerSources.findOne({ _id: sourceId }).then(function (source) {
				if (!source) {
					return res.json({ success: false, message: "Source not found." });
				}

				var extractor = new TrackerService.SourceExtractor(source);
				extractor.extractInRange(Interval, StartTime, EndTime).then(function (result) {
					res.json({ success: true, data: result });
				}).catch(function (error) {
					res.json({ success: false, message: error });
				});
			}).catch(function (error) {
				res.serverError(error);
			});
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	return TrackersController;
}(), (_applyDecoratedDescriptor(_class2.prototype, "getTrackers", [_dec2], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getTrackers"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getGlobalTrackers", [_dec3], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getGlobalTrackers"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getTracker", [_dec4], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getTracker"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "updateTracker", [_dec5], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "updateTracker"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "updateTrackerData", [_dec6], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "updateTrackerData"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "createTracker", [_dec7], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "createTracker"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "deleteTracker", [_dec8], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "deleteTracker"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getSource", [_dec9], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getSource"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "createSource", [_dec10], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "createSource"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "updateSource", [_dec11], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "updateSource"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "updateSourceData", [_dec12], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "updateSourceData"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "deleteSource", [_dec13], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "deleteSource"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getTrackerData", [_dec14], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getTrackerData"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getSourceData", [_dec15], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getSourceData"), _class2.prototype)), _class2)) || _class);
;