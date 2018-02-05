"use strict";

exports.__esModule = true;

exports.default = function (params) {
	console.log("Score filter is used:", params);

	return [{
		$match: {
			"score": {
				$gte: params.min,
				$lte: params.max
			}
		}
	}];
};