module.exports = {
	options: {
		'mode': 'sandbox', //sandbox or live
		'client_id': 'ARvB1aT2YeV7Kr8R0TuDCgFzyiSRW4QZHs7K4o9ILYWmQU0ko4VbGvCGutvwX9VvAqSca6uYmFT8eKux',
		'client_secret': 'EJoGPJmogP48LyDKL3ZfENafbNmkqwaT8HhnxZ63UPxw1C_gfO6tP4_p0A-eXKLlhysLfEDZ8LMyqSNa'
	},
	currencies: [
		"USD",
		"EUR",
	],

	getReturnURL: (payment) => {
		return "http://127.0.0.1:4200/#/app/payment/paypal-confirm/" + payment._id;
	},

	getCancelURL: (payment) => {
		return "http://127.0.0.1:4200/#/app/payment/paypal-cancel/" + payment._id;
	},
};