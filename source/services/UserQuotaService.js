
@Service
class UserQuota
{
	static validate(user, entryType, amount, max=0)
	{
		let quota = UserQuota.getQuota(user, entryType);
		if(max <= 0)
		{
			max = quota.max;
		}
		return Math.max(quota.used + amount, 0) <= max;
	}

	static validateCustom(user, entryType, amount, max=0)
	{
		let quota = UserQuota.getQuota(user, entryType);
		if(max <= 0)
		{
			max = quota.max;
		}
		return Math.max(amount, 0) <= max;
	}

	static getQuota(user, entryType)
	{
		if(!user.quotas)
			return { used: 0, max: 0, name: entryType};
		
		let quota = user.quotas.find(( item ) => {
			if(item.name == entryType)
			{
				return item;
			}
		});
		if(!quota)
			return { used: 0, max: 0, name: entryType};
		return quota;
	}

	static update(user, entryType, amount)
	{
		let quota = UserQuota.getQuota(user, entryType);
		console.log("Quota:", quota);
		if(quota.used + amount <= quota.max)
		{
			quota.used = Math.max(quota.used + amount, 0);
			console.log("user quotas:", user.quotas);
			
			UserQuota.saveQuotas(user);
			return true;
		}
		return false;
		
	}

	static setQuota(user, entryType, used, max)
	{
		// If no quotas for the user generate it
		if(!user.quotas)
		{
			return UserQuota.generateQuota(user, entryType, used, max);
		}

		// Find quota entry
		let quota = user.quotas.find(( item ) => {
			if(item.name == entryType)
			{
				return item;
			}
		});
		
		if(!quota)
		{
			return UserQuota.generateQuota(user, entryType, used, max);
		}
		
		quota.used = used;
		quota.max = max;

		// Save		
		UserQuota.saveQuotas(user);
		return true;
	}

	static generateQuota(user, entryType, used, max)
	{
		let quota = { used: used, max: max, name: entryType};
		user.quotas.push(quota);
		UserQuota.saveQuotas(user);
		return true;
	}

	static saveQuotas(user)
	{
		User.update({
			_id: user._id
		}, {
			quotas: user.quotas,
		}).exec();
	}
};
