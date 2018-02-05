// Services are exposed globaly (maybe implement custom require for them.?)
global.Service = function(target)
{
	//console.log("Registering service:", target.name);
	global[target.name] = target;
}

global.SingletonService = function(target)
{
	//console.log("Registering service:", target.name);
	
	// Services are now singleton!
	global[target.name] = new target();
}