import * as SessionStores from "glob:./AuthService/SessionStores/*.js";
import * as AuthStrategies from "glob:./AuthService/AuthStrategies/*.js";

// Singleton service (creates an instance of this object)
@SingletonService
export class AuthService
{
	stores = {};
	session(name)
	{
		if(!this.stores[name])
			this.stores[name] = new SessionStores[name](this);
		return this.stores[name];
	}

	startegies = {};
	strategy(strategy)
	{
		if(!this.startegies[strategy])
			this.startegies[strategy] = new AuthStrategies[strategy](this);
		return this.startegies[strategy];
	}

};
