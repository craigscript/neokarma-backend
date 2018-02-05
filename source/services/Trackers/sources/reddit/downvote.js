export default (params) =>
{
	console.log("Downvote filter is used:", params);

	return [
		{ 
			$match: {
				 "downs": { 
					$gte: params.min,
					$lte: params.max
				 }
			}
		}
	];
};