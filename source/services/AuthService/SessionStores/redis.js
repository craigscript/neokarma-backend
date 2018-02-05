import { SessionStore } from "./SessionStore";
import redis from "redis";

export default class RedisStore extends SessionStore
{
	client = null;
	constructor(authservice)
	{
		super();
		this.sessionKey = Config.redisSession.sessionKey;
		this.createConnection(Config.redisSession.redis);
	}

	createConnection(redisConfig)
	{
		this.client = redis.createClient(redisConfig);
		this.client.on("error", (error) => {
			console.error("[Redis] Error:", error);
		});
		this.client.on("connect", ()=> {
			console.log("[Redis] Connected.");
		})
		this.client.on("reconnecting", () => {
			console.warn("[Redis] Warning: Reconnecting.");
		});
	}
	
	// Store user session
	save(sessionId, user, expiration, done)
	{
		this.client.set(this.sessionKey + ":" + sessionId, JSON.stringify(user), (err, result) => {
			
			// Expire the session if expiration is greater than 0
			if(expiration <= 0)
				expiration = 60*60*24*7;
			
			this.client.expire(this.sessionKey + ":" + sessionId, expiration);
			
			done(err);
		});
	}
	
	// Get User session
	get(sessionId, done)
	{
		this.client.get(this.sessionKey + ":" + sessionId, (err, user) => {
			done(err, JSON.parse(user));
		});
	}

	drop(sessionId, done)
	{
		this.client.del(this.sessionKey + ":" + sessionId, (err, result) => {
			done(err);
		});
	}
}