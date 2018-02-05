var paypalSDK = require("paypal-rest-sdk");
var url = require("url");

export class PayPalSubscription
{
	static createPlan( planDetails )
	{
		let billingPlan =  {
			name: planDetails.name,
			description: planDetails.description,
			merchant_preferences: {
				auto_bill_amount: "YES",
				cancel_url: planDetails.cancel_url,
				initial_fail_amount_action: "continue",
				max_fail_attempts: "0",
				return_url: planDetails.return_url,
				setup_fee:
				{
					currency: planDetails.currency,
					value: planDetails.amount
				}
			},
			payment_definitions: [
			{
				amount: {
						currency: planDetails.currency,
						value: planDetails.amount
				},
				charge_models: [
					{
						amount: {
							currency: planDetails.currency,
							value: planDetails.amount
						},
						type: "SHIPPING"
					},
				],
				cycles: "0",
				frequency: planDetails.frequency,
				frequency_interval: planDetails.frequency_interval,
				name: planDetails.name,
				type: "REGULAR"
			}],
			type: "INFINITE"
		};

		return new Promise((resolve, reject) => {
			paypalSDK.billingPlan.create(billingPlan, (error, billingPlan) => {
				if(error)
				{
					return reject(error);
				}
				resolve( billingPlan );
			});
		});
	}

	static activatePlan( planId )
	{
		return new Promise((resolve, reject) => {
			paypalSDK.billingPlan.update(planId, [{
				op: "replace",
				path: "/",
				value: {
					state: "ACTIVE",
				}
			}], (error, response) => {
				if(error)
				{
					return reject(error);
				}
				resolve(response);
			});
		});
	}

	static deactivatePlan( planId )
	{
		return new Promise((resolve, reject) => {
			paypalSDK.billingPlan.update(planId, {
				"op": "replace",
				"path": "/",
				"value": {
					"state": "INACTIVE"
				}
			}, (error, response) => {
				if(error)
				{
					return reject(error);
				}
				resolve(response);
			});
		});
	}

	static createAgreement( agreementDetails )
	{

		var isoDate = new Date();
		isoDate.setSeconds(isoDate.getSeconds() + 4);
		isoDate.toISOString().slice(0, 19) + 'Z';


		let billingAgreementAttributes = {
			name: agreementDetails.name,
			description: agreementDetails.description,
			start_date: isoDate,
			plan: {
				id: agreementDetails.planId,
			},
			payer: {
				payment_method: "paypal"
			},
			// shipping_address: {
			// 	"line1": "StayBr111idge Suites",
			// 	"line2": "Cro12ok Street",
			// 	"city": "San Jose",
			// 	"state": "CA",
			// 	"postal_code": "95112",
			// 	"country_code": "US"
			// }
		};

		return new Promise((resolve, reject) => {
			paypalSDK.billingAgreement.create(billingAgreementAttributes, (error, agreement) => {
				if(error)
				{
					return reject(error);
				}else{

					let approval_url = agreement.links.find(( link ) => {
						if(link.rel === 'approval_url')
							return true;
					}).href;

					//console.log("Created agreement:", agreement.links);
					let transaction = {
						id: agreement.id,
						method: "redirect",
						action_required: "approval",
						href: approval_url,
						token: url.parse(approval_url, true).query.token,
					};

					return resolve(transaction);
				}
			});
		});
	}

	static executeAgreement( paymentToken )
	{
		console.log("[PayPal] executeAgreement paymentToken:", paymentToken);
		return new Promise( (resolve, reject) => {
			paypalSDK.billingAgreement.execute(paymentToken, {}, (error, agreement) => {
				if(error)
				{
					return reject(error);
				}
				
				resolve(agreement);
			});
		});
		
	}
};