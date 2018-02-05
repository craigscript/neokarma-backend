"use strict";

exports.__esModule = true;

exports.default = function (params) {
	console.log("Upvote filter is used:", params);

	return [{
		$match: {
			"ups": {
				$gte: params.min,
				$lte: params.max
			}
		}
	}];
};