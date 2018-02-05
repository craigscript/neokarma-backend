"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ChartifyService = Service(_class = function () {
	function ChartifyService() {
		(0, _classCallCheck3.default)(this, ChartifyService);
	}

	ChartifyService.Chartify = function Chartify(start, end, stepSize, data) {
		var datemul = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;

		var output = [];
		var i = 0;
		for (var date = start; date <= end; date += stepSize) {
			var timestamp = (date / stepSize - date / stepSize % 1) * stepSize;
			if (!data[i] || data[i].timestamp != timestamp) {
				output.push({
					date: new Date(timestamp * datemul),
					timestamp: timestamp * datemul,
					value: 0
				});
				continue;
			}
			output.push(data[i]);
			++i;
		}
		return output;
	};

	ChartifyService.GetNumPoints = function GetNumPoints(Start, End, StepSize) {
		return Math.abs((End - Start) / StepSize);
	};

	return ChartifyService;
}()) || _class;

;