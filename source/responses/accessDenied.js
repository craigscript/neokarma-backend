@Response("accessDenied")
export default class AccessDeniedResponse
{
	index(req, res)
	{
		console.log("403 Access Denied: ", req.url);
		res.status(403);
		res.json({success: false, login_required: true, message: "Access denied, please log in!"});
	}
}