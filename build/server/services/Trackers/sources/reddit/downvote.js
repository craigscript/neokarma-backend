"use strict";

exports.__esModule = true;

exports.default = function (params) {
	console.log("Downvote filter is used:", params);

	return [{
		$match: {
			"downs": {
				$gte: params.min,
				$lte: params.max
			}
		}
	}];
};