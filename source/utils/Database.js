// Set up database
import mongoose from "mongoose";
import * as Models from "glob:../models/**.js";
let mongooseHidden = require('mongoose-hidden')({ defaultHidden: { _id: false } });
global.ObjectId = mongoose.Types.ObjectId;
mongoose.Promise = Promise; // Set the default promise library for mongoose

export class Database
{
	connections = {};
	connectionSettings = null;
	constructor(dbsettings)
	{
		this.connectionSettings = dbsettings;
	}

	init()
	{
		let connectionNames = Object.keys(this.connectionSettings.Connections);
		let connections = [];
		for(let name of connectionNames)
		{
			connections.push(this.connect(name));
		}

		//return Promise.reject("yolo");
		return Promise.all(connections).then( () => {
			console.log("[MongoDB]".magenta, "Ready!");
		});
	}

	connect(name)
	{
		return new Promise((resolve, reject) => {
			this.openConnection(name, () => {
				this.loadModels(name);
				resolve();
			});
		});
	}

	openConnection(name, connected)
	{
		let connectionString = this.buildConnectionString(this.connectionSettings.Connections[name]);
		console.log("[MongoDB] Connecting to: ", name, connectionString);

		this.connections[name] = mongoose.createConnection(connectionString, this.connectionSettings.Settings);
		
		this.connections[name].on("error", (error) => {
			//SlackAlerts.alert("error", "MongoDB Connection Error:", error);
			console.error("[MongoDB]".magenta, colors.cyan(name), "Error:".red, colors.red(error) );
			this.connections[name].close();
		});

		this.connections[name].once("connected", () => {
			console.log("[MongoDB]".magenta, colors.cyan(name), "connected!");
			if(connected)
			{
				connected();
			}
		});

		this.connections[name].on('disconnected', () => {
			//SlackAlerts.alert("error", "MongoDB Error:", "Connection lost?");
			console.log("[MongoDB]".magenta, colors.cyan(name), "Disconnected! Retrying in 5 seconds");
			this.connections[name].close();
			setTimeout(() => {
				
				this.openConnection(name);
			}, 5000);
		});
	}

	buildConnectionString(Connection)
	{
		let ConnectionString = "mongodb://";
		if(Connection.User)
		{
			ConnectionString += encodeURIComponent(Connection.User);
		}
		if(Connection.Password)
		{
			ConnectionString += ":" + encodeURIComponent(Connection.Password);
		}
		if(Connection.Hostname)
		{
			if(Connection.User)
			{
				ConnectionString += "@";
			}
			ConnectionString += Connection.Hostname;
		}
		if(Connection.ReplicaSet && Connection.Replicas)
		{
			if(Connection.User)
			{
				ConnectionString += "@";
			}

			for(let Replica of Connection.Replicas)
			{
				ConnectionString += Replica.Hostname;
				ConnectionString += ":" + Replica.Port + ",";
			}
			ConnectionString = ConnectionString.slice(0, -1);
		}
		if(Connection.Port)
		{
			ConnectionString += ":" + Connection.Port;
		}

		if(Connection.Database)
		{
			ConnectionString += "/" + Connection.Database;
		}
		if(Connection.ReplicaSet)
		{
			ConnectionString += "?replicaSet=" + Connection.ReplicaSet
		}
		
		return ConnectionString;
	
	}

	loadModels(name)
	{
		//console.log("Loading models for", name, Models);
		for(let model in Models)
		{
			
			if(!Models[model].connection)
			{
				Models[model].connection = "default";
			}

			if(Models[model].connection == name)
			{
				console.log("[MongoDB]".magenta, colors.cyan(name), "-> loading model:", colors.cyan(model));
				Models[model].plugin(mongooseHidden);
				global[model] = this.connections[name].model(model, Models[model]);
			}
		}
	}
	
};