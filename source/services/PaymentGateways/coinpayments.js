var Coinpayments = require('coinpayments');
let crypto = require('crypto');
let qs = require('querystring');
export default class CointPaymentGateway
{
	constructor()
	{
		this.Gateway = new Coinpayments(Config.cointpayments.options);
	}
	
	getPaymentMethods()
	{
		return [{
			name: "Bitcoin",
			currencies: ["BTC"],
			gateway: "coinpayment",
		},
		{
			name: "Ethereum",
			currencies: ["ETH"],
			gateway: "coinpayment",
		}];
	}

	generatePaymentId()
	{

	}

	getWalletInfo()
	{
		return new Promise((resolve, reject) => {
			this.Gateway.getBasicInfo(( error, info )=>
			{
				if(error || !info)
				{
					return reject(error);
				}
					
				resolve(info);
			});
		});
	}

	createIPNTransaction( transactionInfo )
	{
		
		let options = {
			currency1: transactionInfo.currency,
			currency2: transactionInfo.targetCurrency,
			amount: transactionInfo.amount,
			ipn_url: transactionInfo.ipnURL
		};
		console.log("Creating IPN:", options);
		return new Promise((resolve, reject) => {
			if(Config.cointpayments.currencies.indexOf(transactionInfo.targetCurrency) < 0)
				return reject("Invalid currency:" + transactionInfo.targetCurrency);
			this.Gateway.createTransaction(options, (error, transaction) => {
		
				if(error || !transaction)
				{
					return reject(error);
				}
			
				return resolve(transaction);
			});
		});
	}

	startPayment()
	{
		return new Promise((success) => {

		});
	}

	checkPaymentStatus()
	{

	}

	validateHMAC(parameters, secret)
	{
		let signature, paramString;
		paramString = qs.stringify(parameters).replace(/%20/g, '+')
	  	signature = crypto.createHmac('sha512', secret).update(paramString).digest('hex');
	  	return signature;
	}
	
	handleIPN(req, res)
	{
		return new Promise((resolve, reject) => {

			if(!req.get('HMAC') || !req.body || !req.body.ipn_mode || req.body.ipn_mode != 'hmac' || Config.cointpayments.MerchantId != req.body.merchant)
			{
        		return resolve({success: false, message: "invalid request."});
      		}

			let hmac = this.validateHMAC(req.body, Config.cointpayments.IPNSecret);
			if(hmac != req.get('HMAC'))
			{
				return resolve({success: false, message: "invalid request."});
			}
			if(req.body.status < 0)
			{
				return resolve({success: false, failed: true, message: "Transaction failed."});
			}
			if(req.body.status < 100)
			{
				return resolve({success: false, pending: true, message: "pending."});
			}
			if(req.body.status == 100)
			{
				return resolve({success: true});
			}
			return resolve({success: false, message: "unkown request."});
		});
	}
}