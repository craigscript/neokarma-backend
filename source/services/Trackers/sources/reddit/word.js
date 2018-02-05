export default (params) =>
{
	console.log("Word filter is used:", params);
	let filters = [];
	let words = params.words.split(",");
	console.log("Word filter words:", words);
	let contains = [];
	for(let word of words)
	{
		// All of them needs to exists
		if(params.mode == "Match")
		{
			filters.push( { $match: { content: { $regex: word, $options: 'i' } } });
		}

		// All of them needs to exclude
		if(params.mode == "Dont Match")
		{
			filters.push( { $match: { content: { $not: word, $options: 'i' } } });	
		}

		// At least one needs to exists
		if(params.mode == "Contain")
		{
			contains.push( { content: { $regex: word, $options: 'i' } });
		}

		// At least one needs to exclude
		if(params.mode == "Do not Contain")
		{
			contains.push( { content: { $not: word, $options: 'i' } } );	
		}
		

	}

	if(params.mode == "Contain")
	{
		filters.push({
			$match: {
				$or: contains
			}
		});
	}

	return filters;
};