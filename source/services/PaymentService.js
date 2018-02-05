import * as PaymentGateways from "glob:./PaymentGateways/*.js";


@Service
class PaymentService
{
	static CreateGateway(GatewayName)
	{
		try
		{
			if(!PaymentGateways[GatewayName])
				return null;
			return new PaymentGateways[GatewayName]();
		}catch(error)
		{
			console.log("Error:", error);
			return null;
		}
		
	}

	static getGateways()
	{
		let gateways = [];
		for(let gwName in PaymentGateways)
		{
			gateways.push(PaymentService.CreateGateway(gwName));
		}
		return gateways;
	}

	// static CRONUpdate()
	// {
	// 	UserPayment.find({
	// 		expires: {
	// 			$lt: Date.now(),
	// 		},
	// 		status: {
	// 			$ne: "InProgress",
	// 		}
	// 	}).then( payments => {
	// 		for(let payment of payments)
	// 		{
	// 			PaymentService.pollTransaction(payment.gateway, payment.transaction).then( result => {
	// 				if(result.paid)
	// 				{
	// 					payment.status = "Paid";
	// 					payment.paid = Date.now();
	// 					payment.save();	
	// 				}
	// 			});
	// 		}
	// 	});

	// 	UserPayment.remove({
	// 		expires: {
	// 			$gt: Date.now(),
	// 		},
	// 		status: {
	// 			$ne: "Paid",
	// 		}
	// 	});
	// }
};

// setInterval( () => {
// 	PaymentService.CRONUpdate();
// }, 15000);
