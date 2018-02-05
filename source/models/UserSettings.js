import mongoose from "mongoose";
let schema = mongoose.Schema({

	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	
	key: {
		type: String,
		required: true,
		index: true,
	},

	value: {
		type: Object,
		required: true,
	}
},
{
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});


schema.index({userId: 1, key: 1}, {unique: true});

export default schema;