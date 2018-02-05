//var mg = require('nodemailer-mailgun-transport');
const mailgunTransporter = require('nodemailer-mailgun-transport');

module.exports = {
	// These policies apply everywhere by default
	transporter: mailgunTransporter({
		auth: {
			api_key: 'key-d4695d635e556e0fe05e6a38348162d6',
			domain: 'mg.neokarma.com',
		}
	}),	
	
	//     {
	// 	host: 'smtp.mailgun.org',
	// 	port: 587,
	// 	secure: false, // upgrade later with STARTTLS
	// 	// auth: {
	// 	// 	user: 'salami@mg.neokarma.com',
	// 	// 	pass: '/@#$rgf3v%TERGgema'
	// 	// },

	// 	//secure: true,
	// 	// dkim: {
	// 	// 	domainName: 'neokarma.com',
	// 	// 	keySelector: 'k1',
	// 	// 	privateKey: '-----BEGIN RSA PRIVATE KEY-----\nMIICWgIBAAKBgGVhGTUUKOBNNu2D2NYuPpKcLSPfnlByiXLy50QIiyyxTVufT4/8\nFSb8bVZxk6y6Z9dRzV66leLk0MUUzLDKuJRCIqU1DUEQS1ia0xKLeBno/tHkXa92\ndT1u55M4BAP1cuQITFfT5Y7Kfn/eLYp6BZbtgYj0H1ytzOYxRTmbHUSpAgMBAAEC\ngYAA3C4GkUE3hfAtW6z/RC0ruT94ynDhZddcrkrf/OKRYn+xg0x9gDn9tq6GyTfj\ng0FWRk9julmDL0XGJkMGTPH77T7qP0aD47gsfKR6EhFCtPN5Srtg4SIK7Feuapt5\nI7U9JVrsvj0r2ZE7jRrPgTe8w0iuH0zdEcNC/q0Cmtg5wQJBAL0f3DVmIXBTiFDw\no7k6l8n+8Gw9Z7wRYMvyyKWANVxOQ8dI5rc7l3uU6N1gpEJV1mKOAd05HdT/5SaJ\ny48zO8UCQQCJOkU6PLAXpq7C/qa+Sgs7do9q7OQKFKRJWqheE5QKPCzfXo/isF8G\nljJ5RFS1Rdyei75ZqyPafXYFNGTnnj+VAkAd5Akzz159mFY1JLNbtS0EWey5zsK0\ncLKxyT95GNhWLHB98MG2OA7rE0/ynTGY4mQt02/r/PkADymye5jWmyxZAkBAi+II\nFIeXeFV3bqQrmVRTMd8fojFY9ICZ6ESNi5P0hH1uy2HOdLsdtAQluhhF84hkIsL0vFmWU3bJnnE9iCrNJAkA61Hpfo8TLykxRczp2wGZ7BCYNv41A87qcrp141SoXprq/\nILZeltDhR2/POHuB91a1jDu/a/lpLBOVJ1wvi+dh\n-----END RSA PRIVATE KEY-----'
	// 	// }
	// },
	list: {
		 // List-Help: <mailto:admin@example.com?subject=help>
		help: 'unsubscribe@neokarma.com?subject=unsubscribe',
		// List-Unsubscribe: <http://example.com> (Comment)
		unsubscribe: {
			url: 'http://neokarma.com',
			comment: 'Comment'
		},
		// List-Subscribe: <mailto:admin@example.com?subject=subscribe>
		// List-Subscribe: <http://example.com> (Subscribe)
		subscribe: [
			'subscribe@neokarma.com?subject=subscribe',
			{
				url: 'http://neokarma.com',
				comment: 'Subscribe'
			}
		],
		// List-Post: <http://example.com/post>, <mailto:admin@example.com?subject=post> (Post)
		post: [
			[
				'http://neokarma.com/portal/',
				{
					url: 'post@neokarma.com?subject=post',
					comment: 'Post'
				}
			]
		]
	},
	sender: { 
		name: "Neokarma.com",
		email: "noreply@neokarma.com"
	},
};
