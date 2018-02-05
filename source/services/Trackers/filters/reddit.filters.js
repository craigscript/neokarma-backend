export class RedditFilters
{
	@TrackerFilter("username")
	usernameFilter(stream, params)
	{
		stream.filter({
			$match: {
				username: { $contains: params.name }
			}
		})
	}

	@TrackerFilter("keyword")
	keywordFilter(stream, params)
	{
		stream.filter({
			$match: {
				content: { $contains: params.keywords }
			}
		});
	}

}