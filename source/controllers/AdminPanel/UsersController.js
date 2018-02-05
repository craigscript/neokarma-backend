
@Controller("/admin/users")
class AdminController
{
	@POST("/search")
	@ACL(["Admin", "Admin.Users"])
	search(req, res)
	{
		var searchTerm = req.body.search;
		User.find({
			
				$or: [
					// { _id: { $regex: searchTerm, $options: "i" } },
					{ email: { $regex: searchTerm, $options: "i" } },
					{ firstname: { $regex: searchTerm, $options: "i" } },
					{ lastname: { $regex: searchTerm, $options: "i" } },
					{ phone: { $regex: searchTerm, $options: "i" } },
					{ address: { $regex: searchTerm, $options: "i" } },
				]
			
		}).populate("group").then( users => {

			res.json({success: true, users: users});

		}).catch(error => {
			res.serverError(error);
		});
	}

	@POST("/details")
	@ACL(["Admin", "Admin.Users"])
	details(req, res)
	{
		var _id = req.body._id;
		if(!_id)
			return res.json({success: false, message: "No such user"});
		User.findOne({_id: _id}).then( user =>{
			res.json({success: true, user: user});
		}).catch( error => {
			res.serverError(error);
		})
	}

	@POST("/create")
	@ACL(["Admin", "Admin.Users.Create"])
	create(req, res)
	{
		var user = req.body.user;
		if(!user)
			return res.json({success: false, message: "No user data"});
		var passwordText = (0|Math.random()*9e6).toString(36);
		user.password = User.createPassword(passwordText);
		console.log("Creating user:", user);
		UserGroup.findOne({_id: user.group}).then( group => {

			if(!group)
				return res.json({success: false, message: "No group"});
			

			var mail = new Email([user.email], {name: "FACT", email: "noreply@fact.com"}, "FACT - Welcome to fact");
			mail.setTemplate("emails/welcome_newuser", {url: req.protocol + '://' + req.get('host'), email: user.email, password: passwordText, groupName: group.name});
			mail.send(function() {
				// Mail sent!
			});

			User.create(user).then(user => {
				res.json({success: true, user: user});
			}).catch(error => {
				res.serverError(error);
			})
		})
	}

	@POST("/update")
	@ACL(["Admin", "Admin.Users.Update"])
	update(req, res)
	{
		var _id = req.body._id;
		var user = req.body.user;
		delete user.password;
		
		User.update({_id: _id}, user).then(user => {
			res.json({success: true, result: user});
		}).catch(error => {
			res.serverError(error);
		})
	}

	@POST("/updatepassword")
	@ACL(["Admin", "Admin.Users.Update"])
	updatepassword(req, res)
	{
		var _id = req.body._id;
		var passwordText = req.body.password;
		User.findOne({_id: _id}).then( user => {
			
			if(!user)
				return res.json({success: false, message: "No such user"});

			User.update({_id: _id}, {password: User.createPassword(passwordText)}).then( result => {
			
				var mail = new Email([user.email], {name: "FACT", email: "noreply@fact.com"}, "FACT - Your new password");
				mail.setTemplate("emails/password_changed", {url: req.protocol + '://' + req.get('host'), password: passwordText});
				mail.send(function() {
					// Mail sent!
				});

				res.json({success: true});
			}).catch(error => {
				res.serverError(error);
			})
		})
	}

	@POST("/delete")
	@ACL(["Admin", "Admin.Users.Delete"])
	delete(req, res)
	{
		var _id = req.body._id;
		User.destroy({_id: _id}).then(() => {
			res.json({success: true});
		}).catch(error => {
			res.serverError(error);
		})
	}


};