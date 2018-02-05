@Controller("/tests")
class TestsController
{
	// Returns the information for the current user.
	@GET("/emailTest")
	emailTest(req, res)
	{
		
		// var mail = new Email(["azarusx@gmail.com"], "Welcome to Neokarma!");
		// mail.setTemplate("emails/user-signup-track", {
		// 	url: Config.site.url,
		// 	emailToken: "123",
		// 	email: "azarusx@gmail.com",
		// 	password: "test123",
		// });
		// mail.send(() =>
		// {
		// 	console.log("Email sent.");
		// });
		//return res.json({ success: true, confirm: false });
		var mail = new Email(["azarusx@gmail.com"], "How are you?");
		mail.setTemplate("emails/test");
		mail.setContent("Hi there!");
		mail.send((response) =>
		{
			console.log("Email sent:", response);
			res.json({success: true});
		});
		
	
	}
	
	@GET("/quotaset")
	quotaset(req, res)
	{
		res.json({success: UserQuota.setQuota(req.user, "asd.xd", 1, 10), quotas: req.user.quotas});
	}
	

	@GET("/quotaval")
	quotaval(req, res)
	{
		res.json({success: UserQuota.validate(req.user, "asd.xd", 1), quotas: req.user.quotas});
	}
	
	@GET("/quotaup")
	quotaup(req, res)
	{
		res.json({success: UserQuota.update(req.user, "asd.xd", 1), quotas: req.user.quotas});
	}

	
	@GET("/quotadown")
	quotadown(req, res)
	{
		res.json({success: UserQuota.update(req.user, "asd.xd", -1), quotas: req.user.quotas});
	}

	//@Quota("mention.limit")
	@GET("/quotaDecorator")
	quotaCheck(req, res)
	{
		UserQuota.Increment(req.user, "mention.limit");
		res.json({success: true});
	}

	@GET("/quotaCheck")
	quotaCheck(req, res)
	{
		UserQuota.Increment(req.user, "mention.limit");

		if(!UserQuota.isAllowed(req.user, "mention.limit"))
		{
			return res.json({success: false, message: "Mention limit quota reached."});
		}

		res.json({success: true});
	}

};