export default (params) =>
{
	console.log("Score filter is used:", params);

	return [
		{ 
			$match: {
				 "score": { 
					$gte: params.min,
					$lte: params.max
				 }
			}
		}
	];
};