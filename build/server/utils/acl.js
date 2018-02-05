"use strict";

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function containsAll(needles, haystack) {
	for (var n in needles) {
		if (haystack.indexOf(needles[n]) < 0) {
			return false;
		}
	}
	return true;
}

// @AuthRequired() decorator
global.AuthRequired = function (response) {
	return function (target, key, descriptor) {
		var oldTarget = target[key];
		descriptor.value = function (req, res, next) {
			if (!req.user) {
				if (!response) return res.accessDenied();
				return res.json(response);
			}

			console.log("AuthRequired Check OK!");
			oldTarget(req, res, next);
		};
		return descriptor;
	};
};

global.ACL = function (aclTags) {

	if (typeof aclTags == "string") var aclTags = [aclTags];

	for (var _iterator = aclTags, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
		var _ref;

		if (_isArray) {
			if (_i >= _iterator.length) break;
			_ref = _iterator[_i++];
		} else {
			_i = _iterator.next();
			if (_i.done) break;
			_ref = _i.value;
		}

		var aclTag = _ref;

		ACL.define(aclTag);
	}

	return function (target, key, descriptor) {
		var oldTarget = target[key];
		descriptor.value = function (req, res, next) {

			if (!req.user || !req.user.group || !req.user.group.acl) return res.json({ success: false, access_required: true, message: "Access denied! Please log in or request permission." });

			// if(req.user.group.acl.indexOf("Developer.AllAccess") >= 0)
			// {
			// 	console.log("Developer ACL Used:", aclTags);
			// 	oldTarget(req, res, next);
			// 	return;
			// }

			if (!containsAll(aclTags, req.user.group.acl)) {
				console.log("ACL Missing", aclTags);
				return res.json({ success: false, access_required: true, acl: aclTags, message: "Access denied!" });
			}
			console.log("ACL Check OK!");
			oldTarget(req, res, next);
		};
		return descriptor;
	};
};

// It is used for group settings
ACL.list = [];
ACL.define = function (name) {
	if (ACL.list.indexOf(name) < 0) {
		ACL.list.push(name);
	}
};
ACL.define("App");
//ACL.define("Developer.AllAccess");