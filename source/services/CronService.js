const nodemailer = require('nodemailer');

var ejs = require('ejs');
var fs = require("fs");


var mailTransporter = nodemailer.createTransport(Config.mail.transporter);

@Service
class Cron
{
	static tasks = [];
	static taskIdCounter = 0;
	static delay(callback, time)
	{
		var task = {
			taskFn: callback,
			delay: true,
			options: {timeleft: time},
		};
		Cron.tasks.push(task);
	}

	static always(callback)
	{
		var task = {
			taskFn: callback,
			always: true
		};
		Cron.tasks.push(task);
	}

	static dequeue(taskId)
	{

	}

	static tick()
	{
		for(var task of Cron.tasks)
		{
			var options = task.options;
			if(task.delay)
			{

				options.timeleft -= 1;

				if(!options.timeleft)
				{
					console.log("[CRON] Executing tasks");
					task.taskFn();
					Cron.tasks.splice( task, 1 );
					continue;
				}
			}

			if(task.always)
			{
				task.taskFn();
				continue;
			}
		
		}
	}
};


// Tick cron
setInterval(function()
{
	Cron.tick();
}, 1000);