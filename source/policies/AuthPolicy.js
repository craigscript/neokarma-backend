var jws = require("jws");

@Policy("Auth")
class AuthPolicy
{
	register(app)
	{
		// Redis Session Store
		app.use( (req, res, next) => {

			if(req.headers['x-access-token'])
			{
				try
				{
					var result = jws.verify(req.headers['x-access-token'], "HS256", "neokarma-xaccess-token");
					if(!result)
						throw new Error("Invalid token");

					let decodedToken = jws.decode(req.headers['x-access-token']);
					if(!decodedToken)
						throw new Error("failed to decode token");


					return AuthService.session("redis").get( decodedToken.payload, (error, user) => {
						if(error)
							return res.json({success: false, auth_failed: true, message: "Authorization failed."});
						req.user = user;
						next();
					})
				}catch( error )
				{
					console.log("Authorization error:", error.message);
					return res.json({success: false, auth_failed: true, message: "Authorization failed."});
				}

				
			}
			next();
		});
	}

	route(req, res, next)
	{
		if(req.user)
		{
			console.log("Authorized:", req.ip, req.geoip, req.user.email, "=>", req.path);	
		}else{
			console.log("Unauthorized =>", req.ip, req.geoip, req.path);
		}

		// if we're on login, signup or logout page, or recover pw page then do nothing.
		if ( req.path == "/" || req.path.startsWith("/auth"))
		{
			return next();
		}
		
		if(req.path == "/verify_login")
		{
			return next();
		}

		if(req.path.startsWith("/subscription/ipn/"))
		{
			return next();
		}

		return next();
	}

	validate(req, res, next)
	{
		if(!req.user)
		{
			return res.json({success: false, auth_required: true, message: "Authorization required."});
		}
		next();
	}


};