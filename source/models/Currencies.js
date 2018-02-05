import mongoose from "mongoose";

let schema = mongoose.Schema({
	
	indexes: {
		type: Object,
		required: true,
	},

	// List of markets used to calculate the price of this currency
	exchanges: {
		type: Object,
		required: true,
	},

	// Unique id of the currency
	currency: {
		type: String,
		required: true,
		index: true,
		unique: true,
	},

	// Pretty Name of the currency
	name: {
		type: String,
		required: true,
	},

	// Display Icon and symbol for the currency
	icon: {
		type: String,
	},

	// Display Icon and symbol for the currency
	symbol: {
		type: String,
	},

	// Currency display number of decimals
	decimals: {
		type: Number,
		default: 2,
	},

	// Popularity increases by favorited cards ()
	popularity: {
		type: Number,
		default: 0,
	},

	// Ranking number of the currency based on various stats
	rank: {
		type: Number,
		default: -1,
	},

	// Containing the latest price information
	ticker: {
		type: Object,
		default: {
			Price: 0,
		},
	},

	// Disable the tracking of this currency?
	enabled: {
		type: Boolean,
		default: true,
	},

	// Make the currency visible or hidden?
	visible: {
		type: Boolean,
		default: true,
	},
},
{
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});
schema.connection = "markets";

export default schema;