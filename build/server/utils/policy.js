"use strict";

global.Policies = [];
global.Policy = function (name) {
	//console.log("Policy: ", name);
	return function (target) {
		if (!target.prototype.validate) target.prototype.validate = function (req, res, next) {
			next();
		};
		global.Policies[name] = new target();
	};
};