export default (params) =>
{
	console.log("Upvote filter is used:", params);

	return [
		{ 
			$match: {
				 "ups": { 
					$gte: params.min,
					$lte: params.max
				 }
			}
		}
	];
};