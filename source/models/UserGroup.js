import mongoose from "mongoose";

let schema = mongoose.Schema({
	name: {
		type: String,
		unique: true,
		required: true,
	},
	
	acl: [],
	
	groupType: {
		type: String,
		enum: ['user', 'support', 'customer', 'admin', 'developer', 'guest'],
		required: true,
	},

	allowRegistration: {
		type: Boolean,
		default: false,
	},
	
	comment: {
		type: String,
	},	
}, {
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

export default schema;