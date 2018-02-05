"use strict";

exports.__esModule = true;
exports.default = undefined;

var _freeze = require("babel-runtime/core-js/object/freeze");

var _freeze2 = _interopRequireDefault(_freeze);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _market = require("./sources/market.js");

var _market2 = _interopRequireDefault(_market);

var _mention = require("./sources/mention.js");

var _mention2 = _interopRequireDefault(_mention);

var _reddit = require("./sources/reddit.js");

var _reddit2 = _interopRequireDefault(_reddit);

var _twitter = require("./sources/twitter.js");

var _twitter2 = _interopRequireDefault(_twitter);

var _abs = require("./actions/abs.js");

var _abs2 = _interopRequireDefault(_abs);

var _diff = require("./actions/diff.js");

var _diff2 = _interopRequireDefault(_diff);

var _ema = require("./actions/ema.js");

var _ema2 = _interopRequireDefault(_ema);

var _itrend = require("./actions/itrend.js");

var _itrend2 = _interopRequireDefault(_itrend);

var _lpf = require("./actions/lpf.js");

var _lpf2 = _interopRequireDefault(_lpf);

var _lwmavg = require("./actions/lwmavg.js");

var _lwmavg2 = _interopRequireDefault(_lwmavg);

var _mavg = require("./actions/mavg.js");

var _mavg2 = _interopRequireDefault(_mavg);

var _negative = require("./actions/negative.js");

var _negative2 = _interopRequireDefault(_negative);

var _noise = require("./actions/noise.js");

var _noise2 = _interopRequireDefault(_noise);

var _normalize = require("./actions/normalize.js");

var _normalize2 = _interopRequireDefault(_normalize);

var _osc = require("./actions/osc.js");

var _osc2 = _interopRequireDefault(_osc);

var _outliers = require("./actions/outliers.js");

var _outliers2 = _interopRequireDefault(_outliers);

var _percentage = require("./actions/percentage.js");

var _percentage2 = _interopRequireDefault(_percentage);

var _pixelize = require("./actions/pixelize.js");

var _pixelize2 = _interopRequireDefault(_pixelize);

var _positive = require("./actions/positive.js");

var _positive2 = _interopRequireDefault(_positive);

var _smooth = require("./actions/smooth.js");

var _smooth2 = _interopRequireDefault(_smooth);

var _standardize = require("./actions/standardize.js");

var _standardize2 = _interopRequireDefault(_standardize);

var _stavg = require("./actions/stavg.js");

var _stavg2 = _interopRequireDefault(_stavg);

var _sum = require("./actions/sum.js");

var _sum2 = _interopRequireDefault(_sum);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Extractors = {
	market: _market2.default,
	mention: _mention2.default,
	reddit: _reddit2.default,
	twitter: _twitter2.default
};
(0, _freeze2.default)(Extractors);
var Actions = {
	abs: _abs2.default,
	diff: _diff2.default,
	ema: _ema2.default,
	itrend: _itrend2.default,
	lpf: _lpf2.default,
	lwmavg: _lwmavg2.default,
	mavg: _mavg2.default,
	negative: _negative2.default,
	noise: _noise2.default,
	normalize: _normalize2.default,
	osc: _osc2.default,
	outliers: _outliers2.default,
	percentage: _percentage2.default,
	pixelize: _pixelize2.default,
	positive: _positive2.default,
	smooth: _smooth2.default,
	standardize: _standardize2.default,
	stavg: _stavg2.default,
	sum: _sum2.default
};
(0, _freeze2.default)(Actions);

//var LPF = require("lpf");


var SourceExtractor = function () {
	function SourceExtractor(source) {
		(0, _classCallCheck3.default)(this, SourceExtractor);
		this.extractor = null;
		this.actions = [];

		if (Extractors[source.type]) {
			this.actions = source.actions;
			console.log("Creating source extractor:", source.type, Extractors);
			this.source = new Extractors[source.type](source.target, source.options);
			this.source.applyFilters(source.filters);
		}
	}

	SourceExtractor.prototype.extractInRange = function extractInRange(Interval, StartTime, EndTime) {
		var _this = this;

		if (!this.source) {
			return _promise2.default.reject("Invalid source defined.");
		}

		return this.source.extractInRange(Interval, StartTime, EndTime).then(function (data) {
			return _this.performActions(data);
		});
	};

	SourceExtractor.prototype.performActions = function performActions() {
		var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

		for (var _iterator = this.actions, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
			var _ref;

			if (_isArray) {
				if (_i >= _iterator.length) break;
				_ref = _iterator[_i++];
			} else {
				_i = _iterator.next();
				if (_i.done) break;
				_ref = _i.value;
			}

			var action = _ref;

			if (!Actions[action.name]) continue;

			data = Actions[action.name](data, action.data);
		}
		return data;
	};

	return SourceExtractor;
}();

exports.default = SourceExtractor;
;