'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Recaptcha = require('recaptcha2');

var RecaptchaService = Service(_class = function () {
	function RecaptchaService() {
		(0, _classCallCheck3.default)(this, RecaptchaService);
	}

	RecaptchaService.getCaptcha = function getCaptcha() {
		//var captcha = new Recaptcha(Config.recaptcha.publicKey, Config.recaptcha.privateKey);
		return {
			required: Config.recaptcha.required,
			publicKey: Config.recaptcha.publicKey
		};
	};

	RecaptchaService.verify = function verify(connection, captchaKey) {
		// If no recaptcha required return with resolve.
		if (!Config.recaptcha.required) return _promise2.default.resolve({ success: true });

		var recaptcha = new Recaptcha({
			siteKey: Config.recaptcha.publicKey,
			secretKey: Config.recaptcha.privateKey
		});

		return new _promise2.default(function (resolve, reject) {
			recaptcha.validate(captchaKey).then(function (success) {
				return resolve({ success: true });
			}).catch(function (errorCodes) {
				return reject({ success: false, code: errorCodes });
			});
		});
	};

	return RecaptchaService;
}()) || _class;

;