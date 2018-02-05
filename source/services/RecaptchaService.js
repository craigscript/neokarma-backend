var Recaptcha = require('recaptcha2');

@Service
class RecaptchaService
{
	static getCaptcha()
	{
		//var captcha = new Recaptcha(Config.recaptcha.publicKey, Config.recaptcha.privateKey);
		return {
			required: Config.recaptcha.required,
			publicKey: Config.recaptcha.publicKey
		};
	}

	static verify(connection, captchaKey)
	{
		// If no recaptcha required return with resolve.
		if(!Config.recaptcha.required)
			return Promise.resolve({ success: true });

	
		var recaptcha = new Recaptcha({
			siteKey: Config.recaptcha.publicKey,
			secretKey: Config.recaptcha.privateKey
		});
		
		return new Promise((resolve, reject) => {
			recaptcha.validate(captchaKey).then( success =>{
				return resolve({success: true});
			}).catch( errorCodes => {
				return reject({success: false, code: errorCodes});
			});
		});
	}
};
