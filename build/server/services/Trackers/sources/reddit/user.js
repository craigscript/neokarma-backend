'use strict';

exports.__esModule = true;

exports.default = function (params) {
	console.log("User filter is used:", params);

	if (params.mode) {
		return [{ $match: { user: { $regex: params.user, $options: 'i' } } }];
	} else {
		return [{ $match: { user: { $not: params.user, $options: 'i' } } }];
	}
};