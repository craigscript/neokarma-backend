import * as Sources from "glob:./Sources/*.js";

@Controller("/sources")
class SourcesController
{
	@GET("/getSources")
	getSources(req, res)
	{
		return res.json({
			success: true,
			sources: [
				"reddit",
				"twitter",
				"market"
			]
		});
	}

	@GET("/getSourceOptions/:type")
	getSourceOptions(req, res)
	{
		let type = req.params.type;
		
		if(!Sources[type])
			return res.json({success: false, message: "Source not found"});
		let source = new Sources[type]();
		return source.getSourceOptions(req, res);
	}
};