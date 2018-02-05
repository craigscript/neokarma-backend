
@Controller("/admin/groups")
class AdminController
{
	@GET("/list")
	@ACL(["Admin", "Admin.Users"])
	list(req, res)
	{
		UserGroup.find().then(response => {
			res.json({success: true, groups: response});
		}).catch( error => {
			res.serverError(error);
		});
	}

	@GET("/acls")
	@ACL(["Admin", "Admin.Users"])
	acls(req, res)
	{
		res.json({success: true, acls: ACL.list});
	}


	@POST("/details")
	@ACL(["Admin", "Admin.Users"])
	details(req, res)
	{
		var _id = req.body._id;
		if(!_id)
			return res.json({success: false, message: "No groupId"});
		UserGroup.findOne({_id: _id}).then( group =>{
			res.json({success: true, group: group});
		}).catch( error => {
			res.serverError(error);
		})
	}

	@POST("/create")
	@ACL(["Admin", "Admin.Users.Create"])
	create(req, res)
	{
		var group = req.body.group;
		if(!group)
			return res.json({success: false, message: "No group data"});
		UserGroup.create(group).then(group => {
			res.json({success: true, group: group});
		}).catch(error => {
			res.serverError(error);
		})
	}

	@POST("/update")
	@ACL(["Admin", "Admin.Users.Update"])
	update(req, res)
	{
		var _id = req.body._id;
		var group = req.body.group;
		UserGroup.update({_id: _id}, group).then(group => {
			res.json({success: true, group: group});
		}).catch(error => {
			res.serverError(error);
		})
	}

	@POST("/delete")
	@ACL(["Admin", "Admin.Users.Delete"])
	delete(req, res)
	{
		var _id = req.body._id;
		UserGroup.remove({_id: _id}).then(() => {
			res.json({success: true});
		}).catch(error => {
			res.serverError(error);
		})
	}


};