export default class TwitterSource
{
	getSourceOptions(req, res)
	{
		return TwitterTopics.find().then( topics => {
			return res.json({success: true, topics: topics.map(topic => topic.topic)});
		});
	}
}