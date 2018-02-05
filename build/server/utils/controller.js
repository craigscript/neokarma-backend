"use strict";

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _set = require("babel-runtime/core-js/set");

var _set2 = _interopRequireDefault(_set);

var _from = require("babel-runtime/core-js/array/from");

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

global.Controllers = [];
global.Controller = function (route) {
	var policies = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

	return function (target) {
		//console.log("Registering controller", target.name, "to route ->", route);
		target.prototype.route = route;
		target.prototype.policies = policies;
		target.prototype.__register = function (router) {

			if (this.actions) {
				if (!this.actions["/"] && target.prototype.index != undefined) {
					this.actions["/"] = {
						method: "GET",
						handler: "index",
						policies: policies
					};
				}

				for (var route in this.actions) {
					var controllerRoute = this.route[this.route.length - 1] === '/' ? this.route.slice(0, this.route.length - 1) : this.route;
					var actionRoute = route[route.length - 1] === '/' ? route.slice(0, route.length - 1) : route;

					var url = controllerRoute + actionRoute || '/';
					var method = this.actions[route];
					var policies = [];
					policies.push.apply(policies, this.actions[route].policies);
					policies.push.apply(policies, this.policies);
					policies = (0, _from2.default)(new _set2.default(policies));

					for (var _iterator = policies, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
						var _ref;

						if (_isArray) {
							if (_i >= _iterator.length) break;
							_ref = _iterator[_i++];
						} else {
							_i = _iterator.next();
							if (_i.done) break;
							_ref = _i.value;
						}

						var policy = _ref;

						if (!Policies[policy] || !Policies[policy]['validate']) {
							console.warn("Unkown policy:", policy);
							continue;
						}

						if (this.actions[route].method == "POST") {
							router.post(url, Policies[policy]['validate']);
						}

						if (this.actions[route].method == "GET") {
							router.get(url, Policies[policy]['validate']);
						}
					}

					if (this.actions[route].method == "GET") {
						router.get(url, target.prototype[this.actions[route].handler]);
					}

					if (this.actions[route].method == "POST") {
						router.post(url, target.prototype[this.actions[route].handler]);
					}

					if (this.actions[route].method == "") {
						router.use(url, target.prototype[this.actions[route].handler]);
					}
				}
			}
		};
		global.Controllers.push(new target());
	};
};

function SetAction(target, route, method) {
	var policies = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
	var handler = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
	var validation = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

	if (!target.actions) target.actions = [];

	if (!route) route = key;

	target.actions[route] = {
		method: method,
		policies: policies,
		handler: handler
		//	validation: validation,
	};
}

global.ANY = function (route) {
	var policies = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

	return function (target, key, descriptor) {
		SetAction(target, route, "", policies, key);
		return descriptor;
	};
};

global.GET = function (route) {
	var policies = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

	return function (target, key, descriptor) {
		SetAction(target, route, "GET", policies, key);
		return descriptor;
	};
};

global.POST = function (route) {
	var validation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	var policies = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

	return function (target, key, descriptor) {
		SetAction(target, route, "POST", policies, key, validation);
		return descriptor;
	};
};

function validatePost(required, current) {
	var Fields = (0, _keys2.default)(required);
	for (var _iterator2 = Fields, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator3.default)(_iterator2);;) {
		var _ref2;

		if (_isArray2) {
			if (_i2 >= _iterator2.length) break;
			_ref2 = _iterator2[_i2++];
		} else {
			_i2 = _iterator2.next();
			if (_i2.done) break;
			_ref2 = _i2.value;
		}

		var field = _ref2;

		if (!current[field]) {
			console.log("no field:", field);
			return false;
		}

		if ((0, _typeof3.default)(required[field]) == "object") {
			if (!validatePost(required[field], current[field])) return false;
			continue;
		}

		console.log("typeof current[field]", field, (0, _typeof3.default)(current[field]), required[field].name.toLowerCase());

		if ((0, _typeof3.default)(current[field]) != required[field].name.toLowerCase()) {
			console.log("invalid type:", field);
			return false;
		}
	}
	return true;
}