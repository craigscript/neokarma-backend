import mongoose from "mongoose";

let schema = mongoose.Schema({

	paymentToken: {
		type: String,
		required: true,
		select: false,
		unique: true,
	},

	// User Credentials
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	
	name: {
		type: String,
		required: true,
	},

	price: {
		type: Number,
		required: true,
	},

	currency: {
		type: String,
		required: true,
	},

	status: {
		type: String,
		enum: ["Unpaid", "InProgress", "Paid", "Pending", "Failed"],
	},

	gateway: {
		type: String,
		required: true,
	},

	transaction: {
		type: Object,
	},

	// Subscription plan the user received when the payment completed
	plan: {
		type: Object,
		required: true,
	},

	created: {
		type: Number,
		required: true,
		default: Date.now,
	},

	paid: {
		type: Number,
		required: true,
		default: -1,
	},

	expires: {
		type: Number,
		required: true,
		default: Date.now,
	},
}, {
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

schema.methods.toJSON = function()
{
	var obj = this.toObject()
	delete obj.paymentToken;
	return obj;
};

export default schema;