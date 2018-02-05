
@Controller("/tickets")
class TicketsController
{
	// Returns all the tickets for the current user ordered by date & state
	@GET("/")
	getTickets(req, res)
	{
		Tickets.find({
			user: req.user._id,
		}).then( tickets => {
			res.json({success: true, tickets: tickets });
		}).catch( error => {
			res.serverError(error);
		});
	}

	@GET("/byStatus/:status")
	getTicketsByStatus(req, res)
	{
		let Status = req.params.status;
		Tickets.find({
			user: req.user._id,
			status: Status,
		}).sort({updated: -1}).then( tickets => {
			res.json({success: true, tickets: tickets });
		}).catch( error => {
			res.serverError(error);
		});
	}

	@GET("/categories")
	getCategories(req, res)
	{
		res.json({success: true, categories: Config.tickets.categories });
	}

	// Returns a single ticket and its messages
	@GET("/getTicket/:ticketId")
	getTicket(req, res)
	{
		let ticketId = req.params.ticketId;
		Tickets.findOne({
			user: req.user._id,
			_id: ticketId,
		}).then( ticket => {
			res.json({success: true, ticket: ticket});
		}).catch( error => {
			res.serverError(error);
		});
	}

	// Initializes a payment
	@POST("/createTicket")
	createTicket(req, res)
	{
		let subject = req.body.subject;
		let category = req.body.category;
		let message = req.body.message;

		if(!subject)
			return res.json({success: false, message: "No subject specified"});
		 
		if(!category)
			return res.json({success: false, message: "No category specified"});


		if(!message || message.length < 10)
			return res.json({success: false, message: "Message too short."});

		Tickets.create({
			user: req.user._id,
			subject: subject,
			category: category,
			status: "Open",
			messages: [{
				user: req.user._id,
				message: message,
				date: Date.now(),
			}],
			created: Date.now(),
			updated: Date.now(),
			notification: false,
		}).then( ticket => {
			res.json({success: true, ticket: ticket});
		}).catch( error => {
			res.serverError(error);
		});
	}

	// Returns a single payment description
	@POST("/replyTicket/:ticketId")
	replyTicket(req, res)
	{
		let ticketId = req.params.ticketId;
		let message = req.body.message;
		
		if(!message || message.length < 10)
			return res.json({success: false, message: "Message too short."});


		Tickets.findOne({
			user: req.user._id,
			_id: ticketId,
		}).then( ticket => {
			ticket.messages.push({
				user: req.user._id,
				message: message,
				date: Date.now(),
			})
			res.json({success: true});
		}).catch( error => {
			res.serverError(error);
		});
	}

	// Opens the ticket status
	@GET("/openTicket/:ticketId")
	openTicket(req, res)
	{
		let ticketId = req.params.ticketId;

		Tickets.update({
			_id: ticketId,
			user: req.user._id,
			status: "Open",
		}).then( ticket => {
			res.json({success: true, message: "Not implemented"});
		}).catch( error => {
			res.serverError(error);
		})
	}

	// Closes the ticket status
	@GET("/closeTicket/:ticketId")
	closeTicket(req, res)
	{
		let ticketId = req.params.ticketId;

		Tickets.update({
			_id: ticketId,
			user: req.user._id,
			status: "Closed",
		}).then( ticket => {
			res.json({success: true, message: "Not implemented"});
		}).catch( error => {
			res.serverError(error);
		})
	}

};