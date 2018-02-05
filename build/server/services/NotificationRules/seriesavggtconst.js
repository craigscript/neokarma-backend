"use strict";

exports.__esModule = true;
exports.default = undefined;

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NTMethodGT = function () {
	function NTMethodGT(options) {
		(0, _classCallCheck3.default)(this, NTMethodGT);
		this.options = {};

		this.options = options;
	}

	NTMethodGT.prototype.extractMoment = function extractMoment(moment) {
		var _this = this;

		return new _promise2.default(function (resolve, reject) {

			var moment = _this.options.moment;
			if (moment.tracker) {
				Trackers.findOne({ _id: moment.tracker }).populate("sources").then(function (tracker) {
					var extractor = new TrackerService.TrackerExtractor(tracker);
					console.log("Tracker:", tracker);

					extractor.getDataInRange(moment.range * 1000, Date.now() - moment.time * 1000, Date.now()).then(function (result) {
						console.log("result:", result);
						if (!result.length) {
							return resolve(0);
						}

						result = result.map(function (item) {
							return item.value;
						});
						var total = result.reduce(function (a, b) {
							return a + b;
						});

						resolve(total / result.length);
					}).catch(function (error) {
						console.log("extractor error:", error);
						reject(error);
					});
				}).catch(function (error) {
					reject(error);
				});
			}
		});
	};

	NTMethodGT.prototype.validate = function validate(tracker) {
		var _this2 = this;

		return new _promise2.default(function (resolve, reject) {

			var moment = _this2.options.moment;
			var data = null;
			if (moment.tracker) {
				_this2.extractMoment(moment).then(function (data) {
					if (data > _this2.options.greaterThan) return resolve(true);
					reject(false);
				});
			}
		});
	};

	return NTMethodGT;
}();

exports.default = NTMethodGT;
;