'use strict';

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

global.colors = _colors2.default;
var log = console.log;
console.log = function () {
	var date = new Date();
	var seconds = date.getSeconds();
	var minutes = date.getMinutes();
	var hours = date.getHours();
	Array.prototype.unshift.call(arguments, '[' + hours + ':' + minutes + ':' + seconds + ']');
	log.apply(this, arguments);
};