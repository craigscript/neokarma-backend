"use strict";

exports.__esModule = true;

exports.default = function (params) {
	return [{
		$match: {
			subreddit: params.subreddit.toLowerCase()
		}
	}];
};