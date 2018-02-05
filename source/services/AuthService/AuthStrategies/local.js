import { AuthStrategy } from "./AuthStrategy";
import redis from "redis";
import jws from "jws";
import aguid from "aguid";

export default class LocalStrategy extends AuthStrategy
{
	constructor(authservice)
	{
		super();
	}

	authenticate(email, password, done)
	{
		if(!email)
			return done("No email provided");

		email = email.toLowerCase();

		User.findOne({email: email}).populate("group").then(user =>
		{
			if (!user || user.email != email)
			{
				return done(null, null);
			}
			console.log("Logging in with:", email, "Password:", password);
			if (!user.validatePassword(password))
			{
				return done(null, null);
			}
			console.log("User logged in:", user.email);
			return done(null, user);
		}).catch((err) =>
		{
			console.log("Error", err);
			return done(err); 
		});
	}

	getSessionInfo(user)
	{
		let sessionId = aguid(user._id + new Date());
		return {
			token:	jws.sign({
				header: { alg: 'HS256' },
				payload: sessionId,
				secret: 'neokarma-xaccess-token',
			}),
			sessionId: sessionId
		}
	}
}