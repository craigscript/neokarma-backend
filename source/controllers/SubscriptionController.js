var tokenGenerator = require('generate-password');


@Controller("/subscription")
class SubscriptionController
{
	// Returns all the notifications settings for the current users
	@GET("/getPlans")
	getPlans(req, res)
	{
		SubscriptionPlans.find().then( plans => {
			res.json({ success: true, plans: plans });
		});
	}

	// Returns all the payment methods
	@GET("/getPaymentMethods")
	getPaymentMethods(req, res)
	{
		let gateways = PaymentService.getGateways();
		let paymentMethods = [];
		for(let gateway of gateways)
		{
			let methods = gateway.getPaymentMethods();
			for(let method of methods)
			{
				paymentMethods.push(method);
			}
			
		}
		
		res.json({ success: true, paymentMethods: paymentMethods });
	}

	// Returns the upgrade plan description and prices based on the current plan. If theres any.
	@GET("/getUpgradePlan/:planId")
	getUpgradePlan(req, res)
	{
		let planId = req.params.planId;
		SubscriptionPlans.findOne({_id: planId}).then( plan => {
			if(!plan)
			{
				return res.json({success: false, message: "No such plan."});
			}
			res.json({ success: true, plan: plan });
		}).catch( error => {
			
			res.serverError(error);
		});
		
	}

	// Creates a payment to fund a plan ONCE
	@GET("/executeTrial/:planId")
	executeTrial(req, res)
	{
		let planId = req.params.planId;

		console.log("user:", req.user)
		if(req.user.subscription)
		{
			return res.json({success: false, message: "Subscription already active."});
		}
		console.log("subscription:", req.user.subscription)
		SubscriptionPlans.findOne({ _id: planId }).then( plan => {
			if(!plan.trial)
			{
				return res.json({success: false, message: "Selected plan is not trial"});
			}
			console.log("Found plan:", plan);
			SubscriptionService.createSubscription(req.user._id, plan).then(() => {
				return res.json({success: true});
			});
		});
	}
	// Creates a payment to fund a plan ONCE
	@POST("/createPayment/:planId/:gateway")
	createPayment(req, res)
	{
		let planId = req.params.planId;
		let gatewayName = req.params.gateway;
		let paymentOptions = req.body.paymentOptions;

		SubscriptionPlans.findOne({ _id: planId }).then( plan => {
			
			if(!plan)
			{
				return res.json({success: false, message: "Invalid plan"});
			}	

			let gateway = PaymentService.CreateGateway(gatewayName);
			if(!gateway)
			{
				return res.json({success: false, message: "Invalid gateway."});	
			}
			
			let paymentToken = tokenGenerator.generate({
				length: 10,
				numbers: true
			});
		
			UserPayment.create({
				paymentToken: paymentToken,
				user: req.user._id,
				name: plan.name,
				price: plan.price,
				currency: plan.currency,
				gateway: gatewayName,
				status: "InProgress",
				plan: plan,
				expires: Date.now() + (60 * 60 * 2 * 1000), // Expire in 1 hours
			}).then( payment => {

				gateway.createIPNTransaction({
					name: plan.name,
					description: plan.description,
					currency: plan.currency,
					targetCurrency: paymentOptions.targetCurrency,
					amount: plan.price,
					ipnURL: Config.site.serverUrl + "/subscription/ipn/" + paymentToken
				}).then( transaction => {

						payment.transaction = transaction;
						payment.save();
						
						res.json({
							success: true,
							payment: payment.toJSON()
						});
				
				}).catch( error => {
					payment.remove();
					console.log("[TransactionError]:", error,  error.details);
					res.json({
						success: false,
						message: "Failed to start transaction",
						error: error,
					});
				});
			}).catch( error => {
				res.serverError(error);
			})
				
		}).catch( error => {

			res.serverError(error);
		});

	}

	// Creates a subscription to fund a plan until the subscription is canceled.
	@POST("/createSubscription/:planId/:gateway")
	createSubscription(req, res)
	{
		let planId = req.params.planId;
		let gatewayName = req.params.gateway;
		//let paymentOptions = req.body.paymentOptions;
		//let currency = paymentOptions.currency;

		SubscriptionPlans.findOne({ _id: planId }).then( plan => {
			
			if(!plan)
			{
				return res.json({success: false, message: "Invalid plan"});
			}	
			
			let gateway = PaymentService.CreateGateway(gatewayName);
			if(!gateway)
			{
				return res.json({success: false, message: "Invalid gateway."});	
			}
			
			let paymentToken = tokenGenerator.generate({
				length: 10,
				numbers: true
			});
		
			UserPayment.create({
				paymentToken: paymentToken,
				user: req.user._id,
				name: plan.name,
				price: plan.price,
				currency: plan.currency,
				gateway: gatewayName,
				status: "InProgress",
				plan: plan,
				expires: Date.now() + (60 * 60 * 2 * 1000), // Expire in 1 hours
			}).then( payment => {
				gateway.createSubscription({
					name: plan.name,
					description: plan.description,
					currency: plan.currency,
					interval: 31,
					frequency: "DAY",
					amount: plan.price,
					cancelURL: Config.paypal.getCancelURL(payment),
					returnURL: Config.paypal.getReturnURL(payment),
				
				}).then( transaction => {

						payment.transaction = transaction;
						payment.save();
						
						res.json({
							success: true,
							payment: payment.toJSON()
						});
				
				}).catch( error => {
					//console.log("[TransactionError]:", error,  error.details);
					res.json({
						success: false,
						message: "Failed to start transaction",
						error: error,
					});
				});
			}).catch( error => {
				res.serverError(error);
			})
				
		}).catch( error => {

			res.serverError(error);
		});
	}

	// Callback to execute the subscription after its initialized.
	@POST("/executeSubscription/:paymentId")
	executeSubscription(req, res)
	{
		let paymentId = req.params.paymentId;
		UserPayment.findOne({
			_id: paymentId,
			user: req.user._id
		}).then( payment => {

			if(!payment)
				return res.json({success: false, message: "Invalid paymentId"});

			let gateway = PaymentService.CreateGateway(payment.gateway);
			gateway.executeSubscription(payment.transaction).then( subscription => {

				payment.status = 'Paid';
				payment.save();
				SubscriptionService.createSubscription(req.user._id, payment.plan).then( () => {
					res.json({success: true, payment: payment, transaction: subscription});
				});
			}).catch( error => {
				console.log("error:", error);
				res.json({success: false, message: "Failed to finish payment."});
			});
			
		}).catch( error => {
			res.serverError(error);
		});
	}

	// IPN Service
	@ANY("/ipn/:paymentToken")
	instantPaymentNotification(req, res)
	{
		let paymentToken = req.params.paymentToken;
		
		console.log("[IPN] Body:", req.body.status, req.body.status_text);
		

		UserPayment.findOne({
			paymentToken: paymentToken,
		}).then( payment => {
			
			if(!payment)
				return res.json({success: false});
			

			let gateway = PaymentService.CreateGateway(payment.gateway);
			if(!gateway)
			{
				return res.json({success: false, message: "Invalid gateway."});	
			}

			gateway.handleIPN(req, res).then( result => {
				// Check if the required information is the same.
				if(result.success)
				{
					
					console.log("Payment confirmed!", result, payment.status);
					SubscriptionService.createSubscription(payment.user, payment.plan).then(() => {
						payment.status = "Paid";
						payment.paid = Date.now();
						payment.save();
					});
					return res.json({
						success: true,
					});
				}

				if(result.failed)
				{
					payment.status = "Failed";
					payment.save();
				}

				if(result.pending)
				{
					payment.status = "Pending";
					payment.save();
				}
				console.log("Payment failed:", result.message);
				res.json(result);
			})
		});
	}

	// Returns a single payment description
	@GET("/getPayment/:paymentId")
	getPayment(req, res)
	{
		let paymentId = req.params.paymentId;

		UserPayment.findOne({
			_id: paymentId,
			user: req.user._id
		}).then( payment => {

			if(!payment)
				return res.json({success: false, message: "Invalid paymentId"});

			res.json({success: true, payment: payment.toJSON()});
		}).catch( error => {
			res.serverError(error);
		});
	}

	// Returns the payments made by the current user
	@GET("/getPayments")
	getPayments(req, res)
	{
		UserPayment.find({
			user: req.user._id
		}).sort({created: -1}).then( payments => {

			res.json({success: true, payments: payments});
		}).catch( error => {
			res.serverError(error);
		});

	//	res.json({success: false, message: "Not implemented"});
	}

	// Cancels the current user subscription.
	@POST("/cancelSubscription")
	cancelSubscription(req, res)
	{
		res.json({success: false, message: "Not implemented"});
	}

};