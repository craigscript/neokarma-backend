var geoip = require("geoip-lite");
const requestIp = require('request-ip');
 

@Policy("Geo")
class GeoPolicy
{
	register(app)
	{
		console.log("[GEO] Register");
		app.use(requestIp.mw())

	}

	route(req, res, next)
	{
		var geo = geoip.lookup(req.clientIp);
		req.geoip = geo;
		return next();
	}
};