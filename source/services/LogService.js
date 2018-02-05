
@Service
class LogService
{
	static log(logType, logData={})
	{
		Logs.create({
			logType: logType,
			logData: logData
		});
	}
};
