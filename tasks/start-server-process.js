var gulp = require("gulp");
var gutil = require('gulp-util');
var runSequence = require('run-sequence');

// Server Process
var child = require('child_process');

// Manage Server Process
let ServerProcess = null;
gulp.task("start-server", function (done)
{
	if(ServerProcess != null)
	{
		gutil.log(gutil.colors.green("[WebServer]"), "Stopping", gutil.colors.magenta('Web Server Process'));
		ServerProcess.kill("SIGKILL");
	}
	gutil.log(gutil.colors.green("[WebServer]"), "Starting", gutil.colors.magenta('Web Server Process'));
	ServerProcess = child.spawn("node", ['./server/Boot.js'], {cwd: "./build/", stdio: [process.stdin, process.stdout, process.stderr, 'pipe']});
	done();
});