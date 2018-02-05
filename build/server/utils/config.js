"use strict";

var _freeze = require("babel-runtime/core-js/object/freeze");

var _freeze2 = _interopRequireDefault(_freeze);

var _cointpayments = require("./../config/cointpayments.js");

var _cointpayments2 = _interopRequireDefault(_cointpayments);

var _cors = require("./../config/cors.js");

var _cors2 = _interopRequireDefault(_cors);

var _Database = require("./../config/Database.js");

var _Database2 = _interopRequireDefault(_Database);

var _express = require("./../config/express.js");

var _express2 = _interopRequireDefault(_express);

var _mail = require("./../config/mail.js");

var _mail2 = _interopRequireDefault(_mail);

var _memcache = require("./../config/memcache.js");

var _memcache2 = _interopRequireDefault(_memcache);

var _middlewares = require("./../config/middlewares.js");

var _middlewares2 = _interopRequireDefault(_middlewares);

var _paypal = require("./../config/paypal.js");

var _paypal2 = _interopRequireDefault(_paypal);

var _policies = require("./../config/policies.js");

var _policies2 = _interopRequireDefault(_policies);

var _poloniex = require("./../config/poloniex.js");

var _poloniex2 = _interopRequireDefault(_poloniex);

var _recaptcha = require("./../config/recaptcha.js");

var _recaptcha2 = _interopRequireDefault(_recaptcha);

var _redisSession = require("./../config/redisSession.js");

var _redisSession2 = _interopRequireDefault(_redisSession);

var _site = require("./../config/site.js");

var _site2 = _interopRequireDefault(_site);

var _tickets = require("./../config/tickets.js");

var _tickets2 = _interopRequireDefault(_tickets);

var _user = require("./../config/user.js");

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var configs = {
  cointpayments: _cointpayments2.default,
  cors: _cors2.default,
  Database: _Database2.default,
  express: _express2.default,
  mail: _mail2.default,
  memcache: _memcache2.default,
  middlewares: _middlewares2.default,
  paypal: _paypal2.default,
  policies: _policies2.default,
  poloniex: _poloniex2.default,
  recaptcha: _recaptcha2.default,
  redisSession: _redisSession2.default,
  site: _site2.default,
  tickets: _tickets2.default,
  user: _user2.default
};
(0, _freeze2.default)(configs);

global.Config = configs;