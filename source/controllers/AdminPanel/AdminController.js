var os = require("os");
@Controller("/admin")
class AdminController
{
	@GET("/")
	@ACL(["Admin"])
	index(req, res)
	{
		res.json({success: true});
	}

	@GET("/status")
	@ACL(["Admin", "Admin.Status"])
	status(req, res)
	{
		// db.query("SHOW GLOBAL STATUS").then(function(result)
		// {
		// 	console.log("SQL Status:", result);
		// });
		res.json({success: true,
			status: {
				cpus: os.cpus(),
				loadavg: os.loadavg(),

				arch: os.arch(),
				ostype: os.type(),
				platform: os.platform(),

				totalmem: os.totalmem(),
				freemem: os.freemem(),
				
				network: os.networkInterfaces(),
				uptime: os.uptime(),
			}
		});
	}

	@GET("/console")
	@ACL(["Admin", "Admin.System.Console"])
	console(req, res)
	{
		res.json({success: true});
	}

};