global.Controllers = [];
global.Controller = function(route, policies=[])
{
	return function(target)
	{
		//console.log("Registering controller", target.name, "to route ->", route);
		target.prototype.route = route;
		target.prototype.policies = policies;
		target.prototype.__register = function(router)
		{

			if(this.actions)
			{
				if(!this.actions["/"] && target.prototype.index != undefined)
				{
					this.actions["/"] = {
						method: "GET",
						handler: "index",
						policies: policies,
					};
				}

				for(var route in this.actions)
				{
					var controllerRoute = this.route[this.route.length - 1] === '/' ? this.route.slice(0, this.route.length - 1) : this.route;
					var actionRoute = route[route.length - 1] === '/' ? route.slice(0, route.length - 1) : route;
					
					var url = (controllerRoute + actionRoute) || '/';
					var method = this.actions[route];
					var policies = [];
					policies.push.apply(policies, this.actions[route].policies);
					policies.push.apply(policies, this.policies);
					policies = Array.from(new Set(policies));

					for(var policy of policies)
					{
						if(!Policies[policy] || !Policies[policy]['validate'])
						{
							console.warn("Unkown policy:", policy);
							continue;
						}

						if(this.actions[route].method == "POST")
						{
							router.post(url,  Policies[policy]['validate']);
						}

						if(this.actions[route].method == "GET")
						{
							router.get(url,  Policies[policy]['validate']);
							
						}
					}

					if(this.actions[route].method == "GET")
					{
						router.get(url, target.prototype[this.actions[route].handler]);
					}

					if(this.actions[route].method == "POST")
					{
						router.post(url, target.prototype[this.actions[route].handler]);
					}

					if(this.actions[route].method == "")
					{
						router.use(url, target.prototype[this.actions[route].handler]);
					}
				}
				
			}
		}
		global.Controllers.push(new target());
	};

}

function SetAction(target, route, method, policies = [], handler=null, validation=null)
{
	if(!target.actions)
		target.actions = [];

	if(!route)
		route = key;

	target.actions[route] = {
		method: method,
		policies: policies,
		handler: handler,
	//	validation: validation,
	};
}

global.ANY = function(route, policies=[])
{
	return function(target, key, descriptor)
	{
		SetAction(target, route, "", policies, key);
		return descriptor;
	}
}

global.GET = function(route, policies=[])
{
	return function(target, key, descriptor)
	{
		SetAction(target, route, "GET", policies, key);
		return descriptor;
	}
}

global.POST = function(route, validation = null, policies=[])
{
	return function(target, key, descriptor)
	{
		SetAction(target, route, "POST", policies, key, validation);
		return descriptor;
	}
}

function validatePost(required, current)
{
	let Fields = Object.keys(required);
	for(let field of Fields)
	{
		if(!current[field])
		{
			console.log("no field:", field);
			return false;
		}
		
		if(typeof required[field] == "object")
		{
			if(!validatePost(required[field], current[field]))
				return false;
			continue;
		}

		console.log("typeof current[field]", field, typeof current[field], required[field].name.toLowerCase());

		if(typeof current[field] != required[field].name.toLowerCase())
		{
			console.log("invalid type:", field);
			return false;
		}

		
	}
	return true;
}