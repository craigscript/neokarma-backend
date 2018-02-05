export class AuthStrategy
{
	authenticate(email, password, done)
	{
		done("not implemented");
	}

	getSessionId(user)
	{
		return null;
	}
};