module.exports = {
	servers: [

		// Germany
		{
			hostname: "144.76.27.210",
			username: "neokarma",
			privateKey: "./deploy/neokarma-gb-1-neokarma.ppk",
			environments: {
				
			}
		},
		// Asia
		{
			hostname: "159.89.202.0",
			username: "neokarma",
			privateKey: "./deploy/neokarma-sp-1-neokarma.ppk",
			environments: {
				
			}
		},
		// US
		{
			hostname: "165.227.10.25",
			username: "neokarma",
			privateKey: "./deploy/neokarma-sf-1-neokarma.ppk",
			environments: {
				
			}
		}
	],
	environments: {
		dev: {
			repository: "git@github.com:veivo/neokarma-backend.git",
			branch: "orgin/master",
			gitPrivateKey: "/home/neokarma/.ssh/github-neokarma-backend.ppk",
			remote: "/home/neokarma/test-apps/neokarma-backend/",
			cwd: "/home/neokarma/test-apps/neokarma-backend/",
			uploads: [
				{
					local: "./deploy/{$hostname}/config/database.{$env}.js",
					remote: "./build/server/config/Database.js"
				},
				{
					local: "./deploy/{$hostname}/config/express.{$env}.js",
					remote: "./build/server/config/express.js"
				},
			],
			stop_scripts: [
				"pm2 delete dev-neokarma-backend",
			],
			pre_setup: [
				
			],
			status_scripts: [
				"pm2 list dev-neokarma-backend",
			],
			pre_install: [
				"npm install -d",
				"gulp compile",
			],
			post_install: [
				//"pm2 start start.sh -i 6",
			],
			start_scripts: [
				"pm2 start {$remotePath}/build/server/Boot.js --name dev-neokarma-backend -i 2",
				//"chmod 0777 /home/neokarma/dev-cluster.sock"
			],
		},
		beta: {
			repository: "git@github.com:veivo/neokarma-backend.git",
			branch: "orgin/master",
			gitPrivateKey: "/home/neokarma/.ssh/github-neokarma-backend.ppk",
			remote: "/home/neokarma/beta-apps/neokarma-backend/",
			uploads: [
				{
					local: "./deploy/{$hostname}/config/database.{$env}.js",
					remote: "./build/server/config/Database.js"
				},
				{
					local: "./deploy/{$hostname}/config/express.{$env}.js",
					remote: "./build/server/config/express.js"
				},
			],
			stop_scripts: [
				"pm2 delete beta-neokarma-backend",
			],
			pre_setup: [
				
			],
			status_scripts: [
				"pm2 list beta-neokarma-backend",
			],
			pre_install: [
				"npm install",
				"gulp compile",
			],
			post_install: [
				//"pm2 start start.sh -i 6",
			],
			start_scripts: [
				"pm2 start {$remotePath}/build/server/Boot.js --name beta-neokarma-backend -i max",
				//"chmod 0777 /home/neokarma/dev-cluster.sock"
			],
		},
		production: {
			repository: "git@github.com:veivo/neokarma-backend.git",
			branch: "orgin/master",
			gitPrivateKey: "/home/neokarma/.ssh/github-neokarma-backend.ppk",
			remote: "/home/neokarma/production-apps/neokarma-backend/",
			cwd: "/home/neokarma/production-apps/neokarma-backend/",
			uploads: [
				{
					local: "./deploy/{$hostname}/config/database.{$env}.js",
					remote: "./build/server/config/Database.js"
				},
				{
					local: "./deploy/{$hostname}/config/express.{$env}.js",
					remote: "./build/server/config/express.js"
				},
			],
			stop_scripts: [
				"pm2 delete production-neokarma-backend",
			],
			pre_setup: [
				
			],
			status_scripts: [
				"pm2 list production-neokarma-backend",
			],
			pre_install: [
				"npm install",
				"gulp compile",
			],
			post_install: [
				//"pm2 start start.sh -i 6",
			],
			start_scripts: [
				"pm2 start {$remotePath}/build/server/Boot.js --name production-neokarma-backend -i max",
				//"chmod 0777 /home/neokarma/dev-cluster.sock"
			],
		}
	},
	
};