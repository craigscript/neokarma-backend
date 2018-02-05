export default (params) =>
{
	let filters = [];
	for(let word of params.words)
	{
		filters.push({
			$match: {
				$or: [
					{
						$gte: [
							{
								$indexOfBytes: [ "$content", word ]
							}, 0
						]
					},
					{
						$gte: [
							{
								$indexOfBytes: [ "$title", word ]
							}, 0
						]
					}
				]
			}
		});
	
	}
	return filters;
};