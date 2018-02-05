'use strict';

exports.__esModule = true;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = _mongoose2.default.Schema({

	// Users requiring the tracking
	user: {
		type: _mongoose2.default.Schema.Types.ObjectId,
		ref: 'User'
	},

	// Name of the notification tracker
	name: {
		type: String
	},

	// Current status of the notification tracker
	status: {
		type: String,
		enum: ['Active', 'Inactive'],
		required: true
	},

	// Rules determine wether trigger this notification or not
	rules: [],

	// Storage used to cache notifications
	ruleStorage: Object,

	// Devices to send notifications to
	targets: [],

	// Options defining the trigger interval, time range etc.
	triggerOptions: {

		interval: {
			type: String,
			enum: ['Instant', 'Hourly', 'Daily', 'Weekly']
		},

		// Days of weeks listed in array 0-6 where: Sunday is 0, Monday is 1, and so on.
		days: [],

		// Hours of day from 0 to 23
		hours: [],
		timezone: {
			type: Number,
			default: 0
		}
	},

	// Tells wether this notification has been scheduled to trigger
	triggerScheduled: {
		type: Boolean,
		default: false
	},

	lastTriggered: Number,

	// Time cached to check this tracker again in 5 minutes.
	lastUpdated: {
		type: Number,
		default: Date.now,
		index: true
	}

}, {
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

exports.default = schema;