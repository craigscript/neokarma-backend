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

var AdminController = (_dec = Controller("/admin/groups"), _dec2 = GET("/list"), _dec3 = ACL(["Admin", "Admin.Users"]), _dec4 = GET("/acls"), _dec5 = ACL(["Admin", "Admin.Users"]), _dec6 = POST("/details"), _dec7 = ACL(["Admin", "Admin.Users"]), _dec8 = POST("/create"), _dec9 = ACL(["Admin", "Admin.Users.Create"]), _dec10 = POST("/update"), _dec11 = ACL(["Admin", "Admin.Users.Update"]), _dec12 = POST("/delete"), _dec13 = ACL(["Admin", "Admin.Users.Delete"]), _dec(_class = (_class2 = function () {
	function AdminController() {
		(0, _classCallCheck3.default)(this, AdminController);
	}

	AdminController.prototype.list = function list(req, res) {
		UserGroup.find().then(function (response) {
			res.json({ success: true, groups: response });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	AdminController.prototype.acls = function acls(req, res) {
		res.json({ success: true, acls: ACL.list });
	};

	AdminController.prototype.details = function details(req, res) {
		var _id = req.body._id;
		if (!_id) return res.json({ success: false, message: "No groupId" });
		UserGroup.findOne({ _id: _id }).then(function (group) {
			res.json({ success: true, group: group });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	AdminController.prototype.create = function create(req, res) {
		var group = req.body.group;
		if (!group) return res.json({ success: false, message: "No group data" });
		UserGroup.create(group).then(function (group) {
			res.json({ success: true, group: group });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	AdminController.prototype.update = function update(req, res) {
		var _id = req.body._id;
		var group = req.body.group;
		UserGroup.update({ _id: _id }, group).then(function (group) {
			res.json({ success: true, group: group });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	AdminController.prototype.delete = function _delete(req, res) {
		var _id = req.body._id;
		UserGroup.remove({ _id: _id }).then(function () {
			res.json({ success: true });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	return AdminController;
}(), (_applyDecoratedDescriptor(_class2.prototype, "list", [_dec2, _dec3], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "list"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "acls", [_dec4, _dec5], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "acls"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "details", [_dec6, _dec7], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "details"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "create", [_dec8, _dec9], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "create"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "update", [_dec10, _dec11], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "update"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "delete", [_dec12, _dec13], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "delete"), _class2.prototype)), _class2)) || _class);
;