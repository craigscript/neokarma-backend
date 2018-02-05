module.exports = {
	//Accept origins:
	origin: [
		"http://127.0.0.1",
		"http://localhost",
		"http://127.0.0.1:4200",
		"http://localhost:4200",
				
		"https://127.0.0.1",
		"https://localhost",
		"https://127.0.0.1:4200",
		"https://localhost:4200",
		"http://18.217.234.65:4201",
		
		// Live Origins
		"http://neokarma.com",
		"https://neokarma.com",
		// Dev Origins
		"http://dev.neokarma.com",
		"https://dev.neokarma.com",
		// Beta Origins
		"http://beta.neokarma.com",
		"https://beta.neokarma.com",

		// Roman Mobile Test
		"http://192.168.0.106",
		"http://192.168.0.106:4200",
		"https://192.168.0.106",
		"https://192.168.0.106:4200",

		// Office Mobile Test
		"http://192.168.1.104",
		"http://192.168.1.104:4200",
		"https://192.168.1.104",
		"https://192.168.1.104:4200",

		// Robert mobile test
		"http://192.168.1.100:4200",
		"https://192.168.1.100:4200",
		
		// Roman local testing
		"http://localhost:8080",
		"https://localhost:8080",

		// Local Area Network Ranges
		// "http://192.168.*.*/",
		// "http://192.168.*.*:4200/",
		// "https://192.168.*.*/",
		// "https://192.168.*.*:4200/",
	],
	allowedHeaders: [
		'Content-Type',
		'Authorization',
		'X-Access-Token'
	],
	maxAge: 300,
	preflightContinue: false,
	// Require Credentials?
	credentials: true,
}