"use strict";

exports.__esModule = true;
exports.default = undefined;

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

var MentionsController = (_dec = Controller("/mentions"), _dec2 = POST("/feed/:lastDate"), _dec3 = GET("/getTrackers"), _dec4 = GET("/getTracker/:trackerId"), _dec5 = POST("/createTracker"), _dec6 = POST("/updateTracker/:trackerId"), _dec7 = GET("/deleteTracker/:trackerId"), _dec8 = GET("/getSources/:trackerId"), _dec9 = POST("/createSource/:trackerId"), _dec10 = POST("/updateSource/:sourceId"), _dec11 = GET("/deleteSource/:trackerId/:sourceId"), _dec12 = POST("/getMentions/:trackerId/:EntryTime/:Interval"), _dec13 = GET("/getTrackerData/:trackerId/:stepSize/:start/:end"), _dec14 = GET("/getMoment/:trackerId/:Moment/:Interval"), _dec15 = GET("/history/:trackerType"), _dec(_class = (_class2 = function () {
	function MentionsController() {
		(0, _classCallCheck3.default)(this, MentionsController);
	}

	MentionsController.prototype.feed = function feed(req, res) {
		var lastDate = req.params.lastDate;

		if (lastDate == 0) {
			lastDate = Date.now() + 3600 * 24000;
		}
		console.log("Params:", req.params);
		console.log("Body:", req.body);
		var filters = req.body.filters;
		if (!filters) {
			return res.error("No filters specified");
		}

		var aggregators = [{
			$match: {
				user: req.user._id
			}
		}];

		// Filter by date
		if (filters.date && filters.date.start && filters.date.end) {
			console.log("Aggregating in range:", filters.date);
			aggregators.push({
				$match: {
					date: {
						$gte: filters.date.start || lastDate,
						$lt: filters.date.end || lastDate
					}
				}
			});
		}

		// Filter by category
		if (filters.category) {
			console.log("Aggregating in range:", filters.date);
			aggregators.push({
				$match: {
					categories: { $in: [filters.category] }
				}
			});
		}

		// Reduce search & cursor by date
		aggregators.push({
			$match: {
				date: {
					$lt: lastDate
				}
			}
		});

		// Sort by date
		aggregators.push({
			$sort: {
				date: -1
			}
		});

		// filter by tracker
		if (filters.tracker) {
			aggregators.push({
				$match: {
					tracker: ObjectId(filters.tracker)
				}
			});
		}

		console.log("filters title:", filters.title);
		// Filter by title
		if (filters.title && filters.title.length > 0) {
			console.log("filters title:", filters.title);
			if (filters.title.startsWith("!")) {
				aggregators.push({
					$match: {
						title: {
							$not: new RegExp("/" + filters.title.substr(1) + "/"),
							$options: 'i'
						}
					}
				});
			} else {
				aggregators.push({
					$match: {
						title: {
							$regex: filters.title,
							$options: 'i'
						}
					}
				});
			}
		}

		if (filters.sentiment && filters.sentiment.start && filters.sentiment.end) {
			console.log("Sentiment filter:", filters.sentiment);
			aggregators.push({
				$match: {
					"sentiment.score": {
						$gte: filters.sentiment.start,
						$lte: filters.sentiment.end
					}
				}
			});
		}

		if (filters.source) {
			console.log("Source filter:", filters.source);
			aggregators.push({
				$match: {
					type: filters.source
				}
			});
		}

		// Limit search results
		aggregators.push({
			$limit: 50
		});

		console.log("Aggregating:", aggregators);
		Mentions.aggregate(aggregators).then(function (mentions) {
			console.log("Found:", mentions.length);
			res.json({ success: true, mentions: mentions });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	// Lists all tracking entries


	MentionsController.prototype.getTrackingEntries = function getTrackingEntries(req, res) {

		MentionTrackings.find({ user: req.user._id }).populate("sources").then(function (trackers) {
			res.json({ success: true, trackers: trackers });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	MentionsController.prototype.getTrackingEntry = function getTrackingEntry(req, res) {
		var trackerId = req.params.trackerId;
		MentionTrackings.findOne({ _id: trackerId, user: req.user._id }).then(function (tracking) {
			if (!tracking) {
				res.json({ success: false, message: "Mention not found" });
				return;
			}
			res.json({ success: true, tracker: tracking });
		});
	};

	// Adds a new tracking entry to the user


	MentionsController.prototype.createTrackingEntry = function createTrackingEntry(req, res) {
		var name = req.body.name;
		var tracking = req.body.tracking;

		// if(!UserQuota.validate(req.user, "mentions.trackers", 1))
		// {
		// 	return res.json({success: false, message: "Mention Tracker quota reached."});
		// }

		if (!tracking.required || !tracking.optional || !tracking.ignored) return res.json({ success: false, message: "Invalid request, missing tracking data" });

		if (tracking.required.length <= 0 && tracking.optional.length <= 0) {
			res.json({ success: false, message: "Please specify at least one required or optional word!" });
			return;
		}

		MentionTrackings.create({
			name: name,
			user: req.user._id,
			tracking: tracking,
			lastUpdated: 0,
			resetTracker: true,
			inQueue: true
		}).then(function (result) {
			UserQuota.update(req.user, "mentions.trackers", 1);
			res.json({ success: true, tracker: result });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	// Adds a new tracking entry to the user


	MentionsController.prototype.updateTrackingEntry = function updateTrackingEntry(req, res) {
		var trackerId = req.params.trackerId;
		var name = req.body.name;
		var tracking = req.body.tracking;

		if (!tracking.required || !tracking.optional || !tracking.ignored) return res.json({ success: false, message: "Invalid request, missing tracking data" });

		if (tracking.required.length <= 0 && tracking.optional.length <= 0) {
			return res.json({ success: false, message: "Please specify at least one required or optional word!" });
		}

		MentionTrackings.update({
			_id: trackerId,
			user: req.user._id
		}, {
			name: name,
			tracking: tracking,
			resetTracker: true,
			inQueue: true
		}).then(function (result) {
			res.json({ success: true });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	MentionsController.prototype.removeTrackingEntry = function removeTrackingEntry(req, res) {
		var trackerId = req.params.trackerId;

		MentionTrackings.findOne({ _id: trackerId, user: req.user._id }).then(function (MentionTracking) {
			if (!MentionTracking) {
				res.json({ success: false, message: "Mention not found" });
				return;
			}
			Mentions.remove({ tracker: MentionTracking._id });
			TrackingSites.remove({ _id: { $in: MentionTracking.sources }, user: req.user._id }).then(function (response) {
				UserQuota.update(req.user, "mentions.trackers", -1);
				MentionTracking.remove();
				res.json({ success: true });
			});
		});
	};

	MentionsController.prototype.getSources = function getSources(req, res) {
		var trackerId = req.params.trackerId;

		MentionTrackings.findOne({ _id: trackerId, user: req.user._id }).then(function (MentionTracking) {
			if (!MentionTracking) {
				res.json({ success: false, message: "Mention not found" });
				return;
			}
			TrackingSites.find({ _id: { $in: MentionTracking.sources } }).then(function (response) {
				res.json({ success: true, sources: response });
			});
		});
	};

	MentionsController.prototype.createSource = function createSource(req, res) {
		var source = req.body.source;
		var type = req.body.type;
		var trackerId = req.params.trackerId;

		MentionTrackings.findOne({ _id: trackerId, user: req.user._id }).then(function (MentionTracking) {
			if (!MentionTracking) {
				res.json({ success: false, message: "Mention not found" });
				return;
			}

			// if(!UserQuota.validateCustom(req.user, "mentions.sources", MentionTracking.sources.length + 1))
			// {
			// 	return res.json({success: false, message: "Mention Source quota reached."});
			// }

			TrackingSites.create({
				user: req.user._id,
				type: type,
				target: source.target,
				options: source.options
			}).then(function (result) {
				MentionTracking.inQueue = true;
				MentionTracking.resetTracker = true;
				MentionTracking.sources.push(result._id);
				MentionTracking.save();
				res.json({ success: true, source: result });
			}).catch(function (error) {
				res.serverError(error);
			});
		});
	};

	MentionsController.prototype.updateSource = function updateSource(req, res) {
		var sourceId = req.params.sourceId;
		var source = req.body.source;

		TrackingSites.update({
			_id: sourceId,
			user: req.user._id
		}, {
			target: source.target,
			options: source.options
		}).then(function (result) {
			res.json({ success: true });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	MentionsController.prototype.removeSource = function removeSource(req, res) {
		var trackerId = req.params.trackerId;
		var sourceId = req.params.sourceId;
		MentionTrackings.findOne({ _id: trackerId, user: req.user._id }).then(function (MentionTracking) {
			if (!MentionTracking) {
				res.json({ success: false, message: "Mention not found" });
				return;
			}

			TrackingSites.remove({
				_id: sourceId,
				user: req.user._id
			}).then(function () {

				MentionTracking.sources.pull(sourceId);
				MentionTracking.save();
				res.json({ success: true });
			}).catch(function (error) {
				res.serverError(error);
			});
		});
	};

	MentionsController.prototype.getMentions = function getMentions(req, res) {
		var scoring = [];
		res.json({ success: true, mentions: [] });
	};

	MentionsController.prototype.getTrackerData = function getTrackerData(req, res) {
		var trackerId = req.params.trackerId;
		var stepSize = Math.max(req.params.stepSize, 1) * 1000;
		var start = req.params.start * 1000;
		var end = req.params.end * 1000;

		if (ChartifyService.GetNumPoints(start, end, IntestepSizerval) > MAX_GRAPH_POINTS) return res.error("Date Range too large, please specify a smaller range!");

		var aggregators = [
		// Filter query by date & user
		{
			$match: {
				user: req.user._id,
				tracker: ObjectId(trackerId),
				date: {
					$gte: start,
					$lt: end
				}
			}
		}];

		aggregators.push(
		// Group by StepSize (Zoom Level)
		{
			$group: {
				_id: {
					date: {
						$subtract: [{
							$divide: ['$date', stepSize]
						}, {
							$mod: [{
								$divide: ['$date', stepSize]
							}, 1]
						}]
					}
				},
				count: {
					$sum: 1
				}
			}
		},
		// Format date & timestamp
		{
			$project: {
				timestamp: {
					$multiply: [stepSize, "$_id.date"]
				},
				count: "$count",
				date: {
					$add: [new Date(0), {
						$multiply: [stepSize, "$_id.date"]
					}]
				}
			}
		},
		// Sort by date
		{
			$sort: { "_id.date": 1 }
		}, {
			$project: {
				_id: 0,
				date: "$date",
				value: "$count",
				timestamp: "$timestamp"
			}
		});
		Mentions.aggregate(aggregators).then(function (results) {
			console.log("results:", results);
			res.json({ success: true, data: ChartifyService.Chartify(start, end, stepSize, results) });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	MentionsController.prototype.getMoment = function getMoment(req, res) {
		var trackerId = req.params.trackerId;
		var Moment = req.params.Moment;
		var Interval = req.params.Interval / 2;
		console.log("Aggregating queries:", trackerId, Moment, Interval);

		Mentions.aggregate([
		// Filter query by date & user
		{
			$match: {
				user: req.user._id,
				tracker: ObjectId(trackerId),
				date: {
					$gt: (Moment - Interval) * 1000,
					$lt: (Moment + Interval) * 1000
				}
			}
		},

		// Sort by date
		{
			$sort: { "_id.date": 1 }
		}, {
			$limit: 50
			// {
			// 	$project: {
			// 		_id: 0,
			// 		date: "$date",
			// 		value: "$count",
			// 		timestamp: "$timestamp",
			// 	},
			// },

		}]).then(function (results) {
			res.json({ success: true, mentions: results });
		}).catch(function (error) {
			res.serverError(error);
		});

		//return res.error("not implemented");
	};

	// Return the history of the trackings for the current user


	MentionsController.prototype.history = function history(req, res) {
		var trackerType = req.params.trackerType;
		if (trackerType == "Reddit") {
			RedditPosts.find().sort({ date: -1 }).limit(50).then(function (result) {
				res.json({ success: true, history: result });
			});
		}
	};

	return MentionsController;
}(), (_applyDecoratedDescriptor(_class2.prototype, "feed", [_dec2], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "feed"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getTrackingEntries", [_dec3], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getTrackingEntries"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getTrackingEntry", [_dec4], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getTrackingEntry"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "createTrackingEntry", [_dec5], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "createTrackingEntry"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "updateTrackingEntry", [_dec6], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "updateTrackingEntry"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "removeTrackingEntry", [_dec7], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "removeTrackingEntry"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getSources", [_dec8], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getSources"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "createSource", [_dec9], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "createSource"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "updateSource", [_dec10], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "updateSource"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "removeSource", [_dec11], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "removeSource"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getMentions", [_dec12], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getMentions"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getTrackerData", [_dec13], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getTrackerData"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getMoment", [_dec14], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getMoment"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "history", [_dec15], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "history"), _class2.prototype)), _class2)) || _class);
exports.default = MentionsController;
;