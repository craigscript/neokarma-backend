'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nodemailer = require('nodemailer');

var ejs = require('ejs');
var fs = require("fs");
var path = require('path');
var appDir = path.dirname(require.main.filename);
var mailTransporter = nodemailer.createTransport(Config.mail.transporter);

//console.log("[EMAIL] Transport ready:", mailTransporter);

var Email = Service(_class = function () {
	function Email(to, subject) {
		(0, _classCallCheck3.default)(this, Email);
		this.mailOptions = {};

		var from = Config.mail.sender;

		this.mailOptions = {
			list: Config.mail.list,
			from: '"' + from.name + '" <' + from.email + '>', // sender address
			to: to.join(", "), // list of receivers
			subject: subject // Subject line
		};
	}

	Email.prototype.setContent = function setContent(content) {
		this.mailOptions.text = content;
	};

	Email.prototype.setTemplate = function setTemplate(template, args) {
		var str = fs.readFileSync(appDir + '/../views/' + template + '.ejs', 'utf8');
		this.mailOptions.html = ejs.render(str, args);
	};

	Email.prototype.send = function send(done) {
		console.log("Sending mail to:", this.mailOptions.to);
		mailTransporter.sendMail(this.mailOptions, function (error, response) {

			if (error) {
				done(null, error);
				return console.log("[Email Error]", error);
			}
			//console.log('Message', response, "sent:", response);
			done(response);
		});
	};

	return Email;
}()) || _class;

;