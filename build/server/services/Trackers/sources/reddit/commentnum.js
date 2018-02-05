"use strict";

exports.__esModule = true;

exports.default = function (params) {
	console.log("Sentiment filter is used:", params);

	return [{
		$match: {
			"num_comments": {
				$gte: params.min,
				$lte: params.max
			}
		}
	}];
};