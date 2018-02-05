@Controller("/portfolio", ["Auth"])
class MarketListController
{
	// Returns the primary list of the user
	@GET("/")
	@GET("/getPrimary")
	getPrimary(req, res)
	{
		Portfolios.findOne({ user: req.user._id }).lean().then( portfolio => {
			return res.json({ success: true, portfolio: portfolio });
		}).catch(error => {
			return res.serverError(error);
		});
	}


	@GET("/getPortfolio/:portfolioId")
	getPortfolio(req, res)
	{
		let portfolioId = req.params.portfolioId;
		Portfolios.findOne({ _id: portfolioId }).lean().then( portfolio => {
			return res.json({ success: true, portfolio: portfolio });
		}).catch(error => {
			return res.serverError(error);
		});
	}

	// Returns wallet history
	@GET("/getPortfolioHistory/:listId/:start/:end/:interval")
	getWalletHistory(req, res)
	{
		return res.error({message: "Not implemented"});
	}

	// Adds a card to the user's list
	@POST("/updatePortfolio/:portfolioId")
	updatePortfolio(req, res)
	{
		let portfolioId = req.params.portfolioId;
		let cards = req.body.cards;
		let holdings = req.body.holdings;
		Portfolios.update({
			_id: portfolioId,
			user: req.user._id,
		}, {
			cards: cards,
			holdings: holdings,
		}).then( result => {
			return res.json({success: true});
		});
	}

		// Adds a card to the user's list
	@POST("/createPortfolio")
	createPortfolio(req, res)
	{
		let cards = req.body.cards;
		console.log("cards:", cards);
		let holdings = req.body.holdings;
		Portfolios.create({
			name: "My Portfolio",
			user: req.user._id,
			cards: cards,
			holdings: holdings,
			wallet: { Total: 0, Change24H: 0, Earned: 0 },
		}).then( portfolio => {
			return res.json({success: true, portfolio: portfolio});
		});
	}
	

};
