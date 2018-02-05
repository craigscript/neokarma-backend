import mongoose from "mongoose";
let schema = mongoose.Schema({
	id: {
		type: String,
		unique: true,
	},
	
	subreddit: {
		type: String,
		lowercase: true,
		index: true,
	},

	sentiment: Object,
	user: {
		type: String,
		lowercase: true,
	},
	title: {
		type: String,
	},
	content: {
		type: String,
	},
	url: {
		type: String,
	},
	date: {
		type: Number,
		index: true,
	},
	ups: {
		type: Number,
	},
	downs: {
		type: Number,
	},
	score: {
		type: Number,
	},
	score_change: {
		type: Number,
	},
	num_comments: {
		type: Number,
	},
	
}, {
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

schema.connection = "reddit";
export default schema;