import mongoose from "mongoose";
let schema = mongoose.Schema({
	
	// List of sources this market is getting information from
	source: {
		type: String,
		required: true,
	},

	market: {
		type: String,
		required: true,
	},

	// Current tracking position of the market
	cursor: {
		type: Date,
	},

},
{
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});

schema.statics.updateCursor = function(source, market, cursor=new Date())
{
	MarketCursors.update({
		source: source,
		market: market,
	}, {
		cursor: cursor,
	}, {upsert: true}).exec();
};

schema.statics.clearCursor = function(source, market)
{
	MarketCursors.update({
		source: source,
		market: market,
	}, {
		cursor: new Date(0),
	}, {upsert: true}).exec();
};

schema.statics.getCursor = function(source, market)
{
	return MarketCursors.findOne({
		source: source,
		market: market
	});
};

schema.statics.getCursors = function(source)
{
	return MarketCursors.find({
		source: source,
	});
};

schema.statics.getOutDated = function(source, interval=5)
{
	return MarketCursors.find({
		source: source,
		cursor: {
			$lt: new Date(Date.now() - (interval * 60 * 1000))
		}
	});
};

schema.connection = "markets";

export default schema;