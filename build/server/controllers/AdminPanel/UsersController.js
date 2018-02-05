"use strict";

var _getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _class, _desc, _value, _class2;

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

var AdminController = (_dec = Controller("/admin/users"), _dec2 = POST("/search"), _dec3 = ACL(["Admin", "Admin.Users"]), _dec4 = POST("/details"), _dec5 = ACL(["Admin", "Admin.Users"]), _dec6 = POST("/create"), _dec7 = ACL(["Admin", "Admin.Users.Create"]), _dec8 = POST("/update"), _dec9 = ACL(["Admin", "Admin.Users.Update"]), _dec10 = POST("/updatepassword"), _dec11 = ACL(["Admin", "Admin.Users.Update"]), _dec12 = POST("/delete"), _dec13 = ACL(["Admin", "Admin.Users.Delete"]), _dec(_class = (_class2 = function () {
	function AdminController() {
		(0, _classCallCheck3.default)(this, AdminController);
	}

	AdminController.prototype.search = function search(req, res) {
		var searchTerm = req.body.search;
		User.find({

			$or: [
			// { _id: { $regex: searchTerm, $options: "i" } },
			{ email: { $regex: searchTerm, $options: "i" } }, { firstname: { $regex: searchTerm, $options: "i" } }, { lastname: { $regex: searchTerm, $options: "i" } }, { phone: { $regex: searchTerm, $options: "i" } }, { address: { $regex: searchTerm, $options: "i" } }]

		}).populate("group").then(function (users) {

			res.json({ success: true, users: users });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	AdminController.prototype.details = function details(req, res) {
		var _id = req.body._id;
		if (!_id) return res.json({ success: false, message: "No such user" });
		User.findOne({ _id: _id }).then(function (user) {
			res.json({ success: true, user: user });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	AdminController.prototype.create = function create(req, res) {
		var user = req.body.user;
		if (!user) return res.json({ success: false, message: "No user data" });
		var passwordText = (0 | Math.random() * 9e6).toString(36);
		user.password = User.createPassword(passwordText);
		console.log("Creating user:", user);
		UserGroup.findOne({ _id: user.group }).then(function (group) {

			if (!group) return res.json({ success: false, message: "No group" });

			var mail = new Email([user.email], { name: "FACT", email: "noreply@fact.com" }, "FACT - Welcome to fact");
			mail.setTemplate("emails/welcome_newuser", { url: req.protocol + '://' + req.get('host'), email: user.email, password: passwordText, groupName: group.name });
			mail.send(function () {
				// Mail sent!
			});

			User.create(user).then(function (user) {
				res.json({ success: true, user: user });
			}).catch(function (error) {
				res.serverError(error);
			});
		});
	};

	AdminController.prototype.update = function update(req, res) {
		var _id = req.body._id;
		var user = req.body.user;
		delete user.password;

		User.update({ _id: _id }, user).then(function (user) {
			res.json({ success: true, result: user });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	AdminController.prototype.updatepassword = function updatepassword(req, res) {
		var _id = req.body._id;
		var passwordText = req.body.password;
		User.findOne({ _id: _id }).then(function (user) {

			if (!user) return res.json({ success: false, message: "No such user" });

			User.update({ _id: _id }, { password: User.createPassword(passwordText) }).then(function (result) {

				var mail = new Email([user.email], { name: "FACT", email: "noreply@fact.com" }, "FACT - Your new password");
				mail.setTemplate("emails/password_changed", { url: req.protocol + '://' + req.get('host'), password: passwordText });
				mail.send(function () {
					// Mail sent!
				});

				res.json({ success: true });
			}).catch(function (error) {
				res.serverError(error);
			});
		});
	};

	AdminController.prototype.delete = function _delete(req, res) {
		var _id = req.body._id;
		User.destroy({ _id: _id }).then(function () {
			res.json({ success: true });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	return AdminController;
}(), (_applyDecoratedDescriptor(_class2.prototype, "search", [_dec2, _dec3], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "search"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "details", [_dec4, _dec5], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "details"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "create", [_dec6, _dec7], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "create"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "update", [_dec8, _dec9], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "update"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "updatepassword", [_dec10, _dec11], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "updatepassword"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "delete", [_dec12, _dec13], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "delete"), _class2.prototype)), _class2)) || _class);
;