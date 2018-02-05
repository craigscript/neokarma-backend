"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CacheEntries = [];

var CacheService = Service(_class = function () {
	function CacheService() {
		(0, _classCallCheck3.default)(this, CacheService);
	}

	CacheService.findCacheEntry = function findCacheEntry(path, namespace) {
		return CacheEntries.find(function (entry) {
			if (entry.path == path && entry.namespace == namespace && entry.ttl >= Date.now()) {
				return entry;
			}
		});
	};

	CacheService.createCacheEntry = function createCacheEntry(path, minutes, namespace, data) {
		CacheEntries.push({
			path: path,
			namespace: namespace,
			ttl: Date.now() + minutes * 60 * 1000,
			data: data
		});
	};

	CacheService.cleanup = function cleanup() {
		CacheEntries = CacheEntries.filter(function (entry) {
			if (entry.ttl < Date.now()) return false;
			return true;
		});
	};

	return CacheService;
}()) || _class;

;
setInterval(function () {
	CacheService.cleanup();
}, 1000);