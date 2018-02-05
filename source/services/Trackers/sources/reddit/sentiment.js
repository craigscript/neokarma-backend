export default (params) =>
{
	console.log("Sentiment filter is used:", params);

	return [
		{ 
			$match: {
				 "sentiment.score": { 
					$gte: params.min,
					$lte: params.max
				 }
			}
		}
	];
};