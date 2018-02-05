@Response("notFound")
export default class NotFoundResponse
{
	index(req, res)
	{
		console.log("404 Not found: ", req.url);
		res.status(404);
		res.json({success: false, not_found: true, message: "Not Found"});
	}
}