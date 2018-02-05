import mongoose from "mongoose";
import bcrypt from "bcrypt-nodejs";

let schema = mongoose.Schema({

	// User Credentials
	email: {
		type: String,
		unique: true,
		required: true,
	},

	// Username generated from (Peronal Name, Unique!)
	username: {
		type: String,
		required: true,
	},

	password: {
		type: String,
		required: true,
		hide: true,
	},

	group: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'UserGroup',
		required: true,
	},

	// User details
	personal: {
		// Name of the user (FirstName + LastName)
		name: {
			type: String,
			default: "",
		},
		phone: {
			type: String,
			default: "",
		},
		address: {
			type: String,
			default: "",
		},
	},

	// Tells if the email is verified or not.
	emailVerified: {
		type: Boolean,
		required: true,
		default: false,
	},

	recoveryKey: {
		type: String,
		default: null,
	},

	// Account registration date
	registered: {
		type: Number,
		default: Date.now,
	},

	// Geological location & Address
	geo: {
		type: Object,
	},

	quotas: [],
	subscription: {
		type: Object,
		default: null,
	},
	
}, {
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

schema.methods.validatePassword = function(password)
{
	return bcrypt.compareSync(password, this.password);
};

schema.statics.createPassword = function(password)
{
	return bcrypt.hashSync(password);
};

export default schema;