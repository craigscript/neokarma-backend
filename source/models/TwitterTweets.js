import mongoose from "mongoose";
let schema = mongoose.Schema({
	
	topics: {
		type: [String],
		index: true,
	},

	tweetId: {
		type: String,
		unique: true,
	},

	user: {
		type: String,
		required: true,
	},

	origin: {
		type: Object,
	},

	sentiment: {
		type: Object,
		required: true,
	},

	tweet: {
		type: String,
		required: true,
	},

	url: {
		type: String,
		required: true,
	},

	date: {
		type: Number,
		required: true,
	},
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

schema.connection = "twitter";
export default schema;