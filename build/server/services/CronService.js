'use strict';

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _class, _class2, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nodemailer = require('nodemailer');

var ejs = require('ejs');
var fs = require("fs");

var mailTransporter = nodemailer.createTransport(Config.mail.transporter);

var Cron = Service(_class = (_temp = _class2 = function () {
	function Cron() {
		(0, _classCallCheck3.default)(this, Cron);
	}

	Cron.delay = function delay(callback, time) {
		var task = {
			taskFn: callback,
			delay: true,
			options: { timeleft: time }
		};
		Cron.tasks.push(task);
	};

	Cron.always = function always(callback) {
		var task = {
			taskFn: callback,
			always: true
		};
		Cron.tasks.push(task);
	};

	Cron.dequeue = function dequeue(taskId) {};

	Cron.tick = function tick() {
		for (var _iterator = Cron.tasks, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
			var _ref;

			if (_isArray) {
				if (_i >= _iterator.length) break;
				_ref = _iterator[_i++];
			} else {
				_i = _iterator.next();
				if (_i.done) break;
				_ref = _i.value;
			}

			var task = _ref;

			var options = task.options;
			if (task.delay) {

				options.timeleft -= 1;

				if (!options.timeleft) {
					console.log("[CRON] Executing tasks");
					task.taskFn();
					Cron.tasks.splice(task, 1);
					continue;
				}
			}

			if (task.always) {
				task.taskFn();
				continue;
			}
		}
	};

	return Cron;
}(), _class2.tasks = [], _class2.taskIdCounter = 0, _temp)) || _class;

;

// Tick cron
setInterval(function () {
	Cron.tick();
}, 1000);