"use strict";

exports.__esModule = true;
exports.Database = undefined;

var _freeze = require("babel-runtime/core-js/object/freeze");

var _freeze2 = _interopRequireDefault(_freeze);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _Currencies = require("./../models/Currencies.js");

var _Currencies2 = _interopRequireDefault(_Currencies);

var _Logs = require("./../models/Logs.js");

var _Logs2 = _interopRequireDefault(_Logs);

var _MarketAlerts = require("./../models/MarketAlerts.js");

var _MarketAlerts2 = _interopRequireDefault(_MarketAlerts);

var _MarketCursors = require("./../models/MarketCursors.js");

var _MarketCursors2 = _interopRequireDefault(_MarketCursors);

var _MarketData = require("./../models/MarketData.js");

var _MarketData2 = _interopRequireDefault(_MarketData);

var _Mentions = require("./../models/Mentions.js");

var _Mentions2 = _interopRequireDefault(_Mentions);

var _MentionTrackings = require("./../models/MentionTrackings.js");

var _MentionTrackings2 = _interopRequireDefault(_MentionTrackings);

var _Notifications = require("./../models/Notifications.js");

var _Notifications2 = _interopRequireDefault(_Notifications);

var _NotificationTrackers = require("./../models/NotificationTrackers.js");

var _NotificationTrackers2 = _interopRequireDefault(_NotificationTrackers);

var _PortfolioData = require("./../models/PortfolioData.js");

var _PortfolioData2 = _interopRequireDefault(_PortfolioData);

var _Portfolios = require("./../models/Portfolios.js");

var _Portfolios2 = _interopRequireDefault(_Portfolios);

var _RedditComments = require("./../models/RedditComments.js");

var _RedditComments2 = _interopRequireDefault(_RedditComments);

var _RedditPosts = require("./../models/RedditPosts.js");

var _RedditPosts2 = _interopRequireDefault(_RedditPosts);

var _SubscriptionPlans = require("./../models/SubscriptionPlans.js");

var _SubscriptionPlans2 = _interopRequireDefault(_SubscriptionPlans);

var _Tickets = require("./../models/Tickets.js");

var _Tickets2 = _interopRequireDefault(_Tickets);

var _Trackers = require("./../models/Trackers.js");

var _Trackers2 = _interopRequireDefault(_Trackers);

var _TrackerSources = require("./../models/TrackerSources.js");

var _TrackerSources2 = _interopRequireDefault(_TrackerSources);

var _TrackingErrors = require("./../models/TrackingErrors.js");

var _TrackingErrors2 = _interopRequireDefault(_TrackingErrors);

var _TrackingSites = require("./../models/TrackingSites.js");

var _TrackingSites2 = _interopRequireDefault(_TrackingSites);

var _TrackingStats = require("./../models/TrackingStats.js");

var _TrackingStats2 = _interopRequireDefault(_TrackingStats);

var _TwitterTopics = require("./../models/TwitterTopics.js");

var _TwitterTopics2 = _interopRequireDefault(_TwitterTopics);

var _TwitterTweets = require("./../models/TwitterTweets.js");

var _TwitterTweets2 = _interopRequireDefault(_TwitterTweets);

var _User = require("./../models/User.js");

var _User2 = _interopRequireDefault(_User);

var _UserEmailConfirm = require("./../models/UserEmailConfirm.js");

var _UserEmailConfirm2 = _interopRequireDefault(_UserEmailConfirm);

var _UserGroup = require("./../models/UserGroup.js");

var _UserGroup2 = _interopRequireDefault(_UserGroup);

var _UserPayment = require("./../models/UserPayment.js");

var _UserPayment2 = _interopRequireDefault(_UserPayment);

var _UserSettings = require("./../models/UserSettings.js");

var _UserSettings2 = _interopRequireDefault(_UserSettings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Set up database
var Models = {
	Currencies: _Currencies2.default,
	Logs: _Logs2.default,
	MarketAlerts: _MarketAlerts2.default,
	MarketCursors: _MarketCursors2.default,
	MarketData: _MarketData2.default,
	Mentions: _Mentions2.default,
	MentionTrackings: _MentionTrackings2.default,
	Notifications: _Notifications2.default,
	NotificationTrackers: _NotificationTrackers2.default,
	PortfolioData: _PortfolioData2.default,
	Portfolios: _Portfolios2.default,
	RedditComments: _RedditComments2.default,
	RedditPosts: _RedditPosts2.default,
	SubscriptionPlans: _SubscriptionPlans2.default,
	Tickets: _Tickets2.default,
	Trackers: _Trackers2.default,
	TrackerSources: _TrackerSources2.default,
	TrackingErrors: _TrackingErrors2.default,
	TrackingSites: _TrackingSites2.default,
	TrackingStats: _TrackingStats2.default,
	TwitterTopics: _TwitterTopics2.default,
	TwitterTweets: _TwitterTweets2.default,
	User: _User2.default,
	UserEmailConfirm: _UserEmailConfirm2.default,
	UserGroup: _UserGroup2.default,
	UserPayment: _UserPayment2.default,
	UserSettings: _UserSettings2.default
};
(0, _freeze2.default)(Models);

var mongooseHidden = require('mongoose-hidden')({ defaultHidden: { _id: false } });
global.ObjectId = _mongoose2.default.Types.ObjectId;
_mongoose2.default.Promise = _promise2.default; // Set the default promise library for mongoose

var Database = exports.Database = function () {
	function Database(dbsettings) {
		(0, _classCallCheck3.default)(this, Database);
		this.connections = {};
		this.connectionSettings = null;

		this.connectionSettings = dbsettings;
	}

	Database.prototype.init = function init() {
		var connectionNames = (0, _keys2.default)(this.connectionSettings.Connections);
		var connections = [];
		for (var _iterator = connectionNames, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
			var _ref;

			if (_isArray) {
				if (_i >= _iterator.length) break;
				_ref = _iterator[_i++];
			} else {
				_i = _iterator.next();
				if (_i.done) break;
				_ref = _i.value;
			}

			var name = _ref;

			connections.push(this.connect(name));
		}

		//return Promise.reject("yolo");
		return _promise2.default.all(connections).then(function () {
			console.log("[MongoDB]".magenta, "Ready!");
		});
	};

	Database.prototype.connect = function connect(name) {
		var _this = this;

		return new _promise2.default(function (resolve, reject) {
			_this.openConnection(name, function () {
				_this.loadModels(name);
				resolve();
			});
		});
	};

	Database.prototype.openConnection = function openConnection(name, connected) {
		var _this2 = this;

		var connectionString = this.buildConnectionString(this.connectionSettings.Connections[name]);
		console.log("[MongoDB] Connecting to: ", name, connectionString);

		this.connections[name] = _mongoose2.default.createConnection(connectionString, this.connectionSettings.Settings);

		this.connections[name].on("error", function (error) {
			//SlackAlerts.alert("error", "MongoDB Connection Error:", error);
			console.error("[MongoDB]".magenta, colors.cyan(name), "Error:".red, colors.red(error));
			_this2.connections[name].close();
		});

		this.connections[name].once("connected", function () {
			console.log("[MongoDB]".magenta, colors.cyan(name), "connected!");
			if (connected) {
				connected();
			}
		});

		this.connections[name].on('disconnected', function () {
			//SlackAlerts.alert("error", "MongoDB Error:", "Connection lost?");
			console.log("[MongoDB]".magenta, colors.cyan(name), "Disconnected! Retrying in 5 seconds");
			_this2.connections[name].close();
			setTimeout(function () {

				_this2.openConnection(name);
			}, 5000);
		});
	};

	Database.prototype.buildConnectionString = function buildConnectionString(Connection) {
		var ConnectionString = "mongodb://";
		if (Connection.User) {
			ConnectionString += encodeURIComponent(Connection.User);
		}
		if (Connection.Password) {
			ConnectionString += ":" + encodeURIComponent(Connection.Password);
		}
		if (Connection.Hostname) {
			if (Connection.User) {
				ConnectionString += "@";
			}
			ConnectionString += Connection.Hostname;
		}
		if (Connection.ReplicaSet && Connection.Replicas) {
			if (Connection.User) {
				ConnectionString += "@";
			}

			for (var _iterator2 = Connection.Replicas, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator3.default)(_iterator2);;) {
				var _ref2;

				if (_isArray2) {
					if (_i2 >= _iterator2.length) break;
					_ref2 = _iterator2[_i2++];
				} else {
					_i2 = _iterator2.next();
					if (_i2.done) break;
					_ref2 = _i2.value;
				}

				var Replica = _ref2;

				ConnectionString += Replica.Hostname;
				ConnectionString += ":" + Replica.Port + ",";
			}
			ConnectionString = ConnectionString.slice(0, -1);
		}
		if (Connection.Port) {
			ConnectionString += ":" + Connection.Port;
		}

		if (Connection.Database) {
			ConnectionString += "/" + Connection.Database;
		}
		if (Connection.ReplicaSet) {
			ConnectionString += "?replicaSet=" + Connection.ReplicaSet;
		}

		return ConnectionString;
	};

	Database.prototype.loadModels = function loadModels(name) {
		//console.log("Loading models for", name, Models);
		for (var model in Models) {

			if (!Models[model].connection) {
				Models[model].connection = "default";
			}

			if (Models[model].connection == name) {
				console.log("[MongoDB]".magenta, colors.cyan(name), "-> loading model:", colors.cyan(model));
				Models[model].plugin(mongooseHidden);
				global[model] = this.connections[name].model(model, Models[model]);
			}
		}
	};

	return Database;
}();

;