"use strict";

global.__Responses = [];
global.Response = function (name) {
	return function (target) {
		//console.log("Adding Response:", name);
		var instance = new target();
		target.prototype.__register = function (router) {
			router.use(function (req, res, next) {
				res[name] = function (params) {

					instance.index(req, res, params);
				};
				next();
			});
		};
		global.__Responses.push(instance);
	};
};