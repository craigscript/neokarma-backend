global.Storages = [];

global.Storage = function(storage)
{
	return function(target, key, descriptor)
	{
		Storages[storage] = target[key];
		return descriptor;
	};
}