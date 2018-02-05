let UsageTrackings = Array.from(Array(60), () => 0);
let LastUsageStat = 0;

var stats = {
	reddit: 0,
	tweets: 0,
	rss: 0,
	facebook: 0,
	mentions: 0,
	trackings: 0,
	keywords: 0,
	words: 0,
	
	quotas: {
		mentions: {
			used: 0,
			current: 0,
		},
		trackers: {
			used: 0,
			current: 0,
		},
		sources: {
			used: 0,
			current: 0,
		},
	},
	timelines: {
		usage: UsageTrackings,
	}
};

function cacheStats()
{
	setTimeout(() => {
		var statqueries = [];
		let totalReddit = 0;
		statqueries.push(RedditPosts.count({}).then( reddit => {
			totalReddit += reddit;
		}));

		statqueries.push(RedditComments.count({}).then( reddit => {
			totalReddit += reddit;
		}));
	
		statqueries.push(TwitterTweets.count({}).then( tweets => {
			stats.tweets = tweets;
		}));
	

		Promise.all(statqueries).then( () => {
			stats.reddit = totalReddit;
			let total = (stats.reddit + stats.tweets);
			UsageTrackings.push(total - LastUsageStat);
	

			LastUsageStat = total;
			if(UsageTrackings.length > 60)
				UsageTrackings.shift();


			cacheStats();
		});
			
	}, 1000);
}

// setTimeout(() => {
// 	cacheStats();
// }, 1000);


@Controller("/dashboard")
class IndexController
{
	@GET("/stats")
	getStats(req, res)
	{
		let userStats = {
			mentions: 0,
			trackings: 0,
		};
		var statqueries = [];
		statqueries.push(Mentions.count({user: req.user._id}).then( mentions => {
			userStats.mentions = mentions;
		}));
		statqueries.push(TrackingSites.count({user: req.user._id}).then( trackings => {
			userStats.trackings = trackings;
		}));
		stats.quotas = req.user.quotas;
		Promise.all(statqueries).then( () => {
			res.json({
				success: true,
				stats: Object.assign(stats, userStats),
			});
		});
	}

	@GET("/getTickers")
	getTickers(req, res)
	{
		let settings = req.user.settings;
		if(!settings || !settings.tickers)
			return res.json({success: true, tickers: []});
		
		let tickers = [];
		let promises = [];
		for(let ticker of settings.tickers)
		{
			var marketInstance = MarketService.create(ticker.exchange);
			if(!marketInstance)
				continue;
			
			promises.push(marketInstance.getTicker(ticker.market).then( ( ticker ) => {
				if(ticker.success)
				{
					tickers.push(ticker.data);
				}
			}).catch( error => {
				console.log("Ticker Error:", error);
				return Promise.resolve(null);
			}))

			tickers.push(marketInstance.getTicker(ticker.market));
		}
		Promise.all(promises).then( () => {
			res.json({success: true, tickers: tickers});
		}).catch
			
	}
	
};