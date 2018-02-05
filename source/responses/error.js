@Response("error")
export default class ErrorResponse
{
	index(req, res, message)
	{
		console.log("400 Bad request:", req.url, "Message:", message);
		res.status(400);
		res.json({success: false, message: message});
	}
}