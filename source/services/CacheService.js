let CacheEntries = [];
@Service
class CacheService
{
	static findCacheEntry(path, namespace)
	{
		return CacheEntries.find( entry => {
			if(entry.path == path
			&& entry.namespace == namespace
			&& entry.ttl >= Date.now()) 
			{
				return entry;
			}
		});
	}

	static createCacheEntry(path, minutes, namespace, data)
	{
		CacheEntries.push({
			path: path,
			namespace: namespace,
			ttl: (Date.now() + (minutes * 60 * 1000)),
			data: data,
		})
	}

	static cleanup()
	{
		CacheEntries = CacheEntries.filter( entry => {
			if(entry.ttl < Date.now())
				return false;
			return true;
		});
	}
};
setInterval(() => {
	CacheService.cleanup();
}, 1000);