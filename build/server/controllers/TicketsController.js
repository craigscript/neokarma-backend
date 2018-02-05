"use strict";

var _getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _desc, _value, _class2;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
	var desc = {};
	Object['ke' + 'ys'](descriptor).forEach(function (key) {
		desc[key] = descriptor[key];
	});
	desc.enumerable = !!desc.enumerable;
	desc.configurable = !!desc.configurable;

	if ('value' in desc || desc.initializer) {
		desc.writable = true;
	}

	desc = decorators.slice().reverse().reduce(function (desc, decorator) {
		return decorator(target, property, desc) || desc;
	}, desc);

	if (context && desc.initializer !== void 0) {
		desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
		desc.initializer = undefined;
	}

	if (desc.initializer === void 0) {
		Object['define' + 'Property'](target, property, desc);
		desc = null;
	}

	return desc;
}

var TicketsController = (_dec = Controller("/tickets"), _dec2 = GET("/"), _dec3 = GET("/byStatus/:status"), _dec4 = GET("/categories"), _dec5 = GET("/getTicket/:ticketId"), _dec6 = POST("/createTicket"), _dec7 = POST("/replyTicket/:ticketId"), _dec8 = GET("/openTicket/:ticketId"), _dec9 = GET("/closeTicket/:ticketId"), _dec(_class = (_class2 = function () {
	function TicketsController() {
		(0, _classCallCheck3.default)(this, TicketsController);
	}

	TicketsController.prototype.getTickets = function getTickets(req, res) {
		Tickets.find({
			user: req.user._id
		}).then(function (tickets) {
			res.json({ success: true, tickets: tickets });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	TicketsController.prototype.getTicketsByStatus = function getTicketsByStatus(req, res) {
		var Status = req.params.status;
		Tickets.find({
			user: req.user._id,
			status: Status
		}).sort({ updated: -1 }).then(function (tickets) {
			res.json({ success: true, tickets: tickets });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	TicketsController.prototype.getCategories = function getCategories(req, res) {
		res.json({ success: true, categories: Config.tickets.categories });
	};

	// Returns a single ticket and its messages


	TicketsController.prototype.getTicket = function getTicket(req, res) {
		var ticketId = req.params.ticketId;
		Tickets.findOne({
			user: req.user._id,
			_id: ticketId
		}).then(function (ticket) {
			res.json({ success: true, ticket: ticket });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	// Initializes a payment


	TicketsController.prototype.createTicket = function createTicket(req, res) {
		var subject = req.body.subject;
		var category = req.body.category;
		var message = req.body.message;

		if (!subject) return res.json({ success: false, message: "No subject specified" });

		if (!category) return res.json({ success: false, message: "No category specified" });

		if (!message || message.length < 10) return res.json({ success: false, message: "Message too short." });

		Tickets.create({
			user: req.user._id,
			subject: subject,
			category: category,
			status: "Open",
			messages: [{
				user: req.user._id,
				message: message,
				date: Date.now()
			}],
			created: Date.now(),
			updated: Date.now(),
			notification: false
		}).then(function (ticket) {
			res.json({ success: true, ticket: ticket });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	// Returns a single payment description


	TicketsController.prototype.replyTicket = function replyTicket(req, res) {
		var ticketId = req.params.ticketId;
		var message = req.body.message;

		if (!message || message.length < 10) return res.json({ success: false, message: "Message too short." });

		Tickets.findOne({
			user: req.user._id,
			_id: ticketId
		}).then(function (ticket) {
			ticket.messages.push({
				user: req.user._id,
				message: message,
				date: Date.now()
			});
			res.json({ success: true });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	// Opens the ticket status


	TicketsController.prototype.openTicket = function openTicket(req, res) {
		var ticketId = req.params.ticketId;

		Tickets.update({
			_id: ticketId,
			user: req.user._id,
			status: "Open"
		}).then(function (ticket) {
			res.json({ success: true, message: "Not implemented" });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	// Closes the ticket status


	TicketsController.prototype.closeTicket = function closeTicket(req, res) {
		var ticketId = req.params.ticketId;

		Tickets.update({
			_id: ticketId,
			user: req.user._id,
			status: "Closed"
		}).then(function (ticket) {
			res.json({ success: true, message: "Not implemented" });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	return TicketsController;
}(), (_applyDecoratedDescriptor(_class2.prototype, "getTickets", [_dec2], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getTickets"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getTicketsByStatus", [_dec3], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getTicketsByStatus"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getCategories", [_dec4], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getCategories"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getTicket", [_dec5], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getTicket"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "createTicket", [_dec6], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "createTicket"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "replyTicket", [_dec7], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "replyTicket"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "openTicket", [_dec8], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "openTicket"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "closeTicket", [_dec9], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "closeTicket"), _class2.prototype)), _class2)) || _class);
;