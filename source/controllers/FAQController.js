
@Controller("/faq")
class FAQController
{
	// Returns all the tickets for the current user ordered by date & state
	@GET("/")
	getFaq(req, res)
	{
		res.json({
			success: true,
			qa: [{
				question: "How are you?",
				answer: "I am fine, so lets go with lorem impsum!",
			},
			{
				question: "How are you?",
				answer: "I am fine, so lets go with lorem impsum!",
			},
			{
				question: "How are you?",
				answer: "I am fine, so lets go with lorem impsum!",
			}]
		});
	}
};