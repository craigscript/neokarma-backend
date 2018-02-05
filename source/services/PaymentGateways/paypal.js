var paypalSDK = require("paypal-rest-sdk");

import { PayPalSubscription } from "./paypal/Subscription.js";

export default class PaypalGateway
{
	constructor()
	{
		paypalSDK.configure(Config.paypal.options);
	}

	getPaymentMethods()
	{
		return [{
			name: "Paypal",
			currencies: ["USD", "EUR"],
			gateway: "paypal",
		}];
	}

	generatePaymentId()
	{

	}

	getWalletInfo()
	{
		return new Promise((resolve, reject) => {
			return reject("Not implemented");
		});
	}

	createSubscription( transactionInfo )
	{

		return new Promise((resolve, reject) => {
			console.log("Plan:", transactionInfo);
			// Create plan
			PayPalSubscription.createPlan({
				name: transactionInfo.name,
				description: transactionInfo.description,
				currency: transactionInfo.currency,
				amount: transactionInfo.amount,
				frequency_interval: transactionInfo.interval,
				frequency: transactionInfo.frequency,
				cancel_url: transactionInfo.cancelURL,
				return_url: transactionInfo.returnURL,
			}).then( planDetails => {
				
				console.log("[PayPal] Plan Created:", planDetails.id);

				// Activate plan
				PayPalSubscription.activatePlan(planDetails.id).then( result => {
					console.log("[PayPal] Plan Activated:", planDetails.id);
			
					
					// Create agreement
					PayPalSubscription.createAgreement({
						planId: planDetails.id,
						name: transactionInfo.name,
						description: transactionInfo.description,
					}).then( agreement => {
						console.log("[PayPal] Agreement created:", agreement.id);

						resolve(agreement);
					}).catch( error => {
						console.log("[PayPal] Paypal error:", error);
						return reject(error);
					});

				}).catch( error => {
					return reject(error);
				});

			}).catch( error => {
			
				return reject(error);
			});
			
			
		});
	}

	executeSubscription( transactionDetails )
	{
		return PayPalSubscription.executeAgreement(transactionDetails.token).then(( result ) => {
			
			if(result.state == 'Active')
			{
				return {
					payer: result.payer,
					start_date: result.start_date,
					shipping_address: result.shipping_address,
					plan: result.plan,
				};
			}
			return result;
		});
		
	}

	getSubscriptionStatus( transactionDetails )
	{
		
	}

	createIPNTransaction( transactionInfo )
	{


	}

	startPayment()
	{
		return new Promise((success, reject) => {
			return reject("Not implemented");
		});
	}

	checkPaymentStatus()
	{
		return new Promise((success, reject) => {
			return reject("Not implemented");
		});
	}
}