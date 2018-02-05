// Controller used for caching tests & healthchecks for the load balancer
@Controller("/cdn")
class CDNController
{
	static _LastCacheTime = new Date();
	@GET("/cacheTest")
	cacheTest(req, res)
	{
		res.json({
			success: true,
			random: Math.random() * 1000,
			lastUpdate: CDNController._LastCacheTime,
		});
		CDNController._LastCacheTime = new Date();
	}
	
	static _LastHealthCheckTime = new Date();
	@GET("/health")
	health(req, res)
	{
		res.json({
			success: true,
			lastCheck: CDNController._LastHealthCheckTime,
			result: "stil alive",
		});
		CDNController._LastHealthCheckTime = new Date();
	}
	

};