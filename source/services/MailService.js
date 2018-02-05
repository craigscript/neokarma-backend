const nodemailer = require('nodemailer');

var ejs = require('ejs');
var fs = require("fs");
var path = require('path');
var appDir = path.dirname(require.main.filename);
var mailTransporter = nodemailer.createTransport(Config.mail.transporter);

//console.log("[EMAIL] Transport ready:", mailTransporter);
@Service
class Email
{
	mailOptions = {}

	constructor(to, subject)
	{
		let from = Config.mail.sender;

		this.mailOptions = {
			list: Config.mail.list,
		    from: '"' + from.name + '" <' + from.email + '>', // sender address
		    to: to.join(", "), // list of receivers
		    subject: subject, // Subject line
		};
	}

	setContent(content)
	{
		this.mailOptions.text = content;
	}

	setTemplate(template, args)
	{
		var str = fs.readFileSync(appDir + '/../views/'+template+'.ejs', 'utf8'); 
		this.mailOptions.html = ejs.render(str, args);
	}
	
	send(done)
	{
		console.log("Sending mail to:", this.mailOptions.to);
		mailTransporter.sendMail(this.mailOptions, (error, response) => {
			
			if (error)
			{
				done(null, error);
		        return console.log("[Email Error]", error);
		    }
		    //console.log('Message', response, "sent:", response);
			done(response);
		    
		});
	}

};