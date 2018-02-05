export default class RedditSource
{
	getSourceOptions(req, res)
	{
		return res.json({success: true, subreddits: [], format: "/r/*"});
	}
}