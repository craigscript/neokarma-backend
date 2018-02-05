global.CACHE = function(minutes=5, memory = true, namespace=null)
{
	let memoryCache = [];
	return function(target, key, descriptor)
	{
		var oldTarget = target[key];
		descriptor.value = function(req, res, next)
		{
			// If memory cache enabled check for cache
			if(memory)
			{
				let entry = CacheService.findCacheEntry(req.path, namespace);
				if(entry)
				{
					return res.json(Object.assign(entry.data, {cttl: entry.ttl - Date.now()}));
				}
			}

			// Schedule for cache
			res.cjson = (data) =>
			{
				CacheService.createCacheEntry(req.path, minutes, namespace, data);
				res.json(data);
			};
			
			
			oldTarget(req, res, next);
		}
		return descriptor;
	};
};