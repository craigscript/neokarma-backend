"use strict";

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

global.CACHE = function () {
	var minutes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;
	var memory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
	var namespace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

	var memoryCache = [];
	return function (target, key, descriptor) {
		var oldTarget = target[key];
		descriptor.value = function (req, res, next) {
			// If memory cache enabled check for cache
			if (memory) {
				var entry = CacheService.findCacheEntry(req.path, namespace);
				if (entry) {
					return res.json((0, _assign2.default)(entry.data, { cttl: entry.ttl - Date.now() }));
				}
			}

			// Schedule for cache
			res.cjson = function (data) {
				CacheService.createCacheEntry(req.path, minutes, namespace, data);
				res.json(data);
			};

			oldTarget(req, res, next);
		};
		return descriptor;
	};
};