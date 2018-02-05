@Response("serverError")
export default class ServerErrorResponse
{
	index(req, res, error)
	{
		console.log("[SERVER ERROR]:", error);
		res.status(500);
		res.json({success: false, error: true, message: "Server Errror"});
		
		//console.error(err.stack);
	}
}