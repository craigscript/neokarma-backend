@Service
class SubscriptionService
{
	static createSubscription(userId, plan)
	{
		console.log("plan", plan);
		let subscription = plan.subscription;
		console.log("Changing user subscription to:", subscription);
		return User.update({
			_id: userId,
			
		}, {
			group: subscription.group,
			subscription: {
				name: plan.name,
				expires: Date.now() + subscription.period,
				status: "Active",
			}
		}).exec();
		
	}
};
