export default (params) =>
{
	return [{
		$match: {
			subreddit: params.subreddit.toLowerCase(),
		},
	}]
};