"use strict";

var _freeze = require("babel-runtime/core-js/object/freeze");

var _freeze2 = _interopRequireDefault(_freeze);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _class;

var _email = require("./NotificationMethods/email.js");

var _email2 = _interopRequireDefault(_email);

var _webhook = require("./NotificationMethods/webhook.js");

var _webhook2 = _interopRequireDefault(_webhook);

var _momentgtconst = require("./NotificationRules/momentgtconst.js");

var _momentgtconst2 = _interopRequireDefault(_momentgtconst);

var _momentltconst = require("./NotificationRules/momentltconst.js");

var _momentltconst2 = _interopRequireDefault(_momentltconst);

var _seriesavggtconst = require("./NotificationRules/seriesavggtconst.js");

var _seriesavggtconst2 = _interopRequireDefault(_seriesavggtconst);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NotificationMethods = {
	email: _email2.default,
	webhook: _webhook2.default
};
(0, _freeze2.default)(NotificationMethods);
var NotificationRules = {
	momentgtconst: _momentgtconst2.default,
	momentltconst: _momentltconst2.default,
	seriesavggtconst: _seriesavggtconst2.default
};
(0, _freeze2.default)(NotificationRules);


var TrackerInterval = 1;

var NotificationService = Service(_class = function () {
	function NotificationService() {
		(0, _classCallCheck3.default)(this, NotificationService);
		this._ticker = null;
	}

	NotificationService.prototype.start = function start() {
		var _this = this;

		this._ticker = setInterval(function () {
			_this.updateTrackers();
			//this.test();
		}, 100);

		//	this.updateTrackers();
	};

	NotificationService.prototype.stop = function stop() {
		clearInterval(this._ticker);
	};

	NotificationService.prototype.updateTrackers = function updateTrackers() {
		var _this2 = this;

		NotificationTrackers.findOneAndUpdate({
			lastUpdated: { $lt: Date.now() - 5 * 1000 }
		}, {
			lastUpdated: Date.now()
		}).then(function (tracker) {
			if (tracker) {
				//	console.log("[NotificationTracker] Found tracker:", tracker.name);
				_this2.executeTracker(tracker);
			}
		});
	};

	NotificationService.prototype.executeTracker = function executeTracker(tracker) {
		var _this3 = this;

		if (tracker.triggerScheduled) {
			return this.trigger(tracker);
		}

		this.validateRules(tracker).then(function (result) {
			if (!result) return;

			console.log("Validation success, scheduling for trigger:", result);
			// Schedule the tracker for trigger
			NotificationTrackers.update({
				_id: tracker._id
			}, {
				triggerScheduled: true
			}).exec();
			_this3.trigger(tracker);
		}).catch(function (error) {
			console.log("error:", error);
		});
	};

	NotificationService.prototype.validateRules = function () {
		var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(tracker) {
			var _iterator, _isArray, _i, _ref2, rule, ruleMethod, result;

			return _regenerator2.default.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							return _context.abrupt("return", false);

						case 3:
							_iterator = tracker.rules, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);

						case 4:
							if (!_isArray) {
								_context.next = 10;
								break;
							}

							if (!(_i >= _iterator.length)) {
								_context.next = 7;
								break;
							}

							return _context.abrupt("break", 24);

						case 7:
							_ref2 = _iterator[_i++];
							_context.next = 14;
							break;

						case 10:
							_i = _iterator.next();

							if (!_i.done) {
								_context.next = 13;
								break;
							}

							return _context.abrupt("break", 24);

						case 13:
							_ref2 = _i.value;

						case 14:
							rule = _ref2;
							ruleMethod = new NotificationRules[rule.method](rule.options);
							_context.next = 18;
							return ruleMethod.validate(tracker);

						case 18:
							result = _context.sent;

							if (result) {
								_context.next = 22;
								break;
							}

							console.log("Validation check failed:", result);
							return _context.abrupt("return", false);

						case 22:
							_context.next = 4;
							break;

						case 24:
							return _context.abrupt("return", true);

						case 25:
						case "end":
							return _context.stop();
					}
				}
			}, _callee, this);
		}));

		function validateRules(_x) {
			return _ref.apply(this, arguments);
		}

		return validateRules;
	}();

	NotificationService.prototype.extractTracker = function extractTracker(tracker, Interval, StartTime, EndTime) {
		var extractor = new TrackerService.TrackerExtractor(tracker);
		return extractor.getDataInRange(Interval, StartTime, EndTime, req.user);
	};

	NotificationService.prototype.extractSource = function extractSource(source, Interval, StartTime, EndTime) {
		var extractor = new TrackerService.SourceExtractor(source);
		return extractor.extractInRange(Interval, StartTime, EndTime, req.user);
	};

	NotificationService.prototype.trigger = function trigger(tracker) {
		var timeOptions = tracker.triggerOptions;

		var now = new Date(Date.now() - timeOptions.timezone * 60 * 60 * 1000);
		//console.log("Date:", now.getDate(), "Day num:", now.getDay(), "Hour num:", now.getHours(), "Now:", now.getTime(), "Time:", now.toString());

		// Min 5 minute notifications!
		var FiveMinTime = 60 * 5 * 1000;
		if (tracker.lastTriggered + FiveMinTime > now.getTime()) {
			//console.log("[5 Mins] Seconds left:", new Date((tracker.lastTriggered + FiveMinTime) - now.getTime()).getTime() / 1000);
			//console.log("We gotta send this Hourly.");
			return;
		}

		var hourlyTime = 60 * 60 * 1000;
		// Check if daily notification is done?
		if (timeOptions.interval == "Hourly" && tracker.lastTriggered + hourlyTime > now.getTime()) {
			//console.log("[Hourly] Seconds left:", new Date((tracker.lastTriggered + hourlyTime) - now.getTime()).getTime() / 1000);
			//console.log("We gotta send this Hourly.");
			return;
		}

		var dailyTime = hourlyTime * 24;
		// Check if daily notification is done?
		if (timeOptions.interval == "Daily" && tracker.lastTriggered + dailyTime > now.getTime()) {
			//console.log("[Daily] Seconds left:", new Date((tracker.lastTriggered + dailyTime) - now.getTime()).getTime() / 1000);
			//console.log("We gotta send this Daily.");
			return;
		}
		var weeklyTime = dailyTime * 7;
		// Check if weekly notificaiton is done
		if (timeOptions.interval == "Weekly" && tracker.lastTriggered + weeklyTime > now.getTime()) {
			//console.log("[Weekly] Seconds left:", new Date((tracker.lastTriggered + weeklyTime) - now.getTime()).getTime() / 1000);
			//console.log("We gotta send this Weekly.");
			return;
		}

		// Check if today is okay
		if (timeOptions.days && timeOptions.days.length && timeOptions.days.indexOf(now.getDay()) < 0) {
			//console.log("Today is not okay.");
			return;
		}

		// Check if the current hour is okay
		if (timeOptions.hours && timeOptions.hours.length && timeOptions.hours.indexOf(now.getHours()) < 0) {
			//console.log("This hour is not okay.", timeOptions.hours.indexOf(now.getHours()), timeOptions.hours);
			return;
		}

		//console.log("Sending notify for tracker:", tracker.name);

		for (var _iterator2 = tracker.targets, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator3.default)(_iterator2);;) {
			var _ref3;

			if (_isArray2) {
				if (_i2 >= _iterator2.length) break;
				_ref3 = _iterator2[_i2++];
			} else {
				_i2 = _iterator2.next();
				if (_i2.done) break;
				_ref3 = _i2.value;
			}

			var target = _ref3;

			var notification = new NotificationMethods[target.type](target.options);
			notification.send(tracker);
		}

		NotificationTrackers.update({
			_id: tracker._id
		}, {
			triggerScheduled: false
			//lastTriggered: now.getTime(),
		}).exec();
	};

	return NotificationService;
}()) || _class;

;
// setTimeout(() => {
// 	let tracker = new NotificationService();
// 	tracker.start(TrackerInterval);
// }, 1000);