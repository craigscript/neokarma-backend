import mongoose from "mongoose";
let schema = mongoose.Schema({
	id: {
		type: String,
		unique: true,
		index: true,
	},

	post: {
		type: String,
	},
	
	sentiment: Object,
	subreddit: String,
	ups: Number,
	downs: Number,
	score: Number,
	score_change: Number,
	title: String,
	user: String,

	content: String,

	url: String,

	date: Number,

	processed: Boolean,
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});
schema.connection = "reddit";
export default schema;