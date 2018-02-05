module.exports = {
	Connections: {
		default: {
			Hostname: "127.0.0.1",
			Port: 27017,
			Database: "neokarma",
		},
		markets: {
			Hostname: "127.0.0.1",
			Port: 27017,
			Database: "markets",
		},
		reddit: {
			Hostname: "127.0.0.1",
			Port: 27017,
			Database: "reddit",
		},
		twitter: {
			Hostname: "127.0.0.1",
			Port: 27017,
			Database: "twitter",
		},
	},
	Settings: {
		autoReconnect: true,
		readPreference: 'nearest',
		// See http://mongoosejs.com/docs/connections.html#use-mongo-client
		useMongoClient: true,
	}
};