export default (params) =>
{
	console.log("Sentiment filter is used:", params);

	return [
		{ 
			$match: {
				 "num_comments": { 
					$gte: params.min,
					$lte: params.max
				 }
			}
		}
	];
};